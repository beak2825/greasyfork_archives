// ==UserScript==
// @name       emonl
// @version      2025.1.24.03
// @description  去广告
// @author       You
// @license MIT
// @include      https://www.emonl.com/*
// @include		 https://*.lmgmi.com/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_download
// @require https://code.jquery.com/jquery-3.5.1.min.js
// @require https://update.greasyfork.org/scripts/480132/1476440/Get_all_img_Library.js
// @require https://update.greasyfork.org/scripts/522187/1511410/Kquery.js
// @require https://update.greasyfork.org/scripts/515674/1518464/MyDownloader.js
// @require https://update.greasyfork.org/scripts/515677/1525826/MyShowBox.js
// @namespace https://greasyfork.org/users/1210231
// @downloadURL https://update.greasyfork.org/scripts/515445/emonl.user.js
// @updateURL https://update.greasyfork.org/scripts/515445/emonl.meta.js
// ==/UserScript==
 
$(function(){
	if(window.location.href.indexOf('lmgmi')>0){return;}
	List.Start()
	Home.Start()
})
 
class List{
	static Start(){
		List.GetImg();
		List.RemoveAtagAD();
	}
	static GetImg(){
		const gs = new GAIL_and_ShowBox();
		let hrefs = [];
		hrefs.push(window.location.href);
		$(".page-links a").each(function(){hrefs.indexOf(this.href)<0?hrefs.push(this.href):""});
		console.log(hrefs);
		gs.GetImg((data)=>{
			return $(data).find('.single-content img');
		});
		//gs.donwloadType.value = "atag";
		gs.Start(hrefs);
		$('body').on('touchstart',function(){
			window.ShowBox.ShowInNewPage($('.single-content img:first').attr('src'));
			$('body').off('touchstart');
		})
	}
	static RemoveAtagAD(){
		$('a.sc').on("touchend",function(event){
			event.stopPropagation();
		})
	}
}
class Home{
	static Start(){
		const items = ()=>$('.post-item-list')
		WaitingElement(items)
			.then(atag=>{
				const sb = new Slip_box();
				sb.Event = box=>{
					let href = box.find('a.sc');
					if(href.length==1){
						window.open(href[0].href);
					}else{
						console.log(href);
					}
				}
				sb.Add(atag);
			})
	}
}
 
 
/**
 * 遍历网址并把图片加入showbox的类。
 
 * @example
 const gs = new GAIL_and_ShowBox();
 let hrefs = [];
 gs.GetImg((data)=>{
 	return $(data).find('.single-content img');
 })
 gs.Start(hrefs);
 
 * @ps 一定要先设置GAIL_and_ShowBox.GetImg(Action<stirng> foo),再调用GAIL_and_ShowBox.Start(string[] hrefs)
*/
function GAIL_and_ShowBox(){
	let imgs = $();
	let key = "*";
	let hrefs = null;
	let nums = 0;
	let showBox = new window.ShowBox();
	let SetHrefs = (hhrefs)=>{
		hrefs = hhrefs;
		nums = hrefs.length;
	}
	let Geturl = (i)=>{return hrefs[i];}
	let GetImg = null;
	let PutImg = (iimgs,i) => {
		imgs = imgs.add(iimgs);
		if(i>=hrefs.length - 1){
			showBox.Add(imgs);
		}
	};
	
	this.getImgType = "ajax";
	this.showBox = {get obj(){return showBox;}}
	this.donwloader = {get obj(){return showBox.downloader.obj}}
	/**
	 * @example donwloadType.value = "GM_download" || "atag" || "blob"
	*/
	this.donwloadType = {get value(){return showBox.downloader.obj.downloadType.value},set value(v){showBox.downloader.obj.downloadType.value = v}}
	
	/**
	 * 重写获取每一页网址的方法(非必要别重写)
	 * @example Geturl((i)=>{return hrefs[i]})
	 * @param {function({number}i):href} foo
	*/
	this.Geturl = (foo) => {Geturl = foo;}
	
	/**
	 * 每次ajax后通过data获取图片的方法
	 * @example GetImg((data)=>{
		     return $("data").find("img");
	    });
	 * @param {function(data):imgs} foo
	*/
	this.GetImg = (foo) => {GetImg = foo}
	
	/**
	 * 重写如何加入图片的逻辑(非必要别重写)
	 * @example PutImg((imgs,i)=>{...})
	 * @param {function({JQuery}imgs,{number}i)} foo
	*/
	this.PutImg = (foo) =>{PutImg = foo}
	
	/**
	 * 开始遍历网址
	 * @example Start(string[] hrefs)
	 * @param {href[]} hhrefs
	*/
	this.Start = (hhrefs)=>{
		if(!hhrefs){return;}
		SetHrefs(hhrefs);
		if(this.getImgType == "ajax"){
			window.GAIL.get_img_obo_ajax_href(key,nums,Geturl,GetImg,PutImg);
		}
	}
}
 
 
function Slip_box(){
	this.Add = (items)=>{
		let sb = this;
		sb.Add_css();
		items.each(function(){
			let box = sb.Add_box(this);
			sb.Add_Event(box);
		})
	}
	this.Add_css = ()=>{
		let css = `
		<style>
			.slip-box{
				width: 100px;
				position: relative;
				height: 100%;
				display: grid;
				grid-template-columns: 1fr 1fr;
				overflow-x: scroll;
				scroll-snap-type: x mandatory;
			}
			.slip-box>*{
				scroll-snap-align: start;
			}
			.slip-blank{
				width:50px;
				height: 100%;
				background-color: red;
			}
		</style>
		`
		$('body').append(css);
	}
	this.Add_box = (ele)=>{
		let box = $("<div class='slip-box'><div class='slip-blank'></div></div>")
		box.width($(ele).width());
		$(ele).width($(ele).width());
		$(ele).after(box);
		box.prepend(ele);
		return box;
	}
	this.Add_Event = (box)=>{
		const w = 50;
		const sb = this;
		let evented = false;
		box.scroll(function(){
			if(this.scrollLeft>=w && !evented){
				sb.Event($(this));
				evented = true;
			}else if(this.scrollLeft<w){
				evented = false;
			}
		})
	}
	this.Event = (box)=>{console.log(box)};
}
 
window.ShowBox.ShowInNewPage = (url)=>{
	GM_setValue('ShowBoxInNewPage','yes');
	window.open(url);
	const img = $('.clickShowBox .item');
	GM_setValue('ShowBoxInNewPage_num',img.length);
	GM_deleteValue('ShowBoxInNewPage_img');
	var i = 0;
	let obo = setInterval(()=>{
		if(i==img.length){clearInterval(obo);return;}
		if(true){
			let html = img.eq(i++)[0].innerHTML;
			if(i!=img.length){
				html += img.eq(i++)[0].innerHTML;
			}
			if(i!=img.length){
				html += img.eq(i++)[0].innerHTML;
			}
			if(i!=img.length){
				html += img.eq(i++)[0].innerHTML;
			}
			if(i!=img.length){
				html += img.eq(i++)[0].innerHTML;
			}
			GM_setValue('ShowBoxInNewPage_img',html);
		}
	},100);
}
window.ShowBox.Linsening_ShowInNewPage = ()=>{
	console.log(GM_getValue('ShowBoxInNewPage'))
	if(!GM_getValue('ShowBoxInNewPage')){
		return;
	}
	GM_deleteValue('ShowBoxInNewPage');
	const box = new window.ShowBox();
	let imgs = $();  // 保持 imgs 在外部作用域中，不要在定时器内部重新定义
	let i = 0;
	const num = Number(GM_getValue('ShowBoxInNewPage_num'));
	let imgValue;
	let obo = setInterval(() => {
	    if (i == num) {
	        console.log(imgs);  // 打印 imgs 对象，确保其被累加
	        GM_deleteValue('ShowBoxInNewPage_num');
	        box.Add(imgs);
	        $('.clickShowBox_ShowBu').click();// 将 imgs 添加到 box 中
	        clearInterval(obo);  // 停止定时器
	        return;
	    }
	
	    // 获取图片值
	    let v = GM_getValue('ShowBoxInNewPage_img');
	    if (v && v!=imgValue) {
	        console.log(v);  // 打印获取到的值，确认它是有效的
			img = $(v);
			imgValue = v;
			img.each(function(){
				$(this).attr('src',$(this).attr('small_src'));
			})
	        imgs = imgs.add(img);  // 将图像添加到 imgs
	        //GM_deleteValue('ShowBoxInNewPage_img');  // 删除已经处理过的值
	        i += img.length;  // 更新计数器
			window.GAIL ? window.GAIL.showmass(`${i}/${num}`) : null;
			$('.mass_top').css('font-size',(window.innerWidth/10/2).toFixed(2)+'px');
	    }
	}, 10);
}
$(function(){
	window.ShowBox.Linsening_ShowInNewPage();
	$('.clickShowBox .pages,.clickShowBox .download,.clickShowBox .downloadall').css('font-size',(window.innerWidth/10/2).toFixed(2)+'px');
	$('.clickShowBox .close').css({
		width:(window.innerWidth/10/2).toFixed(2)+'px',
		height:(window.innerWidth/10/2).toFixed(2)+'px'
	})
        // 获取当前时间
        let lastTapTime = 0;

        // 监听触摸事件
        document.addEventListener('touchstart', function (event) {
            const currentTime = new Date().getTime();
            const tapTimeDelta = currentTime - lastTapTime;

            // 如果两次触摸时间间隔小于 300ms，视为双击
            if (tapTimeDelta < 300) {
                event.preventDefault(); // 阻止双击的默认行为（缩放）
            }

            // 更新最后一次触摸时间
            lastTapTime = currentTime;
        }, { passive: false });
})