// ==UserScript==
// @name        SteamGemOneClick
// @namespace   SteamGemOneClick@Byzod.user.js
// @description 一键合成宝珠
// @include     /^https?:\/\/steamcommunity\.com\/id\/[^\/]+\/inventory\//
// @version     2017-6-14
// @grant       none
// jshint esversion:6
// @downloadURL https://update.greasyfork.org/scripts/30053/SteamGemOneClick.user.js
// @updateURL https://update.greasyfork.org/scripts/30053/SteamGemOneClick.meta.js
// ==/UserScript==

// Start
SteamInventoryQuickGrindToGoo();
SteamInventoryShowGemValue();

// 显示物品宝珠价值的对应宝珠价格（￥）
function SteamInventoryShowGemValue(){
	// console.log("[SteamGemOneClick] SteamInventoryShowGemValue()"); // DEBUG
	const GEM_PRICE_REGEX = /\d+\.\d+/g;
	const GEM_VALUE_REGEX = /^\d+/g;
	const GEM_PRICE_CNY_API_URL = "https://steamcommunity.com/market/priceoverview/?appid=753&currency=23&market_hash_name=753-Sack%20of%20Gems";
	const GEM_PRICE_REFRESH_INTERVAL_MILLISECONDS = 45000;
	var gemBagPrice = 0.0;
	var xhr = new XMLHttpRequest();
	xhr.responseType = "json";
	
	xhr.onload = e => {
		// console.log("[SteamGemOneClick] Gem price info: %o", xhr.response); // DEBUG
		if(xhr.response && xhr.response.lowest_price){
			gemBagPrice = Number.parseFloat(xhr.response.lowest_price.match(GEM_PRICE_REGEX)[0]);
		} else {
			gemBagPrice = 0.0;
		}
		// console.log("[SteamGemOneClick] Gem price: %o", gemBagPrice); // DEBUG
	}
	
	// 定时获取当前一袋宝珠的价格
	function RefreshGemPrice (){
		xhr.open("GET", GEM_PRICE_CNY_API_URL);
		xhr.send();
		setTimeout(RefreshGemPrice, GEM_PRICE_REFRESH_INTERVAL_MILLISECONDS);
	}
	
	// 宝珠价值文字
	var gemValueTargets = document.querySelectorAll(".item_scrap_value");
	//点开物品时更新宝珠价格显示
	var invPageObserver = new MutationObserver(
		recs=>{
			for(var rec of recs){
				// console.log("[SteamGemOneClick] rec class: " + rec.target.classList); // DEBUG
				if(rec.target.id !== "gem_price"){
					// console.log("[SteamGemOneClick] Mutation Record: %o", rec); // DEBUG
					// Update Gem Price
					let gemValue = Number.parseFloat(rec.target.textContent.match(GEM_VALUE_REGEX));
					let gemPriceSpan = rec.target.parentNode.querySelector("#gem_price");
					if(gemPriceSpan){
						gemPriceSpan.textContent = " (￥ " + ((gemValue / 1000) * gemBagPrice).toFixed(3) + ")";
					}
				}
			}
		}
	);
	var config = { childList: true };
	// 添加宝珠￥价格文字
	for(var target of gemValueTargets){
		AddGemPriceDisplay(target);
		invPageObserver.observe(target, config);
	}
	
	// 在宝珠价值后显示宝珠价格
	function AddGemPriceDisplay (gemValueSpan){
		var gemPriceSpan = document.createElement("span");
		gemPriceSpan.id = "gem_price";
		gemPriceSpan.className = "item_scrap_value"; // 只是为了借用样式
		gemValueSpan.parentNode.appendChild(gemPriceSpan);
	}
	
	RefreshGemPrice();
}

// 添加快速碾碎物品为宝珠按钮
function SteamInventoryQuickGrindToGoo(){
	// console.log("[SteamGemOneClick] SteamInventoryQuickGrindToGoo()"); // DEBUG
	var gooTargets = document.querySelectorAll(".item_scrap_actions");
	var invPageObserver = new MutationObserver(
		recs=>{
			for(var rec of recs){
				// console.log("[SteamGemOneClick] rec class: " + rec.target.classList); // DEBUG
				if(!rec.target.classList.contains("quick_grind")
					&&!rec.target.classList.contains("quick_grind_enabler")
					&& rec.target.classList.contains("btn_small")){
					// console.log("[SteamGemOneClick] Mutation Record: %o", rec); // DEBUG
					// Update href of our button
					var grindQuickBtn = rec.target.parentNode.querySelector(".quick_grind");
					if(grindBtn && grindQuickBtn){
						grindQuickBtn.href = rec.target.href.replace("GrindIntoGoo", "GrindIntoGooQuick");
					}
				}
			}
		}
	);
	var config = { attributes: true, subtree: true };
	for(var target of gooTargets){
		var grindBtn = target.querySelector(".btn_small");
		AddQuickGrindLaunchButton(grindBtn, grindBtn.parentNode);
		AddQuickGrindToGooButton(grindBtn, grindBtn.parentNode);
		invPageObserver.observe(target, config);
	}
	// 捏造一个快速碾碎函数出来
	DefineQuickGrind();
	
	// 添加安全启动快速碾碎按钮
	function AddQuickGrindLaunchButton(classNameCopyFrom, nodeAppendTo){
		if(classNameCopyFrom && nodeAppendTo){
			var btn = document.createElement("a");
			btn.className = classNameCopyFrom.className + " quick_grind_enabler";
			btn.innerHTML = "<span>☢启用快速合成☢</span>";
			btn.onclick = function(){
					let launchButtons = document.querySelectorAll(".quick_grind_enabler");
					let grindQuickButtons = document.querySelectorAll(".quick_grind");
					for(let btn of launchButtons){
						$J(btn).fadeOut(1000);
					}
					for(let btn of grindQuickButtons){
						$J(btn).fadeIn(1000);
					}
				}
			nodeAppendTo.appendChild(btn);
		}
	}
	
	// 添加快速碾碎按钮（容器）
	function AddQuickGrindToGooButton(classNameCopyFrom, nodeAppendTo){
		if(classNameCopyFrom && nodeAppendTo){
			var btn = document.createElement("a");
			btn.className = classNameCopyFrom.className + " quick_grind";
			btn.innerHTML = "<span>☢快速合成☢【不可撤销！】</span>";
			btn.style.display = "none";
			nodeAppendTo.appendChild(btn);
		}
	}
	
	// 捏造快速碾碎函数
	function DefineQuickGrind(){
		if(window.GrindIntoGoo){
			// console.log("[SteamGemOneClick] GrindIntoGoo exist"); // DEBUG
			var newFuncStr = window.GrindIntoGoo.toSource();
			// Change function name
			// Remove confirm dialog
			// Change result dialog to notification
			// No inventory reload (Your item is not updated but can grind them without refresh)
			newFuncStr = newFuncStr.replace("GrindIntoGoo", "GrindIntoGooQuick");
			newFuncStr = newFuncStr.replace(/ShowConfirmDialog\( strDialogTitle, \$Content \)\.done/, "setTimeout");
			newFuncStr = newFuncStr.replace(
				/ShowAlertDialog\( strDialogTitle, data\.strHTML \);/,
				"Notification.requestPermission(()=>{var n = new Notification(strDialogTitle,{body:data.strHTML});});"
			);
			newFuncStr = newFuncStr.replace("ReloadCommunityInventory();", "/*ReloadCommunityInventory();*/");
			
			// Debug change
			// newFuncStr = newFuncStr.replace("var strActionURL", "console.log('[SteamGemOneClick] QuickGrind Called');\nvar strActionURL"); // DEBUG
			
			// console.log("[SteamGemOneClick] GrindIntoGooQuick: \n" + newFuncStr); // DEBUG
			window.eval(newFuncStr);
		} else {
			// console.log("[SteamGemOneClick] GrindIntoGoo not found"); // DEBUG
		}
	}
}
