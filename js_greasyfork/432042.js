// ==UserScript==
// @name         Ainyava Scripts
// @namespace    http://ainyava.ir
// @version      0.4
// @description  Ainyava.ir scripts
// @author       Hamed Mahmoudkhani
// @match        http://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/432042/Ainyava%20Scripts.user.js
// @updateURL https://update.greasyfork.org/scripts/432042/Ainyava%20Scripts.meta.js
// ==/UserScript==

(function() {
    'use strict';
    if(window.location.href.indexOf('tsetmc.com') !== -1) {

        var pluginFilters = [
			{
				"FilterName": "pe زیر ۵",
				"FilterCode": "(pe)<=5"
			},
			{
				"FilterName": "pe زیر ۱۰",
				"FilterCode": "(pe)<=10"
			},
			{
				"FilterName": "پایان نزول و شروع سعود",
				"FilterCode": "(pf)<(py)&&(plp)<1&&(tno)>10&&(pl)>(py)"
			},
			{
				"FilterName": "رنج مثبت و منفی",
				"FilterCode": "(pl)>1.01*(pf)&&(tno)>10&&(pf)>1.01*(py)&&(pl)!=(tmax)"
			},
			{
				"FilterName": "تقاضا بالا حتی در مثبت",
				"FilterCode": "((qd1)+(qd2)+(qd3))>50*((qo1)+(qo2)+(qo3))&&(pl)==(pmax)"
			},
			{
				"FilterName": "حجم خرید حقوقی بیشتر از حقیقی",
				"FilterCode": "(ct).Buy_N_Volume>(ct).Buy_I_Volume"
			},
			{
				"FilterName": "pe زیر ۷",
				"FilterCode": "(pe)<=7"
			},
			{
				"FilterName": "اختلاف پایانی و آخرین حداقل ۵ درصد",
				"FilterCode": "1.05*(pl)<=(pc)"
			},
			{
				"FilterName": "صف خرید کم حجم",
				"FilterCode": "(pd1)==(tmax)&&(qd1)>=.2*(bvol)&&(qd1)<=(bvol)"
			},
			{
				"FilterName": "فشار فروش (سیگنال فروش)",
				"FilterCode": "(qd1)+(qd2)+(qd3)<((qo1)+(qo2)+(qo3))/10"
			},
			{
				"FilterName": "نمادهایی که افت 20 درصدی یا بیشتر قیمت در یک ماه گذشته داشته‌اند",
				"FilterCode": "([ih][20].PriceMax-(pl))/[ih][20].PriceMax>.20"
			},
			{
				"FilterName": "کف قیمتی 60 روزه",
				"FilterCode": "true==function(){var MinPrice=function(){var min=[ih][0].PriceMin;var ipos;for(ipos=0;ipos<60;ipos++)if(min>[ih][ipos].PriceMin)min=[ih][ipos].PriceMin;return min;};if((pl)<MinPrice()){return true;}else{return false;}}()"
			},
			{
				"FilterName": "قدرت خریداران ۲برابر فروشندگان و معاملات بالای ۲۰۰میلیون",
				"FilterCode": "(tval)>2000000000 && (ct).Buy_CountI >=2*((ct).Sell_CountI)"
			},
			{
				"FilterName": "خرید حقوقی بیش از ۶۰ درصد",
				"FilterCode": "(ct).Buy_N_Volume >= (tvol) * 0.6"
			},
			{
				"FilterName": "حجم ۲ برابر و قیمت پایانی منفی",
				"FilterCode": "var sum=0;for(var i=1; i<=30; i++) {sum += [ih][i].QTotTran5J;};(plp) < 0  && (tvol)>2*(sum/30);"
			},
			{
				"FilterName": "سهم های دارای افزایش حجم ۲ برابری",
				"FilterCode": "(tvol)>2*[is5] || (tvol)>2*[is6]"
			},
			{
				"FilterName": "سهم های دارای افزایش حجم ۵ برابری",
				"FilterCode": "(tvol)>5*[is5] || (tvol)>5*[is6]"
			},
			{
				"FilterName": "سهم های دارای افزایش حجم ۱۰ برابری",
				"FilterCode": "(tvol)>10*[is5] || (tvol)>10*[is6]"
			},
			{
				"FilterName": "سهم‌های دارای افزایش حجم معامله",
				"FilterCode": "true==function(){var tv6=function(){var vol1=[ih][0].QTotTran5J;var n;for(n=1;n<5;n++)vol1=vol1+[ih][n].QTotTran5J;return vol1;};var tv14=function(){var vol2=[ih][6].QTotTran5J;var m;for(m=7;m<14;m++)vol2=vol2+[ih][m].QTotTran5J;return vol2;};var minv14=function(){var min=[ih][0].QTotTran5J;var a;for(a=1;a<14;a++)if(min>[ih][a].QTotTran5J)min=[ih][a].QTotTran5J;return min;};var maxp52=function(){var max1=[ih][0].PriceMax;var b;for(b=1;b<52;b++)if(max1<[ih][b].PriceMax)max1=[ih][b].PriceMax;return max1;};if((tv6())>(tv14())&&((pc)<.9*maxp52())&&(minv14()>0) ){return true;}else{return false;}}()"
			},
			{
				"FilterName": "خرید حقوقی و نوسانگیری",
				"FilterCode": "(tno)>400  &&[(tvol) >= 5*(bvol)]  && (ct).Buy_N_Volume>100000 && (pe)<8 && (eps)>0"
			},
			{
				"FilterName": "سهم های صعود روزانه",
				"FilterCode": "(pl)<((pf)-((pf)-(pmin))/2) && (pl)>((pmin)+((pf)-(pmin))/4) && (plp)<=1 && (tno)>10 && (pf)>(pmin) && (pf)>(py)"
			},
			{
				"FilterName": "حجم مبنا کم و پتانسیل بالا نوسانگیری",
				"FilterCode": "((pf)>=1.02*(py)) && ((pc)>=(py)) && (100*(((pmax)-(pmin))/(pc))>2) && (bvol)<1000000 && (pcp)>0.5"
			},
			{
				"FilterName": "چکش سفید نوسانگیری",
				"FilterCode": "(pl)>1.02*(pf) && (tno)>10 && (pl)!=(tmax)"
			},
			{
				"FilterName": "چکش سفید معکوس نوسان",
				"FilterCode": "(pf)<1.01*(pmin) && (plp)<=1 && (tno)>10 && (pl)>1.02*(pmin)"
			},
			{
				"FilterName": "بازار فردا ۱ ساعت آخر مستعد رشد برای روز بعد",
				"FilterCode": "(tno)>50&&(tvol)>(bvol)&&(bvol)<=7000000&&(plp)>=(pcp)+1.5&&(eps)>0"
			},
			{
				"FilterName": "ورودی نقدینگی حقیقی",
				"FilterCode": "(ct).Buy_I_Volume/(ct).Buy_CountI >3 *(ct).Sell_I_Volume/(ct).Sell_CountI"
			},
			{
				"FilterName": "خروجی نقدینگی حقیقی",
				"FilterCode": "(ct).Buy_I_Volume*2/(ct).Buy_CountI < (ct).Sell_I_Volume/(ct).Sell_CountI"
			},
			{
				"FilterName": "قدرت خریدار ۲برابر و فروش حقوقی بالا ۱۵ درصد و خرید حقوقی کمتر از ۱ درصد (سیگنال خرید قوی)",
				"FilterCode": "(ct).Buy_CountI >=2*((ct).Sell_CountI) && (ct).Sell_N_Volume>(tvol)*0.15 && (ct).Buy_N_Volume<(tvol)*0.01"
			},
			{
				"FilterName": "قدرت خریدار ۲برابر و فروش حقوقی بالا ۱۵ درصد (سیگنال متوسط)",
				"FilterCode": "(ct).Buy_CountI >=2*((ct).Sell_CountI) && (ct).Sell_N_Volume>(tvol)*0.15"
			},
			{
				"FilterName": "صف فروش",
				"FilterCode": "true==function(){if((tvol)>(bvol) && (pmin)== (tmin) && ((pl)-(pc))/(pl)*100>1.5 && (ct).Sell_CountI >= (ct).Buy_CountI && (tno)>5 && (tno)>20){return true;}else{return false;}}()"
			},
			{
				"FilterName": "صف خرید",
				"FilterCode": "true==function(){if((qd1)>0&&(pd1)==(tmax)){return true;}else{return false;}}()"
			},
			{
				"FilterName": "تعداد معاملات بیشتر در یک روز گذشته نسبت به سه روز گذشته",
				"FilterCode": "(pc)>(py)&&[ih][0].ZTotTran>[ih][2].ZTotTran"
			},
			{
				"FilterName": "نمادهای مناطق با اشباع خرید یا اشباع فروش",
				"FilterCode": "true==function(){var CalculateRSI =function(period){var len=20;for (var i = 0; i < len ; i++) {var rec=[ih][len-1-i];var change=rec.PClosing-rec.PriceYesterday; if (change> 0) {rec.gain=change;rec.loss=0;}else{rec.gain=0;rec.loss=-change;}}var gainSum=0;var lossSum=0;for (var i = 0; i < period; i++) {var rec=[ih][len-1-i];gainSum += rec.gain;lossSum += rec.loss;}var averageGain=gainSum /period;var averageLoss=lossSum / period;for (var i = period + 1; i < len; i++) {var rec=[ih][len-1-i];averageGain=(averageGain* (period - 1) + rec.gain) / period;averageLoss=(averageLoss* (period - 1) + rec. loss)/ period;rec.averageGain=averageGain;rec.averageLoss=averageLoss;}var RS = 0; var RSIndex = 0; for (var i = period + 1; i < len; i++) {var rec=[ih][len-1-i];RS = rec.averageGain/ rec.averageLoss;RSIndex = 100 - 100 / (1 + RS);rec.rsi=RSIndex;}};if(typeof [ih][0].rsi==\"undefined\")CalculateRSI(14);(cfield0)=Math.floor([ih][0].rsi);if( [ih][0].rsi>80 || [ih][0].rsi<20){return true}else{return false}; }()"
			},
			{
				"FilterName": "آخرین قیمت معامله کمتر از کمترین قیمت 21 روز اخیر",
				"FilterCode": "true==function(){var MinPrice=function(){var min=[ih][0].PriceMin;var ipos;for(ipos=0;ipos<21;ipos++)if(min>[ih][ipos].PriceMin)min=[ih][ipos].PriceMin;return min;};if((pl)<MinPrice()){return true;}else{return false;}}()"
			},
			{
				"FilterName": "حجم معاملات بیشتر میانگین حجم معاملات سه ماهه",
				"FilterCode": "(ct).Buy_I_Volume>[is5]"
			},
			{
				"FilterName": "ورود پول هوشمند",
				"FilterCode": "(tvol)>=2*(([ih][0].QTotTran5J+[ih][1].QTotTran5J+[ih][2].QTotTran5J+[ih][3].QTotTran5J+[ih][4].QTotTran5J+[ih][5].QTotTran5J+[ih][6].QTotTran5J+[ih][7].QTotTran5J+[ih][8].QTotTran5J+[ih][9].QTotTran5J+[ih][10].QTotTran5J+[ih][11].QTotTran5J+[ih][12].QTotTran5J+[ih][13].QTotTran5J+[ih][14].QTotTran5J+[ih][15].QTotTran5J+[ih][16].QTotTran5J+[ih][17].QTotTran5J+[ih][18].QTotTran5J+[ih][19].QTotTran5J+[ih][20].QTotTran5J+[ih][21].QTotTran5J+[ih][22].QTotTran5J+[ih][23].QTotTran5J+[ih][24].QTotTran5J+[ih][25].QTotTran5J+[ih][26].QTotTran5J+[ih][27].QTotTran5J+[ih][28].QTotTran5J+[ih][29].QTotTran5J)/30)&&((ct).Buy_I_Volume/(ct).Buy_CountI)>((ct).Sell_I_Volume/(ct).Sell_CountI)&&(pl)>=(pc)"
			},
			{
				"FilterName": "خروج پول هوشمند",
				"FilterCode": "(tvol)>=2*(([ih][0].QTotTran5J+[ih][1].QTotTran5J+[ih][2].QTotTran5J+[ih][3].QTotTran5J+[ih][4].QTotTran5J+[ih][5].QTotTran5J+[ih][6].QTotTran5J+[ih][7].QTotTran5J+[ih][8].QTotTran5J+[ih][9].QTotTran5J+[ih][10].QTotTran5J+[ih][11].QTotTran5J+[ih][12].QTotTran5J+[ih][13].QTotTran5J+[ih][14].QTotTran5J+[ih][15].QTotTran5J+[ih][16].QTotTran5J+[ih][17].QTotTran5J+[ih][18].QTotTran5J+[ih][19].QTotTran5J+[ih][20].QTotTran5J+[ih][21].QTotTran5J+[ih][22].QTotTran5J+[ih][23].QTotTran5J+[ih][24].QTotTran5J+[ih][25].QTotTran5J+[ih][26].QTotTran5J+[ih][27].QTotTran5J+[ih][28].QTotTran5J+[ih][29].QTotTran5J)/30)&&((ct).Buy_I_Volume/(ct).Buy_CountI)<((ct).Sell_I_Volume/(ct).Sell_CountI)&&(pl)<=(pc)"
			},
			{
				"FilterName": "کد به کد حقیقی به حقوقی بازه یک ماهه",
				"FilterCode": "(tvol)>1.5*(([ih][0].QTotTran5J+[ih][1].QTotTran5J+[ih][2].QTotTran5J+[ih][3].QTotTran5J+[ih][4].QTotTran5J+[ih][5].QTotTran5J+[ih][6].QTotTran5J+[ih][7].QTotTran5J+[ih][8].QTotTran5J+[ih][9].QTotTran5J+[ih][10].QTotTran5J+[ih][11].QTotTran5J+[ih][12].QTotTran5J+[ih][13].QTotTran5J+[ih][14].QTotTran5J+[ih][15].QTotTran5J+[ih][16].QTotTran5J+[ih][17].QTotTran5J+[ih][18].QTotTran5J+[ih][19].QTotTran5J+[ih][20].QTotTran5J+[ih][21].QTotTran5J+[ih][22].QTotTran5J+[ih][23].QTotTran5J+[ih][24].QTotTran5J+[ih][25].QTotTran5J+[ih][26].QTotTran5J+[ih][27].QTotTran5J+[ih][28].QTotTran5J+[ih][29].QTotTran5J)/30)&&((ct).Buy_I_Volume/(ct).Buy_CountI)>=((ct).Sell_I_Volume/(ct).Sell_CountI)&&(pl)>=(pc)&&(plp)>0&&(ct).Buy_I_Volume>0.5*(tvol)&&(ct).Sell_N_Volume>0.5*(tvol)"
			},
			{
				"FilterName": "کد به کد حقیقی به حقوقی بازه سه ماهه",
				"FilterCode": "(tvol)>1.5*[is5] &&((ct).Buy_I_Volume/(ct).Buy_CountI)<((ct).Sell_I_Volume/(ct).Sell_CountI) &&(ct).Buy_N_Volume>0.5*(tvol) &&(ct).Sell_I_Volume>0.5*(tvol) && (pl)<=(pc)&&(plp)<0"
			},
			{
				"FilterName": "کد به کد حقیقی به حقوقی بازه یک ساله",
				"FilterCode": "(tvol)>1.5*[is6 ] &&((ct).Buy_I_Volume/(ct).Buy_CountI)<((ct).Sell_I_Volume/(ct).Sell_CountI) &&(ct).Buy_N_Volume>0.5*(tvol)&&(ct).Sell_I_Volume>0.5*(tvol) &&(pl)<=(pc)&&(plp)<0"
			},
			{
				"FilterName": "کد به کد حقوقی به حقیقی بازه یک ماهه",
				"FilterCode": "(tvol)>1.5*(([ih][0].QTotTran5J+[ih][1].QTotTran5J+[ih][2].QTotTran5J+[ih][3].QTotTran5J+[ih][4].QTotTran5J+[ih][5].QTotTran5J+[ih][6].QTotTran5J+[ih][7].QTotTran5J+[ih][8].QTotTran5J+[ih][9].QTotTran5J+[ih][10].QTotTran5J+[ih][11].QTotTran5J+[ih][12].QTotTran5J+[ih][13].QTotTran5J+[ih][14].QTotTran5J+[ih][15].QTotTran5J+[ih][16].QTotTran5J+[ih][17].QTotTran5J+[ih][18].QTotTran5J+[ih][19].QTotTran5J+[ih][20].QTotTran5J+[ih][21].QTotTran5J+[ih][22].QTotTran5J+[ih][23].QTotTran5J+[ih][24].QTotTran5J+[ih][25].QTotTran5J+[ih][26].QTotTran5J+[ih][27].QTotTran5J+[ih][28].QTotTran5J+[ih][29].QTotTran5J)/30)&&((ct).Buy_I_Volume/(ct).Buy_CountI)>=((ct).Sell_I_Volume/(ct).Sell_CountI)&&(pl)>=(pc)&&(plp)>0&&(ct).Buy_I_Volume>0.5*(tvol)&&(ct).Sell_N_Volume>0.5*(tvol)"
			},
			{
				"FilterName": "کد به کد حقوقی به حقیقی بازه سه ماهه",
				"FilterCode": "(tvol)>1.5*[is6 ] &&((ct).Buy_I_Volume/(ct).Buy_CountI)<((ct).Sell_I_Volume/(ct).Sell_CountI) &&(ct).Buy_N_Volume>0.5*(tvol)&&(ct).Sell_I_Volume>0.5*(tvol) &&(pl)<=(pc)&&(plp)<0"
			},
			{
				"FilterName": "کد به کد حقوقی به حقیقی بازه یک ساله",
				"FilterCode": "(tvol)>1.5*[is6 ] &&((ct).Buy_I_Volume/(ct).Buy_CountI)<((ct).Sell_I_Volume/(ct).Sell_CountI) &&(ct).Buy_N_Volume>0.5*(tvol)&&(ct).Sell_I_Volume>0.5*(tvol) &&(pl)<=(pc)&&(plp)<0"
			},
			{
				"FilterName": "حجم مشکوک",
				"FilterCode": "(ct).Buy_I_Volume>[is5]*5"
			},
			{
				"FilterName": "اردر های حمایتی",
				"FilterCode": "((pl)<((pf)-((pf)-(pmin))/2) && (pl)>((pmin)+((pf)-(pmin))/4) && (plp)<=1 && (tno)>10 && (pf)>(pmin) && (pf)>(py)) || ((pf)<(py) && (plp)<1 && (tno)>10 && (pl)>(py)) || ((pl)>1.01*(pf) && (tno)>10 && (pf)>1.01*(py) && (pl)!=(tmax)) || ((pl)>1.02*(pf) && (tno)>10 && (pl)!=(tmax)) || ((pf)<1.01*(pmin) && (plp)<=1 && (tno)>10 && (pl)>1.02*(pmin) )"
			},
			{
				"FilterName": "کراس میانگین ۲۰ روزه رو به بالا",
				"FilterCode": "true==function(){var PriceN=function(){var price=[ih][0].PClosing;var D=20;var N=D-1;var n ;for(n=1;n<=N;n++)price=[ih][n].PClosing + price;if(n=N){price = price /(n+1) ;}return price ;};if((pl) > PriceN()){(cfield0)= Math.round(PriceN());return true;}else{return false;}(cfield0)= PriceN()}()"
			},
			{
				"FilterName": "سهم‌هایی که در حال برگشت قیمتی از منفی به مثبت هستند",
				"FilterCode": "(pcp)<-3&&(plp)>-3"
			},
			{
				"FilterName": "صف فروش هایی که جمع شده و گارد صعودی گرفته اند",
				"FilterCode": "(tvol)>(bvol) && (pmin)==(tmin) && (((pl)-(pc))/(pc))*100>1.5 && (ct).Sell_CountI>=(ct).Buy_CountI && (tno)>20"
			},
			{
				"FilterName": "صف فروش و حجم بالا",
				"FilterCode": "(po1)==(tmin)&&(qo1)>=7*(bvol)"
			},
			{
				"FilterName": "آخرین قیمت معامله کمتر از کمترین قیمت ۲۱ روز اخیر",
				"FilterCode": "true==function(){var MinPrice=function(){var min=[ih][0].PriceMin;var ipos;for(ipos=0;ipos<21;ipos++)if(min>[ih][ipos].PriceMin)min=[ih][ipos].PriceMin;return min;};if((pl)<MinPrice()){return true;}else{return false;}}()"
			},
			{
				"FilterName": "قدرت خریدار ۲ برابر - قیمت پایانی منفی - صف فروش کم حجم - اشباع فروش روزانه",
				"FilterCode": "true == function() {	var CalculateRSI = function(period) {var len = 20;for (var i = 0; i < len; i++) {var rec = [ih][len - 1 - i];var change = rec.PClosing - rec.PriceYesterday;if (change > 0) {rec.gain = change;	rec.loss = 0;} else {rec.gain = 0;rec.loss = -change;}}var gainSum = 0; var lossSum = 0;for (var i = 0; i < period; i++) {var rec = [ih][len - 1 - i];gainSum += rec.gain;lossSum += rec.loss;}	var averageGain = gainSum / period;	var averageLoss = lossSum / period;	for (var i = period + 1; i < len; i++) { var rec = [ih][len - 1 - i];averageGain = (averageGain * (period - 1) + rec.gain) / period;averageLoss = (averageLoss * (period - 1) + rec.loss) / period;rec.averageGain = averageGain;rec.averageLoss = averageLoss;}var RS = 0;var RSIndex = 0;for (var i = period + 1; i < len; i++) {var rec = [ih][len - 1 - i];RS = rec.averageGain / rec.averageLoss;RSIndex = 100 - 100 / (1 + RS);rec.rsi = RSIndex;}};if (typeof [ih][0].rsi == \"undefined\") CalculateRSI(1);(cfield0) = Math.floor([ih][0].rsi);if ( (ct).Buy_CountI >=2*((ct).Sell_CountI) && (pl)<=(pc)*1.02 && [ih][0].rsi < 30) {return true} else {return false};}()"
			}
		];

        // Styles
        document.querySelector('head').innerHTML += `
        <link href="https://cdn.jsdelivr.net/gh/rastikerdar/vazir-font/dist/font-face.css">
        <style>
        .ainyava p{font-size: 1.5em; font-family: Vazir; text-align: center; color: #d35400; line-height: 1; }
        .ainyava a{color: #d35400;}
        </style>`;

        // Add UI
        window.addEventListener('click', function() {
            var elemFilter = document.querySelector('#FilterContent');
            if(elemFilter !== null && elemFilter.innerHTML.indexOf('ainyava.ir') === -1) {
                elemFilter.innerHTML = '<div class="ainyava"><p>فیلتر های سایت دیده بان با قابلیت بروزرسانی</p><p><a href="http://ainyava.ir">www.ainyava.ir</a></p></div>' + elemFilter.innerHTML;
            }
        });

        // Check for update
        var settings = JSON.parse(localStorage.getItem('MarketWatchSettings'));
        if(JSON.stringify(settings['Filters']) !== JSON.stringify(pluginFilters)) {
            settings['Filters'] = pluginFilters;
			settings['ViewMode'] = 0;
			settings['LoadClientType'] = 1;
			settings['LoadInstStat'] = 1;
			settings['LoadInstHistory'] = 1;
            localStorage.setItem('MarketWatchSettings', JSON.stringify(settings));
            alert('فیلتر ها با موفقیت بروز رسانی شدند');
        }
    }
})();