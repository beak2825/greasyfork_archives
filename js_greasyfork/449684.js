// ==UserScript==
// @name 删除高速下载器_BY江小白
// @description 全局删除高速下载器
// @version 2.2
// @author 江小白
// @match *://*/*
// @grant none
// @noframes
// @run-at document-body
// @namespace https://greasyfork.org/users/694396
// @downloadURL https://update.greasyfork.org/scripts/449684/%E5%88%A0%E9%99%A4%E9%AB%98%E9%80%9F%E4%B8%8B%E8%BD%BD%E5%99%A8_BY%E6%B1%9F%E5%B0%8F%E7%99%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/449684/%E5%88%A0%E9%99%A4%E9%AB%98%E9%80%9F%E4%B8%8B%E8%BD%BD%E5%99%A8_BY%E6%B1%9F%E5%B0%8F%E7%99%BD.meta.js
// ==/UserScript==


(function() {
	if (self != top) {
		return false;
	} else if (!(location.href.match(/^https?:\/\/(?:(?:[^\/]+?\.)?(?:greasyfork|youtube|youku|tudou|qq|mgtv|iqiyi|sohu|le|pptv|1905|wasu|bilibili|fun|ixigua|migu|douban|cupfox|bumimi|ak1080|jiaomh|yinyuetai|music\.163|kuwo|kugou|xiami|ximalaya|app-echo|sky31|1ting|9ku|lrts|miao101|douyin|kuaishou|555dy6|baidu|hao123|m1907|cnjsjf|wbdy|ikukk)\.|[^\/]+?\/(?:tv|acg|mov)\/|.+?(?:&autoplay=1&metareferer=|(?:\w+?_\w+?|search|jx|url|id|v|&[^\/]+?|\w+?\.html\?\w+?)[#=\?](?:https?:\/\/[^\/]+?\.(?:youku|mgtv|sohu|pptv|wasu|1905|iqiyi|le|qq|bilibili|acfun|fun|ixigua)\.|\d+?&type=(?:ximalaya|1ting))))/))) {
		if (document.title.match(/(?:下载|免费|破解|天堂|联盟|系统|技巧)/) != null) {
			if (!document.querySelector("\u9ad8\u901f\u4e0b\u8f7d\u5668")) {
				document.body.appendChild(document.createElement("\u9ad8\u901f\u4e0b\u8f7d\u5668"));
				document.querySelector("\u9ad8\u901f\u4e0b\u8f7d\u5668").remove();

				function sjqqxckdkobj() {
					if (!document.querySelector("\u9ad8\u901f\u4e0b\u8f7d\u5668")) {
						document.body.appendChild(document.createElement("\u9ad8\u901f\u4e0b\u8f7d\u5668"));
						document.querySelector("\u9ad8\u901f\u4e0b\u8f7d\u5668").remove();
						const observer = new MutationObserver(function() {
							const sjqqaljobj = sjqqgbdkfsobj();
							if (sjqqaljobj) {
								observer.disconnect()
							}
						});
						observer.observe(document.body, {
							childList: true,
							subtree: true
						});

						function sjqqgbdkfsobj() {
							try {
								const gsxdqa1 = document.querySelectorAll('a[href],a[style*="pointer"],ul>p,div[onclick*="slidingTop"][onclick*=","]');
								const gsxdqa2 = document.querySelectorAll('span:not([class="earlier"]):not([id="earlier"]),b,p,h1,h2,h3,h4,h5,h6,h7,h8,h9,div[class^="down_remove"],div[id^="down_remove"]');
								const gsxdqa3 = document.querySelectorAll('ul[bz_newtrack],ul[bz_track],ul[style^="margin-bottom"]>li[style*="pointer"][style*="background"][style*="/images/"],dl[data-trackingkey^="download_gs_"],a[clss^="gsxz"],a[id^="gsxz"],img[onmouseover][bz_newtrack*="_"],p[class="gs"],p[id="gs"],a[class^="gs"][itemprop*="own"],:not(a)>a[class*="own"][href^="javascript:"]:first-child+a[class*="own"][href^="javascript:"]:last-of-type,:not(a)>a[class*="own"][href^="javascript:"]:first-child+a[id*="own"][href^="javascript:"]:last-of-type,:not(a)>a[id*="own"][href^="javascript:"]:first-child+a[class*="own"][href^="javascript:"]:last-of-type,:not(a)>a[id*="own"][href^="javascript:"]:first-child+a[id*="own"][href^="javascript:"]:last-of-type,:not(a)~a[class*="own"][href^="javascript:"]:first-child+a[class*="own"][href^="javascript:"]:last-of-type,:not(a)~a[class*="own"][href^="javascript:"]:first-child+a[id*="own"][href^="javascript:"]:last-of-type,:not(a)~a[id*="own"][href^="javascript:"]:first-child+a[class*="own"][href^="javascript:"]:last-of-type,:not(a)~a[id*="own"][href^="javascript:"]:first-child+a[id*="own"][href^="javascript:"]:last-of-type');
								const gsxdqa4 = document.querySelectorAll('ul>li');
								const gsxdqa5 = document.querySelectorAll('ul>p');
								const gsxdqa6 = document.querySelectorAll('dt>a:first-child');
								const gsxdqa7 = document.querySelectorAll('span+a+span[class="earlier"],span+a+span[id="earlier"]');
								const gsxdqaabmd = /下[^载]*?载[^视频辅助工具插件]*?(?:视频|辅助|工具|插件)/gm;
								const gsxdqaa = /(?<!(?:360|网盘|猎鹰))(?:[高极][^速]*?速[^下]*?下[^载]*?载(?:[^器]*?器)?(?:[^\d]*?\d+?)?|[高极][^速]*?速[^下]*?下[^载]*?载(?:[^器]*?器)?(?:[^\d]*?\d+?)?\s*?$|需?(?:[^要]*?要)?(?:[^先]*?先)?[^下]*?下[^载]*?载[^高极]*?[高极][^速]*?速[^下]*?下[^载]*?载(?:[^器]*?器)?(?:[^\d]*?\d*)?)/gm;
								const gsxdqab = /(?:\/(?:(?:download\/(?:[%a-z]+?|[^\\u4e00-\\u9fa5][^\/]+?)[^\/]+?_\d{8,12}|[^\/]+?@[^\/]+?).exe)|softid=\d+?&[^\/]+?&checkStr=[^\/]+?=1\s*?$)/ig;
								const gsxdqac = /(?:down.*?gaosu|gaosu.*?down)/ig;
								const gsxdqad = /需(?:[^要优]*?要)?[^优]*?优[^先]*?先[^下]*?下[^载]*?载[^器]*?器/gm;
								for (let gsxdqa1i = 0; gsxdqa1i < gsxdqa1.length; gsxdqa1i++) {
									if (gsxdqa1[gsxdqa1i].innerText.match(gsxdqaa)) {
										gsxdqa1[gsxdqa1i].remove();
										console.log("%c[高速下载器按钮-a-01 已经删除] ✂", "border-left:5px solid #A0B;color:#A0B;padding:3px", gsxdqa1[gsxdqa1i])
									}
									const gsxdqa1msa = gsxdqa1[gsxdqa1i].querySelectorAll('*');
									for (let gsxdqa1ia = 0; gsxdqa1ia < gsxdqa1msa.length; gsxdqa1ia++) {
										if (gsxdqa1msa[gsxdqa1ia].innerText.match(gsxdqaa)) {
											gsxdqa1[gsxdqa1i].remove();
											console.log("%c[高速下载器按钮-a-02 已经删除] ✂", "border-left:5px solid #A0B;color:#A0B;padding:3px", gsxdqa1[gsxdqa1i])
										}
										if (gsxdqa1msa[gsxdqa1ia].innerText.match(/[,，]\s*?高[^速]*?速\s*?[,，]/gm)) {
											gsxdqa1[gsxdqa1i].remove();
											console.log("%c[高速下载器按钮-a-03 已经删除] ✂", "border-left:5px solid #A0B;color:#A0B;padding:3px", gsxdqa1[gsxdqa1i])
										}
									};
									const gsxdqa1msb = gsxdqa1[gsxdqa1i].getAttribute('href');
									if (gsxdqa1msb && gsxdqab.test(gsxdqa1msb)) {
										gsxdqa1[gsxdqa1i].remove();
										console.log("%c[高速下载器链接-a-01 已经删除] ✂", "border-left:5px solid #390;color:#390;padding:3px", gsxdqa1[gsxdqa1i]);
									}
									const gsxdqa1msc = gsxdqa1[gsxdqa1i].getAttribute('class');
									if (gsxdqa1msc && gsxdqac.test(gsxdqa1msc)) {
										gsxdqa1[gsxdqa1i].remove();
										console.log("%c[高速下载器链接-a-02 已经删除] ✂", "border-left:5px solid #390;color:#390;padding:3px", gsxdqa1[gsxdqa1i]);
									}
									const gsxdqa1mscc = gsxdqa1[gsxdqa1i].getAttribute('id');
									if (gsxdqa1mscc && gsxdqac.test(gsxdqa1mscc)) {
										gsxdqa1[gsxdqa1i].remove();
										console.log("%c[高速下载器链接-a-03 已经删除] ✂", "border-left:5px solid #390;color:#390;padding:3px", gsxdqa1[gsxdqa1i]);
									}
								};
								for (let gsxdqa2i = 0; gsxdqa2i < gsxdqa2.length; gsxdqa2i++) {
									if (!((gsxdqa2[gsxdqa2i].innerText.length >= 25) || (gsxdqa2[gsxdqa2i].innerText.match(gsxdqaabmd))) && (gsxdqa2[gsxdqa2i].innerText.match(gsxdqaa))) {
										gsxdqa2[gsxdqa2i].remove();
										console.log("%c[高速下载器标题-a-01 已经删除] ✂", "border-left:5px solid #A0B;color:#A0B;padding:3px", gsxdqa2[gsxdqa2i])
									}
								};
								for (let gsxdqa3i = 0; gsxdqa3i < gsxdqa3.length; gsxdqa3i++) {
									if (gsxdqa3[gsxdqa3i]) {
										gsxdqa3[gsxdqa3i].remove();
										console.log("%c[高速下载器图片-a-01 已经删除] ✂", "border-left:5px solid #A0B;color:#A0B;padding:3px", gsxdqa3[gsxdqa3i])
									}
								};
								for (let gsxdqa4i = 0; gsxdqa4i < gsxdqa4.length; gsxdqa4i++) {
									if (gsxdqa4[gsxdqa4i].innerHTML == "") {
										gsxdqa4[gsxdqa4i].remove();
										console.log("%c[高速下载器标题-b-01 已经删除] ✂", "border-left:5px solid #A0B;color:#A0B;padding:3px", gsxdqa4[gsxdqa4i]);
									}
									const gsxdqa4aa = gsxdqa4[gsxdqa4i].querySelectorAll('a');
									for (let gsxdqa4ia = 0; gsxdqa4ia < gsxdqa4aa.length; gsxdqa4ia++) {
										let gsxdqa4a = gsxdqa4aa[gsxdqa4ia];
										let sgsxdqa4a = gsxdqa4a.getAttribute('style');
										if (sgsxdqa4a && /cursor:\s*?pointer/ig.test(sgsxdqa4a)) {
											gsxdqa4[gsxdqa4i].remove();
											console.log("%c[高速下载器链接-c-01 已经删除] ✂", "border-left:5px solid #390;color:#390;padding:3px", gsxdqa4[gsxdqa4i]);
										}
									};
								};
								for (let gsxdqa5i = 0; gsxdqa5i < gsxdqa5.length; gsxdqa5i++) {
									if (gsxdqa5[gsxdqa5i].innerHTML.match(gsxdqad)) {
										gsxdqa5[gsxdqa5i].remove();
										console.log("%c[高速下载器标题-b-01 已经删除] ✂", "border-left:5px solid #A0B;color:#A0B;padding:3px", gsxdqa5[gsxdqa5i]);
									}
								};
								for (let gsxdqa6i = 0; gsxdqa6i < gsxdqa6.length; gsxdqa6i++) {
									const gsxdqa6aa = gsxdqa6[gsxdqa6i].querySelectorAll('img');
									for (let gsxdqa6ia = 0; gsxdqa6ia < gsxdqa6aa.length; gsxdqa6ia++) {
										let gsxdqa6a = gsxdqa6aa[gsxdqa6ia], sgsxdqa6a = gsxdqa6a.getAttribute('alt'), gsxdqa6ab = gsxdqa6a.getAttribute('title');
										if (((sgsxdqa6a || gsxdqa6ab) && /(?:XP|Win)/ig.test(sgsxdqa6a || gsxdqa6ab))) {
											gsxdqa6[gsxdqa6i].nextElementSibling.remove();
											console.log("%c[高速下载器按钮-b-01 已经删除] ✂", "border-left:5px solid #390;color:#390;padding:3px", gsxdqa6[gsxdqa6i]);
										}
									};
									for (let gsxdqa6ib = 0; gsxdqa6ib < !gsxdqa6aa.length; gsxdqa6ib++) {
										if (gsxdqa6[gsxdqa6i].nextElementSibling.innerText.match(gsxdqad)) {
											if (gsxdqa6[gsxdqa6i].innerText.match(/下[^载]*?载/gm)) {
												gsxdqa6[gsxdqa6i].nextElementSibling.remove();
												gsxdqa6[gsxdqa6i].remove();
												console.log("%c[高速下载器按钮-b-02 已经删除] ✂", "border-left:5px solid #390;color:#390;padding:3px", gsxdqa6[gsxdqa6i]);
											}
										}
									};
									for (let gsxdqa7i = 0; gsxdqa7i < gsxdqa7.length; gsxdqa7i++) {
										if (gsxdqa7[gsxdqa7i].innerText.match(gsxdqaa)) {
											gsxdqa7[gsxdqa7i].remove();
											console.log("%c[高速下载器标题-c-01 已经删除", "border-left:5px solid #A0B;color:#A0B;padding:3px", gsxdqa7[gsxdqa7i])
										}
									};
								};
							} catch (err) {}
						}
					}
				};
				sjqqxckdkobj();
				setTimeout(sjqqxckdkobj, 1234);
				setTimeout(sjqqxckdkobj, 2345);
				setTimeout(sjqqxckdkobj, 3456);
				setTimeout(sjqqxckdkobj, 4567);
				setTimeout(sjqqxckdkobj, 5678);
				setTimeout(sjqqxckdkobj, 6789);
			}
		} else {
			return false;
		}
	} else {
		return false;
	}
})();