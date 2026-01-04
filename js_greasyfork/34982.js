// ==UserScript==
// @name         只看自营
// @namespace    mscststs
// @version      0.3
// @description  京东商品列表只看自营
// @author       mscststs
// @match        *://list.jd.com/list.html*
// @match        *://search.jd.com/Search?*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/34982/%E5%8F%AA%E7%9C%8B%E8%87%AA%E8%90%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/34982/%E5%8F%AA%E7%9C%8B%E8%87%AA%E8%90%A5.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function isJD(obj){
		var ziy = 0;
		obj.find(".icon-group-1").each(function(){
			if($(this).text()=="自营"){
				ziy = 1;
			}
		});
		obj.find(".goods-icons[data-idx='1']").each(function(){
			if($(this).text()=="自营"){
				ziy = 1;
			}
		});
		return ziy;
    }

    function hide(){
        $(".gl-item").each(function(){
            if(isJD($(this))){
            }else{
                $(this).hide();
            }
        });
    }
    function display(){
        $(".gl-item").each(function(){
            if(isJD($(this))){
            }else{
                $(this).show();
            }
        });
    }
    function toggle_only(){
         if(window.localStorage["helper_onlyJD"]==1){
            $("#helper_onlyJD").addClass("curr");
             hide();
        }else{
            $("#helper_onlyJD").removeClass("curr");
            display();
        }
    }
	function reload(){
		$("body").live("DOMNodeInserted","#J_goodsList",function(){
			if($("div.f-sort").find("#helper_onlyJD").length==0){
			if(!window.kkp){window.kkp = 1;
				setTimeout(function(){init();
				window.kkp = 0;},3000);
				}
			}
		});
	}

    function init(){
        if(window.localStorage["helper_onlyJD"]){
        }else{
            window.localStorage["helper_onlyJD"] = 0;
        }
        $("div.f-sort").append("<a id='helper_onlyJD' style='margin-left:20px;cursor:pointer;user-select:none'> ~ 真·只看自营 </a>");
        toggle_only();
        $("#helper_onlyJD").click(function(){
            window.localStorage["helper_onlyJD"] = 1-window.localStorage["helper_onlyJD"];
            toggle_only();
        });
		if(!window.kkp){
					reload();
		}
    }
    $().ready(function(){
            setTimeout(function(){init();},2000);
    });
})();