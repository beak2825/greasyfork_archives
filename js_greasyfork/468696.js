// ==UserScript==
// @name         ZUT|教学质量管理平台（麦可思）自动评价
// @namespace    https://greasyfork.org/zh-CN/scripts/468696
// @version      1.1
// @description  打开评价页面即可使用，全自动填写。需要改选项的改第十六行 "CHOICE = 0 ";中的0即可；COMMENT变量为评价文字，CHOICE为单选第几项，LOWEST_SCORE为随机分数最低分
// @author       源作者不知道是谁，我只修改
// @match        https://zut.mycospxk.com/*
// @require      http://cdn.bootcss.com/jquery/1.8.3/jquery.min.js
// @icon         data:image/x-icon;base64,AAABAAEAEBAAAAEAIABoBAAAFgAAACgAAAAQAAAAIAAAAAEAIAAAAAAAQAQAAAAAAAAAAAAAAAAAAAAAAAD/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////5OX5/6uu7/+2ufD/+Pn9/////////////////////////////////////////////////////////////////9zd9/8XIdf/Bg/V/7S28P//////////////////////////////////////////////////////////////////////a3Lo/wMM1/9fZeP//////////////////v7+//Lx7//y8O7//f38/////////////////////////////////6us4v8MFNX/ISra/9/g+P////////////7+/f+Dbl7/SScg/66glP////////////////////////////////+UgXH/GRil/wwW4P+Rler/////////////////o5OF/y0GAP9xV0H////////////Ataz/zMO7///////19PP/YkIc/ywcW/8OGeT/Qkre//n6/f///////////9zX0v9FIwn/SSgN/+rn4//i3dn/PBgA/1IzGf/49/b/1M3F/0IdAP9NMi3/Iivb/xMc2v/Ex/P////////////8/fz/aU44/zUQAP/Atq3/pJSG/zgTAP86FQD/w7mw/6KShf8xDAD/mIRr/2x07/8BC9b/cHXl/////////////////56Of/81EQD/dFtH/15AKP9aPCP/UDAW/2xSO/9oTDX/OhQA/8/Es//CyPz/Aw3V/xoi2P/i4/n////////////Ty8T/RCIH/0QhA/85FAD/t6yh/5iHd/85FAD/QR8B/1Q0Gv/w7en/+vv//5md7f+JjOr/3d/4////////////+fn4/1w/J/8yDAD/Ti4T//Px7//Z1M//PhoA/zIMAP95YU3///////////////////////////////////////////+xo5j/dVxT/6udkv///////f7+/5qIef93XlT/xLqz////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA==
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/468696/ZUT%7C%E6%95%99%E5%AD%A6%E8%B4%A8%E9%87%8F%E7%AE%A1%E7%90%86%E5%B9%B3%E5%8F%B0%EF%BC%88%E9%BA%A6%E5%8F%AF%E6%80%9D%EF%BC%89%E8%87%AA%E5%8A%A8%E8%AF%84%E4%BB%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/468696/ZUT%7C%E6%95%99%E5%AD%A6%E8%B4%A8%E9%87%8F%E7%AE%A1%E7%90%86%E5%B9%B3%E5%8F%B0%EF%BC%88%E9%BA%A6%E5%8F%AF%E6%80%9D%EF%BC%89%E8%87%AA%E5%8A%A8%E8%AF%84%E4%BB%B7.meta.js
// ==/UserScript==

var COMMENT="老师讲的课无可挑剔，我很满意";
//默认选第一个
var CHOICE = 0;
var LOWEST_SCORE = 7;
/**
* @param inputDom 输入框DOM 比如：document.getElementById('userId')
* @newText 新的文本
*/
function changeReactInputValue(inputDom,newText){
	let lastValue = inputDom.value;
	inputDom.value = newText;
	let event = new Event('input', { bubbles: true });
	event.simulated = true;
	let tracker = inputDom._valueTracker;
	if (tracker) {
  	tracker.setValue(lastValue);
	}
	inputDom.dispatchEvent(event);
}

function Fill_it() {
    let checkbox_list = $(".ant-radio-group");
    for (let i = 0; i < checkbox_list.length; i++) {
        var lists = checkbox_list[i].children;
        var mxbtn = $(checkbox_list[i]).find(".ant-radio-input")[CHOICE];
        $(mxbtn).trigger("click");
    }

    let score = $(".ant-input-number input");
    for (var i = 0; i < score.length; i++) {
        changeReactInputValue(score[i],Math.round(Math.random()*(10-LOWEST_SCORE)+LOWEST_SCORE))
        //$(score[i]).trigger('click')
        //$(score[i]).val(Math.round(Math.random()*3+7)).trigger('change')

    }
    checkbox_list = $(".ant-checkbox-group");
    for (var i = 0; i < checkbox_list.length; i++) {
        var lists = checkbox_list[i].children;
        for (var j = 0;j<lists.length;j++){
            var btn = $(checkbox_list[i]).find(".ant-checkbox-input")[j];
            $(btn).trigger("click");
        }
    }
    var textbox_list = $(".ant-input");
    for (var i = 0; i < textbox_list.length; i++) {
        changeReactInputValue(textbox_list[i],COMMENT)
    }
}
(function () {
    'use strict';
    function check(){
        var textbox_list = $(".ant-input")

        if(textbox_list.length>0 && textbox_list[0].value == ""){
            Fill_it()

        }
        window.setTimeout(check, 2000);
    }
    window.onload = window.setTimeout(check, 2000);
    console.log('脚本处理完毕！');
})();