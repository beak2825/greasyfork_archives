// ==UserScript==
// @name         教务系统评教
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  北部湾大学教务系统评教
// @author       chunxq
// @match        http://*/*
//@include       http://10.3.132.10/jwglxt/xspjgl/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/404951/%E6%95%99%E5%8A%A1%E7%B3%BB%E7%BB%9F%E8%AF%84%E6%95%99.user.js
// @updateURL https://update.greasyfork.org/scripts/404951/%E6%95%99%E5%8A%A1%E7%B3%BB%E7%BB%9F%E8%AF%84%E6%95%99.meta.js
// ==/UserScript==


(function() {
    'use strict';
    const rank=0; //0优秀，1良好，2一般，3差
    const pingyu="很负责任,很好的老师"; //评语

    susdiv();
	//jQ设置动态悬浮窗
	function susdiv()
	{
		var $div=$("<div></div>");
		$div.addClass('susdiv');
		$div.css({
			"position": "absolute",  //悬浮必须
			"border": "2px solid #AEBBCA",
			"overflow": "hidden",
			"padding":"1px",
			"opacity":"0.9",
			"top":"60px",
			"right":"60px",
			// "height":"300px",
			"width":"150px",
			"z-index": "9999"  //设置在最上层
		});
		$("body").prepend($div);

		var $top=$("<div></div>");
		$top.addClass('top');
		$top.css({
		"background-color":"#6C6C6C",
		"height":"22px",
		"line-height":"20px",
		"text-align": "center",
		"padding":"1px",
		"cursor": "move"
		});
		$div.append($top);

		var $title=$("<span>双击关闭</span>");
		$title.addClass('top_title');
		$title.css({
			"color":"#272727",
			"padding":"1px",
			"font-weight":"bold",
			"user-select":"none"  //不可选择
		});
		$top.append($title);

		var $form=$("<div></div>");
		$form.addClass('form');
		$form.css({"padding":"2px",
					"text-align": "center",
					"padding":"5px",
					"min-height":"100px",
					"background":"#FCFCFC"
				});
		$div.append($form);

		//隐藏/显示form菜单
		$(".top").dblclick(function(){
				$(".form").toggle();
		});

		var $p1=$("<p>开始评教</p>");
		$p1.addClass('form_p1');
		$p1.css({"cursor":"pointer",
					"color":"#00FF7F",
					"user-select":"none",
					"margin":"10px auto"
		          });
		$form.append($p1);

	}

	//实现拖拽效果
	$('.susdiv').mousedown(function(e)
	{
    // e.pageX
    	var positionDiv = $(this).offset();
    	var distenceX = e.pageX - positionDiv.left;
    	var distenceY = e.pageY - positionDiv.top;
    	//alert(distenceX)
    	// alert(positionDiv.left);

    	$(document).mousemove(function(e) {
        	var x = e.pageX - distenceX;
        	var y = e.pageY - distenceY;

        	if (x < 0) {
            	x = 0;
        	}
        	else if (x > $(document).width() - $('.susdiv').outerWidth(true)) {
            	x = $(document).width() - $('.susdiv').outerWidth(true);
        	}

        	if (y < 0) {
            	y = 0;
        	} else if (y > $(document).height() - $('.susdiv').outerHeight(true)) {
            	y = $(document).height() - $('.susdiv').outerHeight(true);
        	}

        	$('.susdiv').css({
            	'left': x + 'px',
            	'top': y + 'px'
        	});
    	});

    	$(document).mouseup(function() {
       		$(document).off('mousemove');
    	});
	});


    function pingjia(){
        var rankid=$(".table-bordered label  input").eq(rank).attr("data-pfdjdmxmb_id");
        $("input[data-pfdjdmxmb_id="+rankid+"]").trigger("click");
        $("textarea.form-control").text(pingyu);
        $("#btn_xspj_tj").trigger("click");
        $("#btn_ok").trigger("click");
    }

    function doScaledTimeout(i,j) {
        setTimeout(function() {
            console.log("正在评价第"+i+"教师");
            $('td[aria-describedby="tempGrid_tjztmc"]').eq(i).trigger("click");
            setTimeout(pingjia,2000); //一定要延时啊，不然获取不到元素，函数会没用的。
        }, j * 7000);
    }


    function selteacher(){
       var teachersum=$('td[aria-describedby="tempGrid_tjztmc"]').length;
       console.log("老师总共人数："+teachersum);
       var j=0;  //计时用
       for(var i=0;i<teachersum;i++)
       {
           var status=$('td[aria-describedby="tempGrid_tjztmc"]').eq(i).attr("title");
           console.log(status);
           if(status=="未评")
           {
               j++;
               doScaledTimeout(i,j);
           }

       }
    }

    var flag=0;
    $(".form_p1").click(function()
		{
			flag=!flag;
			if(flag==1)
			{	alert("开始评教");
				$(".form_p1").text("关闭评教....");
                selteacher();
                 //pingjia();
			}
			else
			{
				$(".form_p1").text("开始评教");
				//alert("已关闭评教");
			}

	});


})();





