// ==UserScript==
// @name         Restore Clipboard ( 剪贴板消毒，去掉版权信息 )
// @namespace    https://github.com/harryhare
// @version      0.4.11
// @description  remove annoying copyright words on zhihu.com, jianshu.com, douban.com...
// @author       harryhare
// @license      GPL 3.0
// @icon         https://raw.githubusercontent.com/harryhare/userscript/master/index.png
// @match        https://*.zhihu.com/**
// @match        https://*.jianshu.com/**
// @match        https://*.douban.com/**
// @match        https://*.csdn.net/**
// @match        https://*.ftchinese.com/**
// @match        https://*.1point3acres.com/**
// @match        https://blog.skk.moe/**
// @match        https://www.bilibili.com/**
// @match        https://juejin.cn/**
// @match        https://*.nowcoder.com/**
// @match        https://*.mbalib.com/**
// @match        http://www.360doc.com/**
// @match        https://www.360doc.com/**
// @match        https://*.geekbang.org/**
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/40730/Restore%20Clipboard%20%28%20%E5%89%AA%E8%B4%B4%E6%9D%BF%E6%B6%88%E6%AF%92%EF%BC%8C%E5%8E%BB%E6%8E%89%E7%89%88%E6%9D%83%E4%BF%A1%E6%81%AF%20%29.user.js
// @updateURL https://update.greasyfork.org/scripts/40730/Restore%20Clipboard%20%28%20%E5%89%AA%E8%B4%B4%E6%9D%BF%E6%B6%88%E6%AF%92%EF%BC%8C%E5%8E%BB%E6%8E%89%E7%89%88%E6%9D%83%E4%BF%A1%E6%81%AF%20%29.meta.js
// ==/UserScript==

// use match instead of include
// https://stackoverflow.com/questions/31817758/what-is-the-difference-between-include-and-match-in-userscripts

// 代码思路
// if ( oncopy 所在的 element 在 document 上){
//	 在 document.body 上 stopPropagation();
// }
// else if level( oncopy 所在的 element) > level(content element){
//     在 content element 上调用 stopPropagation();
// }
// else if level( oncopy 所在的 element) == level(content element){
//	 操作剪贴板
// }


function rewrite_html(e){
	let inner=e.innerHTML;
	e.innerHTML=inner;
}

function do_douban(){
	var targets=document.querySelectorAll('div#link-report .note,div.review-content.clearfix');
	for(let i=0;i<targets.length;i++){
		targets[i].oncopy=(e)=>{e.stopPropagation();};
	}
}

function do_csdn(){
	var targets=document.querySelectorAll('div#article_content');
	for(let i=0;i<targets.length;i++){
		targets[i].oncopy=(e)=>{e.stopPropagation();};
	}
}

function do_juejin(){
	var targets=document.querySelectorAll('div.article-content div.markdown-body');
	for(let i=0;i<targets.length;i++){
		targets[i].oncopy=(e)=>{e.stopPropagation();};
	}
}

function do_360doc(){
	var targets=document.querySelectorAll('div.doc360article_content');
	for(let i=0;i<targets.length;i++){
		targets[i].oncopy=(e)=>{e.stopPropagation();};
	}
}

function do_bilibili(){
	var targets=document.querySelectorAll('div#read-article-holder');
	for(let i=0;i<targets.length;i++){
		targets[i].oncopy=(e)=>{e.stopPropagation();};
	}
}

function do_zhihu(){
	//var targets=document.querySelectorAll('div.RichContent--unescapable');# 使用这个selecter，后面动态加载的部分依然会有问题
	var targets=document.querySelectorAll('main.App-main');
	for(let i=0;i<targets.length;i++){
		targets[i].oncopy=(e)=>{e.stopPropagation();};
		//targets[i].className=""
	}
}



// B站改了，这个是原先的代码
// function do_bilibili(){
//
// 	async function clean(e) {
// 		e.preventDefault();
// 		//可能有用
// 		 e.stopImmediatePropagation();
// 		 // 在执行完当前事件处理程序之后，停止当前节点以及所有后续节点的事件处理程序的运行
// 		var copytext = window.getSelection().toString();
// 		//console.log(await navigator.clipboard.readText());
// 		await navigator.clipboard.writeText(window.getSelection().toString());
//
//
// 		// 没有效果
// 		// var clipdata = e.clipboardData || window.clipboardData;
// 		// console.log(clipdata.getData('Text'));
// 		// console.log(clipdata.getData('text/plain'));
// 		// let clipboardItems = [];
// 		// console.log("items begin");
// 		// for (const item of e.clipboardData.items) {
// 			// console.log(item);
// 			// if (!item.type.startsWith('image/')) {
// 				// continue;
// 			// }
// 			// clipboardItems.push(
// 				// new ClipboardItem({
// 					// [item.type]: item,
// 				// })
// 			// );
// 		// }
// 		// if (clipdata) {
// 			// clipdata.setData('text/plain', copytext);
// 			// clipdata.setData('Text', copytext);
// 		// }
// 	}
// 	var targets=document.querySelectorAll('div.article-holder');
// 	for(let i=0;i<targets.length;i++){
// 		targets[i].oncopy=clean;
// 	}
//
//     // 因为B站js函数中有这样的代码，
//     //    i.preventDefault(),
// 	//	  i.stopPropagation()
// 	// 所以直接在body上面家 listener 没有效果
// 	// document.body.addEventListener('copy', clean);
// 	// document.body.oncopy=clean;
// }


function do_geekbang(){
    var last_selection;
    var last_selection_string;
    var last_selection_range=[];
    var last_change_is_copy=false;
    document.onselectionchange=(e)=>{
        //console.log("on selection changed");
        if(last_change_is_copy==true){
            //console.log("the fake change!")
            last_change_is_copy=false;
            return;
        }
        last_selection=window.getSelection();
        // 这句报错不知道怎么做申拷贝
        //last_selection=Object.assign({},window.getSelection());
        //console.log(last_selection.toString());
        last_selection_string=""+last_selection.toString();
        last_selection_range=[];
        for(var i=0;i<last_selection.rangeCount;i++){
           last_selection_range.push(last_selection.getRangeAt(i));
        }

    }

	async function clean(e) {
        // 由于 增加版权声明的代码中有这样的代码
        // var e = window.getSelection(),
        // e.selectAllChildren(s),
        // 这里这句为了防止错误的保存这次变化
        last_change_is_copy=true;

        // window.getSelection() 要用copy，深拷贝才行
        //console.log(last_selection==window.getSelection());

        //此方法可以缓解问题，但是会导致只能复制到单个element 的内容
        //window.getSelection().selectAllChildren(e.target);

        var currnent_selection=window.getSelection();
        currnent_selection.removeAllRanges();
        for(var i=0;i<last_selection_range.length;i++){
            currnent_selection.addRange(last_selection_range[0]);
        }
        // range 和 直接改clipboard 二选一， clipboard 的结果可以覆盖 window.getSelection() 的状态
        //console.log("last_selection string");
        //console.log(last_selection_string);
		//await navigator.clipboard.writeText(last_selection_string);
        //await navigator.clipboard.writeText("测试");
	}
    document.body.oncopy=clean;
    /*
    // 由于网站 js 中没有加
    //  i.stopPropagation()
    // 所以不用在同一层，只要在上层（body）处理就可以了
    function callback(records){
        records.map(function (record) {
            if (record.addedNodes.length != 0) {
                for(var i=0;i<record.addedNodes.length;i++){
                    var node=record.addedNodes[i];
                    if(node.className=="quiz-box"){
                        var targets=node.querySelectorAll("div#article-content.richcontent");
                        console.log(targets);
                        for(let i=0;i<targets.length;i++){
                            targets[i].oncopy=clean;
                        }
                    }
                }
            }
        });
    }



    var mo = new MutationObserver(callback);

	var option = {
		'childList': true,
		'subtree': true,
	};

	mo.observe(document.body, option);
    */
}


(function() {
	'use strict';
	if(location.href.match("https://[a-z]+.douban.com")!=null){
		do_douban();
	}else if(location.href.match("https://[a-z]+.csdn.net")!=null){
		do_csdn();
	}else if(location.href.match("https://[a-z]+.bilibili.com")!=null){
		do_bilibili();
	}else if(location.href.match("https://juejin.cn")!=null){
		do_juejin();
	}else if(location.href.match("https?://www.360doc.com")!=null){
		do_360doc();
	}else if(location.href.match("https://[a-z]+.geekbang.org")!=null){
        do_geekbang();
    }else if(location.href.match("https://[a-z]+.zhihu.com")!=null){
        do_zhihu();
    }else{
		document.body.oncopy=(e)=>{e.stopPropagation();};
		//document.documentElement.addEventListener('copy',function(e){e.stopImmediatePropagation()});
		//document.documentElement.addEventListener('copy',function(e){e.stopPropagation()});
		//document.body.addEventListener('copy',function(e){e.stopPropagation()});
		//document.body.oncopy=function(e){e.stopPropagation()};
	}


	/*
	var targets=document.querySelectorAll('span.RichText.CopyrightRichText-richText');
	for(let i=0;i<targets.length;i++){
		//rewrite_html(targets[i].parentElement);
		targets[i].oncopy=(e)=>{e.stopPropagation();};
		targets[i].parentElement.oncopy=(e)=>{e.stopPropagation();};
		targets[i].parentElement.parentElement.oncopy=(e)=>{e.stopPropagation();};
	}*/
})();
