// ==UserScript==
// @id             巴哈姆特文章輸入框高度設定
// @name           巴哈姆特文章輸入框高度設定
// @version        20180418
// @namespace      巴哈姆特文章輸入框高度設定
// @author         johnny860726
// @description    在巴哈姆特發表文章的時候提供設定輸入框高度的按鈕
// @include        *gamer.com.tw*
// @run-at         document-end
// @downloadURL https://update.greasyfork.org/scripts/40809/%E5%B7%B4%E5%93%88%E5%A7%86%E7%89%B9%E6%96%87%E7%AB%A0%E8%BC%B8%E5%85%A5%E6%A1%86%E9%AB%98%E5%BA%A6%E8%A8%AD%E5%AE%9A.user.js
// @updateURL https://update.greasyfork.org/scripts/40809/%E5%B7%B4%E5%93%88%E5%A7%86%E7%89%B9%E6%96%87%E7%AB%A0%E8%BC%B8%E5%85%A5%E6%A1%86%E9%AB%98%E5%BA%A6%E8%A8%AD%E5%AE%9A.meta.js
// ==/UserScript==

var l = 0, a, x, btn;

function setnewbtn(v,h){
	var btn = x.appendChild(document.createElement("button"));
	btn.setAttribute("type", "button");
    if(l==0){
		btn.setAttribute("style", "margin-left: 5px; margin-top:5px;");
    }else{
        btn.setAttribute("style", "margin-left: 5px;");
    }
	btn.innerHTML=v;
	btn.onclick = function(){a.style.height=h+"px";};
}

if((location.href.search("home.gamer.com.tw")!=-1)&&((location.href.search("creationNew1.php")!=-1)||(location.href.search("creationEdit1.php")!=-1))){
    l=0;
   	a = document.getElementsByTagName('iframe')[0];
	var i;
	var m=document.getElementsByClassName("ST1");
	for(i=0;i<m.length;i++){
	    if(m[i].textContent.search("（限 150000 個 byte）") != -1){
	        m[i].setAttribute("style", "margin-left: 5px;");
	        m[i].textContent = m[i].textContent.replace("（限 150000 個 byte）","高度設定");
	    }else if(m[i].textContent.search("（限 40 個中文字）") != -1){
	        m[i].textContent = m[i].textContent.replace("（限 40 個中文字）","");
	    }
	}
	if(a.id=="editor"){
	    x = document.getElementsByClassName('bahaRte')[0].parentNode;
		setnewbtn("預設",380);
	    btn = x.appendChild(document.createElement("button"));
	    btn.setAttribute("type", "button");
	    btn.innerHTML="+500";
	    btn.setAttribute("style", "margin-left: 5px;");
	    btn.onclick = function(){a.style.height = "" + (parseInt(a.style.height)+500) + "px"};
		setnewbtn("500",500);
		setnewbtn("700",700);
		setnewbtn("1000",1000);
	}
}else if((location.href.search("forum.gamer.com.tw")!=-1)&&(location.href.search("post1.php")!=-1)){
    l=1;
    a = document.getElementById("editor");
	if(a.id=="editor"){
		x = document.getElementsByClassName('FM-lbox3C')[0];
	    x.innerHTML += '高度設定 ';
		setnewbtn("預設",380);
	    btn = x.appendChild(document.createElement("button"));
	    btn.setAttribute("type", "button");
	    btn.innerHTML="+500";
	    btn.setAttribute("style", "margin-left: 5px;");
	    btn.onclick = function(){a.style.height = "" + (parseInt(a.style.height)+500) + "px"};
	    setnewbtn("500",500);
	    setnewbtn("700",700);
	    setnewbtn("1000",1000);
	}
}