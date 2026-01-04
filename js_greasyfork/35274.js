// ==UserScript==
// @name		SunFrog Toolkit
// @namespace	http://tampermonkey.net/
// @version		0.5.1
// @description	Add more feature on SunFrog
// @author		PassiveDot
// @license		MIT
// @include		https://www.sunfrog.com/*
// @exclude		https://www.sunfrog.com/Contact*
// @exclude		https://www.sunfrog.com/size*
// @exclude		https://www.sunfrog.com/Wholesale*
// @exclude		https://www.sunfrog.com/legal*
// @exclude		https://www.sunfrog.com/Careers*
// @grant		GM_addStyle
// @grant       GM_registerMenuCommand
// @grant       GM_getValue
// @grant       GM_setValue
// @require		https://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js
// @require		https://cdnjs.cloudflare.com/ajax/libs/arrive/2.4.1/arrive.min.js
// @require		https://cdnjs.cloudflare.com/ajax/libs/mouse0270-bootstrap-notify/3.1.7/bootstrap-notify.min.js
// @require		https://unpkg.com/tippy.js@2.0.0/dist/tippy.all.min.js
// @require		https://greasyfork.org/scripts/7212-gm-config-eight-s-version/code/GM_config%20(eight's%20version).js?version=156587
// @compatible	firefox
// @compatible	chrome
// @downloadURL https://update.greasyfork.org/scripts/35274/SunFrog%20Toolkit.user.js
// @updateURL https://update.greasyfork.org/scripts/35274/SunFrog%20Toolkit.meta.js
// ==/UserScript==
window.$ = this.$ = this.jQuery = jQuery.noConflict(true);
$(function() {
	'use strict';
	var autoLoadMoreSelected, i, j, m, selectedForm, arrayGetAll = [], str, arrayChecked, lenChecked, strChecked, $eleProduct, $eleSKU, $eleDate, $eleTitle, $eleImage, $eleProductLink, sku, date, title, image, product, pushSKU, pushDate, pushTitle, pushImage, pushProduct;
	var config;
	GM_config.init(" ", {enableTooltip:{label:"Enable Tooltip", type:"checkbox", "default":true}, insertSellerID:{label:"Insert SellerID", type:"checkbox", "default":false}, SellerID:{label:"My SellerID:", type:"number", "default":0}, getAll:{label:"Get All result:", type:"select", "default":"copy", options:{copy:"Copy to Clipboard (Default)", csv:"Save to CSV"}}, getImage:{label:"Image Size result:", type:"select", "default":"getsizefive", options:{getsizefive:"550x550 (Default)", getsizeten:"1010x1010"}},
						 autoLoadMore:{label:"View More auto:", type:"select", "default":["autodefault"], options:{autodefault:"No Auto (Default)", autosort:"Auto Sort by Newest", autofilter:"Auto Filter by Years"}, multiple:true}});
	config = GM_config.get();
	GM_registerMenuCommand("SunFrog Toolkit Settings", function() {
		GM_config.open();
	});
	GM_config.onclose = function() {
		config = GM_config.get();
	};
	$(document.body).arrive(".config-dialog-content", {existing:true}, function() {
		var $iframe = $(this).contents();
		$iframe.find("head").append('<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">' + '<link href="https://cdn.jsdelivr.net/npm/magic-check@1.0.3/css/magic-check.min.css" rel="stylesheet">' + '<style>\n.toolkit-help{margin-left: 4px;font-size: 22px;cursor: help;}\n.toolkit-tooltip{display: inline;position: relative;}\n.toolkit-tooltip:hover:after{background: #333;border-radius: 5px;bottom: 26px;color: #fff;left: 20%;padding: 8px 15px;position: absolute;z-index: 98;width: 400px;}\n.toolkit-tooltip:hover:after{content: attr(tooltip);font-size: 12px;line-height: 1.5;}\n.toolkit-tooltip:hover:before{border: solid;border-color: #333 transparent;border-width: 6px 6px 0 6px;bottom: 20px;content: "";left: 50%;position: absolute;z-index: 99;}\n</style>');
		$iframe.find("select[multiple] option").mousedown(function(e) {
			e.preventDefault();
			var originalScrollTop = this.parentNode.scrollTop;
			if (this.value === "autodefault" && this.selected === false) {
				this.selected = true;
				this.nextElementSibling.selected = false;
				this.nextElementSibling.nextElementSibling.selected = false;
			} else {
				if (this.value === "autodefault" && this.selected === true) {
					this.selected = false;
				} else {
					if (this.value === "autosort" || this.value === "autofilter") {
						this.selected = !this.selected;
						this.parentNode.children[0].selected = false;
					}
				}
			}
			var self = this;
			this.parentNode.focus();
			setTimeout(function() {
				self.parentNode.scrollTop = originalScrollTop;
			}, 0);
			return false;
		});
		var $enableTooltip = $iframe.find("#enableTooltip");
		$enableTooltip.parent().css("display", "inline-flex");
		$enableTooltip.addClass("magic-checkbox");
		$enableTooltip.next().after('<div class="toolkit-tooltip" tooltip="Hi\u1ec3n th\u1ecb m\u00f4 t\u1ea3 cho t\u1eebng ch\u1ee9c n\u0103ng."><i class="material-icons toolkit-help">help_outline</i></div>');
		var $insertSellerID = $iframe.find("#insertSellerID");
		$insertSellerID.parent().css("display", "inline-flex");
		$insertSellerID.addClass("magic-checkbox");
		$insertSellerID.next().after('<div class="toolkit-tooltip" tooltip="T\u1ef1 \u0111\u1ed9ng ch\u00e8n SellerID v\u00e0o ProductURL (\u0111\u1ec3 t\u1ea1o th\u00e0nh AffLink). VD: https://www.sunfrog.com/110014065-306308168.html?12345. L\u01b0u \u00fd: b\u1ea1n c\u1ea7n \u0111i\u1ec1n SellerID v\u00e0o khung b\u00ean d\u01b0\u1edbi n\u1ebfu b\u1eadt ch\u1ee9c n\u0103ng n\u00e0y."><i class="material-icons toolkit-help">help_outline</i></div>');
		$($iframe.find(".form-group label")[3]).find("select").before('<div class="toolkit-tooltip" tooltip="Sau khi ch\u1ee9c n\u0103ng Get All ho\u00e0n th\u00e0nh, d\u1eef li\u1ec7u s\u1ebd \u0111\u01b0\u1ee3c:"><i class="material-icons toolkit-help">help_outline</i></div>');
		$($iframe.find(".form-group label")[4]).find("select").before('<div class="toolkit-tooltip" tooltip="K\u00edch th\u01b0\u1edbc c\u1ee7a Image s\u1ebd nh\u1eadn \u0111\u01b0\u1ee3c khi Get Image URL ho\u1eb7c Download Image."><i class="material-icons toolkit-help">help_outline</i></div>');
		$($iframe.find(".form-group label")[5]).find("select").before('<div class="toolkit-tooltip" tooltip="Sau khi click v\u00e0o Load More/View More Designs b\u1ea1n mu\u1ed1n tool s\u1ebd t\u1ef1 \u0111\u1ed9ng l\u00e0m nh\u1eefng g\u00ec?"><i class="material-icons toolkit-help">help_outline</i></div>');
		var $dialoghead = $iframe.find(".config-dialog-head");
		$dialoghead.before('<div class="config-dialog-title" style="font-size: 24px;font-weight: bold;text-align: center;background: #428bca;color: white;padding: 15px;margin-bottom: 5px;">SunFrog Toolkit</div>');
		$iframe.find(".config-dialog-footer .radio").each(function() {
			this.remove();
		});
		$iframe.find(".btn-sm").each(function() {
			$(this).addClass("btn-default");
		});
		$dialoghead.attr("style", "font-size: 2em;display: inline;");
		var $dialogfooter = $iframe.find(".config-dialog-footer");
		$dialoghead.appendTo($dialogfooter);
		$($iframe.find("body")).attr("style", "overflow: visible;padding: 10px;display: block;font-weight: bold;");
	});
	$("head").append('<link href="https://cdn.jsdelivr.net/npm/pretty-checkbox@3.0/dist/pretty-checkbox.min.css" rel="stylesheet">');
	$("script").each(function() {
		if ($(this).prop("outerHTML").indexOf("bootstrap.min.js") > -1) {
			$(this).after('<script src="https://cdnjs.cloudflare.com/ajax/libs/bootbox.js/4.4.0/bootbox.min.js">\x3c/script>');
		}
	});
	GM_addStyle('\n.config-dialog {display: flex;justify-content: center;}\n.frameitWrapper {border: 1px solid transparent;}\n.SelectedImage {border: 1px solid #428bca;border-radius: 5px;}\n[data-notify="progressbar"] {margin-bottom: 0px;position: absolute;bottom: 0px;left: 0px;width: 100%;height: 5px;}\n.modal-header {background-color: darkcyan;color: #fff;}\n.modal-backdrop{z-index: auto;}\n.modal-dialog{width: 400px;}\n.modal-footer > .btn.btn-primary{color: #fff;background-color: #428bca;border-color: #357ebd;border-radius: 4px;}\n.alert-success{color: #fff;background-color: darkcyan;border-color: #bce8f1;}\n.progress-bar-success{background-color: salmon;}\n.tippy-tooltip[data-size=large]{font-size: 12px;}\n.form-inline{display: -webkit-inline-box;}\n.dropdown-menu.multi-level > li {display: -webkit-box;}\n.dropdown-menu.multi-level > li:hover {-webkit-text-fill-color: white;background-color:#428bca;background-image: none;}\n.dropdown-menu.multi-level > li > a {color: #333;cursor: pointer;text-transform: none;padding-left: 0;}\n.dropdown-menu.multi-level > li > a:hover {color: white;background-color:#428bca;background-image: none;}\n.dropdown-menu.multi-level > .disabled {cursor: not-allowed;}\n\n#dLabel{\ncolor: #fff;background-color: #428bca;border-color: #357ebd;\nmargin-left: 5px;text-transform: capitalize;\n}\n#dLabel:hover {color: #fff;background-color: #3071a9;border-color: #285e8e;}\n\n.deseBtn {\nposition: absolute;opacity: 0.5;top: 4px;right: 20px;width: 35px;height: 35px;color: white;font-weight: bold;\nz-index: 999;border-radius: 4px;cursor: pointer;transition: opacity .2s ease-out;transition-delay: .1s;\n}\n.deseBtn:focus {outline:none;}\n.selectBtn {background-color: #5cb85c;border: 1px solid #5cb85c;}\n.selectBtn:after {font-family: "Glyphicons Halflings";content: "\\e013";}\n.deselectBtn {border: 1px solid #db2d74;background-color: #db2d74;}\n.deselectBtn:after {font-family: "Glyphicons Halflings";content: "\\e014";}\n.toolkit:hover .selectBtn {opacity: 1;}\n.toolkit:hover .deselectBtn {opacity: 1;}\n\n.downloadBtn {\nposition:absolute; width:46px; height:28px; opacity:0; right:25px; top:25px; z-index:1; text-align:center;\nfont-size:14px; line-height:26px; padding:0 8px; font-weight:600; color:#fff; white-space:nowrap; outline:0;\ncursor:pointer; -webkit-user-select:none; -moz-user-select:none; user-select:none;\ntransition:opacity .2s ease-out; transition-delay:.1s; border-radius:3px; border:1px solid #db2d74;\nbackground-color:#db2d74; background-size:22px; background-position:center; background-repeat:no-repeat;\nbackground-image:url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB2aWV3Qm94PSIwIDAgMjU2IDI1NiIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4bWw6c3BhY2U9InByZXNlcnZlIiBzdHlsZT0iZmlsbC1ydWxlOmV2ZW5vZGQ7Y2xpcC1ydWxlOmV2ZW5vZGQ7c3Ryb2tlLWxpbmVqb2luOnJvdW5kO3N0cm9rZS1taXRlcmxpbWl0OjEuNDE0MjE7Ij48dXNlIGlkPSJpY29uIC8gZG93bmxvYWQiIHhsaW5rOmhyZWY9IiNfSW1hZ2UxIiB4PSIxNC4wMDkiIHk9IjMzIiB3aWR0aD0iMjI3LjQ5MXB4IiBoZWlnaHQ9IjE5MC40OTdweCIvPjxkZWZzPjxpbWFnZSBpZD0iX0ltYWdlMSIgd2lkdGg9IjIyOHB4IiBoZWlnaHQ9IjE5MXB4IiB4bGluazpocmVmPSJkYXRhOmltYWdlL3BuZztiYXNlNjQsaVZCT1J3MEtHZ29BQUFBTlNVaEVVZ0FBQU9RQUFBQy9DQVlBQUFEdUhuQzVBQUFBQ1hCSVdYTUFBQTdFQUFBT3hBR1ZLdzRiQUFBSm8wbEVRVlI0bk8yZDJhN2pLaEFBbStqKy95LzdQaVRPT0Q3ZXNPa05xcVNSUnJPY3hOQkZOeGpqTWsyVFFEZzJPK1ZPWDVWU2R2K3Erb2VCT2dVaDNmbDJnRWRmTElSRjBBQWdwRDJ1QXA2eHlxaElhZ3hDMmpDSnhCVHdEREtvTFFpcFIxb0o5MEJPZlJDeVBWUHZiWXFZZWlCa0c3ckxobGRCenJZZzVETzZ6NFpYUWN3MklPUTloczJJWjN6RVJNcWJJR1E5Wk1VTElPWTlFUEk2aUhnRHhLd0RJYzlCeEljd3Y3d09RdTdEUExFeFpNdHpFSElic3FJaWlMblB5L3NMQkFRWmxmbTBMNDI4QVVMK1l4SmtOQU1wdDZGa2ZZT0lUckRnOHd0Q0ltTUltRmUrR2Ixa1JjWWdVTUsrR1ZsSVpBd0dVbzVic3FhUmNlTk1uSnF5THZUcEJIdU1YTDZPS0dSWUdZMk96MGdoNmFoU2ppWmtPQm1EckRLRzNKVTBvcFFqQ1JsR3hpQVM3aEZLenRHa0hFVklkeG1EUzdoRkdERkhrbklFSVYxbFRDamlGbEVHdE14dGVJbmVoWXdnWTA5QlJIc3EwN09RYnNFelFPRFF0a3IwS3FSTHdQUWVMQnZRem8zcGNhZU9lWkNVVXJvT2tnUEt3Y3Q4NEFZOUNtbktRc1JSSTdOOE1QdkFucmZZOVNha2FYWWNOQ3Z1Z1pRTjZHa09hU1lqSXA1aTJSZGQ5VU0zR1JJWlEySHBTVGNaUmFRZklVMDZCUm1yTUpHeXQ5SzFCeUZOeWlOa3ZBVlNWcEplU0dRTVQyL1RQRld5QzZsdUl6STJRVjNLWHJKa2FpRzFzeU15Tm9WTWVZSE1RcXJhaUl3cXFFclpRNWJNS3FUcVFnNHlxbUloWlZxeUNxa0dNcHFnWGI2bXRUS2prR3JaRVJuN0lIT1d6Q2lrSnNob0IxbHlnMnhDYW1kSHNFVk55cXhaTXBPUWxLcDlvdGJ1bjRDWmY2VWcrdE1lSmllZmNZUE1IY3Z0anlLQkI5OW9RcG9mUFVoMkRJUExTUS96YjAwLytJRC92TC9BQjg1bWdTTEdwZVVpNXFZb3NlQXRwUHQ1bnhDSFVvcmJZc3k4eThkYlRLK1MxVjFFNzRhSFhkeGpROFF2UHF3elpJakcvb0NNc0l0WHhyUVNNcEtJM0hPTWpmbGM4Z2hyTVMzdVE0YVNFZUlUY2NDMGVwSkVXOGh3TWpKM1RFSEkvckdRVXF0a0RTY2k1TUp6eGZVSTdSSldJME9HbFpIc21JclEvYVNWTFZzS09VbGdHU0VmRWVlU1N6U2tiQ1hrTkUxVHlCSmpSZXdlaG5TMGxyS0ZrQ215WXZUUkZqWkowV2t0cGN6MCtCVU1TSmFCdEpXVVQ0Vk1rUjAvNU9oWlNFc0xLWjhJbVViR0xLTXNiSktxODU1S2VWZklOREpDZnJJTnFFK2t2UE8wUjFnWkR6b3VWNC9DbXNPQUN4NlBWYkZYSzJRSUdWZmlJUnNzK2ZmVWNaeFl2UnlqTlVLNnloanh1QVZJZ2ZteE1HdHFwUFErTWVBVXRydkJROTRCOUk2akVCWGVFVmN6cE5jQlJJZ0lHb1NONXl0Q21uNTVTbE13SXVRSmg2ZENXdHBJVnF6aVQwQ3gySFVMNjRUelNFakxBMndKb0d0YzdoUGF0WW9Rc1g2ME1TREVGNFFmcXZxa2h4ZVlHbUp5Z1AxWm43aHVMa2ZHS200TmtFaFpoZnRiSlhhRk5IaWZoZ2d5WHVWUnRZS1VWYWhMZWRTWGUwS3FkaDR5MXRGaWNJeCsveTBZRnBseXMwTTJoZFRzUEdTc3BtVm5ZT1YxVktYY2MyeExTTFZPUTBaSWh2bGJudjhJeVV0UlkwR3A2WTdwVzU3WFF0TDdIWVBjSWZucGxCOGh5WTVEZ0pYMW1HVkpxL3VReUFqWk1ZbmhwWkFxSTZmM2pWYUFWaWpHOHRjOTFReEpxUXFkb1g1Lzhpc2tFMzRBSDVidXpVSTJ0NUhzQ0oyaWxTVW5FVTR1QndpRnBwQmtSK2dWdGRoK2liU2ZQN0t5Q3IzVE9zWm5CMS9DaldLQUtFeGFKU3NwRW5wSEpjWloxQUVJUkhNaG1UL0NLR2pFT2hrU0lCQXZkdWdBeEdDYUpqSWtRQ1EwaEdRU0NhUFFQTmJKa0FDQlFFaUFRQ0FrUUNBUUVpQVFDQWtRQ0lRRUNJU0drT3cwZ0ZGb0h1dGtTSUJBSUNSQUlCQVNJQkF2cmFNSUFIcEg0K2diclF5SmxkQTdLakZPeVFvUUNCVWhLVnVoZDdSaS9DVjZqMHRoSmZTS1ZteVhsd2puNEFCNE16dW9Ob2VrYklWZTBZeHQ3VVVkcklUZVVJM3BXVWlkMS9tOFJ4S2toRjZZRkxOakVWbGtTT2FSQUQ0czNWTy9EMG1XaEU3UXpJNWZsa0tTSWdGOCtMcjNreUcxeWxheUpDUkhMVHV1blRQYk9vZVVrQlNUVW5WbUxhUnEyWXFVa0F3TEdYK2MrNU1odFZkYjJUQUFXZENPMVMzWHRrcFdpOFVkcklUb1dNVG9IOWYrMi94WHBhaU9EblBwK2hraFdOMkZTSmpNR2ZjcTBiMUZuV0t4VVlBNUpRVERVc1pOd2R3ZlVFWktDSUxwYXVvZVIwS2FaRWtScEFSM3pHUThtNlp0emlFOVlGNEpEb1RJaWt2T1NsYXpMRG16eUpheFdncDZZaElIR2E4a216QVpjc25jVUtXVVNjaVcwSlp3V1hISkZTRkxLY1hsSWxabHJBaHl3ajNlZ2VRbzR0V3AyTlVNNlNhbHlFOURJaWRjeFYzQ21acDFrWnFTMVZYS21hV2NJcHMzV0JGMUxINEMwanMrMTlRdVV0Yk9JWXNFVzJ6WjZJRHZINnhrUmRUYy9CdUpnMGwzUWxYY1ZTL3FhRytyYThucWUzSkxKU2Z1VmRsZDd0eWh1TE5UeC94V1NDdW1hWnA3TjJjUGo4WDB3ZnQ3M09MdTRIOTM2MXhhS1VYWUdaU0F0Q0tLM0pkUjVObGUxaDZraEhnTUs2UEk4ODNscWFVVXNpUTBwTVVhUll1ZE9pRnVoOXhobXFZV3U0R09ManoxYUhXQTFqV25qQ09STmpLS3ROczZsMWJLQjF5NTN0NVdkcS9jYk8vdG1rOXBlYjB0bjRkTVdiN2VHRVNxTmlaM3RJQTBmVmFwci94RGtSc1BDR1FjMEZzUFBxMGZVRTRwWlFXWGczTDFuMFJ5UzFsZC9TemFLZk4xSDZKUkNXaWNHRkErS1B6b3ZDUU96dEdtSXFlVVV1Yk0wenpJTlkvdzZFM0t4NEdaVU1vUnIva1E3Zm14OXBrNjVUT2FLSCtNUHEyeVJHOEJlb1VlTXV3aWpsV0QyZUtRcXlLQnhmVDRUa21rOUhxaVBoUXJFZFcvb09XcGMxOHhFOUk4TW9OTHFTRmoxR3ZkeFZMRUdZOWpJRm4wK1JCVXl1RVhjVFFYYmM3d1BKZlZ2WXlOY0FNN21KVGVNcm9PMUZienhDTzhEMHFleTFqemp2QnUrQ1ZCcFBTV2NjWWxGaFlaMFRVbUlwMDZOM2VFK2xrb0VjdmxSdnRxSDN4OENCbS9hRDhJSC9Wc3BraEN6cnhUMTBKT2tYYUNSc3FNYTV5a3RKS3g1cHJtR0dqMjNiSWM1MUtpall3bjNEN1FxTUdJNkhMY2ZPc1BYUTFJN2krWHVVQjF4WlQ1NExPSUdmS0kzMkh1YjhOdjlWcWF6cGd4eXBUaHl0UWRsaFdUU0NkOXZFZTJET21OYVJCcnpLUG13STd5Y2huNHhYdVZOUnVtSzRCYTBqQUl4NFVNZVk4czVaNHJaTWQ2eUpEM1lLZlJDY2g0RDRTOEQxTHVnSXozUWNobklPVUtaSHdHUWo0SEtUOGc0M01Rc2czRFM0bU1iVURJZGd3ckpUSzJBeUhiTXB5VXlOZ1doR3pQTUZJaVkzc1FVb2Z1cFVSR0hSQlNqMjZsUkVZOUVGS1g3cVJFUmwwUVVwOXVwRVJHZlJEU2h2UlNJcU1OQ0dsSFdpbVIwUTZFdENXZGxNaG9DMExhazBaS1pMUUhJWDBJTHlVeStvQ1Fmb1NWRWhuOVFFaGZ3a21Kakw0Z3BEOWhwRVJHZnhBeUJ1NVNJbU1NRURJT2JsSWlZeHdRTWhaRHZ3VU1FRElpWmxJaVl6d1FNaWJxVWlKalRCQXlMbXBTSW1OY0VESTJ6YVZFeHRnZ1pIeWFTWW1NOFVISUhEeVdFaGx6Z0pCNXVDMGxNdVlCSVhOUkxTVXk1b0wzUStaa0V0bC84ZXBDV2tSTXh2OEJ3WXI4Qm1Mcm9RQUFBQUJKUlU1RXJrSmdnZz09Ii8+PC9kZWZzPjwvc3ZnPg==")\' +\n}\n');
	if ($(".form-control.input-sm").length > 0) {
		$(".form-control.input-sm").each(function() {
			this.style.height = "34px";
			this.style.fontSize = "14px";
		});
	}
	if ($(".col-sm-4").length > 0) {
		$(".col-sm-4").each(function() {
			this.style.width = "auto";
		});
	}
	var dropdown = '\n<div class="dropdown">\n<a id="dLabel" role="button" data-toggle="dropdown" class="btn btn-primary" data-target="#" href="/page.html">SunFrog Toolkit <span class="caret"></span></a>\n<ul class="dropdown-menu multi-level" role="menu" aria-labelledby="dropdownMenu">\n<li id="sortNewest"><i class="fa fa-fw fa-sort" style="margin: 6px;margin-left: 10px;"></i><a>Sort by Newest</a></li>\n<li id="getAll"><i class="fa fa-fw fa-clipboard" style="margin: 6px;margin-left: 10px;"></i><a>Get All</a></li>\n<li id="openSetting"><i class="fa fa-fw fa-cog" style="margin: 6px;margin-left: 10px;"></i><a>Settings</a></li>\n</ul>\n</div>\n';
	var inputYear = '<div><i class="fa fa-search fa-fw" style="position: absolute;padding: 8px;font-size: 16px;color: gray;"></i><input type="text" id="inputYear" placeholder="Filter by Years..." style="display: inline-block;font-size: initial;color: #34495e;padding: 4px;padding-left: 28px;border: 2px solid #95a5a6;border-radius: 4px;"></div>';
	if ($(".frameitWrapper").length === 0) {
		return;
	} else {
		if ($(".form-control.input-sm").length > 0) {
			$(".form-inline").append(dropdown, [inputYear]);
		} else {
			if ($("#productFilter").length > 0) {
				$(".heading_h3").after('<div id="containerToolkit" class="row form-inline col-sm-offset-0" style="margin-top: 20px;">');
				$("#productFilter").appendTo("#containerToolkit");
				$("#containerToolkit").append(dropdown, [inputYear]);
			} else {
				if ($("#sorter").length > 0) {
					$($("#sorter").find(".row")[0].firstElementChild).after('<div id="containerToolkit" class="row form-inline col-sm-offset-0" style="margin-left: inherit;">');
					$("#containerToolkit").append(dropdown, [inputYear]);
				} else {
					if ($(".container").find(".form-control.input-sm,#productFilter,#sorter").length === 0) {
						$($(".container").find('div[class="row"]')[0]).before('<div id="containerToolkit" class="row form-inline col-sm-offset-0" style="margin-bottom: 20px;">');
						$("#containerToolkit").append(dropdown, [inputYear]);
					}
				}
			}
		}
	}
	if (config.enableTooltip === true) {
		$("body").append('\n<div id="sortNewest-tooltip">\n<p style="text-align: left;">- T\u1ea5t c\u1ea3 Product s\u1ebd \u0111\u01b0\u1ee3c s\u1eafp x\u1ebfp theo ng\u00e0y m\u1edbi nh\u1ea5t.</p>\n</div>\n<div id="getAll-tooltip">\n<p style="text-align: left;">- Get t\u1ea5t c\u1ea3 SKU, Date, Title, Image URL, Product URL \u0111ang c\u00f3 tr\u00ean page.</p>\n<p style="text-align: left;">- B\u1ea1n c\u00f3 th\u1ec3 "Copy to Clipboard" ho\u1eb7c "Save to CSV" sau khi ho\u00e0n th\u00e0nh.</p>\n<p style="text-align: left;">- N\u1ebfu mu\u1ed1n t\u1ef1 \u0111\u1ed9ng ch\u00e8n SellerID v\u00e0o ProductURL b\u1ea1n c\u1ea7n v\u00e0o Settings \u0111\u1ec3 c\u00e0i \u0111\u1eb7t.</p>\n</div>\n<div id="inputYear-tooltip">\n<p style="text-align: left;">- L\u1ecdc Product theo n\u0103m.</p>\n<p style="text-align: left;">- VD: 2017,2018 ( ph\u00e2n c\u00e1ch nhau b\u1eb1ng d\u1ea5u , )</p>\n</div>\n');
		tippy("#sortNewest", {html:document.querySelector("#sortNewest-tooltip"), size:"large", arrow:true});
		tippy("#getAll", {html:document.querySelector("#getAll-tooltip"), size:"large", arrow:true});
		tippy("#inputYear", {html:document.querySelector("#inputYear-tooltip"), size:"large", arrow:true});
	}
	$(".container").arrive('img[data-src*="/images.sunfrogshirts.com/"]', {existing:true}, function() {
		var $img = $(this), $anchor;
		m = $img.attr("data-src").match(/.+com\/([\d/]+)\//);
		if (m !== null) {
			date = m[1];
		} else {
			date = "N/A";
		}
		$anchor = $img.closest("a");
		if ($anchor.length > 0) {
			m=$anchor.attr('href').match(/(\d+)-(\d+)\.html/);
			if(m!==null){sku=m[2];}else{sku='N/A';}
		}
		var $frameit = $img.closest(".frameitWrapper"), $prepend = $frameit.find('div[class="text-center text-info title_display"]');
		if ($frameit.length > 0 && $prepend.length === 0) {
			$frameit.prepend('<div class="text-center text-info title_display" style="font-weight: 700;margin: 4px;"><span class="my-sku">' + sku + '</span><span> | </span><span class="my-date">' + date + "</span></div>");
			$frameit.addClass("SelectedImage");
			$frameit.parent().addClass("toolkit");
			$frameit.before('<button type="button" class="deseBtn deselectBtn"></button>');
		}
	});
	$('div[class*="container"]').on("click", ".deselectBtn,.selectBtn", function() {
		var $eleFrameit = $(this).next();
		if ($eleFrameit.hasClass("SelectedImage")) {
			$eleFrameit.removeClass("SelectedImage");
			$eleFrameit.css("opacity", "0.4");
			$(this).removeClass("deselectBtn");
			$(this).addClass("selectBtn");
		} else {
			$eleFrameit.addClass("SelectedImage");
			$eleFrameit.css("opacity", "1.0");
			$(this).removeClass("selectBtn");
			$(this).addClass("deselectBtn");
		}
	});
	function sortZA(a, b) {
		return Date.parse($(b).find(".my-date").text()) - Date.parse($(a).find(".my-date").text());
	}
	function reorderEl(el) {
		var $container = $(".container").find('div[class="row"]');
		for (i = 2; i < $container.length; i++) {
			$($container[i]).html("");
		}
		el.each(function() {
			var $this = $(this);
			if ($this.find(".my-date").text() !== "N/A") {
				$this.appendTo($container[2]);
			} else {
				$this.appendTo($container[3]);
			}
		});
	}
	function notifySortNewestSuccess() {
		$.notify({icon:"glyphicon glyphicon-ok", title:"<strong>SUCCESS!</strong>", message:"\u0110\u00e3 s\u1eafp x\u1ebfp c\u00e1c Product theo ng\u00e0y m\u1edbi nh\u1ea5t."}, {type:"success", delay:2000, timer:1000, offset:20, z_index:1031, placement:{from:"top", align:"center"}});
	}
	function notifySortNewestWarning() {
		$.notify({icon:"glyphicon glyphicon-warning-sign", title:"<strong>WARNING!</strong>", message:"C\u00e1c Product hi\u1ec7n t\u1ea1i \u0111\u00e3 \u0111\u01b0\u1ee3c s\u1eafp x\u1ebfp theo ng\u00e0y m\u1edbi nh\u1ea5t."}, {type:"warning", delay:4000, timer:1000, offset:20, z_index:1031, placement:{from:"top", align:"center"}});
	}
	function SortByNewest(ele) {
		if ($(ele).hasClass("disabled") === true) {
			notifySortNewestWarning();
		} else {
			console.log("Start: Sort by Newest");
			reorderEl($(".toolkit").sort(sortZA));
			notifySortNewestSuccess();
		}
	}
	function FilterByYears() {
		var years = $("#inputYear")[0].value.toUpperCase().split(",");
		var $eleImages = $(".toolkit");
		for (i = 0; i < $eleImages.length; i++) {
			var eleImage = $eleImages[i];
			eleImage.style.display = "none";
			for (var j = 0; j < years.length; j++) {
				var year = years[j];
				if (eleImage.innerHTML.toUpperCase().indexOf(year) > -1) {
					eleImage.style.display = "";
				}
			}
		}
	}
	$("#inputYear").on("keyup", function() {
		FilterByYears();
	});
	function notifyGetAll() {
		$.notify({icon:"glyphicon glyphicon-ok", title:"<strong>SUCCESS!</strong>", message:"Qu\u00e1 tr\u00ecnh get data \u0111\u00e3 ho\u00e0n t\u1ea5t."}, {type:"success", delay:2000, timer:1000, offset:20, z_index:1031, placement:{from:"top", align:"center"}});
	}
	function copyGetAll(str, mimetype) {
		document.oncopy = function(event) {
			event.clipboardData.setData(mimetype, str);
			event.preventDefault();
		};
		document.execCommand("Copy", false, null);
	}
	function saveGetAll(str, filetype) {
		var date = new Date().toLocaleDateString("en-au", {year:"numeric", month:"numeric", day:"numeric"}).replace(/\//g, "");
		var titlepage;
		if ($("h1#srshow").length > 0) {
			titlepage = $("h1#srshow")[0].innerText.match(/\w+/).toString().replace(/[\\/#:*?"<>|]/g, "");
		} else {
			if ($("h1.heading_h3").length > 0) {
				titlepage = $("h1.heading_h3")[0].innerText.match(/\w+/).toString().replace(/[\\/#:*?"<>|]/g, "");
			} else {
				if ($(".text-capitalize").length > 0) {
					titlepage = $(".text-capitalize")[0].innerText.match(/\w+/).toString().replace(/[\\/#:*?"<>|]/g, "");
				}
			}
		}
		var filename = "SunFrog-" + date + "-" + titlepage + filetype;
		var a = document.createElement("a");
		if (a.download !== undefined) {
			a.href = "data:application/csv;charset=utf-8," + str;
			a.target = "_blank";
			a.download = filename;
			document.body.appendChild(a);
			a.click();
			document.body.removeChild(a);
		}
	}
	function changeCheckboxCSS() {
		var $chks = $(".bootbox-form .checkbox");
		for (i = 0; i < $chks.length; i++) {
			var chk = $chks[i];
			if (i === 0) {
				chk.outerHTML = '<div class="pretty p-icon p-curve p-pulse"><input type="checkbox" value="sku"/><div class="state p-primary"><i class="icon glyphicon glyphicon-ok"></i><label>SKU</label></div></div>';
			}
			if (i === 1) {
				chk.outerHTML = '<div class="pretty p-icon p-curve p-pulse"><input type="checkbox" value="date"/><div class="state p-primary"><i class="icon glyphicon glyphicon-ok"></i><label>Date</label></div></div>';
			}
			if (i === 2) {
				chk.outerHTML = '<div class="pretty p-icon p-curve p-pulse"><input type="checkbox" value="title"/><div class="state p-primary"><i class="icon glyphicon glyphicon-ok"></i><label>Title</label></div></div>';
			}
			if (i === 3) {
				chk.outerHTML = '<div class="pretty p-icon p-curve p-pulse"><input type="checkbox" value="image"/><div class="state p-primary"><i class="icon glyphicon glyphicon-ok"></i><label>Image</label></div></div>';
			}
			if (i === 4) {
				chk.outerHTML = '<div class="pretty p-icon p-curve p-pulse"><input type="checkbox" value="product"/><div class="state p-primary"><i class="icon glyphicon glyphicon-ok"></i><label>Product</label></div></div>';
			}
		}
		$('.bootbox-form input[type="checkbox"]').each(function() {
			this.checked = true;
		});
	}
	function getSKU() {
		if ($eleProduct.length > 0) {
			$eleSKU = $eleProduct.find(".my-sku");
			for (i = 0; i < $eleSKU.length; i++) {
				sku = $eleSKU[i].innerText;
				if (i === 0) {
					pushSKU = sku + "\t";
				} else {
					pushSKU = "\n" + sku + "\t";
				}
				arrayGetAll.push(pushSKU);
			}
		}
	}
	function getDate() {
		var index;
		var position = arrayChecked.indexOf("date");
		if ($eleProduct.length > 0) {
			$eleDate = $eleProduct.find(".my-date");
			for (i = 0; i < $eleDate.length; i++) {
				date = $eleDate[i].innerText;
				if (position === 0) {
					if (i === 0) {
						pushDate = date + "\t";
					} else {
						pushDate = "\n" + date + "\t";
					}
					arrayGetAll.push(pushDate);
				} else {
					if (i === 0) {
						index = 1;
					} else {
						index += 2;
					}
					arrayGetAll.splice(index, 0, date + "\t");
				}
			}
		}
	}
	function getTitle() {
		var index;
		var position = arrayChecked.indexOf("title");
		if ($eleProduct.length > 0) {
			$eleTitle = $eleProduct.find("img");
			for (i = 0; i < $eleTitle.length; i++) {
				title = $eleTitle[i].getAttribute("title");
				if (position === 0) {
					if (i === 0) {
						pushTitle = title + "\t";
					} else {
						pushTitle = "\n" + title + "\t";
					}
					arrayGetAll.push(pushTitle);
				} else {
					if (position === 1) {
						if (i === 0) {
							index = 1;
						} else {
							index += 2;
						}
						arrayGetAll.splice(index, 0, title + "\t");
					} else {
						if (position === 2) {
							if (i === 0) {
								index = 2;
							} else {
								index += 3;
							}
							arrayGetAll.splice(index, 0, title + "\t");
						}
					}
				}
			}
		}
	}
	function getImage() {
		var index;
		var position = arrayChecked.indexOf("image");
		if ($eleProduct.length > 0) {
			$eleImage = $eleProduct.find("img");
			for (i = 0; i < $eleImage.length; i++) {
				var src = $eleImage[i].getAttribute("data-src");
				m = src.replace(/m_/, "");
				if (config.getImage === "getsizeten") {
					image = "https:" + m;
				} else {
					image = "https:" + src;
				}
				if (position === 0) {
					if (i === 0) {
						pushImage = image + "\t";
					} else {
						pushImage = "\n" + image + "\t";
					}
					arrayGetAll.push(pushImage);
				} else {
					if (position === 1) {
						if (i === 0) {
							index = 1;
						} else {
							index += 2;
						}
						arrayGetAll.splice(index, 0, image + "\t");
					} else {
						if (position === 2) {
							if (i === 0) {
								index = 2;
							} else {
								index += 3;
							}
							arrayGetAll.splice(index, 0, image + "\t");
						} else {
							if (position === 3) {
								if (i === 0) {
									index = 3;
								} else {
									index += 4;
								}
								arrayGetAll.splice(index, 0, image + "\t");
							}
						}
					}
				}
			}
		}
	}
	function getProduct() {
		var index;
		var position = arrayChecked.indexOf("product");
		if ($eleProduct.length > 0) {
			$eleProduct = $eleProduct.find("a");
			for (i = 0; i < $eleProduct.length; i++) {
				var href = $eleProduct[i].getAttribute("href");
				m = href.replace(/\?\d+/, "");
				if (config.insertSellerID === true) {
					product = "https://www.sunfrog.com" + m + "?" + config.SellerID;
				} else {
					product = "https://www.sunfrog.com" + m;
				}
				if (position === 0) {
					if (i === 0) {
						pushProduct = product + "\t";
					} else {
						pushProduct = "\n" + product + "\t";
					}
					arrayGetAll.push(pushProduct);
				} else {
					if (position === 1) {
						if (i === 0) {
							index = 1;
						} else {
							index += 2;
						}
						arrayGetAll.splice(index, 0, product + "\t");
					} else {
						if (position === 2) {
							if (i === 0) {
								index = 2;
							} else {
								index += 3;
							}
							arrayGetAll.splice(index, 0, product + "\t");
						} else {
							if (position === 3) {
								if (i === 0) {
									index = 3;
								} else {
									index += 4;
								}
								arrayGetAll.splice(index, 0, product + "\t");
							} else {
								if (position === 4) {
									if (i === 0) {
										index = 4;
									} else {
										index += 5;
									}
									arrayGetAll.splice(index, 0, product + "\t");
								}
							}
						}
					}
				}
			}
		}
	}
	function GetAll() {
		bootbox.prompt({title:"Do You Want to Get?", value:["0", "1", "2", "3", "4"], inputType:"checkbox", inputOptions:[{value:"sku", text:"SKU"}, {value:"date", text:"Date"}, {value:"title", text:"Title"}, {value:"image", text:"Image"}, {value:"product", text:"Product"}], callback:function(result) {
			if (result) {
				lenChecked = result.length;
				if (lenChecked > 0) {
					arrayChecked = result;
					strChecked = result.join();
					$eleProduct = $(".frameitWrapper.SelectedImage");
					if (strChecked.indexOf("sku") > -1) {
						getSKU();
					}
					if (strChecked.indexOf("date") > -1) {
						getDate();
					}
					if (strChecked.indexOf("title") > -1) {
						getTitle();
					}
					if (strChecked.indexOf("image") > -1) {
						getImage();
					}
					if (strChecked.indexOf("product") > -1) {
						getProduct();
					}
					if (config.getAll === "copy") {
						str = arrayGetAll.join("");
						copyGetAll(str, "text");
					} else {
						if (config.getAll === "csv") {
							str = arrayGetAll.join(",").replace(/\t/g, "");
							saveGetAll(str, ".csv");
						}
					}
					str = "";
					arrayGetAll.length = 0;
					notifyGetAll();
				}
			}
		}});
		changeCheckboxCSS();
	}
	function ProductCount() {
		$("#viewMore").click();
	}
	$(".dropdown-menu.multi-level").mouseleave(function() {
		$(".dropdown").removeClass("open");
	});
	$(".dropdown-menu.multi-level").on("click", "li", function() {
		var option = this.id;
		if (option === "sortNewest") {
			SortByNewest(this);
			this.classList.add("disabled");
		} else {
			if (option === "getAll") {
				GetAll();
			} else {
				if (option === "openSetting") {
					GM_config.open();
				} else {
					if (option === "countProduct") {
						ProductCount();
					}
				}
			}
		}
	});
	$("#viewMore").on("click", function() {
		$(".container").arrive('i[class="fa fa-chevron-down"],i[class="fa fa-angle-double-down"]', function() {
			if (this.nextSibling.nodeValue.indexOf("More") === -1) {
				return;
			}
			autoLoadMoreSelected = config.autoLoadMore;
			if (autoLoadMoreSelected.indexOf("autodefault") > -1) {
				return;
			} else {
				var optSortNewest = $("#sortNewest");
				if (autoLoadMoreSelected.indexOf("autosort") > -1) {
					SortByNewest();
					optSortNewest.addClass("disabled");
				} else {
					optSortNewest.removeClass("disabled");
				}
				if (autoLoadMoreSelected.indexOf("autofilter") > -1) {
					FilterByYears();
				}
			}
		});
	});
});