// ==UserScript==
// @name        乾淨瀏覽外掛
// @namespace   killad.cumi.co
// @version     0.23
// @description 廣告程式、Tracker、惡意程序、釣魚網站、詐騙網站、假貨網站
// @author      HC
// @match       http://*/*
// @match       https://*/*
// @icon        https://killad.cumi.co/icon128.png
// @grant       unsafeWindow
// @run-at      document-start
// @grant       GM_addStyle
// @grant       GM_setValue
// @grant       window.close
// @grant       window.focus
// @license     MIT License
// @downloadURL https://update.greasyfork.org/scripts/453442/%E4%B9%BE%E6%B7%A8%E7%80%8F%E8%A6%BD%E5%A4%96%E6%8E%9B.user.js
// @updateURL https://update.greasyfork.org/scripts/453442/%E4%B9%BE%E6%B7%A8%E7%80%8F%E8%A6%BD%E5%A4%96%E6%8E%9B.meta.js
// ==/UserScript==
/* globals waitForKeyElements, enterSiteDisclamer */

'use strict';

const win = typeof unsafeWindow !== 'undefined' ? unsafeWindow : window;

const browser = {
    window: win,
    document: win.document,
    location: win.document.location,
    console: {},
    querySelector: win.document.querySelector.bind(win.document),
    querySelectorAll: win.document.querySelectorAll.bind(win.document),
    getAttribute: Function.prototype.call.bind(HTMLElement.prototype.getAttribute),
    setAttribute: Function.prototype.call.bind(HTMLElement.prototype.setAttribute),
    removeAttribute: Function.prototype.call.bind(HTMLElement.prototype.removeAttribute),
    defineProperty: Object.defineProperty,
    MutationObserver: win.MutationObserver
};

if(document.querySelector('meta[name="referrer"]')) {
    document.querySelector('meta[name="referrer"]').remove();
}

Object.keys(browser.window.console).forEach(name => {
    browser.console[name] = browser.window.console[name];
});

function killad_remove(element_string) {
    var divs = document.querySelectorAll(element_string), i;
    for (i = 0; i < divs.length; ++i) {
        divs[i].remove();
        browser.console.log("killad remove element", element_string);
    }
    //if(browser.document.querySelectorAll(element_string)) {
    //    browser.document.querySelectorAll(element_string).remove();
    //    browser.console.log("killad remove element", element_string);
    //}
}
function killad_replace(element_string, contant_string) {
    if(browser.document.querySelector(element_string)) {
        browser.document.querySelector(element_string).innerHTML = contant_string;
        browser.console.log("killad replace element", element_string);
    }
}
function killad_removeAttribute(element_string, attribte_string) {
    if(browser.document.querySelector(element_string)) {
        browser.document.querySelector(element_string).removeAttribute(attribte_string);
        browser.console.log("killad remove element attribute", element_string);
    }
}
function killad_click(element_string) {
    if(browser.document.querySelector(element_string)) {
        //跳過廣告
        browser.document.querySelector(element_string).click();
        browser.console.log("killad click element", element_string);
    }
}
function killad_popup_init(block_popup) {
    var b_opentype = "";
    const _prefs = { // Firefox issue
        'enabled': true,
        'shadow': false,
        'domain': false,
        'protocols': ['magnet:'],
        'popup-hosts': block_popup,
        'block-page-redirection': false
    };
	if (document.contentType === 'text/html') {
		const script = document.createElement('script');
		// record fake window's executed commands
		const records = {};
		const prefs = new Proxy(_prefs, {
			set(obj, key, value) {
				obj[key] = value;
				// allow the unprotected code to get relevant preferences
				if (key === 'enabled' || key === 'shadow') {
					script.dataset[key] = value;
				}
				return true;
			}
		});
		// make sure we have access to our preferences from the same origin iframes
		window.prefs = prefs;

		{
			let loaded = false;
			if (window.parent !== window) {
				// console.log(window.parent.prefs, self.parent.prefs, this.parent.prefs, parent.prefs);
				try {
					if (window.parent.prefs !== undefined) { // Firefox issue
						Object.assign(prefs, window.parent.prefs);
						loaded = true;
					}
				}
				catch (e) {}
			}
			if (loaded === false) {}
		}
		script.textContent = `{
			// definitions
			const script = document.currentScript;
			const blocker = {};
			// pointers
			const pointers = {
				'mpp': MouseEvent.prototype.preventDefault,
				'hac': HTMLAnchorElement.prototype.click,
				'had': HTMLAnchorElement.prototype.dispatchEvent,
				'hfs': HTMLFormElement.prototype.submit,
				'hfd': HTMLFormElement.prototype.dispatchEvent,
				'wop': window.open
			};
			// helper functions
			const policy = (type, element, event, extra = {}) => {
				if (event) {
					extra.defaultPrevented = event.defaultPrevented;
					extra.metaKey = event.metaKey;
					extra.button = event.button || 0;
					extra.isTrusted = event.isTrusted;
				}
				script.dispatchEvent(new CustomEvent('policy', {
					detail: Object.assign({
						type,
						href: element.action || element.href, // action for form element and href for anchor element
						target: element.target
					}, extra)
				}));
				return {
					id: script.getAttribute('eid'),
					block: script.getAttribute('block') === 'true'
				};
			};
			const watch = (parent, name, callback) => {
				let original = parent[name];
				Object.defineProperty(parent, name, {
					configurable: true,
					get() {
						callback();
						return original;
					},
					set(v) {
						original = v;
					}
				});
			};
			const simulate = (name, root, id) => new Proxy({}, { // window.location.replace
				get(obj, key) {
					return typeof root[key] === 'function' ? function(...args) {
						script.dispatchEvent(new CustomEvent('record', {
							detail: {
								id,
								name,
								method: root[key].name || key, // window.focus
								args
							}
						}));
					} : simulate(key, root[key], id);
				}
			});
			// popup blocker
			blocker.install = () => {
				document.addEventListener('click', blocker.overwrite.click, true); // with capture; see method 8
				window.open = blocker.overwrite.open;
				HTMLAnchorElement.prototype.click = blocker.overwrite.a.click;
				HTMLAnchorElement.prototype.dispatchEvent = blocker.overwrite.a.dispatchEvent;
				HTMLFormElement.prototype.submit = blocker.overwrite.form.submit;
				HTMLFormElement.prototype.dispatchEvent = blocker.overwrite.form.dispatchEvent;
			};
			blocker.remove = () => {
				document.removeEventListener('click', blocker.overwrite.click);
				window.open = pointers.wop;
				HTMLAnchorElement.prototype.click = pointers.hac;
				HTMLAnchorElement.prototype.dispatchEvent = pointers.had;
				HTMLFormElement.prototype.submit = pointers.hfs;
				HTMLFormElement.prototype.dispatchEvent = pointers.hfd;
			};
			blocker.overwrite = {};
			blocker.overwrite.click = e => {
				const a = e.target.closest('[target]') || e.target.closest('a');
				// if this is not a form or anchor element, ignore the click
				if (a && policy('element.click', a, e).block) {
					pointers.mpp.apply(e);
					return true;
				}
			};
			blocker.overwrite.a = {};
			blocker.overwrite.a.click = function(...args) {
				const {block} = policy('dynamic.a.click', this);
				if (!block) {
					pointers.hac.apply(this, args);
				}
			};
			blocker.overwrite.a.dispatchEvent = function(...args) {
				const e = args[0];
				let {block} = policy('dynamic.a.dispatch', this, e);
				return block ? false : pointers.had.apply(this, args);
			};
			blocker.overwrite.form = {};
			blocker.overwrite.form.submit = function(...args) {
				const {block} = policy('dynamic.form.submit', this);
				return block ? false : pointers.hfs.apply(this, args);
			};
			blocker.overwrite.form.dispatchEvent = function(...args) {
				const {block} = policy('dynamic.form.dispatch', this);
				return block ? false : pointers.hfd.apply(this, args);
			};
			blocker.overwrite.open = function(...args) {
				const {id, block} = policy('window.open', {
					href: args.length ? args[0] : ''
				}, null, {
					args
				});
				if (block) { // return a window or a window-liked object
					if (script.dataset.shadow === 'true') {
						const iframe = document.createElement('iframe');
						iframe.style.display = 'none';
						document.body.appendChild(iframe);
						return iframe.contentWindow;
					}
					else {
						return simulate('self', window, id);
					}
				}
				else {
					return pointers.wop.apply(window, args);
				}
			};
			// we always install our blocker
			blocker.install();
			// document.open can wipe all the listeners
			let documentElement = document.documentElement;
			watch(document, 'write', () => {
				if (documentElement !== document.documentElement) {
					documentElement = document.documentElement;
					if (script.dataset.enabled !== 'false') {
						blocker.install();
					}
				}
			});
			// configure
			new MutationObserver(() => blocker[script.dataset.enabled === 'false' ? 'remove' : 'install']()).observe(script, {
				attributes: true,
				attributeFilter: ['data-enabled']
			});
		}`;
		(document.head || document.documentElement).appendChild(script);
		script.remove();
		const blocker = {};
		blocker.policy = request => {
			const target = document.activeElement;
			const {type} = request;
			let href = request.href;
			let hostname = '';
			let block = true;
			let sameContext = false;
			if (type === 'element.click') {
				const a = 'closest' in target ? (target.closest('[target]') || target.closest('a')) : null;
				href = href || (a ? a.href || a.action : '');
				// we are blocking either if a is found or href is provided; see method 12/4
				block = Boolean(a) || href;
			}
			// always run window open on the same context
			if (type === 'window.open') {
				sameContext = true;
			}
			// block if
			if (request.metaKey && request.isTrusted === false) { // see method 12/5
				block = true;
			}
			if ('button' in request && request.button !== 0 && request.isTrusted === false) { // see method 12/2
				block = true;
			}
			// do not block if
			if (request.defaultPrevented || (request.metaKey && request.isTrusted)) {
				block = false;
			}
			// fixing
			if (true) {
				// fix relative href
				if (href && href.indexOf(':') === -1) {
					const a = document.createElement('a');
					a.setAttribute('href', href);
					href = a.href;
				}
				// create a unique id when "href" is not usable
				if (!href || href.startsWith('about:blank')) {
					target.dataset.ppbid = target.dataset.ppbid || Math.random();
				}
				if (href) {
					try {
						const loc = new URL(href);
						b_opentype = loc.href;
						// white-list matching
						block = false;
						if (killad_domain) {
							var pop_hosts = _prefs['popup-hosts'];
							if(pop_hosts){
								for (const h of pop_hosts) {
									if (killad_domain.match(h)) {
										block = true;
										break;
									}
								}
							}
                            //console.log("killad_domain", killad_domain);
                            //block = true;
						}
					} catch (e) {}
				}
			}
			const id = target.dataset.ppbid || Math.random();
			if(!href) {
				href = 'about:blank';
			}
			if(b_opentype != 'about:blank') {
				block = false;
			}
			//console.log(request);
			if(request.type == 'window.open' && request.href == "") {
				//開空白頁面
				block = true;
				href = 'about:blank';
				//chrome.runtime.sendMessage({opener: killad_domain, btype: 'popup_blank'}, null);
				//console.log(request.href);

			}
			return {
				id,
				href,
				hostname,
				sameContext,
				block
			};
		};
		// channel
		script.addEventListener('policy', e => {
			// make sure the request is from our script; see example 1
			if (e.target === script) {
				if (prefs.enabled) {
					const request = e.detail;
					const {block, id, href, hostname} = blocker.policy(request);
					script.setAttribute('eid', id);
					script.setAttribute('block', block);
				} else {
					script.setAttribute('block', false);
				}
			}
		});
	}
}

let killad_url = (new URL(browser.document.URL));
let killad_domain = killad_url.hostname;

let block_list = [
	/0bfn6.redirectvoluum.com/,
	/0oaqgsk54hm5.com/,
	/1.15lu.com/,
	/1.nanrenwo.net/,
	/1234.jjxgly.com/,
	/1234xm.com/,
	/123ad.com/,
	/123haose.com/,
	/123juzi.com/,
	/13023.url.7wkw.com/,
	/1360.cn/,
	/1360.com.cn/,
	/1755568.live173.com/,
	/17kxgame.com/,
	/1sat.itocd.net/,
	/1tyc1.com/,
	/1y888.cn/,
	/2013pan.cn/,
	/20786993p.rfihub.com/,
	/2bbb379103988619ef.com/,
	/3.iscrv.com/,
	/360-g.cn/,
	/360.cn/,
	/360adlab.cn/,
	/360anquantou.cn/,
	/360app.cn/,
	/360cc.cn/,
	/360cdn.cn/,
	/360cluster.cn/,
	/360facai.cn/,
	/360glb.cn/,
	/360gtm.cn/,
	/360h5plus.cn/,
	/360kan.com.cn/,
	/360qike.cn/,
	/360qike.com.cn/,
	/3679.bifa2003.com/,
	/3868.qg2626.com/,
	/3dns-3.adobe.com/,
	/4009997658.com/,
	/51huamoo.com/,
	/51zjkouqiang.com/,
	/520ccsex.com/,
	/522.com.cn/,
	/52sat.itocd.net/,
	/538porn.com/,
	/5nt1gx7o57.com/,
	/6.adsco.re/,
	/678tube.com/,
	/7.wzlim.com/,
	/72072vip.com/,
	/7kzwj.kangshouhuanbao.com/,
	/7vyou.oss-cn-shenzhen.aliyuncs.com/,
	/7xkfic.com2.z0.glb.qiniucdn.com/,
	/888.iwx88.com/,
	/8940.com/,
	/91.isafe.pro/,
	/91puma.x.yupoo.com/,
	/97papa.com/,
	/999.2shoushi.com/,
	/9k9by.com/,
	/9ksj.xyz/,
	/9vns8.com/,
	/a-cn.duoyi.com/,
	/a.adk2x.com/,
	/a.adtng.com/,
	/a.baidu.com/,
	/a.clickdata.37wan.com/,
	/a.cnzz.com/,
	/a.elodm.com/,
	/a.exosrv.com/,
	/a.ltdnc.com/,
	/a.lz13.cn/,
	/a.o333o.com/,
	/a.pub.network/,
	/a.realsrv.com/,
	/a.teads.tv/,
	/a.travel-assets.com/,
	/a.vfgtb.com/,
	/a1.peoplecdn.cn/,
	/a1click.cpc.sogou.com/,
	/a2.ym193.com/,
	/a5.codejumps.com/,
	/a5677cf.holoiv.com/,
	/a6.codejumps.com/,
	/a823.com/,
	/aa.agkn.com/,
	/aa.ayasafe.com/,
	/aa93599.com/,
	/aax-eu.amazon-adsystem.com/,
	/aax-fe-sin.amazon-adsystem.com/,
	/aax-fe.amazon-adsystem.com/,
	/aax-us-east.amazon-adsystem.com/,
	/aax.amazon-adsystem.com/,
	/ab094.com/,
	/ab141.com/,
	/abbyychina.com/,
	/abc.au345.com/,
	/abcu2lk.fun/,
	/abrts.pro/,
	/acadiannaturecruises.mobi/,
	/accede.site/,
	/access.gfpornmovies.com/,
	/access.watchmygirlfriend.tv/,
	/acdn.adnxs.com/,
	/achdebit.com/,
	/act.commercial.shouji.360.cn/,
	/activate-sea.adobe.com/,
	/activate-sjc0.adobe.com/,
	/activate.adobe.com/,
	/ad-a.juicyad.com/,
	/ad-apac.doubleclick.net/,
	/ad-formats.advertising.aol.com/,
	/ad-specs.guoshipartners.com/,
	/ad.adk2x.com/,
	/ad.adnxs.com/,
	/ad.adriver.ru/,
	/ad.adsniper.ru/,
	/ad.adsrvmedia.adk2x.com/,
	/ad.adstract.adk2x.com/,
	/ad.adultfriendfinder.com/,
	/ad.adx.adnxs.com/,
	/ad.aspm.jp/,
	/ad.birdmedia.com/,
	/ad.contentabc.com/,
	/ad.crwdcntrl.net/,
	/ad.dev.360.cn/,
	/ad.dmm.com/,
	/ad.doubleclick.net/,
	/ad.doublemax.net/,
	/ad.ero-advertising.com/,
	/ad.ettoday.net/,
	/ad.gamebox.360.cn/,
	/ad.jp.doubleclick.net/,
	/ad.player.baidu.com/,
	/ad.pornimg.xyz/,
	/ad.sitemaji.com/,
	/ad.turn.com/,
	/ad1.contentabc.com/,
	/ad18.biz/,
	/ad2.contentabc.com/,
	/ad3.contentabc.com/,
	/ad4.contentabc.com/,
	/ad5.contentabc.com/,
	/ad6.contentabc.com/,
	/ad7.contentabc.com/,
	/ad8.contentabc.com/,
	/ad9.contentabc.com/,
	/adcash.com/,
	/adcdn.goo.ne.jp/,
	/adclick.g.doublecklick.net/,
	/adclick.g.doubleclick.net/,
	/addthis.com/,
	/addthisedge.com/,
	/adexchangecloud.com/,
	/adgeo.163.com/,
	/adimg.daumcdn.net/,
	/adk2x.com/,
	/adm.10jqka.com.cn/,
	/adm.zookingsoft.com/,
	/admin.digicert.com/,
	/admin.exoclick.com/,
	/admin.panda.bns.17kxgame.com/,
	/adnxs.com/,
	/adobe-dns.adobe.com/,
	/adondemand.genieesspv.jp/,
	/adplexmedia.adk2x.com/,
	/adqy6rzwcs.com/,
	/adriver.ru/,
	/adrunnr.com/,
	/ads-a.juicyads.com/,
	/ads.adk2x.com/,
	/ads.adnxs.com/,
	/ads.adriver.ru/,
	/ads.adsniper.ru/,
	/ads.adsnxs.com/,
	/ads.adsymptotic.com/,
	/ads.adultfriendfinder.com/,
	/ads.adxadserv.com/,
	/ads.adxpansion.com/,
	/ads.avocet.io/,
	/ads.birdmedia.com/,
	/ads.bstlnk.com/,
	/ads.cdn.rovio.com/,
	/ads.ck101.com/,
	/ads.contentabc.com/,
	/ads.doublemax.net/,
	/ads.ero-advertising.com/,
	/ads.exdynsrv.com/,
	/ads.exoclick.com/,
	/ads.exosrv.com/,
	/ads.juicyads.com/,
	/ads.openx.net/,
	/ads.pro-market.net/,
	/ads.pubmatic.com/,
	/ads.scorecardresearch.com/,
	/ads.shorte.st/,
	/ads.sitemaji.com/,
	/ads.spacenine.biz/,
	/ads.stickyadstv.com/,
	/ads.trafficjunky.net/,
	/ads.yap.yahoo.com/,
	/ads.yieldmo.com/,
	/ads1.contentabc.com/,
	/ads2.contentabc.com/,
	/ads3.contentabc.com/,
	/ads4.contentabc.com/,
	/ads5.contentabc.com/,
	/ads6.contentabc.com/,
	/ads7.contentabc.com/,
	/ads8.contentabc.com/,
	/ads9.contentabc.com/,
	/adscdn.baidu.com/,
	/adsclick.qq.com/,
	/adsco.re/,
	/adserve.work/,
	/adserver.juicyads.com/,
	/adservice.google.com/,
	/adsexpert.net/,
	/adsfactor.net/,
	/adskeeper.co.uk/,
	/adsniper.ru/,
	/adspaces.ero-advertising.com/,
	/adsqqclick.qq.com/,
	/adsrvmedia.adk2x.com/,
	/adstract.adk2x.com/,
	/adsymptotic.com/,
	/adultfriendfinder.com/,
	/adv.ettoday.net/,
	/adverster.com/,
	/adx-static.ksosoft.com/,
	/adx.adk2x.com/,
	/adx.adnxs.com/,
	/adx.birdmedia.com/,
	/aecpm.alicdn.com/,
	/aeimqu.yhqjqc.cn/,
	/afd.baidu.com/,
	/affrh2015.com/,
	/affrh2022.com/,
	/afp.alicdn.com/,
	/afpmm.alicdn.com/,
	/ah1.ssammn.com/,
	/ah116.net/,
	/ah2.ssammn.com/,
	/ahacsweuthuh.l.adsco.re/,
	/aikanvod.miguvideo.com/,
	/ajkzd9h.com/,
	/ak.staticimgfarm.com/,
	/aka-cdn-ns.adtechus.com/,
	/aka-cdn.adtechus.com/,
	/alicdnv2.sitemonitor.cn.miaozhen.com/,
	/alimama.alicdn.com/,
	/als.baidu.com/,
	/amateurpayouts.com/,
	/analitits.com/,
	/analytics.ad.daum.net/,
	/analytics.hz.netease.com/,
	/analytics.shorte.st/,
	/anastasiadate.com/,
	/android.rqd.qq.com/,
	/anfeng.com/,
	/anpu119.com/,
	/anquan.baidu.com/,
	/antdmn.xyz/,
	/antivirus.baidu.com/,
	/anx.mywebsearch.com/,
	/anx.tb.ask.com/,
	/aoredi.com/,
	/ap.adriver.ru/,
	/ap.lijit.com/,
	/aphookkensidah.pro/,
	/api-iam.intercom.io/,
	/api.11h5.com/,
	/api.adk2x.com/,
	/api.adnxs.com/,
	/api.adriver.ru/,
	/api.adsniper.ru/,
	/api.adsrvmedia.adk2x.com/,
	/api.adstract.adk2x.com/,
	/api.adsymptotic.com/,
	/api.adultfriendfinder.com/,
	/api.adx.adnxs.com/,
	/api.anastasiadate.com/,
	/api.api68.com/,
	/api.atas.io/,
	/api.avocet.io/,
	/api.birdmedia.com/,
	/api.bshare.cn/,
	/api.cpu.baidu.com/,
	/api.dating.com/,
	/api.digicert.com/,
	/api.ero-advertising.com/,
	/api.exoclick.com/,
	/api.juicyads.com/,
	/api.mcwbiz.com/,
	/api.mini.wps.cn/,
	/api.mixpanel.com/,
	/api.popads.net/,
	/api.popcash.net/,
	/api.popin.cc/,
	/api.pubmatic.com/,
	/api.share.baidu.com/,
	/api.shuaji.360.cn/,
	/api.so.lianmeng.360.cn/,
	/api.trwl1.com/,
	/api.tuisong.baidu.com/,
	/api.youzu.com/,
	/.dating.com/,
	/.tuisong.baidu.com/,
	/apipool.youzu.com/,
	/apk.zsyj.com.cn/,
	/aplay.wan.panda.tv/,
	/app-measurement.com/,
	/app.cdn.youquqp.com/,
	/app.clickmobi.cn/,
	/app.perfectgirls.net/,
	/app.tanwan.com/,
	/appcdn.wapx.cn/,
	/appcdn.wapx.com/,
	/appgasstation.com/,
	/appshake.adspirit.de/,
	/aq44.com/,
	/art.theta.sogoucdn.com/,
	/as-sec.casalemedia.com/,
	/as.boc.cn/,
	/as.innity.com/,
	/asearch.alicdn.com/,
	/assets.258ydh.com/,
	/assets.adobedtm.com/,
	/assets.landerlabs.io/,
	/atanx.alicdn.com/,
	/atanx2.alicdn.com/,
	/atas.io/,
	/athena.wan.sogou.com/,
	/attenhance.com/,
	/authorne.info/,
	/avavwz.com/,
	/avd.innity.com/,
	/aw.dw.impact-ad.jp/,
	/ay227.com/,
	/b.atas.io/,
	/b.scorecardresearch.com/,
	/b.travel-assets.com/,
	/b2k3.com/,
	/b6522.com/,
	/b7969.net/,
	/b7av.com/,
	/baby.jiangongjixie.cn/,
	/babynameready.dl.tb.ask.com/,
	/badspads.com/,
	/baichuan.baidu.com/,
	/baidu.dsp.tansuotv.com/,
	/baidu.jz5u.net/,
	/baiduyubaidu.com/,
	/baigm.com/,
	/baijiahao.ledrgb.cn/,
	/bam.nr-data.net/,
	/banging.io/,
	/banner.adriver.ru/,
	/banners.adultfriendfinder.com/,
	/bar.baidu.com/,
	/bartender.cc/,
	/bb-503.com/,
	/bb.youzu.com/,
	/bb0018.com/,
	/bb1429.com/,
	/bb1acb0ea5ddb1fed8.com/,
	/bb55268.com/,
	/bbs.youzu.com/,
	/bbtt9.com/,
	/bcbm24.com/,
	/bcbm55555.com/,
	/bce.baidu.com/,
	/bcp.crwdcntrl.net/,
	/bcs.91.com/,
	/bdimg.share.baidu.com/,
	/bdjs.94hnr.com/,
	/bdplus.baidu.com/,
	/bdyingxiaocms.cdn.bcebos.com/,
	/beacon.krxd.net/,
	/best2017games.com/,
	/bet36500050.com/,
	/beta.adriver.ru/,
	/beta.atas.io/,
	/beta.mybestmv.com/,
	/beyondcompare.cc/,
	/bg339.com/,
	/bh.contextweb.com/,
	/bid.g.doubleclick.net/,
	/bidder.criteo.com/,
	/bigtree.online/,
	/bingdianhuanyuan.cn/,
	/birdmedia.com/,
	/bite.theta.sogoucdn.com/,
	/bitkong.com/,
	/bk.r-ad.ne.jp/,
	/blacraft.com/,
	/blog.digicert.com/,
	/blog.exoclick.com/,
	/blog.popads.net/,
	/blr1933.com/,
	/bngpt.com/,
	/bnr6txockztw.l.adsco.re/,
	/bo.adcash.com/,
	/bo.aizhigu8.com/,
	/bodelen.com/,
	/bogo777.com/,
	/boma686.com/,
	/bongacams.com/,
	/bos.pgzs.com/,
	/boudja.com/,
	/brazzerssurvey.com/,
	/brokenteens.com/,
	/browsers.support/,
	/bs.serving-sys.com/,
	/bskn.pro/,
	/bt49.com/,
	/btjhhb.com/,
	/bttrack.com/,
	/buyu0000.com/,
	/buyu011.com/,
	/buyu013.com/,
	/buyu1234.com/,
	/buyu2018.com/,
	/buyu8001.com/,
	/buyu901.com/,
	/buyu902.com/,
	/buyu903.com/,
	/buyu904.com/,
	/buyu905.com/,
	/buyu906.com/,
	/buyu907.com/,
	/buyu908.com/,
	/buyu9900.com/,
	/buyu9901.com/,
	/buyu9902.com/,
	/buyu9903.com/,
	/buyu9904.com/,
	/buyu9906.com/,
	/buyu9907.com/,
	/buyu9908.com/,
	/buyu9909.com/,
	/buyu9910.com/,
	/buyu9911.com/,
	/buyu9912.com/,
	/buyu9913.com/,
	/buyu9914.com/,
	/buyu9916.com/,
	/buyu9917.com/,
	/buyu9918.com/,
	/buyu9919.com/,
	/buyu9920.com/,
	/buyu9921.com/,
	/buyu9923.com/,
	/buyu9924.com/,
	/buyu9926.com/,
	/buyu9927.com/,
	/buyu9928.com/,
	/buyu9929.com/,
	/buyu9930.com/,
	/buyu9931.com/,
	/buyu9932.com/,
	/buyu9933.com/,
	/buyu9934.com/,
	/buyu9936.com/,
	/buyu9937.com/,
	/buyu9938.com/,
	/buyu9939.com/,
	/buyu9940.com/,
	/buyu9941.com/,
	/buyu9942.com/,
	/buyu9943.com/,
	/buyu9946.com/,
	/buyu9947.com/,
	/buyu9948.com/,
	/buyu9949.com/,
	/buyu9950.com/,
	/buyu9951.com/,
	/buyu9952.com/,
	/buyu9953.com/,
	/buyu9954.com/,
	/buyu9956.com/,
	/buyu9957.com/,
	/buyu9958.com/,
	/buyu9959.com/,
	/buyu9960.com/,
	/buyu9961.com/,
	/buyu9962.com/,
	/buyu9963.com/,
	/buyu9964.com/,
	/buyu9966.com/,
	/buyu9970.com/,
	/buyu9971.com/,
	/buyu9972.com/,
	/buyu9973.com/,
	/buyu9974.com/,
	/buyu9976.com/,
	/buyu9979.com/,
	/buyu9980.com/,
	/buyu9981.com/,
	/buyu9982.com/,
	/buyu9983.com/,
	/buyu9984.com/,
	/buyu9986.com/,
	/buyu9988.com/,
	/buyu9993.com/,
	/buyu9998.com/,
	/buyu9999.com/,
	/bwin2599.com/,
	/c.adsco.re/,
	/c.adsymptotic.com/,
	/c.amazon-adsystem.com/,
	/c.cnzz.com/,
	/c.codeonclick.com/,
	/c.cyto-biotherapy.com/,
	/c.d3iz9md.com/,
	/c.dfgyw.com/,
	/c.doublemax.net/,
	/c.gj.qq.com/,
	/c.go-mpulse.net/,
	/c.mgid.com/,
	/c.pc.qq.com/,
	/c.piclect.com/,
	/c.pub.network/,
	/c.rdldtrk.com/,
	/c.spnccrzone.com/,
	/c.statstat888.com/,
	/c.supert.ag/,
	/c.travel-assets.com/,
	/c.wuliu800.com.cn/,
	/c.youzu.com/,
	/c1.adform.net/,
	/c1.cdnjav.com/,
	/c1.popads.net/,
	/c16cp358.com/,
	/c2.popads.net/,
	/.statcounter.com/,
	/c41.clicki.cn/,
	/c77777777.com/,
	/ca.clcknads.pro/,
	/cacerts.digitalcertvalidation.com/,
	/cache.adm.cnzz.net/,
	/cache.cnzz.com/,
	/caesar.wan.panda.tv/,
	/cai35ppp.com/,
	/cai38bb.com/,
	/cai38c.com/,
	/calvappa.me/,
	/cams.com/,
	/caoshunv.com/,
	/cap.touclick.com/,
	/careers.exoclick.com/,
	/casterist.info/,
	/cb.baidu.com/,
	/cbjs.baidu.com/,
	/cc.adriver.ru/,
	/.www.duba.net/,
	/cdn-ads.oss-cn-shanghai.aliyuncs.com/,
	/cdn-gcs.outfit7.com/,
	/cdn-html.adsfactor.net/,
	/cdn-rtb.sape.ru/,
	/cdn-settings.segment.com/,
	/cdn.0i-i0.com/,
	/cdn.11h5.com/,
	/cdn.3b82.com/,
	/cdn.ad.xiaomi.com/,
	/cdn.ad4game.com/,
	/cdn.adc.eamobile.com/,
	/cdn.adinall.com/,
	/cdn.adnxs.com/,
	/cdn.adplxmd.com/,
	/cdn.adriver.ru/,
	/cdn.adrunnr.com/,
	/cdn.adsfactor.net/,
	/cdn.adstract.com/,
	/cdn.adsymptotic.com/,
	/cdn.aiclicash.com/,
	/cdn.analitits.com/,
	/cdn.app.liuxingyul.cn/,
	/cdn.at.atwola.com/,
	/cdn.atwola.com/,
	/cdn.bidvertiser.com/,
	/cdn.ckstatic.com/,
	/cdn.cmop.mgtv.com/,
	/cdn.districtm.io/,
	/cdn.doublemax.net/,
	/cdn.doublepimpads.com/,
	/cdn.dragonstatic.com/,
	/cdn.dsp.com/,
	/cdn.earnify.com/,
	/cdn.engine.spotscenered.info/,
	/cdn.extreme3d.games/,
	/cdn.fastclick.net/,
	/cdn.flurry.com/,
	/cdn.g.wan.douyu.com/,
	/cdn.hyperpromote.com/,
	/cdn.iclicash.com/,
	/cdn.img.liuxingyul.cn/,
	/cdn.innity.net/,
	/cdn.jesgoo.com/,
	/cdn.krxd.net/,
	/cdn.livechatinc.com/,
	/cdn.lu.sogoucdn.com/,
	/cdn.marketgid.com/,
	/cdn.media.innity.net/,
	/cdn.moogos.com/,
	/cdn.openxt.cn/,
	/cdn.optaim.com/,
	/cdn.outfit7.com/,
	/cdn.popcash.net/,
	/cdn.puata.info/,
	/cdn.rdrads.com/,
	/cdn.scdng.com/,
	/cdn.sp.rizhao9.com/,
	/cdn.spotscenered.info/,
	/cdn.stickyadstv.com/,
	/cdn.taboola.com/,
	/cdn.taboolasyndication.com/,
	/cdn.tanx.com/,
	/cdn.tianmidian.com/,
	/cdn.trafficbee.com/,
	/cdn.viglink.com/,
	/cdn.wwwpromoter.com/,
	/cdn.zampdsp.com/,
	/cdn0.mobmore.com/,
	/cdn1.lbesec.com/,
	/cdn1.res.nx5.com/,
	/cdn1.smartadserver.com/,
	/cdn1.srv.revdepo.com/,
	/cdn2.moji002.com/,
	/cdnas.hyperpromote.com/,
	/cdndgs.ruirobot.com/,
	/cdnimg.liehu.ijinshan.com/,
	/cdnis.hyperpromote.com/,
	/cdnpa.hyperpromote.com/,
	/cdntest.a8tiyu.com/,
	/ced.sascdn.com/,
	/certificates.godaddy.com/,
	/cf.cdn.inmobi.com/,
	/cgi.adriver.ru/,
	/ch2u.getnewsupdate.info/,
	/ch615.wx.11h5.com/,
	/chaopeng1.cn/,
	/chat.youzu.com/,
	/chat7.livechatvalue.com/,
	/chaturbate.com/,
	/chemdraw.com.cn/,
	/chinanews93.com/,
	/chinemiss.com/,
	/chntdnc.cn/,
	/chuantu.biz/,
	/chufengep.com/,
	/ck.jads.co/,
	/ckstatic.com/,
	/clc.chiuhua.com.cn/,
	/clc.wanmancn.com/,
	/clg.doublemax.net/,
	/click.admaster.com.cn/,
	/click.alibaba.com/,
	/click.atdmt.com/,
	/click.bes.baidu.com/,
	/click.cheshi.com/,
	/click.d2pass.com/,
	/click.dangdang.com/,
	/click.dtiserv2.com/,
	/click.gamersky.com/,
	/click.ganji.com/,
	/click.gridsumdissector.com/,
	/click.hm.baidu.com/,
	/click.jasmin.com/,
	/click.mediav.com/,
	/click.qianqian.com/,
	/click.rfp.fout.jp/,
	/click.sakuralive.com/,
	/click.stat.hao.360.cn/,
	/click.suning.cn/,
	/click.tanx.com/,
	/click.tianyaui.com/,
	/click.uve.mobile.sina.cn/,
	/click.wrating.com/,
	/click1forhz.adsmogo.com/,
	/click1n.soufun.com/,
	/click2forhz.adsmogo.com/,
	/click3forhz.adsmogo.com/,
	/clickadu.com/,
	/clickc.admaster.com.cn/,
	/clickjs.cnzz.com/,
	/clicklog.moviebox.baofeng.net/,
	/clickm.fang.com/,
	/clickmob.offerstrack.net/,
	/clickn.fang.com/,
	/clickserve.dartsearch.net/,
	/clksite.com/,
	/cloud.zyiis.net/,
	/cloudcdn.dopa.com/,
	/cloudcdn.dopa.com.cn/,
	/cloudcdn.yousee.com/,
	/cloudservice12.kingsoft-office-service.com/,
	/cloudservice13.kingsoft-office-service.com/,
	/cloudservice22.kingsoft-office-service.com/,
	/cloudservice27.kingsoft-office-service.com/,
	/cm.adskeeper.co.uk/,
	/cm.baichuan.baidu.com/,
	/cm.baidu.com/,
	/cm.g.doubleclick.net/,
	/cm.lianmeng.360.cn/,
	/cm.lndata.com/,
	/cm.mgid.com/,
	/cm.pos.baidu.com/,
	/cm.steepto.com/,
	/cms-bucket.ws.126.net/,
	/cms.analytics.yahoo.com/,
	/cn.adriver.ru/,
	/cnrdn.com/,
	/cnzz.mmstat.com/,
	/cobalten.com/,
	/code.fastclick.net/,
	/codejumps.com/,
	/coemergency.com.cn/,
	/coinhive.com/,
	/collector-282.tvsquared.com/,
	/collector.prod.expedia.com/,
	/commercial.shouji.360.cn/,
	/config.youzu.com/,
	/constintptr.com/,
	/content.adriver.ru/,
	/cookie.vrtzads.com/,
	/cool18.com/,
	/cootek-file.cdn.cootekservice.com/,
	/coreldrawchina.com/,
	/count.mail.163.com/,
	/count1.51yes.com/,
	/count10.51yes.com/,
	/count11.51yes.com/,
	/count12.51yes.com/,
	/count14.51yes.com/,
	/count15.51yes.com/,
	/count16.51yes.com/,
	/count17.51yes.com/,
	/count18.51yes.com/,
	/count19.51yes.com/,
	/count2.51yes.com/,
	/count20.51yes.com/,
	/count21.51yes.com/,
	/count22.51yes.com/,
	/count23.51yes.com/,
	/count24.51yes.com/,
	/count25.51yes.com/,
	/count26.51yes.com/,
	/count27.51yes.com/,
	/count28.51yes.com/,
	/count29.51yes.com/,
	/count3.51yes.com/,
	/count31.51yes.com/,
	/count32.51yes.com/,
	/count33.51yes.com/,
	/count34.51yes.com/,
	/count35.51yes.com/,
	/count36.51yes.com/,
	/count37.51yes.com/,
	/count38.51yes.com/,
	/count39.51yes.com/,
	/count4.51yes.com/,
	/count40.51yes.com/,
	/count42.51yes.com/,
	/count43.51yes.com/,
	/count44.51yes.com/,
	/count45.51yes.com/,
	/count46.51yes.com/,
	/count47.51yes.com/,
	/count48.51yes.com/,
	/count49.51yes.com/,
	/count5.51yes.com/,
	/count50.51yes.com/,
	/count51.51yes.com/,
	/count6.51yes.com/,
	/count7.51yes.com/,
	/count8.51yes.com/,
	/count9.51yes.com/,
	/counter.kingsoft.com/,
	/counter.ksosoft.com/,
	/cp.adform.net/,
	/cp.jfcdns.com/,
	/cp.xz6.com/,
	/cp10com.com/,
	/cpc.click.alimama.com/,
	/cpro.baidu.com/,
	/cpro.baidustatic.com/,
	/cpro2.baidustatic.com/,
	/cpu-admin.baidu.com/,
	/cpu.baidu.com/,
	/cqllgg.com/,
	/cr-p1.ladsp.com/,
	/crashes.mo.wps.cn/,
	/crashlytics.163.com/,
	/creative.strpjmp.com/,
	/crl3.digicert.com/,
	/crl4.digicert.com/,
	/croissed.info/,
	/crs.baidu.com/,
	/crt.comodoca.com/,
	/cs.adxpansion.com/,
	/cs.gssprt.jp/,
	/csktv98.com/,
	/ctrack.trafficjunky.net/,
	/ctwfan.cn/,
	/cw.addthis.com/,
	/cwcz58vbvwm0.n.adsco.re/,
	/cymzc.com/,
	/cytroncdn.videojj.com/,
	/d.agkn.com/,
	/d.fire2333.com/,
	/d.hgame.com/,
	/d.menwww.com/,
	/d.pub.network/,
	/d.youzu.com/,
	/d77777777.com/,
	/d8885.com/,
	/dable.io/,
	/dadbab.info/,
	/dagfs.com/,
	/dai18.mumu01.com/,
	/dai18.shangc.net/,
	/data-news.cdn.cootekservice.com/,
	/data-pic.cdn.cootekservice.com/,
	/data.fnexpress.cn/,
	/data2.xinba.com/,
	/datax.baidu.com/,
	/dcba.popcash.net/,
	/dd.ma/,
	/dd.panda.tv/,
	/de.exoclick.com/,
	/delivery.trafficforce.com/,
	/demo.stickyadstv.com/,
	/des.digicert.com/,
	/dev.atas.io/,
	/dev.digicert.com/,
	/dev.tg.wan.360.cn/,
	/dg9w4mgjy9ro.l.adsco.re/,
	/dh61677.com/,
	/dialer.cdn.cootekservice.com/,
	/digicert.com/,
	/dirty-tinder.com/,
	/display.360totalsecurity.com/,
	/disqus.com/,
	/dl-vip.bav.baidu.com/,
	/dl-vip.pcfaster.baidu.co.th/,
	/dl.2345.com/,
	/dl.360safe.com/,
	/dl.cm.ksmobile.com/,
	/dl.ijinshan.com/,
	/dl.liebao.cn/,
	/dl.ops.baidu.com/,
	/dl.wan.sogoucdn.com/,
	/dl2.bav.baidu.com/,
	/dm.shouwangba.cn/,
	/dmpclick.deliver.ifeng.com/,
	/doc.cnzz.com/,
	/dolohen.com/,
	/dood.watch/,
	/doubleclick.ctfile.com/,
	/doublemax.net/,
	/doublepimpads.com/,
	/doublex.net/,
	/down.360.cn/,
	/down.360safe.com/,
	/down.houxingfu.com/,
	/down.huyiju.com/,
	/down.rising.net.cn/,
	/down.sandai.net/,
	/down.zuoyexingchen.com/,
	/download.2345.com/,
	/download.88kwp.com/,
	/download.bav.baidu.com/,
	/download.rising.com.cn/,
	/download.sd.baidu.com/,
	/download.wan.sohu.com/,
	/download.youzu.com/,
	/dpm.demdex.net/,
	/dps.jp.cinarra.com/,
	/drivecdn.com/,
	/ds.waimaofuzhuang.cn/,
	/dsj66.cn/,
	/dsp-click.youdao.com/,
	/dtscout.rtb.adx1.com/,
	/dup.baidustatic.com/,
	/dw-collect.ksosoft.com/,
	/dw-online.ksosoft.com/,
	/dyn.wps.cn/,
	/dynsrv.wps.cn/,
	/e-boys-store.jp/,
	/e-p4p.163.com/,
	/e.917zf.com/,
	/e.dtscout.com/,
	/e.lndjj.com/,
	/e.tdtsd.com/,
	/e.tf.360.cn/,
	/easyrecoverychina.com/,
	/eatcells.com/,
	/eb2.3lift.com/,
	/eclick.120ask.com/,
	/eclick.360doc.com/,
	/eclick.baidu.com/,
	/edge.quantserve.com/,
	/edgecast-vod.yimg.com/,
	/ediuschina.com/,
	/edu.jujiaxiansheng.com/,
	/eecd179r3b.com/,
	/eee.dada8828.com/,
	/eee771.com/,
	/efeducation.d1.sc.omtrdc.net/,
	/ehousewife.net/,
	/ei.cnzz.com/,
	/eiv.baidu.com/,
	/ej2ugx2kar.eload.io/,
	/ejynyf.cn/,
	/elepocial.pro/,
	/emoneyspace.com/,
	/engine.adbooth.com/,
	/engine.phn.doublepimp.com/,
	/engine.spotscenered.info/,
	/enter.javhd.com/,
	/entry.baidu.com/,
	/epoch.com/,
	/ereg.adobe.com/,
	/ers.baidu.com/,
	/es.exoclick.com/,
	/etahub.com/,
	/euiofapbmmtw.l.adsco.re/,
	/eus.rubiconproject.com/,
	/event.ksosoft.com/,
	/eversely.com/,
    /ewp.live/,
	/exoclick.com/,
	/exoprsdds.com/,
	/exosrv.com/,
	/expedia.com.hk/,
	/f0.mtqys.com/,
	/f1.mtqys.com/,
	/f18.livechatvalue.com/,
	/f2.mtqys.com/,
	/f3.mtqys.com/,
	/f4.mtqys.com/,
	/f5.mtqys.com/,
	/f6.mtqys.com/,
	/f7.mtqys.com/,
	/f8.mtqys.com/,
	/f9.mtqys.com/,
	/f99.265958.com/,
	/fabrkrup.com/,
	/fanglei520.oicchina.com/,
	/fanqianbb.com/,
	/fans.91p20.space/,
	/fans.bestvogue.com/,
	/fapmeth.com/,
	/fastlane.rubiconproject.com/,
	/fastpopunder.com/,
	/fathed.pro/,
	/fclick.baidu.com/,
	/fcm.doublemax.net/,
	/feed.baidu.com/,
	/fembed.com/,
	/fengwanwl.com/,
	/fexclick.baidu.com/,
	/fh22.com/,
	/file.ppbk9.com/,
	/files.adform.net/,
	/files.adriver.ru/,
	/files.jb51.net/,
	/finalchace.com/,
	/fire2333.com/,
	/fiva.fingerjoys.com/,
	/fj.youzu.com/,
	/fkbwtoopwg.com/,
	/fkref.com/,
	/fls-na.amazon-adsystem.com/,
	/flstudiochina.com/,
	/focustimeshk.com/,
	/formats.yieldmo.com/,
	/forum.youzu.com/,
	/fp1.qdyinglida.com/,
	/fpbbdx1.51240.com/,
	/fr.exoclick.com/,
	/free-adult-games.com/,
	/free.babynameready.com/,
	/freegeoip.net/,
	/freestar-d.openx.net/,
	/freeteen.com/,
	/friendlyduck.com/,
	/frtyj.com/,
	/fsb-bearing.com/,
	/ftp.adexchangecloud.com/,
	/fvs.io/,
	/fzz.cloud.1234507.com/,
	/g.163.com/,
	/g.baidu.com/,
	/g.chaishiguan.com/,
	/g.newss.pw/,
	/g.sdk.look.360.cn/,
	/g.wan.2345.com/,
	/g.wan.douyu.com/,
	/g.wq96f9.com/,
	/g.yccdn.com/,
	/g1.163.com/,
	/g1.tagtic.cn/,
	/g2.gumgum.com/,
	/g2.symcb.com/,
	/gads.pubmatic.com/,
	/gafxa.code.mytanwan.com/,
	/galaxy.sogoucdn.com/,
	/game.fire2333.com/,
	/game.youzu.com/,
	/gb386.com/,
	/gbbsqc.com/,
	/gc.hgame.com/,
	/gcwdq.com/,
	/gd.xxtvphoto.com/,
	/gen.alicdn.com/,
	/genieedmp.com/,
	/geo.crtracklink.com/,
	/get-fuck-tonight-us4-foryou.dailynews.ovh/,
	/get.sessions.exchange/,
	/get35.com/,
	/getnewsupdate.info/,
	/gg.074tu.com/,
	/gg.463tu.com/,
	/gg333js.com/,
	/ggtzyma.com/,
	/ggxpj5.com/,
	/gif.lu.sogoucdn.com/,
	/gigaonclick.com/,
	/girlcc.cc/,
	/glc11.com/,
	/glean.pop6.com/,
	/glsnqx.babala365.cn/,
	/glunhb.txzj88.cn/,
	/glxccx.hztaida.cn/,
	/gm.mmstat.com/,
	/gm.symcd.com/,
	/gmanhua.com/,
	/go.adovr.com/,
	/go.gotourls.bid/,
	/go.mobtrks.com/,
	/go.nordvpn.net/,
	/go.oclasrv.com/,
	/go.onclasrv.com/,
	/go.padsdel.com/,
	/go.padstm.com/,
	/go.pushnative.com/,
	/go.strpjmp.com/,
	/go.wellhello.com/,
	/go2linkfast.com/,
	/gold.szonline.net/,
	/goldspring.net/,
	/googleads.g.doubleclick.net/,
	/gpk-client.com/,
	/graphics.pop6.com/,
	/gtssl-aia.geotrust.com/,
	/guangyukeji.com/,
	/guanjia.qq.com/,
	/guess.tf.360.cn/,
	/guitarpro.cc/,
	/guowaidiaocha.com/,
	/gzs20.cnzz.com/,
	/h1.kukuw.com/,
	/h1.xysibu.cn/,
	/h163e.com/,
	/h5.7vyou.com/,
	/h5.qbdgame.com/,
	/h5.youzu.com/,
	/h8vzwpv.com/,
	/h99998888.com/,
	/h99999999.com/,
	/haiwai-ic.ksosoft.com/,
	/haixiutv.com/,
	/hajoopteg.com/,
	/hao.6955000.com/,
	/hao.rising.cn/,
	/hauwzm.com/,
	/hd.youzu.com/,
	/hdj.baidu.com/,
	/healthbeautytrade.com/,
	/hechaocheng.cn/,
	/help.cnzz.com/,
	/help.exoclick.com/,
	/help.juicyads.com/,
	/hfcp10.com/,
	/hg417.bet/,
	/hg89038.com/,
	/hg89068.com/,
	/hg89078.com/,
	/hh55268.com/,
	/hicpm5.com/,
	/higheurest.com/,
	/histats.com/,
	/hjc1990.com/,
	/hk-cdn.effectivemeasure.net/,
	/hkcbeauty.com/,
	/hkdecoman.com/,
	/hm.baidu.com/,
	/hm2.cnzz.com/,
	/hm3.cnzz.com/,
	/hnj.m.xywxs.com/,
	/hntongwang.com/,
	/home-garden-wood.j8inn1zektoe.com/,
	/home.youzu.com/,
	/homeinformationpacks.j8inn1zektoe.com/,
	/homelessinmoscow.j8inn1zektoe.com/,
	/homepage.adnxs.com/,
	/homepage.j8inn1zektoe.com/,
	/homepage2.adnxs.com/,
	/homepage2.j8inn1zektoe.com/,
	/hoplink.ksosoft.com/,
	/hot.m.shouji.360tpcdn.com/,
	/houxingfu.com/,
	/hp.myway.com/,
	/hpd.baidu.com/,
	/hqs1.cnzz.com/,
	/hqs4.cnzz.com/,
	/hqs7.cnzz.com/,
	/hqs9.cnzz.com/,
	/http.52dsj.com/,
	/hub5btmain.sandai.net/,
	/hub5emu.sandai.net/,
	/huid.ad.360.cn/,
	/huishenghuiying.com.cn/,
	/huodong.mobilem.360.cn/,
	/hypersnap.mairuan.com/,
	/hzs10.cnzz.com/,
	/hzs12.cnzz.com/,
	/hzs13.cnzz.com/,
	/hzs14.cnzz.com/,
	/hzs17.cnzz.com/,
	/hzs2.cnzz.com/,
	/hzs23.cnzz.com/,
	/hzs3.cnzz.com/,
	/hzs360.com/,
	/hzs5.cnzz.com/,
	/hzs7.cnzz.com/,
	/hzs8.cnzz.com/,
	/hzs9.cnzz.com/,
	/hzvs1.cnzz.com/,
	/hzyxd.cn/,
	/i.bimbolive.com/,
	/i.bongacash.com/,
	/i.l.inmobicdn.net/,
	/i.mmcdn.cn/,
	/i.rdldtrk.com/,
	/i.tianqi.com/,
	/i.w55c.net/,
	/i32689.net/,
	/i360mall.cn/,
	/i360mall.com.cn/,
	/i4amb9u1wymi.l.adsco.re/,
	/ia.51.la/,
	/iad.g.163.com/,
	/ib.adnxs.com/,
	/ic.ksosoft.com/,
	/ic.wps.cn/,
	/icon.cnzz.com/,
	/iconworkshop.cn/,
	/idctj.cn/,
	/idm-su.baidu.com/,
	/idm.bce.baidu.com/,
	/idsync.rlcdn.com/,
	/ie8eamus.com/,
	/iiewl.com/,
	/ijinshan.com/,
	/il05pzhujicf.com/,
	/ili100.cn/,
	/image.37wan.cn/,
	/image.beike188.com/,
	/images.cdn.jsdsp.net/,
	/images.fastclick.net/,
	/imagetopng.club/,
	/img-cdn-spot.ymcdn.cn/,
	/img.wan.sogou.com/,
	/img1.mini.cache.wps.cn/,
	/imgcdn.wapx.cn/,
	/imglnka.com/,
	/imgs.jads.co/,
	/imindmap.cc/,
	/imlive.com/,
	/imp.openx.net/,
	/imyh.dns88888.com/,
	/in.treasuredata.com/,
	/index.0470key.com/,
	/inewcontentdelivery.info/,
	/info.wps.cn/,
	/ini.update.360safe.com/,
	/inrecsys.popin.cc/,
	/insight.adsrvr.org/,
	/inst.360safe.com/,
	/instantresp.com/,
	/inte.theta.sogoucdn.com/,
	/inter1ads.com/,
	/intf.cnzz.com/,
	/ioredi.com/,
	/ip.ws.126.net/,
	/ipw.metadsp.co.uk/,
	/ir.mail.163.com/,
	/irpmt.mail.163.com/,
	/irs01.com/,
	/isafe.pro/,
	/isite.baidu.com/,
	/it.exoclick.com/,
	/iupot.com/,
	/iwan.sogou.com/,
	/iz64.com/,
	/j.neemzksw.com/,
	/j.qiqivv.com/,
	/j.wan.liebao.cn/,
	/j77777777.com/,
	/j8inn1zektoe.com/,
	/j8ly.com/,
	/jasmin.com/,
	/jav23.com/,
	/javbox111.com/,
	/javbox666.com/,
	/javbox777.com/,
	/javbox888.com/,
	/javbusxx.com/,
	/javhd.com/,
	/jbb74.info/,
	/jf365.boc.cn/,
	/jf71qh5v14.com/,
	/jfjw4cxr.com/,
	/jifendownload.2345.cn/,
	/jihehuaban.com.cn/,
	/jin.7377727.com/,
	/jinchaoyu.com/,
	/jinshagt222.com/,
	/jinshi123.oss-cn-beijing.aliyuncs.com/,
	/jinyidianzi.com/,
	/jiongshiwu.com/,
	/jiujiuguiyi.she456.com/,
	/jj123.com.cn/,
	/jj9293.com/,
	/jklsylcn.com/,
	/jkstudy.cc/,
	/jlifm.org.cn/,
	/jobs.exoclick.com/,
	/join.javhd.com/,
	/jpg.inte.sogoucdn.com/,
	/js-agent.newrelic.com/,
	/js.adnxs.com/,
	/js.adriver.ru/,
	/js.adsrvr.org/,
	/js.braintreegateway.com/,
	/js.intercomcdn.com/,
	/js.jianbaimei.com/,
	/js.juicyads.com/,
	/js.lanmoes.com/,
	/js.pusher.com/,
	/js.start1999.com/,
	/js.tongji.linezing.com/,
	/js.ubaike.cn/,
	/js.users.51.la/,
	/js14345.com/,
	/js4163.yongkang6.com/,
	/js602322.com/,
	/js7xc.com/,
	/js883.guangzizai.com/,
	/jsc.adskeeper.co.uk/,
	/jsc.mgid.com/,
	/jserr.cnzz.com/,
	/jshbyn.com/,
	/jsmcrjmp.com/,
	/jssdk.cnzz.com/,
	/jsshen.com/,
	/juicyads.com/,
	/jump.baidu.001union.com/,
	/jump1.pszyzxh.org/,
	/juren0.com/,
	/jwcjge.cn/,
	/jwpltx.com/,
	/jx78.nblia.com/,
	/jxteerte.net/,
	/jy.fucfg.com/,
	/k.xmtsyg.com/,
	/k0398.com/,
	/karonty.com/,
	/kb.youzu.com/,
	/kb2323.com/,
	/kc75.com/,
	/keyshot.cc/,
	/king.youzu.com/,
	/kingdeecn.cn/,
	/kj.kai861.com/,
	/kkk556677.com/,
	/kqjtj.com/,
	/krxpzbb.cn/,
	/kstj.baidu.com/,
	/ku6.cnzz.com/,
	/kuaizq.com/,
	/kuaso.com/,
	/kwcdn.000dn.com/,
	/kwcscdn.000dn.com/,
	/kwflvcdn.000dn.com/,
	/ky.g66667777.com/,
	/l-ring.msedge.net/,
	/l.kkj578.fun/,
	/l.logly.co.jp/,
	/l55268.com/,
	/l77777777.com/,
	/landongs.posdone.com/,
	/lao.aizhigu8.com/,
	/lc090.com/,
	/ldpgl.code.mytanwan.com/,
	/ldrtrack.com/,
	/ldt2.8686c.com/,
	/lehaitv.com/,
	/lehu910.com/,
	/lelexing.cn/,
	/lgmkhkj.com/,
	/licertle.co/,
	/lie2anyone.com/,
	/liveinternet.ru/,
	/ll88y.com/,
	/lm.6hld.com/,
	/load77.exelator.com/,
	/loadm.exelator.com/,
	/log.mmstat.com/,
	/login.digicert.com./,
	/logoshejishi.com/,
	/lowtyroguer.com/,
	/lucklayed.info/,
	/lucky288.com/,
	/lulukan.qyhxhnt.com/,
	/luoshenbest.com/,
	/lup9.getnewsupdate.info/,
	/lutelu.com/,
	/lyf.com/,
	/lzcei.com/,
	/m.777lu.co/,
	/m.addthis.com/,
	/m.addthisedge.com/,
	/m.adnxs.com/,
	/m.adsymptotic.com/,
	/m.baidu.com.yiqisee.cn/,
	/m.baidu.com.zhiduo.org/,
	/m.edo5.com/,
	/m.fengwanwl.com/,
	/m.jasmin.com/,
	/m.menwww.com/,
	/m.wantmatures.com/,
	/m.ybstwl.com/,
	/m.youzu.com/,
	/m.yzjlsb.com/,
	/m1.daumcdn.net/,
	/m2.afast.ws/,
	/machieved.com/,
	/mads.amazon-adsystem.com/,
	/main.dynsrvazf.com/,
	/main.exdynsrv.com/,
	/main.exoclick.com/,
	/main.exosrv.com/,
	/mairuan.cn/,
	/mairuan.com/,
	/mairuan.com.cn/,
	/mairuan.net/,
	/mairuanwang.com/,
	/makeding.com/,
	/manage.juicyads.com/,
	/mapping.yoyi.com.cn/,
	/match.adsrvr.org/,
	/match.deepintent.com/,
	/mathtype.cn/,
	/matwbp.iask.sina.com.cn/,
	/maxonclick.com/,
	/mbpmfrx.com/,
	/mc.yandex.ru/,
	/mcleaner.cn/,
	/mcwbiz.com/,
	/me-cdn.effectivemeasure.net/,
	/media.adsymptotic.com/,
	/media.fastclick.net/,
	/media.innity.net/,
	/media.joinupads.com/,
	/media.trafficfactory.biz/,
	/mediad2.jp/,
	/mediakey1.ef.com/,
	/mediav.com.cn/,
	/mediaviva.com.cn/,
	/mellowads.com/,
	/members.amaland.com/,
	/members.dagfs.com/,
	/members.gf-members.com/,
	/members.popcash.net/,
	/memberscs.com/,
	/menwww.com/,
	/mfjegjqb.com/,
	/mg.popcash.net/,
	/mg4376.cc/,
	/mg58.com/,
	/mgid.com/,
	/miaobeichina.com/,
	/mibook-10006092.cos.myqcloud.com/,
	/midas.rong360.com/,
	/mindmanager.cc/,
	/ministedik.info/,
	/missweike58.com/,
	/missweike9988.com/,
	/mitaosp829.17arch.com/,
	/mm193.com/,
	/mmm266.com/,
	/mmm733.com/,
	/mmoframes.com/,
	/mo.res.wpscdn.cn/,
	/mob1.i0578cn.com/,
	/mob22.lymiao89.com/,
	/mobads-logs.baidu.com/,
	/mobads.baidu.com/,
	/mobap.njlbms.com/,
	/mobbahjug.com/,
	/mobile.2200120.com/,
	/mobile.adnxs.com/,
	/mobile.beike188.com/,
	/mobile.juicyads.com/,
	/mobile.onlyhookup.com/,
	/mobile.whitelabelpros.com/,
	/mobpushup.com/,
	/modulepush.com/,
	/moka.inte.sogoucdn.com/,
	/momode.net/,
	/mop1.pyzhtj.com/,
	/moradu.com/,
	/mostat.wps.cn/,
	/moupdate1.kingsoft-office-service.com/,
	/mp8883.com/,
	/mr.da.netease.com/,
	/ms.actingidekex.cn/,
	/ms994.com/,
	/msafe.cn/,
	/msecret.cn/,
	/msg.shouji.360.cn/,
	/msite.baidu.com/,
	/msoftdl.360.cn/,
	/mssp.baidu.com/,
	/mt.rtmark.net/,
	/muvflix.com/,
	/my.j8inn1zektoe.com/,
	/my.rtmark.net/,
	/myarab-me.j8inn1zektoe.com/,
	/mybestdc.com/,
	/mybestmv.com/,
	/mycleanmymac.com/,
	/mycomputermadesimple.j8inn1zektoe.com/,
	/mydrunkkitchen.j8inn1zektoe.com/,
	/myfrenchcountryhome.j8inn1zektoe.com/,
	/myhome.j8inn1zektoe.com/,
	/myknitting.j8inn1zektoe.com/,
	/mysayin.j8inn1zektoe.com/,
	/mysterium.j8inn1zektoe.com/,
	/myworldmadebyhand.j8inn1zektoe.com/,
	/mz30.cn/,
	/mzlyf.com/,
	/n.3g.163.com/,
	/n.adxxx.info/,
	/n2050.com/,
	/n5df.getnewsupdate.info/,
	/nb898.com/,
	/nba.emohe.com/,
	/nbsdk-baichuan.alicdn.com/,
	/ncno1.playno1.com/,
	/ncz.yeepay.com/,
	/new.adriver.ru/,
	/new.atas.io/,
	/new.cnzz.com/,
	/newdonate.com/,
	/news.xueyanshan.com/,
	/newsupdatedir.info/,
	/newton1.club/,
	/nex.163.com/,
	/nextlnk1.com/,
	/nextlnk6.com/,
	/nextlnk9.com/,
	/ninjagod.com/,
	/niusifan.com/,
	/nlog.baidu.com/,
	/node1.atas.io/,
	/nqf9.getnewsupdate.info/,
	/ns1.adriver.ru/,
	/ns1.atas.io/,
	/ns1.cnzz.com/,
	/ns1.exoclick.com/,
	/ns1.vkontakte.ru/,
	/ns2.cnzz.com/,
	/ns7.adk2x.com/,
	/ns8.adk2x.com/,
	/nsclick.baidu.com/,
	/nsclickvideo.baidu.com/,
	/nt.compass-fit.jp/,
	/ntfsformac.cn/,
	/nvkrm.imideals.com/,
	/nwww.gkxs.com/,
	/nz04com.com/,
	/nzfc.2zm4.cn/,
	/oawhaursaith.com/,
	/ocsp.entrust.net/,
	/odr.mookie1.com/,
	/ofeetles.pro/,
	/ohrgflbcm.qnssl.com/,
	/oia.zhihu.com/,
	/ok89okl.com/,
	/okay-dating.com/,
	/okaymobi.com/,
	/ol01l0.andad.work/,
	/olmsoneenh.info/,
	/omg.inte.sogoucdn.com/,
	/oms.expedia.com/,
	/onclkds.com/,
	/onclklnd.com/,
	/oneid.mmstat.com/,
	/onesignal.com/,
	/onetw.posdone.com/,
	/online.cnzz.com/,
	/online166.com/,
	/openbox.mobilem.360.cn/,
	/openrcv.baidu.com/,
	/openx.net/,
	/ops.zibov.com/,
	/optimize.innity.com/,
	/origin-ads.exdynsrv.com/,
	/origin-ads.exoclick.com/,
	/osfota.cdn.aliyun.com/,
	/ososoo.com/,
	/ouslayer.co/,
	/ox-d.justpremium.com/,
	/oztjye4lc.bkt.clouddn.com/,
	/p.adsymptotic.com/,
	/p.codejumps.com/,
	/p.kf3msfm.com/,
	/p.rfihub.com/,
	/p.s.360.cn/,
	/p0.tribution.mobi/,
	/p1.3b82.com/,
	/p1.tribution.mobi/,
	/p2.hyz86.com/,
	/p2.tribution.mobi/,
	/p215223.mycdn2.co/,
	/p232207.clksite.com/,
	/p232207.mybestmv.com/,
	/p2343.com/,
	/p236404.clksite.com/,
	/p3.tribution.mobi/,
	/p3og44hs7.bkt.clouddn.com/,
	/p3x223.86666608.com/,
	/p4.tribution.mobi/,
	/p5.tribution.mobi/,
	/p555.cc/,
	/p6.tribution.mobi/,
	/p7.tribution.mobi/,
	/p8.tribution.mobi/,
	/p9.tribution.mobi/,
	/p99998888.com/,
	/pagead46.l.doubleclick.net/,
	/paid.outbrain.com/,
	/panther.adform.net/,
	/papapa.tv/,
	/parallelsdesktop.cn/,
	/parronnotandone.info/,
	/partner.sitemaji.com/,
	/passport.youzu.com/,
	/pay.t7k.space/,
	/pay.tx1799.com/,
	/pay.youzu.com/,
	/paypalobjects.com/,
	/pb.adriver.ru/,
	/pbid.pro-market.net/,
	/pc.5151gj.com/,
	/pc.videoclick.baidu.com/,
	/pc.yingshi.tcclick.1kxun.mobi/,
	/pcookie.cnzz.com/,
	/pcookie.cnzz.net/,
	/pd.sharethis.com/,
	/pdown.stat.360safe.com/,
	/perfect-dating.com/,
	/perfectgirls.es/,
	/perfectgirls.net/,
	/perfektdamen.co/,
	/pg77oo.com/,
	/pgzs.com/,
	/phatassgfs.com/,
	/picgf.ppbk9.com/,
	/piclect.com/,
	/pinggai5.caixin.com/,
	/pix.tagcdn.com/,
	/pixel.advertising.com/,
	/pixel.quantserve.com/,
	/pj3456.com/,
	/pj38330.bet/,
	/pj39330.bet/,
	/pj39330.com/,
	/pj50.com/,
	/pj5189.com/,
	/pj550077.com/,
	/pj88.net/,
	/pkdu.com/,
	/pl.exoclick.com/,
	/pl108258.puserving.com/,
	/pl13041796.puserving.com/,
	/pl6452449.puserving.com/,
	/platform.adsymptotic.com/,
	/play.11h5.com/,
	/play.wan.panda.tv/,
	/plufdsb.com/,
	/plug.plufdsa.com/,
	/pm.w55c.net/,
	/pn36.cn/,
	/png.lu.sogoucdn.com/,
	/po.codejumps.com/,
	/polhu.dlwlw.com.cn/,
	/pop.bid/,
	/pop.code.mytanwan.com/,
	/pop.ero-advertising.com/,
	/popads.net/,
	/popcash.net/,
	/popcornvod.com/,
	/popearn.com/,
	/portal.adsfactor.net/,
	/pos.baidu.com/,
	/poweredby.jads.co/,
	/poweredbyliquidfire.mobi/,
	/pp5200.com/,
	/pp9899.com/,
	/pr.da.netease.com/,
	/profitbooster.ru/,
	/propeller-tracking.com/,
	/propellerad.adk2x.com/,
	/provincia.adnxs.com/,
	/proxy.drivecdn.com/,
	/prwidgets.com/,
	/prx.com/,
	/ps.eyeota.net/,
	/ps.popcash.net/,
	/psbxg.net/,
	/pt.clickdata.37wan.com/,
	/pt.ptawe.com/,
	/pt.trafficjunky.net/,
	/pt95793.com/,
	/pttsite.com/,
	/pubads.g.doubleclick.net/,
	/pubs2-asia.creativecdn.com/,
	/purchase.centrobill.com/,
	/push.ckck.fun/,
	/push.wps.cn/,
	/push.yuedu.163.com/,
	/push.zhanzhang.baidu.com/,
	/pushance.com/,
	/pushnice.com/,
	/pushwhy.com/,
	/pussl48.com/,
	/pvrtx.net/,
	/pw.cnzz.com/,
	/pxl.connexity.net/,
	/pxl.tsyndicate.com/,
	/pz0.3dn.mse.sogou.com/,
	/q1-tdsge.com/,
	/q1.cnzz.com/,
	/q12.cnzz.com/,
	/q14.cnzz.com/,
	/qbdgame.com/,
	/qczx1.com/,
	/qhm1.cnzz.com/,
	/qhm2.cnzz.com/,
	/qianclick.baidu.com/,
	/qianka.com/,
	/qianying208.com/,
	/qidu.cn/,
	/qihoo.cn/,
	/qihooyun.cn/,
	/qiyezs.ejunshi.com/,
	/qj.borsendental.com/,
	/qooww.com/,
	/qq88bet.net/,
	/quanjing.cnzz.com/,
	/qulishi.com/,
	/qwe77.com/,
	/qx9906.com/,
	/qy080.vip/,
	/r.mail.163.com/,
	/r.popin.cc/,
	/r.trwl1.com/,
	/r.wallstrads.com/,
	/r1.zemanta.com/,
	/r55268.com/,
	/radio.stickyadstv.com/,
	/rationalan.pro/,
	/rbxtrk.com/,
	/rcv.a-i-ad.com/,
	/rcv.ixd.dmm.com/,
	/rd.da.netease.com/,
	/rd.sitemaji.com/,
	/rd.wan.360.cn/,
	/rdldtrk.com/,
	/realasianexposed.com/,
	/reallatinaexposed.com/,
	/reallesbianexposed.com/,
	/reallygoodlink.extreme3d.games/,
	/rec.g.163.com/,
	/recommender.scarabresearch.com/,
	/redir.juicyads.com/,
	/redpaper-10006092.cos.myqcloud.com/,
	/rekovers.ru/,
	/release.baidu.com/,
	/repository.certum.pl/,
	/res.play700.com/,
	/ret.xinlongrubber.com/,
	/rh31.com/,
	/rigel.baidustatic.com/,
	/river.zhidao.baidu.com/,
	/rlog.popin.cc/,
	/rocktraff.com/,
	/rosemand.pro/,
	/rp.gwallet.com/,
	/rpc-php.trafficfactory.biz/,
	/rpxian.com/,
	/rr7576.com/,
	/rrcai.com/,
	/rsdownload.rising.com.cn/,
	/rt.gsspat.jp/,
	/rtb.gumgum.com/,
	/rules.quantcount.com/,
	/rum-collector-2.pingdom.net/,
	/rum-collector.pingdom.net/,
	/rum-static.pingdom.net/,
	/russianwomansite.com/,
	/rwq.youle55.com/,
	/rxrtb.bid/,
	/rydohimowa.info/,
	/s-img.adskeeper.co.uk/,
	/s.17173cdn.com/,
	/s.360.cn/,
	/s.amazon-adsystem.com/,
	/s.cdn.u17t.com/,
	/s.click.aliexpress.com/,
	/s.cpro.baidu.com/,
	/s.lianmeng.360.cn/,
	/s.mz30.cn/,
	/s.union.360.cn/,
	/s.zlhudong.com/,
	/s0.2mdn.net/,
	/s1-adfly.com/,
	/s1.adform.net/,
	/s1.cnzz.com/,
	/s1.kuaibaopay.com/,
	/s1.stat.lianmeng.360.cn/,
	/s1.szlu-an.com/,
	/s1.yzdh44.com/,
	/s10.addthis.com/,
	/s10.cnzz.com/,
	/s10.histats.com/,
	/s100.cnzz.com/,
	/s101.cnzz.com/,
	/s10158.com/,
	/s102.cnzz.com/,
	/s103.cnzz.com/,
	/s104.cnzz.com/,
	/s105.cnzz.com/,
	/s106.cnzz.com/,
	/s107.cnzz.com/,
	/s108.cnzz.com/,
	/s109.cnzz.com/,
	/s11.cnzz.com/,
	/s110.cnzz.com/,
	/s111.cnzz.com/,
	/s112.cnzz.com/,
	/s113.cnzz.com/,
	/s114.cnzz.com/,
	/s115.cnzz.com/,
	/s116.cnzz.com/,
	/s117.cnzz.com/,
	/s118.cnzz.com/,
	/s119.cnzz.com/,
	/s12.cnzz.com/,
	/s120.cnzz.com/,
	/s121.cnzz.com/,
	/s122.cnzz.com/,
	/s123.cnzz.com/,
	/s124.cnzz.com/,
	/s125.cnzz.com/,
	/s126.cnzz.com/,
	/s127.cnzz.com/,
	/s128.cnzz.com/,
	/s129.cnzz.com/,
	/s13.cnzz.com/,
	/s130.cnzz.com/,
	/s131.cnzz.com/,
	/s132.cnzz.com/,
	/s133.cnzz.com/,
	/s134.cnzz.com/,
	/s135.cnzz.com/,
	/s136.cnzz.com/,
	/s137.cnzz.com/,
	/s138.cnzz.com/,
	/s139.cnzz.com/,
	/s14.cnzz.com/,
	/s140.cnzz.com/,
	/s141.cnzz.com/,
	/s142.cnzz.com/,
	/s15.cnzz.com/,
	/s16.cnzz.com/,
	/s17.cnzz.com/,
	/s175.cnzz.com/,
	/s18.cnzz.com/,
	/s19.cnzz.com/,
	/s2.adform.net/,
	/s2.cnzz.com/,
	/s2.ykgqs.com/,
	/s20.cnzz.com/,
	/s20dh7e9dh.com/,
	/s21.cnzz.com/,
	/s22.cnzz.com/,
	/s23.cnzz.com/,
	/s24.cnzz.com/,
	/s25.cnzz.com/,
	/s26.cnzz.com/,
	/s27.cnzz.com/,
	/s28.cnzz.com/,
	/s29.cnzz.com/,
	/s3.addthis.com/,
	/s3.cnzz.com/,
	/s30.cnzz.com/,
	/s31.cnzz.com/,
	/s32.cnzz.com/,
	/s33.cnzz.com/,
	/s34.cnzz.com/,
	/s35.cnzz.com/,
	/s36.cnzz.com/,
	/s37.cnzz.com/,
	/s38.cnzz.com/,
	/s39.cnzz.com/,
	/s4.cnzz.com/,
	/s4.histats.com/,
	/s40.cnzz.com/,
	/s41.cnzz.com/,
	/s42.cnzz.com/,
	/s43.cnzz.com/,
	/s44.cnzz.com/,
	/s45.cnzz.com/,
	/s46.cnzz.com/,
	/s47.cnzz.com/,
	/s48.cnzz.com/,
	/s49.cnzz.com/,
	/s5.addthis.com/,
	/s5.cnzz.com/,
	/s50.cnzz.com/,
	/s51.cnzz.com/,
	/s52.cnzz.com/,
	/s53.cnzz.com/,
	/s54.cnzz.com/,
	/s55.cnzz.com/,
	/s56.cnzz.com/,
	/s57.cnzz.com/,
	/s58.cnzz.com/,
	/s59.cnzz.com/,
	/s6.cnzz.com/,
	/s60.cnzz.com/,
	/s61.cnzz.com/,
	/s62.cnzz.com/,
	/s63.cnzz.com/,
	/s64.cnzz.com/,
	/s65.cnzz.com/,
	/s66.cnzz.com/,
	/s67.cnzz.com/,
	/s68.cnzz.com/,
	/s69.cnzz.com/,
	/s7.addthis.com/,
	/s7.cnzz.com/,
	/s70.cnzz.com/,
	/s71.cnzz.com/,
	/s72.cnzz.com/,
	/s73.cnzz.com/,
	/s74.cnzz.com/,
	/s75.cnzz.com/,
	/s76.cnzz.com/,
	/s77.cnzz.com/,
	/s78.cnzz.com/,
	/s79.cnzz.com/,
	/s7969.net/,
	/s8.addthis.com/,
	/s8.cnzz.com/,
	/s80.cnzz.com/,
	/s81.cnzz.com/,
	/s82.cnzz.com/,
	/s83.cnzz.com/,
	/s84.cnzz.com/,
	/s85.cnzz.com/,
	/s86.cnzz.com/,
	/s87.cnzz.com/,
	/s88.cnzz.com/,
	/s89.cnzz.com/,
	/s9.addthis.com/,
	/s90.cnzz.com/,
	/s91.cnzz.com/,
	/s93.cnzz.com/,
	/s94.cnzz.com/,
	/s95.cnzz.com/,
	/s96.cnzz.com/,
	/s97.cnzz.com/,
	/s98.cnzz.com/,
	/s99.cnzz.com/,
	/sa.tuisong.baidu.com/,
	/sa0.tuisong.baidu.com/,
	/sa1.tuisong.baidu.com/,
	/sa3.tuisong.baidu.com/,
	/sa909.com/,
	/safeken.com/,
	/sale.aliexpress.com/,
	/saxn.sina.com.cn/,
	/saxp.zedo.com/,
	/sb.eubn7.com/,
	/sb.scorecardresearch.com/,
	/sc-static.net/,
	/scbl54virared.com/,
	/sccdn.50zera.com/,
	/sccdn.f2zd.com/,
	/scdown.qq.com/,
	/sclick.6rooms.com/,
	/sclick.baidu.com/,
	/script.crazyegg.com/,
	/sd.360.cn/,
	/sdk.cdnmaster.com/,
	/sdk.look.360.cn/,
	/sdk.talkingdata.com/,
	/sdkclick.mobile.sina.cn/,
	/secure-assets.rubiconproject.com/,
	/secure.adnxs.com/,
	/secure.asiansquirtingtramps.com/,
	/secure.bstlnk.com/,
	/secure.exoclick.com/,
	/secure.fastclick.net/,
	/secure.juicyads.com/,
	/secure.livechatinc.com/,
	/secure.nicemilfass.com/,
	/secure.quantserve.com/,
	/secure.statcounter.com/,
	/secure.sweetasianjuice.com/,
	/secure.vkontakte.ru/,
	/secureimage.securedataimages.com/,
	/securejoinsite.com/,
	/secureldrtrack.com/,
	/securepubads.g.doubleclick.net/,
	/seethisinaction.com/,
	/segpay.com/,
	/serve.popads.net/,
	/servedby.adsfactor.net/,
	/server.adform.net/,
	/server.mz30.cn/,
	/service.jiagu.360.cn/,
	/service.youzu.com/,
	/servicer.adskeeper.co.uk/,
	/servicer.mgid.com/,
	/servicer.traffic-media.co.uk/,
	/services.xg4ken.com/,
	/sesilgavignon.com/,
	/sestat.baidu.com/,
	/sex-and-flirt.com/,
	/sexy557.com/,
	/sezvc.com/,
	/sf.adsfactor.net/,
	/sg-cdn.effectivemeasure.net/,
	/sgvac.com/,
	/sh996.dftoutiao.com/,
	/sha150.com/,
	/sha2008.com/,
	/sha2013.com/,
	/sha2021.com/,
	/sha2024.com/,
	/sha50.com/,
	/shadu.baidu.com/,
	/shankejingling.com/,
	/share.baidu.com/,
	/share.sharegames.info/,
	/shijincx.cn/,
	/shop.spyoff.com/,
	/shop.youzu.com/,
	/shouji.360.cn/,
	/show-786.com/,
	/silerivetold.info/,
	/sistacked.com/,
	/site.cdnmaster.com/,
	/sitemaji.com/,
	/sitemnk.com/,
	/sites.exoclick.com/,
	/sluttube.net/,
	/smarterlifefinance.com/,
	/so.menwww.com/,
	/sobar.baidu.com/,
	/somennew.com/,
	/sp.analytics.yahoo.com/,
	/sp.popcash.net/,
	/spacenine.genieesspv.jp/,
	/spcdnpc.i-mobile.co.jp/,
	/spdtrk.com/,
	/speednetwork14.adk2x.com/,
	/spinfo.wps.cn/,
	/sports.youzu.com/,
	/spot-01.atas.io/,
	/spotscenered.info/,
	/spyoff.com/,
	/sqms.cn/,
	/squareup.com/,
	/sr.symcd.com/,
	/ss2.he2d.com/,
	/ss7778.com/,
	/ssl-cdn.media.innity.net/,
	/ssl.trustwave.com/,
	/ssl.xn--vqq79r59m.eu.org/,
	/ssp.adriver.ru/,
	/sstatic1.histats.com/,
	/ssum-sec.casalemedia.com/,
	/st.adnxs.com/,
	/st.adriver.ru/,
	/st.adxxx.info/,
	/st.adxxx.me/,
	/star.86uk.com/,
	/stat.lianmeng.360.cn/,
	/stat.tf.360.cn/,
	/stat.v.baidu.com/,
	/static-tagr.gd1.mookie1.com/,
	/static.addtoany.com/,
	/static.adriver.ru/,
	/static.adxadserv.com/,
	/static.brokenteens.com/,
	/static.criteo.net/,
	/static.doubleclick.net/,
	/static.flv.uuzuonline.com/,
	/static.hotjar.com/,
	/static.inter1ads.com/,
	/static.javhd.com/,
	/static.juicyads.com/,
	/static.plufdsb.com/,
	/static.popads.net/,
	/static.popcash.net/,
	/static.realasianexposed.com/,
	/static.realemoexposed.com/,
	/static.reallatinaexposed.com/,
	/static.reallesbianexposed.com/,
	/static.sitemaji.com/,
	/static.user-grey.com/,
	/static.uuzu.com/,
	/static.youzu.com/,
	/static1.bfdcdn.com/,
	/statis.push.netease.com/,
	/stats.g.doubleclick.net/,
	/stats.guess.tf.360.cn/,
	/stats.juicyads.com/,
	/stats3.unrulymedia.com/,
	/status.digicert.com/,
	/stickyadstv.com/,
	/stm-cdn.cn.miaozhen.com/,
	/storage.anastasiadate.com/,
	/store.atas.io/,
	/strip.alicdn.com/,
	/strip.taobaocdn.com/,
	/stuff.cdn.biddingx.com/,
	/stunninglover.com/,
	/sugar.zhihu.com/,
	/sun0062.com/,
	/support.adriver.ru/,
	/support.agobill.com/,
	/support.exoclick.com/,
	/support.stickyadstv.com/,
	/sv102.piclect.com/,
	/sw3sydl.duoyi.com/,
	/sy-cdnres.unionsy.com/,
	/sy.code.mytanwan.com/,
	/sy.flash.mytanwan.com/,
	/sycnzz.17tanwan.com/,
	/sync-tm.everesttech.net/,
	/sync.adaptv.advertising.com/,
	/sync.adk2x.com/,
	/sync.adsniper.ru/,
	/sync.adsrvmedia.adk2x.com/,
	/sync.adstract.adk2x.com/,
	/sync.adultfriendfinder.com/,
	/sync.adx.adnxs.com/,
	/sync.crwdcntrl.net/,
	/sync.ero-advertising.com/,
	/sync.fastclick.net/,
	/sync.logly.co.jp/,
	/sync.mathtag.com/,
	/sync.mookie1.cn/,
	/sync.shinobi.jp/,
	/sync.teads.tv/,
	/sync.tidaltv.com/,
	/sync.user-grey.com/,
	/sync3.adsniper.ru/,
	/syndication.adk2x.com/,
	/syndication.ero-advertising.com/,
	/syndication.exdynsrv.com/,
	/syndication.exoclick.com/,
	/syndication.exosrv.com/,
	/syndication.realsrv.com/,
	/szzero.livechatvalue.com/,
	/t.dtscdn.com/,
	/t.frtyh.com/,
	/t.frtyj.com/,
	/t.frtyk.com/,
	/t.frtyt.com/,
	/t.fv99.com/,
	/t.grtyi.com/,
	/t.hrtyc.com/,
	/t.irtya.com/,
	/t.irtye.com/,
	/t.ssp.hinet.net/,
	/t.teads.tv/,
	/t1.58cdn.com.cn/,
	/t1213.com/,
	/t1429.com/,
	/t2.58cdn.com.cn/,
	/t2.symcb.com/,
	/t3.58cdn.com.cn/,
	/t4.kugou.com/,
	/tag.cdnmaster.cn/,
	/tags.bluekai.com/,
	/tagserve.asia/,
	/tai.9998827.com/,
	/tai777777.com/,
	/tamgrt.com/,
	/tao.37wan.com/,
	/taobaobo5.com/,
	/tapestry.tapad.com/,
	/targeting.unrulymedia.com/,
	/tbk-app.com/,
	/tds-01.atas.io/,
	/tdsjsext.com/,
	/tdwv1.talkingdata.com/,
	/teinfo.wps.cn/,
	/telecianien.host/,
	/terraclicks.com/,
	/tf.360.cn/,
	/tg.game2.cn/,
	/tg.mhtg123.com/,
	/tg.pxhuiben.com/,
	/tg.yxdou.com/,
	/tharbadir.com/,
	/theta.sogoucdn.com/,
	/tickers.playtech.com/,
	/tm.ad-srv.net/,
	/toolbar.baidu.com/,
	/toolbar.soso.com/,
	/tools.bongacams.com/,
	/topbanger.com/,
	/toutoucao1.com/,
	/toutoucao7.com/,
	/toutoucao8.com/,
	/tp.domyjourney.cn/,
	/trace.ledu.com/,
	/track.absoluteclickscom.com/,
	/track.adform.net/,
	/track.adrunnr.com/,
	/track.afcpatrk.com/,
	/track.crumobiapps.com/,
	/track.iafov.com/,
	/track.magneticfriends.com/,
	/track.rqqft.com/,
	/track.sitemaji.com/,
	/track.trackclickers.com/,
	/track.wzpec.com/,
	/trackadsb1.com/,
	/tracker.bang.com/,
	/tracker.ero-advertising.com/,
	/tracking.prmtracking.com/,
	/tracking.v.tf.360.cn/,
	/trackingclick.net/,
	/traffic.fstsrv.com/,
	/traktrafficflow.com/,
	/trc.taboola.com/,
	/trk.obix.pro/,
	/trk.vnative.com/,
	/ts.youzu.com/,
	/tsyndicate.com/,
	/tt3.zedo.com/,
	/tt4647.com/,
	/tu.66vod.net/,
	/tu2.ttt669.com/,
	/tui1999.com/,
	/tuijian.baidu.com/,
	/tw-gmtdmp.mookie1.com/,
	/tw.mall.yahoo.com/,
	/twilightdata.com/,
	/twmall.sexyno1.com/,
	/two.stickyadstv.com/,
	/tx2play1.douyucdn.cn/,
	/tx2play2.douyucdn.cn/,
	/tyc0605.com/,
	/tyc9500.com/,
	/tzhjxf.com/,
	/tzjs.ksylx.com/,
	/u.openx.net/,
	/u.zhugeio888.com/,
	/ubmcmm.baidustatic.com/,
	/uciservice.com/,
	/uds24.com/,
	/ue.ueadlian.com/,
	/ue.yeyoucdn.com/,
	/um.simpli.fi/,
	/um0592.com/,
	/union.baidustatic.guannin.com/,
	/unionimage.baidu.com/,
	/unionsug.baidu.com/,
	/unitworld.net/,
	/unjs.jfcdns.com/,
	/uod2quk646.com/,
	/up.youzu.com/,
	/update.123juzi.net/,
	/update.360safe.com/,
	/update.pan.baidu.com/,
	/update.wps.cn/,
	/updates.guitar-pro.com/,
	/upgrade.xl9.xunlei.com/,
	/uri6.com/,
	/url.tudown.com/,
	/urlqh.cn/,
	/us-u.openx.net/,
	/us.adform.net/,
	/us1.xvika.com/,
	/usa.bravo-dog.com/,
	/uscxh.com/,
	/use.teutorigos-phi.com/,
	/use.typekit.net/,
	/user-actrk.com/,
	/usermatch.krxd.net/,
	/uthorner.info/,
	/utv56.com/,
	/uu169.org/,
	/uu375.com/,
	/uu593.com/,
	/uuopp.com/,
	/uux68.com/,
	/v.tf.360.cn/,
	/v00087.com/,
	/v1.cnzz.com/,
	/v10.cnzz.com/,
	/v11.cnzz.com/,
	/v12.cnzz.com/,
	/v13.cnzz.com/,
	/v14.cnzz.com/,
	/v2.cnzz.com/,
	/v2.zopim.com/,
	/v29.com/,
	/v3.cnzz.com/,
	/v3.fstats.xyz/,
	/v3m.youzu.com/,
	/v3rjvtt.com/,
	/v3zo.getnewsupdate.info/,
	/v4.cnzz.com/,
	/v5.cnzz.com/,
	/v55770.com/,
	/v5611.com/,
	/v6.cnzz.com/,
	/v66v66.com/,
	/v7.cnzz.com/,
	/v8.cnzz.com/,
	/v88.live800.com/,
	/v8816.com/,
	/v8940m.com/,
	/v9.cnzz.com/,
	/v918.com/,
	/v9181030.com/,
	/v9533.com/,
	/vd.7vid.net/,
	/vdax.uuzu.com/,
	/vdax.youzu.com/,
	/vebadu.com/,
	/vegaschina.cn/,
	/vendosupport.com/,
	/ver.touclick.com/,
	/vfzfi.redirectvoluum.com/,
	/vfzfi.voluumtrk.com/,
	/vhldwuv6om.com/,
	/video.youzu.com/,
	/videopush.baidu.com/,
	/vip.xiehuizhi.com/,
	/vip.youzu.com/,
	/vipactor.net/,
	/viralised.com/,
	/vk.com/,
	/vn543.com/,
	/vn702.com/,
	/vns01444.com/,
	/vns1.net/,
	/vns10555.com/,
	/vns4390.com/,
	/vns4391.com/,
	/vns4392.com/,
	/vns4393.com/,
	/vns4394.com/,
	/vns4395.com/,
	/vns4396.com/,
	/vns4397.com/,
	/vns4398.com/,
	/vns83n.com/,
	/vns8989.com/,
	/vns8d1.com/,
	/vns8ujm.com/,
	/vns8yhn.com/,
	/vnsrkhd.com/,
	/vo1r.getnewsupdate.info/,
	/vt.ipinyou.com/,
	/vz-cdn.contentabc.com/,
	/vz-cdn.trafficjunky.net/,
	/vzcmall.com/,
	/w.adsco.re/,
	/w.cnzz.com/,
	/w.gdown.baidu.com/,
	/w.x.baidu.com/,
	/w12.j8inn1zektoe.com/,
	/w2528.com/,
	/w5429.com/,
	/w5sac788c1.360doc.cn/,
	/wallpapergyd.j8inn1zektoe.com/,
	/wallpaperjunctiondownload.j8inn1zektoe.com/,
	/wan.2345.com/,
	/wan.adk2x.com/,
	/wan.douyu.com/,
	/wan.panda.tv/,
	/wan.rising.cn/,
	/wan.sogou.com/,
	/wan.youku.com/,
	/wangketuan.com/,
	/wangmeng.baidu.com/,
	/wap.j8inn1zektoe.com/,
	/wap.tanwan.com/,
	/wapscdn.wapx.cn/,
	/wapwbclick.mobile.sina.cn/,
	/washington.j8inn1zektoe.com/,
	/wastn.cn/,
	/watchingmoviesfree.j8inn1zektoe.com/,
	/watchkbsmbcsbs.j8inn1zektoe.com/,
	/watchmedaddy.j8inn1zektoe.com/,
	/watchmpacquiaovsjmmarquez3livestream.j8inn1zektoe.com/,
	/watchmygf.to/,
	/watchmygirlfriend.bestgfvideos.com/,
	/watchmygirlfriend.gfpornmovies.com/,
	/watchmygirlfriend.tv/,
	/watchnewmoviesonline.j8inn1zektoe.com/,
	/watchthecradle.j8inn1zektoe.com/,
	/wawafinanceessais.j8inn1zektoe.com/,
	/way2earner.j8inn1zektoe.com/,
	/wbclick.mobile.sina.cn/,
	/wc.wanmancn.com/,
	/wc5575.com/,
	/wct.link/,
	/wctrk.com/,
	/wds.inte.sogoucdn.com/,
	/wearethebest.j8inn1zektoe.com/,
	/web-nova.j8inn1zektoe.com/,
	/web.11h5.com/,
	/web.51.la/,
	/web.adriver.ru/,
	/web2magazine.j8inn1zektoe.com/,
	/webbilling.com/,
	/webdevelopmentcompany.j8inn1zektoe.com/,
	/webforbiz.j8inn1zektoe.com/,
	/webreporting.j8inn1zektoe.com/,
	/webtrends.yccdn.com/,
	/wedlock.j8inn1zektoe.com/,
	/wei.8586635.com/,
	/weiluyan.cn/,
	/weishi.baidu.com/,
	/weixin0452.com/,
	/welcome.j8inn1zektoe.com/,
	/wen.jshbyn.com/,
	/wendisbookcorner.j8inn1zektoe.com/,
	/whatsforsupper-juno.j8inn1zektoe.com/,
	/whatsonthebookshelf-jen.j8inn1zektoe.com/,
	/whirlwindofsurprises.j8inn1zektoe.com/,
	/whispers-shadow.j8inn1zektoe.com/,
	/whispersintheloggia.j8inn1zektoe.com/,
	/whos.amung.us/,
	/widget.intercom.io/,
	/widgets.amung.us/,
	/wife.goldspring.net/,
	/williamlanderson.j8inn1zektoe.com/,
	/willowing.j8inn1zektoe.com/,
	/windcdna.com/,
	/wisepush.video.baidu.com/,
	/wlad-el3am.j8inn1zektoe.com/,
	/wlaph4nlrn63.l.adsco.re/,
	/wlneteller.adsrv.eacdn.com/,
	/wmedia.adk2x.com/,
	/wn.pos.baidu.com/,
	/wnb-net.j8inn1zektoe.com/,
	/wo1818.cn/,
	/wondershake-jp.j8inn1zektoe.com/,
	/wooplr.j8inn1zektoe.com/,
	/workandincome.j8inn1zektoe.com/,
	/worldmustbecrazy.j8inn1zektoe.com/,
	/worldweirdcinema.j8inn1zektoe.com/,
	/worldwide-defence.j8inn1zektoe.com/,
	/wow-guide.j8inn1zektoe.com/,
	/wowgoldqqlove.j8inn1zektoe.com/,
	/wowlbjgold.j8inn1zektoe.com/,
	/wpc.32df9.rhocdn.net/,
	/wpte.j8inn1zektoe.com/,
	/wr.da.netease.com/,
	/ws.sj.qq.com/,
	/wss.cnzz.com/,
	/wuploadandfilesonic.j8inn1zektoe.com/,
	/wvw.a81444.com/,
	/ww.baike113.com/,
	/ww3.digicert.com/,
	/ww5.j8inn1zektoe.com/,
	/www-contractseries-com.filesusr.com/,
	/www.0059vip.com/,
	/www.00772229.com/,
	/www.0086555.com/,
	/www.0099xsj.com/,
	/www.00pan.com/,
	/www.01238448.com/,
	/www.018520.com/,
	/www.020buyu.com/,
	/www.0285.am/,
	/www.0360.cn/,
	/www.057555.com/,
	/www.060626.com/,
	/www.067555.com/,
	/www.108767.com/,
	/www.11111qu.com/,
	/www.11cbb.com/,
	/www.11keke.com/,
	/www.122re.com/,
	/www.123ad.com/,
	/www.123haose.com/,
	/www.125gan.com/,
	/www.142904.com/,
	/www.1495c8.com/,
	/www.1495d9.com/,
	/www.150170.com/,
	/www.150557f.com/,
	/www.163ren.com/,
	/www.170066.com/,
	/www.17388.com/,
	/www.17kxgame.com/,
	/www.1814445.com/,
	/www.18andabused.com/,
	/www.19116.com/,
	/www.1933000.com/,
	/www.19929.com/,
	/www.1y888.cn/,
	/www.20171117.com/,
	/www.203710.com/,
	/www.2093hd.com/,
	/www.21365k.com/,
	/www.21365l.com/,
	/www.21365u.com/,
	/www.22222jsc.com/,
	/www.22222ke.com/,
	/www.22222xu.com/,
	/www.2230666.com/,
	/www.22458.cc/,
	/www.231498.com/,
	/www.2345at.com/,
	/www.254254.com/,
	/www.2626ss.com/,
	/www.266qqq.com/,
	/www.2677dl.com/,
	/www.27123a.com/,
	/www.28228.cc/,
	/www.28830055.com/,
	/www.28831100.com/,
	/www.28831133.com/,
	/www.28837777.com/,
	/www.2883cc.com/,
	/www.2883pp.com/,
	/www.2883uu.com/,
	/www.28tts.com/,
	/www.292650.com/,
	/www.292750.com/,
	/www.299rrr.com/,
	/www.2b26.com/,
	/www.2bbb379103988619ef.com/,
	/www.30006w.com/,
	/www.30006y.com/,
	/www.30006z.com/,
	/www.30007q.com/,
	/www.3002666.com/,
	/www.30350f.com/,
	/www.3152018.com/,
	/www.31amjs.com/,
	/www.32666099.com/,
	/www.33033k.com/,
	/www.33309.com/,
	/www.3360.cn/,
	/www.360.cn/,
	/www.360app.cn/,
	/www.360cc.cn/,
	/www.360cdn.cn/,
	/www.360cluster.cn/,
	/www.360gtm.cn/,
	/www.3630116.com/,
	/www.365vip00.co/,
	/www.365vip00.com/,
	/www.365vip80.co/,
	/www.367788.com/,
	/www.3691129.com/,
	/www.377yyy.com/,
	/www.379707.com/,
	/www.37wan.com/,
	/www.38330.bet/,
	/www.3901555.com/,
	/www.39330.bet/,
	/www.394394.com/,
	/www.39amjs.com/,
	/www.400538.com/,
	/www.4009997658.com/,
	/www.4126222.com/,
	/www.4129e.com/,
	/www.417720.com/,
	/www.4242jj.com/,
	/www.4242lll.com/,
	/www.4242uuu.com/,
	/www.444hdc.com/,
	/www.44749.net/,
	/www.44y36.com/,
	/www.4630001.com/,
	/www.476601.com/,
	/www.492288.com/,
	/www.4937711.com/,
	/www.495495.com/,
	/www.4d1ee8e427cb5e1866.com/,
	/www.4wad.com/,
	/www.5000yyy.com/,
	/www.5017333.com/,
	/www.50508894.com/,
	/www.505352.com/,
	/www.509ee.com/,
	/www.511rrr.com/,
	/www.518374.com/,
	/www.51huamoo.com/,
	/www.522.com.cn/,
	/www.537901.com/,
	/www.538porn.com/,
	/www.551144.com/,
	/www.5547555.com/,
	/www.5555443.com/,
	/www.55555du.com/,
	/www.55555su.com/,
	/www.55555ta.com/,
	/www.55588a.com/,
	/www.555p555p.com/,
	/www.55749.net/,
	/www.55998448.com/,
	/www.56711.com/,
	/www.5758yy.com/,
	/www.57799p.com/,
	/www.592sao.com/,
	/www.5997276.com/,
	/www.59cn7.com/,
	/www.59ts.com/,
	/www.6160666.com/,
	/www.61677c.com/,
	/www.61677g.com/,
	/www.61677m.com/,
	/www.61677q.com/,
	/www.61677r.com/,
	/www.61677w.com/,
	/www.620035.com/,
	/www.6234777.com/,
	/www.640640.com/,
	/www.649558.com/,
	/www.649649.com/,
	/www.66316ff.com/,
	/www.6666349.com/,
	/www.66992949.com/,
	/www.66fu2d.com/,
	/www.678tube.com/,
	/www.68293.com/,
	/www.6979888.com/,
	/www.6c58.com/,
	/www.6dad.com/,
	/www.6kwan.com/,
	/www.700900.com/,
	/www.7054999.com/,
	/www.7089dd.com/,
	/www.7089gg.com/,
	/www.7147999.com/,
	/www.7355000.com/,
	/www.74123.com/,
	/www.744ggg.com/,
	/www.74955.net/,
	/www.749558.com/,
	/www.74966.net/,
	/www.74977.net/,
	/www.749808.com/,
	/www.74988.net/,
	/www.76181678.com/,
	/www.766mmm.com/,
	/www.76802.net/,
	/www.771457.com/,
	/www.771ka.com/,
	/www.7724.com/,
	/www.77304y.com/,
	/www.77545.com/,
	/www.7782000.com/,
	/www.7878bjl.com/,
	/www.7892205.com/,
	/www.7969sj.com/,
	/www.7a6421ee67fdb0f660.com/,
	/www.800086.com/,
	/www.800713.com/,
	/www.8024445.com/,
	/www.8052626.com/,
	/www.8052657.com/,
	/www.8054445.com/,
	/www.80585.com/,
	/www.808182c.com/,
	/www.811jjj.com/,
	/www.8184.cc/,
	/www.822jjj.com/,
	/www.849558.com/,
	/www.84te.com/,
	/www.850yl678.com/,
	/www.855fff.com/,
	/www.8711555.com/,
	/www.878090.com/,
	/www.8819ks.com/,
	/www.8841777.com/,
	/www.8842777.com/,
	/www.885420.com/,
	/www.8888en.com/,
	/www.888cam.com/,
	/www.88ffbb.com/,
	/www.88hg113.com/,
	/www.8940.com/,
	/www.895057.com/,
	/www.8a88028.com/,
	/www.8hg63.com/,
	/www.8zrnw.com/,
	/www.91.com/,
	/www.917zf.com/,
	/www.9225f.com/,
	/www.932001.com/,
	/www.93599669.com/,
	/www.937920.com/,
	/www.93996d.com/,
	/www.93996e.com/,
	/www.9522555.com/,
	/www.95599.cn/,
	/www.9565365.com/,
	/www.9579.com/,
	/www.9579hd.com/,
	/www.97papa.com/,
	/www.9941777.com/,
	/www.9942777.com/,
	/www.99469.com/,
	/www.9948000.com/,
	/www.9k9by.com/,
	/www.9tjoh.info/,
	/www.9vns8.com/,
	/www.a2.ym193.com/,
	/www.a823.com/,
	/www.aa93599.com/,
	/www.ab094.com/,
	/www.abbyychina.com/,
	/www.abcu2lk.fun/,
	/www.accede.site/,
	/www.achdebit.com/,
	/www.adcash.com/,
	/www.addthis.com/,
	/www.adexchangecloud.com/,
	/www.adk2x.com/,
	/www.adnxs.com/,
	/www.adriver.ru/,
	/www.adrunnr.com/,
	/www.adsco.re/,
	/www.adskeeper.co.uk/,
	/www.adsniper.ru/,
	/www.adspyglass.com/,
	/www.adsrvmedia.adk2x.com/,
	/www.adstract.adk2x.com/,
	/www.adsymptotic.com/,
	/www.adultblogtoplist.com/,
	/www.adultfriendfinder.com/,
	/www.adverster.com/,
	/www.adx.adnxs.com/,
	/www.alluc.ee/,
	/www.amateurpayouts.com/,
	/www.anastasiadate.com/,
	/www.anpu119.com/,
	/www.antdmn.xyz/,
	/www.aq44.com/,
	/www.avavwz.com/,
	/www.b7av.com/,
	/www.banging.io/,
	/www.bartender.cc/,
	/www.bb-503.com/,
	/www.bb1429.com/,
	/www.bcbm24.com/,
	/www.bcbm55555.com/,
	/www.bet36500050.com/,
	/www.beyondcompare.cc/,
	/www.bingdianhuanyuan.cn/,
	/www.birdmedia.com/,
	/www.blr1933.com/,
	/www.blueapron.com/,
	/www.bogo777.com/,
	/www.boma686.com/,
	/www.brokenteens.com/,
	/www.bt49.com/,
	/www.btjhhb.com/,
	/www.buyu013.com/,
	/www.buyu1234.com/,
	/www.buyu9999.com/,
	/www.bwin2599.com/,
	/www.c77777777.com/,
	/www.caoshunv.com/,
	/www.cdn.3b82.com/,
	/www.chemdraw.com.cn/,
	/www.chinanews93.com/,
	/www.chinemiss.com/,
	/www.chntdnc.cn/,
	/www.ckstatic.com/,
	/www.cnzz.com/,
	/www.comwgi.com/,
	/www.connyoume.com/,
	/www.cool18.com/,
	/www.coreldrawchina.com/,
	/www.cp10com.com/,
	/www.cpro.baidu.com/,
	/www.cqllgg.com/,
	/www.csktv98.com/,
	/www.d77777777.com/,
	/www.dagfs.com/,
	/www.dh61677.com/,
	/www.digicert.com/,
	/www.doublepimpads.com/,
	/www.dropped-click.com/,
	/www.dxlive.com/,
	/www.easyrecoverychina.com/,
	/www.ediuschina.com/,
	/www.eee771.com/,
	/www.ehousewife.net/,
	/www.ejynyf.cn/,
	/www.emoneyspace.com/,
	/www.epoch.com/,
	/www.exoclick.com/,
	/www.expedia.com.hk/,
	/www.extreme3d.games/,
	/www.fanqianbb.com/,
	/www.fastclick.com/,
	/www.fastclick.net/,
	/www.fengwanwl.com/,
	/www.fire2333.com/,
	/www.flstudiochina.com/,
	/www.focustimeshk.com/,
	/www.free-adult-games.com/,
	/www.free3dadultgames.com/,
	/www.freeteen.com/,
	/www.friendlyduck.com/,
	/www.fsb-bearing.com/,
	/www.gb544.com/,
	/www.gb734.com/,
	/www.gb824.com/,
	/www.gcwdq.com/,
	/www.get-a-fuck-tonight.com/,
	/www.gg333js.com/,
	/www.ggxpj5.com/,
	/www.goldspring.net/,
	/www.guangyukeji.com/,
	/www.guitarpro.cc/,
	/www.guowaidiaocha.com/,
	/www.h163e.com/,
	/www.h99998888.com/,
	/www.h99999999.com/,
	/www.haixiutv.com/,
	/www.hauwzm.com/,
	/www.hfcp10.com/,
	/www.hg417.bet/,
	/www.hg89038.com/,
	/www.hg89068.com/,
	/www.hg89078.com/,
	/www.hibids10.com/,
	/www.hicpm5.com/,
	/www.hkoxlirf.com/,
	/www.hldwmly.com/,
	/www.hntongwang.com/,
	/www.houxingfu.com/,
	/www.huishenghuiying.com.cn/,
	/www.hzs360.com/,
	/www.i32689.net/,
	/www.iconworkshop.cn/,
	/www.iiewl.com/,
	/www.ijinshan.com/,
	/www.ili100.cn/,
	/www.imglnka.com/,
	/www.imindmap.cc/,
	/www.j77777777.com/,
	/www.jav23.com/,
	/www.jdailymall.com/,
	/www.jerknsquirt.com/,
	/www.jfjw4cxr.com/,
	/www.jihehuaban.com.cn/,
	/www.jinshagt222.com/,
	/www.jinyidianzi.com/,
	/www.jj9293.com/,
	/www.js7xc.com/,
	/www.jsshen.com/,
	/www.juicyads.com/,
	/www.jxteerte.net/,
	/www.k0398.com/,
	/www.kb2323.com/,
	/www.kc75.com/,
	/www.keyshot.cc/,
	/www.kingdeecn.cn/,
	/www.kqjtj.com/,
	/www.kuaizq.com/,
	/www.kuaso.com/,
	/www.l77777777.com/,
	/www.lc090.com/,
	/www.ldrtrack.com/,
	/www.lehaitv.com/,
	/www.lehu910.com/,
	/www.linkev.com/,
	/www.liveinternet.ru/,
	/www.ll88y.com/,
	/www.logoshejishi.com/,
	/www.lucky288.com/,
	/www.luoshenbest.com/,
	/www.lutelu.com/,
	/www.lyf.com/,
	/www.lzcei.com/,
	/www.mairuan.com/,
	/www.mairuanwang.com/,
	/www.makeding.com/,
	/www.mathtype.cn/,
	/www.maxonclick.com/,
	/www.menwww.com/,
	/www.mfjegjqb.com/,
	/www.mg58.com/,
	/www.mgid.com/,
	/www.mindmanager.cc/,
	/www.miss0303.com/,
	/www.missweike58.com/,
	/www.missweike9988.com/,
	/www.mm193.com/,
	/www.mmm266.com/,
	/www.mmm733.com/,
	/www.modulepush.com/,
	/www.mp8883.com/,
	/www.mrskin.com/,
	/www.muvflix.com/,
	/www.mycleanmymac.com/,
	/www.mz30.cn/,
	/www.n2050.com/,
	/www.nb898.com/,
	/www.nextlnk1.com/,
	/www.nextlnk5.com/,
	/www.nextlnk6.com/,
	/www.nextlnk9.com/,
	/www.nmpcdn.com/,
	/www.ntfsformac.cc/,
	/www.ntfsformac.cn/,
	/www.nwww.gkxs.com/,
	/www.ob47.com/,
	/www.ok89okl.com/,
	/www.onclicksuper.com/,
	/www.onclicktop.com/,
	/www.online166.com/,
	/www.p1.3b82.com/,
	/www.p2343.com/,
	/www.papapa.tv/,
	/www.parallelsdesktop.cn/,
	/www.paypalobjects.com/,
	/www.pcstore.com.tw/,
	/www.pdfexpert.cc/,
	/www.perfect-dating.com/,
	/www.perfectgirls.es/,
	/www.perfectgirls.net/,
	/www.pgzs.com/,
	/www.pj38330.bet/,
	/www.pj39330.bet/,
	/www.pj39330.com/,
	/www.pj5189.com/,
	/www.pj88.net/,
	/www.plufdsb.com/,
	/www.pn36.cn/,
	/www.pop.bid/,
	/www.popads.net/,
	/www.popcash.net/,
	/www.popcornvod.com/,
	/www.poweredbyliquidfire.mobi/,
	/www.pp5200.com/,
	/www.pp9899.com/,
	/www.predictivdisplay.com/,
	/www.psbxg.net/,
	/www.pt95793.com/,
	/www.qbdgame.com/,
	/www.qczx1.com/,
	/www.qianka.com/,
	/www.qianying208.com/,
	/www.qiaopiguniang.com/,
	/www.qooww.com/,
	/www.qulishi.com/,
	/www.qx9906.com/,
	/www.r55268.com/,
	/www.realasianexposed.com/,
	/www.reallatinaexposed.com/,
	/www.reallesbianexposed.com/,
	/www.roblox.com/,
	/www.rpxian.com/,
	/www.rr7576.com/,
	/www.rrcai.com/,
	/www.russianwomansite.com/,
	/www.sa909.com/,
	/www.safeken.com/,
	/www.sailesi.cn/,
	/www.securegfm.com/,
	/www.sexy-more.com/,
	/www.sexy557.com/,
	/www.sezvc.com/,
	/www.sgvac.com/,
	/www.sha2008.com/,
	/www.sha2013.com/,
	/www.sha2021.com/,
	/www.sha2024.com/,
	/www.shankejingling.com/,
	/www.show-786.com/,
	/www.sitemaji.com/,
	/www.smarterlifefinance.com/,
	/www.smucdn.com/,
	/www.spdtrk.com/,
	/www.spyoff.com/,
	/www.ss7778.com/,
	/www.stickyadstv.com/,
	/www.sun0062.com/,
	/www.t1213.com/,
	/www.t1429.com/,
	/www.tagserve.asia/,
	/www.tamgrt.com/,
	/www.taobaobo5.com/,
	/www.tbk-app.com/,
	/www.tbvip19.com/,
	/www.touclick.com/,
	/www.toutoucao1.com/,
	/www.toutoucao7.com/,
	/www.toutoucao8.com/,
	/www.trackadsb1.com/,
	/www.trackingclick.net/,
	/www.tradeadexchange.com/,
	/www.trfmxt.com/,
	/www.tt4647.com/,
	/www.tui1999.com/,
	/www.tzhjxf.com/,
	/www.uciservice.com/,
	/www.um0592.com/,
	/www.unitworld.net/,
	/www.uscxh.com/,
	/www.uu375.com/,
	/www.uu593.com/,
	/www.uuopp.com/,
	/www.v29.com/,
	/www.v55770.com/,
	/www.v5611.com/,
	/www.v8816.com/,
	/www.v8940m.com/,
	/www.v8940s.com/,
	/www.vegaschina.cn/,
	/www.vipactor.net/,
	/www.vliao6.com/,
	/www.vn702.com/,
	/www.vns01444.com/,
	/www.vns1.net/,
	/www.vns10555.com/,
	/www.vns4390.com/,
	/www.vns4391.com/,
	/www.vns4392.com/,
	/www.vns4393.com/,
	/www.vns4394.com/,
	/www.vns4395.com/,
	/www.vns4396.com/,
	/www.vns4398.com/,
	/www.vns83n.com/,
	/www.vns8989.com/,
	/www.vns8d1.com/,
	/www.vns8ujm.com/,
	/www.vns8yhn.com/,
	/www.vnsrkhd.com/,
	/www.w5429.com/,
	/www.wangketuan.com/,
	/www.wc5575.com/,
	/www.webbilling.com/,
	/www.wo1818.cn/,
	/www.woaksp.com/,
	/www.wwe23.com/,
	/www.x33309.com/,
	/www.xh83333.com/,
	/www.xiaohui2.cn/,
	/www.xiaojinqipai.com/,
	/www.xingxd.com/,
	/www.xinhao29.com/,
	/www.xjyxgy.com/,
	/www.xmtrk.com/,
	/www.xpj23222.com/,
	/www.xpjylc9977.com/,
	/www.xshellcn.com/,
	/www.xszysc.com/,
	/www.y2608.com/,
	/www.yabovip2030.com/,
	/www.yb6.me/,
	/www.yimingkennel.com/,
	/www.yiren02.com/,
	/www.yjg2.com/,
	/www.ylwy168.com/,
	/www.yo234.com/,
	/www.youfa72.com/,
	/www.youzu.com/,
	/www.yueba423.com/,
	/www.yumi1.club/,
	/www.yzaosite.com/,
	/www.zhzzx.com/,
	/www.zr9996bet.com/,
	/www.zsoupu.net/,
	/www.zzdxaf.com/,
	/www.zzxbn.com/,
	/www1119.superembed.com/,
	/www138.superembed.com/,
	/www15t.j8inn1zektoe.com/,
	/www181.superembed.com/,
	/www19.superembed.com/,
	/www2a.j8inn1zektoe.com/,
	/www2b.j8inn1zektoe.com/,
	/www2s.j8inn1zektoe.com/,
	/www4b.j8inn1zektoe.com/,
	/www522.o0-2.com/,
	/www55.superembed.com/,
	/www5a.j8inn1zektoe.com/,
	/www5b.j8inn1zektoe.com/,
	/www5d.j8inn1zektoe.com/,
	/www5f.j8inn1zektoe.com/,
	/www63.superembed.com/,
	/www7b.j8inn1zektoe.com/,
	/www9.331tt.com/,
	/wwwelcallejon809com.j8inn1zektoe.com/,
	/wwwjakson-jakson.j8inn1zektoe.com/,
	/wz.37wan.com/,
	/x.bidswitch.net/,
	/x33309.com/,
	/x7xirtzmot.com/,
	/x9.shinobi.jp/,
	/xapi.birdmedia.com/,
	/xapi.juicyads.com/,
	/xawsce.com/,
	/xh83333.com/,
	/xia.coreldrawchina.com/,
	/xia.logoshejishi.com/,
	/xia.mindmanager.cc/,
	/xia.parallelsdesktop.cn/,
	/xiaojinqipai.com/,
	/xiazai.pdfexpert.cc/,
	/xin.9779929.com/,
	/xin888e.com/,
	/xingxd.com/,
	/xinhao29.com/,
	/xjyxgy.com/,
	/xkx-hf.hgame.com/,
	/xl-trk.com/,
	/xmh-resc.9icph.cn/,
	/xmindchina.cn/,
	/xmindchina.net/,
	/xml.admetix.com/,
	/xml.clickredirection.com/,
	/xml.explorads.com/,
	/xml.rxfclk3.com/,
	/xmysmy.cn/,
	/xne1ocient87zxz.360doc.cn/,
	/xpj0.net/,
	/xpj1.net/,
	/xpj10.net/,
	/xpj11.net/,
	/xpj12.net/,
	/xpj14.net/,
	/xpj16.net/,
	/xpj17.net/,
	/xpj18.net/,
	/xpj19.net/,
	/xpj2.net/,
	/xpj20.net/,
	/xpj22.net/,
	/xpj23.net/,
	/xpj23222.com/,
	/xpj28111.com/,
	/xpj3.net/,
	/xpj4.net/,
	/xpj5.net/,
	/xpj6.net/,
	/xpj7.net/,
	/xpj8.net/,
	/xpj8088.com/,
	/xpj9.net/,
	/xpjylc9977.com/,
	/xsa1.qwertdd.pw/,
	/xshellcn.com/,
	/xslt.alexa.com/,
	/xszysc.com/,
	/xxx7893.com/,
	/y2608.com/,
	/y9ji.getnewsupdate.info/,
	/yb6.me/,
	/yepdigital.adk2x.com/,
	/yezilm.com/,
	/yfyv.getnewsupdate.info/,
	/yieldmo.com/,
	/yihuifu.cn/,
	/yimingkennel.com/,
	/yingxiao.baidu.com/,
	/yiqisese.com/,
	/yiqishangmao.com/,
	/yiren02.com/,
	/ylwy168.com/,
	/ymetrica1.com/,
	/yo234.com/,
	/youfa72.com/,
	/youyiggg.com/,
	/youzu.com/,
	/ysb76.com/,
	/ysw.kffcww.com/,
	/yts.ytsyyey.com/,
	/yx.j1sz.com/,
	/yyy.pp1500.com/,
	/yzzp6uymvil4.l.adsco.re/,
	/z.dwchaha.com/,
	/z1.cnzz.com/,
	/z10.cnzz.com/,
	/z11.cnzz.com/,
	/z12.cnzz.com/,
	/z13.cnzz.com/,
	/z2.cnzz.com/,
	/z3.cnzz.com/,
	/z4.cnzz.com/,
	/z4yp9a.qygs08.cn/,
	/z5.cnzz.com/,
	/z6.cnzz.com/,
	/z7.cnzz.com/,
	/z8.cnzz.com/,
	/z8lhtkgsjatk.n.adsco.re/,
	/z9.cnzz.com/,
	/zb.hyzjd.com/,
	/zd.email.8avav.club/,
	/zd.en.8avav.club/,
	/zd.ex.ju.8avav.club/,
	/zh.chaturbate.com/,
	/zh.superchat.live/,
	/zhihu-web-analytics.zhihu.com/,
	/zhongzijidi.co/,
	/zi8ivy4b0c7l.com/,
	/zr9996bet.com/,
	/zs.91.com/,
	/zs1.cnzz.com/,
	/zs10.cnzz.com/,
	/zs11.cnzz.com/,
	/zs12.cnzz.com/,
	/zs13.cnzz.com/,
	/zs14.cnzz.com/,
	/zs15.cnzz.com/,
	/zs16.cnzz.com/,
	/zs2.cnzz.com/,
	/zs25.cnzz.com/,
	/zs3.cnzz.com/,
	/zs4.cnzz.com/,
	/zs5.cnzz.com/,
	/zs6.cnzz.com/,
	/zs7.cnzz.com/,
	/zs8.cnzz.com/,
	/zs9.cnzz.com/,
	/zsoupu.net/,
	/zsyj.com.cn/,
	/zvs1.cnzz.com/,
	/zvs2.cnzz.com/,
	/zxd.x9393.com/,
	/zz.isoo.cc/,
	/zz999350.com/,
	/zzcw.uuzham.com/,
	/zzxbn.com/
];

let block_url_tw = [
    /directcpmrev.com\/bdv_rd.dbm/i,
    /inaltariaon.com\/afu.php/i,
    /hung-ya.com\/page\/s_/i,
    /bbs-tw.com\/page\/s_/i,
    /fadama.com\/top\/h1.html/i,
    /link.twrank.com\/allsite.php/i
];

let block_domain_tw = [
    /13.232.147.230/,
    /13.232.218.21/,
    /43.205.254.157/i,
    /44.211.82.86/i,
    /101com.com/i,
    /101order.com/i,
    /123found.com/i,
    /1766hy.com/i,
    /180hits.de/i,
    /180searchassistant.com/i,
    /2050.one/i,
    /2022fifafootball.com/i,
    /2158novffp.com/i,
    /247media.com/i,
    /24log.com/i,
    /24log.de/i,
    /24pm-affiliation.com/i,
    /250.one/i,
    /26e33d5110.b91c577b4d.com/i,
    /29trafficbaike.top/i,
    /360yield.com/i,
    /39bastion.ru/i,
    /49n7wqynho5u.top/i,
    /4affiliate.net/i,
    /4d5.net/i,
    /50websads.com/i,
    /777mb.net/i,
    /7to11.club/i,
    /888pp.com.cn/i,
    /a333d.com.cn/i,
    /abttd1222.com/i,
    /acemlna.com/i,
    /activasoft.net/i,
    /adamporn.com/i,
    /adbison-redirect.com/i,
    /adp13a.com/i,
    /adpointrtb.com/i,
    /adpointbreakrtb.com/i,
    /advatravel.com/i,
    /advinci-redirect.com/i,
    /afcnuchxgo.com/i,
    /agacelebir.com/i,
    /alltopspot.com/i,
    /allnicespot.com/i,
    /animegamesus.com/i,
    /antivirushub.co/i,
    /anyputs.uno/i,
    /apostle.onl/i,
    /appropriate-money.com/i,
    /appzery.com/i,
    /asacdn.com/i,
    /assetknowledgeregret.com/i,
    /atwilling.top/i,
    /ausoafab.net/i,
    /a-ads.com/i,
    /back-easy.com/i,
    /back-soft.com/i,
    /besides.uno/i,
    /best4fuck.com/i,
    /betotodilea.com/i,
    /bg4nxu2u5t.com/i,
    /bilqi-omv.com/i,
    /blacknesskeepplan.com/i,
    /breedwaste.com/i,
    /broomacknowledgedpinch.com/i,
    /bulbsecure.com/i,
    /byambipoman.com/i,
    /bykeeps.casa/i,
    /capeantiquariandecision.com/i,
    /catchyourlife.com.tw/i,
    /camsstream.com/i,
    /celeb-secret-gossip.com/i,
    /chealseatv.xyz/i,
    /chingari.io/i,
    /chu-sing.com.tw/i,
    /claspedtwelve.com/i,
    /cognitionmesmerize.com/i,
    /coinsbit.io/i,
    /comedytab.com/i,
    /crankyyankeef1.com/i,
    /creative.xlivrdr.com/i,
    /dateluvalley.com/i,
    /dateafate.com/i,
    /dbdextension.com/i,
    /dex-trade.com/i,
    /digifinex.com/i,
    /dimradrest.live/i,
    /directcpmrev.com/i,
    /disregardbuymigrant.com/i,
    /doruffletr.com/i,
    /doownl0ad3s.com/i,
    /doubleadserve.com/i,
    /drivegoals-1.net/i,
    /drycustomer.com/i,
    /dwightadjoining.com/i,
    /e335udnv6drg78b7.com/i,
    /effectivecpmcontent.com/i,
    /ero-labs.com/i,
    /eo.finance/i,
    /eussianeduke.xyz/i,
    /eventsbands.com/i,
    /ewoverth.buzz/i,
    /explorads.com/i,
    /expmdiadi.com/i,
    /ezyenrwcmo.com/i,
    /fastdevicepopularboost.rest/i,
    /fastdmr.com/i,
    /feedfinder.info/i,
    /feida36588.com/i,
    /festivalexcitinghypocrisy.com/i,
    /financeritual.com/i,
    /findinganewway.com/i,
    /fleshwax.icu/i,
    /haglance.com/i,
    /hauchiwu.com/i,
    /hawkyeye5ssnd.com/i,
    /haxbyq.com/i,
    /hetarust.com/i,
    /hentaiheroes.com/i,
    /hetaruwg.com/i,
    /hetapus.com/i,
    /hg9999aa.com/i,
    /highperformancecpmgate.com/i,
    /hoin8.com/i,
    /hoisquit.buzz/i,
    /h-steak.com.tw/i,
    /g2afse.com/i,
    /gaspbandy.com/i,
    /generousmanagement.pro/i,
    /getherefwu.xyz/i,
    /getsmartyapp.com/i,
    /getthisappnow.com/i,
    /get-file-download.com/i,
    /gipostart-1.co/i,
    /goads.pro/i,
    /gokaans.com/i,
    /goodtripguide.com/i,
    /goshome.email/i,
    /go-mpulse.net/i,
    /glugherg.net/i,
    /granorizes.com/i,
    /grandsonreverendlawn.com/i,
    /grumblecrytopless.com/i,
    /grunoaph.net/i,
    /ifknittedhurtful.com/i,
    /improvesufficientlyfurther.com/i,
    /inaltariaon.com/i,
    /infinox.com/i,
    /initiallycoffee.com/i,
    /inrhyhorntor.com/i,
    /insistinestimable.com/i,
    /integrityprinciplesthorough.com/i,
    /interstitial-07.com/i,
    /intorterraon.com/i,
    /invaderannihilationperky.com/i,
    /irrelevantassassinclaim.com/i,
    /islam-tula.ru/i,
    /iqbroker.com/i,
    /itskiddien.club/i,
    /izxiarb.xyz/i,
    /jaavnacsdw.com/i,
    /jewelbeeperinflection.com/i,
    /jillbuildertuck.com/i,
    /ji-soft.com/i,
    /johren.games/i,
    /keepvid.works/i,
    /klkus.xyz/i,
    /krjxhvyyzp.com/i,
    /landscape-theme.com/i,
    /legacylangley.com/i,
    /lephaush.net/i,
    /lightssyrupdecree.com/i,
    /literalcorpulent.com/i,
    /lncredibledate.com/i,
    /lnk8j7.com/i,
    /lounasravintolaeverest.fi/i,
    /lowhardboiledadjoin.com/i,
    /lucidlydiscretion.com/i,
    /majorityevaluatewiped.com/i,
    /makesboundlessvirtue.com/i,
    /mapdays.uno/i,
    /mathcountryside.com/i,
    /mc7clurd09pla4nrtat7ion.com/i,
    /mediasama.com/i,
    /methodrumour.com/i,
    /millonard1.info/i,
    /mikedurant.com/i,
    /mkc-novoros.ru/i,
    /mndsrv.com/i,
    /mobagent.com/i,
    /moleconcern.com/i,
    /moodokay.com/i,
    /motivessuggest.com/i,
    /movementdespise.com/i,
    /mybeautyland.shop/i,
    /naigristoa.com/i,
    /naturalistsbumpmystic.com/i,
    /niceanimegames.com/i,
    /number1victimofcrime.com/i,
    /notifsendback.com/i,
    /notquiteso.buzz/i,
    /novoecarstvo.ru/i,
    /obsessivepetsbean.com/i,
    /oejcfz.cn/i,
    /ofchildr.buzz/i,
    /ofenjoy.email/i,
    /offcww.com/i,
    /onetouch16.info/i,
    /oovaufty.com/i,
    /opchikoritar.com/i,
    /oscarredwith.xyz/i,
    /ourwowspot.com/i,
    /owewary.com/i,
    /pardonsuccessionassassin.com/i,
    /perce1ve.com/i,
    /pethealthahead.com/i,
	/phenotypebest.com/i,
    /pinprickplums.com/i,
    /plarimoplus.com/i,
    /playstretch.host/i,
    /populardownloadprogram.rest/i,
    /pornimg.xyz/i,
    /pornwiki.net/i,
    /pornstarharem.com/i,
    /pressingequation.com/i,
    /preventedcaptivate.com/i,
    /prodlgiousdates.com/i,
    /profitablegatetocontent.com/i,
    /prosloy.com/i,
    /psaltauw.net/i,
    /pssy.xyz/i,
	/ptaimpeerte.com/i,
    /puodaqi.icu/i,
    /puskc.xyz/i,
	/pushyouworld.com/i,
    /racareewituhi.xyz/i,
    /rapolok.com/i,
    /redclo.net/i,
    /relativelyweptcurls.com/i,
    /repentbits.com/i,
    /reposemarshknot.com/i,
    /retrievethefile.com/i,
    /revealoverheadearth.com/i,
    /revoketypes.com/i,
    /riolenproce.xyz/i,
    /risextube.com/i,
	/rizejoshy.pro/i,
    /roleguy.casa/i,
    /romanceinhearts.com/i,
    /routeistic.com/i,
    /rosyruffian.com/i,
    /rulefloor.com/i,
    /rvvdku-vi.ru/i,
    /s162.ru/i,
    /saiwhute.com/i,
    /sarahWestall.co/i,
    /say-soft.com/i,
    /sicknessfestivity.com/i,
    /sitesaver.net/i,
    /sluts.xyz/i,
	/smartbase.tech/i,
    /snoreempire.com/i,
    /solemik.com/i,
    /soonmiss.top/i,
    /sonioubemeal.com/i,
	/souptrip.com/i,
    /speakspurink.com/i,
    /staturereactioncollect.com/i,
    /starvardsee.xyz/i,
    /stream-core.xyz/i,
    /stripchat.com/i,
    /supanimegames.com/i,
    /sulseerg.com/i,
    /suspendedflesh.com/i,
    /sutlly.click/i,
    /s.optnx.com/i,
    /taetsiatomia.com/i,
    /taghaugh.com/i,
    /taroads.com/i,
    /tdwaa12.xyz/i,
    /temperrunnersdale.com/i,
    /tepyoff.cfd/i,
    /theorywomen.online/i,
    /thepositiveimpactnow.com/i,
    /this-soft.com/i,
    /ts-tracker.me/i,
    /ti-files.org/i,
    /tnflix.top/i,
    /tractorfoolproofstandard.com/i,
    /tubeme.live/i,
    /tw-funoffer-76.com/i,
    /ugroocuw.net/i,
    /unpredictablehateagent.com/i,
    /unwelcomeconclusion.com/i,
    /upomexasi.cfd/i,
    /upscan.space/i,
    /us-soft.com/i,
    /utationforh.buzz/i,
    /updatereminder.icu/i,
    /vantbox.com/i,
    /venadvonline.com/i,
    /videocampaign.co/i,
	/viiqvmfb.com/i,
    /vipcaptcha.live/i,
    /visariomedia.com/i,
    /vsesofteasy.com/i,
    /vv666.com.cn/i,
    /w3needman3w.com/i,
    /waisheph.com/i,
    /webig.email/i,
    /widgeo.net/i,
    /workers.dev/i,
    /worldoftanks.asia/i,
    /worldofwarships.asia/i,
    /worthyprogress.com/i,
    /wsecurely.com/i,
    /wumufama.com/i,
    /xg9011.com/i,
    /xhqxmovies.com/i,
    /xlirdr.com/i,
    /xlivrdr.com/i,
    /xtrade.financial/i,
    /yearbookhobblespinal.com/i,
    /yearlingpreferablyperiods.com/i,
    /yourhypejournal.com/i,
    /ytu567.monster/i,
    /ywobqrhsh.com/i,
    /zlink6.com/i,
];

let block_popup = [
    "ouo.",
    "killad.cumi.co",
    "gounlimited.to",
    "oxlife.co",
    "mixdrop.",
    "streamz.",
    "adsco.",
    "xadsmart.com",
    "javmost.com",
    "www5.javmost.com",
    "exeo.app"
];

//封鎖網站
var fl = true;
if(block_list && fl == true){
    for (const h of block_list) {
        if (killad_domain.match(h)) {
            browser.document.execCommand("Stop");
            browser.window.stop();
            browser.window.location = 'about:blank';
            browser.console.log(browser.window.history);
            browser.console.log(browser.document.referrer);
            browser.document.querySelector(':root').innerHTML = `
            <head><title>The website successfully blocked !</title></head>
            <body>
            <div style="direction: ltr; position: fixed; top: 0; z-index: 999999; display: block; width: 100%; height: 100%; background: #fff">
            <p style="position: relative; top: 40%; display: block; font-size: 32px; font-weight: bold; color: red; margin: 0 auto; text-align: center">
                <input value="${killad_url}" size="70" style="font-size:12px;">
                <br>
                The website successfully blocked !<br>
                <span style='font-size:18px;color:#666'>乾淨瀏覽外掛 By HC</span>
            </p>
            </div>
            </body>`;
            browser.document.execCommand("Stop");
            browser.window.stop();
            browser.window.close();
            fl = false;
            break;
        }
    }
}
if(block_domain_tw && fl == true) {
    for (const h of block_domain_tw) {
        if (killad_domain.match(h)) {
            browser.document.execCommand("Stop");
            browser.window.stop();
            browser.window.location = 'about:blank';
            browser.console.log(browser.window.history);
            browser.console.log(browser.document.referrer);
            browser.document.querySelector(':root').innerHTML = `
            <head><title>The website successfully blocked !</title></head>
            <body>
            <div style="direction: ltr; position: fixed; top: 0; z-index: 999999; display: block; width: 100%; height: 100%; background: #fff">
            <p style="position: relative; top: 40%; display: block; font-size: 32px; font-weight: bold; color: red; margin: 0 auto; text-align: center">
                <input value="${killad_url}" size="70" style="font-size:12px;">
                <br>
                The website successfully blocked !<br>
                <span style='font-size:18px;color:#666'>乾淨瀏覽外掛 By HC</span>
            </p>
            </div>
            </body>`;
            browser.document.execCommand("Stop");
            browser.window.stop();
            browser.window.close();
            fl = false;
            break;
        }
    }
}
if(block_url_tw && fl == true) {
    for (const h of block_url_tw) {
        if (killad_url.href.match(h)) {
            browser.document.execCommand("Stop");
            browser.window.stop();
            browser.window.location = 'about:blank';
            browser.console.log(browser.window.history);
            browser.console.log(browser.document.referrer);
            browser.document.querySelector(':root').innerHTML = `
            <head><title>The website successfully blocked !</title></head>
            <body>
            <div style="direction: ltr; position: fixed; top: 0; z-index: 999999; display: block; width: 100%; height: 100%; background: #fff">
            <p style="position: relative; top: 40%; display: block; font-size: 32px; font-weight: bold; color: red; margin: 0 auto; text-align: center">
                <input value="${killad_url}" size="70" style="font-size:12px;">
                <br>
                The website successfully blocked !<br>
                <span style='font-size:18px;color:#666'>乾淨瀏覽外掛 By HC</span>
            </p>
            </div>
            </body>`;
            browser.document.execCommand("Stop");
            browser.window.stop();
            browser.window.close();
            fl = false;
            break;
        }
    }
}
if(block_popup) {
    for (const h of block_popup) {
        if (killad_domain.match(h)) {
            killad_popup_init(block_popup);
            break;
        }
    }
}
//個別網站優化

if(killad_domain.match(/mixdrop.co/i)) {
	GM_addStyle(`
    #sticky_ads{display:none !important;}
    iframe:not(iframe[src]){display:none !important;}
    div[id^='exo_slider_']{display:none !important;}
    iframe[src='about:blank']{display:none !important;}
    iframe[width='300'][height='250']{display:none !important;}
    iframe[width='450'][height='150']{display:none !important;}
    iframe[width='728'][height='90']{display:none !important;}
    iframe[width='900'][height='200']{display:none !important;}
    iframe[width='900'][height='250']{display:none !important;}
    iframe[style*='width:300px;height:250px;']{display:none !important;}
    div[style*='width:100%;'][style*='height: 100px;']{display:none !important;}
    `);
    setInterval(function(){
        killad_remove("iframe:not(iframe[src])");
        killad_remove("iframe[src='about:blank']");
        killad_remove("iframe[id='google_esf']");
	}, 1000);
}
if(killad_domain.match(/porn87.com/i)) {
	GM_addStyle(`
    #sticky_ads{display:none !important;}
    iframe:not(iframe[src]){display:none !important;}
    div[id^='exo_slider_']{display:none !important;}
    iframe[src='about:blank']{display:none !important;}
    iframe[width='300'][height='250']{display:none !important;}
    iframe[width='450'][height='150']{display:none !important;}
    iframe[width='728'][height='90']{display:none !important;}
    iframe[width='900'][height='200']{display:none !important;}
    iframe[width='900'][height='250']{display:none !important;}
    iframe[style*='width:300px;height:250px;']{display:none !important;}
    div[style*='width:100%;'][style*='height: 100px;']{display:none !important;}
    `);
    setInterval(function(){
        killad_remove("iframe:not(iframe[src])");
        killad_remove("iframe[src='about:blank']");
//        killad_remove("div[id^='exo_slider_']");
//        killad_remove("iframe[width='300'][height='250']");
//        killad_remove("iframe[width='728'][height='90']");
//        killad_click("div.jw-skip");
//        killad_click("div.jw-reset");
//        killad_click(".jw-skippable");
//        killad_click("#player_3x2_close");
	}, 1000);
}
if(killad_domain.match(/goodav17.com/i)) {
	GM_addStyle(`
    #sticky_ads{display:none !important;}
    iframe:not(iframe[src]){display:none !important;}
    div[id^='exo_slider_']{display:none !important;}
    iframe[src='about:blank']{display:none !important;}
    iframe[width='300'][height='250']{display:none !important;}
    iframe[width='450'][height='150']{display:none !important;}
    iframe[width='728'][height='90']{display:none !important;}
    iframe[style*='width:300px;height:250px;']{display:none !important;}
    div[style*='width:100%;'][style*='height: 100px;']{display:none !important;}
    `);
    setInterval(function(){
        killad_remove("iframe:not(iframe[src])");
        killad_remove("iframe[src='about:blank']");
//        killad_remove("div[id^='exo_slider_']");
//        killad_remove("iframe[width='300'][height='250']");
//        killad_remove("iframe[width='728'][height='90']");
//        killad_click("div.jw-skip");
//        killad_click("div.jw-reset");
//        killad_click(".jw-skippable");
//        killad_click("#player_3x2_close");
	}, 1000);
}
if(killad_domain.match(/javmost.com/i)) {
	GM_addStyle(`
    iframe:not(iframe[src]){display:none !important;}
    div[id^='exo_slider_']{display:none !important;}
    iframe[src='about:blank']{display:none !important;}
    iframe[width='300'][height='250']{display:none !important;}
    iframe[width='450'][height='150']{display:none !important;}
    iframe[width='728'][height='90']{display:none !important;}
    iframe[style*='width:300px;height:250px;']{display:none !important;}
    div[style*='width:100%;'][style*='height: 100px;']{display:none !important;}
    `);
    setInterval(function(){
        killad_remove("iframe:not(iframe[src])");
        killad_remove("iframe[src='about:blank']");
//        killad_remove("div[id^='exo_slider_']");
//        killad_remove("iframe[width='300'][height='250']");
//        killad_remove("iframe[width='728'][height='90']");
//        killad_click("div.jw-skip");
//        killad_click("div.jw-reset");
//        killad_click(".jw-skippable");
//        killad_click("#player_3x2_close");
	}, 1000);
}
if(killad_domain.match(/javhdporn.net/i)) {
	GM_addStyle(`
    iframe[width='300'][height='250']{display:none !important;}
    iframe[width='450'][height='150']{display:none !important;}
    iframe[width='728'][height='90']{display:none !important;}
    iframe[style*='width:300px;height:250px;']{display:none !important;}
    `);
    setInterval(function(){
        killad_remove("iframe:not(iframe[src])");
        killad_remove("iframe[width='450'][height='150']");
        killad_remove("iframe[width='300'][height='250']");
        killad_remove("iframe[width='728'][height='90']");
        killad_click("div.jw-skip");
        killad_click("div.jw-reset");
        killad_click(".jw-skippable");
        killad_click("#player_3x2_close");
	}, 1000);
}
if(killad_domain.match(/ettoday.net/i)) {
	GM_addStyle(`
    div[class^='ad_']{display:none !important;}
    div[id^='ad_']{display:none !important;}
    div[class='adJS01']{display:none !important;}
    `);
}
if(killad_domain.match(/csdn.net/i)) {
	GM_addStyle(`
    div[id^='kp_box_']{display:none !important;}
	#content_views pre {
	    -webkit-touch-callout: auto !important;
	    -webkit-user-select: auto !important;
	    -khtml-user-select: auto !important;
	    -moz-user-select: auto !important;
	    -ms-user-select: auto !important;
	    user-select: auto !important;
	}
	#content_views pre code {
	    -webkit-touch-callout: auto !important;
	    -webkit-user-select: auto !important;
	    -khtml-user-select: auto !important;
	    -moz-user-select: auto !important;
	    -ms-user-select: auto !important;
	    user-select: auto !important;
	}
    `);
}
if(killad_domain.match(/googleapis.com/i)) {
    setInterval(function(){
        killad_click("button.videoAdUiSkipButton");
        killad_click("button.videoAdUiAction");
        killad_click("button.videoAdUiRedesignedSkipButton");
	}, 1000);
}
if(killad_domain.match(/avple.tv/i)) {
    GM_addStyle(`
    iframe[src*='jads.co']{display:none !important;}
    iframe[src*='juicyads.com']{display:none !important;}
    `);
}
if(killad_domain.match(/javgg.net/i)) {
    GM_addStyle(`
    iframe:not(iframe[src]){display:none !important;}
    .position-relative{display:none !important;}
    .home_iframead{display:none !important;}
    `);
    setInterval(function(){
        killad_remove("iframe:not(iframe[src])");
        killad_click(".jw-skip");
        killad_click(".jw-skippable");
	}, 1000);
}
if(killad_domain.match(/supjav.com/i)) {
    GM_addStyle(`
    .exo-ipp, div[class$='_scrollable-doc'], div[class^='ts-inpage-push'], .simpleToast, .ipprtcnt{display:none !important;}
    .movv-ad{display:none !important;}
    div[class^='ad_']{display:none !important;}
    .ts-inpage-push-dating, .ts-inpage-push-dating__bottom{display:none !important;}
    .adsBox, .text-ad, .textAd, .text_ad, .text_ads, .text-ads, .text-ad-links{display:none !important;}
    `);
    setInterval(function(){
        killad_remove("div[class^='ts-inpage-push']");
        killad_remove(".simpleToast");
        killad_remove(".exo-ipp");
        killad_remove(".ipprtcnt");
        killad_remove("div[class$='_scrollable-doc']");
        killad_remove(".ts-inpage-push-dating");
        killad_remove(".ts-inpage-push-dating__bottom");
        killad_remove("iframe:not(iframe[src])");
	}, 1000);
}
if(killad_domain.match(/javsky.tv/i)) {
    setInterval(function(){
        killad_remove("iframe:not(iframe[src])");
        killad_remove("iframe[width='300'][height='250']");
        killad_remove("iframe[width='728'][height='90']");
        killad_remove("div.video_slider_position--bottom_right");
        killad_click("div[data-izone='close']");
        killad_click("button[data-role='close']");
        killad_click("span[class='video_slider__close-icon']");
	}, 500);
}
if(killad_domain.match(/xvideos.com/i)) {
	GM_addStyle(`div[id$='-ad'],div[id^='ad-'],.ad-square,.ad-support-desktop{display:none !important;}`);
    setInterval(function(){
        killad_remove("div[id$='-ad']");
        killad_remove("div[id^='ad-']");
        killad_remove(".ad-square");
        killad_remove(".ad-support-desktop");
        if(document.querySelector(".videoad-skip")) {
            //跳過廣告
            document.querySelector(".videoad-skip").click();
            console.log("killad click videoad-skip");
        }
	}, 1000);
}
if(killad_domain.match(/yocoolnet.in/i)) {
    setInterval(function(){
        if(document.querySelector(".close_box")) {
            //跳過廣告
            document.querySelector(".close_box").click();
            console.log("killad click close_box");
        }
	}, 1000);
}
if(killad_domain.match(/hboav.com/i)) {
    setInterval(function(){
        if(document.querySelector(".skip-button")) {
            //跳過廣告
            document.querySelector(".skip-button").click();
            console.log("killad click skip-button");
        }
	}, 1000);
}
if(killad_domain.match(/youtube.com/i)) {
    setInterval(function(){
        //移除影片遮蔽
        killad_remove(".image-container");
        killad_remove(".attribution-button");
        killad_remove(".text-inner-container");
        killad_remove("#player-ads");
        killad_remove("ytd-promoted-sparkles-web-renderer[ad-badge-stark-padding]");
        //快速跳過廣告
        killad_click(".close-button");
        killad_click("button.videoAdUiSkipButton");
        killad_click("button.ytp-ad-skip-button");
        killad_click("button.ytp-ad-overlay-close-button");
	}, 1000);
}
if(killad_domain.match(/cumi.co/i)) {
	//GM_addStyle(`h1{color:blue;}`);
}
if(killad_domain.match(/hung-ya.com/i) || killad_domain.match(/bbs-tw.com/i)) {
	GM_addStyle(`
	html>body>div>div[id=BbsShow]>table[class=TG] img{max-width: 600px;}
	a[href*="live173.com"],*[id=x18x],*[id=AdImg],*[id=BbsShowPush],img[src^="/img/ad/"],table#AdShow,iframe[src$='aa.htm'],a[href*='s383.com'],a[href*='x831.com'],a[href*='xb99.net'],a[href*='av104.tv'],a[href*='avjp.net'],a[href*='r530.com'],div#LoadingImg,a[href*='mmbox.com.tw']{display: none !important;}
	html>body>div>div[id=PageCenter]>table[class=AP]>tbody>tr:not(:nth-child(3)){display: none !important;}
	iframe[src='/link/top.htm']{display: none !important;}
	iframe[src^='http:\/\/av369.net\/?aid=']{display: none !important;}
	body{background-color:#fff !important;}
    a[href*='cgi-bin/link/out.pl']{display: none !important;}
	`);
}
if(killad_domain.match(/5278.cc/i)) {
	GM_addStyle(`
	div[class^='a_'],div[class*="a_h"],div[class*="a_f"],div#list_top_ad,div#forum_top_ad,div[class*='_banner_'],iframe[src*='ads.exoclick.com\/iframe.php'],iframe[src*='ads.php']{display: none !important;}
	*[href*='avtv.cc'],*[href*='go.xlviiirdr.com']{display:none}
	iframe[src*='jads.co/adshow.php'],iframe[src*='go.xlviiirdr.com']{display:none}
	iframe[src*='a.realsrv.com/iframe.php']{display:none}
	`);
    killad_removeAttribute("html", "onclick");
    killad_removeAttribute("body", "onclick");
    GM_addStyle("iframe[src*='ads-iframe-display.php']{display:none !important;}");
    GM_addStyle("iframe[src*='adshow.php']{display:none !important;}");
    GM_addStyle("iframe[src*='framelinks.php']{display:none !important;}");
    GM_addStyle("a[href*='88p2p.com/V4/index.phtml']{display:none !important;}");
	killad_remove("iframe[src*='syndication.realsrv.com/ads']");
}
if(killad_domain.match(/159i.com/i)) {
	GM_addStyle(`
	iframe[src*='banads/view.php'],
	iframe[src*='framelinks.php'],
    iframe[src*='ads-iframe-display.php'],
    iframe[src*='adshow.php'],
	div[class='qb'],
	div[class='ab'],
	div[id='sidebar'],
	div[class='postnext'],
    #body>table[border='0'][width='100%'],
    #body a[href=''],
    video[width='728px'][height='90px'],
    .exo-native-widget,
	#content>table{
		display:none !important;
	}
    div.info span.time {
		-webkit-touch-callout: none;
		-webkit-user-select: none;
		-khtml-user-select: none;
		-moz-user-select: none;
		-ms-user-select: none;
		user-select: none;
    }
	`);
    if(document.querySelector("div[id*='disclamer_']")) {
        enterSiteDisclamer();
    }
    killad_removeAttribute("a[onclick*='ranksite']", "onclick");
    killad_removeAttribute("a[onclick*='ranksite']", "target");

	setTimeout(function(){
        killad_remove("iframe[src*='ads-iframe-display.php']");
		killad_remove("iframe[src*='syndication.realsrv.com/ads']");
		killad_remove("iframe[src*='adserver.juicyads.com/adshow.php']");
		killad_remove("iframe[src*='link.twrank.com/framelinks.php']");
	}, 1000);
}
if(killad_domain.match(/twdvd.com/i)) {
    GM_addStyle(`
	a[href*='live-439.com'],
    iframe[src*='framelinks.php'],
    iframe[src*='live173']{
		display:none !important;
	}
	`);
    if(browser.document.querySelector("img[src*='enter.jpg']")){
        browser.location.href = 'http://twdvd.com/video/';
    }
    killad_remove("iframe[src*='ads.exosrv.com']");
}
if(killad_domain.match(/rosefile.net/i)) {
	GM_addStyle(`ins[class='adsbygoogle']{display:none !important;}`);
	GM_addStyle(`div[id*='google_ads_iframe']{display:none !important;}`);
	//Google廣告
    setInterval(function(){
        killad_replace(".adsbygoogle", ".");
	}, 1000);
}
if(killad_domain.match(/geeksforgeeks.org/i)) {
	GM_addStyle(`ins[class='adsbygoogle']{display:none !important;}`);
	GM_addStyle(`div[id*='google_ads_iframe']{display:none !important;}`);
}
if(killad_domain.match(/ltn.com.tw/i)) {
	GM_addStyle(`div.fb_mask,div.softPush_notification,div[id*='-ad-']{display: none !important;}`);
	GM_addStyle(`ins[class='adsbygoogle']{display:none !important;}`);
	GM_addStyle(`div[id*='google_ads_iframe']{display:none !important;}`);
}
if(killad_domain.match(/udn.com/i)) {
	GM_addStyle(`ins[class='adsbygoogle']{display:none !important;}`);
	GM_addStyle(`div[id*='google_ads_iframe']{display:none !important;}`);
}
if(killad_domain.match(/eyny.com/i)) {
	GM_addStyle(`ins[id^='aswift_'][id$='_expand']{display:none !important;}`);
	GM_addStyle(`ins[class='adsbygoogle']{display:none !important;}`);
	GM_addStyle(`div[id*='google_ads_iframe']{display:none !important;}`);
}
if(killad_domain.match(/www.eprice.com.tw/i)) {
	GM_addStyle(`*[class*='adsbygoogle'],*[id*='aswift_'][id*='_expand'],*[id*='div-gpt-ad-'],*[class*='ad-'][class*='-g'],*[id*='google_ads_iframe'],li[class^='ad-google-block-'],div[class^='ad-']{	display:none !important;}`);
	GM_addStyle(`ins[class='adsbygoogle']{display:none !important;}`);
	GM_addStyle(`div[id*='google_ads_iframe']{display:none !important;}`);
}
if(killad_domain.match(/hboav.com/i)) {
	GM_addStyle(`div[id='inplayer'],div[class*='_banner_ad']{z-index: -1 !important;}`);
}
if(killad_domain.match(/missav.com/i)) {
	GM_addStyle(`div[id*='_ad_']{z-index: -1 !important;display:none !important;}`);
	GM_addStyle(`a[href*='go.live.missav.com/?realDomain=']{z-index: -1 !important;display:none !important;}`);
    GM_addStyle("iframe[id^='container-'][class^='container-']{display:none !important;}");
    GM_addStyle("iframe .ts-inpage-push-dating{display:none !important;}");
}
if(killad_domain.match(/ptt.cc/i)) {
	//https://www.ptt.cc/bbs/SportLottery/index.html
	document.querySelector('.btn-big').click();
}
if(killad_domain.match(/pixnet.net/i)) {
	//https://tkb032.pixnet.net/blog/post/64795996-x
	GM_addStyle(`
    ins[id^='aswift_'][id$='_expand']{display:none !important;}
	ins.adsbygoogle{display:none !important;}
    ins.pixnet-ad{display:none !important;}
	div[id*='google_ads_iframe']{display:none !important;}
	div[class*='mib-unfold-'][class*='-ad-box']{display:none !important;}
	div[id*='aniplayer_']{display:none !important;}
	div[id*='div-gpt-ad-']{display:none !important;}
    div[id*='ad-content-']{display:none !important;}
    img[id*='ad-box']{display:none !important;}
    h1 a{color:red !important;}
    div#sticky-sidebar-ad{display:none !important;}
    `);
	setInterval(function(){
        killad_remove("div[id*='div-gpt-ad-']");
        killad_remove("div[id*='mib-video-expander']");
        if(document.body && document.body.classList) {
            document.body.classList.remove('freeze-video-ad');
        }
	}, 1000);
}
if(killad_domain.match(/setn.com/i)) {
	GM_addStyle("ins.adsbygoogle{display:none !important;}");
    GM_addStyle("div.gliaplayer-container-aspect{display:none !important;}");
	GM_addStyle("div[id*='google_ads_iframe']{display:none !important;}");
	GM_addStyle("div[id*='aniplayer_']{display:none !important;}");
    GM_addStyle("div[id^='ad-content-']{display:none !important;}");
    GM_addStyle(".meta_ad{display:none !important;}");
    GM_addStyle(".heder-area-ad{display:none !important;}");
    setInterval(function(){
        killad_remove(".meta_ad");
        killad_remove(".heder-area-ad");
        killad_remove(".adsbygoogle");
	}, 1000);
}
if(killad_domain.match(/yahoo.com/) || killad_domain.match(/yimg.com/)) {
    //alert("test");
    GM_addStyle(`
    iframe:not(iframe[src]),
    #Billboard-ad,
    .BillboardAd,
    [id^='my-ads'],
    [class='adsbygoogle'],
    [id*='-my-ads'],
    [id^='ad-'],
    #act-closeOut-btn-tray,
    #ad-north-base,
    #my-adsMAST-base,
    #my-adsMAST,
    #my-adsMAST-iframe,
    #my-adsHPSPON-base{
        display:none !important;
    }
    `);
//	GM_addStyle("[class='adsbygoogle']{display:none !important;}");
//	GM_addStyle("[id*='google_ads_iframe']{display:none !important;}");
//	GM_addStyle("[id^='my-ads']{display:none !important;}");
//	GM_addStyle("[id$='-ad']{display:none !important;}");
//	GM_addStyle("[id^='ad-']{display:none !important;}");
//	GM_addStyle("[id*='-my-ads']{display:none !important;}");
//	GM_addStyle("div.BillboardAd{display:none !important;}");
//	GM_addStyle("#ad-north-base{display:none !important;}");
//	GM_addStyle("#my-adsMAST-base{display:none !important;}");
//	GM_addStyle("#my-adsMAST{display:none !important;}");
//	GM_addStyle("#my-adsMAST-iframe{display:none !important;}");
//	GM_addStyle("#my-adsHPSPON-base{display:none !important;}");
/*
    setInterval(function(){
        killad_remove("#Billboard-ad");
        killad_remove(".BillboardAd");
        killad_remove("[id^='my-ads']");
        killad_remove("[class='adsbygoogle']");
        killad_remove("[id*='google_ads_iframe']");
        killad_remove("[id*='-my-ads']");
		killad_remove("[id$='-ad']");
		killad_remove("[id^='ad-']");
        killad_remove("#act-closeOut-btn-tray");
        killad_remove("#ad-north-base");
        killad_remove("#my-adsMAST-base");
        killad_remove("#my-adsMAST");
        killad_remove("#my-adsMAST-iframe");
        killad_remove("#my-adsHPSPON-base");
        killad_click("#act-closeOut-btn-tray");
	}, 500);
*/
}
if(killad_domain.match(/exep.app/i)) {
	//https://exep.app/3lntpxJ
    //https://exee.app/3lntpxJ
    GM_addStyle("div[id*='_vdo_ads_']{display:none !important;}");
    GM_addStyle("div[id^='pf-']{display:none !important;}");
    setInterval(function(){
        killad_remove("iframe:not(iframe[src])");
        killad_remove("iframe[src='about:blank']");
        killad_remove("ins[class='adsbygoogle']");
        killad_remove("div[id*='google_ads_iframe']");
        killad_remove("ins[id^='aswift_'][id$='_expand']");
        killad_remove("div[id*='google_ads_iframe']");
        killad_remove("div[id*='_vdo_ads_']");
        killad_remove("div[id*='_vdo_ads_player_ai']");
    }, 1000);
    browser.document.addEventListener("DOMContentLoaded", function(){
        //自動按按鈕
        if(browser.document.querySelector('.btn-goo')) {
            browser.document.querySelector('.btn-goo').click();
            browser.console.log("killad auto click btn");
        }
    });
}
if(killad_domain.match(/exee.app/i)) {
	//https://exep.app/3lntpxJ
    //https://exee.app/3lntpxJ
    GM_addStyle("div[id*='_vdo_ads_']{display:none !important;}");
    GM_addStyle("div[id^='pf-']{display:none !important;}");
    setInterval(function(){
        killad_remove("iframe:not(iframe[src])");
        killad_remove("iframe[src='about:blank']");
        killad_remove("ins[class='adsbygoogle']");
        killad_remove("div[id*='google_ads_iframe']");
        killad_remove("ins[id^='aswift_'][id$='_expand']");
        killad_remove("div[id*='google_ads_iframe']");
        killad_remove("div[id*='_vdo_ads_']");
        killad_remove("div[id*='_vdo_ads_player_ai']");
    }, 1000);
}
if(killad_domain.match(/ufacw.com/i)) {
	GM_addStyle("ins[id^='aswift_'][id$='_expand']{display:none !important;}");
	GM_addStyle("ins[class='adsbygoogle']{display:none !important;}");
	GM_addStyle("div[id*='google_ads_iframe']{display:none !important;}");
    GM_addStyle("div[class^='demand-supply']{display:none !important;}");
}
if(killad_domain.match(/mixdrop.ch/i)) {
	GM_addStyle("ins[id^='aswift_'][id$='_expand']{display:none !important;}");
	GM_addStyle("ins[class='adsbygoogle']{display:none !important;}");
	GM_addStyle("div[id*='google_ads_iframe']{display:none !important;}");
    GM_addStyle("div[id^='awn-']{display:none !important;}");
}
if(killad_domain.match(/shon.xyz/i)) {
	//https://shon.xyz/aAQIIG
	GM_addStyle("ins[id^='aswift_'][id$='_expand']{display:none !important;}");
	GM_addStyle("ins[class='adsbygoogle']{display:none !important;}");
	GM_addStyle("div[id*='google_ads_iframe']{display:none !important;}");
}
if(killad_domain.match(/aqdlt.tv/i)) {
    GM_addStyle("div.ads-item a{display:none !important;}");
    GM_addStyle("div.video-item-ads a{display:none !important;}");
	GM_addStyle("ins[id^='aswift_'][id$='_expand']{display:none !important;}");
	GM_addStyle("ins[class='adsbygoogle']{display:none !important;}");
	GM_addStyle("div[id*='google_ads_iframe']{display:none !important;}");
    setInterval(function(){
        if(document.querySelector(".adcp-close")) {
            //跳過廣告
            document.querySelector(".adcp-close").click();
            document.querySelector(".adcp-close").remove();
            console.log("killad click skip-button");
        }
	}, 1000);
}
if(killad_domain.match(/52av.one/i)) {
    GM_addStyle("iframe[src*='ad.52av.tv/ad']{display:none !important;}");
    GM_addStyle("iframe[src*='ads-iframe-display.php']{display:none !important;}");
    GM_addStyle("iframe[src*='adshow.php']{display:none !important;}");
    GM_addStyle(".exo-native-widget{display:none !important;}");
    GM_addStyle("div[class^='a_']{display:none !important;}");
    GM_addStyle("img[src*='ad.52av.tv/ad/']{display:none !important;}");
    GM_addStyle("a[href*='click.dtiserv2.com/Click']{display:none !important;}");
    GM_addStyle("a[href*='www.52av.be']{display:none !important;}");
    GM_addStyle("iframe[id^='container-'][class^='container-']{display:none !important;}");
    killad_removeAttribute("html", "onclick");
    killad_removeAttribute("body", "onclick");
}
if(killad_domain.match(/yocoolnet.in/i)) {
    GM_addStyle("iframe[src*='ad.52av.tv/ad']{display:none !important;}");
    GM_addStyle("iframe[src*='ads-iframe-display.php']{display:none !important;}");
    GM_addStyle("iframe[src*='adshow.php']{display:none !important;}");
}
if(killad_domain.match(/hpjav.tv/i)) {
	GM_addStyle("ins[id^='aswift_'][id$='_expand']{display:none !important;}");
	GM_addStyle("ins[class='adsbygoogle']{display:none !important;}");
	GM_addStyle("div[id*='google_ads_iframe']{display:none !important;}");
    GM_addStyle("iframe[src*='ads-iframe-display.php']{display:none !important;}");
    GM_addStyle("iframe[src*='adshow.php']{display:none !important;}");
    GM_addStyle("iframe[src*='stunninglover.com']{display:none !important;}");
    GM_addStyle("iframe[src*='iframe.php']{display:none !important;}");
    GM_addStyle("a[href*='xxxiijmp.com']{display:none !important;}");
    GM_addStyle("div[class*='single_ad']{display:none !important;}");
    GM_addStyle("#preroll_ads iframe{display:none !important;}");
}
if(killad_domain.match(/javhd.today/i)) {
	GM_addStyle("ins[id^='aswift_'][id$='_expand']{display:none !important;}");
	GM_addStyle("ins[class='adsbygoogle']{display:none !important;}");
	GM_addStyle("div[id*='google_ads_iframe']{display:none !important;}");
    GM_addStyle("iframe[src*='ads-iframe-display.php']{display:none !important;}");
    GM_addStyle("iframe[src*='adshow.php']{display:none !important;}");
    GM_addStyle("iframe[src*='stunninglover.com']{display:none !important;}");
    GM_addStyle("iframe[src*='iframe.php']{display:none !important;}");
    GM_addStyle("a[href*='xxxiijmp.com']{display:none !important;}");
    GM_addStyle("div[class*='single_ad']{display:none !important;}");
    GM_addStyle("#preroll_ads iframe{display:none !important;}");
    GM_addStyle(".ads-footer *{display:none !important;}");
    GM_addStyle(".ads-responsive *{display:none !important;}");
    GM_addStyle("iframe[id^='container-'][class^='container-']{display:none !important;}");
    GM_addStyle("div.ads iframe{display:none !important;}");
}
if(killad_domain.match(/avseesee.com/i)) {
    GM_addStyle("iframe[src*='ads-iframe-display.php']{display:none !important;}");
    GM_addStyle("iframe[src*='adshow.php']{display:none !important;}");
    GM_addStyle("iframe[src*='framelinks.php']{display:none !important;}");
}
if(killad_domain.match(/thisav.com/i)) {
    GM_addStyle("iframe[src*='ads-iframe-display.php']{display:none !important;}");
    GM_addStyle("iframe[src*='adshow.php']{display:none !important;}");
    GM_addStyle("iframe[src*='framelinks.php']{display:none !important;}");
    GM_addStyle("iframe[src*='a.realsrv.com/iframe.php']{display:none !important;}");
    GM_addStyle("div[id^='exoNativeWidget_']{display:none !important;}");
    GM_addStyle("a[href*='realsrv.com/click.php']{display:none !important;}");
}
if(killad_domain.match(/ggjav.com/i)) {
    GM_addStyle("iframe[src*='ads-iframe-display.php']{display:none !important;}");
    GM_addStyle("iframe[src*='adshow.php']{display:none !important;}");
    GM_addStyle("iframe[src*='framelinks.php']{display:none !important;}");
    GM_addStyle("iframe[src*='a.realsrv.com/iframe.php']{display:none !important;}");
    GM_addStyle("div[id^='exoNativeWidget_']{display:none !important;}");
    GM_addStyle("a[href*='realsrv.com/click.php']{display:none !important;}");
    GM_addStyle("div.native_ads *{display:none !important;}");
    GM_addStyle("div[id^='ads_'] *{display:none !important;}");
    GM_addStyle("iframe[src*='r.trwl1.com']{display:none !important;}");
    GM_addStyle("a[href*='r.trwl1.com']{display:none !important;}");
    GM_addStyle("div#pc_instant{display:none !important;}");
    GM_addStyle("div#pc_instant{display:none !important;}");
    setInterval(function(){
        killad_click("[class*='vast-skip-button'][class*='enabled']");
        killad_remove("iframe[width='300'][height='250']");
        killad_remove("div#_pcnaite");
	}, 500);

}
if(killad_domain.match(/avgle.com/i)) {
    GM_addStyle("iframe[src*='ads-iframe-display.php']{display:none !important;}");
    GM_addStyle("iframe[src*='adshow.php']{display:none !important;}");
    GM_addStyle("iframe[src*='framelinks.php']{display:none !important;}");
    GM_addStyle("iframe[src*='a.realsrv.com/iframe.php']{display:none !important;}");
    GM_addStyle("div[id^='exoNativeWidget_']{display:none !important;}");
    GM_addStyle("a[href*='realsrv.com/click.php']{display:none !important;}");
    GM_addStyle("div.native_ads *{display:none !important;}");
    GM_addStyle("div[id^='ads_'] *{display:none !important;}");
    GM_addStyle("iframe[src*='r.trwl1.com']{display:none !important;}");
    GM_addStyle("a[href*='r.trwl1.com']{display:none !important;}");
    GM_addStyle("div.kr-ad *{display:none !important;}");
    GM_addStyle("a[href*='poweredbyliquidfire.mobi/redirect']{display:none !important;}");
    GM_addStyle("iframe[src*='ads.adxadserv.com/ad']{display:none !important;}");
    GM_addStyle("iframe[id^='container-'][class^='container-']{display:none !important;}");
}
if(killad_domain.match(/stackoverflow.com/i)) {
	GM_addStyle("ins[id^='aswift_'][id$='_expand']{display:none !important;}");
	GM_addStyle("ins[class='adsbygoogle']{display:none !important;}");
	GM_addStyle("div[id*='google_ads_iframe']{display:none !important;}");
	setInterval(function(){
        killad_remove("ins[class='adsbygoogle']");
        killad_remove("div[id*='google_ads_iframe']");
        killad_remove("ins[id^='aswift_'][id$='_expand']");
        killad_remove("div[id*='google_ads_iframe']");
	}, 1000);
}
if(killad_domain.match(/mixdrp.co/i)) {
    GM_addStyle("iframe[id^='container-'][class^='container-']{display:none !important;}");
    GM_addStyle("iframe[allowtransparency='true']{display:none !important;}");
}












