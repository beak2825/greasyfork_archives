// ==UserScript==
// @name 收藏控 · 链接清洗
// @version 1.2.6
// @author 极品小猫
// @description 把链接地址缩减至最短可用状态，并复制到剪切板，以方便分享。【在每个页面的底部中间，有一个小小的按钮，用来呼出面板】
// @namespace https://greasyfork.org/users/3128
// @homepage https://greasyfork.org/users/3128
// @icon https://s1.ax1x.com/2020/08/13/dSUEsU.png
// @supportURL
// @updateURL
// @downloadURL
// @include *://*/*
// @require         https://cdn.staticfile.org/jquery/2.1.4/jquery.min.js
// @grant GM_setClipboard
// @grant GM_notification
// @grant GM_addStyle
// @grant GM_getValue
// @grant GM_setValue
// @grant GM_registerMenuCommand
// @grant GM_info
// @license MIT
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/414335/%E6%94%B6%E8%97%8F%E6%8E%A7%20%C2%B7%20%E9%93%BE%E6%8E%A5%E6%B8%85%E6%B4%97.user.js
// @updateURL https://update.greasyfork.org/scripts/414335/%E6%94%B6%E8%97%8F%E6%8E%A7%20%C2%B7%20%E9%93%BE%E6%8E%A5%E6%B8%85%E6%B4%97.meta.js
// ==/UserScript==


/****
 *
 2021-11-13
 1、改进 Param 参数获取通过 URLSearchParams 获得
 2、改进 Rules 规则表，设定保留参数
 3、改进 自定义规则生成逻辑，应用保留参数设定
 4、改进 自定义规则配置应用方法，通过 URLSearchParams 函数删除参数

 *



*/

/** 主功能函数 **/
(function(){
    let webUrl=location.href,
        webOrigin=location.origin;
        webHost=location.host.toLowerCase(),
        webSearch=location.search,
        webPathname=location.pathname;

    console.log(GM_info);
    const rules = { //预定义规则
        'mp.weixin.qq.com':{
            //testReg: /^http(?:s)?:\/\/.+/i, // //'', /s?__biz=MzUxMjMxOTE0Nw==&mid=2247531927&idx=1&sn=ba1327de710ee8116f567f5d20f393cc
            //replace: '',
            reserveQuery: ['biz','mid','idx','sn'], //保留的参数
            hash: false
        },
        'www.bilibili.com': {/* Blibili */
            testReg: /^http(?:s)?:\/\/www\.bilibili\.com\/video\/(av\d+).*$/i,
            replace: 'https://www.bilibili.com/$1',
            reserveQuery: ['p'],
            hash: true
        },
        'itunes.apple.com': {/* Apple Stroe */
            testReg: /^http(?:s)?:\/\/itunes\.apple\.com\/(?:\w{2}\/)?([^\/]+)\/(?:[^\/]+\/)?((?:id)\d+).*$/i,
            replace: 'https://itunes.apple.com/cn/$1/$2',
        },
        'chrome.google.com/webstore': {/* Chrome Store */
            testReg: /^http(?:s)?:\/\/chrome\.google\.com\/webstore\/detail\/[^\/]+\/([a-z]{32}).*/i,
            replace: 'https://chrome.google.com/webstore/detail/$1',
        },
        's.taobao.com': {/* Taobao Search */
            testReg: /^http(?:s)?:\/\/s\.taobao\.com\/search.*$/i,
            replace: 'https://s.taobao.com/search',
            reserveQuery: ['q'],
        },
        'list.tmall.com': {/* Tmall Search */
            testReg: /^http(?:s)?:\/\/list\.tmall\.com\/search_product\.htm.*$/i,
            replace: 'https://list.tmall.com/search_product.htm',
            reserveQuery: ['q'],
        },
        'item.taobao.com': {/* Taobao item */
            testReg: /^http(?:s)?:\/\/item\.taobao\.com\/item\.htm.*$/i,
            replace: 'https://item.taobao.com/item.htm',
            reserveQuery: ['id'],
        },
        'detail.tmall.com': {/* Tmall item */
            testReg: /^http(?:s)?:\/\/detail\.tmall\.com\/item\.htm.*$/i,
            replace: 'https://detail.tmall.com/item.htm',
            reserveQuery: ['id'],
        },
        'taobao/tmall.com/shop': {/* Taobao/Tmall Shop */
            testReg: /^http(?:s)?:\/\/(\w+)\.(taobao|tmall)\.com\/shop\/view_shop\.htm.*$/i,
            replace: 'https://$1.$2.com/',
        },
        'c.pc.qq.com': {/* Open Taobao share link from QQ */
            testReg: /^http(?:s)?:\/\/c\.pc\.qq\.com\/middle.html\?.*pfurl=([^&]*)(?:&.*$|$)/i,
            replace: '$1',
            reserveQuery: [],
            methods: ['decodeUrl'],
        },
        'item.m.jd.com': {/* JD mobile to PC */
            testReg: /^http(?:s)?:\/\/item\.m\.jd\.com\/product\/(\d+)\.html(\?.*)?$/i,
            replace: 'https://item.jd.com/$1.html',
        },
        'item.m.jd.com/ware/': {/* JD mobile to PC */
            testReg: /^http(?:s)?:\/\/item\.m\.jd\.com\/ware\/view\.action\?.*wareId=(\d+).*$/i,
            replace: 'https://item.jd.com/$1.html',
        },
        'search.jd.com': {/* JD Search */
            testReg: /^http(?:s)?:\/\/search\.jd\.com\/Search\?.*$/i,
            reserveQuery: ['keyword', 'enc'],
        },
        're.jd.com': {/* JD hot sell */
            testReg: /^http(?:s)?:\/\/re\.jd\.com\/cps\/item\/(\d+)\.html.*$/i,
            replace: 'https://item.jd.com/$1.html',
        },
        'weibo.com/u': {/* Weibo personal homepage to mobile */
            testReg: /^http(?:s)?:\/\/(?:www\.)?weibo\.com\/u\/(\d+)(\?.*)?$/i,
            replace: 'https://m.weibo.cn/$1',
        },
        'weibo.com': {/* Weibo article page to mobile */
            testReg: /^http(?:s)?:\/\/(?:www\.)?weibo\.com\/(?:\d+)\/(\w+)(\?.*)?$/i,
            replace: 'https://m.weibo.cn/status/$1',
        },
        'greasyfork.org': {/* Greasyfork Script */
            testReg: /^http(?:s)?:\/\/(?:www\.)?greasyfork\.org\/(?:[\w-]*\/)?scripts\/(\d+)-.*$/i,
            replace: 'https://greasyfork.org/zh-CN/scripts/$1',
        },
        'store.steampowered.com|steamcommunity.com': {/* Steam */
            testReg: /^http(?:s)?:\/\/(store\.steampowered|steamcommunity)\.com\/app\/(\d+).*$/i,
            replace: 'https://$1.com/app/$2',
        },
        'meta.appinn.com': {/* Appinn BBS */
            testReg: /^http(?:s)?:\/\/meta\.appinn\.net\/t(?:\/[^/]*)*?\/(\d+)(\/.*$|$)/i,
            replace: 'https://meta.appinn.net/t/$1',
        },
        'amazon.co.jp': {/* amazon.co.jp */
            testReg: /^http(?:s)?:\/\/(?:www\.)?amazon\.co\.jp\/([^\/]+)\/dp\/(\w+)\/.*$/i,
            replace: 'https://www.amazon.co.jp/$1/dp/$2',
        },
        'yangkeduo.com': {/* Pin Duo Duo product Page */
            testReg: /^http(?:s)?:\/\/mobile\.yangkeduo\.com\/goods.html\?.*$/i,
            reserveQuery: ['goods_id'],
        },
        'other': {/* All url */
            testReg: /^(http(?:s)?:\/\/[^?#]*)[?#].*$/i,
            reserveQuery: ['id', 'tid', 'uid', 'q', 'wd', 'query', 'keyword'],
        }
    }

    /** 必须函数 */

    let localConfig=localStorage['Cat_LC_Config']?JSON.parse(localStorage['Cat_LC_Config']):{"param":[], testReg:'', OpenMode:'history'};
    const LinkCleaner={
        webRule : rules[webHost],
        theUrlParam : new URLSearchParams(webSearch),
        theUrlParamKeys : [],
        reserveQueryJSON : {},
        param_Count : function(search, len){ //分割参数，获取参数key
            let Params=new URLSearchParams(search||location.search),
                theUrlParam=[];
            for(let key of Params.keys()) {
                theUrlParam.push(key);
            }

            //const theUrlParam=search.replace(/^\?/,'').split('&');
            if(len) return theUrlParam.length;
            return theUrlParam;
        },
        PureUrl : function(url){
            switch(localConfig.OpenMode) {
                case 'location':
                    if(window.location.href !== url) window.location.href = url;
                default:
                case 'history':
                    history.pushState('', '', url);
                    break;
            }
        },
        Cat_get_pure_url : function(url){
            url = url||window.location.href;
            const hash = url.replace(/^[^#]*(#.*)?$/, '$1')
            const base = url.replace(/(\?|#).*$/, '')
            let pureUrl = url
            const getQueryString = function(key) {
                let ret = url.match(new RegExp('(?:\\?|&)(' + key + '=[^?#&]*)', 'i'))
                return ret === null ? '' : ret[1]
            }
            /* 链接处理方法 */
            const methods = {
                decodeUrl: function(url){return decodeURIComponent(url) }
            }
            for(let i in rules){
                let rule = rules[i]
                let reg = rule.testReg
                let replace = rule.replace
                if (reg.test(url)){
                    let newQuerys = ''
                    if(typeof(rule.reserveQuery)!=='undefined' && rule.reserveQuery.length>0){
                        rule.reserveQuery.map((reserveQuery) => {
                            const ret = getQueryString(reserveQuery)
                            if(ret !== '') newQuerys += (newQuerys.length ? '&' : '?') + ret;
                        })
                    }
                    newQuerys += typeof(rule.hash)!=='undefined' && rule.hash ? hash : '';
                    pureUrl = (typeof(replace)==='undefined'?base:url.replace(reg, replace) ) + newQuerys;
                    if(typeof(rule.methods)!=='undefined' && rule.methods.length>0){
                        rule.methods.map((methodName)=>{
                            pureUrl = methods[methodName](pureUrl)
                        })
                    }
                    break;
                }
            }
            return pureUrl;
        },
        /* 复制净化后的链接和标题 */
        getCleanUrlAndTitle : function(){
            const pureUrl = this.Cat_get_pure_url();
            const ttileAndUrl = document.title + ' \n' + pureUrl;
            GM_setClipboard(ttileAndUrl);
            CatCLNotification('链接地址已净化，并和网站标题一起复制到剪切板中~');
            PureUrl(pureUrl);
        },
        /* 复制净化后的链接 */
        getCleanUrl : function(){
            const pureUrl = this.Cat_get_pure_url();
            GM_setClipboard(pureUrl);
            CatCLNotification('链接地址已净化并复制到剪切板中~');
            PureUrl(pureUrl);
        },
        /* 直接复制页面链接和标题 */
        getUrlAndTitle : function(){
            const theUrl = document.title + ' \n' + window.location.href;
            GM_setClipboard(theUrl);
            CatCLNotification('网站标题 & 链接地址已复制到剪切板中~');
            this.CatLCToggleEl();
        },
        /*** 面板切换 ***/
        CatLCToggleEl : function(el){
            el = document.querySelector('#Cat_lc_panel');
            if(!el) return false;
            $(this).toggleClass('show');
            $(this).find('span').toggleClass('show');
            $('#Cat_lc_panel').slideToggle('fast', 'linear');
        },
        /* 清理整个页面 */
        cleanAllPage : function(){
            console.log(this);
            const aTagEles = document.getElementsByTagName('a');
            for (let i = 0; i < aTagEles.length; i++) {
                let theLink = aTagEles[i].href;
                if (theLink.match(/^(http:\/\/|https:\/\/|\/\/)/) !== null) {
                    theLink = theLink.replace(/^\/\//, 'https://');
                    aTagEles[i].href = Cat_get_pure_url(theLink);
                }
            }
            //panel.style.display = '';
            CatCLNotification('页面中所有链接已净化~\n可能导致部分链接无法使用，刷新后恢复。');
            this.CatLCToggleEl();
        },
        CustomRule : function(search){
            const CR=$('#Cat_lc_panel_CustomRule');
            if(CR.css('display')=='none') {

                const theUrlParam=this.param_Count();

                const p=$('<p>'),
                      UrlRule=new RegExp(location.href.replace(/\/[^/]+(\.\w+)?\/?\?.+/, '\/.+$1').replace(/\/%[^/]+/,'').replace(/\//g,'\\/'), 'i'),
                      SaveBtn=$('<input>').attr({type: 'button', id:'lc_CustomRule_SaveBtn'}).val('应用配置'),
                      CloseBtn=$('<input>').attr({type: 'button', id:'lc_CustomRule_CloseBtn'}).val('关闭'),
                      UrlText=$('<input>').attr({type: 'text', id:'lc_CustomRule_UrlRule', placeholder:'网址匹配采用正则表达式', title:'网址匹配采用正则表达式'}).val(localConfig['testReg']||UrlRule),
                      Option_Auto=$('<label for="lc_CustomRule_AutoCleaner">').text('自动净化链接').append($('<input>').attr({type: 'checkbox', id: 'lc_CustomRule_AutoCleaner'})),
                      Option_OpenMode=$('<select></select>').attr({id: 'lc_CustomRule_OpenMode'}).append('<option value="history">免刷新·history</option><option value="location">刷新·location</option>');
                //history 通过变更历史记录净化链接，有较好的浏览体验，适合个人访问使用。但该方法无法检验净化后的访问结果，有可能因为有用的参数被净化而导致分享链接出错。
                //location 通过地址跳转净化链接，会刷新网页，影响浏览体验，适合分享地址使用，及时检验净化后的可访问性。

                console.log(theUrlParam);

                if(theUrlParam.length==0) {
                    CR.html('<span class="lc_panle_CustomRule_title">没有可选择的参数</span>');
                } else {
                    //CR.html('<span class="lc_panle_CustomRule_title">选择需要过滤的参数</span><div id="panel_CustomRule_param_new"></div>');
                    CR.html('<fieldset><legend class="lc_panle_CustomRule_title"> 选择需要过滤的参数 </legend><div id="panel_CustomRule_param_new"></div></fieldset>');


                    if(this.webRule) {
                        for(let key of this.webRule.reserveQuery) {
                            this.reserveQueryJSON[key]=true;
                        }
                    }
                    //生成自定义规则参数选项
                    theUrlParam.map(function(item, index, arr) {
                        let label=$('<label>').attr({for:'lc_CustomRule_param_' + index}).text(item),
                            checkbox=$('<input>').attr({type: 'checkbox', id:'lc_CustomRule_param_' + index}).val(item)

                        //必须参数检查
                        if(LinkCleaner.reserveQueryJSON[item.replace(/_/g,'')]) {
                            checkbox.prop('disabled', true);
                            label.attr('title', '该参数为必须参数');
                            label.css({'background':'red'});
                        }
                        $('#panel_CustomRule_param_new').append(label.append(checkbox));
                    }, this.theUrlParam);
                }

                //CR.append('<span class="lc_panle_CustomRule_title">其它已存在的规则</span><div id="panel_CustomRule_param_exist"></div>');
                CR.append('<fieldset><legend class="lc_panle_CustomRule_title"> 其它已存在的规则 </legend><div id="panel_CustomRule_param_exist"></div></fieldset>');

                $('#Cat_lc_panel_CustomRule').append(p, '<span class="lc_panle_CustomRule_InputTitle">匹配网址：</span>', UrlText, Option_Auto, '<span class="lc_panle_CustomRule_InputTitle">净化模式：</span>', Option_OpenMode, SaveBtn, CloseBtn, '<br>');



                //配置加载
                for(let key of localConfig['param']) {
                    let e=$('#panel_CustomRule_param_new>label>input[type="checkbox"][id^="lc_CustomRule_param_"][value="'+key+'"]'),
                        label=$('<label>').attr({for:'lc_CustomRule_param_exist_' + key}).text(key),
                        checkbox=$('<input>').attr({type: 'checkbox', id:'lc_CustomRule_param_exist_' + key}).val(key);
                    if(e.length>0) e.prop('checked', true);
                    else $('#panel_CustomRule_param_exist').append(label.append(checkbox.prop('checked', true)));
                }
                if(localConfig.AutoCleaner) $('#lc_CustomRule_AutoCleaner').prop('checked', true);

                //绑定事件
                SaveBtn.on('click', function(){
                    let theSearch=location.search;
                    localConfig['param']=[];
                    $('#Cat_lc_panel_CustomRule label>input[type="checkbox"][id^="lc_CustomRule_param_"]').each(function(i, e){
                        if(e.checked) localConfig['param'].push(e.value);
                        let rule=new RegExp('[?&]'+e.value+'='+'[^&]*','i');
                        console.log(e, rule);
                        theSearch=theSearch.replace(rule,'');
                    });
                    //localConfig.testReg=new RegExp($('#Cat_lc_panel_CustomRule>#lc_CustomRule_UrlRule').val().replace(/\\/g, "\\\\"));
                    let testReg=$('#Cat_lc_panel_CustomRule>#lc_CustomRule_UrlRule').val();
                    localConfig.testReg=testReg;
                    console.log(theSearch);
                    localConfig.AutoCleaner=$('#lc_CustomRule_AutoCleaner').is(':checked');
                    StorageDB_GM('Cat_LC_Config','', 'localStorage').insert(localConfig);
                    //localStorage['Cat_LC_Config']=JSON.stringify(localConfig);

                    console.log(this);
                    LinkCleaner.AutoCleaner();
                });
                CloseBtn.on('click', function(){
                    CR.slideToggle('fast', 'linear');
                });
                CR.slideToggle('fast', 'linear');

                if(!eval(localConfig.testReg).test(location.href)) {
                    UrlText.css({'background-color':'#ffc8ff'});
                    p.append('<span style="color:red">当前网址与规则不匹配</span>');
                }
            }
            else
                CR.slideToggle('fast', 'linear');
        },
        AutoCleaner: function(){
            console.log(localConfig.testReg);
            let newUrl, testReg=eval(localConfig.testReg);

            console.log(testReg);

            if(testReg.test(location.href)) {
                localConfig['param'].forEach((e)=>{
                    this.theUrlParam.delete(e); //删除掉不要的参数
                });
                if(this.theUrlParam.toString().length==0) newUrl=webUrl.replace(/\?.+/i,'');
                else newUrl=webOrigin+webPathname+"?"+this.theUrlParam;
                this.PureUrl(newUrl);
                $('div#Cat_lc_button').addClass('work');
            } else {
                console.log('%c 地址不匹配，停止链接清洗', 'background: yellow');
                //CatCLNotification('地址不匹配，停止链接清洗');
            }
        },
        UI : function(){
            /** 添加界面 **/
            const CatLCPopPanel = document.createElement('div');
            CatLCPopPanel.id = 'Cat_link_cleaner';
            CatLCPopPanel.innerHTML = `
<div id="Cat_lc_button"><span>︽</span></div>
<div id="Cat_lc_panel">

<div id="Cat_lc_panel_CustomRule" style="display:none;">
</div>
<div id="Cat_lc_panel_content">
<div class="Cat_lc_button" id="Cat_CL_TitleBtn" data-tip="Copy pure link with title">复制网页标题和净化后的链接</div>
<div class="Cat_lc_button" id="CatCLButtonPure" data-tip="Copy pure link only">复制净化后的链接</div>
<div class="Cat_lc_button" id="CatCLButtonCleanAll" data-tip="Clean all links in this page">净化网页中所有链接</div>
<div class="Cat_lc_hr"></div>
<div class="Cat_lc_button" id="Cat_CustomRule" data-tip="Custom Rule">自定义规则</div>
<div class="Cat_lc_button" id="Cat_AutoCleaner" data-tip="Auto Cleaner" title="需要搭配自定义规则使用">自动清洗</div>
<div class="Cat_lc_hr"></div>
</div>
</div>`;
            /**/
            document.body.insertBefore(CatLCPopPanel, document.body.lastChild.nextSibling);

            /** 事件响应函数 **/

            /** 添加监听器 **/
            $('#Cat_lc_panel>#Cat_lc_panel_content>.Cat_lc_button').each(function(i, eve){
                $(eve).on('click', function(e){
                    //console.log(this, e, this.id, e.id);
                    switch(this.id) {
                        case 'Cat_CL_TitleBtn':
                            /* 净化并复制标题和链接 */
                            LinkCleaner.getCleanUrlAndTitle();
                            break;
                        case 'CatCLButtonPure':
                            /* 净化并复制链接 */
                            LinkCleaner.getCleanUrl();
                            break;
                        case 'buttonCopyT':
                            /* 复制当前链接和标题 */
                            LinkCleaner.getUrlAndTitle();
                            break;
                            /* 清理整个页面 */
                        case 'CatCLButtonCleanAll':
                            LinkCleaner.cleanAllPage();
                            break;
                        case 'Cat_CustomRule':
                            LinkCleaner.CustomRule();
                            break;
                        case 'Cat_AutoCleaner':
                            localConfig.AutoCleaner=!localConfig.AutoCleaner?true:false;
                            CatCLNotification('【已'+(localConfig.AutoCleaner?'开启':'关闭')+'】自动净化功能，将在新打开页面生效', localConfig.AutoCleaner?LinkCleaner.AutoCleaner:'');
                            StorageDB_GM('Cat_LC_Config','', 'localStorage').add('AutoCleaner', localConfig.AutoCleaner);
                    }
                });
            });

            console.log(this);
            /* 面板切换按钮 */
            $('#Cat_lc_button').on('click', this.CatLCToggleEl);
            UI_CSS();
        }
    }

    /** 获取是否显示页面工具栏 **/
    let isShowPageBar = GM_getValue('SHow_page_bar', true);

    if (isShowPageBar) LinkCleaner.UI();
    if(localConfig.AutoCleaner) {
        if(!localConfig.param) {
            CatCLNotification('不存在配置，请先添加自定义规则');
            return false;
        }
        else LinkCleaner.AutoCleaner(); //自动清理
    }


    function UI_CSS(){
        /** 添加样式 **/
        GM_addStyle(`
#Cat_link_cleaner {
width: 100%;
position: fixed;
left: 0;
bottom: 0;
z-index: 99999999;
pointer-events: none;
font-family: 'Source Sans Pro', arial;
text-align: left;
}

#Cat_link_cleaner * {
pointer-events: auto;
}

#Cat_lc_button {
position: relative;
margin: 0 auto;
width: 36px;
height: 18px;
color: #333;
font-size: 16px;
line-height: 10px;
cursor: pointer;
text-align: center;
border: 1px solid #333;
border-radius: 18px 18px 0 0;
background-color: #555;
box-shadow: 0 0 5px rgba(0, 0, 0, .1);
transition: 0.5s cubic-bezier(0.18, 0.89, 0.32, 1.28);
opacity: 0.3;
}
#Cat_lc_button.work {
background: red;
}

#Cat_lc_button:hover {
height: 24px;
opacity: 1;
}
#Cat_lc_button > span{
color: #fff;
display: inline-block;
transition: 0.5s;
line-height: 20px;
}
#Cat_lc_button.show{
opacity: 1;
}

#Cat_lc_button > span.show{
transform: rotate(180deg);
line-height: 24px;
}

#Cat_lc_panel {
color: #000;
display: none;
border-top: 5px solid #65adff;
background-color: #FFF;
box-shadow: 0 0 5px rgba(0, 0, 0, .1);
}

#Cat_lc_panel > #Cat_lc_panel_CustomRule {
border: 2px solid #ccc;
padding: 10px 20px;
font-size: 18px;
}

#Cat_lc_panel > #Cat_lc_panel_CustomRule > fieldset {
border: 2px threedface groove;
margin: 0 20px 20px 20px;
padding: 10px 5px;
}

#Cat_lc_panel > #Cat_lc_panel_CustomRule > fieldset > legend.lc_panle_CustomRule_title {
font-size: 30px;
line-height: 1.5;
font-weight: bold;
padding: 5px;
display: block;
padding: 0 20px;
margin: 0 20px;
}

#Cat_lc_panel > #Cat_lc_panel_CustomRule > fieldset > [id^="panel_CustomRule_param_"] > label {
margin: 0 5px;
padding: 5px 10px;
border: 2px solid #ccc;
border-radius: 15px;
background: #ccc;
display: inline-flex;
cursor: pointer;
}

#Cat_lc_panel > #Cat_lc_panel_CustomRule > fieldset > [id^="panel_CustomRule_param_"] > label > input[type="checkbox"] {
margin: auto;
width: 24px;
height: 24px;
}

#Cat_lc_panel > #Cat_lc_panel_CustomRule > .lc_panle_CustomRule_InputTitle {
line-height: 36px;
border: 2px solid #333;
display: inline-block;
background: #ccc;
box-sizing: border-box;
padding: 0 5px;
}

#Cat_lc_panel > #Cat_lc_panel_CustomRule > input[type="button"] {
padding: 0 5px;
height: 40px;
font-size: 20px;
line-height: 1;
box-sizing: border-box;
border: 2px solid #333;
}

#Cat_lc_panel > #Cat_lc_panel_CustomRule > input[type="text"] {
margin: 5px 0;
padding: 2px;
width: 700px;
height: 40px;
font-size: 20px;
border: 2px solid #333;
box-sizing: border-box;
}

#Cat_lc_panel > #Cat_lc_panel_CustomRule > label {
padding: 0 5px;
display: inline-flex;
border: 2px solid #333;
box-sizing: border-box;
background: deepskyblue;
line-height: 36px;
}

#Cat_lc_panel > #Cat_lc_panel_CustomRule > label > input[type="checkbox"][id^="lc_CustomRule_AutoCleaner"] {
margin: auto;
width: 24px;
height: 24px;
}

#Cat_lc_panel > #Cat_lc_panel_CustomRule > #lc_CustomRule_OpenMode {
height: 40px;
font-size: 18px;
border: 2px solid #333;
box-sizing: border-box;
}

#Cat_lc_panel > #Cat_lc_panel_content {
display: flex;
justify-content: center;
align-items: center;
flex: 1 1 none;
flex-wrap: wrap;
width: 100%;
max-width: 900px;
margin: 0 auto;
padding: 16px 0;
text-align: center;
position: relative;
}

#Cat_lc_panel > #Cat_lc_panel_content > .Cat_lc_button {
position: relative;
padding: 8px 16px;
margin: 0 8px 0 0;
font-size: 16px;
line-height: 1.2em;
font-weight: lighter;
border: 1px solid #65adff;
border-radius: 8px;
cursor: pointer;
}
#Cat_lc_panel > #Cat_lc_panel_content > .Cat_lc_button:hover {
border: 1px solid #0062d1;
background-color: #0062d1;
color: #FFF;
font-weight: normal;
}
#Cat_lc_panel > #Cat_lc_panel_content > .Cat_lc_button:hover::before {
content: attr(data-tip);
border-radius:3px;
color: #fff;
left: 50%;
padding: 10px;
white-space: pre;
position: absolute;
text-align: center;
width: calc(100% + 20px);
bottom: calc(100% + 10px);
margin-left: calc(-50% - 20px);
background-color: rgba(0, 0, 0, .9);
}
#Cat_lc_panel > #Cat_lc_panel_content > .Cat_lc_button:hover::after {
content: "";
position: absolute;
width: 0;
height: 0;
left: calc(50% - 8px);
top: -10px;
border-top: 8px solid rgba(0, 0, 0, .8);
border-right: 8px solid transparent;
border-left: 8px solid transparent;
}
#Cat_lc_panel > #Cat_lc_panel_content > .Cat_lc_hr {
width: 100%;
margin: 5px 0;
}
#Cat_lc_panel > #Cat_lc_panel_content > #CatCLButtonCoffee {
padding: 0;
margin: 0;
}
#Cat_lc_panel > #Cat_lc_panel_content > #CatCLButtonCoffee > svg {
width: 35px;
height: 35px;
}
`);
    }

    /* 弹出通知 */
    function CatCLNotification(text, click) {
        GM_notification(text, '清洗链接 Success! ', "data:image/png;base64,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", click);
    };

    function getUrlParam(name, url, option, newVal) {//筛选参数，url 参数为数字时
        var search = url ? url.replace(/^.+\?/,'') : location.search;
        //网址传递的参数提取，如果传入了url参数则使用传入的参数，否则使用当前页面的网址参数
        var reg = new RegExp("(?:^|&)(" + name + ")=([^&]*)(?:&|$)", "i");		//正则筛选参数
        var str = search.replace(/^\?/,'').match(reg);

        if (str !== null) {
            switch(option) {
                case 0:
                    return unescape(str[0]);		//所筛选的完整参数串
                case 1:
                    return unescape(str[1]);		//所筛选的参数名
                case 2:
                    return unescape(str[2]);		//所筛选的参数值
                case 'new':
                    return url.replace(str[1]+'='+str[2], str[1]+'='+newVal);
                default:
                    return unescape(str[2]);        //默认返回参数值
            }
        } else {
            return null;
        }
    }

    function StorageDB_GM(collectionName, key, local) { //collectionName = 对应的 GM_value 表，key = 表中的键名，localDB = 本地配置名（启用时同步修改GM_DB与本地变量DB）
        let DB;
        if(local) DB=localStorage[collectionName]?JSON.parse(localStorage[collectionName]):{};
        else DB=GM_getValue(collectionName) ? GM_getValue(collectionName) : {};
        if(key && !DB[key]) {
            DB[key]={};
            DB.length++;
        }

        //console.log('StorageDB_GM start', collectionName, key, DB[key]);

        return {
            add : function(name, value) {
                if(key)
                    DB[key][name]=value;
                else {
                    DB[name]=value;
                    console.error('缺乏 key ，无法添加数据');
                    //return false;
                }
                //console.log(collectionName, key, DB, DB[key]);
                local ? localStorage[collectionName]=JSON.stringify(DB) : GM_setValue(collectionName, DB);
                return DB;
            },
            del:function(name) {
                if(name) {
                    console.log(DB, DB[name]);
                    delete DB[name];
                    Storage.setItem(collectionName, JSON.stringify(DB));        //回写 localStorage
                } else {
                    //删除整个 localStorage 数据
                    Storage.removeItem(name);
                }
            },
            insert: function(obj){
                if(key) {
                    //console.log('StorageDB_GM insert: ', key, obj);
                    DB[key]=obj;
                } else {
                    DB=obj;
                    console.error('缺乏 key ，无法插入数据');
                }
                console.log(local, collectionName, DB)
                local ? localStorage[collectionName]=JSON.stringify(DB) : GM_setValue(collectionName, DB);
                return DB;
            },
            Updata : function(name, obj, value){
                DB[obj]=DB[obj]||{};
                DB[obj][name]=value;
                Storage.setItem(collectionName, JSON.stringify(DB));        //回写 localStorage
            },
            Query : function(obj,name){
                return DB[obj]?name?(DB[obj][name]?DB[obj][name]:null):DB[obj]:null;
            },
            find : function(name) {
                if(!collectionName) return false;
                if(DB&&key&&DB[key]) return DB[key][name];
                else if(DB&&DB[name]) return DB[name];
                else return false;
            },
            read : function(name){
                if(key) return $.isEmptyObject(DB[key])?null:DB[key];//如果为空，则返回 null
                return $.isEmptyObject(DB)?null:DB;//如果为空，则返回 null
            }
        }
    }

    /* 注册菜单项 */
    GM_registerMenuCommand('复制【净化】链接和标题', LinkCleaner.getCleanUrlAndTitle);
    GM_registerMenuCommand('复制【净化】链接', LinkCleaner.getCleanUrl);
    GM_registerMenuCommand('【净化】所有链接', LinkCleaner.cleanAllPage);
    GM_registerMenuCommand('显示/隐藏页面工具条', () => {
        GM_setValue('SHow_page_bar', !isShowPageBar);
        isShowPageBar = GM_getValue('SHow_page_bar', true);
        alert('页面工具条已被设置为【' + (isShowPageBar ? '显示' : '隐藏') + '】，仅在此后新打开页面中生效。');
    });
})();

