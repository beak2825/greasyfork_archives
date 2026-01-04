// ==UserScript==
// @name         zhixuewang
// @namespace    zhixue.com
// @version      1.6
// @description  使用智学网改卷，如果是按步骤记分的，本脚本解决每打一次分无需按回车键，最后还能主动提交，以提高阅卷的速度。
// @author       You
// @match        https://www.zhixue.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/467934/zhixuewang.user.js
// @updateURL https://update.greasyfork.org/scripts/467934/zhixuewang.meta.js
// ==/UserScript==

(function() {
    'use strict';
	var Dt = document;
	var n = 0, i=0;
	var dd = $('#containter_topicTxt input'); //这里应该替换成智学网里的标签
	var len = dd.length;
	var btn = $('#bnt_save', 1);

	if( len != 0 )
	{
		var i=1; //第0个是总分，所有从第1个开始
		for( ; i<len; i++ )
		{
			var obj = dd[i];
			obj.index = i;
			obj.onclick = function ( )
			{
				focus( this.index );
			}
			obj.onblur = function( )
			{
				if(!ent(dd))
				{
					console.log( '>>>>', 'onblur' );
					btn.click();
				}
			};
		}
	}

	function focus( arg )
	{
		n = arg;
		console.log( '>>>>>', n );
	}

	function $( arg, bool )
	{
		return bool==1 ? Dt.querySelector(arg) : Dt.querySelectorAll(arg);
	}

	function ent( obj ){
		var i=0;
		for( ; i<len; i++ )
		{
			if( obj[i]['value'] === '' )
			{
				return true;
			}
		}
		return false;
	}

	Dt.onkeyup = function( e )
	{
		btn = $('#bnt_save', 1);
		var et = window.event || e;
		var ko = et.keyCode - 96;
		if( len == 0 )
		{
			dd = $('#containter_topicTxt input');
			len = dd.length-1;
		}
		if( (n==len) || !ent( dd ) )
		{
			n = 0;
			btn.click();
		}
		else 
		{	
			console.log( ':::::', ko );
			//小键盘是0-9分，大键盘是10-19分（比如0就是10，1就是11）
			if ( (ko >-1 && ko<10) || (ko>-49 && ko<-40) )
			{
				dd[n].value = ko < 0 ? ko + 58 : ko;
				n++;
			}
		}
		
		btn.onclick = function ( )
		{
			n = 0;
			console.log( '>>>>', 'submit' );
		}
		
	};

})();




