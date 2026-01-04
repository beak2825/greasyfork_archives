// ==UserScript==
// @name         微办公工时申报展开
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  微办公工时申报列表添加申报周期展示!
// @author       wlzzld
// @match        https://www.weibangong.com/index.html
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/429600/%E5%BE%AE%E5%8A%9E%E5%85%AC%E5%B7%A5%E6%97%B6%E7%94%B3%E6%8A%A5%E5%B1%95%E5%BC%80.user.js
// @updateURL https://update.greasyfork.org/scripts/429600/%E5%BE%AE%E5%8A%9E%E5%85%AC%E5%B7%A5%E6%97%B6%E7%94%B3%E6%8A%A5%E5%B1%95%E5%BC%80.meta.js
// ==/UserScript==

(function() {
    'use strict';
//项目工时申报
    var _html="";
    _html+="var _total=0;"
    _html+="var _complete=0;"
    _html+="function chick(){";
    _html+="    $('.approval-list-header').html('全部工时申报数据开始查询，请稍等......');";
    _html+="    _total=0;"
    _html+="    _complete=0;"
    _html+="    $(\".approval-list-content\").html(\"\");";
    _html+="    $.ajax({";
    _html+="        type: 'GET',";
    _html+="        url: \"https://www.weibangong.com/api/1-593a4b1ce4b096c2aff40125/outbox/uncomplete?offset=0&limit=100&noCache=1609210250408\",";
    _html+="        async: true,";
    _html+="        dataTypeString:'json',";
    _html+="        success: function(msg){";
    _html+="            console.log(msg);";
    _html+="            _total += msg.items.length;";
    _html+="            $.each( msg.items, function(i, item){";
    _html+="                getInfo(item.id,'uncomplete');";
    _html+="            });";
    _html+="        }";
    _html+="    });";
    _html+="    $.ajax({";
    _html+="        type: 'GET',";
    _html+="        url: \"https://www.weibangong.com/api/1-593a4b1ce4b096c2aff40125/outbox/complete?offset=0&limit=100&noCache=1608883512501\",";
    _html+="        dataTypeString:'json',";
    _html+="        async: true,";
    _html+="        success: function(msg){";
    _html+="            console.log(msg);";
    _html+="            _total += msg.items.length;";
    _html+="            $.each( msg.items, function(i, item){";
    _html+="                getInfo(item.id,'complete');";
    _html+="            });";
    _html+="        }";
    _html+="    });";
    _html+="}";
    _html+="function getInfo(id,type){";
    _html+="    $.ajax({";
    _html+="        type: 'GET',";
    _html+="        url: 'https://www.weibangong.com/api/1-593a4b1ce4b096c2aff40125/'+id+'?noCache=1608965824112',";
    _html+="        async: true,";
    _html+="        dataTypeString:'json',";
    _html+="        success: function(msg){";
    _html+="            var startTime=formatTime(msg.startTime);";
    _html+="            var lastUpdateTime=formatTime(msg.lastUpdateTime);";
    _html+="            var _item_html='';";
    _html+="            if(type=='complete'){";
    _html+="                _item_html+='<div class=\"approval-item ng-scope lei\" style=\"height: 230px;\" id=\"'+msg.categories[0].children[0].value.items[0].end+'\">';";
    _html+="                _item_html+='    <div class=\"approval-item-content\" style=\"height: 185px;\">';";
    _html+="                _item_html+='        <img class=\"avatar img-circle ng-isolate-scope\" wbg-avatar=\"'+msg.ownerInfo.avatar+'\" data-is-mini=\"1\" src=\"'+msg.ownerInfo.avatar+'-mini\">';";
    _html+="                _item_html+='            <div class=\"aic-title\">';";
    _html+="                _item_html+='                <span class=\"aic-title-name ng-binding\">'+msg.ownerInfo.fullname+'</span>';";
    _html+="                _item_html+='<span class=\"aic-title-time c-999 ng-binding\">'+startTime+'&nbsp;&nbsp;提交了</span>';";
    _html+="                _item_html+='</div>';";
    _html+="                _item_html+='<div class=\"aic-department ng-scope\" ng-if=\"item.persistOwner\">';";
    _html+="                _item_html+='    <span class=\"aic-department-dp c-999 ng-binding\" ng-bind=\"item.ownerInfo.allDepartmentIds\" title=\"'+msg.persistOwner.directDepartmentStr+'\">'+msg.persistOwner.directDepartmentStr+'</span>';";
    _html+="                _item_html+='<span class=\"aic-department-sn c-999 ng-binding\" ng-bind=\"item.ownerInfo.sn\" title=\"\" style=\"margin-left: 4px;\"></span>';";
    _html+="                _item_html+='</div>';";
    _html+="                _item_html+='<div class=\"aic-content ng-binding\" style=\"height:50px;margin-bottom: 10px;\" title=\"'+msg.meta.title+'\">'+msg.meta.title+'<br/>开始日期：'+formatTimeWithOutHour(parseInt(msg.categories[0].children[0].value.items[0].start))+'<br/>结束日期：'+formatTimeWithOutHour(parseInt(msg.categories[0].children[0].value.items[0].end))+'</div>';";
    _html+="                _item_html+='<div class=\"aic-content ng-binding\" ng-bind-html=\"item.meta.brief\" style=\"margin-bottom: 10px;\">'+msg.meta.brief+'</div>';";
    _html+="                _item_html+='<div class=\"aic-status\">';";
    _html+="                _item_html+='    <i class=\"aic-status-line\" style=\"height: 100px;\"></i>';";
    _html+="                _item_html+='<i ng-if=\"!item.isBlocked\" class=\"apl-icon apl-st-4\" style=\"top: 150px;\"></i>';";
    _html+="                _item_html+='<span class=\"ng-binding\">已通过</span>';";
    _html+="                _item_html+='<span class=\"c-999 f14 ng-binding ng-scope\" ng-if=\"item.status>=4\">'+lastUpdateTime+'</span>';";
    _html+="                _item_html+='</div>';";
    _html+="                _item_html+='</div>';";
    _html+="                _item_html+='<div class=\"approval-item-footer\">';";
    _html+="                _item_html+='    <span class=\"c-999 ng-binding\">No.'+msg.number+'</span>';";
    _html+="                _item_html+='<div class=\"aif-op ng-scope\">';";
    _html+="                _item_html+='    </div>';";
    _html+="                _item_html+='</div>';";
    _html+="                _item_html+='</div>';";
    _html+="            }else{";
    _html+="                _item_html+='<div class=\"approval-item ng-scope lei\" style=\"height: 230px;\" id=\"'+msg.categories[0].children[0].value.items[0].end+'\">';";
    _html+="                _item_html+='    <div class=\"approval-item-content\" style=\"height: 185px;\">';";
    _html+="                _item_html+='        <img class=\"avatar img-circle ng-isolate-scope\" wbg-avatar=\"'+msg.ownerInfo.avatar+'\" data-is-mini=\"1\" src=\"'+msg.ownerInfo.avatar+'-mini\">';";
    _html+="                _item_html+='        <div class=\"aic-title\">';";
    _html+="                _item_html+='            <span class=\"aic-title-name ng-binding\">'+msg.ownerInfo.fullname+'</span>';";
    _html+="                _item_html+='            <span class=\"aic-title-time c-999 ng-binding\">'+startTime+'&nbsp;&nbsp;提交了</span>';";
    _html+="                _item_html+='        </div>';";
    _html+="                _item_html+='        <div class=\"aic-department ng-scope\" >';";
    _html+="                _item_html+='            <span class=\"aic-department-dp c-999 ng-binding\" title=\"'+msg.persistOwner.directDepartmentStr+'\">'+msg.persistOwner.directDepartmentStr+'</span>';";
    _html+="                _item_html+='            <span class=\"aic-department-sn c-999 ng-binding\" title=\"\" style=\"margin-left: 4px;\"></span>';";
    _html+="                _item_html+='        </div>';";
    _html+="                _item_html+='        <div class=\"aic-content ng-binding\" style=\"height:50px;margin-bottom: 10px;\" title=\"'+msg.meta.title+'\">'+msg.meta.title+'<br/>开始日期：'+formatTimeWithOutHour(parseInt(msg.categories[0].children[0].value.items[0].start))+'<br/>结束日期：'+formatTimeWithOutHour(parseInt(msg.categories[0].children[0].value.items[0].end))+'</div>';";
    _html+="                _item_html+='        <div class=\"aic-content ng-binding\" >'+msg.meta.brief+'</div>';";
    _html+="                _item_html+='        <div class=\"aic-status\">';";
    _html+="                _item_html+='            <i class=\"aic-status-line\" style=\"height: 100px;\"></i>';";
    _html+="                _item_html+='            <i class=\"apl-icon apl-st-2\" style=\"top: 150px;\"></i>';";
    _html+="                _item_html+='            <span class=\"ng-binding\">审批中</span>';";
    _html+="                _item_html+='            <span class=\"apl-approver c-999 f12 ng-scope\">';";
    _html+="                _item_html+='                <i class=\"apl-icon-approver ng-scope\"></i>';";
    _html+="                _item_html+='                <span class=\"ng-scope\">';";
    _html+="                _item_html+='                    <span class=\"ng-binding\">'+msg.approverInfo.fullname+'</span>';";
    _html+="                _item_html+='                </span>';";
    _html+="                _item_html+='            </span>';";
    _html+="                _item_html+='        </div>';";
    _html+="                _item_html+='    </div>';";
    _html+="                _item_html+='    <div class=\"approval-item-footer\">';";
    _html+="                _item_html+='        <span class=\"c-999 ng-binding\">No.'+msg.number+'</span>';";
    _html+="                _item_html+='    </div>';";
    _html+="                _item_html+='</div>';";
    _html+="            }";
    _html+="              $('.approval-list-content').append(_item_html);";
    _html+="              _complete +=1;";
    _html+="              $('.approval-list-header').html('全部工时申报数据开始查询，请稍等......完成进度'+Math.round(_complete*100/_total)+'%');";
    _html+="              if(_complete == _total){ sortItem(); }";
    _html+="        }";
    _html+="    });";
    _html+="}";

    _html+="function sortItem(){";
    _html+="    var items = $('.lei');";
    _html+="    items.sort(function(a,b){";
    _html+="        return parseInt($(b).attr('id'))-parseInt($(a).attr('id'));";
    _html+="    });";
    _html+="    $('.approval-list-content').html('');";
    _html+="    $.each( items, function(i, n){";
    _html+="        $('.approval-list-content').append($(n));";
    _html+="    });";
    _html+="    $('.approval-list-header').html('全部工时申报数据已查询完成并排序！');";
    _html+="}";

    _html+="function formatTime(timestamp){";
    _html+="    var date = new Date(timestamp);";
    _html+="    var Y = date.getFullYear() + '-';";
    _html+="    var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';";
    _html+="    var D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' ';";
    _html+="    var h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';";
    _html+="    var m = date.getMinutes() + ':';";
    _html+="    var s = date.getSeconds();";
    _html+="    return Y+M+D+h+m+s;";
    _html+="}";

    _html+="function formatTimeWithOutHour(timestamp){";
    _html+="    var date = new Date(timestamp);";
    _html+="    var Y = date.getFullYear() + '-';";
    _html+="    var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';";
    _html+="    var D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate());";
    _html+="    return Y+M+D;";
    _html+="}";


    setInterval(function (){
        if($("#open_me").html()==undefined){
            //console.log(_html);
            $("body").append("<script> "+_html+"  </script>");
            $(".common-title").eq(0).find("ul").append("<li id='open_me' onclick='chick()' class='pointer'>全部申报</li>");

        }

    }, 1000);

    //setInterval(function (){
    //    if($("#open_me").html()!=undefined && _total>0){
    //        $("#open_me").text("全部申报("+_complete+"/"+_total+")");
    //        if($("#sort_me").html()==undefined && _complete == _total){
    //            $(".common-title").eq(0).find("ul").append("<li id='sort_me' onclick='sortItem()'>申报排序</li>");
    //        }
    //    }
    //}, 500);

})();