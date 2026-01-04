// ==UserScript==
// @name         GelbooruViewer
// @name:zh-CN   G站图片浏览工具
// @namespace    GelbooruViewerzifux
// @version      0.3.1
// @description  Eazy way to quickly view pics on Gelbooru.
// @description:zh-cn 方便的浏览G站图片
// @author       zifux
// @match        *://gelbooru.com/index.php?page=post&s=list*
// @require      https://cdn.bootcss.com/bootstrap/3.3.7/js/bootstrap.min.js
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/34333/GelbooruViewer.user.js
// @updateURL https://update.greasyfork.org/scripts/34333/GelbooruViewer.meta.js
// ==/UserScript==
var piclist=[];
var picindex=-1;
var perPage=42;
var realHeight=0;
var realWidth=0;
var minWidthZoom=0.3;
var img=null;
function nowlist(){
	piclist=[];
	$(".thumbnail-preview span a")
	.each(function(index,a){
        var id=a.href.match(/id=([0-9]+)/)[1];
		piclist.push({id:id,url:a.href,src:''});
		a.href='#';
		$(a).attr("onclick",'showPic('+index+')');
	});
}
function LoadPic(index,cb){
if(index<0)return;
if(index>piclist.length-1)return;
if(index>picindex+4)return;
	if(piclist[index].src==""){
		$.get(piclist[index].url,function(html){
			var h=$(html);
			var imgSrc=$("#image",h).attr("src");
			var isVideo=false;
			if(imgSrc){
				piclist[index].src=imgSrc;
			}else{
				var videoPlayer=$("#gelcomVideoPlayer",h)[0].outerHTML;
				piclist[index].src=videoPlayer;
				isVideo=true;
			}
			if(cb){
				cb(piclist[index].src,isVideo);
				LoadPic(index+1);
			}else{
				if(imgSrc){
					var imgObj = new Image();
					imgObj.src = imgSrc;
					imgObj.onload=function(){
						LoadPic(index+1);
					};
				}else{
					LoadPic(index+1);
				}
			}
		});
	}else{
		if(piclist[index].src.startsWith('<video')){
            if(cb){
                cb(piclist[index].src,true);
            }
        }

		else{
            if(cb){
                cb(piclist[index].src,false);
            }
        }

		LoadPic(index+1);
	}
}

function init(){
	createViewer();
	realHeight=$(window).height()-40;
	realWidth=$(window).width()-40;
    img=document.getElementById("gViewerPic");
    img.style.maxWidth=realWidth+"px";
	img.style.minHeight=realHeight+"px";
    img.style.minWidth=realWidth*minWidthZoom+"px";
	nowlist();
	LoadPic(0);
}
function createViewer(){
    $('head').append('<link href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" rel="stylesheet" >');
	$('body').append('<div class="modal fade" tabindex="-1" role="dialog" id="gViewer" style="background-color: rgba(0, 0, 0, 0.45);"> <div id="gViewerWindow" class="modal-dialog modal-lg" role="document"> <button type="button" class="close" data-dismiss="modal" aria-label="Close" style="opacity: .7;color: #5bc0de;position: absolute;right: -20px;top: 2px;"> <span aria-hidden="true">&times;</span> </button> <div id="gViewerContent" class="modal-content" style="background-color: currentColor;overflow: hidden;"> <a id="gViewerA"href="#" onclick="showNextPic()" class="center-block"> <img id="gViewerPic"class="center-block" style="user-select: none;min-height:500px;" src="" onload="onPicLoad(this)"></img> </a> <div class="modal-footer" style="border-top: 1px solid #555;"> <a class="btn btn-success" id="gViewerInfo" href="#"  target="_blank">INFO</a><button class="btn btn-success"  onclick="showOriginalPic()">Original</button><button autocomplete="off" data-loading-text="Loading..."  data-success-text="Success" data-failure-text="Failure" id="gFavor" class="btn btn-warning" onclick="favorPic()" >Favorites</button> <button class="btn btn-info" onclick="showPrePic()">Previous</button> <button class="btn btn-info" onclick="showNextPic()">Next</button> </div> </div> </div> </div>'
	+'');
    $('.navbar-default .navbar-nav>li>a').css('color','#fff');
}
function resetPic(){
    $("#gFavor").button("reset");
    var img=document.getElementById("gViewerPic");
    img.style.height=null;
    img.style.width=null;
    img.style.minHeight=realHeight+"px";
    img.style.minWidth=realWidth*minWidthZoom+"px";
}
(function() {
    'use strict';
document.showPic=function (index){
    img.style.opacity="0.5";
    resetPic();
	picindex=index;
	$('#gViewerInfo').attr("href",piclist[index].url);
	LoadPic(index,function(src,isVideo){
        $('#gViewerContent video').remove();
		if(isVideo){
			$('#gViewerA').hide();
			$('#gViewerContent').append(src);
		}else{
            $('#gViewer img').attr("src",src);
            //img.style.visibility="hidden";//.css("visibility","hidden");
			$('#gViewerA').show();
		}
	});
	$('#gViewer').modal({backdrop:false});
    };
    document.showNextPic=function(){
        if(picindex>=piclist.length-1){
            $('#gViewer').modal('hide');
            return;
        }
        document.showPic(++picindex);
    };
    document.showPrePic=function(){
        if(picindex<=0)return;
        document.showPic(--picindex);
    };
    document.showOriginalPic=function(){
        img.style.height=null;
        img.style.width=null;
        img.style.minHeight=null;
        img.style.minWidth=null;
        $('#gViewerWindow').width(img.width+2);
    };
    document.favorPic=function(){
        var btn=$("#gFavor");
        btn.button("loading");
        function res(d,s){
        if(d=='1'){
            btn.button("success");
        }else if(d=='3'){
            btn.button("success");
        }else if(d=='2'){
            alert("You are not logged in.");
            btn.button("failure");
        }else{
            btn.button("failure");
        }
        }
        $.get('/public/addfav.php?id='+piclist[picindex].id,res);
        $.get('/index.php?page=post&s=vote&type=up&id='+piclist[picindex].id);
    };
    document.onPicLoad=function(nimg){
        if(nimg.naturalWidth>realWidth*minWidthZoom&&nimg.naturalHeight>realHeight){
            var zoomWidth=nimg.naturalWidth*realHeight/nimg.naturalHeight;
            console.log(zoomWidth,realWidth*minWidthZoom+3);
            if(zoomWidth>realWidth*minWidthZoom+3){
                  nimg.style.height=realHeight+"px";
            }else{
                nimg.style.width=realWidth*minWidthZoom+3+"px";
            }
        }
        $('#gViewerWindow').width(nimg.width+2);
        img.style.opacity="1";
    };
    init();
})();