// ==UserScript==
// @name         Reading list - 稍后阅读
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  稍后阅读
// @author       Lin折
// @match        https://*/*
// @match        http://*/*
// @icon         data:image/png;base64,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
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_listValues
// @grant        GM_deleteValue
// @grant        unsafeWindow
// @require      https://apps.bdimg.com/libs/jquery/2.1.4/jquery.min.js
// @license      GPL-3.0 License
// @downloadURL https://update.greasyfork.org/scripts/441002/Reading%20list%20-%20%E7%A8%8D%E5%90%8E%E9%98%85%E8%AF%BB.user.js
// @updateURL https://update.greasyfork.org/scripts/441002/Reading%20list%20-%20%E7%A8%8D%E5%90%8E%E9%98%85%E8%AF%BB.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    var css = `
<style>


/* 容器 <div> - 需要定位下拉内容-有它才能hover唤出子元素vessel-content -vessel里面放一个arrow*/
.vessel {
	position: fixed;
	top: 30px !important;
	left: 2px !important;
    z-index: 999999999 !important;
	display: inline-block;
	cursor: pointer;
}

/* 下拉内容 (默认隐藏) */
.vessel-content {
	display: none;
	position: fixed;
    top: calc(5vh) !important;
	left: -0px !important;
    z-index: 999999999 !important;
	background-color: white;
	width: 600px;
    max-height: 925px;
	box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
    border-radius: 0% 2% 2% 2%;
	overflow-y: scroll;
}



/* 下拉菜单的链接 div标签下第一个a标签*/
.vessel-content div a:first-child {
	color:black;
	padding: 15px;
	text-decoration: none;
	font-weight: 400;
	font-size: large;
}
/* 下拉菜单的链接 div标签下最后一个a标签*/
.vessel-content div a:last-child {
    color:blue;
	padding: 5px;
	text-decoration: none;
	font-weight: 200;
	font-size: small;
}
/* 下拉菜单的链接 div标签*/
.vessel-content div:not([class]) {
	display: block;
	padding: 5px !important;
	cursor: pointer;
    overflow:hidden;
	text-overflow: ellipsis;
	white-space:nowrap;
	}

/*	 鼠标移上去后修改下拉菜单链接颜色 /*/
/*******把第一行排除在外********/
.vessel-content div:not([class]):hover {
	background-color: #f1f1f1;
}


/*箭头*/
.arrow{}
.arrow::before{
	content: '';
	display: inline-block;
	border-top: 3px solid;
	border-right: 3px solid;
	width: 12px;
	height: 12px;
	border-color: #97A2B6;
	transform: rotate(45deg);
}

/*	加号*/
.plus{
	display: inline-block;
	cursor: pointer;
}
.plus::before{
	content:'\\2723';
	font-weight: 600;
	font-size: x-large;
}

/*	刷新*/
.refresh{
	display: inline-block;
	cursor: pointer;
}
.refresh::before{
	content:'\\21BB';
	font-weight: 600;
	font-size: x-large;
}

/*	撤销*/
.undo{
	display: inline-block;
	cursor: pointer;
}
.undo::before{
	content:'\\21B6';
	font-weight: 600;
	font-size: x-large;
}

/*	重做*/
.redo{
	display: inline-block;
	cursor: pointer;
}
.redo::before{
	content:'\\21B7';
	font-weight: 600;
	font-size: x-large;
}
/***按钮栏****/
.header{
	display: flex !important;
	justify-content: center;
	grid-gap: 100px;
}
</style>

<div class="vessel">
    <span class="arrow"></span>
	<div class="vessel-content">
        <div class="header">
			<div class="plus"></div>
            <div class="refresh"></div>
			<div class="undo"></div>
			<div class="redo"></div>
		</div>
	</div>
</div>`
;
    document.documentElement.insertAdjacentHTML('beforeend', css);

    function itemhtml(url,title){
        //function构建div标签
        var ele1="<a target='_blank' href='"+url+"'>"+title.replace(/-.*|_.*/g,"")+"</a>";
        var ele2="<a target='_blank' href='"+url+"'>"+"- "+url.replace(/https?:\/\//g,"")+"</a>";
        var ele="<div>"+ele1+ele2+"</div>";
        return ele;
    };

    $(function(){
        function f5(){
            var arr=GM_listValues();
            // alert(arr);
            // 载入存档
            for(var i of arr){
                // alert(i);
                var s_url=i;
                var s_title=GM_getValue(s_url);
                $(".vessel-content").append(itemhtml(s_url,s_title));
            };
        };
		var ishover=false;
		$(".vessel").hover(function(){
			if (!ishover){f5();ishover=true;};
			if($(".vessel-content").css("display")=="none"){
				$(".vessel-content").slideDown();
			}
		},function(){$(".vessel-content").slideUp();
		});



        //append(),在父级最后面追加一个子元素
        $(document).on("click",".plus",function(){
			// 动态追加绑定事件
            var url=window.location.href;
            if(!GM_getValue(url)){
                var title=document.querySelector("head > title").text;
                $(".vessel-content").append(itemhtml(url,title));
                GM_setValue(url,title);
            };
        });
        $(".refresh").click(function(){
            $("div.vessel-content div:not([class])").remove();
            f5();
        });
        $(document).on("mousedown","div.vessel-content div:not([class])",function(e){
            if(e.which==2){
                var d_url=$(this).children("a:first").attr("href");
                GM_deleteValue(d_url);
                $(this).remove();
            };
        });
    });
})();

