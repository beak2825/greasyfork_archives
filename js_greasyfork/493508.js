// ==UserScript==
// @name                 Xbox Cloud Gaming 游戏信息汉化
// @namespace            https://b1ue.me
// @description          汉化信息并使游戏搜索支持中文
// @version              1.1.0
// @author               b1ue
// @license              MIT
// @match                https://www.xbox.com/*/*play*
// @run-at               document-start
// @grant                GM_getValue
// @grant                GM_setValue
// @grant                GM_registerMenuCommand
// @grant                GM_notification
// @grant                GM_getResourceText
// @grant                unsafeWindow
// @resource   titles    https://update.greasyfork.org/scripts/493376/xbt-title.js
// @downloadURL https://update.greasyfork.org/scripts/493508/Xbox%20Cloud%20Gaming%20%E6%B8%B8%E6%88%8F%E4%BF%A1%E6%81%AF%E6%B1%89%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/493508/Xbox%20Cloud%20Gaming%20%E6%B8%B8%E6%88%8F%E4%BF%A1%E6%81%AF%E6%B1%89%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const Nconfig = {
        localizeGameInfo: true,			//游戏信息汉化
        alwaysShowTitle: 2,				//移动端保持标题显示
        fullScreenlandscape: false,		//全屏时强制横屏
    };

    const BXCG = {
        getValue: (key, defaultValue) => {
            if(typeof GM_getValue === 'function') return GM_getValue(key, defaultValue);
            let _val = localStorage.getItem('BXCG_' + key) ?? JSON.stringify(defaultValue);
            try { _val = JSON.parse(_val) ;} catch (e) {}
            return _val;
        },
        setValue: (key, value) => {
            if(typeof GM_setValue === 'function') return GM_setValue(key, value);
            return localStorage.setItem('BXCG_' + key, JSON.stringify(value));
        },
        getTitleList: () => {
            try{
                let xhr = new XMLHttpRequest();
                xhr.open('GET', `https://update.greasyfork.org/scripts/493376/xbt-title.js?${Math.random()}`, false);
                //xhr.setRequestHeader('Content-Type', 'text/plain');
                xhr.send();
                return xhr.responseText;
            }catch(e){
                return GM_getResourceText('titles');
            }
        }
    };

    const oWindow = self.unsafeWindow || window;
    Object.keys(Nconfig).forEach(key => {
        let _val = BXCG.getValue(key);
        if(_val != null) Nconfig[key] = _val;
    });
    let game_titles = {};

    const timestamp = () => Math.floor(new Date().getTime() / 1000);
    let resText = BXCG.getValue('game_titles');
    const game_titles_gettime = BXCG.getValue("game_titles_gettime", 0);
    if(!resText || timestamp() - game_titles_gettime > 7200){
        resText = BXCG.getTitleList();
        if(resText){
            BXCG.setValue("game_titles", resText);
            BXCG.setValue("game_titles_gettime", timestamp());
        }
    }
    game_titles = JSON.parse(resText);


    let allFullLanguages = [];
    let browserFirstLanguage = "zh-CN";
    navigator.languages.forEach(language => {
        const reg = /^[a-z]{2}-[A-Z]{2}$/;
        const isFullLanguage = reg.test(language);
        if (isFullLanguage) allFullLanguages.push(language);
    });
    if (allFullLanguages.length > 0) {
        browserFirstLanguage = allFullLanguages[0];
    }

    document.addEventListener("fullscreenchange", function (e) {
        if (document.fullscreenElement) {
            try {
                Nconfig.fullScreenlandscape && screen?.orientation?.lock("landscape");
            } catch (e) {}
        }
    });

    const originFetch = oWindow.fetch;
    oWindow.fetch = async (...arg) => {
        let arg0 = arg[0];
        let url = "";
        let isRequest = false;
        switch (typeof arg0) {
            case "object":
                url = arg0.url;
                isRequest = true;
                break;
            case "string":
                url = arg0;
                break;
            default:
                break;
        }

        if(!Nconfig.localizeGameInfo) return originFetch(...arg);

        if (url.includes('/v3/products')) {
            let ourl = new URL(url);
            let json = await arg0.json();
            let body = JSON.stringify(json);
            ourl.searchParams.set("language",browserFirstLanguage);
            let nurl = ourl.toString();
            arg[0] = new Request(nurl, {
                method: arg0.method,
                headers: arg0.headers,
                body: body,
            });

            let res = originFetch(...arg).then(response => {
                response.json = () => response.clone().json().then(json => {
                    for(let gId in json.Products){
                        let title_zh = "";
                        if(gId in game_titles && (title_zh = game_titles[gId][0])) json.Products[gId].ProductTitle = title_zh;
                    }
                    return Promise.resolve(json);
                });
                return response;
            });
            return res;
        } else if (url.includes('/sigls/v2')) {
            let ourl = new URL(url);
            ourl.searchParams.set("language",browserFirstLanguage);
            let nurl = ourl.toString();
            arg[0] = new Request(nurl, {
                method: arg0.method,
                headers: arg0.headers,
            });
        } else if (url.includes('/search/v2')) {
            let ourl = new URL(url);
            let json = await arg0.json();
            let body = JSON.stringify(json);
            ourl.searchParams.set("language",browserFirstLanguage);
            let nurl = ourl.toString();
            arg[0] = new Request(nurl, {
                method: arg0.method,
                headers: arg0.headers,
                body: body,
            });

            const query = json.Query;
            const Scope = json.Scope;
            if(query && Scope === 'EDGEWATER'){
                let new_SearchResults = []
                for(let gId in game_titles){
                    if(game_titles[gId][0].includes(query) || game_titles[gId][1].includes(query)){
                        new_SearchResults.push(gId);
                    }
                }

                let res = originFetch(...arg).then(response => {
                    response.json = () => response.clone().json().then(async json => {
                        new_SearchResults = new_SearchResults.filter(gId => !(gId in json.SearchResults));
                        if(new_SearchResults.length > 0){
                            const response = await originFetch(`https://catalog.gamepass.com/v3/products?market=${ourl.searchParams.get("market")}&language=${browserFirstLanguage}&hydration=${ourl.searchParams.get("hydration")}`, {
                                method: 'POST',
                                headers: arg0.headers,
                                body: JSON.stringify({
                                    Products: new_SearchResults,
                                }),
                            });
                            const data = await response.json();
                            for(let gId in data.Products){
                                json.Products[gId] = data.Products[gId];
                            }
                        }
                        for(let gId in json.Products){
                            let title_zh = "";
                            if(gId in game_titles && (title_zh = game_titles[gId][0])) json.Products[gId].ProductTitle = title_zh;
                        }
                        json.SearchResults = json.SearchResults.concat(new_SearchResults);
                        return Promise.resolve(json);
                    });
                    return response;
                });
                return res;
            }
        } else if (url.includes('/v4/api/selection')) {
            let res = originFetch(...arg).then(response => {
                response.json = () => response.clone().json().then(json => {
                    let items_array = json?.batchrsp?.items;
                    if(items_array){
                        items_array.forEach( _item => {
                            const item = JSON.parse(_item?.item);
                            const title = item?.ad?.items?.[0]?.title;
                            const actionLink = item?.ad?.items?.[0]?.actionLink;
                            const gId = /msgamepass:\/\/details\?id=([A-Z0-9]+)/.exec(actionLink)?.[1]
                            if(title && gId){
                                let title_zh = "";
                                if(gId in game_titles && (title_zh = game_titles[gId][0])){
                                    item.ad.items[0].title = title_zh;
                                    _item.item = JSON.stringify(item);
                                }
                            }
                        });
                    }
                    return Promise.resolve(json);
                });
                return response;
            });
            return res;
        }
        return originFetch(...arg);
    }

    function toggleTitleVisible(){
        let action = 0;
        switch(Nconfig.alwaysShowTitle){
            case 0:
            default:
                action = 1;
                break
            case 1:
                action = 2;
                break
            case 2:
                action = ('ontouchstart' in window || navigator.msMaxTouchPoints > 0)?2:1;
                break
        }
        if(action == 1){
            document.querySelector('style#showTitle')?.remove();
        }else if(action == 2){
            if(document.querySelector('style#showTitle')) return;
            const nCss = `
[class^="GameCard-module__gameTitleInnerWrapper___"] {
	max-height: 100%!important;
	visibility: visible!important;
}
[class^="GameCard-module__children___"] {
	visibility: hidden!important;
}`
            const xfextraStyle = document.createElement('style');
            xfextraStyle.id = 'showTitle';
            xfextraStyle.innerHTML = nCss;
            const docxf = document.head || document.documentElement;
            docxf.appendChild(xfextraStyle);
        }
    }

    let __PRELOADED_STATE__;
    const handle_state = (state) => {
        oWindow.state = state;
        if(Nconfig.localizeGameInfo){
            try {
                state.appContext.marketInfo.locale = browserFirstLanguage;
                for(let gId in state.xcloud.sigls){
                    if(state.xcloud.sigls[gId].data.title == 'Recently added') state.xcloud.sigls[gId].data.title = '最近新增';
                    if(state.xcloud.sigls[gId].data.title == 'Leaving soon') state.xcloud.sigls[gId].data.title = '即将退出';
                }
                for(let gId in state.xcloud.products.data){
                    let title_zh = "";
                    if(gId in game_titles && (title_zh = game_titles[gId][0])) state.xcloud.products.data[gId].data.title = title_zh;
                }
                for(let i in state.xcloud.hero.heroData.data){
                    const gId = state.xcloud.hero.heroData.data[i].productID;
                    let title_zh = "";
                    if(gId in game_titles && (title_zh = game_titles[gId][0])) state.xcloud.hero.heroData.data[i].title = title_zh;
                    state.xcloud.hero.heroData.data[i].subtitle = '';
                }
            } catch (e) {}
        }
        __PRELOADED_STATE__ = state;
    };

    Object.defineProperty(oWindow, '__PRELOADED_STATE__', {
        configurable: true,
        get: () => {
            return __PRELOADED_STATE__;
        },
        set: state => {
            handle_state(state);
        }
    });

    const NATIVE_Object_defineProperty = Object.defineProperty;
    Object.defineProperty = (obj, prop, descriptor) => {
        if(obj === oWindow && prop === '__PRELOADED_STATE__'){
            if(descriptor && descriptor?.hasOwnProperty('set')){
                const NATIVE_descriptor_set = descriptor.set;
                descriptor.set = (state, ...arg) => {
                    handle_state(state);

                    descriptor.set = NATIVE_descriptor_set;
                    Object.defineProperty = NATIVE_Object_defineProperty;
                    return NATIVE_descriptor_set(state, ...arg);
                };
            }
        }
        return NATIVE_Object_defineProperty(obj, prop, descriptor);
    };

    if(typeof GM_registerMenuCommand === 'function'){
        let updateMenu = (param) => {
            (param <= 1) && GM_registerMenuCommand(`${BXCG.getValue('localizeGameInfo',Nconfig.localizeGameInfo)?'✅':'❌'} 游戏信息汉化`, (event) => {
                BXCG.setValue("localizeGameInfo",!BXCG.getValue('localizeGameInfo',Nconfig.localizeGameInfo));
                if(typeof GM_notification === 'function') GM_notification({title: '设置变更', text: '修改将在刷新后生效!', tag:'notify', timeout: 2000});
                updateMenu(1);
            },{id:'localizeGameInfo_id', autoClose:false});
            if(param <= 2){
                let inx = Nconfig.alwaysShowTitle; (inx>2 || inx<0) && (inx=0);
                GM_registerMenuCommand(`${['❌','1️⃣','2️⃣'][inx]}保持标题显示[${['关闭','开启','仅移动设备'][inx]}] - 点击切换`, (event) => {
                    Nconfig.alwaysShowTitle = ++inx>2?0:inx;
                    BXCG.setValue("alwaysShowTitle", Nconfig.alwaysShowTitle);
                    toggleTitleVisible();
                    updateMenu(2);
                },{id:'alwaysShowTitle_id', autoClose:false});
            }
            (param <= 3) && GM_registerMenuCommand(`${Nconfig.fullScreenlandscape?'✅':'❌'} 全屏时强制横屏`, (event) => {
                Nconfig.fullScreenlandscape = !Nconfig.fullScreenlandscape;
                BXCG.setValue("fullScreenlandscape",Nconfig.fullScreenlandscape);
                updateMenu(3);
            },{id:'fullScreenlandscape_id', autoClose:false});
        }
        updateMenu(0);
    }

    document.addEventListener("DOMContentLoaded", (event) => {
        setTimeout(() => {toggleTitleVisible()},100);
    });

})();