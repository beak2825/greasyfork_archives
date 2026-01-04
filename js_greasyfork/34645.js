// ==UserScript==
// @name         范本系统尺码输出(描述编辑)
// @version      2.2
// @description  范本系统码号表下增加输出按钮，输出格式化码号，再次点击输出格式化HTML源码，并增加编辑后预览功能
// update v2.2   上传了亚马逊字体文件，预览效果与亚马逊网站刊登效果相同
// @author       QHS
// @match        *template.valsun.cn/index.php?mod=commonTemplate&act=setTemplateDetails&ids=*
// @require      https://code.jquery.com/jquery-3.2.1.min.js
// @namespace https://greasyfork.org/users/155548
// @downloadURL https://update.greasyfork.org/scripts/34645/%E8%8C%83%E6%9C%AC%E7%B3%BB%E7%BB%9F%E5%B0%BA%E7%A0%81%E8%BE%93%E5%87%BA%28%E6%8F%8F%E8%BF%B0%E7%BC%96%E8%BE%91%29.user.js
// @updateURL https://update.greasyfork.org/scripts/34645/%E8%8C%83%E6%9C%AC%E7%B3%BB%E7%BB%9F%E5%B0%BA%E7%A0%81%E8%BE%93%E5%87%BA%28%E6%8F%8F%E8%BF%B0%E7%BC%96%E8%BE%91%29.meta.js
// ==/UserScript==

(function() {
	'use strict';
	$(function() {
	 function addGlobalStyle(css) {
		var head, style;
		head = document.getElementsByTagName('head')[0];
		if (!head) {
			return;
		}
		style = document.createElement('style');
		style.type = 'text/css';
		style.innerHTML = css;
		head.appendChild(style);
	}

		addGlobalStyle('b{font-weight: bold;}@font-face{font-family:"Amazon Ember";src:local("Amazon Ember"),local("AmazonEmber-Regular"),url(https://m.media-amazon.com/images/G/01/AUIClients/AmazonUIBaseCSS-amazonember_rg-cc7ebaa05a2cd3b02c0929ac0475a44ab30b7efa._V2_.woff2) format("woff2"),url(https://m.media-amazon.com/images/G/01/AUIClients/AmazonUIBaseCSS-amazonember_rg-8a9db402d8966ae93717c348b9ab0bd08703a7a7._V2_.woff) format("woff")}@font-face{font-family:"Amazon Ember";font-weight:700;src:local("Amazon Ember"),local("AmazonEmber-Bold"),url(https://m.media-amazon.com/images/G/01/AUIClients/AmazonUIBaseCSS-amazonember_bd-46b91bda68161c14e554a779643ef4957431987b._V2_.woff2) format("woff2"),url(https://m.media-amazon.com/images/G/01/AUIClients/AmazonUIBaseCSS-amazonember_bd-b605252f87b8b3df5ae206596dac0938fc5888bc._V2_.woff) format("woff")}');
		$("table#bbb tfoot tr td:eq(0)").html('<div class="outputsize"style="cursor:pointer;background-color:#c2ff30;color:#fff;display:block;padding:6px 10px">输出</div>');
		$('table#bbb').on('click', '.outputsize', function() {
			output();
		});
	});
	var t_size, t_size_ent, descr = "<b>Size Chart:</b><br>",
		sizeNum, strSizeNum, sizeNumIn, strSizeNumIn; // in Centimeters
	var output = function() {
			$('table#bbb .model_table_tr').each(function() {

				t_size = $(this).find('input.model_add_table_input_a').val();
				t_size_ent = $(this);
				descr += t_size;//descr += "<b>" + t_size + "</b>";
				//descr += "<u>";
				switch (t_size) {
				case "S":
					descr += "(UK8-10)-----";
					break;
				case "M":
					descr += "(UK10-12)---";
					break;
				case "L":
					descr += "(UK12-14)----";
					break;
				case "XL":
					descr += "(UK14-16)---";
					break;
				case "XXL":
					descr += "(UK16-18)-";
					break;
				case "XXXL":
					descr += "(UK18-20)";
					break;
				case "3XL":
					descr += "(UK18-20)-";
					break;
				case "4XL":
					descr += "(UK20-22)-";
					break;
				}
/*for(var i=1;i<3;i++){descr += (t_size.length <= 4) ? "-": "";}
		descr += ($(this).find('input.model_add_table_input_a').val()=="M") ? "": "-";
		descr += "</u>";*/

				$('table#bbb thead td:gt(1):lt(' + ($("table#bbb thead td").length - 3) + ')').each(function(i) {
					descr += "----" + $(this).find('input[name="sizeRightName[]"]').val() + ":";//descr += "----" + $(this).find('input[name="sizeRightName[]"]').val() + ":<b>";
					sizeNum = t_size_ent.find('td:eq(' + (i + 2) + ')').find('input[name*="cmValue"]').val();
					sizeNumIn = t_size_ent.find('td:eq(' + (i + 2) + ')').find('input[name*="inValue"]').val();
					strSizeNum = sizeNum.toString();
					strSizeNumIn = sizeNumIn.toString();
					if (strSizeNum.length == 2) {
						descr += sizeNum + ".0";
					} else if (strSizeNum.length == 5) {
						var regu1 = /^[0-9]{3}\.{1}[0-9]{1}$/;
						var regu2 = /^[0-9]{2}\.{1}[0-9]{2}$/;
						var regu3 = /^[0-9]{2}$/;
						if (strSizeNum.match(regu1)) {
							descr += Math.round(sizeNum);
						} else if (strSizeNum.match(regu2)) {
							var newNum = (Math.round(sizeNum * 10) / 10);
							descr += newNum;
							if (newNum.toString().match(regu3)) {
								descr += ".0";
							}
						}
					} else {
						descr += sizeNum;
					}
					descr += "cm/";//descr += "</b>cm/<b>";
					if (strSizeNumIn.length == 2) {
						descr += sizeNumIn + ".0";
					} else if (strSizeNumIn.length == 5) {
						if (strSizeNumIn.match(regu1)) {
							descr += Math.round(sizeNumIn);
						} else if (strSizeNumIn.match(regu2)) {
							var newNumIn = (Math.round(sizeNumIn * 10) / 10);
							descr += newNumIn;
							if (newNumIn.toString().match(regu3)) {
								descr += ".0";
							}
						}
					} else {
						descr += sizeNumIn;
					}
					descr += "\"";//descr += "</b>\"";
				});
				descr += "<br>";

			});
/*descr += "<br><b>Size Chart in Inchs<br></b>";
    $('table#bbb .model_table_tr').each(function() {

        t_size = $(this).find('input.model_add_table_input_a').val();
        t_size_ent = $(this);
		descr += "<b>" + t_size + "</b>";
		switch(t_size)
		{
			case "S":descr += "----";break;
			case "M":descr += "---";break;
			case "L":descr += "----";break;
			case "XL":descr += "---";break;
			case "XXL":descr += "-";break;
			case "XXXL":descr += "";break;
		}

        $('table#bbb thead td:gt(1):lt(' + ($("table#bbb thead td").length - 3) + ')').each(function(i) {
            descr += "----" + $(this).find('input[name="sizeRightName[]"]').val() + ":<b>";
			sizeNum = t_size_ent.find('td:eq(' + (i + 2) + ')').find('input[name*="inValue"]').val();
		    strSizeNum = sizeNum.toString();
            if (strSizeNum.length == 2) {
                descr += sizeNum + ".0";
            }else if(strSizeNum.length == 5){
				var regu1 = /^[0-9]{3}\.{1}[0-9]{1}$/;
				var regu2 = /^[0-9]{2}\.{1}[0-9]{2}$/;
				if(strSizeNum.match(regu1)){
					descr += Math.round(sizeNum);
				}else if(strSizeNum.match(regu2)){
					descr += (Math.round(sizeNum*10)/10);
				}
			}else{
                descr += sizeNum;
            }
            descr += "in</b>";
        });
        descr += "<br>";

    });*/
			$("table#bbb tfoot tr").html('<td colspan="99"><div id="editable" style="font-size:13px;font-family:\'Amazon Ember\',Arial,sans-serif;padding:10px 20px;border:1px #a0da17 solid;">' + descr + '</td>');

			$('.model_add_table_input').each(function() {
				$(this).parent('td').html($(this).val());
			});
		}


	$('table#bbb').on('click', '#editable', function() {
		var th = $(this);
		var html = th.html();
		$('#editable').css("padding","0px");
		var input = $("<textarea type='text' style='width: 100%; min-height: 116px; display: block; position: relative;'>" + html + "</textarea>");
		th.html(input); //附上input
		//再次点击不变
		input.click(function() {
			return false;
		});
		//自动获取焦点 
		input.trigger("focus");
		//文本框失去焦点变回来
		input.blur(function() {
			var val = $(this).val();
			$('#editable').css("padding","10px");
			if (val != html) {
				th.html(val);
				//下面开始根据你的情况,在写ajax 
			} else {
				th.html(val);
			}
		});
	});

/*
$('table#bbb').on('click','#editable',function(){
        var th = $(this);
        var html = th.html();
        var input = $("<textarea style='width:"+$('#editable').width()+"px;height:"+$('#editable').height()+"px;font-size:23px;' type='text'>" + html + "</textarea>");
        th.html(input);//附上input
        input.setSelectionRange(0, docNo.length);
        input.focus();
        //再次点击不变
        input.click(function(){return false;});
        //自动获取焦点 
        input.trigger("focus");
        //文本框失去焦点变回来
        input.blur(function(){
            var val = $(this).val();
            if (val != html) { 
                th.html(val);
                //下面开始根据你的情况,在写ajax 
            } else { 
                th.html(val); 
            }
		});
});*/
	// END
})();