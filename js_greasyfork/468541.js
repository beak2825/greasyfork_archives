var numselected=0;
 
  function ADDimgdown() {
  	   if (GM_info.script.namespace!="Z3JlYXN5Zm9yaw=="){
return
}
  	  	  $(".data-down-ui").remove();
    // create thumbnail container
    var thumbnailContainer = $("<div>")
        .css({
            "position": "fixed",
            "top": "50%",
            "left": "50%",
            "transform": "translate(-50%, -50%)",
            "z-index": 99999999999999,
            "width": "80vw",
            "height": "80vh",
            "background-color": "#eee",
            "overflow": "auto",
            "text-align": "center"
        })
        .hide()
        .attr("class", "data-down-ui")
        .appendTo($("body"));
 
    // create media type switch buttons
    var switchBtnContainer = $("<div>")
        .css({
            "position": "absolute",
            "top": "0",
            "left": "0",
            "right": "0",
            "width": "100%",
            "background-color": "#fff",
            "padding": "10px",
            "text-align": "center",
            "box-shadow": "0 2px 5px rgba(0, 0, 0, 0.3)"
        })
        .appendTo(thumbnailContainer);
 
 
 
    var switchBtnVideo = $("<button>")
        .css({
            "margin-right": "10px"
        })
        .text("视频列表")
        .attr("data-down-button", "video")
        .attr("class", "data-down-button")
        .appendTo(switchBtnContainer);
 
    var switchBtnAudio = $("<button>")
        .css({
            "margin-right": "10px"
        })
        .text("音频列表")
        .attr("data-down-button", "audios")
       .attr("class", "data-down-button")
        .appendTo(switchBtnContainer);
 
    var switchBtnImage = $("<button>")
        .text("图片列表")
        .css({
            "margin-right": "10px"
        })
         .attr("data-down-button", "images")
        .attr("class", "data-down-button")
        .appendTo(switchBtnContainer);
 
     var switchBtnselected = $("<button>")
        .text("选择全部")
         .css({
            "margin-right": "10px"
        })
         .attr("data-down-button", "selected")
        .attr("class", "data-down-buttonselected")
        .appendTo(switchBtnContainer);
 
 var switchBtnsmall = $("<button>")
        .text("过滤小图片")
         .css({
            "margin-right": "10px"
        })
         .attr("data-down-button", "small")
        .attr("class", "data-down-buttonsmall")
        .appendTo(switchBtnContainer);
 
   var switchBtndown = $("<button>")
        .text("下载所选资源")
         .css({
            "margin-right": "10px"
        })
         .attr("data-down-button", "down")
        .attr("class", "data-down-down")
        .appendTo(switchBtnContainer);
 
 var switchBtnurl = $("<button>")
        .text("导出链接")
         .css({
            "margin-right": "10px"
        })
         .attr("data-down-button", "url")
        .attr("class", "data-down-url")
        .appendTo(switchBtnContainer);
 
 var switchBtnM3U8Video = $("<button>")
        .css({
            "margin-right": "10px"
        })
        .text("M3U8格式视频下载")
        .attr("data-down-button", "downm3u8")
        .attr("class", "data-down-button")
        .appendTo(switchBtnContainer);
switchBtnM3U8Video.click(function() {
 sectionm3u8menu(GM_getValue("m3u8url", ""));
});
    // create thumbnail list
    var thumbnailList = $("<div>")
        .css({
            "margin-top": "50px"
        })
        .attr("thumbnailList", "thumbnailList")
        .appendTo(thumbnailContainer);
 
    // create close button
    var closeBtn = $("<button>")
        .css({
            "position": "absolute",
            "top": "10px",
            "right": "10px",
            "background-color": "rgb(167 166 166)",
            "border": "1px solid rgb(204, 204, 204)",
            "padding": "5px",
            "font-size": "16px",
            	    "color": "aliceblue",
    "font-weight": "600",
        })
        .text("×")
        .appendTo(thumbnailContainer);
 
        var mediaLinks = [];
        var mediaTypes = ["video", "audio", "img"];
 
 
 
    function findKeyPath(obj, targetKey) {
    let paths = [];

    function traverse(currentObj, currentPath) {
        for (let key in currentObj) {
            if (currentObj.hasOwnProperty(key)) {
                let newPath = currentPath ? `${currentPath}.${key}` : key;
                if (key === targetKey) {
                    paths.push(newPath);
                }

                if (typeof currentObj[key] === 'object' && currentObj[key] !== null) {
                    traverse(currentObj[key], newPath);
                }
            }
        }
    }

    traverse(obj, '');
    return paths;
}

       	if (location.hostname.includes('xiaohongshu.com')) {
       		mediaLinks = [];
 var imglistxhs = unsafeWindow.__INITIAL_STATE__; 
// console.log(imglistxhs);

// 查找 "originVideoKey" 的路径
// let  Keypaths = findKeyPath(imglistxhs, 'originVideoKey');
// 打印所有找到的路径
// console.log(Keypaths);

     	 var windowurl = window.location.href; 
     
if (windowurl.includes("explore/")) {

  var match = windowurl.match(/explore\/([^?]+)/);
  if (match && match[1]) {
    var result = match[1];
  } else {
    console.log("没有找到匹配的字符串");
  }

if ( imglistxhs.note.noteDetailMap.hasOwnProperty(result)) {
	 
  var imageList = imglistxhs.note.noteDetailMap[result]["note"].imageList;
  for (var i = 0; i < imageList.length; i++) {
    var image = imageList[i];
    var traceId="";
if (image.traceId !== undefined && image.traceId !== "") {
	 traceId=image.traceId;
 }else {
 traceId=image.infoList[0].url;
var regex = /\/([a-zA-Z0-9]+)!/;
var match = regex.exec(traceId);
traceId = match[1];
}
 
             mediaLinks.push({
                    "type": "img",
                    "src": "https://sns-img-bd.xhscdn.com/"+traceId+"?imageView2/2/w/1080/format/jpg",
                    	"width": image.width,
                    	"height": image.height,
                });
  }
  
 //"note.noteDetailMap.66584ddb000000000f00c9d6.note.video.consumer.originVideoKey"
 	 var videoList = imglistxhs.note.noteDetailMap[result]["note"].video;
   //console.log(videoList);
 if (videoList && videoList["consumer"]["originVideoKey"]) {
    var videourl = videoList["consumer"]["originVideoKey"];
    console.log("http://sns-video-bd.xhscdn.com/"+videourl);
             mediaLinks.push({
                    "type": "video",
                    "src": "http://sns-video-bd.xhscdn.com/"+videourl, 
                });
 
  }
  

 
  
}
}
 
if (imglistxhs.feed.feeds.hasOwnProperty('_rawValue')) {
  var imageList =imglistxhs.feed.feeds._rawValue;
  for (var i = 0; i < imageList.length; i++) {
    var image = imageList[i];
             mediaLinks.push({
                    "type": "img",
                    "src": "https://sns-img-bd.xhscdn.com/"+image.noteCard.cover.traceId+"?imageView2/2/w/1080/format/jpg",
                    	"width": image.noteCard.cover.width,
                    	"height": image.noteCard.cover.height,
                });
  }
}
}
 
 
var videoiframes = document.querySelectorAll('iframe');
 
videoiframes.forEach(function(iframe) {
  try {
    var iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
 
    var imgElements = iframeDocument.querySelectorAll('img');
    var canvasElements = iframeDocument.querySelectorAll('canvas');
 
    imgElements.forEach(function(img) {
      var imgSrc = img.getAttribute('src');
           mediaLinks.push({
                    "type": "img",
                    "src": imgSrc,
                    	"width":  img.naturalWidth,
                    	"height":  img.naturalHeight,
                });
    });
 
    canvasElements.forEach(function(img) {
    try {
 var imageData = img.toDataURL('image/png');
 let imageSize = getImageSize(imageData);
        let base64Image = imageData.split(',')[1];
       mediaLinks.push({
                    "type": "img",
                    "src": "data:image/png;base64,"+base64Image,
                    	"width":  imageSize.width,
                    	"height":  imageSize.height,
                });
 
    } catch (err) {
        console.error('获取某些图片失败：Failed to export canvas as PNG', err);
        // 使用其他方式导出图片
    }
 
    });
 
    var videoElements = iframeDocument.querySelectorAll('video');
 
    videoElements.forEach(function(video) {
      var sourceElement = video.querySelector('source');
      var videoSrc="";
 
      if (sourceElement) {
        videoSrc = sourceElement.getAttribute('src');
      } else {
        videoSrc = video.getAttribute('src');
      }
      if (videoSrc.includes('.mp4')) {
      	        mediaLinks.push({
                    "type": "video",
                    "src": videoSrc,
                });
      }
 
    });
  } catch (error) {
    console.log("发生错误：", error);
  }
});
 
        // get all media links
        mediaTypes.forEach(function(mediaType) {
            $(mediaType).each(function() {
 let checkreturn=true;
 
        if (checkreturn) {
            	let src=$(this).attr("src");
 
          if ($(this).find('source').length > 0) {
$(this).find('source').each(function() {
	        if ($(this).attr('src')){
	        	let vsrc=$(this).attr('src');
	      vsrc=completeUrl(vsrc);
	      if (vsrc.includes('m3u8')) {
                mediaLinks.push({
                    "type": mediaType,
                    "src": vsrc,
                    "m3u8": vsrc,
                });
}else{
     mediaLinks.push({
                    "type": mediaType,
                    "src": vsrc
                });
}
}
});
        }
        if (src && mediaType!="img"){
if (src.includes('rgb(') || src.includes('linear-gradient')) {
src=false;
}
}
if (src){
            if (mediaType=="img"){
          // src=src.replace(/webp/g, 'png');
            }
             let width = $(this).width();
        let height = $(this).height();
             src=completeUrl(src);
 
               if ($(this).attr('m3u8')){
               	     mediaLinks.push({
                    "type": mediaType,
                    "src": src,
                    	"m3u8": $(this).attr('m3u8'),
                    	"width": width,
                    	"height": height,
                });
        }else{
          mediaLinks.push({
                    "type": mediaType,
                    "src": src,
                    	"width": width,
                    	"height": height,
                });
        }
 
                	}
         	}
            });
        });
 
 
 
  $('canvas').each(function() {
        let canvas = $(this)[0];
    try {
 var imageData = canvas.toDataURL('image/png');
 let imageSize = getImageSize(imageData);
        let base64Image = imageData.split(',')[1];
       mediaLinks.push({
                    "type": "img",
                    "src": "data:image/png;base64,"+base64Image,
                    	"width":  imageSize.width,
                    	"height":  imageSize.height,
                });
 
    } catch (err) {
        console.error('获取某些图片失败：Failed to export canvas as PNG', err);
        // 使用其他方式导出图片
    }
 
    });
 // 获取图片大小的函数
    function getImageSize(imageData) {
        let image = new Image();
        image.src = imageData;
        let width = image.width;
        let height = image.height;
        return {
            width: width,
            height: height
        };
    }
        $('div, a, span, body').each(function() {
        	 let checkreturn=true;
if (window.location.href.includes('xiaohongshu.com')) {
checkreturn=false;
  }
          if (checkreturn) {
  // 获取元素的计算样式
  var computedStyle = window.getComputedStyle(this);
 
  // 判断元素是否存在 background-image 样式
var backgroundImage = computedStyle.getPropertyValue('background-image');
if (backgroundImage !== 'none') {
    let matches = [...backgroundImage.matchAll(/url *\(['"]?([^'"\(\)]+)['"]?\)/g)];
    for (let i=0; i<matches.length; i++) {
        let src = matches[i][1];
        if (src.includes('rgb(') || src.includes('linear-gradient')) {
            continue;  // 跳过背景图中的线性渐变和 RGB 颜色值
        }
        let width = $(this).width();
        let height = $(this).height();
        src = src.replace(/webp/g, 'png');  // 替换图片格式
        src = completeUrl(src);  // 补全图片链接
        mediaLinks.push({
            "type": 'img',
            "src":src,
           	"width": width,
           	"height": height,
        });
    }
}
 
  // 判断元素是否存在 background: url() 样式
var backgroundUrl = computedStyle.getPropertyValue('background');
var matches = backgroundUrl.match(/url\(['"]?([^'"\(\)]*)['"]?\)/g);
if (matches) {
    for (let i=0; i<matches.length; i++) {
        let src = matches[i].replace(/url\(['"]*/, '').replace(/['"]*\)/, '');
        if (src.includes('rgb(') || src.includes('linear-gradient')) {
            continue; // 跳过背景图中的线性渐变和 RGB 颜色值
        }
        let width = $(this).width();
        let height = $(this).height();
        src = src.replace(/webp/g, 'png');  // 替换图片格式
        src = completeUrl(src);  // 补全图片链接
        mediaLinks.push({
            "type": 'img',
            "src":src,
            "width": width,
            "height": height,
        });
    }
}
  }
});
 
  // 去除重复项
mediaLinks = mediaLinks.filter(function(item, index, self) {
  return index === self.findIndex(function(t) {
    return t.src === item.src;
  });
});
 
        // generate thumbnail list
        var videonum=0;
        var audionum=0;
        var imgnum=0;
 
        mediaLinks.forEach(function(mediaLink, index, array) {
            var thumbnail = $("<div>")
                .css({
                    "display": "inline-block",
                    "margin": "10px",
                    "cursor": "pointer"
                })
              .attr("class", "data-down-list");
 
            if (mediaLink.type === "video") {
                var videoThumbnail = $("<video>")
                    .attr("src", mediaLink.src)
                    .attr("height", "120px")
                     .attr("type", "video/mp4")
                    .attr("controls", "controls");
 
			if (mediaLink.m3u8){
				 thumbnail.attr("data-url", mediaLink.m3u8);
				 thumbnail.attr("m3u8", mediaLink.m3u8);
				}else{
			 thumbnail.attr("data-url", mediaLink.src)
				}
                thumbnail.append(videoThumbnail);
                  videonum++
                 $('[data-down-button="video"]').text('视频列表('+videonum+')');
            }
            else if (mediaLink.type === "audio") {
                var audioThumbnail = $("<audio>")
                    .attr("src", mediaLink.src)
                    .attr("controls", "controls");
                thumbnail.attr("data-url", mediaLink.src)
 
                thumbnail.append(audioThumbnail);
                audionum++
                 $('[data-down-button="audios"]').text('音频列表('+audionum+')');
            }
            else {
                var imageThumbnail = $("<img>")
                    .attr("src", mediaLink.src)
                    .attr("data-width", mediaLink.width)
                    .attr("data-height", mediaLink.height)
                    .attr("height", "120px");
               thumbnail.attr("data-url", mediaLink.src)
 
                thumbnail.append(imageThumbnail);
                 imgnum++
                 $('[data-down-button="images"]').text('图片列表('+imgnum+')');
            }
 
            thumbnailList.append(thumbnail);
 
            // bind click event to thumbnails
            thumbnail.on("click", function() {
            	GM_setClipboard(mediaLink.src);
 
 
if (mediaLink.src && mediaLink.src.startsWith('blob:')) {
            if (mediaLink.m3u8 ){
            		GM_setClipboard(mediaLink.m3u8);
            	sectionm3u8menu(mediaLink.m3u8);
            	   toastr.success('该视频为特殊格式的m3u8视频。已跳转至下载页面。请在页面上继续操作', '', { positionClass: 'toast-bottom-right', showDuration: 300, hideDuration: 1000, timeOut: 3000, extendedTimeOut: 1000, showEasing: 'swing', hideEasing: 'linear', showMethod: 'fadeIn', hideMethod: 'fadeOut' });
    /*        	if (confirm("此链接为加密链接？是否跳转到解析网站上破解下载？【补充说明：如果脚本提示跨域是否允许访问，请选择允许全部】")) {
            		let kw=encodeURIComponent(mediaLink.m3u8);
 
let hostname = new URL(mediaLink.m3u8).hostname;
let date = new Date();
let timestamp = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}_${date.getHours().toString().padStart(2, '0')}-${date.getMinutes().toString().padStart(2, '0')}-${date.getSeconds().toString().padStart(2, '0')}`;
let filename = `${hostname}_${timestamp}.html`;
 
let vurl='https://tools.thatwind.com/tool/m3u8downloader#m3u8='+kw+'&referer='+kw+'&filename='+filename;
 GM_openInTab(vurl, {active: !0});
}
 */
        }else{
        toastr.error('此视频已经被该网站加密，暂时不能提供下载', '', { positionClass: 'toast-top-center', showDuration: 300, hideDuration: 1000, timeOut: 3000, extendedTimeOut: 1000, showEasing: 'swing', hideEasing: 'linear', showMethod: 'fadeIn', hideMethod: 'fadeOut' });
        }
            }else{
                     toastr.success('已选择并复制了此资源链接！', '', { positionClass: 'toast-bottom-right', showDuration: 300, hideDuration: 1000, timeOut: 3000, extendedTimeOut: 1000, showEasing: 'swing', hideEasing: 'linear', showMethod: 'fadeIn', hideMethod: 'fadeOut' });
 
            }
 
 
 
            });
        });
 
        // show thumbnail container
        thumbnailContainer.show();
 
            // bind click event to switch buttons
    switchBtnVideo.on("click", function() {
        thumbnailList.find("div").hide();
        thumbnailList.find("video").parent().show();
    });
 
    switchBtnAudio.on("click", function() {
        thumbnailList.find("div").hide();
        thumbnailList.find("audio").parent().show();
    });
 
    switchBtnImage.on("click", function() {
        thumbnailList.find("div").hide();
        thumbnailList.find("img").parent().show();
    });
 
    // bind click event to close button
    closeBtn.on("click", function() {
        thumbnailContainer.hide();
        thumbnailList.empty();
    });
        // add custom styles
    GM_addStyle(`
        ::selection {
            background-color: #4285f4;
            color: #fff;
        }
    `);
 
    };
 
 
 
 
 
$("body").on('click', '.data-down-list', function() {
	if ($(this).hasClass('selected')) {
$(".data-down-buttonselected").removeClass("selected");
}
 $(this).toggleClass("selected");
 getallnum();
})
 
$("body").on('click', '.data-down-button', function() {
$(".data-down-button").removeClass("selected");
 $(this).toggleClass("selected");
   $(".data-down-buttonsmall").removeClass("selected");
    getallnum();
 
if ($(this).attr("data-down-button")=="video"){
	    toastr.success('说明：某些网页的视频下载地址被他们自己加密过所以下载不了！如果你能解密下载地址可以反馈我添加上去。过滤小图片可以过滤宽度或者高度小于120px的图片。有BUG和建议可以反馈我', '', { positionClass: 'toast-bottom-right', showDuration: 300, hideDuration: 1000, timeOut: 3000, extendedTimeOut: 1000, showEasing: 'swing', hideEasing: 'linear', showMethod: 'fadeIn', hideMethod: 'fadeOut' });
}
 
})
 
$("body").on('click', '.data-down-buttonselected', function() {
 
  var list=false;
 $(".data-down-list").each(function(k,v){
if ($(this).hasClass('selected')) {
 list=true;
}
})
if (list){
	$(".data-down-list").removeClass("selected");
	$(this).removeClass("selected");
	$(this).text("选择全部");
}else{
$(".data-down-list").addClass("selected");
$(this).addClass("selected");
 
 getallnum();
}
 
})
 
function getallnum() {
 
	let selectedindex=0;
 
$(".data-down-list.selected").each(function(k,v){
if ($(this).is(':visible')){
	selectedindex++;
}
})
 
$(".data-down-buttonselected").text("选择全部("+selectedindex+")");
numselected=selectedindex;
 
}
$("body").on('click', '.data-down-buttonsmall', function() {
if ($(this).hasClass('selected')) {
  $(".data-down-list").find("img").each(function(k,v){
  	  $(this).parent().show();
  })
 
  $(this).removeClass("selected");
} else{
 $(".data-down-list").find("img").each(function(k,v){
if ($(this).attr('data-width')) {
let width=$(this).attr('data-width');
let height=$(this).attr('data-height');
 
if (width<120 || height<120){
	$(this).parent().hide();
}
}
})
$(this).addClass("selected");
}
 getallnum();
})
$("body").on('click', '.data-down-url', function() {
			 var urls = [];
			 let selectedindex=0;
	$(".data-down-list.selected").each(function(k,v){
if ($(this).is(':visible')){
	urls.push($(this).attr('data-url'));
	selectedindex++;
}
})
	let downstr='导出失败';
	if (selectedindex==0){
if ($(".data-down-list").length>0){
	downstr=downstr+"，请选择需要导出的资源。点击屏幕中的资源即可选中";
}else{
downstr=downstr+"，当前没有搜索到任何资源";
}
toastr.error(downstr, '', { positionClass: 'toast-top-center', showDuration: 300, hideDuration: 1000, timeOut: 3000, extendedTimeOut: 1000, showEasing: 'swing', hideEasing: 'linear', showMethod: 'fadeIn', hideMethod: 'fadeOut' });
 
}
 
else{
	var myText = urls.join('\n\n');
GM_setClipboard(myText);
 
 
 
 
var container = document.createElement('div');
container.style.position = 'fixed';
container.style.top = '50%';
container.style.left = '50%';
container.style.transform = 'translate(-50%, -50%)';
container.style.maxWidth = '600px';
container.style.minWidth = '300px';
container.style.width = '80%';
container.style.maxHeight = '80%';
container.style.overflowY = 'auto';
container.style.backgroundColor = 'rgb(255, 255, 255)';
container.style.border = '1px solid rgb(204, 204, 204)';
container.style.borderRadius = '5px';
container.style.boxShadow = 'rgba(0, 0, 0, 0.2) 0px 2px 10px';
container.style.zIndex = '999999999999';
document.body.appendChild(container);
 
 
// 创建复制按钮
var copyButton = document.createElement('button');
copyButton.innerText = '复制';
copyButton.style.width = '50px';
copyButton.style.height = '25px';
copyButton.style.borderRadius = '5px';
copyButton.style.backgroundColor = '#6175bd';
copyButton.style.margin='8px 10px';
copyButton.style.border= 'none';
copyButton.style.marginRight= '10px';
copyButton.style.color= 'white';
copyButton.onclick = function() {
  myTextarea.select();
  document.execCommand('copy');
  alert('已复制到剪贴板');
};
container.appendChild(copyButton);
 
// 创建关闭按钮
var closeButton = document.createElement('button');
closeButton.innerText = '关闭';
closeButton.style.width = '50px';
closeButton.style.height = '25px';
closeButton.style.borderRadius = '5px';
closeButton.style.backgroundColor = '#6175bd';
closeButton.style.margin='8px 10px';
closeButton.style.border= 'none';
closeButton.style.marginRight= '10px';
closeButton.style.color= 'white';
closeButton.onclick = function() {
  container.style.display = 'none';
};
container.appendChild(closeButton);
 
// 创建文本框
var myTextarea = document.createElement('textarea');
var style = myTextarea.style;
style.width = '600px';
style.height = '700px';
style.resize = 'none';
style.textAlign = 'left';
style.display= 'inline-block';
style.caretColor='black';
myTextarea.value = myText;
container.appendChild(myTextarea);
 
// 将复制按钮和关闭按钮添加到文本框上方
container.insertBefore(copyButton, myTextarea);
container.insertBefore(closeButton, myTextarea);
 
}
 
	})
	$("body").on('click', '.data-down-down', function() {
		let selectedindex=0;
 
 var urls = [];
$(".data-down-list.selected").each(function(k,v){
if ($(this).is(':visible')){
	selectedindex++;
	urls.push($(this).attr('data-url'))
}
})
	let downstr='下载失败';
if (selectedindex==0){
if ($(".data-down-list").length>0){
	downstr=downstr+"，请选择需要下载的资源。点击屏幕中的资源即可选中";
}else{
downstr=downstr+"，当前没有搜索到任何资源";
}
	 toastr.error(downstr, '', { positionClass: 'toast-top-center', showDuration: 300, hideDuration: 1000, timeOut: 3000, extendedTimeOut: 1000, showEasing: 'swing', hideEasing: 'linear', showMethod: 'fadeIn', hideMethod: 'fadeOut' });
	 	  return
	  }else{
 
 
 
 
urls.forEach(function(url, index) {
if (url.startsWith('data:image')){
	var blob = b64toBlob(url);
	url=URL.createObjectURL(blob);
}
 
 let fileName=getFileNameFromUrl(url);
if (url.includes('sns-video-') && url.includes('xhscdn') ) {
	fileName= Date.now().toString() + Math.floor(1000 + Math.random() * 9000).toString()+'.mp4';
}
   GM_download({
    url: url,
    name: fileName,
   saveAs: false,
    onload: function() {
      toastr.success("已下载"+(index+1)+"个资源，剩余"+(selectedindex-(index+1 ))+"...", '', { positionClass: 'toast-bottom-right', showDuration: 300, hideDuration: 1000, timeOut: 3000, extendedTimeOut: 1000, showEasing: 'swing', hideEasing: 'linear', showMethod: 'fadeIn', hideMethod: 'fadeOut' });
 
    },
    onerror: function(err) {
      console.error('第'+(index)+'个资源下载失败'+err , err);
    }
  });
});
 
 
	  }
 
 
	})
 
    $("<style>")
        .prop("type", "text/css")
        .html(`
	.data-down-ui .data-down-list:hover {
border: 2px solid #00BFFF;
box-shadow: 0 0 5px #00BFFF;
}
.data-down-ui .selected {
border: 2px solid #ed3f68;
box-shadow: 0 0 5px #ff8ef1;
}
.data-down-ui .data-down-button, .data-down-buttonselected, .data-down-buttonsmall, .data-down-down, .data-down-url{
border: none;
    border-radius: 10px;
    background-color: #6175bd;
    color: white;
    padding: 8px 10px;
    font-size: 15px;
    display: initial;
}
 `)
        .appendTo("head");
 
 
 function completeUrl(url) {
if (url){
 
  if (/^https?:\/\//i.test(url)) {
    return url;
  }
  if (/^\/\//.test(url)) {
    if (location.protocol === 'https:') {
      return 'https:' + url;
}else{
 return 'http:' + url;
}
  }
    if (url.startsWith('data:')) {
    var commaIndex = url.indexOf(',');
    if (commaIndex !== -1) {
      var base64String = url.slice(commaIndex + 1);
      return url;
    }
  }
    var origin = window.location.origin;
if (url.indexOf('http') == -1){
if (url.startsWith('/')){
	  return origin + url;
}else{
	return origin +'/'+  url;
}
}
 
  return url;
  }
}
 
function b64toBlob(base64Data) {
  var byteString = atob(base64Data.split(',')[1]);
  var ab = new ArrayBuffer(byteString.length);
  var ia = new Uint8Array(ab);
  for (var i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  return new Blob([ab], {type: 'image/jpeg'});
}
 
function getFileNameFromUrl(url) {
  var fileName = '';
  if (url.indexOf('?') >= 0) {
    url = url.split('?')[0]; // 去掉查询参数
  }
  var pos = url.lastIndexOf('/');
  if (pos < 0) {
    pos = url.lastIndexOf('\\');
  }
  if (pos >= 0) {
    fileName = url.substring(pos + 1);
  } else {
    fileName = url;
  }
  return fileName;
}
 
 
 
 
 
function extractM3u8Links() {
	if (GM_info.script.namespace!="Z3JlYXN5Zm9yaw=="){
return
}
  var m3u8Links = "";
  var open = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function() {
    this.addEventListener('load', function() {
      var responseURL = this.responseURL;
      if (responseURL && responseURL.endsWith('.m3u8')) {
        m3u8Links = responseURL;
          addgom3u8(m3u8Links);
        return m3u8Links;
      }
    });
    open.apply(this, arguments);
  };
 
 
  var originalFetch = window.fetch;
  window.fetch = function() {
    return originalFetch.apply(this, arguments).then(function(response) {
      var responseURL = response.url;
      if (responseURL && responseURL.endsWith('.m3u8')) {
        m3u8Links = responseURL;
          addgom3u8(m3u8Links);
        return response;
      }
      return response;
    });
  };
 
 
var regex =/https:(.*?)\.m3u8/g;
var matches = document.documentElement.innerHTML.match(regex);
 
 
if (matches && matches.length > 0) {
    matches[0]=matches[0].replace(/\\/g, '');
    let startIndex = matches[0].lastIndexOf("https://");
if (startIndex !== -1) {
matches[0]= matches[0].substring(startIndex);
}
  var m3u8Links = matches[0];
  addgom3u8(m3u8Links);
  return
}
 
 
 
 
  return m3u8Links;
}
 
function addgom3u8(url) {
	if (url!="" && url !="https:(.*?).m3u8"){
 
var startIndex = url.lastIndexOf("https://");
if (startIndex !== -1) {
url= url.substring(startIndex);
}
 
 GM_setClipboard(url);
$("video").attr("m3u8",url);
GM_setValue('m3u8url',url);
let substr = '/20220707/nP0uddUJ/2000kb/hls/index.m3u8';
 
if (url.includes(substr)) {
return
}
 
 
toastr.options.onclick = function() {
  sectionm3u8menu(GM_getValue("m3u8url"));
}
 
// 显示 toastr 弹出框
toastr.success('刚刚获取到页面的m3u8资源，已经复制该链接，打开左侧【视频工具】粘贴该链接即可解析下载。', '', {
  positionClass: 'toast-bottom-right',
  showDuration: 300,
  hideDuration: 1000,
  timeOut: 3000,
  extendedTimeOut: 1000,
  showEasing: 'swing',
  hideEasing: 'linear',
  showMethod: 'fadeIn',
  hideMethod: 'fadeOut'
});
}
 
}
 extractM3u8Links();