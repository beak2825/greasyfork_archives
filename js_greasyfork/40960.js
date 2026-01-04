// ==UserScript==
// fork from https://greasyfork.org/zh-CN/scripts/23197-知乎-隐藏你屏蔽的人补完
// @name        知乎 - 屏蔽关键词
// @namespace   HideBlockedKeywords@Zhihu
// @description 在发现页面屏蔽标题带有被屏蔽话题的条目，也可以CTRL+I手动新增关键词。
// @author      einheria
// @include     http://www.zhihu.com/
// @include     http://www.zhihu.com/*
// @include     https://www.zhihu.com/
// @include     https://www.zhihu.com/*
// @version     1.1
// @require     https://greasyfork.org/scripts/23268-waitforkeyelements/code/waitForKeyElements.js?version=147835
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/40960/%E7%9F%A5%E4%B9%8E%20-%20%E5%B1%8F%E8%94%BD%E5%85%B3%E9%94%AE%E8%AF%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/40960/%E7%9F%A5%E4%B9%8E%20-%20%E5%B1%8F%E8%94%BD%E5%85%B3%E9%94%AE%E8%AF%8D.meta.js
// ==/UserScript==

//1.1版本增加了手动添加关键词的快捷键CTRL+I，以解决一些关键词不存在于话题标签的问题。
//如果你自己整好了一连串的关键词，也可以用英文逗号分隔后，整串手动添加。

//当你在“发现”栏目里面闲逛，难免会被一些本该屏蔽的问题脏了眼。这个脚本帮你解决这个问题。
//因为首页可以由自己控制，就没有针对首页进行屏蔽。

//感谢“隐藏你屏蔽的人”脚本作者，这个脚本是在他的成果基础上修改的。

//初次运行会跳转屏蔽界面，以你屏蔽的话题作为屏蔽关键词。
//如果有新增屏蔽话题，可以用 localStorage.removeItem("WordList") 重置之前缓存的屏蔽词目列表。


function PickingWords()
{
	var $wordlist = $('.zm-tag-editor .zm-tag-editor-labels a.zm-item-tag');
	var keyword = new Array($wordlist.length);
	for (i = 0; i < $wordlist.length; i++) {
		keyword[i] = $wordlist[i].innerHTML.replace(/(（.*）)/,"").replace(/(\(.*\))/,"");
	}
	localStorage.WordList = keyword;
}

$(function () {
	if (window.location.href == 'https://www.zhihu.com/settings/filter') {
		PickingWords();
	}
	if (localStorage.WordList == undefined) {
		if (window.location.href != 'https://www.zhihu.com/settings/filter') {
			if (confirm('将要跳转到 https://www.zhihu.com/settings/filter 获取屏蔽列表')){
				window.location.href = 'https://www.zhihu.com/settings/filter';
			}
		}
	}

	document.onkeydown = function(e) {
        var keyCode = e.keyCode || e.which || e.charCode;
        var ctrlKey = e.ctrlKey || e.metaKey;
        if(ctrlKey && keyCode == 73) {
            newBlock = prompt("知乎 - 屏蔽关键词","请输入需要屏蔽的关键词");
            if( newBlock != null || newBlock != ""){
				localStorage.WordList = localStorage.WordList+','+newBlock;
            }
        }
        e.preventDefault();
        return false;
    }
});

function replaceContentWithText(node, text) {
    node.children().hide();
    var spanNode = document.createElement('span');
    spanNode.append( document.createTextNode(text) );
    spanNode.style.color = "#999";
    node.append(spanNode);
}

function queryWithXPath(path,node){
    resultNode=null;
    try{
        queryResult = document.evaluate(path,node);
        resultNode = queryResult.iterateNext();
    }
    catch(e){
        console.log("tell me! why here has fucking problem?"+e);
    }
    return resultNode;
}

function checkAndBlock(title,blockMsg,jNode) {

	localStorage.WordList.split(',').some(function (e) {
		if( title.match(e) ) {
			replaceContentWithText(jNode,blockMsg+'：'+e);
	    	return true;
		}
	});
}


//屏蔽发现条目
function processExplore (jNode) {
    iNode=jNode[0];
    aNode = queryWithXPath(".//a[contains(@class,'question_link')]",iNode);
    if(aNode)
    	//alert(aNode.innerHTML);
        checkAndBlock(aNode.innerHTML,'这里有一条已被block的条目',jNode);
}

waitForKeyElements ("div.explore-feed", processExplore);