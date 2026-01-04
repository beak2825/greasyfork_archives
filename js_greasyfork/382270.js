// ==UserScript==
// @name         for fun
// @name:zh-CN   有趣
// @namespace    https://greasyfork.org/users/159546
// @version      1.0.2
// @description  fun
// @description:zh-CN 用来玩的。YouTube显示赞踩百分比、去除自动翻译页面的无关语言。qqe2站长傻逼，祝早日倒闭。
// @author       LEORChn
// @include      *://www.youtube.com/watch?*
// @include      *://qqe2.com/
// @include      *://www.qqe2.com/
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/382270/for%20fun.user.js
// @updateURL https://update.greasyfork.org/scripts/382270/for%20fun.meta.js
// ==/UserScript==
var ID_DIV_YOUTUBE_REVIEW_PERCENT = 'youtubereviewpercent',
    ID_SCRIPT_QQE2_MESSAGE_OVERRIDE = 'qqe2messageoverride';
var inited=false, isDaemon=false;
(function(){
    recheck();
})();
function recheck(){
    init();
    if(!isDaemon) daemon();
    if(load())return;
    setTimeout(recheck,100);
}
function init(){ // call once when start loading page
    if(inited) return;
    if(ft('body').length==0) return;
    // write code here
    inited=true;
}
function load(){ // call once when loaded page
    if(document.readyState.toLowerCase()=='complete'){
        // write code here
        return true;
    }
}
function daemon(){
    isDaemon=true;
    addYoutubeReviewPercent();
    removeYoutubeUnrelatedSubtitle();
    addJsonEditorMessageOverride();
    setTimeout(daemon,1000);
}
//----- YouTube
function addYoutubeReviewPercent(){
    if(fv(ID_DIV_YOUTUBE_REVIEW_PERCENT)) return;
    var core = fv('watch8-sentiment-actions');
    if(!core) return;
    var inject = fv('watch7-views-info').nextElementSibling;
    var info = core.innerText.replace(/[\r\n,]/g,'').split(/\s+/);
    var viewmode = info.length==3;
    if(viewmode) for(var i=3;i>=0;i--) info[i]=info[i-1] || 0;
    var view = parseInt(info[0]), like = parseInt(info[2]), dislike = parseInt(info[3]);
    var newdiv = ct('span');
    newdiv.id = ID_DIV_YOUTUBE_REVIEW_PERCENT;
    newdiv.style.cssText = 'float:left;text-align:right';
    viewmode = viewmode? (like + dislike + ' 位'): (((like + dislike) * 100 / Math.max(view, 1)).toFixed(2) + ' % 的');
    newdiv.innerHTML = '%s观众参与点评<br/>'.replace('%s', viewmode) + (like * 100 / Math.max(like+dislike, 1)).toFixed(2)+' % 的好评率 ';
    inject.parentNode.appendChild(newdiv);
}
function removeYoutubeUnrelatedSubtitle(){
    var titleDiv = $('.ytp-panel-title');
    if(titleDiv && (titleDiv.innerText=='自动翻译' || titleDiv.innerText=='字幕')); else return;
    /**  -={ 第一页面 选项保护 }=-
     *  自动播放：【自动】
     *  注释：    【注释】
     *  速度：    【速度】
     *  字幕：    【关闭】【各种语言】
     *  画质：    【画质】【自动】
     *
     **  -={ 已有字幕 选项保护 }=-
     *  关闭：        【关闭】
     *  英语：        【英语】
     *  中文（简体）：【中文】
     *  中文（台湾）：【中文】
     *  自动翻译：    【自动】
     *  添加字幕：    【添加】
     *
     **  -={ 自动翻译 选项保护 }=-
     *  英语：        【英语】
     *  中文（简体）：【中文】
     *  中文（台湾）：【中文】
     */
    var protectedLangs = ['英语', '中文', '关闭', '自动', '添加', '速度', '注释', '画质'];
    var langs = $$('.ytp-menuitem');
    nextElement:for(var i=langs.length-1; i>=0; i--){
        if(langs[i]){
            for(var i2=0; i2<protectedLangs.length; i2++) if(langs[i].innerText.includes(protectedLangs[i2])) continue nextElement;
            langs[i].remove();
        }
    }
}
//----- qqe2
function addJsonEditorMessageOverride(){
    if(fv(ID_SCRIPT_QQE2_MESSAGE_OVERRIDE)) return;
    var core = fv('toTree');
    if(!core || core.nodeName != 'BUTTON') return;
    core.style.marginTop='200px'; // 傻逼站长真的把按钮往上挪了！ 祝早日倒闭
    var inject=ct('script');
    inject.id=ID_SCRIPT_QQE2_MESSAGE_OVERRIDE;
    inject.innerText="setTimeout(regToTreeMouseDownEvent,1000);"+
        "function regToTreeMouseDownEvent(){var d=document.getElementById('toTree');if(d)d.addEventListener('mousedown', refreshJsonEditorMessages);else setTimeout(regToTreeMouseDownEvent,1000);}"+
        "function refreshJsonEditorMessages(){var d=document.querySelectorAll('body>div[style]:not([id])');if(d.length>0)d[0].innerHTML='';}";
    document.body.appendChild(inject);
}
//----- my ezjs lib
function fv(id){return document.getElementById(id);}
function ft(tag){return document.getElementsByTagName(tag);}
function fc(cname){return document.getElementsByClassName(cname);}
function $(s){return document.querySelector(s);}
function $$(s){return document.querySelectorAll(s);}
function ct(tag){return document.createElement(tag);}
function msgbox(msg){alert(msg);}
function inputbox(title,defalt){return prompt(title,defalt);}
function pl(s){console.log(s);}