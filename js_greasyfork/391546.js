// ==UserScript==
// @name         SteamBundlePricesAssistant
// @namespace    https://greasyfork.org/users/101223
// @version      1.0
// @description  Steam Bundle Prices Assistant
// @author       Splash
// @match        https://store.steampowered.com/bundle/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/391546/SteamBundlePricesAssistant.user.js
// @updateURL https://update.greasyfork.org/scripts/391546/SteamBundlePricesAssistant.meta.js
// ==/UserScript==

(function () {
	'use strict';
	GDynamicStore.OnReady(function gd_DelayRun() {
		var gd_i,
		gd_j,
		gd_arr,
		gd_obj,
		gd_tmpobj,
		gd_tooltip;
        if(!Object.keys(GStoreItemData.rgPersonalizedBundleData).length){
            setTimeout(gd_DelayRun,1000);
            return;
        }
		for (gd_i in GStoreItemData.rgPersonalizedBundleData) {
			gd_arr = GStoreItemData.rgPersonalizedBundleData[gd_i].m_rgItems;
			for (gd_j = 0; gd_j < gd_arr.length; gd_j++) {
				if (gd_arr[gd_j].m_rgIncludedAppIDs.length) {
					gd_obj = $J('div[data-ds-appid="' + gd_arr[gd_j].m_rgIncludedAppIDs.join(',') + '"]');
                    console.log(gd_obj);
				} else {
					gd_obj = $J('div[data-ds-packageid=' + gd_arr[gd_j].m_nPackageID + ']');
				}
				if (gd_obj) {
					gd_tmpobj = $J('<div class="gd_div_position"><span class="gd_icon"></span></div>');
					if (gd_arr[gd_j].m_nFinalPriceInCents <= gd_arr[gd_j].m_nFinalPriceWithBundleDiscount)
						gd_tmpobj.find('span').addClass('gd_cheaper');
					if (GStoreItemData.rgPersonalizedBundleData[gd_i].m_bMustPurchaseAsSet) {
						gd_tmpobj.find('span').addClass('gd_MPT');
						gd_tooltip = '<span style="color:#0000FF">注意：这个包在购买时不会排除已拥有的游戏！</span><br/>';
					} else {
						gd_tooltip = '';
					}
					gd_tooltip += '商品价格：' + GStoreItemData.fnFormatCurrency(gd_arr[gd_j].m_nBasePriceInCents) + '<br/>折扣价格：' + GStoreItemData.fnFormatCurrency(gd_arr[gd_j].m_nFinalPriceInCents) + '<br/>打包购买时的价格：' + GStoreItemData.fnFormatCurrency(gd_arr[gd_j].m_nFinalPriceWithBundleDiscount);
					gd_tmpobj.find('span').attr('data-tooltip-html', gd_tooltip);
					BindTooltips(gd_tmpobj.eq(0), {
						tooltipCSSClass: 'store_tooltip'
					});
					gd_obj.append(gd_tmpobj);
				}
			}
		}
	});
	gd_addStyle('.gd_div_position{position:relative;z-index:99}.gd_icon{width:20px;height:20px;display:inline-block;border-radius:50%;background-color:#e87a90;transform:rotate(45deg)}.gd_icon:before,.gd_icon:after{content:"";width:3px;height:14px;position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);background-color:white;border-radius:5px;pointer-events:none}.gd_icon:after{transform:translate(-50%,-50%) rotate(-90deg)}.gd_cheaper.gd_icon{background-color:#9ccc65}.gd_cheaper.gd_icon:before,.gd_cheaper.gd_icon:after{transform:none}.gd_cheaper.gd_icon:before{width:3px;height:11px;top:4px;left:10px;border-radius:5px 5px 5px 0}.gd_cheaper.gd_icon:after{width:5px;height:3px;top:12px;left:6px;border-radius:5px 0 0 5px}.gd_icon.gd_MPT:before,.gd_icon.gd_MPT:after{top:50%;left:50%;width:3px;height:14px;transform:translate(-50%,-50%) rotate(45deg);}');
	function gd_addStyle(gd_style) {
		return $J('<style type="text/css">' + gd_style + '</style>').appendTo($J('head'));
	}
})();