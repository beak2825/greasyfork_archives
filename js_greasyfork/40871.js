// ==UserScript==
// @name         交互英语3
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       ringotc
// @match        https://english.ulearning.cn/upload/Scorm/ImportRoot/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/40871/%E4%BA%A4%E4%BA%92%E8%8B%B1%E8%AF%AD3.user.js
// @updateURL https://update.greasyfork.org/scripts/40871/%E4%BA%A4%E4%BA%92%E8%8B%B1%E8%AF%AD3.meta.js
// ==/UserScript==

(function() {
setTimeout(function(){
jQuery("a").each(function(){
	if($(this).attr("onmouseover") == "showButton('right','../shared/images/common/btn_right_hi.jpg');"){
        $(this).find("img").click();
	}
});
},3000);
	var toolUlearning = {
		init : function(){
			// load jQuery
			toolUlearning.loadjQuery(function(){
				$("input").each(function(){
					if($(this).attr("type") == "hidden" && $(this).attr("name").search("TemporaryAnswer") == -1){
						$(this).attr("type","");
					}
				});
				toolUlearning.getAnw();
				toolUlearning.runTool(function(){
                     onCheckAnswers();
                     setTimeout(function(){
                         console.log(123);
                         jQuery("a").each(function(){
                             if($(this).attr("onmouseover") == "showButton('right','../shared/images/common/btn_right_hi.jpg');"){
                                 $(this).find("img").click();
                             };
                         });
                     },2000);
                });
			});
		},
		loadjQuery : function(callback){
			var oHead = document.getElementsByTagName('HEAD').item(0);
			var oScript= document.createElement("script");
			oScript.type = "text/javascript";
			oScript.src="https://cdn.bootcss.com/jquery/3.3.1/jquery.min.js";
			oHead.appendChild( oScript);
			oScript.onload = callback;
		},
		getAnw:function(){
			var correctAnswer = [[0,0,1,0],[0,0,1,0],[0,0,0,1],[0,1,0,0]];
			var anwEle = jQuery(":contains('var APPLET_IN_USE')");
			anwEle = anwEle[anwEle.length -1];
			innerAnw = anwEle.innerHTML;
			innerAnw = innerAnw.replace("<!--","");
			innerAnw = innerAnw.replace("//--> ","");
			eval(innerAnw);
		},
		runTool:function(callback){
            if(questionType[0] == "mcss"){
				toolUlearning.inputTool();
                callback();
			}
            if(questionType[0] == "pd"){
				toolUlearning.selectTool();
                callback();
			}
			if( questionType == "fidd" ){
				toolUlearning.iiipTool();
                callback();
			}
            if( questionType[0] == "asdww" ){
				toolUlearning.iiipTool();
                callback();
			}
		},
		iiipTool :function(){
			$("input").each(function(){
				name = $(this).attr("name");
				$(this).val(name + "_0");
			});
		},
		ftTool:function(){
			window.ftAnwser = [];
			jQuery.getScript("http://127.0.0.1/demo/anwser.js");
			jQuery("input").each(function(){
				name = jQuery(this).attr('name');
				jQuery(this).val( ftAnwser[name] );
			});
		},
		selectTool: function(){
			for( i in correctAnswer){
				iter = 0;
				for(k in correctAnswer[i]){
					iter++;
					if(correctAnswer[i][k] == 1){
						$("#select_"+i).find("select")[0].selectedIndex = iter -1;
					}
			   }
			}
		},
		inputTool: function(){
			iter = 0;
			for( i in correctAnswer){
				for(k in correctAnswer[i]){
					iter++;
					if(correctAnswer[i][k] == 1){
						jQuery("input[type=radio]").get(iter-1).click();
					}
			   }
			}
		}
	};
	toolUlearning.init();
})();