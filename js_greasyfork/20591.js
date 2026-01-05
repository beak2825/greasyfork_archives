// ==UserScript==
// @name   		获取页面内大图链接 tistory、imgur、naver blog
// @author		驴肉火烧Pro
// @description 自己编写，获取tistory、imgur、naver blog原大图、staticflickr。链接在textarea里。naver blog过滤了导航图，有过滤url。 网页必须有URL跳转(?)
// @version		1.3
// @grant none
// @include         http://*
// @include         https://*
// @namespace https://greasyfork.org/users/21630
// @downloadURL https://update.greasyfork.org/scripts/20591/%E8%8E%B7%E5%8F%96%E9%A1%B5%E9%9D%A2%E5%86%85%E5%A4%A7%E5%9B%BE%E9%93%BE%E6%8E%A5%20tistory%E3%80%81imgur%E3%80%81naver%20blog.user.js
// @updateURL https://update.greasyfork.org/scripts/20591/%E8%8E%B7%E5%8F%96%E9%A1%B5%E9%9D%A2%E5%86%85%E5%A4%A7%E5%9B%BE%E9%93%BE%E6%8E%A5%20tistory%E3%80%81imgur%E3%80%81naver%20blog.meta.js
// ==/UserScript==

//忽略的链接
var ignore_links = new Array();
ignore_links[0] = "http://cfile25.uf.tistory.com/original/240D9043573347FA2B1197"; //http://jinfruitstore.tistory.com/
ignore_links[1] = "http://cfile25.uf.tistory.com/image/240D9043573347FA2B1197";

//获取图片URL
var img_tags = document.getElementsByTagName('img');

//生成一个外包div
var getURLDiv = document.createElement('div');
getURLDiv.className = 'getURLbox';	
getURLDiv.id = 'getURLboxId';		 
getURLDiv.innerHTML = "<p style='padding : 3px 0px 3px 5px; font-weight:bold; color:#FFFFF0; background-color: #8470FF'>tistory imgur 图片链接</p>";
//链接的div
var getURLboxlinks = document.createElement('div');
getURLboxlinks.id = 'getURLboxlinks';	
//用于隐藏和显示的按钮
var buttonshowgetURLDiv = document.createElement('button');
buttonshowgetURLDiv.innerHTML = '隐藏链接';
buttonshowgetURLDiv.setAttribute("onclick","document.getElementById('getURLboxlinks').style.display='none'"); 
var buttonhidegetURLDiv = document.createElement('button');
buttonhidegetURLDiv.innerHTML = '显示链接';
buttonhidegetURLDiv.setAttribute("onclick","document.getElementById('getURLboxlinks').style.display='block'"); 
//复制button
var buttoncopy = document.createElement('button');
buttoncopy.innerHTML = '复制';
buttoncopy.setAttribute("onclick","copyUrls()"); 
//buttoncopy.setAttribute("onclick","GM_setClipboard(getURLboxlinks.innerText)"); 

//添加urls
getURLboxlinks = add_pic_links(img_tags,ignore_links,getURLboxlinks);

//添加textarea和复制用funtion
var textareaURLs = document.createElement('textarea'); 
textareaURLs.id = 'urlinput'; 
textareaURLs.name = 'urlinput'; 
textareaURLs.value = getURLboxlinks.innerText;
var buttonshowgetURLDivjs = document.createElement('script'); 
buttonshowgetURLDivjs.innerHTML = "function copyUrls(){ urlinput.select(); document.execCommand('Copy'); }";  
	
if(have_pic_link(img_tags)==1){
	document.body.appendChild(getURLDiv);
	getURLDiv.appendChild(buttoncopy); 
    var afCopyBr = document.createElement('br'); getURLDiv.appendChild(afCopyBr); 
	getURLDiv.appendChild(textareaURLs); 
	getURLDiv.appendChild(buttonshowgetURLDivjs); 
  	document.getElementById('getURLboxlinks').style.display='none';
}

//function copyUrls(){ urlinput.select(); document.execCommand('Copy'); }

//判断有没有需要的图
function have_pic_link(tags){ 
	var havepic = 0; 	
	for (var i = 0; i < tags.length; i++) {
        if(tags[i].src.match(/\/\/cfile.*\/original\//i) || tags[i].src.match(/\/\/cfile.*\/image\//i) || tags[i].src.match(/i\.imgur.*/i) || tags[i].src.match(/imgur.*/i) || tags[i].src.match(/\.staticflickr.*/i) ){ 
				havepic = 1;
		}
		else if(tags[i].src.match(/\/\/postfiles.*/i)){ 
			if(tags[i].src.match(/type=m1.*/i)){  } //过滤导航用缩略图
			else{ havepic = 1;}	
		}
	}
	return havepic;
}

//处理链接 向div添加 返回div
function add_pic_links(tags,ignore_links,getURLboxlinks) {
	for (var i = 0; i < tags.length; i++) {
		var addBR = document.createElement('br');
		outerloop:
		{//代码块
		for ( var i1 = 0; i1 < ignore_links.length; i1++){
			if (tags[i].src==ignore_links[i1]) {break outerloop;}				
		}
        if(tags[i].src.match(/\/\/cfile.*\/original\//i)){ 
				var link = document.createElement('p');
                link.innerHTML = tags[i].src;
                getURLboxlinks.appendChild(link);		
                getURLboxlinks.appendChild(addBR);
				
		}
        else if(tags[i].src.match(/\/\/cfile.*\/image\//i)){
				var link = document.createElement('p');
                link.innerHTML =  tags[i].src.replace('image', 'original');
                getURLboxlinks.appendChild(link);	
                getURLboxlinks.appendChild(addBR);
        }
        else if(tags[i].src.match(/i\.imgur.*/i)){ 
				var link = document.createElement('p');
                link.innerHTML = tags[i].src;
                getURLboxlinks.appendChild(link);		
                getURLboxlinks.appendChild(addBR);
		}
		else if(tags[i].src.match(/imgur.*/i)){ 
				var link = document.createElement('p');
                link.innerHTML = tags[i].src;
                getURLboxlinks.appendChild(link);		
                getURLboxlinks.appendChild(addBR);
		}
		else if(tags[i].src.match(/\/\/postfiles.*/i)){ 
			if(tags[i].src.match(/type=m1.*/i)){  } //过滤导航用缩略图
			else{
				var link = document.createElement('p');
                link.innerHTML = tags[i].src.replace('postfiles', 'blogfiles');
                link.innerHTML = link.innerHTML.replace('?type=w1', '');
                getURLboxlinks.appendChild(link);		
                getURLboxlinks.appendChild(addBR);
			}	
		}else if(tags[i].src.match(/\.staticflickr.*/i)){ 
				var link = document.createElement('p');
                link.innerHTML = tags[i].src;
                getURLboxlinks.appendChild(link);		
                getURLboxlinks.appendChild(addBR);
		}
		}//代码块结尾
	}
	return getURLboxlinks;
}

//设置CSS http://www.w3school.com.cn/jsref/dom_obj_style.asp
document.getElementById("getURLboxId").style.cssText=" position:absolute; left:5px; top:25px; z-index:999; margin:0 auto; padding:0 auto; ";

 

/*			
http://cfile30.uf.tistory.com/original/2275164855FC9DFA252CE4
http://i.imgur.com/4SDAV6y.jpg

http://postfiles3.naver.net/20151114_114/deliveryjy_1447505814791WhNtY_JPEG/IMG_2875.jpg?type=w1
http://postfiles8.naver.net/20151114_135/deliveryjy_1447505413239wLSgS_JPEG/IMG_2774.jpg?type=m1
type=w1是博客正文图，type=m1是导航用缩略图

https://farm6.staticflickr.com/5728/22747977917_06d928c5bb_o.jpg

/KakaoTalk_20160407_161404117.jpg?type=w1
*/