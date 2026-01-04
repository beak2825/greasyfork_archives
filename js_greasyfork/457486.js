// ==UserScript==

// @namespace          https://greasyfork.org/zh-TW/users/142344-jasn-hr
// @name               e-hentai Scroll Mode
// @name:zh-TW         e-hentai 滾動模式
// @name:zh-CN         e-hentai 滚动模式
// @name:ja            e-hentai スクロールモード
// @description        Scroll to browsing e-hentai's art.
// @description:zh-TW  在 e-hentai 滾動卷軸持續瀏覽
// @description:zh-CN  在 e-hentai 滚动卷轴持续浏览
// @description:ja     e-hentaiスクロールスクロールでブラウジングを続ける
// @copyright          2019, HrJasn (https://greasyfork.org/zh-TW/users/142344-jasn-hr)
// @license            GPL-3.0-or-later
// @version            2.1.5
// @icon               https://www.google.com/s2/favicons?domain=e-hentai.org
// @include            http*://e-hentai.org/s/*
// @include            http*://exhentai.org/s/*
// @exclude            http*://www.e-hentai.org/*
// @grant              none
// @downloadURL https://update.greasyfork.org/scripts/457486/e-hentai%20Scroll%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/457486/e-hentai%20Scroll%20Mode.meta.js
// ==/UserScript==

window.onload = function(){

	targetURL = "";
	
	currentImageURL = "";
	currentImageOnclick = "";
	
	currentImageScrollTop = 0;
	lastScrollTop = 0;

	mainImage = document.querySelector("#img");
	mainImage_parentDIV = mainImage.parentNode.parentNode.parentNode;

	scrollMode_DIV = document.body.appendChild(document.createElement("div"));
	scrollMode_DIV.style = "z-index:999;position:fixed;cursor:pointer;left:0px;width:100%;height:0px;top:" + window.innerHeight + "px;-webkit-overflow-scrolling:touch;overflow-y:scroll;background-color:gray;transition:all 0.5s ease 0.5s;";

	mainImage_clone = scrollMode_DIV.appendChild(mainImage.cloneNode(true));
	mainImage_clone.style.maxWidth = "";
	mainImage_clone.style.maxHeight = "";
	mainImage_clone_originalWidth = mainImage_clone.offsetWidth;
	mainImage_clone_originalHeight = mainImage_clone.offsetHeight;
	mainImage_clone.setAttribute("originalWidth",mainImage_clone_originalWidth);
	mainImage_clone.setAttribute("originalHeight",mainImage_clone_originalHeight);
	mainImage_clone.style.width = "80%";
	mainImage_clone.style.height = (mainImage_clone_originalHeight*mainImage_clone.offsetWidth)/mainImage_clone_originalWidth + "px";
	mainImage_clone.setAttribute("prevURL",mainImage_parentDIV.querySelector('a#prev').href);
	mainImage_clone.setAttribute("prevOnclick",mainImage_parentDIV.querySelector('a#prev').getAttribute("onclick"));
	mainImage_clone.setAttribute("nextURL",mainImage_parentDIV.querySelector('a#next').href);
	mainImage_clone.setAttribute("nextOnclick",mainImage_parentDIV.querySelector('a#next').getAttribute("onclick"));
	
	targetURL = mainImage_clone.getAttribute("nextURL");
	sendInfo(targetURL);

	scrollMode_DIV.addEventListener('click', function(){
		
		if (scrollMode_DIV.offsetHeight==0) {

			document.body.style.overflow="hidden";

			scrollMode_DIV.style.top = "0px";
			scrollMode_DIV.style.height = window.innerHeight + "px";

			scrollMode_DIV.style.transition = "";
			scrollMode_DIV.scrollTop = mainImage_clone.offsetTop + mainImage_clone.offsetHeight - window.innerHeight;

			var tmpInterval = setInterval(function(){				
				if(scrollMode_DIV.scrollTop <= (mainImage_clone.offsetTop + mainImage_clone.offsetHeight)){
					scrollMode_DIV.scrollTop += ((((mainImage_clone.offsetTop + mainImage_clone.offsetHeight) - scrollMode_DIV.scrollTop)/200)+10);
				} else {
					clearInterval(tmpInterval);
				}				
			},((scrollMode_DIV.scrollTop - (mainImage_clone.offsetTop + mainImage_clone.offsetHeight))/200));
			
			scrollMode_DIV.style.transition = "all 0.5s ease 0.5s";

		} else {

			var imgObjs = scrollMode_DIV.querySelectorAll("img");

			for (var i = 0; i < imgObjs.length; i++) {
				
				if ( scrollMode_DIV.scrollTop < imgObjs[i].offsetTop ) {
					
					currentImageScrollTop = scrollMode_DIV.scrollTop;
					if(imgObjs[i-1]){
						mainImage_clone = imgObjs[i-1];
						currentImageScrollTop = scrollMode_DIV.scrollTop - mainImage_clone.offsetTop;
					}
					
					var a = document.createElement("a");
					a.setAttribute("href", "#");
					a.setAttribute("onclick",imgObjs[i].getAttribute("prevOnclick"));
					document.body.appendChild(a);
					a.style.display = "none";
					a.onclick();
					
					break;
					
				}
				
			}
				
			scrollMode_DIV.style.top = window.innerHeight + "px";
			scrollMode_DIV.style.height = "0px";

			window.focus();

			setTimeout(function(){
				document.body.style.overflow="";
			}, 510);

			if(currentImageScrollTop){
				window.scrollTo(0,currentImageScrollTop);
			}else{
				window.scrollTo(0,Math.max(window.pageYOffset,document.documentElement.scrollTop)*0.98);
			}

			if (document.body.getAttribute('listener') !== 'true') {

				document.body.addEventListener("wheel",openscrollMode_DIV,false);
				document.body.addEventListener("scroll",openscrollMode_DIV,false);
				document.body.addEventListener("keydown",openscrollMode_DIV,false);

			}

		}
		
	});

	window.addEventListener('resize', function(){
		
		scrollMode_DIV.style.transition = "";
		scrollMode_DIV.style.height = window.innerHeight + "px";
		var lastscrollHeight = scrollMode_DIV.scrollHeight;
		
		scrollMode_DIV.querySelectorAll("img").forEach(function(imgObj){

			imgObj.style.width = "80%";
			var mainImage_clone_originalWidth = imgObj.getAttribute("originalWidth");
			var mainImage_clone_originalHeight = imgObj.getAttribute("originalHeight");
			imgObj.style.height = (mainImage_clone_originalHeight*imgObj.offsetWidth)/mainImage_clone_originalWidth + "px";

		});
		
		scrollMode_DIV.style.transition = "all 0.5s ease 0.5s";
		scrollMode_DIV.scrollTop = scrollMode_DIV.scrollTop*(scrollMode_DIV.scrollHeight/lastscrollHeight);

	});

	var openscrollMode_DIV = function(){

		var currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;

		if ( (currentScrollTop >= lastScrollTop) && (currentScrollTop + window.innerHeight >= document.body.offsetHeight*0.99) ) {

			scrollMode_DIV.click();
			scrollMode_DIV.focus();

			this.removeEventListener('wheel', arguments.callee);
			this.removeEventListener('scroll', arguments.callee);
			this.removeEventListener('keydown', arguments.callee);

		}

		lastScrollTop = currentScrollTop <= 0 ? 0 : currentScrollTop;

	}

	document.body.addEventListener("wheel",openscrollMode_DIV,false);
	document.body.addEventListener("scroll",openscrollMode_DIV,false);
	document.body.addEventListener("keydown",openscrollMode_DIV,false);

	var loadpages = function(event){

		if (scrollMode_DIV.scrollTop + window.innerHeight >= scrollMode_DIV.scrollHeight*0.7) {

			scrollMode_DIV.style.height = window.innerHeight + "px";

			var imgObjs = scrollMode_DIV.querySelectorAll("img");

			if (imgObjs[imgObjs.length-1].getAttribute("nextURL") != targetURL) {
				currentImageURL = imgObjs[imgObjs.length-1].getAttribute("nextURL");
				currentImageOnclick = imgObjs[imgObjs.length-1].getAttribute("nextOnclick");
				targetURL = imgObjs[imgObjs.length-1].getAttribute("nextURL");
				sendInfo(targetURL);
			}

		}

	}

	scrollMode_DIV.addEventListener("wheel",loadpages,false);
	scrollMode_DIV.addEventListener("scroll",loadpages,false);
	scrollMode_DIV.addEventListener("keydown",loadpages,false);

	function sendInfo(url){

		if (window.XMLHttpRequest) {
			request = new XMLHttpRequest();
		}
		else if (window.ActiveXObject) {
			request = new ActiveXObject("Microsoft.XMLHTTP");
		}

		try {
			request.onreadystatechange = getInfo;
			request.open("GET", url, true);
			request.send();
		}
		catch (e) {
			console.log("Unable to connect to server");
		}
	}

	function getInfo(){
		
		if (request.readyState == 4) {

			var getInfoText = request.responseText;
			var parser = new DOMParser();
			var getInfoBody = parser.parseFromString(getInfoText,"text/html").body;
			var getInfoImage = getInfoBody.querySelector("#img");
			var getInfoImage_parentDIV = getInfoImage.parentNode.parentNode.parentNode;
		
			getInfoImage.setAttribute("prevURL",getInfoImage_parentDIV.querySelector('a#prev').href);
			getInfoImage.setAttribute("prevOnclick",getInfoImage_parentDIV.querySelector('a#prev').getAttribute("onclick"));
			getInfoImage.setAttribute("nextURL",getInfoImage_parentDIV.querySelector('a#next').href);
			getInfoImage.setAttribute("nextOnclick",getInfoImage_parentDIV.querySelector('a#next').getAttribute("onclick"));
			getInfoImage.setAttribute("currentImageURL",currentImageURL);
			getInfoImage.setAttribute("currentImageOnclick",currentImageOnclick);

			putImage(getInfoImage);

		}
		
	}

	function putImage(targetImage){

		var toLoadImage = scrollMode_DIV.appendChild(targetImage);
		toLoadImage.style.maxWidth = "";
		toLoadImage.style.maxHeight = "";
		var toLoadImage_originalWidth = toLoadImage.offsetWidth;
		var toLoadImage_originalHeight = toLoadImage.offsetHeight;
		toLoadImage.setAttribute("originalWidth",toLoadImage_originalWidth);
		toLoadImage.setAttribute("originalHeight",toLoadImage_originalHeight);
		toLoadImage.style.width = "80%";
		toLoadImage.style.height = (toLoadImage_originalHeight*toLoadImage.offsetWidth)/toLoadImage_originalWidth + "px";

	}

}
