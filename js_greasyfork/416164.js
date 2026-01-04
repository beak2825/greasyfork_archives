// ==UserScript==
// @name 			软件NO1 Ajax Download
// @description		软件NO1 下载地址加载，免打开下载地址页面 + 广告移除
// @author			极品小猫
// @version			1.0.3
// @namespace   	https://greasyfork.org/users/3128
// @icon         https://www.rjno1.com/favicon.ico
// @include      https://www.rjno1.com/*
// @include       https://www.fontke.com/font/*
// @include       https://m.fontke.com/font/*
// @license     	GPL 3.0
// @run-at			document-idle
//
// @grant			GM_addStyle
// @grant       	GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/416164/%E8%BD%AF%E4%BB%B6NO1%20Ajax%20Download.user.js
// @updateURL https://update.greasyfork.org/scripts/416164/%E8%BD%AF%E4%BB%B6NO1%20Ajax%20Download.meta.js
// ==/UserScript==


let u=unsafeWindow, $=u.$, webHost=location.host;

let Ruler={
    'www.fontke.com': {
        callback: () => {
            let downPageUrl=$('a.ch-down').attr('href');
            console.log(downPageUrl);
            $.get(downPageUrl, function(result, s, e){
                //console.log($(result).find('a[title="立即下载"]'));
                //console.log(result, $(result));

                let WindowDownPageUrl=$(result).find('a[title="立即下载"]').attr('href');//find('a[href^="/download/?hash"]').attr('href');
                //console.log(r, $(r));
                //console.log(WindowDownPageUrl);
                $.get(WindowDownPageUrl, function(result,s2,e2) {
                    //console.log(s2,e2,r2);
                    $(result).find('a[href*="dl.fontke.com"]').each(function(){
                        console.log(this);
                        $('.ch-down:not(.ajaxDown)').before($(this).addClass('ch-down').addClass('ajaxDown'));
                    })
                })
            })
        }
    },
    'www.rjno1.com': {
        callback : () => {
            setTimeout(()=>{
                var_do=false;
                $('.aqn8dec, .aqn0519, .aqn22de, .aqnd8e9, .aqn4334, .aqn09e6, .aqn4d57, .aqn9476, .aqn5199, .aqne2bd, .aqn145e, .aqne4fa, .aqnaac6, .aqn4648, .aqnc2a5, .aqn737c').remove();
            }, 500); //update 2022-06-13


            let Loaded=document.querySelector('script[src*="https://www.rjno1.com/wp-content/themes/moban/moban-js/show_ads.js"]').getAttribute('onload');

            window.addEventListener('load', function(){
                let adID=Loaded.replace(/rjno1adsjsload=\w+;?/i,'');
                console.log(adID, Loaded);
                eval(
                    adID+`rjno1adsjsload = true;
`+adID+`scriptLoaded = true;
`+adID+`checkguishow = false;
`+adID+`rjno1settimeout = true;
`+adID+`=true;
console.log(u.`+adID+`scriptLoaded );
`);
                u.Goog_Osd_UnloadAdBlock=true;
                u.rjno1canrunads = false;
                $('[style="width: 0px; height: 0px; overflow: hidden; visibility: hidden; display: none;"]').hide();
            });

            $.get($('.post-download-address-button').attr('href'), function (result) {
                let download=$(result).find('.attachment-download-link-wrap');
                $('.single-tags').before(download.css({'border':'3px dotted red'}));
            });
        }
    }
}

if(Ruler[webHost]) {
    Ruler[webHost].callback();
}