// ==UserScript==
// @name         zhixuewangNew
// @namespace    zxwNew
// @version      1.4
// @description  智学网评卷输入成绩自动提交!
// @author       Yoncms
// @match        https://www.zhixue.com/webmarking/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=undefined.
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/469747/zhixuewangNew.user.js
// @updateURL https://update.greasyfork.org/scripts/469747/zhixuewangNew.meta.js
// ==/UserScript==

(function() {
    'use strict';


	function $( arg, fg )
	{
		var 
			em;
		if( fg )
			em = Dt.querySelector( arg );
		else
			em = Dt.querySelectorAll( arg );
		if( em )
			return em;
		return null;
	}


        var
            Dt = document,
            btn, et, ko, pre, i=0,
            ipt = $('#txt_marking_33',1); //33是题号 

	Dt.onkeyup = function( e )
	{
		if( !ipt )
		{
			ipt = $('#txt_marking_33',1); //33是题号
		}

        btn = $('#bnt_save', 1);
		et = window.event || e;
        ko = et.keyCode;

        if( ko == 38 ) //这个是向上键，用于回评
        {
            i = 1;
			pre = $('.pre')[0];
            pre.click();
        }
        else if( (ko >-1 && ko<10) || (ko>-49 && ko<-40) )
        {
		     ko = et.keyCode - 96;
            //小键盘是0-9分，大键盘是10-19分（比如0就是10，1就是11）
			ipt.value = ko < 0 ? ko + 38 : ko;
        }

        console.log( ipt.value, ko );

		if( ipt.value !== '' )
		{
			//* 如果不是回评点击提交分数就可以了
			btn.click();

			//* 如果是回评，提交分数时会有弹窗
			if( i == 1 )  
			{
				i = 0;
				setTimeout(function()
				{
					//* 自动点击继续评卷按钮，这样就不需要手动取消弹窗
					$('.el-message-box__wrapper .el-message-box__btns button',1).click();
				}, 5 );
			}
		}
		else
		{
			console.log( '::::', ko );

		}
    };


})();