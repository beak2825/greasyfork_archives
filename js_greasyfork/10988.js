// ==UserScript==
// @name		bahamut comment enhanced
// @namespace	http://userscripts/user
// @include		http://forum.gamer.com.tw/C.php?*
// @include		http://forum.gamer.com.tw/Co.php?*
// @include		https://forum.gamer.com.tw/C.php?*
// @include		https://forum.gamer.com.tw/Co.php?*
// @description	可調整巴哈姆特哈啦討論區留言的顯示順序(新留言在上或舊留言在上)、切換直接顯示留言者帳號、加入留言樓層數字、單獨開啟關閉某篇文章圖片影像
// @version		1.11.6
// @grant		GM_getValue
// @grant		GM_setValue
// @grant		GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/10988/bahamut%20comment%20enhanced.user.js
// @updateURL https://update.greasyfork.org/scripts/10988/bahamut%20comment%20enhanced.meta.js
// ==/UserScript==
//滑鼠移上留言時背景底色變化
GM_addStyle(".c-reply__item:hover {background-color : #eaeaea !important;}");
GM_addStyle(".c-reply__head .old-reply ,.reply-content__footer{margin-right: 20px !important;float:right !important;}");
GM_addStyle(".c-post__header__tools button {margin-left: 20px !important;}");
GM_addStyle(".reply-content__time {text-align:right !important; float:right !important;}");
GM_addStyle(".BCEf {color:#585858; margin:0 5px 0 -15px; float:left;}");
GM_addStyle(".BCEn {color:#282828;margin:0 8px 0 -8px;}");
GM_addStyle(".BCEs {text-align:left; float:left; margin-left:-15px; margin-right:35px;}");
//記錄最後使用的留言排列順序
var BHCOA;
var BHCO = GM_getValue("BHCO",false);
var rk = GM_getValue("BHCO",false);
var BHCNW = GM_getValue("BHCNW",false);
var BHCNE = GM_getValue("BHCNE",true);
var oldextendComment = unsafeWindow.extendComment;
var oldfoldedComment = unsafeWindow.foldedComment;
var oldforumexpandImage = unsafeWindow.Forum.Common.expandImage;
var oldforumexpandVideo = unsafeWindow.Forum.Common.expandVideo;
//在原函式 Forum.Common.expandImage 中加入新功能
function expandImage(e,a){
	var tmpn = a.parentElement;
	oldforumexpandImage(e,a);
	unsafeWindow.GamerImgOpenCheck(tmpn);
}
//在原函式 Forum.Common.expandVideo 中加入新功能
function expandVideo(e,a){
	var tmpn = a.parentElement;
	oldforumexpandVideo(e,a);
	unsafeWindow.GamerImgOpenCheck(tmpn);
}
//在原函式 extendComment 中加入新功能
function extendComment(bsn,snB){
	var cptext = "Commendlist_"+snB;
	var where = "showoldCommend_"+snB;
	var cptmp = unsafeWindow.document.getElementById(cptext).getElementsByClassName("c-reply__item");
	var ntmp = parseInt(unsafeWindow.document.getElementById(where).innerHTML.substring(42))+cptmp.length;
	oldextendComment(bsn,snB);
	BHCWait(cptmp,ntmp,unsafeWindow.document.getElementById(where).parentElement.firstElementChild.firstElementChild.innerHTML.substring(5));
	BHCOA = BHCO;
}
//在原函式 foldedComment 中加入新功能
function foldedComment(snB){
	oldfoldedComment(snB);
	var cptext = "Commendlist_"+snB;
	var where = "showoldCommend_"+snB;
	var cptmp = unsafeWindow.document.getElementById(cptext).getElementsByClassName("c-reply__item");
	if((parseInt(cptmp[0].id.substring(15))>parseInt(cptmp[1].id.substring(15)) && unsafeWindow.document.getElementById(where).parentElement.firstElementChild.firstElementChild.innerHTML.substring(5) == "↑")||(parseInt(cptmp[0].id.substring(15))<parseInt(cptmp[1].id.substring(15)) && unsafeWindow.document.getElementById(where).parentElement.firstElementChild.firstElementChild.innerHTML.substring(5) == "↓")){
		CommentOrder(cptmp,false);
		CommentAccountName(cptmp,true);
	}
	else{
		CommentOrder(cptmp,true);
		CommentAccountName(cptmp,true);
	}
}
//開啟所有舊留言，在讀取完留言後進行新功能
function BHCWait(cps,num,ud){
	if(cps.length<num && cps.length<6)
		window.setTimeout(function(){unsafeWindow.BHCWait(cps,num,ud)}, 50);
	else
		if(ud=="↑"){
			CommentOrder(cps,true,num);
			CommentAccountName(cps,true);
		}
		else{
			CommentOrder(cps,false,num);
			CommentAccountName(cps,true);
		}
}
//開啟全串文章圖像
function forumShowAllMedia(){
	var i,BHIA = unsafeWindow.document.getElementsByClassName("loadpic photoswipe-image-shrink");
	if(BHIA)
		for(i = BHIA.length-1; i > -1; i--)
			BHIA[i].click();
	var BHVA = unsafeWindow.document.getElementsByClassName("loadpic");
	if(BHVA)
		for(i = BHVA.length-1; i > -1; i--)
			BHVA[i].click();
}
//留言加入樓數、排列順序
function CommentOrder(BHCA,rkey,num){
	var l,k = BHCA.length;
	if(num && num>1000)
		l=num-1000;
	else
		l=0;
	if(k>0){
		var nodetmp1,nodetmp2,nodeIdtmp,nodeNametmp,j,m,nodeid,nodeName,showtmp;
		var SA = BHCA[0].parentElement.parentElement.firstElementChild.getElementsByTagName("span");
		if(SA.length > 0 && SA[0].parentElement.className == "more-reply")
			m = parseInt(SA[0].innerHTML.substring(2));
		else
			m = l;
		for(j = 0;j<parseInt(k/2);j++){
			if(BHCA[j].lastElementChild.firstElementChild.tagName == "BUTTON" || BHCA[j].lastElementChild.firstElementChild.tagName == "button"){
				var namenode1 = unsafeWindow.document.createElement("span");
				var namenode2 = unsafeWindow.document.createElement("span");
				var newnode1 = unsafeWindow.document.createElement("span");
				var newnode2 = unsafeWindow.document.createElement("span");
				namenode1.innerHTML = "&nbsp(" + BHCA[j].lastElementChild.lastElementChild.children[0].innerHTML + ")";
				namenode2.innerHTML = "&nbsp(" + BHCA[k-j-1].lastElementChild.lastElementChild.children[0].innerHTML + ")";
				namenode1.className = "BCEn";
				namenode2.className = "BCEn";
				newnode1.innerHTML = (j+1+m) + "&nbsp:";
				newnode2.innerHTML = (k-j+m) + "&nbsp:";
				newnode1.className = "BCEf";
				newnode2.className = "BCEf";
				newnode1.setAttribute("nickname",BHCA[j].lastElementChild.lastElementChild.children[0].innerHTML);
				newnode2.setAttribute("nickname",BHCA[k-j-1].lastElementChild.lastElementChild.children[0].innerHTML);
				newnode1.setAttribute("account",BHCA[j].lastElementChild.lastElementChild.children[0].href.substring(26));
				newnode2.setAttribute("account",BHCA[k-j-1].lastElementChild.lastElementChild.children[0].href.substring(26));
				BHCA[j].lastElementChild.insertBefore(newnode1,BHCA[j].lastElementChild.children[0]);
				BHCA[j].lastElementChild.lastElementChild.insertBefore(namenode1,BHCA[j].lastElementChild.lastElementChild.children[1]);
				BHCA[k-j-1].lastElementChild.insertBefore(newnode2,BHCA[k-j-1].lastElementChild.children[0]);
				BHCA[k-j-1].lastElementChild.lastElementChild.insertBefore(namenode2,BHCA[k-j-1].lastElementChild.lastElementChild.children[1]);
			}
			if(rkey){
				nodetmp1 = BHCA[j].cloneNode(true);
				nodetmp2 = BHCA[k-j-1].cloneNode(true);
				BHCA[j].parentElement.replaceChild(nodetmp2,BHCA[j]);
				BHCA[k-j-1].parentElement.replaceChild(nodetmp1,BHCA[k-j-1]);
			}
		}
		if(j == (k-j-1) && (BHCA[j].lastElementChild.firstElementChild.tagName == "BUTTON" || BHCA[j].lastElementChild.children[0].tagName == "button")){
			var namenode3 = unsafeWindow.document.createElement("span");
			var newnode3 = unsafeWindow.document.createElement("span");
			newnode3.innerHTML = (j+1+m) + "&nbsp:";
			newnode3.className = "BCEf";
			newnode3.setAttribute("nickname",BHCA[j].lastElementChild.lastElementChild.children[0].innerHTML);
			newnode3.setAttribute("account",BHCA[j].lastElementChild.lastElementChild.children[0].href.substring(26));
			namenode3.innerHTML = "&nbsp(" + BHCA[j].lastElementChild.lastElementChild.children[0].innerHTML + ")";
			namenode3.className = "BCEn";
			BHCA[j].lastElementChild.insertBefore(newnode3,BHCA[j].lastElementChild.children[0]);
			BHCA[j].lastElementChild.lastElementChild.insertBefore(namenode3,BHCA[j].lastElementChild.lastElementChild.children[1]);
		}
	}
}
//變更留言者帳號、暱稱
function CommentAccountName(BHCA,check){
	var k = BHCA.length;
	if(k>0){
		var j,AN,NN,sk;
		if(BHCNW)
			if(BHCNE)
				sk = 1;
			else
				sk = 2;
		else
			if(BHCNE)
				sk = 0;
			else
				sk = 3;
		if(check){
			var Ctmp = BHCA[0].parentElement.parentElement.getElementsByClassName("c-reply__head nocontent");
			if(Ctmp.length > 0)
				switch(sk){
					case 1:
						Ctmp[0].children[1].children[0].innerHTML = "帳號(暱稱)";
						break;
					case 2:
						Ctmp[0].children[1].children[0].innerHTML = "帳號";
						break;
					case 3:
						Ctmp[0].children[1].children[0].innerHTML = "頭像";
						break;
					default:
						Ctmp[0].children[1].children[0].innerHTML ="暱稱";
				}
		}
		for(j = 0;j<k;j++){
			var AC = BHCA[j].getElementsByClassName("reply-content__user");
			var AP = BHCA[j].getElementsByClassName("reply-avatar user--sm")
			NN = BHCA[j].lastElementChild.children[0].getAttribute("nickname");
			AN = BHCA[j].lastElementChild.children[0].getAttribute("account");
			switch(sk){
				case 1:
					AC[0].innerHTML = AN;
					AC[0].title = AN;
					AC[0].nextElementSibling.style = "display:inline-block !important;";
					AP[0].style = "display:none !important;";
					break;
				case 2:
					AC[0].innerHTML = AN;
					AC[0].title = NN;
					AC[0].nextElementSibling.style = "display:none !important;";
					AP[0].style = "display:none !important;";
					break;
				case 3:
					AC[0].innerHTML = NN;
					AC[0].title = AN;
					AC[0].nextElementSibling.style = "display:none !important;";
					AP[0].style = "display:block !important;";
					break;
				default:
					AC[0].innerHTML = NN;
					AC[0].title = AN;
					AC[0].nextElementSibling.style = "display:none !important;";
					AP[0].style = "display:none !important;";
			}
		}
	}
}
//調整留言排列順序
function GamerCommentReverse(event){
	var BHDivs =(event) ? event.currentTarget.parentElement.parentElement.getElementsByTagName("div") : unsafeWindow.document.getElementsByTagName("div");
	var ek = (event) ? true : false;
	if(event){
		rk = (rk) ? false : true;
		BHCO = rk;
		if(event.currentTarget.children[0].innerHTML == "↑留言順序↑")
			event.currentTarget.children[0].innerHTML = "↓留言順序↓";
		else
			event.currentTarget.children[0].innerHTML = "↑留言順序↑" ;
		GM_setValue("BHCO",rk);
	}
	for(i = 0;i < BHDivs.length;i++)
		if(BHDivs[i].id.substring(0,11) == "Commendlist"){
			var BHDivCA = BHDivs[i].getElementsByClassName("c-reply__item");
			CommentOrder(BHDivCA,ek||rk);
		}
}
//切換直接顯示留言者帳號
function GamerCommentNameSwitch(event){
	var ktmp;
	var BHDivs =(event) ? event.currentTarget.parentElement.parentElement.getElementsByTagName("div") : unsafeWindow.document.getElementsByTagName("div");
	if(event){
		if(BHCNW)
			if(BHCNE)
				BHCNE = false;
			else{
				BHCNW = false ;
				BHCNE = true;
			}
		else
			if(BHCNE){
				BHCNW = false;
				BHCNE = false;
			}
			else{
				BHCNW = true;
				BHCNE = true;
			}
		if(BHCNW)
			if(BHCNE)
				event.currentTarget.children[0].innerHTML = "帳號(暱稱)";
			else
				event.currentTarget.children[0].innerHTML = "帳號";
		else
			if(BHCNE)
				event.currentTarget.children[0].innerHTML = "暱稱";
			else
				event.currentTarget.children[0].innerHTML = "頭像";
		GM_setValue("BHCNW",BHCNW);
		GM_setValue("BHCNE",BHCNE);
	}
	for(i = 0;i < BHDivs.length;i++)
		if(BHDivs[i].id.substring(0,11) == "Commendlist"){
			var BHCs = BHDivs[i].getElementsByClassName("c-reply__item");
			CommentAccountName(BHCs);
		}
}
//更改開啟圖像為關閉圖像
function GamerChangeBtnToClose(BE){
	if(BE.className == "ef-btn btn-loadpic"){
		BE.className = "ef-btn btn-loadpic is-cancel";
		BE.title = "關閉本篇文章中全部開啟的圖片及影像";
		BE.removeEventListener('click',unsafeWindow.GamerOpenImage,true);
	}
	BE.addEventListener('click',unsafeWindow.GamerCloseImage,true);
}
//更改關閉圖像為開啟圖像
function GamerChangeBtnToOpen(BE){
	if(BE.className = "ef-btn btn-loadpic is-cancel"){
		BE.className = "ef-btn btn-loadpic";
		BE.title = "開啟本篇文章中全部的圖片及影像";
		BE.removeEventListener('click',unsafeWindow.GamerCloseImage,true);
	}
	BE.addEventListener('click',unsafeWindow.GamerOpenImage,true);
}
//開啟單篇文章的圖片、影像
function GamerOpenImage(event){
	var EDivA = event.currentTarget.parentElement.parentElement.nextElementSibling.getElementsByTagName("div");
	var i,j,Mid;
	for(i = 0;i < EDivA.length;i++){
		if(EDivA[i].className == "c-article__content"){
			var EIA = EDivA[i].getElementsByClassName("loadpic photoswipe-image-shrink");
			if(EIA)
				for(j = EIA.length-1; j > -1 ; j--)
					EIA[j].click();
			var EVA = EDivA[i].getElementsByClassName("loadpic");
			if(EVA)
				for(j = EVA.length-1; j > -1 ; j--)
					EVA[j].click();
		}
	}
}
//關閉單篇文章的圖片、影像
function GamerCloseImage(event){
	var EDivA = event.currentTarget.parentElement.parentElement.nextElementSibling.getElementsByTagName("div");
	GamerChangeBtnToOpen(event.currentTarget);
	var i,j,tmp;
	for(i = 0;i < EDivA.length;i++)
		if(EDivA[i].className == "c-article__content"){
			var EIEA = EDivA[i].getElementsByClassName("photoswipe-image");
			if(EIEA)
				for (j = EIEA.length-1; j > -1 ; j--){
					EIEA[j].setAttribute("data-src",EIEA[j].firstElementChild.getAttribute("data-src"));
					EIEA[j].innerHTML = '<i class="material-icons"></i><span>開啟圖片</span>';
					EIEA[j].setAttribute("onclick","Forum.Common.expandImage(event,this)");
					EIEA[j].className = "loadpic photoswipe-image-shrink";
				}
			var EVEA = EDivA[i].getElementsByClassName("videoWrapper video-youtube");
			if(EVEA)
				for(j = EVEA.length-1; j > -1; j--){
					tmp = EVEA[j].parentElement;
					var	newnode = unsafeWindow.document.createElement("a");
					newnode.href = EVEA[j].firstElementChild.getAttribute("data-src");
					newnode.innerHTML = '<i class="material-icons"></i><span>開啟影片</span>';
					newnode.setAttribute("onclick","Forum.Common.expandVideo(event,this)");
					newnode.setAttribute("data-type","video-youtube");
					newnode.className = "loadpic";
					tmp.insertBefore(newnode,EVEA[j]);
					tmp.removeChild(EVEA[j]);
				}
			var EREA = EDivA[i].getElementsByClassName("lazyloaded");
				for(j = EREA.length-1; j > -1; j--){
					tmp = EREA[j].parentElement;
					tmp.setAttribute("data-url",tmp.href);
					tmp.href = EREA[j].getAttribute("data-src");
					tmp.setAttribute("onclick","Forum.Common.expandImage(event,this)");
					tmp.innerHTML = '<i class="material-icons"></i><span>開啟圖片</span>';
					tmp.className = "loadpic";
				}
		}
}
//單篇文章的影像、圖片若已全部開啟，將開啟圖像改為關閉圖像
function GamerImgOpenCheck(elementA){
	var i,CTAA,CTC,pAtmp = elementA,ImgOpenF = true;
	while(pAtmp.className != "c-article__content")
		pAtmp = pAtmp.parentElement;
	CTAA = pAtmp.getElementsByTagName("a");
	for(i = 0; i < CTAA.length; i++)
		if(CTAA[i].className == "loadpic photoswipe-image-shrink" || CTAA[i].className == "loadpic"){
			ImgOpenF = false;
			break;
		}
	if(ImgOpenF){
		pAtmp = elementA;
		while(pAtmp.className != "c-post__body")
			pAtmp = pAtmp.parentElement;
		CTC = pAtmp.previousElementSibling.getElementsByClassName("c-post__header__tools");
		GamerChangeBtnToClose(CTC[0].lastElementChild);
	}
}
//加入改變留言順序的連結點
function BHCES(){
	unsafeWindow.BHCWait = exportFunction(BHCWait,unsafeWindow);
	unsafeWindow.extendComment = exportFunction(extendComment,unsafeWindow);
	unsafeWindow.foldedComment = exportFunction(foldedComment,unsafeWindow);
	unsafeWindow.GamerCommentReverse = exportFunction(GamerCommentReverse,unsafeWindow);
	unsafeWindow.GamerCommentNameSwitch = exportFunction(GamerCommentNameSwitch,unsafeWindow);
	unsafeWindow.forumShowAllMedia = exportFunction(forumShowAllMedia,unsafeWindow);
	unsafeWindow.GamerOpenImage = exportFunction(GamerOpenImage,unsafeWindow);
	unsafeWindow.GamerCloseImage = exportFunction(GamerCloseImage,unsafeWindow);
	unsafeWindow.GamerImgOpenCheck = exportFunction(GamerImgOpenCheck,unsafeWindow);
	unsafeWindow.Forum.Common.expandImage = exportFunction(expandImage,unsafeWindow);
	unsafeWindow.Forum.Common.expandVideo = exportFunction(expandVideo,unsafeWindow);
	GamerCommentReverse();
	GamerCommentNameSwitch();
	var BHDivA = unsafeWindow.document.getElementsByTagName("div");
	for(i = 0;i < BHDivA.length;i++){
		if(BHDivA[i].className == "c-post__footer c-reply"){
			var j,ANtmp,pchecked1 = false,pchecked2 = false,pchecked3 = false;
			var tmp = (BHCO) ? "↑" : "↓";
			if(BHCNW)
				ANtmp = (BHCNE) ? "帳號(暱稱)" : "帳號";
			else
				ANtmp = (BHCNE) ?  "暱稱" : "頭像";
			
			for(j = 0;j < BHDivA[i].children.length;j++){
				if(BHDivA[i].children[j].className == "c-reply__head nocontent")
					pchecked1 = true;
				if(BHDivA[i].children[j].id.substring(0,11) == "Commendlist" && BHDivA[i].children[j].children.length > 2)
					pchecked2 = true;
				else if(BHDivA[i].children[j].id.substring(0,11) == "Commendlist" && BHDivA[i].children[j].children.length > 0)
					pchecked3 = true;
			}
			if(!pchecked1){
				if(pchecked2){
					BHDivA[i].innerHTML = '<div class="c-reply__head nocontent"><span class="BCEs"><a href ="javascript:;" title="變換留言的顯示順序">'+tmp+'留言順序'+tmp+'</a></span><span class="BCEs"><a href ="javascript:;" title="切換顯示留言者的帳號、暱稱">'+ANtmp+'</a></span></div>' + BHDivA[i].innerHTML;
					BHDivA[i].children[0].children[0].addEventListener('click',unsafeWindow.GamerCommentReverse,true);
					BHDivA[i].children[0].children[1].addEventListener('click',unsafeWindow.GamerCommentNameSwitch,true);
				}
				else if(pchecked3){
					BHDivA[i].innerHTML = '<div class="c-reply__head nocontent"><span class="BCEs"><a href ="javascript:;" title="切換顯示留言者的帳號、暱稱">'+ANtmp+'</a></span></div>' + BHDivA[i].innerHTML;
					BHDivA[i].children[0].children[0].addEventListener('click',unsafeWindow.GamerCommentNameSwitch,true);
				}
			}
			else{
				BHDivA[i].children[0].innerHTML = '<span class="BCEs"><a href ="javascript:;" title="變換留言的顯示順序">'+tmp+'留言順序'+tmp+'</a></span><span class="BCEs"><a href ="javascript:;" title="切換顯示留言者的帳號、暱稱">'+ANtmp+'</a></span>' + BHDivA[i].children[0].innerHTML;
				BHDivA[i].children[0].children[0].addEventListener('click',unsafeWindow.GamerCommentReverse,true);
				BHDivA[i].children[0].children[1].addEventListener('click',unsafeWindow.GamerCommentNameSwitch,true);
			}
		}
		//修改開啟圖片按鈕的連結點
		if(BHDivA[i].className == "c-post__header__tools"){
			var k,l,Iflag = false,Oflag = true;
			tmp = "";
			if(BHDivA[i].children.length > 1){
				for(k = 1;k < BHDivA[i].children.length;k++)
					tmp += BHDivA[i].children[k].outerHTML;
			}
			BHDivA[i].innerHTML = tmp;
			var BHDivAA = BHDivA[i].parentElement.parentElement.getElementsByTagName("div");
			for(k = 0;k < BHDivAA.length;k++)
				if(BHDivAA[k].className == "c-article__content"){
					var EIA = BHDivAA[k].getElementsByClassName("loadpic photoswipe-image-shrink");
					var EVA = BHDivAA[k].getElementsByClassName("loadpic");
					var EIEA = BHDivAA[k].getElementsByClassName("photoswipe-image");
					var EVEA = BHDivAA[k].getElementsByClassName("videoWrapper video-youtube");
					if(EIA.length>0 || EVA.length>0 || EIEA.length>0 || EVEA.length>0){
						Iflag = true;
						if(EIA.length>0 || EVA.length>0)
							Oflag = false;
					}
				}
			if(Iflag){
				var	newnode = unsafeWindow.document.createElement("button");
				if(Oflag){
					newnode.title = "關閉本篇文章中全部開啟的圖片及影像";
					newnode.className = "ef-btn btn-loadpic is-cancel";
					newnode.addEventListener('click',unsafeWindow.GamerCloseImage,true);
				}
				else{
					newnode.title = "開啟本篇文章中全部的圖片及影像";
					newnode.className = "ef-btn btn-loadpic";
					newnode.addEventListener('click',unsafeWindow.GamerOpenImage,true);
				}
				newnode.innerHTML='<div class="ef-btn__effect"><i class="icon-font">圖</i></div>';
				BHDivA[i].appendChild(newnode);
			}
		}
	}
	//將原有的開啟所有圖片按鈕移到上面的浮動功能列
	var newLi = unsafeWindow.document.createElement("li");
	newLi.innerHTML = '<a href="javascript:;" title="開啟整串文章所有的圖片及影像">圖像全開</a>';
	newLi.addEventListener('click',unsafeWindow.forumShowAllMedia,true);
	var BHMenu = unsafeWindow.document.getElementById("BH-menu-path");
	var BHMenuULA = BHMenu.getElementsByTagName("ul");
	BHMenuULA[0].insertBefore(newLi,BHMenuULA[0].children[6]);
}
BHCES();
