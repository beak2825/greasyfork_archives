// ==UserScript==
// @name         Github Compat For Chrome
// @name:zh-CN   Github兼容性优化，Chrome版
// @namespace    https://greasyfork.org/users/159546
// @version      1.2.3
// @description  Fix Github problem while using Chrome if needed.
// @description:zh-CN 优化Github在Chrome浏览器上的使用体验和兼容性，如果需要这么做。
// @author       LEORChn
// @include      *://github.com/*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/369095/Github%20Compat%20For%20Chrome.user.js
// @updateURL https://update.greasyfork.org/scripts/369095/Github%20Compat%20For%20Chrome.meta.js
// ==/UserScript==
var showNoticeWhenLaunched = 1
; // 成功加载这个脚本后在左上角显示绿色OK字样，数字1为显示，其他数字为隐藏
/* Loading order of compat js: (same order can be load by async)
    1 - assets/compat-(*).js
    2 - assets/frameworks-(*).js
    3 - assets/github-(*).js
   Be affected method:
    1 - jsCompat()
    2 - load()
   Use this User-Agent to update js compat packs' link in the HTML page:
    Mozilla/5.0 (Windows NT 6.1; WOW64; Trident/7.0; rv:11.0) like Gecko
*/
var inited = false, isCspDisabled = false;
(function() {
    recheck();
})();
function recheck(){
    window.http=http2;
    init();
    if(load())return;
    setTimeout(recheck,100);
}
function init(){ // call once when start loading page
    rmViews();
    if(inited) return;
    if(fc('footer').length==0) return; // 找到 footer 就说明网页基本加载完毕，可以开始加载 JS 了
    inited=true;
}
function rmViews(){
    tryRemove(fc('signup-prompt-bg'),0); // 登录提示
    tryRemove(fc('unsupported-browser'),0); // 浏览器太旧提示
}
function tryRemove(d,i){
    try{
        if(!isNaN(i) && d[i]) d[i].remove();
        else d.remove();
    }catch(e){}
}
function load(){ // call once when loaded page
    if(document.readyState.toLowerCase()=='complete'){
        //-- 首页
        fixDashboardFeed();
        //-- 个人资料
        fixSetPinnedRepositories();
        //-- 仓库
        fixWatcherInline();
        fixBranchSwitch();
        fixLanguageDetail();
        fixPopularContent();
        whateverDaemon();
        launchedNotice();
        jsCompat();
        return true;
    }
}
//============== 不知道什么时候会加载完成，但先注册守护
function whateverDaemon(){
    unblockButtons();
    fixCommitDetail();
    fixCommitDetailButton();
    setTimeout(whateverDaemon,3000);
}
//============== 通用界面 以下
function unblockButtons(){
    var t=$$('[disabled]');
    for(var p=0; p<t.length; p++) t[p].removeAttribute('disabled');
}
function fixCommitDetailButton(){ // 这个因为仓库页面和全局搜索页面都有，所以升级为通用
    var t=$$('button.ellipsis-expander'),
        p=$$('.commit-desc');
    for(var i=0; i<t.length; i++) fixCommitDetailButtonImpl(t[i], p[i]);
}
function fixCommitDetailButtonImpl(btn, desc){
    btn.onclick=function(){
        if(desc) desc.style.display= desc.style.display == ''? 'block': ''; // 本身会被class隐藏，所以空白时隐藏，block时显示
    }
}
//============== 通用界面 以上
//============== 首页 以下
function fixDashboardFeed(){
    var t=$('div.news>.js-all-activity-header+div.js-dashboard-deferred');
    if(t) { t.setAttribute('src', t.getAttribute('data-src')); insertItsSrc(t); fixDashboardFeedNext(); }
}
function fixDashboardFeedNext(){
    var t= $('form.js-ajax-pagination>button.ajax-pagination-btn');
    if(t) t.onclick=function(){ var p=this.parentElement; p.setAttribute('src', p.getAttribute('action')); repItsSrc(p); return false;}
    var y= $$('button.js-details-target.text-gray-dark');
    for(var i=0;i<y.length;i++)
        y[i].onclick=function(){
            var p=this.parentElement.parentElement.getElementsByClassName('Details-content--hidden dashboard-rollup-items')[0];
            p.style.cssText= p.style.cssText==''? 'display:block !important': '';
        }
    setTimeout(fixDashboardFeedNext,3000);
}
//============== 首页 以上
//============== 个人资料界面 以下
//------ 自己资料
function fixSetPinnedRepositories(){
    var t=$('details>summary+details-dialog>include-fragment.octocat-spinner');
    if(t){ t.setAttribute('src', t.parentElement.parentElement.getAttribute('data-deferred-details-content-url')); repItsSrc(t); }
}

//============== 个人资料界面 以上
//============== 仓库内界面 以下
//------ 仓库 > 通用
function fixWatcherInline(){
    var t=$('ul.pagehead-actions>li>form');
    if(t) t.style.display='table-row-group';
}
//------ 仓库 > code
// fixCommitDetailButton 因为仓库页面和全局搜索页面都有，所以升级为通用
function fixBranchSwitch(){
    var t=$('details>summary.select-menu-button+details-menu[src]');
    if(t) insertItsSrc(t);
}
function fixLanguageDetail(){
    var t=$('button.repository-lang-stats-graph'), p=$('div.stats-switcher-viewport.js-stats-switcher-viewport'), c='is-revealing-lang-stats';
    if(t) t.onclick=function(){ if(p) if(!isCspDisabled) if(hasClass(p,c)) removeClass(p,c); else addClass(p,c); }
}
function fixCommitDetail(){
    var t=$('include-fragment.commit-loader .loader-error');
    if(t){
        while(t.nodeName != 'INCLUDE-FRAGMENT') t=t.parentElement;
        repItsSrc(t);
    }
}
//------ 仓库 > Insights > Traffic
function fixPopularContent(){
    insertItsSrc($('include-fragment.top-lists[src]'));
}
//============== 仓库内界面 以上
function launchedNotice(){
    if(showNoticeWhenLaunched != 1) return;
    var t=ct('div', 'ok :)');
    t.style.cssText='position:fixed; left:0; top:0; color:#0f0; z-index:99999999';
    document.body.appendChild(t);
}
function repItsSrc(t){
    insertItsSrc(t,true);
}
function insertItsSrc(t,repMode){
    if(t) http('get',t.getAttribute('src'),'',function(){if(repMode) t.outerHTML=this.responseText; else t.innerHTML=this.response;});
}
//============== CSP 已禁用模式 专区 以下
var baseUrl=
    'https://assets-cdn.github.com/assets/';
    //'/LEORChn/GreasyMonkey/raw/master/GithubCompatForChrome/lib/';
    //'https://leorchn.github.io/archive/assets-cdn.github.com/assets/';
var p_a, p_b, p_c, p_d, definderPhase = 0;
function jsCompat(){ // 经典的入口。。
    switch(definderPhase){
        case 0:
            pl('Github Compat: Trying to enter the CSP-Disabled Mode.');
            window.define = function(a,b,c,d){
                pl('Github Compat: CSP is disabled, one of the params is -> '+a);
                p_a=a; p_b=b; p_c=c; p_d=d;
                window.define = undefined;
                definderPhase++;
                jsCompat();
            }
            //addjs(baseUrl+'github-a62aa302e53c46b4501ee9c8c591ed18.js');
            addjs(baseUrl+'github-de3df06b3ffbf7fc82dc1aa0aacf2faf.js');
            return; // 这个地方只要等 github.js 调用一次就可以触发下一步操作
        case 1:
            addjs(baseUrl+'compat-3c69a4d015c4208bce7a9d5e4e15a914.js');
            addjs(baseUrl+'frameworks-5cc68fa4a212f8349010ddff8198506c.js');
            definderPhase++;
            break;
        case 2:
            if(window.define){
                window.define(p_a, p_b, p_c, p_d);
                isCspDisabled=true;
                pl('Github Compat: All Done! You are entered the CSP-Disabled Mode now.');
                return;
            }
    }
    setTimeout(jsCompat, 200);
}
//============== CSP 已禁用模式 专区 以上
//----- my ezjs lib
function fv(id){return document.getElementById(id);}
function ft(tag){return document.getElementsByTagName(tag);}
function fc(cname){return document.getElementsByClassName(cname);}
function ct(tag,t){var p=document.createElement(tag); if(t)p.innerText=t; return p;}
function $(s){return document.querySelector(s);}
function $$(s){return document.querySelectorAll(s);}
function msgbox(msg){alert(msg);}
function inputbox(title,defalt){return prompt(title,defalt);}
function pl(s){console.log(s);}
function hasClass(e,n){ return !!e.className.match(new RegExp("(\\s|^)"+n+"(\\s|$)")); }
function addClass(e,n){ if(!hasClass(e,n)) e.className+=' '+n; }
function removeClass(e,n){ if(hasClass(e,n)) e.className=e.className.replace(new RegExp('(\\s|^)'+n+'(\\s|$)'), ' '); }
function http2(method,url,formed,dofun,dofail){
	var x=new XMLHttpRequest();
	x.timeout=60000;
	x.responseType="text";
	if(location.protocol.includes('https')) url=url.replace('^http:','https:');
	x.open(method.toUpperCase(),url,true);
	x.onload=dofun;
	x.ontimeout=x.onerror= dofail? dofail: null;
	x.send(formed?formed:'');
}
function addjs(url,async){
    var d=ct('script');
    if(async) d.async='async';
    d.type='application/javascript';
    d.src=url;
    ft('body')[0].appendChild(d);
}
//废弃代码备份用 鬼知道什么时候要参考看看的
//========================================================================================================
// unsupported-(*).js 可能只是用来激活顶部浏览器太旧提示的，不管他或许也行
/*function jsRemove(){ // remove assets/unsupported-(*).js if needed
    var spt=ft('script');
    for(var i=0,len=spt.length;i<len;i++) if(spt[i].src.includes('unsupported')) spt[i].remove();
}*/
