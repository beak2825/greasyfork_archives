// ==UserScript==
// @name         flowus清空回收站
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  清空回收站
// @author       You
// @match        https://flowus.cn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=flowus.cn
// @grant        none
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/1.10.0/jquery.js
// @require      https://cdn.bootcdn.net/ajax/libs/layer/3.5.1/layer.min.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/451660/flowus%E6%B8%85%E7%A9%BA%E5%9B%9E%E6%94%B6%E7%AB%99.user.js
// @updateURL https://update.greasyfork.org/scripts/451660/flowus%E6%B8%85%E7%A9%BA%E5%9B%9E%E6%94%B6%E7%AB%99.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    function active(fn,tm){
        if(!fn){
            return false;
        }
        var next = active;
        setTimeout(function(){
            fn();
            next();
        },tm||300);
        return next;
    }
    $("head").append('<link href="https://cdn.bootcdn.net/ajax/libs/layer/3.5.1/theme/default/layer.css" rel="stylesheet">');
    $("head").append("<style>.clear{position: absolute;right: 20px;cursor: pointer;}</style>");
    $("body").on("mouseover","#dropDownContent",function(){
        if($("#dropDownContent .clear").length==0){
            var classAll = "clear border outline-none text-ellipsis bg-active_color text-white border-transparent hover:brightness-90 dark:hover:brightness-110 relative flex items-center justify-center h-8 rounded text-t2-medium flex-shrink-0 whitespace-nowrap px-2 mr-1.5";
            var dom = $("<div class='"+classAll+"'>清空回收站</div>");
            dom.click(function(){
                layer.load(3,{shade:0.4});
                layer.msg('正在清空回收站...', {time: 60*1000,offset: '53%'});
                function clear(id,maxId){
                    var fn = function(){
                        $(".fixed.inset-0").click();
                        //关闭
                        layer.closeAll();
                        layer.msg("已清空回收站："+maxId,{icon:6});
                    };
                    if(maxId==0){
                        return false;
                    }
                    if(id<maxId){
                        fn = function(){
                            clear(id+1,maxId)
                        };
                    }
                    active(()=>{$("#dropDownContent button[data-test-id=trash-item-delete]:eq("+id+")").click();},100)
                    (()=>{$("#modalContent button[data-test-id=delete-bar-delete]").click();},300)
                    (()=>{$("#modalContent button[data-test-id=warning-modal-confirm]").click();},600)
                    (fn,1100);
                }
                clear(0,$("#dropDownContent button[data-test-id=trash-item-delete]").length);
            });
            $("#dropDownContent .items-center.text-t2.text-grey3").append(dom);
        }
    });
})();