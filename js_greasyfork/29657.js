// ==UserScript==
// @name        KeepVid Helper
// @namespace   http://keepvid.com/
// @version     1.4.1
// @description This userscript assists KeepVid in fetching download links. Mainly used as an alternative to the Java option currently provided.
// @copyright   2014+, KeepVid
// @icon        http://keepvid.com/userscript/icon128.png
// @icon64      http://keepvid.com/userscript/icon64.png
// @homepage    http://keepvid.com/extensions
// updateURL   http://10.11.4.89/keepvid-helper.meta.js
// downloadURL http://10.11.4.89/keepvid-helper.user.js
// @require    http://code.jquery.com/jquery-1.11.0.min.js

// @include     http://*
// @include     https://*

// @run-at      document-start
// @connect     dailymotion.com
// @connect     vimeo.com
// @connect     cloudy.ec
// @connect     novamov.com
// @connect     soundcloud.com
// @connect     youtube.com
// @connect     ytimg.com
// @connect     *
// @grant       GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/29657/KeepVid%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/29657/KeepVid%20Helper.meta.js
// ==/UserScript==

var AttachStyleEnum = {
    AttachOuterTopLeft: 0, 
    AttachOuterTopRight: 1, 
    AttachOuterBottomLeft: 2, 
    AttachOuterBottomRight: 3, 
    AttachInnerTopLeft: 4, 
    AttachInnerTopRight: 5, 
    AttachInnerBottomLeft: 6, 
    AttachInnerBottomRight: 7
};

//请求,网页请求
var xhr = new XMLHttpRequest();
var facebookDom;
var isRequesting;
var requestHtml; 

//$(document).ready(function(){
//    keepvid.CheckAllWebsiteLink();
//});
window.onload=function(event){
	keepvid.requestHtml= null;
	keepvid.CheckAllWebsiteLink();
};

if("undefined" == typeof (keepvid)) {
    var keepvid = {
        buttonList: [],
        isInitialAdjustPos: false,
        mouseOutTimer: null,

        getBrowserIndent: function()
        {
            var ua = window.navigator.userAgent.toLowerCase();

            if(ua.indexOf("chrome")>0) {
                return "chrome";
            }
            else if(ua.indexOf("firefox")>0){
                return "firefox";
            }
            else if(ua.indexOf("safari")>0) {
                return "safari";
            } 
            else {
                return "";
            } 
        },

        // Get Element Position
        getElementPos: function(el) {
            var ua = window.navigator.userAgent.toLowerCase();
            var isOpera = (ua.indexOf('opera') != -1);
            var isIE = (ua.indexOf('msie') != -1 && !isOpera); // not opera spoof
            if (el.parentNode === null || (el.style != null && el.style.display == 'none')) {
                return false;
            }
            var parent = null;
            var pos = [];
            var box;
            if (el.getBoundingClientRect) {      // IE
                box = el.getBoundingClientRect();
                var scrollTop = Math.max(document.documentElement.scrollTop, document.body.scrollTop);
                var scrollLeft = Math.max(document.documentElement.scrollLeft, document.body.scrollLeft);
                return {
                    x: box.left + scrollLeft,
                    y: box.top + scrollTop
                };
            } 
            else if (document.getBoxObjectFor) { // gecko
                box = document.getBoxObjectFor(el);
                var borderLeft = (el.style.borderLeftWidth) ? parseInt(el.style.borderLeftWidth) : 0;
                var borderTop = (el.style.borderTopWidth) ? parseInt(el.style.borderTopWidth) : 0;
                pos = [box.x - borderLeft, box.y - borderTop];
            } 
            else {                              // safari & opera   
                pos = [el.offsetLeft, el.offsetTop];
                parent = el.offsetParent;
                if (parent != el) {
                    while (parent) {
                        pos[0] += parent.offsetLeft;
                        pos[1] += parent.offsetTop;
                        parent = parent.offsetParent;
                    }
                }

                if (ua.indexOf('opera') != -1 || (ua.indexOf('safari') != -1 && (el.style != null && el.style.position == 'absolute'))) {
                    pos[0] -= document.body.offsetLeft;
                    pos[1] -= document.body.offsetTop;
                }
            }

            if (el.parentNode) {
                parent = el.parentNode;
            }
            else {
                parent = null;
            }

            while (parent && parent.tagName != 'BODY' && parent.tagName != 'HTML') { // account for any scrolled ancestors
                pos[0] -= parent.scrollLeft;
                pos[1] -= parent.scrollTop;
                if (parent.parentNode) {
                    parent = parent.parentNode;
                }
                else {
                    parent = null;
                }
            }
            return {
                x: pos[0],
                y: pos[1]
            };
        }, 

        calculateButtonPos: function(attachedElement, buttonDiv, attachStyle) {
            // alter the button's position
            var btnWidth = buttonDiv.offsetWidth;
            var btnHeight = buttonDiv.offsetHeight;
            var pos = this.getElementPos(attachedElement);
            var beforeChildLeft = pos.x;
            var beforeChildTop = pos.y;
            var divLeft = 0;
            var divTop = 0;
            switch (attachStyle) {
                case AttachStyleEnum.AttachOuterTopLeft: {
                    divLeft = beforeChildLeft;
                    divTop = beforeChildTop - btnHeight;
                    break;
                }
                case AttachStyleEnum.AttachOuterTopRight: {
                    divLeft = beforeChildLeft + attachedElement.offsetWidth - btnWidth;
                    divTop = beforeChildTop - btnHeight;
                    break;
                }
                case AttachStyleEnum.AttachOuterBottomLeft: {
                    divLeft = beforeChildLeft;
                    divTop = beforeChildTop + attachedElement.offsetHeight;
                    break;
                }
                case AttachStyleEnum.AttachOuterBottomRight: {
                    divLeft = beforeChildLeft + attachedElement.offsetWidth - btnWidth;
                    divTop = beforeChildTop + attachedElement.offsetHeight;
                    break;
                }
                case AttachStyleEnum.AttachInnerTopLeft: {
                    divLeft = beforeChildLeft;
                    divTop = beforeChildTop;
                    break;
                }
                case AttachStyleEnum.AttachInnerTopRight: {
                    divLeft = beforeChildLeft + attachedElement.offsetWidth - btnWidth;
                    divTop = beforeChildTop;
                    break;
                }
                case AttachStyleEnum.AttachInnerBottomLeft: {
                    divLeft = beforeChildLeft;
                    divTop = beforeChildTop + attachedElement.offsetHeight - btnHeight;
                    break;
                }
                case AttachStyleEnum.AttachInnerBottomRight: {
                    divLeft = beforeChildLeft + attachedElement.offsetWidth - btnWidth;
                    divTop = beforeChildTop + attachedElement.offsetHeight - btnHeight;
                    break;
                }
            }
            return {
                x: divLeft, 
                y: divTop
            };
        }, 

        // Adjuest The Download Button Element
        adjustAttachButtonPos: function() {
            for (var i = 0; i < keepvid.buttonList.length; i++) {
                attachedElement = keepvid.buttonList[i].attachedElement;
                buttonDiv = keepvid.buttonList[i].buttonDiv;
                attachStyle = keepvid.buttonList[i].attachStyle;

                var divPos = keepvid.calculateButtonPos(attachedElement, buttonDiv, attachStyle);
                buttonDiv.style.left = divPos.x.toString() + 'px';
                buttonDiv.style.top = divPos.y.toString() + 'px';
            }
        },

        // 附 加 按 钮
        attachButtonDiv: function(attachedElement, attachStyle, buttonCaption, buttonLink, divId, buttonId,videoName) {
            // Create div element
            //alert(buttonLink);
            if (!attachedElement) return;
            for (var i = 0; i < this.buttonList.length; i++) {
                if (this.buttonList[i].attachedElement == attachedElement) {
                    return this.buttonList[i].buttonDiv;
                }
            };
            var downloadDiv = document.createElement("div");
            //      downloadDiv.setAttribute("id", "ws");       //[safari]
            downloadDiv.setAttribute("style", "z-index: 2147483647; background: transparent; position: absolute;");
            downloadDiv.style.width = 106 + 'px';
            downloadDiv.style.height = 31 + 'px';
            downloadDiv.style.backgroundImage = "url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGoAAAAfCAYAAAAPzljlAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA3ppVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTMyIDc5LjE1OTI4NCwgMjAxNi8wNC8xOS0xMzoxMzo0MCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDpmYzU1NTE0Ny1hZjM2LTQ3NGItOTBlNS0xYjBiZmU2MGNmMjkiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6QTYyODQ4N0U2QkZCMTFFNjlGNUNENzEzOTIwRjVFNUIiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6QTYyODQ4N0Q2QkZCMTFFNjlGNUNENzEzOTIwRjVFNUIiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTUuNSAoTWFjaW50b3NoKSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjMzODY0MGRjLTZiN2EtNDg0Ni1iYjNhLTM5OTQ3YmY0N2ZhZSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpmYzU1NTE0Ny1hZjM2LTQ3NGItOTBlNS0xYjBiZmU2MGNm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)";
            downloadDiv.style.cursor = "pointer";
            if (divId)  downloadDiv.setAttribute("id", divId);

            downloadDiv.style.visibility = 'visible';
			if(location.href.indexOf("instagram.com")>0)
				downloadDiv.style.visibility = 'hidden';

            // Create button element
            var btnDownload = document.createElement("a");
            //btnDownload.setAttribute("class", "fantasybutton");
            var realLink = "http://keepvid.com/?url=" + buttonLink;
            if(videoName !== undefined){
                realLink+="&videoName="+videoName;
            }
            realLink += "&from=plugin#downloader";
            // if(this.getBrowserIndent() == "firefox")
            //  btnDownload.setAttribute("href", realLink);
            // else if(this.getBrowserIndent() == "chrome")
            //  downloadDiv.onclick = function () {
            //  //btnDownload.onclick = function () {
            //      downloadDiv.style.visibility = 'hidden';
            //      myWindow1 = window.open(realLink, '_blank', '');
            //               myWindow1.focus();
            //  };
            //  //downloadDiv.href = buttonLink;

            // else if(this.getBrowserIndent() == "safari") {
            //  //btnDownload.setAttribute("href", "javascript:void(0);");
            //  btnDownload.setAttribute("href", realLink);
            //  //btnDownload.addEventListener("click", function(){this.blur(); window.location.href = buttonLink; downloadDiv.style.visibility = 'hidden'; return false; });
            //  btnDownload.addEventListener("click", function(){this.blur(); downloadDiv.style.visibility = 'hidden'; return false; });

            // }

            downloadDiv.onclick = function () {
                //btnDownload.onclick = function () {
                if(location.href.indexOf("facebook.com")< 0){
                    downloadDiv.style.visibility = 'hidden';
                }
                myWindow1 = window.open(realLink, '_blank', '');
                myWindow1.focus();
            };
            btnDownload.style.cursor = "pointer";
            var btnText = document.createElement("span");
            if (buttonCaption) btnText.innerHTML = buttonCaption;
            btnDownload.appendChild(btnText);

            downloadDiv.appendChild(btnDownload);     
            var body = document.body;
            body.insertBefore(downloadDiv, body.lastChild);

            var divPos = this.calculateButtonPos(attachedElement, downloadDiv, attachStyle);

            downloadDiv.style.left = divPos.x.toString() + 'px';
            downloadDiv.style.top = divPos.y.toString() + 'px';

            // initial onresize event
            if (!this.isInitialAdjustPos) {
                window.addEventListener("resize", keepvid.adjustAttachButtonPos, false);
                //window.addEventListener("DOMNodeInserted", WSCore.adjustAttachButtonPos, false);
                this.isInitialAdjustPos = true;
            }

            // push attachButtonInfo into attachButtonList
            var attachButtonInfo = {attachedElement: attachedElement, buttonDiv: downloadDiv, attachStyle: attachStyle};
            this.buttonList.push(attachButtonInfo);

            return downloadDiv;
        },

        //返回按钮对象
        getButtonElement: function(attachedElement) {
            for (var i = 0; i < keepvid.buttonList.length; i++) {
                if (attachedElement == keepvid.buttonList[i].attachedElement) 
                    return keepvid.buttonList[i].buttonDiv;
            }
        },

        showElement: function(el) {
            //  if (WSCore.timeoutHandle) clearTimeout(this.timeoutHandle);
            if (el) {
                if (keepvid.mouseOutTimer) clearTimeout(keepvid.mouseOutTimer);
                el.style.visibility = "visible";

            }
        }, 

        delayHideElement: function(el) {
            //  if (WSCore.timeoutHandle) clearTimeout(this.timeoutHandle);
            if (el) {
                el.style.visibility = "hidden";
            }
        },

        handleVideoMouseoverEvent: function(event) {
            //console.log("绑定新的DIV");
            for (i = 0; i < keepvid.buttonList.length; i++) {
                if (event.target == keepvid.buttonList[i].attachedElement) {
                    if (keepvid.mouseOutTimer) {clearTimeout(keepvid.mouseOutTimer);}
                    keepvid.adjustAttachButtonPos();
                    keepvid.buttonList[i].buttonDiv.style.visibility = "visible";
                    return;
                }
            }

            for (i = 0; i < keepvid.buttonList.length; i++) {
                if (event.target == keepvid.buttonList[i].buttonDiv) {
                    if (keepvid.mouseOutTimer) { clearTimeout(keepvid.mouseOutTimer); }
                    keepvid.buttonList[i].buttonDiv.style.visibility = "visible";
                    return;
                }
            }
        },

        handleVideoMouseoutEvent: function(event) {
            for (i = 0; i < keepvid.buttonList.length; i++) {
                if (event.target == keepvid.buttonList[i].attachedElement) {
                    el = keepvid.buttonList[i].buttonDiv;
                    keepvid.mouseOutTimer = setTimeout(function () {el.style.visibility = "hidden";}, 500);
                    return;
                }
            }

            for (i = 0; i < keepvid.buttonList.length; i++) {
                if (event.target == keepvid.buttonList[i].buttonDiv) {
                    el = event.target;
                    keepvid.mouseOutTimer = setTimeout(function () {el.style.visibility = "hidden";}, 500);
                    return;
                }
            }
        },
        currentUrl:null,
        handleDocumentMouseOverEvent: function(event) {            
			var desktopType = document.getElementsByTagName('body')[0].getAttribute('desktopType');
			if(desktopType!=undefined && desktopType!=null && desktopType!=''){
				return;
			}
			if(location.href.indexOf('.mp4')>=0) return;
            if(event.target.tagName=='IFRAME' && location.href.indexOf("facebook.com")>=0){
                //keepvidHref
                var savedUrl = $($(event.target).parent().parent()[0]).attr('keepvidHref');
                var downloadUrlId = $($(event.target).parent().parent()[0]).attr('downloadButtonId');
                currentUrl = savedUrl;
                //如果下载按钮已经创建过的，直接显示
                if(savedUrl !==null && savedUrl !== undefined && downloadUrlId!==null && downloadUrlId!==undefined){
                    //alert($(event.target).parent()[0].id);
                    $('#'+downloadUrlId).css("visibility","visible");
                    $('#'+downloadUrlId).css("left",$($(event.target).parent().parent()[0]).attr('downloadButtonleft'));
                    $('#'+downloadUrlId).css("top",$($(event.target).parent().parent()[0]).attr('downloadButtontop'));
                    return;
                }
            }
            //facebook不需要这个，直接用最下面的方法去查询调用。 || (event.target.toString().indexOf("HTMLIFrameElement") != -1) event.target instanceof HTMLIFrameElement ||
            if(location.href.indexOf("facebook.com")<0){
                if (event.target instanceof HTMLEmbedElement || event.target instanceof HTMLObjectElement ||  event.target instanceof HTMLVideoElement ||
                    (event.target.toString().indexOf("HTMLEmbedElement") != -1) || (event.target.toString().indexOf("HTMLObjectElement") != -1)||
                    (event.target.toString().indexOf("HTMLVideoElement") != -1)) {
					var downloadDiv;
					if( (location.href.indexOf('123movies.is')>=0||location.href.indexOf('123movieshd.to')>=0
							||location.href.indexOf('gomovies.to')>=0)
							&& event.target instanceof HTMLVideoElement ){
						var srcHref = $(event.target).attr('src');
						var title = $('.mvic-desc h3')==undefined?document.title:$('.mvic-desc h3')[0].innerText;
						downloadDiv = keepvid.attachButtonDiv(event.target, AttachStyleEnum.AttachOuterTopRight, "", encodeURIComponent(srcHref),undefined,undefined,title);
					}
					else{
						downloadDiv = keepvid.attachButtonDiv(event.target, AttachStyleEnum.AttachOuterTopRight, "", location.href);
					}
                    if (keepvid.mouseOutTimer) { clearTimeout(keepvid.mouseOutTimer); }
                    downloadDiv.style.visibility = "visible";
                    keepvid.bindEvent(event.target, downloadDiv);
                }
            }
            if(location.href.indexOf("facebook.com")<0){
				keepvid.instagram();
                keepvid.vimeo();
                keepvid.vevo();
                keepvid.discovery();
                keepvid.liveleak();
                keepvid.nbcnews();
            }
            //facebook只有在Video标签才去允许下载
            if(event.target.tagName == "VIDEO" && location.href.indexOf("facebook.com")>=0){
				//先看是不是已经拿过了，如果拿过了就不管了，直接用
				var destUrl = $($(event.target).parent().parent()[0]).attr('keepvidHref');
				var video_id = $($(event.target).parent().parent()[0]).attr('video_id');
				if(destUrl!=null && destUrl!= undefined){
					var downloadUrlId = 'FaceBookVideo_' + video_id;
					if(downloadUrlId!==null && downloadUrlId!==undefined){						
						$('#'+downloadUrlId).css("visibility","visible");
					}
					else{
						var downloadDiv = keepvid.attachButtonDiv(event.target, AttachStyleEnum.AttachOuterTopRight, "", encodeURIComponent(destUrl),undefined,undefined,'FaceBookVideo_' + video_id);
						keepvid.bindEvent(event.target, downloadDiv);
					}
					return;
				}
				else{
					keepvid.facebook(event.target);
				}
            }
            if((event.target.tagName=="DIV" || event.target.tagName=="A") && location.href.indexOf("facebook.com")>=0){
                keepvid.facebookOutLink(event.target);
            }
			//暂时不要tumblr的内链
			//if(event.target.tagName=="DIV" && location.href.indexOf("tumblr.com")>=0){
			//	keepvid.tumblrInnerLink(event.target);
			//}
        },

        bindEvent: function(element, buttonDiv) {
            element.addEventListener("mouseover", keepvid.handleVideoMouseoverEvent, false);
            element.addEventListener("mouseout", keepvid.handleVideoMouseoutEvent, false);
            buttonDiv.addEventListener("mouseover", keepvid.handleVideoMouseoverEvent, false);
            buttonDiv.addEventListener("mouseout", keepvid.handleVideoMouseoutEvent, false);
            buttonDiv.addEventListener("mousemove", keepvid.handleVideoMouseoverEvent, false);
        },
		
		//暂时不要tumblr的内链
		//tumblrInnerLink:function(targetDom){
		//	alert('asdasd');
		//	if (location.href.indexOf("tumblr.com") >= 0) {
		//		var parentDivNode = targetDom.parentNode;
		//		//如果是视频的话，应该可以从他下面获取到Video标签
		//		var videoElement = $(targetDom).find('video');
		//		var srcElement = $(videoElement).find('source');
		//		
		//		var destURL= $(srcElement).attr('src');
		//		var sourceAddrType= $(srcElement).attr('type');
		//		
		//		var videoId = $(videoElement).attr('id');
		//		//embed-5832961698132629339048_html5_api
		//		if(sourceAddrType.indexOf('mp3')>=0|| sourceAddrType.indexOf('mp4')>=0){					
		//			var downloadDiv = keepvid.attachButtonDiv(targetDom, AttachStyleEnum.AttachOuterTopRight, "", destURL,undefined,undefined,videoId);
		//			keepvid.bindEvent(targetDom, downloadDiv);
		//		}
		//	}
		//},

        vimeo: function() {
            if (location.href.indexOf("vimeo.com") >= 0) {
                var els = document.getElementsByTagName("video");
                for (var i = 0; i < els.length; i++) {
                    var el = els[i].parentNode.parentNode.parentNode.nextSibling;
                    if (el && (el instanceof HTMLDivElement) && el.className == "target") {
                        var downloadDiv = keepvid.attachButtonDiv(el, AttachStyleEnum.AttachOuterTopRight, "", location.href);
                        keepvid.bindEvent(el, downloadDiv);
                    }
                }
            }
        },
		
		instagram: function() {
            if (location.href.indexOf("instagram.com") >= 0) {
                var els = document.getElementsByTagName("video");
                for (var i = 0; i < els.length; i++) {
                    var el = els[i].parentNode.parentNode.parentNode.nextSibling;
					var dlUrl = els[i].src;
					if(dlUrl.indexOf("?") >= 0)
						dlUrl = dlUrl.split('?')[0];
					var strArr = dlUrl.split('_');
					var point = strArr.length - 2;
					if(point>0)
						videoId = strArr[point];
					else
						videoId = new Date().getTime();
					var videoName = encodeURIComponent("InstagramVideo_" + videoId.toString());
					var imgTar = els[i].nextSibling;
					var img = '';
					if(imgTar && imgTar.className == "_cr348"){
						img = '&img=' + encodeURIComponent(imgTar.src);
					}
                    if (el && el.className == "_c2kdw") {
                        var downloadDiv = keepvid.attachButtonDiv(el, AttachStyleEnum.AttachOuterTopRight, "", encodeURIComponent(els[i].src) + '&videoName='+videoName+img);
						if(document.getElementsByClassName('_nljxa').length>0)
							downloadDiv.style.position = 'fixed';
                        keepvid.bindEvent(el, downloadDiv);
                    }
					else{
						var el = els[i].parentNode.parentNode.nextSibling;
						if (el && el.className == "_c2kdw") {
							var downloadDiv = keepvid.attachButtonDiv(el, AttachStyleEnum.AttachOuterTopRight, "", encodeURIComponent(els[i].src) + '&videoName='+videoName+img);
							if(document.getElementsByClassName('_nljxa').length>0)
								downloadDiv.style.position = 'fixed';
							keepvid.bindEvent(el, downloadDiv);
						}
					}
                }
            }
        },

        facebook: function(targetDom){
            if(isRequesting) return;
            var destURL;
			facebookDom = targetDom;
			//这里要获取地址
			var parentsList = $(targetDom).parents();
			var currentVideoDiv;
			for(var i=0;i<parentsList.length;i++){
				if(($(parentsList[i]).attr('class')==null || $(parentsList[i]).attr('class')== undefined) && ($(parentsList[i]).attr('data-ft')==null ||$(parentsList[i]).attr('data-ft')==undefined)){
					currentVideoDiv = parentsList[i];
					break;
				}
			}
			var spanList = $(currentVideoDiv).find('span');
			var spanDom;
			for(var i=0;i<spanList.length;i++){
				if($(spanList[i]).attr('class')=='timestampContent'){
					spanDom = spanList[i];
					break;
				}
			}
			//如果span没有找到，可能当前就是详情页面，所以直接找stream_pagelet这个节点下的span
	        if(spanDom==undefined || spanDom ==null)
	        	spanDom = $('.timestampContent');
			var videoUrl = 'https://www.facebook.com' + $($(spanDom).parent().parent()).attr('href');
			var checkCurrentResult = false;
			if(requestHtml!= undefined && requestHtml!= null){
				checkCurrentResult = keepvid.facebookInnerLinkCheck(requestHtml,videoUrl);
			}
			if(checkCurrentResult== false){
				keepvid.RequestFaceBookDownloadUrl(videoUrl);
			}
            //只接受facebook的网站的东西
            //if(location.href.indexOf("facebook.com")>=0){
            //    //这里要区分两类，第一类是直接从页面上能找到的，找不到的时候再去保存链接里面找，再找不到就没办法了
			//	//1找到当前Video标签的父节点中包含有data-testid="fbfeed_story"属性的div
			//	var hyperfeedId;
			//	var divList = $(targetDom).parents();
			//	for(var i=0;i<divList.length;i++){
			//		if($(divList[i]).attr('data-referrer')==$(divList[i]).attr('id') && $(divList[i]).attr('data-referrer')!= undefined && $(divList[i]).attr('data-referrer')!= null){
			//			hyperfeedId = $(divList[i]).attr('id');
			//			break;
			//		}
			//	}
            //    if(hyperfeedId!=null && hyperfeedId!= undefined){
			//		var marksScriptIndex;
			//		//遍历所有script
			//		for(var i=0;i<document.scripts.length;i++){
			//			if(document.scripts[i].innerHTML.indexOf(hyperfeedId)>=0){
			//				marksScriptIndex = i;
			//				break;
			//			}
			//		}
			//		var sourceUrlScript= document.scripts[marksScriptIndex + 1].innerHTML;
			//		if(sourceUrlScript.indexOf('"'+$(targetDom).attr('id')+'"')<0){
			//			return;
			//		}
            //        var pattern = new RegExp('sd_src_no_ratelimit:".*?",','gi');  //匹配单个script标签内容的写法
			//		var matchArr = pattern.exec(sourceUrlScript);
			//		if(matchArr!=null && matchArr.length>0){
			//			destURL= matchArr[0].replace('sd_src_no_ratelimit:"','').replace('",','');
			//		}
			//		if(destURL==null ||destURL == undefined){
			//			pattern = new RegExp('hd_src_no_ratelimit:".*?",','gi');
			//			var matchArr = pattern.exec(sourceUrlScript);
			//			if(matchArr!=null && matchArr.length>0){
			//				destURL = matchArr[0].replace('hd_src_no_ratelimit:"','').replace('",','');
			//			}
			//		}
			//		if(destURL==null ||destURL == undefined){
			//			pattern = new RegExp('hd_src:".*?",','gi');
			//			var matchArr = pattern.exec(sourceUrlScript);
			//			if(matchArr!=null && matchArr.length>0){
			//				destURL = matchArr[0].replace('hd_src:"','').replace('",','');
			//			}
			//		}
			//		if(destURL==null ||destURL == undefined){
			//			pattern = new RegExp('sd_src:".*?",','gi');
			//			var matchArr = pattern.exec(sourceUrlScript);
			//			if(matchArr!=null && matchArr.length>0){
			//				destURL = matchArr[0].replace('sd_src:"','').replace('",','');
			//			}
			//		}
			//		if(destURL==null ||destURL == undefined){
			//			destURL = location.href;
			//		}
            //        //alert("添加事件");出来的链接直接传递到按钮，跳转，Keepvid网站可能需要修改来检测下载资源。
            //        //客户端同步需要能够直接接受http://www.facebook.com/video/wanglihong.mp4?参数1=0&参数2=0这种地址
            //        var downloadDiv = keepvid.attachButtonDiv(targetDom, AttachStyleEnum.AttachOuterTopRight, "", destURL,undefined,undefined,'FaceBookVideo_' + $(targetDom).attr('id'));
            //        keepvid.bindEvent(targetDom, downloadDiv);
			//	}
            //}
        },
		
		RequestFaceBookDownloadUrl: function(currentUrl){
			if (xhr) {
				//xhr.overrideMimeType("text/html");
				xhr.open('GET', currentUrl, true);
				xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
				xhr.setRequestHeader("Accept","*/*");
				xhr.setRequestHeader("Accept-Language","zh-CN,zh;q=0.8,en-US;q=0.5,en;q=0.3");
				xhr.onreadystatechange = keepvid.handler;
				xhr.send();
				isRequesting = true;
			}
			else {
				//如果不行，就要找别的办法了。
				//document.getElementById("content").innerHTML = "can not create XMLHttpRequest";
			}
		},
		
		handler: function(evtXHR){
			if (xhr.readyState == 4) {
				if (xhr.status == 200) {
					var response = xhr.responseText;
					requestHtml = xhr.responseText;
					if(xhr.responseURL.indexOf('facebook.com')>=0){
						keepvid.facebookInnerLinkCheck(requestHtml,xhr.responseURL);
					}
				} 
				else {
					console.log('can not cross domain');
					//document.getElementById("content").innerHTML = "can not cross domain";
				}
				isRequesting = false;
			}
			else {
				console.log(xhr.readyState);
				//document.getElementById("content").innerHTML += "<br/>exceute status readyState" + xhr.readyState;
			}
		},
		
		facebookInnerLinkCheck:function(response,currentUrl){
			//拿着返回值去解析，从里面找出progressive,这里面有各种信息(url,quality,id等)
			//AnalysisVimeoDownloadLink(response);
			//从response里面找video_id找出下载地址。
			//var parten = new RegExp('/videos\/(\d+)?','gi');
			try{
				var video_id;
				var matcharr = currentUrl.match(/videos\/(\S*)/);
				if(matcharr.length<2){
					return false;
				}
				video_id = matcharr[1].replace('/','');
				var downloadUrlParten = new RegExp('"videoData":\\[{"is_hds":(false|true),"video_id":"' + video_id + '",.*,"sd_src":.*?,"hd_tag":','gi');//,"sd_src_no_ratelimit":.*?
				var downloadJsonArr = response.match(downloadUrlParten);
				var downloadJson;
				if(downloadJsonArr==null || downloadJsonArr.length<0){
					//他们返回有两种不同格式的Json
					downloadUrlParten= new RegExp('videoData:\\[{is_hds:(false|true),video_id:"' + video_id + '",.*,sd_src:.*?,hd_tag:','gi');//,sd_src_no_ratelimit:.*?
					downloadJsonArr = response.match(downloadUrlParten);
					downloadJson = downloadJsonArr[0];
					downloadJson = downloadJson.replace(/:/g,'":');
					downloadJson = downloadJson.replace(/https":/g,'https:');
					downloadJson = downloadJson.replace(/,/g,',"');
					downloadJson = '"' + downloadJson;
					downloadJson = downloadJson.replace('"videoData":[{','');
					downloadJson = '{"' + downloadJson;
					downloadJson = downloadJson.replace(',"hd_tag":','}');
					downloadJson = downloadJson.substr(0,downloadJson.indexOf('}')+1);
				}
				else{
					downloadJson = downloadJsonArr[0];
					//去头去尾
					downloadJson = downloadJson.replace('"videoData":[','');
					downloadJson = downloadJson.replace(',"hd_tag":','}');
					downloadJson = downloadJson.substr(0,downloadJson.indexOf('}') + 1);
					//downloadJson = downloadJson.substr(0,downloadJson.indexOf('}"sve_hd"') + 1);
				}
				if(downloadJsonArr==null || downloadJsonArr.length<0){
					keepvid.RequestFaceBookDownloadUrl(currentUrl);
					return false;
				}
				var json = JSON.parse(downloadJson);
				//获取下载地址
				var destUrl = json.hd_src_no_ratelimit;
				if(destUrl==undefined || destUrl== null){
					destUrl = json.sd_src_no_ratelimit;
				}
				if(destUrl==undefined || destUrl== null){
					destUrl = json.hd_src;
				}
				if(destUrl==undefined || destUrl== null){
					destUrl = json.sd_src;
				}
				if(destUrl==undefined || destUrl== null){
					destUrl = location.href;
				}
				//保存到facebookDom的parent的parent节点
				$($(facebookDom).parent().parent()[0]).attr('keepvidHref',destUrl);
				$($(facebookDom).parent().parent()[0]).attr('video_id',video_id);
				var downloadDiv = keepvid.attachButtonDiv(facebookDom, AttachStyleEnum.AttachOuterTopRight, "", encodeURIComponent(destUrl),undefined,undefined,'FaceBookVideo_' + video_id);
				keepvid.bindEvent(facebookDom, downloadDiv);
			}
			catch(err){
				return false;
			}
			return true;
		},
		
        facebookOutLink: function(targetDom){
            var viemoLinkUrl;
            var videoImage = $(targetDom).find('img');
            var createDivId;
            //alert($(targetDom).attr('id'));
            if(targetDom.tagName=="A")
            {
                //alert("isComming");
                var youtubeAElement = $(targetDom).find('img');
                var youtubeUrl = $(targetDom).attr('href');
                var youtubeAjaxify = $(targetDom).attr('ajaxify');
                console.log(youtubeUrl);
                console.log(youtubeAjaxify);
                if(youtubeAElement !== undefined && youtubeAElement.length > 0 && youtubeAjaxify !== undefined && youtubeAjaxify.indexOf('/ajax/flash/expand_inline.php')>=0){
                    var currentUrl = decodeURIComponent(youtubeUrl);
                    //这是针对youtube的分析
                    if(currentUrl.indexOf("youtube.com")>=0){
                        currentUrl = currentUrl.substr(currentUrl.indexOf('u=/')+3);
                        youtubeUrl= 'https://www.youtube.com/'+currentUrl;
                        //alert($(targetDom).parent()[0].id);
                        if($(targetDom).parent().parent()[0] !== null &&  $(targetDom).parent().parent()[0]!== undefined){
                            //将分析出来的url和我们创建的div的id保存，后面检查到iframe时直接根据id去展示按钮
                            $($(targetDom).parent().parent()[0]).attr('keepvidHref',youtubeUrl);
                            createDivId = 'downloadUrl_'+ $(targetDom).parent()[0].id;
                            $($(targetDom).parent().parent()[0]).attr('downloadButtonId',createDivId);
                        }
                    }
                    //这是针对其他网站你的分析，url带有video的就认为是视频
                    else if(currentUrl.indexOf("/video") >= 0 || currentUrl.indexOf("vine.co")){
                         $($(targetDom).parent().parent()[0]).attr('keepvidHref',youtubeUrl);
                         createDivId = 'downloadUrl_'+ $(targetDom).parent()[0].id;
                         $($(targetDom).parent().parent()[0]).attr('downloadButtonId',createDivId);
                    }
                    else{
                        return;
                    }
                    //如果是CNN网站的
                    //else if(currentUrl.indexOf("www.cnn.com/video")>=0){
                    //    if($(targetDom).parent().parent()[0] !== null &&  $(targetDom).parent().parent()[0]!== undefined){
                    //        $($(targetDom).parent().parent()[0]).attr('keepvidHref',youtubeUrl);
                    //        createDivId = 'downloadUrl_'+ $(targetDom).parent()[0].id;
                    //        $($(targetDom).parent().parent()[0]).attr('downloadButtonId',createDivId);
                    //    }
                    //}
                    //alert("添加事件");出来的链接直接传递到按钮，跳转，Keepvid网站可能需要修改来检测下载资源。
                    //客户端同步需要能够直接接受http://www.facebook.com/video/wanglihong.mp4?参数1=0&参数2=0这种地址
                    var downloadDiv = keepvid.attachButtonDiv(targetDom, AttachStyleEnum.AttachOuterTopRight, "", decodeURIComponent(youtubeUrl),createDivId);
                    //计算按钮显示位置，facebook分享的youtube有点不一样
                    var width = parseInt($($(targetDom).parent().parent().parent().parent().parent()[0]).css("width"));
                    var left =$($(targetDom).parent().parent().parent().parent().parent()[0]).offset().left + width- parseInt($(downloadDiv).css('width'));
                    $(downloadDiv).css('left',left+'px');
                    $($(targetDom).parent().parent()[0]).attr('downloadButtonleft',$(downloadDiv).css('left'));
                    $($(targetDom).parent().parent()[0]).attr('downloadButtontop',$(downloadDiv).css('top'));
                    keepvid.bindEvent(targetDom, downloadDiv);
                }
            }
            //这是其他网站的分析
            else{
                if(location.href.indexOf("facebook.com")>=0 && videoImage !== null && videoImage !== undefined && videoImage.length>0){
                    var aLink = $(targetDom).parent();
                    var href = $(aLink[0]).attr('href');
                    var ajaxify = $(aLink).attr('ajaxify');
                    if(ajaxify !== undefined && ajaxify.indexOf('/ajax/flash/expand_inline.php')>=0){
                    	if(href.indexOf('dai.ly')>=0)
                    		href = 'http://www.dailymotion.com/video/' + href.substr(href.indexOf('dai.ly/')+7);
                        viemoLinkUrl = href;
                        //console.log($(targetDom).parent().parent()[0].id);
                        if( $($(targetDom).parent().parent().parent()[0]) !== null &&   $($(targetDom).parent().parent().parent()[0]) !== undefined){
                            //将分析出来的url和我们创建的div的id保存，后面检查到iframe时直接根据id去展示按钮
                            $($(targetDom).parent().parent().parent()[0]).attr('keepvidHref',viemoLinkUrl);
                            createDivId = 'downloadUrl_'+ $(targetDom).parent().parent()[0].id;
                            $($(targetDom).parent().parent().parent()[0]).attr('downloadButtonId',createDivId);
                        }
                        //alert("添加事件");出来的链接直接传递到按钮，跳转，Keepvid网站可能需要修改来检测下载资源。
                        //客户端同步需要能够直接接受http://www.facebook.com/video/wanglihong.mp4?参数1=0&参数2=0这种地址
                        var otherLinkDownloadDiv = keepvid.attachButtonDiv(targetDom, AttachStyleEnum.AttachOuterTopRight, "", viemoLinkUrl,createDivId);
                        $($(targetDom).parent().parent().parent()[0]).attr('downloadButtonleft',$(otherLinkDownloadDiv).css('left'));
                        $($(targetDom).parent().parent().parent()[0]).attr('downloadButtontop',$(otherLinkDownloadDiv).css('top'));
                        keepvid.bindEvent(targetDom, otherLinkDownloadDiv);
                    }
                    else if((ajaxify === undefined || ajaxify===null) && href !== undefined && (href.indexOf('soundcloud.com')>=0 || href.indexOf('mixcloud.com')>=0 || href.indexOf('/video')>0)){
                        var musicLinkDownloadDiv = keepvid.attachButtonDiv(targetDom, AttachStyleEnum.AttachOuterTopRight, "", href);
                        keepvid.bindEvent(targetDom, musicLinkDownloadDiv);
                    }
                }
            }
        },

        vevo: function() {
            if (location.href.indexOf("vevo.com") >= 0) {
                var el = document.getElementById("control-bar");
                if (el) {
                    var downloadDiv = keepvid.attachButtonDiv(el, AttachStyleEnum.AttachOuterTopRight, "", location.href);
                    keepvid.bindEvent(el, downloadDiv);
                }
            }
        },

        discovery: function() {
            if (location.href.indexOf("discovery.com") >= 0) {
                var els = document.getElementsByClassName("overlay");
                for (var i = 0; i < els.length; i++) {
                    var downloadDiv = keepvid.attachButtonDiv(els[i], AttachStyleEnum.AttachOuterTopRight, "", location.href);
                    keepvid.bindEvent(els[i], downloadDiv);
                }
            }
        },

        liveleak: function() {
            if (location.href.indexOf("liveleak.com") >= 0) {
                var el = document.getElementById("wrapper");
                if (el) el = el.firstChild;
                var id = el.id;
                el = document.getElementById(id + "_jwplayer_display");
                if (el) {
                    var downloadDiv = keepvid.attachButtonDiv(el, AttachStyleEnum.AttachOuterTopRight, "", location.href);
                    keepvid.bindEvent(el, downloadDiv);
                }
            }
        },

        nbcnews: function() {
            if (location.href.indexOf("nbcnews.com") >= 0) {
                var els = document.getElementsByClassName("tpVideoBlocker");
                for (var i = 0; i < els.length; i++) {
                    if (els[i].firstChild.tagName.toLowerCase() == "a") {
                        var downloadDiv = keepvid.attachButtonDiv(els[i].firstChild, AttachStyleEnum.AttachOuterTopRight, "", location.href);
                        keepvid.bindEvent(els[i].firstChild, downloadDiv);
                    }
                };
            }
        },

        youtubeButton: function() {            
			var desktopType = document.getElementsByTagName('body')[0].getAttribute('desktopType');
			if(desktopType!=undefined && desktopType!=null && desktopType!=''){
				return;
			}
            if (document.getElementById("KeepVid-Button")) return;
            var downloadDiv = document.createElement("div");
            downloadDiv.id = "KeepVid-Button";
            downloadDiv.setAttribute("float", "right");
            downloadDiv.style.width = 107 + 'px';
            downloadDiv.style.height = 37 + 'px';
            downloadDiv.style.backgroundImage = "url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGsAAAAlCAYAAABF7RcQAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA3ppVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTMyIDc5LjE1OTI4NCwgMjAxNi8wNC8xOS0xMzoxMzo0MCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDpmYzU1NTE0Ny1hZjM2LTQ3NGItOTBlNS0xYjBiZmU2MGNmMjkiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6QTYyODQ4N0E2QkZCMTFFNjlGNUNENzEzOTIwRjVFNUIiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6QTYyODQ4Nzk2QkZCMTFFNjlGNUNENzEzOTIwRjVFNUIiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTUuNSAoTWFjaW50b3NoKSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjVkYTFlYzI5LWE5ZDMtNGI2ZS05MTFmLTJjYzY5NWRmMzA4NyIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpmYzU1NTE0Ny1hZjM2LTQ3NGItOTBlNS0xYjBiZmU2MGNmMjkiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz6Z27MTAAAGQklEQVR42uxbe0zVVRw/GG48LsQFZDz0yjMMMjM0TRBmmFk2s7nMsWirtNpyS7IpG83U9Qe1StfbmdViY67Gai7TuZRpoliAkIGAwAV8wBC4V70oWySdz/fHOfwu96o87oVLO5/t7Dx/53d+38/5Ps6B69Xf388ETNlHFvIsl6c0nkKYwkSii6cTPL3fWpB5Cg1egixO1Js8+5inKUpOHoVbPOVwwj4hsjhRqbzhGE/3KNl4JP7lKUNoUa4iyqMBbnIFWYuUPDweqYKsYCULj4fRY4KJ5fPCFB13gceQFWTwVmxMFrKmeHkpNiYLWQqKrP8VRuQoHpsVyIz+2iNF5d0ObXqcOn+dXb72D5UjA6eyRxMCqGzp6WNHa68pybubrNys+9ismHs1srKPEAnf5c2X/a3tPcwU7k/lr39uYDuKWqi87vFItm5VPJV/PXFxVGR9+Woii51ukPWmiza2+0Arq7x0c1wEhU25JSuBHTrVznYevOSyecV3PbG13L1mMOcZkyyX13SxoqMXZD1hhsFp+c9zllG9Cx80zejDqs5biagl88PZvm2PkBDH5ZDDrcf9MUEsItTHpfPiuzCvyzVLD2jVyvTpsr79+zqNwCytHhMVIPv05YOVllF/2BVLL9tc0Ejl1eVX2M6Nc9lLy2dwTa12MLfCTI9Fk0DQneYRYxrbbzpo+ENRviwu3NfpWkQfXIXbzKAez6eGMV8f7fFj5e1ysV3WXhYS5CPNISDKMJPCj40VEEAef1dMpEEK7otNc5nfwJrQ93J+Ba2r4tNUIhqmBoSWfp6urYubcqB2TwarabKyBq6xa5dF0/dkpIRrm6/NxtI2n3Z4f8HGZDkG2He4WW6kD7LjaJ5W/qwpwkBzrHmvgr79lfQw9u762TTuRm8fJbdHgy8+FU35Tf6yj35sku3Nl3tkeXVKsJ2Z+rvB4lITAgIgDGDDszGUL3zjOCWQtum52IE12djMgXHQPCEg7HCQh7GV9VY5r+1GHxFZVtNJ8w81taiDKBCEcchBDuYDBOEgefueszSH0Pg1S2dQvjL3JFu77Q+5udxKFrQHKC5rtzMBZ+oHCTGF+bI5MYMmsK7V5jafkhQbxFr4DsbuRUI5OU7zBSACQoEwFyQZqQ9IiQuQQqxuHjRJv3ETC0DThL/SIy3ZSPnpGotdvuRB7Yo1Z9cZuYED/afaPQv/dM5sJZkhibW41QwKLHggFDTI+olqC4/8tHKiyWA3tvivbreRBTIQfOgROrChBBHwE/HcoYtxiTMD7MwqiBwODH7eTn2RCD7gw15bYWKz44NYqPHOAQnWMtwAY8yHYmgYzJ2APiyP5YFF7EBwAV/m6jDbnxPUyecdjn+jjcXJiOY+rq7lOkWUcxJ4dBfiQzvdVYBZRZQKor79xczyvjo78TcYOC8JvLDMZNdXa75K+cwIf0rkrxqtLiUKQoEvgD8SzhrC10NPJAgBMdA2c0cvq79go6NAWLCPg0beDfBpwifr0dbZS2YVWg6i9h7vcHh2aEAxdM1uIev13XUUXJDtTwqRzlVTbc2GI1oUEWNFndUlmgQBIf3wzsPUdqCkTTu/VXdSEAESsRaUq3UbBISI6A3aX2W+TsTBBEHTRoL9pR1SU4GlKdMczLwwsasWR1CeHK3VEXXinSL4EoGP280gggtJ3tOD2lVa4xj1ucJfQZNwtkLy8/VmOwtr5e7d8k096+TRIcLy/fmLqIw2GdwMECJMnt5cj/TsB3OOd1N4XpDJViyeTnW0w+QiZBd9bV29pE3iBuezn8xUxzfgqIFNNlyIf5jpH87gwzvmyesmhKzYwRCMCOET1x+TJkqcZYb23Q5ZS6JYYfHYr3FEmD0e94/iEK6/B9UfW5wdlvX9zp5zm2ZhITjoCpOX82QUlbEA0a6p/tVxu+wESeN1UYzvhCY5Ezja7xRQ3e45l4Xu+YX1DmeODbuq5LUKdpLA1r01cqy+XWH08B7prnWmXc52kPoziOuh/vioyBo5bvX3KzYmC1lWW59iY7KQdaisQ7ExTLK6lSg8HhZB1kklC49HiSArn2m/A1LwTCD6yieyWgsyS3j2liLMIyF+TFfiNeRnqot59jZPyI1KThPro3j6nacPOVHImR1ZCp6N/wQYAB+fsdQ/WCIhAAAAAElFTkSuQmCC)";
            downloadDiv.style.cursor = "pointer";
            downloadDiv.style.float = "right";
            downloadDiv.onclick = function () {
                var realLink = "http://keepvid.com/?url=" + location.href + "&from=plugin#downloader";
                myWindow1 = window.open(realLink, '_blank', '');
                myWindow1.focus();
            };
            var insertDiv = document.getElementById("watch-headline-title");
            var existEl = insertDiv.firstChild;
            insertDiv.insertBefore(downloadDiv, existEl);
        },

		soundcloudButton: function() {            
			var desktopType = document.getElementsByTagName('body')[0].getAttribute('desktopType');
			if(desktopType!=undefined && desktopType!=null && desktopType!=''){
				return;
			}
            if (document.getElementById("KeepVid-Button")) return;
            var downloadDiv = document.createElement("div");
            downloadDiv.id = "KeepVid-Button";
            downloadDiv.style.width = 74 + 'px';
            downloadDiv.style.height = 26 + 'px';
            downloadDiv.style.backgroundImage = "url(data:image/png;base64,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)";
            downloadDiv.style.cursor = "pointer";
            downloadDiv.style.right = "190px";
            downloadDiv.style.position = "absolute";
            downloadDiv.onclick = function () {
                var realLink = "http://keepvid.com/?url=" + location.href + "&from=plugin#downloader";
                myWindow1 = window.open(realLink, '_blank', '');
                myWindow1.focus();
            };
            var insertDivArr = document.getElementsByClassName("listenEngagement__footer sc-clearfix");
			if(insertDivArr.length>0){
				var existEl = insertDivArr[0].firstChild;
				insertDivArr[0].insertBefore(downloadDiv, existEl);
			}
        },

		CheckAllWebsiteLink:function(){            
			var desktopType = document.getElementsByTagName('body')[0].getAttribute('desktopType');
			if(desktopType!=undefined && desktopType!=null && desktopType!=''){
				return;
			}
            //console.log('asdasdas');
			var currentLinkUrl;
			var pattern = new RegExp('watch\?v=.*','gi');  //匹配单个script标签内容的写法
			var aLinklist = document.getElementsByTagName('a');
			var downloadButton;
            var currentLength = aLinklist.length;
            console.log(aLinklist.length);
            var needAddList = new Array();
            var addLinkList = new Array();
            var needAddIndex = 0;
			if(aLinklist== undefined || aLinklist == null || aLinklist.lengtj==0) return;
			for(var index = 0;index< currentLength; index++){
                currentLinkUrl ='';
                console.log(index+'    '+aLinklist.length+'    '+currentLength);
				if(aLinklist[index] == null || aLinklist[index]== undefined) continue;
				currentLinkUrl = aLinklist[index].getAttribute('href');
                //console.log('加载放出来的'+currentLinkUrl);
				if(currentLinkUrl==null ||currentLinkUrl==undefined) continue;
                if(currentLinkUrl.indexOf('savefrom.net')>=0){
                    aLinklist[index].parentNode.removeChild(aLinklist[index]);
                    continue;
                }
				if(currentLinkUrl.indexOf('youtube.com')>= 0 && currentLinkUrl.indexOf('watch?v=')>= 0){
                    //console.log('加载放出来的'+currentLinkUrl);
					currentLinkUrl = currentLinkUrl.substr(currentLinkUrl.indexOf('watch?v='));
                    needAddList[needAddIndex] = aLinklist[index];
                    addLinkList[needAddIndex]= 'https://www.youtube.com/'+ currentLinkUrl;
					//downloadButton = keepvid.CreateLinkDownloadButton(currentLinkUrl);
					//aLinklist[index].parentNode.appendChild(downloadButton);
				}
			}
            var decodeUrlstr;
            var Id;
            for(var i =0 ;i< needAddList.length;i++){
                decodeUrlstr = decodeURIComponent(addLinkList[i]);
                //console.log('解码：'+decodeUrlstr);
                if(decodeUrlstr.indexOf('url=')>=0){
                    decodeUrlstr = decodeUrlstr.substr(decodeUrlstr.indexOf('url=')+4);
                    //console.log('裁剪'+decodeUrlstr);
                    decodeUrlstr = "http://keepvid.com/?url=" + decodeUrlstr;
                }
                else{
                    decodeUrlstr = "http://keepvid.com/?url=" + decodeUrlstr;
                }
                //console.log('这是看看'+decodeUrlstr);
                downloadButton = keepvid.CreateLinkDownloadButton(decodeUrlstr);
                needAddList[i].parentNode.appendChild(downloadButton);
            }
		},

		CreateLinkDownloadButton:function(currentLinkUrl){
			var downloadspan = document.createElement("span");
			downloadspan.setAttribute("style", "padding: 0; margin: 0; margin-left: 5px;");
			downloadspan.style.cursor = "pointer";
			var btnDownload = document.createElement("a");
			btnDownload.setAttribute('href', currentLinkUrl);
			btnDownload.setAttribute('target', '_blank');
			btnDownload.setAttribute('style','background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA3ppVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTMyIDc5LjE1OTI4NCwgMjAxNi8wNC8xOS0xMzoxMzo0MCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDoxMjNhM2U5ZC0xNzRlLTQ0MjktODVjMS05MTUwYzcyNjk2OWIiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6QTdGREVDRkVBQTJGMTFFNkI4N0NCRTM4OTEwNjEzNzUiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6QTdGREVDRkRBQTJGMTFFNkI4N0NCRTM4OTEwNjEzNzUiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTUuNSAoTWFjaW50b3NoKSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjUzNGUwYTVkLWFkZDQtNGNkNy1hODAyLTlkNGMyNWQzMWJmZCIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDoxMjNhM2U5ZC0xNzRlLTQ0MjktODVjMS05MTUwYzcyNjk2OWIiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz73UvLHAAABDUlEQVR42mKROMzBAATKQNwBxC5ALMCAH3wA4j1AXAHEd1kYGJmVgIzTQCzIQBwAWRACxI5AbMbCyMjSQYJmZCAMxG1AA5jdcKl4avkWTEsfF8alxBXoBVZ+gnYxsuKSEQJ5gbB+PGpYGJgIG4BPDdAFrES4gJV4Ax4ZX8NQ9NjkNpwtd1YL1XEg/yFjnYtWOG2TP6fHgK6eCRzCSPjzv58MOpfsMTWfN2ZAVwvCTIzAAELHX/7/YNC94gzXrHDRnAGbOhAGReMnoBo+dBu//PvBoHjJmlA0vgclJFDGCGIgD+wFJeUqIMOJiFyILVdWAQOR5SYQWwLxZiD+ygByLn4MUrMRiC2A+DZAgAEACaouk2+RDtUAAAAASUVORK5CYII="); background-repeat: no-repeat; width: 16px; height: 16px; display: inline-block; border: none; text-decoration: none; padding: 0px; position: relative;');
            downloadspan.appendChild(btnDownload); 
			return downloadspan;
		},
		
        kvh_ap: function(obj) {

            //Create the XMLHttpRequest, cross-browser

            //Build object for GM_xmlhttpRequest()
            var gm_xhr = new Object();
            gm_xhr.url = obj.params.u;

            //Set method
            (obj.method!=undefined) ? gm_xhr.method=obj.method : gm_xhr.method="GET";
            if(obj.params.locationonly=="yes") gm_xhr.method="HEAD";

            //Set request headers
            gm_xhr.headers = new Object();
            if(obj.params.ua!=undefined) gm_xhr.headers["User-Agent"]=obj.params.ua;
            if(obj.params.postdata!=undefined) gm_xhr.headers["Content-Type"]="application/x-www-form-urlencoded";
            if(obj.params.referer!=undefined) gm_xhr.headers["Referer"]=obj.params.referer;

            //Set the Request body with postdata if it exists
            if(obj.params.postdata!=undefined){
                gm_xhr.method="POST";
                gm_xhr.data = obj.params.postdata;
            }

            //Set kvh_data textarea with the response when done
            if(obj.params.locationonly=="yes"){
                gm_xhr.onload = function(response) {
                    var loc="";
                    try{
                        loc = response.finalUrl;
                        if(loc=="") loc=response.responseHeaders.match(/Location: ([^\r\n]+)/i)[1];
                    }catch(ex){

                    }
                    document.getElementById("kvh_data").innerHTML=loc;
                }
            }else{
                gm_xhr.onload = function(response) {
                    document.getElementById("kvh_data").innerHTML=response.responseText;
                }
            }
            //Finally run GM_xmlhttpRequest()
            GM_xmlhttpRequest(gm_xhr);
        },

        main: function() {//找到关注对象，注册mouseover和mouseout事件，写入buttondiv，默认不显示
            if (location.href.indexOf("keepvid.") >= 0) {
                if(!document.location.href.match(/&mode=mp3/i)){
                    //Inject a variable telling the site that this Userscript is running
                    var el = document.createElement('script');
                    el.innerHTML='var kvh_ext = true;';
                    var head = document.head || document.getElementsByTagName('head')[0];
                    head.insertBefore(el, head.lastChild);

                    //Listen on the kvh_obj textarea for a new request to make
                    setInterval(function(){
                        try{
                            if(document.getElementById("kvh_obj").innerHTML.toString()!="~kv"){ //Check if the textarea contains a new request made by js on the site
                                //Define and clean up kvh_obj
                                var kvh_obj = document.getElementById("kvh_obj").innerHTML;
                                kvh_obj = kvh_obj.replace(/&lt;/g,"<").replace(/&gt;/g,">").replace(/&amp;/g,"&");

                                //Parse the JSON paramters (all relevent to the cross-domain request to be made)
                                //Execute the request
                                keepvid.kvh_ap(JSON.parse(kvh_obj));

                                //Empty the textarea to make it re-useable
                                document.getElementById("kvh_obj").innerHTML="~kv";
                            }
                        }catch(ex){

                        }
                    },1);
                }
            } else if (location.href.indexOf("youtube") >= 0) {
                setInterval(keepvid.youtubeButton, 1000);
            } else if (location.href.indexOf("soundcloud") >= 0) {
                setInterval(keepvid.soundcloudButton, 1000);
            } else {
                //document.addEventListener('onload',keepvid.CheckAllWebsiteLink,false);
                document.addEventListener("mousemove", keepvid.handleDocumentMouseOverEvent, false);
                document.addEventListener("mouseover", keepvid.handleDocumentMouseOverEvent, false);//有些mousemove事件没响应，必须mouseover
                videoTags = document.getElementsByTagName("video");
                for (var i = 0; i < videoTags.length; i++) {
                    var downloadDiv = keepvid.attachButtonDiv(videoTags[i], AttachStyleEnum.AttachOuterTopRight, "", location.href);
                    keepvid.bindEvent(videoTags[i], downloadDiv);
                }
                embedTags = document.getElementsByTagName("embed");
                for (var i = 0; i < embedTags.length; i++) {
                    var downloadDiv = keepvid.attachButtonDiv(embedTags[i], AttachStyleEnum.AttachOuterTopRight, "", location.href);
                    keepvid.bindEvent(embedTags[i], downloadDiv);
                }
                objectTags = document.getElementsByTagName("object");
                for (var i = 0; i < objectTags.length; i++) {
                    var downloadDiv = keepvid.attachButtonDiv(objectTags[i], AttachStyleEnum.AttachOuterTopRight, "", location.href);
                    keepvid.bindEvent(objectTags[i], downloadDiv);
                }
                //iFrameTags = document.getElementsByTagName("iframe");
                //for (var i = 0; i < iFrameTags.length; i++) {
                //    var downloadDiv = keepvid.attachButtonDiv(iFrameTags[i], AttachStyleEnum.AttachOuterTopRight, "", location.href);
                //    keepvid.bindEvent(iFrameTags[i], downloadDiv);
                //}
            }
        }
    };
}
keepvid.main();