// ==UserScript==
// @name         禅道看板
// @description  禅道看板自动展开
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  try to take over the world!
// @author       gccd
// @match        http://cd.midea.com/pms/*
// @match        https://cd.midea.com/pms/*
// @grant        none
// @icon         http://www.meicloud.com/favicon.ico
// @copyright    2018+, @MeiCloud
// @downloadURL https://update.greasyfork.org/scripts/369271/%E7%A6%85%E9%81%93%E7%9C%8B%E6%9D%BF.user.js
// @updateURL https://update.greasyfork.org/scripts/369271/%E7%A6%85%E9%81%93%E7%9C%8B%E6%9D%BF.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //屏蔽日期自动填充
    $("input[name^='dates']").each(function(){
        $(this).attr('autocomplete',"off");
    })
    //表格单双行
    $(".odd").css({
        'background' : '#eee'
    })

    if(document.location.href.indexOf("f=tree&") != -1){
        $(".task-info").show().css("display","inline-block");
    }

    if(document.location.href.indexOf("kanban") != -1){
        //显示指派人员
        $(".board-footer").show();

        //加入搜索
        function filter(keyword){
            //粒度到 pbi
            $("tr").each(function(i){
                if(keyword == null || keyword.length == 0){
                    $(this).show();
                }else{
                    var smalls = $(this).find("small");
                    var match = false;
                    for(var j =0;j<smalls.size();j++){
                        //console.log("small:"+$(smalls[j]).html()+","+keyword);
                        if($(smalls[j]).html().indexOf(keyword) != -1){
                            match = true;
                        }
                    }
                    if(match){
                        $(this).show();
                    }else{
                        $(this).hide();
                    }
                }
            })
            //粒度到任务
            $(".board-task").each(function(i){
                if(keyword == null || keyword.length == 0){
                    $(this).show();
                }else{
                    if($(this).find("small").last().html().indexOf(keyword) != -1){
                        $(this).show();
                    }else{
                        $(this).hide();
                    }
                }

            })
        }
        var newElement = $('<input id="filter" type="text" placeholder="张三"/>');
        newElement.css({
            position: 'fixed',
            top: 270,
            right: 50,
            width: 100
        })
        $("#kanban").append(newElement);
        newElement.on('input onpropertychange',function(e){
            var keyword = $(this).val();
            if(keyword == null || keyword.length == 0){
                filter(keyword);
                return;
            }
            var reg = /^[\u4E00-\u9FA5]+$/
            // var reg = /.*[\u4e00-\u9fa5]+.*$/
            if(reg.test(keyword)) {
                filter(keyword);
            }
        });
    }
})();
