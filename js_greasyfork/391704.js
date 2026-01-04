// ==UserScript==
// @name	ExpandPIXNETAlbum 圖片RUL列表
// @version	0.0.20110705.3
// @namespace	https://greasyfork.org/zh-TW/scripts/391704-expandpixnetalbum-%E5%9C%96%E7%89%87rul%E5%88%97%E8%A1%A8
// @description	展開 PIXNET 相簿
// @homepage	https://greasyfork.org/zh-TW/scripts/391704-expandpixnetalbum-%E5%9C%96%E7%89%87rul%E5%88%97%E8%A1%A8
// @include	http://*.pixnet.net/album/set/*
// @include http://*.pixnet.net/album/photo/*
// @include http://*.pixnet.net/album/hot
// @downloadURL https://update.greasyfork.org/scripts/391704/ExpandPIXNETAlbum%20%E5%9C%96%E7%89%87RUL%E5%88%97%E8%A1%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/391704/ExpandPIXNETAlbum%20%E5%9C%96%E7%89%87RUL%E5%88%97%E8%A1%A8.meta.js
// ==/UserScript==

(function(){
    if (!document.location.href.match('/album/set/')) {
	return;
    }

    var htmlCode = '';
    //var big =document.createElement("div");
    //big.className='content-1 content-narrow narrow-big';
    document.getElementById('content').setAttribute('class','content-1 content-narrow narrow-big');
    var contentBody = document.getElementById('left-column-1');
    //var contentBody = document.getElementsByClassName('photo-grid-list');
    var imageThumbs = contentBody.getElementsByClassName('thumb');
    var imageThumbsLength = imageThumbs.length;
    var page=contentBody.getElementsByClassName('page');
    htmlCode +=contentBody.innerHTML;
    if(imageThumbsLength>90){
		imageThumbsLength=90;
		}
    for (var i = 0; i < imageThumbsLength; i++) {
	try {
	    var el = imageThumbs[i];
	    var imgLink = el.parentNode.href;
	    var imgNewUrl = el.src.replace(/_[stq]/, '');
	    var altv=el.alt;
	   
	    
	    // htmlCode += '<a href="' + imgNewUrl + '"><img alt="" src="' + imgNewUrl + '"></a><br>'+altv+'&nbsp;&nbsp;&nbsp;<A HREF="'+imgNewUrl+'"target="_blank" >'+imgNewUrl+' </A><br><A HREF="'+ imgLink +'"target="_blank">'+ imgLink +'</A><br><br>';
	    	    
	    	    htmlCode += ''+altv+'&nbsp;&nbsp;&nbsp;<A HREF="'+imgNewUrl+'"target="_blank" >'+imgNewUrl+' </A><br>';
	} catch(err) {
	}
	}

	//for(var i=0;i<page.length;i++){

	
	//}
	
    contentBody.innerHTML = htmlCode;

})();
