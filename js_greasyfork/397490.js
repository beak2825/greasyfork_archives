// ==UserScript==
// @name         磁力快显
// @author       zxf10608
// @version      4.3
// @homepageURL  https://greasyfork.org/zh-CN/scripts/397490
// @icon      	 https://cdn.jsdelivr.net/gh/zxf10608/JavaScript/icon/magnet00.png
// @description  在磁力宝、SOBT、ØMagnet、磁力狗等磁力搜索引擎的搜索列表增加磁力链接显示，方便快速下载资源。
// @require      https://cdn.jsdelivr.net/npm/jquery@3.7.1/dist/jquery.min.js
// @require      https://cdn.jsdelivr.net/npm/spotlight.js@0.7.8/dist/spotlight.bundle.min.js
// @include      http*://clb*.*
// @include      http*://sobt*.*
// @include      http*://btsow.*/search/*
// @include      http*://*.*yuhuage*.*/search/*
// @include      http*://*.torrentkitty.*/search/*
// @include      http*://*.seedhub.cc/movies/*
// @include      /https?:\/\/(\w)*(mag|cili)\.(net|info|icu|my|me|uk|com)\/search/
// @include      /https?:\/\/cl[mg](\d.)*(\.\w+)?\.(top|cfd|icu|xyz|com)\/\S*(word|name)=/

// @include      https://yourbittorrent.*/?v=&c=&q=*
// @connect      whatslink.info
// @connect      *
// @grant        unsafeWindow
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_openInTab
// @grant        GM_setClipboard
// @grant        GM_xmlhttpRequest
// @grant        GM_registerMenuCommand
// @run-at       document-start
// @license      GPL License
// @namespace http://tampermonkey.net/
// @downloadURL https://update.greasyfork.org/scripts/397490/%E7%A3%81%E5%8A%9B%E5%BF%AB%E6%98%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/397490/%E7%A3%81%E5%8A%9B%E5%BF%AB%E6%98%BE.meta.js
// ==/UserScript==

(function() {
    'use strict';
	
    const blockAlert = () => {
        if (document.title.match(/磁力宝|sobt/i) !== null) {
			$('.common-link:odd,.search-tips,#cps-wrap').remove();
            unsafeWindow.alert = () => console.log('已阻止弹窗。');
        };
    };
	blockAlert();
	
    const setupMagnetMenu = () => {
        const isOpen = GM_getValue('magnet_open') === 1;
        const menuText = isOpen ? '当前识别常规磁力' : '当前不识别常规磁力';
        const menuAction = () => {
            GM_setValue('magnet_open', isOpen ? 0 : 1);
            location.reload();
        };
        GM_registerMenuCommand(menuText, menuAction);
    };
	setupMagnetMenu();

	const setupPreviewMenu = () => {
		const isPreviewOpen = GM_getValue('preview_open', 1) === 1; 
		const menuText = isPreviewOpen ? '当前开启磁力图片预览' : '当前关闭磁力图片预览';
		const menuAction = () => {
			GM_setValue('preview_open', isPreviewOpen ? 0 : 1);
			location.reload();
		};
		GM_registerMenuCommand(menuText, menuAction);
	};
	setupPreviewMenu();
    const base32To16 = (str) => {
        if (str.length % 8 !== 0 || /[0189]/.test(str)) {
            return str;
        };
        str = str.toUpperCase();
        let bin = '';
        let newStr = '';
        for (let i = 0; i < str.length; i++) {
            let charCode = str.charCodeAt(i);
            charCode = charCode < 65 ? charCode - 24 : charCode - 65;
            charCode = ('0000' + charCode.toString(2)).slice(-5);
            bin += charCode;
        };
        for (let i = 0; i < bin.length; i += 4) {
            newStr += parseInt(bin.substring(i, i + 4), 2).toString(16);
        };
        return newStr;
    };

    const magnetIcon = (link) => {
        return `<img src="https://cdn.jsdelivr.net/gh/zxf10608/JavaScript/icon/magnet00.png" 
            class="mag1" href="${link}" 
            title="识别到磁力链接，左键打开或预览，右键复制\n${link}" 
            target="_blank" 
            style="z-index:9123456789;display:inline-block;cursor:pointer;margin:0px 5px 2px;border-radius:50%;border:0px;vertical-align:middle;outline:none!important;padding:0px!important;height:20px!important;width:20px!important;left:0px!important;top:0px!important;">`;
    };

	function AjaxCall(href){
		return new Promise(function(resolve, reject){
			GM_xmlhttpRequest({
				url: 'https://whatslink.info/api/v1/link?url='+href,
				method: "GET",
				headers: { 
					"Origin": "https://whatslink.info",
				},
				onload: function(data,status) {
					if(data.status==200){
						var htmlTxt = data.responseText;
						resolve(htmlTxt);
					};	
				},
				onerror: function(error) {
					reject(error);
				},
			});
		});
	};

    const magnetCall = (href) => {
        return new Promise((resolve, reject) => {
            const makeRequest = (attempt = 1) => {
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: href,
                    onload: (data) => {
                        if (data.readyState == 4 && data.status == 200) {
                            resolve(data.responseText);
                        } else if (attempt < 2) {
                            console.log(`第${attempt}次请求失败，2秒后重试...`);
                            setTimeout(() => makeRequest(attempt + 1), 2000);
                        } else {
                            reject(data.statusText || '请求失败');
                        }
                    },
                    onerror: (error) => {
                        if (attempt < 2) {
                            console.log(`第${attempt}次请求错误，2秒后重试...`);
                            setTimeout(() => makeRequest(attempt + 1), 2000);
                        } else {
                            reject(error);
                        }
                    }
                });
            };
            makeRequest();
        });
    };

    const magnetLinks = async (magnetEl) => {
        const num = Math.min(magnetEl.length, 20);
        const batchSize = 5;
		const delay = 3000;
        let successCount = 0;
        let failCount = 0;
		
		const totalBatches = Math.ceil(num / batchSize);
        console.log(`识别到${magnetEl.length}个网页链接，实际加载${num}个，将分${totalBatches}批处理，每批${batchSize}个，间隔${delay/1000}秒`);
        const processBatch = async (start, end) => {
            const batchPromises = [];
            for (let i = start; i < end; i++) {
                let link = magnetEl.eq(i).attr('href');
                if (/^(\.|\/)/.test(link)) {
                    link = location.origin + link.replace(/^\.?/g, '');
                };

                batchPromises.push(
                    magnetCall(link).then(htmlTxt => {
                        let newLink;
                        if (/www\.seedhub\.cc/.test(link)) {
                            const reg0 = /data = "([a-zA-Z0-9]+)"/;
                            if (reg0.test(htmlTxt)) {
                                newLink = atob(htmlTxt.match(reg0)[1]);
                            };
                        } else {
                            const reg1 = /(href|value|data|link|url)="(?:magnet:\?xt=urn:btih:)?([a-f0-9]{40})/i;
                            const reg2 = /<(?:kbd|b|p|span|div)[^>]*>(?:magnet:\?xt=urn:btih:)?([a-f0-9]{40})(<\/[^>]+>)?/i;
                            if (reg1.test(htmlTxt)) {
                                newLink = 'magnet:?xt=urn:btih:'+htmlTxt.match(reg1)[2];
                            } else if (reg2.test(htmlTxt)) {
                                newLink = 'magnet:?xt=urn:btih:'+htmlTxt.match(reg2)[1];
                            };
                        };

                        if (newLink) {
                            successCount++;
                            magnetEl.eq(i).prepend(magnetIcon(newLink));
                        } else {
                            failCount++;
                            console.log(`${link} 无磁力链接。`);
                        };
                    }).catch(error => { 
                        console.error(`请求处理失败: ${link}`, error);
                        failCount++;
                        return null; 
                    })
                );
            };
            
            try {
                await Promise.all(batchPromises.map(p => p.catch(e => {
                    console.error('批量处理中出现错误:', e);
                    return null; 
                })));
            } catch (batchError) {
                console.error('批量处理严重错误:', batchError);
            }
            
            console.log(`已处理第${Math.floor(start/batchSize)+1}批链接 (${start}-${end-1})，当前成功:${successCount}，失败:${failCount}`);
        };

        for (let i = 0; i < num; i += batchSize) {
            const end = Math.min(i + batchSize, num);
            try {
                await processBatch(i, end);
            } catch (e) {
                console.error('批次处理错误:', e);
            }
            if (end < num) {
                await new Promise(resolve => setTimeout(resolve, delay));
            };
        };
        console.log(`识别到${magnetEl.length}个网页链接，实际加载${num}个，其中有${successCount}个磁力链接加载成功，累计失败${failCount}次。`);
    };

    $(document).ready(async () => {
		const el=GM_getValue('magnet_open')?'a[href]':'a:not([href^="magnet:"])';
        $(el).each(function() {
            const link = $(this).attr('href') || '';
            const reg1 = /[\/\.\?\*\+\-=_:&#@!%]{1}([a-fA-F0-9]{40})(?!\w)/;
            const reg2 = /\/([a-zA-Z2-7]{32})$/;
            let hash;

            if (reg1.test(link)) {
                hash = link.match(reg1)[1];
            } else if (reg2.test(link)) {
                hash = base32To16(link.match(reg2)[1]);
            } else {
                return;
            };

            $(this).attr('target', '_blank');
            const newLink = `magnet:?xt=urn:btih:${hash}`;
            $(this).prepend(magnetIcon(newLink));
        });

        
        if ($('.mag1').length < 1 && document.title.match(/磁力宝|sobt/i) === null) {
            let magnetEl;
            if (window.location.href.indexOf('www.seedhub.cc') !== -1) {
                $('.pan-links a').each(function() {
                    const datalink = $(this).attr('data-link');
                    $(this).attr('href', datalink);
                });
                magnetEl = $('.seeds a');
            } else if(/yourbittorrent/.test(window.location.href)){
				magnetEl = $('td a[href^="/torrent"]');
			} else {
				magnetEl = $('td a,li a,dd a,h3 a').not('[href="/"],[href="#"],[href^="javascript"]');
			};
			magnetEl.attr({ 'target': '_blank', 'style': 'display:inline-block;' });
            await magnetLinks(magnetEl);
        } else {
            console.log(`磁力链接有${$('.mag1').length}个。`);
        };

        /* setTimeout(() => {
            if ($('.115offline').length > 0) {
                $('.mag1').remove();
            }
        }, 1100); */

        $('body').on('contextmenu click', '.mag1', function(e) {
            const link = $(this).attr('href');
			$(this).css('opacity','0.2');
            if (e.type === 'click') {
				
                const isPreviewOpen = GM_getValue('preview_open', 1) === 1;
				
				if (!isPreviewOpen) {
                    GM_openInTab(link, false);
				} else {
				const tip='网络错误或请求过于频繁，该磁力链接预览失败，请几分钟后再试！';
				AjaxCall(link).then(htmlTxt => {
					const obj = JSON.parse(htmlTxt);
					if (obj.error != "") {
						alert(obj.name);
						
						return;
					};

					if (!obj.screenshots) {
						alert("该磁力链接无预览图");
					} else {
						
						let gallery=[];
						$.each(obj.screenshots, function(i, data) {
							gallery.push({title:obj.name,src: data.screenshot});
						});
						Spotlight.show(gallery);
						
					};
				}).catch(() => alert(tip))
				};
            } else {
                GM_setClipboard(link);
                console.log(`磁力链接复制成功：\n${link}`);
            };
            return false;
        });
    });
})();