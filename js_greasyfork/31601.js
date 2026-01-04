// ==UserScript==
// @name            v2ex点击@的名字将被@的名字变红
// @namespace       3322748965@qq.com
// @author          feiyuhan
// @description     由于在用v2ex的时候，经常看见有人@了另外的一个人，然后想找到被@的人说了什么，然后需要一个个的去上面找，总是不太好找，然后这个脚本的功能就是你点击了被@的人会将被你@的人的名字变成红色，这样可以直接找到。
// @match           http://www.v2ex.com/*
// @match           https://www.v2ex.com/*
// @version         0.0.1
// @grant 			GM_registerMenuCommand
// @grant 			GM_openInTab
// @grant 			GM_log
// @grant 			unsafeWindow
// @grant 			GM_addStyle
// @grant 			unsafeWindow
// @grant 			GM_getResourceURL
// @grant 			GM_getResourceText
// @grant 			GM_setValue
// @grant 			GM_listValues
// @grant 			GM_getValue
// @grant 			GM_deleteValue
// @grant 			GM_info
// @grant 			Metadata Block
// @create          2017-07-18
// @downloadURL https://update.greasyfork.org/scripts/31601/v2ex%E7%82%B9%E5%87%BB%40%E7%9A%84%E5%90%8D%E5%AD%97%E5%B0%86%E8%A2%AB%40%E7%9A%84%E5%90%8D%E5%AD%97%E5%8F%98%E7%BA%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/31601/v2ex%E7%82%B9%E5%87%BB%40%E7%9A%84%E5%90%8D%E5%AD%97%E5%B0%86%E8%A2%AB%40%E7%9A%84%E5%90%8D%E5%AD%97%E5%8F%98%E7%BA%A2.meta.js
// ==/UserScript==
(function () {
    var cell=document.getElementsByClassName('cell');//所有拥有cell类的标签
    var length=cell.length;
    var realCell=new Array();
    var temp=0;
    for(var i=0;i<length;i++){
    	if(cell[i].id!=""){//id为空则不是回复中的内容
    		realCell[temp++]=cell[i];
    	}
    }
    var realLength=realCell.length;
    var allName=new Array();
    for(var i=0;i<realLength;i++){
    	var tr=realCell[i].getElementsByTagName('tr');
    	var tdName=tr[0].getElementsByTagName('td')[2];
    	var name=tdName.getElementsByTagName('strong')[0].getElementsByTagName('a')[0].innerHTML;
    	allName[i]=name;
    }
    var reply_content=document.getElementsByClassName('reply_content');
    var content = new Array();


    for(var i=0;i<reply_content.length;i++){

    	content[i] = reply_content[i].innerHTML;
    	var splitByAt = new Array();
    	splitByAt = content[i].split('@');//将每一个reply_content类下的代码用@分割，如果有@的话就有可能但不一定@了人，没有则没有@人，
    	if(splitByAt.length!=0){
    		var someOneAted=reply_content[i].getElementsByTagName('a');
    		for(var j=0;j<someOneAted.length;j++){
    			var href = (someOneAted[j].href).split('/');//用于判断这个链接是不是链接到被@的人那里去，如果用户是在中途@其他人的话就需要进行判断了。
    			if(someOneAted[j].innerHTML==href[href.length-1]&&href[href.length-2]=="member"){
    				someOneAted[j].href="javascript:void(0);";
    				someOneAted[j].addEventListener('click',function(){
    					for(var z=0;z<allName.length;z++){
    						var tr=realCell[z].getElementsByTagName('tr');
    						var tdName=tr[0].getElementsByTagName('td')[2];
    						var name=tdName.getElementsByTagName('strong')[0].getElementsByTagName('a')[0];
    						name.setAttribute("style"," ");
    					}
    					for(var z=0;z<allName.length;z++){
    						if(allName[z]==this.innerHTML){
    							var tr=realCell[z].getElementsByTagName('tr');
    							var tdName=tr[0].getElementsByTagName('td')[2];
    							var name=tdName.getElementsByTagName('strong')[0].getElementsByTagName('a')[0];
    							name.setAttribute("style","color:red !important;");
    						}
    					}
    				},false);
    			}else{
    				continue;
    			}
    		}
    	}
    }
})();