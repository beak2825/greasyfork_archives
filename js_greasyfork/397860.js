// ==UserScript==
// @name				Shopping website (amazon, jd, ruten, shopee, taobao, tmall) -  keyboard navigation
// @name:zh-TW			購物網 (亞馬遜, 露天, 蝦皮, 淘寶, 天貓, 京東, PChome 24h) - 鍵盤導覽
// @name:zh-CN			购物网 (亞馬遜, 露天, 虾皮, 淘宝, 天猫, 京东, PChome 24h) - 键盘导览
// @description			[a / ←] prev page, [d / →] next page. [s / ↓] parent . Used for the product-list, image-gallery, rate-page...
// @description:zh-TW	[a / ←]前一頁，[d / →]下一頁。包含產品列表、照片庫、評價頁...
// @description:zh-CN	[a / ←]前一页，[d / →]下一页。包含产品列表、照片库、评价页...
// @author				Evan Tseng
// @version				0.5.28
// @namespace			https://greasyfork.org/zh-TW/users/393133-evan-tseng
// @match				*://24h.pchome.com.tw/*
// @match				*://*.aliexpress.com/*
// @include				*://*.amazon.co*
// @match				*://*.jd.com/*
// @match				*://*.1688.com/*
// @match				*://*.taobao.com/*
// @match				*://*.tmall.com/*
// @match				*://*.momomall.com.tw/*
// @match				*://*.momoshop.com.tw/*
// @match				*://*.ruten.com.tw/*
// @match				*://shopee.tw/*
// @run-at				document-start
// @grant				none
// @license				MIT
// @downloadURL https://update.greasyfork.org/scripts/397860/Shopping%20website%20%28amazon%2C%20jd%2C%20ruten%2C%20shopee%2C%20taobao%2C%20tmall%29%20-%20%20keyboard%20navigation.user.js
// @updateURL https://update.greasyfork.org/scripts/397860/Shopping%20website%20%28amazon%2C%20jd%2C%20ruten%2C%20shopee%2C%20taobao%2C%20tmall%29%20-%20%20keyboard%20navigation.meta.js
// ==/UserScript==

(function() {
	'use strict';
	var host = window.location.hostname.replace(/(?:\w+\.)*(1688|aliexpress|amazon|jd|momoshop|momomall|pchome|ruten|shopee|taobao|tmall)(?:\.\w+){1,2}$/, "$1").toLowerCase();

	// 按鍵對應元素
	const elmPatt = {
		'aliexpress': {
			enter: [],
			esc: [],
			w: [],
			s: [],
			a: ['.comet-pagination-prev button.comet-pagination-item-link'],
			d: ['.comet-pagination-next button.comet-pagination-item-link'],
			arrowUp: [],
			arrowDown: [],
			arrowLeft: ['.comet-pagination-prev button.comet-pagination-item-link'],
			arrowRight: ['.comet-pagination-next button.comet-pagination-item-link']
		},
		'amazon': {
			enter: [],
			esc: ['.a-popover-modal .a-button-top-right'],
			w: [],
			s: ['#leftNav .s-ref-indent-neg-micro:nth-last-of-type(2) a', '#departments .a-spacing-micro:nth-last-of-type(2) a', '.a-breadcrumb li:last-of-type a'],
			a: ['ul.a-pagination li:first-of-type>a', '#ivThumbs .ivThumb.selected', '#pagnPrevLink', '.s-pagination-item.s-pagination-previous'],
			d: ['ul.a-pagination li:last-of-type>a', '#ivThumbs .ivThumb.selected', '#pagnNextLink', '.s-pagination-item.s-pagination-next'],
			arrowUp: [],
			arrowDown: ['#leftNav .s-ref-indent-neg-micro:nth-last-of-type(2) a', '#departments .a-spacing-micro:nth-last-of-type(2) a', '.a-breadcrumb li:last-of-type a'],
			arrowLeft: ['ul.a-pagination li:first-of-type>a', '#ivThumbs .ivThumb.selected', '#pagnPrevLink', '.s-pagination-item.s-pagination-previous'],
			arrowRight: ['ul.a-pagination li:last-of-type>a', '#ivThumbs .ivThumb.selected', '#pagnNextLink', '.s-pagination-item.s-pagination-next']
		},
		'jd': {
			enter: [],
			esc: [],
			w: [],
			s: [],
			a: ['.f-pager a.fp-prev:not(.disabled)', '.ui-page a.ui-page-prev', '.preview .arrow-prev:not(.disabled)', '.comments-list .ui-pager-prev'],
			d: ['.f-pager a.fp-next:not(.disabled)', '.ui-page a.ui-page-next', '.preview .arrow-next:not(.disabled)', '.comments-list .ui-pager-next'],
			arrowUp: [],
			arrowDown: [],
			arrowLeft: ['.f-pager a.fp-prev:not(.disabled)', '.ui-page a.ui-page-prev', '.preview .arrow-prev:not(.disabled)', '.comments-list .ui-pager-prev'],
			arrowRight: ['.f-pager a.fp-next:not(.disabled)', '.ui-page a.ui-page-next', '.preview .arrow-next:not(.disabled)', '.comments-list .ui-pager-next']
		},
		'momoshop':{
			enter: [],
			esc: [],
			w: [],
			s: [".navlist dd:nth-last-child(2) a"],
			a: [".pageArea .selected"],
			d: [".pageArea .selected"],
			arrowUp: [],
			arrowDown: [".navlist dd:nth-last-child(2) a"],
			arrowLeft: [".pageArea .selected"],
			arrowRight: [".pageArea .selected"]
		},
		'momomall':{
			enter: [],
			esc: [],
			w: [],
			s: [".navlist dd:nth-last-child(2) a"],
			a: [".pageArea .selected"],
			d: [".pageArea .selected"],
			arrowUp: [],
			arrowDown: [".navlist dd:nth-last-child(2) a"],
			arrowLeft: [".pageArea .selected"],
			arrowRight: [".pageArea .selected"]
		},
		'pchome': {
			enter: [],
			esc: [],
			w: [".swiper-slide.swiper-slide-active img, .category dl li.actived"],
			s: [".category dl li.actived"],
			a: [".c-popUp.is-visible .swiper-button-prev, .c-pagination__item.is-prev>.btn"],
			d: [".c-popUp.is-visible .swiper-button-next, .c-pagination__item.is-next>.btn"],
			arrowUp: [".swiper-slide.swiper-slide-active img, .category dl li.actived"],
			arrowDown: [".category dl li.actived"],
			arrowLeft: [".c-popUp.is-visible .swiper-button-prev, .c-pagination__item.is-prev>.btn"],
			arrowRight: [".c-popUp.is-visible .swiper-button-next, .c-pagination__item.is-next>.btn"]
		},
		'ruten': {
			enter: [".rt-jqmodal-jqmClose"],
			esc: [".rt-jqmodal-jqmClose"],
			w: [".item-gallery-main-image img.js-main-img"],
			s: [],
			a: ['.pager .pager-prev:not(.is-disabled)', '.item-gallery .img-popup[style="z-index: 9999; display: block;"] .rti-chevron-left-default', '.pagination .prev', '.rt-pagination li.prev a', '.rt-store-pagination li.prev>a'],
			d: ['.pager .pager-next:not(.is-disabled)', '.item-gallery .img-popup[style="z-index: 9999; display: block;"] .rti-chevron-right-default', '.pagination .next', '.rt-pagination li.next a', '.rt-store-pagination li.next>a'],
			arrowUp: [".item-gallery-main-image img.js-main-img"],
			arrowDown: [],
			arrowLeft: ['.pager .pager-prev:not(.is-disabled)', '.item-gallery .img-popup[style="z-index: 9999; display: block;"] .rti-chevron-left-default', '.pagination .prev', '.rt-pagination li.prev a', '.rt-store-pagination li.prev>a'],
			arrowRight: ['.pager .pager-next:not(.is-disabled)', '.item-gallery .img-popup[style="z-index: 9999; display: block;"] .rti-chevron-right-default', '.pagination .next', '.rt-pagination li.next a', '.rt-store-pagination li.next>a']
		},
		'shopee': {
			enter: [".shopee-alert-popup__button-horizontal-layout>button.shopee-alert-popup__btn:first-child"],
			esc: [],
			w: [".product-briefing .flex-column>div:first-child>div>div:last-child"],
			s: [],
			a: ["div#modal .flex>div:first-child>div:nth-last-child(2)", ".shopee-mini-page-controller__prev-btn", ".product-ratings__page-controller .shopee-icon-button.shopee-icon-button--left", ".shopee-page-controller .shopee-icon-button--left", ".shopee-icon-button._1mHKHL", ".product-variation.product-variation--selected"],
			d: ["div#modal .flex>div:first-child>div:last-child", ".shopee-mini-page-controller__next-btn", ".product-ratings__page-controller .shopee-icon-button.shopee-icon-button--right", ".shopee-page-controller .shopee-icon-button--right", ".shopee-icon-button._2H6_oQ", ".product-variation.product-variation--selected"],
			arrowUp: [".product-briefing .flex-column>div:first-child>div>div:last-child"],
			arrowDown: [],
			arrowLeft: ["div#modal .flex>div:first-child>div:nth-last-child(2)", ".shopee-mini-page-controller__prev-btn", ".rating-media-list__zoomed-image--active .rating-media-list-carousel-arrow--prev", ".product-ratings__page-controller .shopee-icon-button.shopee-icon-button--left", ".shopee-page-controller .shopee-icon-button--left", ".shopee-icon-button._1mHKHL", ".product-variation.product-variation--selected"],
			arrowRight: ["div#modal .flex>div:first-child>div:last-child", ".shopee-mini-page-controller__next-btn", ".rating-media-list__zoomed-image--active .rating-media-list-carousel-arrow--next", ".product-ratings__page-controller .shopee-icon-button.shopee-icon-button--right", ".shopee-page-controller .shopee-icon-button--right", ".shopee-icon-button._2H6_oQ", ".product-variation.product-variation--selected"]
		},
		'taobao': {
			enter: [],
			esc: ["#J_ViewerClose"],
			w: [],
			s: [],
			a: ['div.ks-overlay:not(.ks-overlay-hidden) #J_ViewerPrev', '.tm-m-photos-thumb .tm-current, .pagination .page-cur', '#detail .tb-key .tb-prop li.tb-selected', '.m-sortbar .pager li.item:first-child a.link', '.m-page li.prev a', 'button.next-prev', '.pagination a.prev', '.rate-page a[data-page]:first-child', ".rate-paginator a:first-child", '.ui-page-prev', '.pagination li.pagination-prev>a', 'div[class^="ItemList--pagination--"]>div[class^="ItemList--pageUp--"]'],
			d: ['div.ks-overlay:not(.ks-overlay-hidden) #J_ViewerNext', '.tm-m-photos-thumb .tm-current, .pagination .page-cur', '#detail .tb-key .tb-prop li.tb-selected', '.m-sortbar .pager li.item:last-child a.link', '.m-page li.next a', 'button.next-next', '.pagination a.next', '.rate-page a[data-page]:last-child', ".rate-paginator a:last-child", '.ui-page-next', '.pagination li.pagination-next>a', 'div[class^="ItemList--pagination--"]>div[class^="ItemList--pageDown--"]'],
			arrowUp: [],
			arrowDown: [],
			arrowLeft: ['div.ks-overlay:not(.ks-overlay-hidden) #J_ViewerPrev', '.tm-m-photos-thumb .tm-current, .pagination .page-cur', '#detail .tb-key .tb-prop li.tb-selected', '.m-sortbar .pager li.item:first-child a.link', '.m-page li.prev a', 'button.next-prev', '.pagination a.prev', '.rate-page a[data-page]:first-child', ".rate-paginator a:first-child", '.ui-page-prev', '.pagination li.pagination-prev>a', 'div[class^="ItemList--pagination--"]>div[class^="ItemList--pageUp--"]'],
			arrowRight: ['div.ks-overlay:not(.ks-overlay-hidden) #J_ViewerNext', '.tm-m-photos-thumb .tm-current, .pagination .page-cur', '#detail .tb-key .tb-prop li.tb-selected', '.m-sortbar .pager li.item:last-child a.link', '.m-page li.next a', 'button.next-next', '.pagination a.next', '.rate-page a[data-page]:last-child', ".rate-paginator a:last-child", '.ui-page-next', '.pagination li.pagination-next>a', 'div[class^="ItemList--pagination--"]>div[class^="ItemList--pageDown--"]']
		},
		'tmall': {
			enter: [],
			esc: ["#J_ViewerClose"],
			w: [],
			s: [],
			a: ['div.ks-overlay:not(.ks-overlay-hidden) #J_ViewerPrev', '.tm-m-photos-thumb .tm-current, .pagination .page-cur', '#detail .tb-key .tb-prop li.tb-selected', '.m-sortbar .pager li.item:first-child a.link', '.m-page li.prev a', 'button.next-prev', '.pagination a.prev', '.rate-page a[data-page]:first-child', ".rate-paginator a:first-child", '.ui-page-prev', '.pagination li.pagination-prev>a', 'div[class^="ItemList--pagination--"]>div[class^="ItemList--pageUp--"]'],
			d: ['div.ks-overlay:not(.ks-overlay-hidden) #J_ViewerNext', '.tm-m-photos-thumb .tm-current, .pagination .page-cur', '#detail .tb-key .tb-prop li.tb-selected', '.m-sortbar .pager li.item:last-child a.link', '.m-page li.next a', 'button.next-next', '.pagination a.next', '.rate-page a[data-page]:last-child', ".rate-paginator a:last-child", '.ui-page-next', '.pagination li.pagination-next>a', 'div[class^="ItemList--pagination--"]>div[class^="ItemList--pageDown--"]'],
			arrowUp: [],
			arrowDown: [],
			arrowLeft: ['div.ks-overlay:not(.ks-overlay-hidden) #J_ViewerPrev', '.tm-m-photos-thumb .tm-current, .pagination .page-cur', '#detail .tb-key .tb-prop li.tb-selected', '.m-sortbar .pager li.item:first-child a.link', '.m-page li.prev a', 'button.next-prev', '.pagination a.prev', '.rate-page a[data-page]:first-child', ".rate-paginator a:first-child", '.ui-page-prev', '.pagination li.pagination-prev>a', 'div[class^="ItemList--pagination--"]>div[class^="ItemList--pageUp--"]'],
			arrowRight: ['div.ks-overlay:not(.ks-overlay-hidden) #J_ViewerNext', '.tm-m-photos-thumb .tm-current, .pagination .page-cur', '#detail .tb-key .tb-prop li.tb-selected', '.m-sortbar .pager li.item:last-child a.link', '.m-page li.next a', 'button.next-next', '.pagination a.next', '.rate-page a[data-page]:last-child', ".rate-paginator a:last-child", '.ui-page-next', '.pagination li.pagination-next>a', 'div[class^="ItemList--pagination--"]>div[class^="ItemList--pageDown--"]']
		},
		'1688': {
			enter: [],
			esc: [],
			w: [],
			s: [],
			a: ['.fui-paging-list .fui-prev, #bd_1 button:first-of-type'],
			d: ['.fui-paging-list .fui-next, #bd_1 button:last-of-type'],
			arrowUp: [],
			arrowDown: [],
			arrowLeft: ['.fui-paging-list .fui-prev, #bd_1 button:first-of-type'],
			arrowRight: ['.fui-paging-list .fui-next, #bd_1 button:last-of-type']
		}
	};

	switch(host) { // 按鍵以外的功能
		case "ruten":
			if(window.location.href.indexOf('ruten.com.tw/find/?') > 0) {
				var watchElm = null;
				const watchOpt = { 'attributes': true },
					  redir = function(){
						  if(window.location.href.search(/(area=|platform=)/) == -1){
							  window.location.href = window.location.href + "&platform=ruten";
						  }
					  },
					  observer = new MutationObserver(redir);
				redir();
				let waitt = window.setInterval(function(){
					if(watchElm = document.querySelector("#ProdGridContainer")){
						observer.observe(watchElm, watchOpt);
						clearInterval(waitt);
					}
				}, 500);
			}
			break;
		case "jd":
			window.scrollTo = function(){};
			break;
	}

	document.addEventListener("keydown", function(e) {
		if((e.shiftKey | e.ctrlKey | e.altKey | e.metaKey) || document.querySelector("input:focus, textarea:focus, [contenteditable='true']:focus")) return;
		e = e || window.event;
		var elm=null, i;
		try {
			switch(e.key.toLowerCase()) {
				case 'enter':
					for(i in elmPatt[host].enter) if(elm = document.querySelector(elmPatt[host].enter[i])) break;
					break;
				case 'escape':
					for(i in elmPatt[host].esc) if(elm = document.querySelector(elmPatt[host].esc[i])) break;
					break;
				case 'arrowup':
					for(i in elmPatt[host].arrowUp) if(elm = document.querySelector(elmPatt[host].arrowUp[i])) break;
					if( host == 'pchome' && i == 1) elm=elm.previousElementSibling.querySelector("a");
					break;
				case 'arrowdown':
					for(i in elmPatt[host].arrowDown) if(elm = document.querySelector(elmPatt[host].arrowDown[i])) break;
					if( host == 'pchome' && i == 0) elm=elm.nextElementSibling.querySelector("a");
					break;
				case 'arrowleft':
					for(i in elmPatt[host].arrowLeft) if(elm = document.querySelector(elmPatt[host].arrowLeft[i])) break;
					if(host == 'amazon' && i == 1){
						let thumbsTotal = document.querySelectorAll('#ivThumbs .ivRow>.ivThumb').length;
						let picNo = parseInt(elm.getAttribute("id").replace("ivImage_",""));
						elm = document.getElementById("ivImage_"+ (picNo > 0 ? picNo-1 : thumbsTotal-1));
					}
					if((host == 'taobao' || host == 'tmall') && i == 1)	elm=elm.previousElementSibling;
					if((host == 'taobao' || host == 'tmall') && i == 2)	elm=elm.previousElementSibling.querySelector("a");
					if((host == 'momoshop' || host == 'momomall') && i == 0) elm=elm.parentNode.previousElementSibling.querySelector("a");
					if( host == 'shopee' && i == 6) elm=elm.previousElementSibling;
					break;
				case 'arrowright':
					for(i in elmPatt[host].arrowRight) if(elm = document.querySelector(elmPatt[host].arrowRight[i])) break;
					if(host == 'amazon' && i == 1){
						let thumbsTotal = document.querySelectorAll('#ivThumbs .ivRow>.ivThumb').length;
						let picNo = parseInt(elm.getAttribute("id").replace("ivImage_",""));
						elm = document.getElementById("ivImage_"+ (picNo == thumbsTotal-1 ? 0 : picNo+1));
					}
					if((host == 'taobao' || host == 'tmall') && i == 1)	elm=elm.nextElementSibling;
					if((host == 'taobao' || host == 'tmall') && i == 2)	elm=elm.nextElementSibling.querySelector("a");
					if((host == 'momoshop' || host == 'momomall') && i == 0) elm=elm.parentNode.nextElementSibling.querySelector("a");
					if( host == 'shopee' && i == 6) elm=elm.nextElementSibling;
					break;
				case 'w':
					for(i in elmPatt[host].w) if(elm = document.querySelector(elmPatt[host].w[i])) break;
					if( host == 'pchome' && i == 1) elm=elm.previousElementSibling.querySelector("a");
					break;
				case 's':
					for(i in elmPatt[host].s) if(elm = document.querySelector(elmPatt[host].s[i])) break;
					if( host == 'pchome' && i == 0) elm=elm.nextElementSibling.querySelector("a");
					break;
				case 'a':
					for(i in elmPatt[host].a) if(elm = document.querySelector(elmPatt[host].a[i])) break;
					if(host == 'amazon' && i == 1){
						let thumbsTotal = document.querySelectorAll('#ivThumbs .ivRow>.ivThumb').length;
						let picNo = parseInt(elm.getAttribute("id").replace("ivImage_",""));
						elm = document.getElementById("ivImage_"+ (picNo > 0 ? picNo-1 : thumbsTotal-1));
					}
					if((host == 'taobao' || host == 'tmall') && i == 1)	elm = elm.previousElementSibling;
					if((host == 'taobao' || host == 'tmall') && i == 2)	elm = elm.previousElementSibling.querySelector("a");
					if((host == 'momoshop' || host == 'momomall') && i == 0) elm = elm.parentNode.previousElementSibling.querySelector("a");
					if( host == 'shopee' && i == 6) elm = elm.previousElementSibling;
					break;
				case 'd':
					for(i in elmPatt[host].d) if(elm = document.querySelector(elmPatt[host].d[i])) break;
					if(host == 'amazon' && i == 1){
						let thumbsTotal = document.querySelectorAll('#ivThumbs .ivRow>.ivThumb').length;
						let picNo = parseInt(elm.getAttribute("id").replace("ivImage_",""));
						elm = document.getElementById("ivImage_"+ (picNo == thumbsTotal-1 ? 0 : picNo+1));
					}
					if((host == 'taobao' || host == 'tmall') && i == 1)	elm=elm.nextElementSibling;
					if((host == 'taobao' || host == 'tmall') && i == 2)	elm=elm.nextElementSibling.querySelector("a");
					if((host == 'momoshop' || host == 'momomall') && i == 0) elm=elm.parentNode.nextElementSibling.querySelector("a");
					if( host == 'shopee' && i == 6) elm = elm.nextElementSibling;
					break;
			}
			if(elm) elm.click();
		} catch(err){ console.log(err); }
	});
})();

