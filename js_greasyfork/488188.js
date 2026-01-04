// ==UserScript==
// @name         Lasy_load_img_Library 3.0
// @namespace    http://tampermonkey.net/
// @version      2024.11.1
// @description  全新的写法
// @author       You
// @grant        none
// @include      *
// ==/UserScript==

function LazyLoad(){
	// let downloader = new window.GAIL.Downloader();
	let loadType = "ImgLoad";
	this.Set_laodType = (n)=>{loadType = n;};
	
	this.Start = async (srcs,imgs)=>{
		for(var i=0;i<imgs.length;i++){
			const img = imgs.eq(i);
			const src = srcs[i];
			if(loadType == "ImgLoad"){
				StartLoadOne(img);
				await ByLoadEvent(src);
				LoadedOne(src,img);
			}
		}
		AllOver();
	}
	function ByLoadEvent(src) {
	    return new Promise((resolve, reject) => {
	        const img = new Image(); // 使用 Image 构造函数
	        img.onload = () => resolve(); // 使用箭头函数
	        img.onerror = () => reject(); // 使用箭头函数
	        img.src = src;
	    });
	}
	let StartLoadOne = (img)=>{
		const p = $("<p>loading</p>");
		img.after(p);
	};
	this.OnStartLoadOne = (foo)=>{StartLoadOne = foo;}
	let LoadedOne = (src,img)=>{
		img.next("p").remove();
		img[0].src = src;
		console.log(src);
	};
	this.OnLoadedOne = (foo)=>{LoadedOne = foo;}
	let AllOver = ()=>{};
	this.OnAllOver = (foo)=>{AllOver = foo;};
}
window.LazyLoad = LazyLoad;