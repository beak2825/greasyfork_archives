// ==UserScript==
// @name         iZhihu
// @namespace    https://github.com/unogz/izhihu
// @version      2.13.3
// @description  知乎插件
// @match        http://www.zhihu.com/*
// @include      http://www.zhihu.com/*
// @match        https://www.zhihu.com/*
// @include      https://www.zhihu.com/*
// @require      http://cdn.staticfile.org/jquery/1.8.2/jquery.min.js
// @require      http://cdn.staticfile.org/iCheck/1.0.1/icheck.min.js
// @resource     jqUI_CSS http://cdn.staticfile.org/iCheck/1.0.1/skins/square/blue.css
// @resource     ui-bg_icheck-skin_square_blue http://cdn.staticfile.org/iCheck/1.0.1/skins/square/blue.png
// @resource     ui-bg_icheck-skin_square_blue2x http://cdn.staticfile.org/iCheck/1.0.1/skins/square/blue@2x.png
// @require      http://cdn.staticfile.org/jqueryui/1.10.4/jquery-ui.min.js
// @require      http://cdn.staticfile.org/purl/2.3.1/purl.min.js
// @require      http://cdn.staticfile.org/underscore.js/1.6.0/underscore-min.js
// @grant        GM_xmlHttpRequest
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @grant        GM_getResourceURL
// @icon         https://raw.githubusercontent.com/unogz/izhihu/develop/misc/xpi-config/icon64.png
// @copyright    2015+, @钢盅郭子 @刘勇 @墨磊
// @downloadURL https://update.greasyfork.org/scripts/350/iZhihu.user.js
// @updateURL https://update.greasyfork.org/scripts/350/iZhihu.meta.js
// ==/UserScript==

var jqUI_CssSrc = GM_getResourceText("jqUI_CSS")
GM_addStyle (jqUI_CssSrc.replace('url(blue', 'url(http://cdn.staticfile.org/iCheck/1.0.1/skins/square/blue'));

var version='2.13.3';
var updateDate='2016-4-25';

if ( typeof unsafeWindow === "undefined") {
    unsafeWindow    = ( function () {
        var dummyElem   = document.createElement('p');
        dummyElem.onclick=function(){return window;};
        return dummyElem.onclick ();
    } ) ();
}

//主入口
//$(function main(){


/**
 * @class Utils 辅助类
 */
function utils(){
};

var cfgDefault = {
    'comment_sidebar': true
  , 'answer_orderByTime': false
  , 'AuthorList':false
  , 'ShowComment':true
  , 'HomeLayout':false
  , 'QuickFavo':true
  , 'QuickFavoPinned':{}
  , 'AuthorRear':false
  , 'HomeNoti':false
  , 'QuickBlock':false
  , 'Noti7':true
  , 'HomeFeedsColumns':false
  , 'RightComment_AutoScrollPageWhenClosing':true
  , 'TopNavAutoFold':false
};
  
/**
 * 读取配置
 */
utils.getCfg = function(key){
  if(!key)return false;
  var cfg = $.extend(cfgDefault, this.getValue('izhihu',cfgDefault));
  return key ? cfg[key] : cfg;
};

utils.setCfg = function(key,value){
  if(!key)return;
  var cfg = $.extend(cfgDefault, this.getValue('izhihu',cfgDefault));
  cfg[key]=value;
  this.setValue('izhihu',cfg);
};

/**
 * 读取存储
 */
utils.getValue = function(key, defaultValue){
    var v=unsafeWindow.localStorage[key];
    if(v)
        return JSON.parse(v);
    else
        return defaultValue;
};

/**
 * 写入存储
 */
utils.setValue = function(key, value){
  unsafeWindow.localStorage[key] = JSON.stringify(value);
};

/**
 * 删除存储
 */
utils.deleteValue = function(key){
  return delete unsafeWindow.localStorage[key];
};

utils.transferOldCfg=function(){
    var oldHomeLayout = unsafeWindow.localStorage['izh_HomeLayout']
      , oldAuthorList = unsafeWindow.localStorage['izh_AuthorList']
      , oldShowComment = unsafeWindow.localStorage['izh_ShowComment']
      , oldQuickFavo = unsafeWindow.localStorage['izh_QuickFavo']
      , oldAuthorRear = unsafeWindow.localStorage['izh_AuthorRear']
      , oldHomeNoti = unsafeWindow.localStorage['izh_HomeNoti']
    ;
    if(oldHomeLayout){
        izhHomeLayout=oldHomeLayout;
        unsafeWindow.localStorage.removeItem('izh_HomeLayout');
        this.setCfg('HomeLayout',izhHomeLayout);
    }
    if(oldAuthorList){
        izhAuthorList=oldAuthorList;
        unsafeWindow.localStorage.removeItem('izh_AuthorList');
        this.setCfg('AuthorList',izhAuthorList);
    }
    if(oldShowComment){
        izhRightComment=oldShowComment;
        unsafeWindow.localStorage.removeItem('izh_ShowComment');
        this.setCfg('ShowComment',izhRightComment);
    }
    if(oldQuickFavo){
        izhQuickFavo=oldQuickFavo;
        unsafeWindow.localStorage.removeItem('izh_QuickFavo');
        this.setCfg('QuickFavo',izhQuickFavo);
    }
    if(oldAuthorRear){
        izhAuthorRear=oldAuthorRear;
        unsafeWindow.localStorage.removeItem('izh_AuthorRear');
        this.setCfg('AuthorRear',izhAuthorRear);
    }
    if(oldHomeNoti){
        izhHomeNoti=oldHomeNoti;
        unsafeWindow.localStorage.removeItem('izh_HomeNoti');
        this.setCfg('HomeNoti',izhHomeNoti);
    }

};


/**
 * @method formatStr
 *
 * 格式化字符串模版,支持2种格式:
 *
 *     formatStr("i can speak {language} since i was {age}",{language:'javascript',age:10});
 *     formatStr("i can speak {0} since i was {1}",'javascript',10);
 *
 * 如果不希望被转义,则用两个括号,如: `formatStr("i can speak {0} since i was {{1}",'javascript',10);`
 *
 */
utils.formatStr = function(tpl,obj){
  obj = typeof obj === 'object' ? obj : Array.prototype.slice.call(arguments, 1);
  return tpl.replace(/\{\{|\}\}|\{(\w+)\}/g, function (m, n){
    if (m == "{{") { return "{"; }
    if (m == "}}") { return "}"; }
    return obj[n];
  });
};

utils.getParamInQuery=function(queryStr,paramName){
    var param=paramName+'='
      , start=queryStr.indexOf(param)+param.length
      , end=queryStr.indexOf('&',start);
    return end<start?queryStr.substring(start):queryStr.substring(start,end);
};

utils.observeDOMAttrModified = (function(){
    var MutationObserver = window.MutationObserver || window.WebKitMutationObserver,
        eventListenerSupported = window.addEventListener;

    return function(obj, callback){
        if( MutationObserver ){
            // define a new observer
            var obs = new MutationObserver(function(mutations, observer){
                if( mutations[0].type == 'attributes' )
                    callback(mutations[0]);
            });
            obs.observe( obj, { attributes:true });
        }else if( eventListenerSupported ){
            obj.addEventListener('DOMAttrModified', callback, false);
        }
    }
})();

utils.observeDOMNodeAdded = (function(){
    var MutationObserver = window.MutationObserver || window.WebKitMutationObserver,
        eventListenerSupported = window.addEventListener;

    return function(obj, callback){
        if( MutationObserver ){
            // define a new observer
            var obs = new MutationObserver(function(mutations, observer){
                mutations.forEach(function(mutation) {
                    callback(mutation);
                  });    
            });
            obs.observe( obj, { childList:true });
        }else if( eventListenerSupported ){
            obj.addEventListener('DOMNodeInserted', callback, false);
        }
    }
})();

utils.RegexSrcPic = /src="[\s\S]+?.jpg"/g

//console.log((new Date()).getTime());

var $ = window.$;
var _ = this._;
var purl = window.purl||$.url;

//使用CasperJS的模拟用户操作： http://casperjs.org/api.html#client-utils
//var client = window.create();

var url = purl();
var page = url.segment(1);

var pageIs={}
  , $win=$(window)
  , _doc=window.document
  , $body=$(_doc.body)
  , _path=window.frameElement?window.frameElement.src.replace(/https?:\/\/www.zhihu.com/,''):url.data.attr['path']
  , css=''
  , $h=$('head')
  , $s=$('<style>', { 'type': 'text/css' })
  , iPathAnswers=_path.indexOf('/answers')
  , iPathCollection=_path.indexOf('/collection')
;
pageIs.Home='/'==_path;
pageIs.Answer=0<_path.indexOf('/answer/');
pageIs.Question=!pageIs.Answer&&0==_path.indexOf('/question/');
pageIs.Answers=0<iPathAnswers&&_path.substr(iPathAnswers)=='/answers';
pageIs.Collection=0==iPathCollection;
pageIs.Debuts=0==_path.indexOf('/debuts/');
pageIs.MyCollection=0==_path.indexOf('/collections/mine');
pageIs.SettingsFilter=0==_path.indexOf('/settings/filter')

var i=0
  , $user=$('.zu-top-nav-userinfo')//user_avater
  , z=$user.length?$user.attr('href'):''
  , $banner=$(document.body).children().first()
  , $main=$('[role=main]')//main
  , css_AuthorListItemA='padding:0 10px 0 0;'
  , css_AuthorListItemA_name='padding:0 5px;'
;

window.iZhihu = {
    $win:$win
  , $body:$body
  , $main:$main
  , config:$.extend(cfgDefault, utils.getValue('izhihu',cfgDefault))
};

var izhHomeLayout = window.iZhihu.config['HomeLayout']
  , izhAuthorList = window.iZhihu.config['AuthorList']
  , izhRightComment = window.iZhihu.config['ShowComment']
  , izhQuickFavo = window.iZhihu.config['QuickFavo']
  , izhAuthorRear = window.iZhihu.config['AuthorRear']
  , izhHomeNoti = window.iZhihu.config['HomeNoti']
  , izhQuickBlock = window.iZhihu.config['QuickBlock']
  , izhTopNavAutoFold = window.iZhihu.config['TopNavAutoFold']
;

utils.transferOldCfg();

$body.attr({
    'izhHomeLayout' : izhHomeLayout?'1':''
  , 'izhAuthorList' : izhAuthorList?'1':''
  , 'izhRightComment' : izhRightComment?'1':''
  , 'izhQuickFavo' : izhQuickFavo?'1':''
  , 'izhAuthorRear' : izhAuthorRear?'1':''
  , 'izhHomeNoti' : izhHomeNoti?'1':''
  , 'izhQuickBlock' : izhQuickBlock?'1':''
  , 'izhTopNavAutoFold' : izhTopNavAutoFold?'1':''
});

var _QuickBlock = new QuickBlock(window.iZhihu)
  , _QuickFavo = new QuickFavo(window.iZhihu)
  , _Comment = new Comment(window.iZhihu)
  , _Noti7 = new Noti7(window.iZhihu)
  , _Answer = new Answer(window.iZhihu)
  , _SearchingList = new SearchingList(window.iZhihu)
  , _TopNav = new TopNav(window.iZhihu)
;

css+=['.t_showframe{padding:10px 10px 10px 10px;background:#f0f0f0;border:1px solid #fff;box-shadow:2px 5px 15px #333;border-radius:10px;-moz-box-shadow:2px 5px 15px #333;-moz-border-radius:10px;-webkit-box-shadow:2px 5px 15px #333;-webkit-border-radius:10px}#iZhihu_rtjddiv{width:650px;height:437px}#iZhihu_setdiv{width:600px;height2:295px}.t_setdiv{padding-bottom:10px;background:#fcfcfc;width:100%;height:100%}.t_set_tb{font-family:"Lucida Sans Unicode","Lucida Grande",Sans-Serif !important;font-size:12px !important;text-shadow:none !important;border-collapse:collapse !important;margin:0 !important;line-height:120%}.t_set_tb thead td{background:#0080c0;color:#fff;border:none !important;padding:4px 8px 4px !important;border-radius-topleft:10px;border-radius-topright:10px;-moz-border-radius-topleft:10px;-moz-border-radius-topright:10px;-webkit-border-top-left-radius:10px;-webkit-border-top-right-radius:10px}.t_set_tb th,.t_set_tb td{padding:8px;background:#e8edff;border:none !important;border-top:2px solid #fcfcfc !important;color:#669;line-height:1.1em !important}.t_set_tb td input,.t_set_tb td textarea{font-size:12px !important;padding:0 !important}.t_set_tb tbody tr:hover th,.t_set_tb tbody tr:hover td{background:#d0dafd}.t_set_tb tfoot td{border-radius-bottomleft:10px;border-radius-bottomright:10px;-moz-border-radius-bottomleft:10px;-moz-border-radius-bottomright:10px;-webkit-border-bottom-left-radius:10px;-webkit-border-bottom-right-radius:10px}.t_set_ft{font-family:Arial,sans-serif,瀹�� !important;font-size:12px !important;font-weight:bold !important;text-shadow:none !important;margin-top:15px !important}.t_set_ft a{text-decoration:none;color:#000}.t_setbtn{border:1px solid black;padding:2px;cursor:pointer;background:#fff;color:#0080c0}.t_setftbtn span{padding:2px 10px 2px 10px !important}.t_rtjdbtn{background:#0080c0 !important;color:#fff !important}.t_rtjdtxtpos{padding-top:5px}#iZhihu_rthint{font-family:Arial,sans-serif,瀹�� !important;font-size:16px !important;font-weight:bold;padding:5px 10px 5px 10px;position:fixed;top:20px;border-radius:5px;-moz-border-radius:5px;-webkit-border-radius:5px;display:inline-block;opacity:0.7}.t_rthint_n{color:#fff !important;background:#000 !important}.t_rthint_f{background:#880000 !important;color:#ffffdd !important}.t_upbtn{background:#0080c0 !important;color:#fff !important}.t_upinfo{height:120px !important;vertical-align:text-top !important}#izh_updatediv th{border-right:2px solid #fcfcfc !important}#izh_updatediv tfoot td{border:none !important;border-top:2px solid #fcfcfc !important;font-family:Arial,sans-serif,瀹�� !important;font-size:12px !important;font-style:normal !important;text-shadow:none !important}.t_txtshow{text-align:center;background:#0080c0;color:#f0f0f0;user-select:none;-moz-user-select:none}.t_frshow{font-size:1.2em;position:fixed;z-index:99999;top:45px;width:200px;opacity:0.9;cursor:pointer}.t_tbox{padding:10px;position:relative;border:1px solid #f0f0f0;line-height:20px;*height:1%;width:200px;-moz-box-shadow:2px 5px 15px #333;-moz-border-radius:7px;-webkit-box-shadow:2px 5px 15px #333;-webkit-border-radius:7px}.t_tbox s{position:absolute;top:-20px;left:160px;display:block;height:0;width:0;font-size:0;line-height:0;border-color:transparent transparent #f0f0f0 transparent;border-style:dashed dashed solid dashed;border-width:10px}.t_tbox i{position:absolute;top:-9px;left:-10px;display:block;height:0;width:0;font-size:0;line-height:0;border-color:transparent transparent #0080c0 transparent;border-style:dashed dashed solid dashed;border-width:10px}@media screen and (-webkit-min-device-pixel-ratio:0){#iZhihu_rtjddiv{height:417px}#iZhihu_setdiv{height2:295px}#izh_updatediv{height:315px}}'
     ,''].join('\n');
if(pageIs.Question&&izhAuthorList){
    css+=['div.uno{position:absolute;left:0;border:1px solid #0771C1;border-right-width:0;border-top-right-radius:6px}'
         ,'div.uno .frame{overflow-x:hidden;overflow-y:auto;direction:rtl}'
         ,'div.uno span.meT,div.uno span.meB,div.uno ul.pp li span.me{position:absolute;right:0;display:block;height:1px;width:1px;line-height:1px;background-color:transparent;border-style:solid;border-color:transparent;}'
         ,'div.uno span.meT{border-width:6px 4px;border-top-width:0px;border-bottom-color:#fff;}'
         ,'div.uno span.meB{border-width:6px 4px;border-bottom-width:0px;border-top-color:#fff;margin-top:-7px;}'
         ,'div.uno ul{background-color:#0771C1;padding:0;margin:0;direction:ltr}'
         ,'div.uno ul li{display:block;list-style-type:none;margin:0;padding:0;white-space:nowrap;}'
         ,'div.uno ul li a{display:block;}div.uno li a.sel{text-decoration:none;}'
         ,'div.uno ul li a{'+css_AuthorListItemA+'}'
         ,'div.uno ul.pp li span.me{position:static;margin:6px -8px;border-width:4px 6px;border-right-color:#fff;float:right;}'
         ,'div.uno li a span.name{text-align:right;display:block;'+css_AuthorListItemA_name+'background-color:#fff;}div.uno li a.sel span.name{color:#fff;background-color:#0771C1;}'
         ,'div.uno li a span.name.noname{color:#000;}'
         ,'div.uno li a span.name.collapsed{color:#999999;}'
         ,'div.uno li a span.name.friend{font-style:italic;}'
         ,'div.uno li span.hp{background-color:#999999;position:relative;float:right;margin-top:-2px;line-height:2px;height:2px;}'
         ,'div.uno table.plus{float:right;margin:7px -9px;height:7px;border-collapse:collapse;border-style:hidden;}div.uno table.plus td{border:1px solid #fff;width:1px;height:1px;}'
         ,'div.uno a.sel table.plus{}div.uno a.sel table.plus td{}'
         ,'div.uno li a span.func{text-align:center;}'
         ,'div.izh-answer-preview{position:fixed;margin-top:1px;background-color:#fff;border:1px solid #0771C1;border-top-width:22px;border-top-right-radius:6px;box-shadow:5px 5px 5px #777;}'
         ,'div.izh-answer-preview .zm-editable-content{top:0;bottom:0;left:0;right:0;overflow-y:auto;padding:10px;}'
         ,'div.izh-answer-preview img.zm-list-avatar{position:absolute;right:10px;top:-35px;border:1px solid #0771C1;border-radius:6px;}'
         ,'div.izh-answer-preview span.comment{position:absolute;top:-18px;line-height:18px;border-top-right-radius:3px;background-color:#fff;padding:0 5px;}'
         ,''].join('\n');
}
css+=['.z-icon-izh-fold{background-position:-173px -107px;width:15px;height:15px;}'
     ,''].join('\n');
css+=['.t_set_tb{font-family:"Lucida Sans Unicode","Lucida Grande",Sans-Serif !important;font-size:12px !important;text-shadow:none !important;border-collapse:collapse !important;margin:0 !important;line-height:120%}'
     ,'.t_set_tb thead td{background:#0080c0;color:#fff;border:none !important;padding:4px 8px 4px !important;border-top-left-radius:6px;border-top-right-radius:6px}'
     ,'.t_set_tb th,.t_set_tb td{padding:8px;background:#e7f3f9;border:none !important;border-top:2px solid #fcfcfc !important;color:#669;line-height:1.1em !important}'
     ,'.t_set_tb td input,.t_set_tb td textarea{font-size:12px !important;padding:0 !important}'
     ,'.t_set_tb tbody tr:hover th,.t_set_tb tbody tr:hover td{background:#d0dafd}'
     ,'.t_set_tb tfoot td{border-radius-bottomleft:10px;border-radius-bottomright:10px;-moz-border-radius-bottomleft:10px;-moz-border-radius-bottomright:10px;-webkit-border-bottom-left-radius:10px;-webkit-border-bottom-right-radius:10px}'
     ,'.t_set_tb td{white-space:nowrap;}'
     ,'.t_set_tb td .icon-help{float:right;}'
     ,''].join('\n');
css+=['.izh_boxShadow{box-shadow: 5px 5px 3px 0px #999 !important;}'
     ,'#zh-question-meta-wrap.izh_noBorder{border-bottom-color:transparent !important;}'
     ,'#zh-question-filter-wrap.izh_noBorder{border-top-color:transparent !important;}'
     ,'a.izh-button.on{color:#225599;text-shadow:0 0 1px #225599;}'
     ,'a.izh-button .zg-icon{opacity:0.5;}'
     ,'a.izh-button.on .zg-icon{opacity:1;}'
     ,'a.izh-button.off{color:#eee;}'
     ,'a.izh-button.off .zg-icon{opacity:0.2;}'
     ,'.izh-feeds-filter{}'
     ,'.izh-feeds-filter .izh-feeds-filter-option{opacity:0.5;color:#999999;padding-left:5px;text-decoration:none;cursor:pointer;}'
     ,'.izh-feeds-filter .izh-feeds-filter-option i{background-position:-183px -4px;}'
     ,'.izh-feeds-filter .izh-feeds-filter-option.on{opacity:1;color:#225599;}'
     ,'.izh-feeds-filter .izh-feeds-filter-option.on i{background-position:-183px -24px;}'
     ,''].join('\n');
if(izhHomeLayout){
    css +=  ['#zh-question-list { padding-left:30px!important }'
            ,'#zh-main-feed-fresh-button { margin-left:-30px!important }'
            ,'.feed-item {'
            ,'    border-bottom:1px solid #EEE!important;'
            ,'    margin-top:-1px!important'
            ,'}'
            ,'.feed-item .avatar { display:none!important }'
            ,''
            ,'.feed-main,.feed-item.combine { margin-left:0!important }'
            ,'.feed-item-q { margin-left:-30px!important;padding-left:0!important }'
            ,''
            ,window.iZhihu.Comment.RightComment ? '' : '.feed-item-a .zm-comment-box { max-width:602px!important }'
            ,window.iZhihu.Comment.RightComment ? '' : '.feed-item-q .zm-comment-box { max-width:632px!important; width:632px!important }'
            ,''
            ,'.zm-tag-editor,'
            ,'#zh-question-title,'
            ,'#zh-question-detail,'
            ,'#zh-question-meta-wrap,'
            ,'.zh-answers-title,'
            ,'#zh-question-filter-wrap {'
            ,'    margin-left:-32px!important'
            ,'}'
            ,''
            ,'#zh-question-log-page-wrap .zm-tag-editor,'
            ,'#zh-question-log-page-wrap #zh-question-title {'
            ,'    margin-left:0 !important'
            ,'}'
            ,''
            ,'.zh-answers-title,'
            ,'#zh-question-filter-wrap {'
            ,'    border-bottom:1px solid #EEE!important;'
            ,'    z-index:1000!important'
            ,'}'
            ,''
            ,'#zh-question-meta-wrap {'
            ,'    margin-bottom:0!important;'
            ,'    padding-bottom:10px!important;'
            ,'    border-bottom:1px solid #EEE!important'
            ,'}'
            ,''
            ,'#zh-question-answer-wrap { margin-top:-1px!important }'
            ,''
            ,'#zh-question-collapsed-wrap,#zh-question-answer-wrap { border:none!important }'
            ,'.zu-question-collap-title { border-top:1px solid #EEE!important }'
            ,'#zh-question-collapsed-wrap>div:last-child,.zm-item-answer:last-child { border-bottom:1px solid #EEE!important }'
            ,''
            ,'.zu-autohide,'
            ,'.zm-comment-op-link,'
            ,'.zm-side-trend-del,'
            ,'.unpin {'
            ,'    visibility:visible!important;'
            ,'    opacity:0;'
            ,'}'
            ,'.feed-item:hover .zu-autohide,'
            ,'.zm-item-answer .zu-autohide,'
            ,'.zm-item-comment:hover .zm-comment-op-link,'
            ,'.zm-side-trend-row:hover .zm-side-trend-del,'
            ,'.zm-side-nav-li:hover .unpin {'
            ,'    opacity:1;'
            ,'}'
            ,'.zm-item-vote-count:hover,.zm-votebar button:hover{'
            ,'    background:#a6ce56!important;'
            ,'    color:#3E5E00 !important'
            ,'}'
            ,''
            ,'a,a:hover,'
            ,'i,'
            ,'.zu-autohide,'
            ,'.zm-votebar button,'
            ,'.zm-item-comment:hover .zm-comment-op-link,'
            ,'.zm-comment-op-link,'
            ,'.zm-side-trend-row:hover .zm-side-trend-del,'
            ,'.zm-side-trend-del,'
            ,'.zm-side-nav-li,'
            ,'.zu-main-feed-fresh-button,'
            ,'.zg-icon,'
            ,'.zm-side-nav-li:hover .zg-icon,'
            ,'.zm-side-nav-li:hover i,'
            ,'.unpin,'
            ,'.zm-side-nav-li:hover .unpin {'
            ,'    -moz-transition:color .2s linear,opacity .15s linear,background-color .2s linear,background-position .2s linear .1s;'
            ,'    -webkit-transition:color .2s linear,opacity .15s linear,background-color .2s linear,background-position .2s linear .1s;'
            ,'    transition:color .2s linear,opacity .15s linear,background-color .2s linear,background-position .2s linear .1s;'
            ,'}'
            ,''
            ,'h3{ line-height:25px }'
            ,'.zu-footer-inner {padding:15px 0!important}'
            ,'.zm-side-pinned-topics .zm-side-nav-li{float:left;padding-right:30px!important}'
            ,'.zm-side-list-content{clear:both}'
            ,'.unpin{ display:inline-block!important }'
           ,''].join('\n');
}

var css_comment='';
if(pageIs.Home||pageIs.Question||pageIs.Answer){
    css_comment = window.iZhihu.Comment.css;
}

css += window.iZhihu.Answer.css;

if(window.iZhihu.QuickFavo){
    css += window.iZhihu.QuickFavo.css;
}
if(window.iZhihu.QuickBlock){
    css += window.iZhihu.QuickBlock.css;
}
if(window.iZhihu.Noti7){
    css += window.iZhihu.Noti7.css;
    window.iZhihu.Noti7.enhance();
}
var heads = _doc.getElementsByTagName("head");
if (heads.length > 0) {
    var node = _doc.createElement("style");
    node.type = "text/css";
    node.id = "izhCSS_main";
    node.appendChild(_doc.createTextNode(css));
    heads[0].appendChild(node); 
    if(css_comment!=''){
        node = _doc.createElement("style")
        node.type = "text/css";
        node.id = "izhCSS_comment";
        node.appendChild(_doc.createTextNode(css_comment));
        heads[0].appendChild(node);
    }
}

if(!$('.modal-dialog-bg').length){
    $body.append(
        $('<div', { id: 'izh-dlg-bg', 'class': 'modal-dialog-bg' }).css({
            'z-index': 95
          , 'opacity': 0.5
          , 'position': 'fixed'
          , 'top': 0
          , 'bottom': 0
          , 'left': 0
          , 'right': 0
          , 'display': 'none'
        })
    );
}

window.iZhihu.getItem=function($c){
    var $item=$(null);
    if($c && $c.length){ 
        var $itemMeta=$c.closest('.zm-item-meta');
        if ($itemMeta.is('.feed-meta') || $itemMeta.parent().is('.feed-meta')){
            $item=$c.closest('.feed-item');
            $item.attr('data-aid', $item.children('meta[itemprop=answer-id]').attr('content'))
        }else if($itemMeta.is('.answer-actions')){
            $item=$c.closest('.zm-item-answer,.feed-item');
        }else{
            $item=$itemMeta.prev();
        }
    }
    return $item;
};

utils.observeDOMNodeAdded(document.body,function(event){
	if(izhTopNavAutoFold){
		window.iZhihu.TopNav.onNodeAdded(event)
	}
})
/**
 * @class Answer
 */
function Answer(iZhihu) {
    if ( typeof iZhihu === 'undefined' || !iZhihu) {
        return null;
    }
    iZhihu.Answer = this;

    this._e=null;
    this.ppWidth=0;
    this.ppHeight=400;

    this.css = 
        ['.zm-votebar .izh-button.fold{margin:5px 0px 0px;display:block;color:#698EBF;height:24px;line-height:24px;width:38px;border-radius:3px;border:0px none;cursor:pointer;background:none repeat scroll 0% 0% #EFF6FA;font-weight:font-weight;position:relative;}'
        ,''].join('\n');

  	this.processAnswer=function($a,$pp,bAuthorRear,bAuthorList){
        if(!$a||!$a.length)return;
        if($a.attr('izh_processed')=='1')return;
        var selCollapse='.meta-item[name=collapse]'
          , $meta=$a.find('.zm-item-meta')
          , $author=$a.find('.zm-item-answer-author-info')
          , $favo=$a.find('.meta-item[name=favo]')
          , $vote=$a.find('.zm-votebar')
        ;
        if(iZhihu.QuickBlock){
            // Region: 快速屏蔽
            iZhihu.QuickBlock.addQuickBlock($a)

            // Region end
        }
        if($author.length){//relocatePersonInfo
            if(bAuthorRear){
                $author.css({
                    'textAlign':'right'
                });
                if($a.is('.feed-item')){
                    $a.find('.entry-body .zm-item-answer-detail .zm-item-rich-text')
                        .append($author.hide()).bind('DOMNodeInserted',function(event){
                            var $c=$(event.target);
                            if($c.is('.zm-editable-content')){
                                $(this).children('.zm-item-answer-author-info')
                                    .insertBefore($c.children('.answer-date-link-wrap'))
                                    .css({
                                        'position':'absolute'
                                      , 'right':0
                                    }).show();
                            }
                        });
                }else{
                    $author.insertBefore($meta);
                }
            }
            $author=$author.children().eq(1);
            if ($pp && bAuthorList){
                // Region: 回答目录项
                var collapsed=$a.attr('data-collapsed')=='1'
                  , $ppla=$('<a>',{
                            href:'#answer-'+$a.attr('data-aid')
                          , target:'_self'
                          , style:css_AuthorListItemA
                        })
                  , $ppl=$('<li>').append($ppla)
                  , $uno=iZhihu.$unoAnswers
                if(collapsed){
                    $ppl.appendTo($pp)
                }else{
                    $ppl.insertBefore($uno.$endOfLastA)
                }
                if($a.attr('data-isowner')=='1'){
                    iZhihu.Answer._e=$a.get(0);
                    $ppla.append($('<span>', { 'class': 'me' }));
                }
                var nameCSS='name';
                if($a.attr('data-isfriend')=='1'){
                    nameCSS+=' friend';
                }
                if(collapsed){
                    nameCSS+=' collapsed'
                }
                if(!$author.length){
                    nameCSS+=' noname';
                }
                $('<span>',{
                    'class':nameCSS
                  , style:css_AuthorListItemA_name
                }).text(!$author.length?'匿名用户':$author.text()).appendTo($ppla);
                if ($ppl.width()>iZhihu.Answer.ppWidth)
                    iZhihu.Answer.ppWidth=$ppl.width();
                // Region end
                // Region: 回答篇幅指示
                var nHP=Math.ceil($('.zm-editable-content',$a).text().length/100);
                $('<span>',{
                    'class':'hp'
                }).css({'width':nHP*10,'margin-left':-nHP*10}).appendTo($ppla);
                // Region end
                $ppla.mouseover(function(){
                    var $frm=$(this.parentNode.parentNode.parentNode)
                      , $uno=iZhihu.$unoAnswers
                    $(this).addClass('sel');
                    if(iZhihu.Answer._e){
                        $uno.children('.meT').css('display',0>iZhihu.Answer._e.offsetTop-$frm.scrollTop()?'':'none');
                        $uno.children('.meB').css('display',$frm.height()<iZhihu.Answer._e.offsetTop-$frm.scrollTop()+iZhihu.Answer._e.offsetHeight?'':'none');
                    }
                    // Region: 回答预览
                    var nam=$('span.name',this);
                    if(!nam.length)return;
                    var aid=$(this).attr('href').replace('#answer-','')
                      , prv=$uno.next('.izh-answer-preview')
                      , top=$(this).position().top+$uno.position().top
                      , sel='.zm-item-answer[data-aid='+aid+'] > .zm-item-rich-text'
                      , ctx=nam.is('.collapsed')?'#zh-question-collapsed-wrap':'#zh-question-answer-wrap'
                      , div=$(sel,ctx)
                      , cmt=$('.zm-item-meta > .zu-question-answer-meta-comment',div.parent())
                    ;
                    if(!prv.length){
                        prv=$('<div>',{
                                'class':div.class
                            })
                            .addClass('izh-answer-preview').width(div.width()+22)
                            .mouseover(function(){$uno.mouseover();$('li a[href=#'+$(this).attr('data-aid')+']',$uno).addClass('sel');$(this).show();})
                            .mouseout(function(){$uno.mouseout();$('li a[href=#'+$(this).attr('data-aid')+']',$uno).removeClass('sel');$(this).hide();})
                            .click(function(){$('li a[href=#'+$(this).attr('data-aid')+']',$uno)[0].click();})
                            .insertAfter($uno)
                        ;
                    }
                    if(prv.attr('data-aid')!=aid){
                        prv.attr('data-aid',aid).empty().append(div.clone().children()).find('a').attr('onclick','return false;');
                        if($('span.me',this).length)
                            prv.find('a.zu-edit-button').remove();
                        if(!nam.hasClass('noname'))
                            $('img.zm-list-avatar',div.parent()).clone().appendTo(prv);
                        var t=cmt.text(),i=t.indexOf('条评论');
                        if(cmt.length&&i>0)
                            $('<span>',{'class':'comment'}).text(t.substring(0,i)).prepend(cmt.children('i').clone()).appendTo(prv);
                    }
                    var th=div.height()+33
                      , maxTop=$uno.position().top+12
                      , contentPosition='';
                    if(maxTop+th<$win.height()){
                        if(top+th<$win.height()){
                            prv.css({'top':top>maxTop?top:maxTop,'bottom':''});
                        }else{
                            prv.css({'top':'','bottom':0});
                        }
                    }else{
                        prv.css({'top':maxTop,'bottom':0});
                        contentPosition='absolute';
                    }
                    prv.css({'left':$uno.width()}).show().children().first().css('position',contentPosition);
                    // Region end
                }).mouseout(function(){
                    $(this).removeClass('sel');
                    var $uno=$(this.parentNode.parentNode.parentNode.parentNode);
                    $uno.next().hide();
                }).click(function(){$(this).mouseout();
                iZhihu.$unoAnswers.css('left',9-iZhihu.$unoAnswers.width());});
                if(iZhihu.Answer._e==$a.get(0)){
                    iZhihu.Answer._e=$ppla.get(0);
                }
            }
        }

        if(iZhihu.QuickFavo)
            iZhihu.QuickFavo.addQuickFavo($favo,$a);

        $meta.bind('DOMNodeInserted',function(event){
            iZhihu.Comment.processComment($(event.target));
        });
        
        iZhihu.Comment.processCommentButton($a);

        var $cm=$('.zm-comment-box',$a);
        if($cm.length && $cm.is(':visible')){
        	var focusName = iZhihu.Comment.scrollFocusCommentOnPageLoad($cm);
    
            iZhihu.Comment.metaScrollToViewBottom($cm.closest('.zm-item-meta'),function(){
                iZhihu.Comment.processComment($cm, focusName);
            });
        }
        
        $a.attr('izh_processed','1');
    };

    return this;
}

/**
 * @class Comment
 */
function Comment(iZhihu) {
    if ( typeof iZhihu === 'undefined' || !iZhihu) {
        return null;
    }
    iZhihu.Comment = this;

    var css_comment={
            'background-color':'#fff'
          , 'outline':'none'
          , 'z-index':'9999'
          , 'border-radius':'0 6px 0 0'
          , 'position':'absolute'
          , 'visibility':'hidden'
          , 'top':-70
        }
    ;
    this.RightComment = iZhihu.config['ShowComment'];
    this.AutoScrollPageWhenClosing = iZhihu.config['RightComment_AutoScrollPageWhenClosing'];
    if (!this.RightComment){
        this.css = 
            ['.zm-comment-box.empty .izh-button-cc{display:none;}'
            ,''].join('\n');
    } else {
        this.css = 
            ['.mention-popup{z-index:10000 !important;}'
            ,'.zm-item-meta .meta-item.toggle-comment{display:block;float:right;margin-left:7px !important;}'
            ,'.zm-comment-box{position:absolute;margin-top:0;}'
            ,'.zm-comment-box .icon-spike{display:none !important;}'
            ,'.zm-comment-box > .zm-comment-box-ft{position:absolute;top:0;left:0;right:0;}'
            ,'.zm-comment-box.empty{padding-top:10px !important;}'
            ,'.zm-comment-box > .zm-comment-form{margin:15px !important;}'
            ,'.zm-comment-box.empty > .zm-comment-form{bottom:25px;}'
            ,'.zm-comment-box > .zm-comment-form .zm-comment-editable{position:absolute;bottom:60px;top:0;left:0;right:0;overflow:auto;}'
            ,'.zm-comment-box.empty > .zm-comment-form .zm-comment-editable{bottom:25px;}'
            ,'.zm-comment-box > .zm-comment-form .zm-command{position:absolute;left:0;right:0;bottom:40px;}'
            ,'.zm-comment-box.empty > .zm-comment-form .zm-command{bottom:10px;}'
            ,'.zm-comment-box [class^=izh-buttons-cm]{position:absolute;top:70px;}'
            ,'.zm-comment-box.empty [class^=izh-buttons-cm]{top:auto;bottom:30px;z-index:10;}'
            ,'.zm-comment-box .izh-buttons-cm-L{left:0;}'
            ,'.zm-comment-box .izh-buttons-cm-L > a{margin-right:7px;}'
            ,'.zm-comment-box .izh-buttons-cm-R{right:1em;}'
            ,'.zm-comment-box .izh-buttons-cm-R > a{margin-left:7px;}'
            ,'.zm-comment-box a.izh-button.on{color:#225599;text-shadow:0 0 1px #225599;}'
            ,'.zm-comment-box a.izh-button .zg-icon{opacity:0.5;}'
            ,'.zm-comment-box a.izh-button.on .zg-icon{opacity:1;}'
            ,'.zm-comment-box a.izh-button.off{color:#eee;}'
            ,'.zm-comment-box a.izh-button.off .zg-icon{opacity:0.2;}'
            //,'.zm-comment-box.empty [class^=izh-buttons-cm]{top:auto;bottom:7px;}'
            ,'.zm-comment-box.empty .zm-comment-list{visibility:hidden;}'
            ,'.zm-comment-box .zm-comment-list .zm-item-comment[izh_hilight]{background-color:rgb(255,255,160);}'
            ,'.zm-comment-box .izh-button.on .zg-icon-comment-like{background-position:-222px -79px;}'
            ,'.zm-comment-box .izh-button .z-icon-fold{height:6px;}'
            ,''].join('\n');
        this.onWinLoad=function(){
            var iZhihu=window.iZhihu;
            iZhihu.$win.scroll(function(event){
                if(iZhihu.Comment.Opening&&!iZhihu.Comment.PageNotScroll){
                    var animate=true;
                    iZhihu.Comment.box($(iZhihu.Comment.Opening),true,animate);
                }
            });
        
            iZhihu.$win.resize(function(event){
                if(iZhihu.Comment.Opening){
                    var $cm=$(iZhihu.Comment.Opening);
                    iZhihu.Comment.Opening = null;
                    iZhihu.Comment.close(null,$cm);
                    iZhihu.Comment.open(null,$cm);
                }
            });
            if(iZhihu.ScrollTop){
                document.body.scrollTop=iZhihu.ScrollTop;
            }
        }
        this.onWinLoad()
    }
    this.processCommentButton = function($a){
        if(iZhihu.Comment.RightComment){
            var $bc=$a.find('.meta-item.toggle-comment');
            $bc.prependTo($bc.parent());
        }
    };
    this.scrollFocusCommentOnPageLoad = function($cm){
        if(!iZhihu.Comment.RightComment)return;
        var focusName=url.data.attr.fragment;
        if(!focusName||focusName=='')return;
    	if(window.iZhihu4CRX){
            var $icm2C=$cm.find('.zm-comment-list .zm-item-comment a.zg-anchor-hidden[name="'+focusName+'"]').parent()
              , offsetTop=$icm2C.length?$icm2C.offset().top:0
            ;if(offsetTop){document.body.scrollTop=offsetTop;}
    	}
        return focusName;
    };
    
    this.metaScrollToViewBottom = function($itemMeta,funcAfterScroll,always,animate){
        if(!iZhihu.Comment.RightComment || !iZhihu.Comment.AutoScrollPageWhenClosing){
            if(funcAfterScroll){funcAfterScroll();}
            return;
        }
        if(typeof always === 'undefined')always=true;//if false, scrolling only when the .zm-item-meta out of visible range
        if(typeof animate === 'undefined')animate=false;//if false, scrolling instantly
        if(always)$itemMeta.children('.zm-comment-box').css('position','fixed');
        var winHeight=iZhihu.$win.height()
          , scrollObj=window.iZhihu4CRX?document.body:document.documentElement
          , scrollTopNow=scrollObj.scrollTop
          , navHeight=iZhihu.$body.children().first().height()
          , bar=$('.zu-global-notify.zu-global-notify-info:visible')
          , barHeight=!bar.length?0:bar.outerHeight()
          , baseTop=((barHeight&&bar.css('position')=='fixed')?barHeight:(scrollTopNow>barHeight?0:barHeight-scrollTopNow))+navHeight
          , maxHeight=winHeight-baseTop
          , metaHeight=$itemMeta.innerHeight()
          , offsetTop=$itemMeta.offset().top
          , offsetBottom=offsetTop+metaHeight
          , $item=iZhihu.getItem($itemMeta)
          , itemHeight=$item.innerHeight()
          , offsetTopA=$item.offset().top
          , offsetBottomA=offsetTopA+itemHeight
          , scrollTopEnd=itemHeight>maxHeight?offsetBottom-winHeight:(offsetTopA<=scrollTopNow?offsetTopA-baseTop:offsetBottom-winHeight)
        ;
        if(!always){
            always=offsetTop<scrollTopNow+baseTop||offsetBottom>scrollTopNow+winHeight-baseTop;
        }
        if(always){
            iZhihu.ScrollTop=scrollTopEnd;
            if(animate){
                $(scrollObj).animate({'scrollTop':scrollTopEnd},funcAfterScroll);
        	}else{
                $(scrollObj).scrollTop(scrollTopEnd);
                if(funcAfterScroll){funcAfterScroll();}
        	}
        }else{
            if(funcAfterScroll){funcAfterScroll();}
        }
    };
    this.box = function($cm,keepSize,animate){if(!$cm||!$cm.length)return;
        $cm.stop();
        if(typeof keepSize === 'undefined')keepSize=false;
        if(typeof animate === 'undefined')animate=false;
        var winHeight=iZhihu.$win.height()
          , th=keepSize?parseInt($cm.attr('izh_cmHeight')):0
          , scrollTop=(document.body.scrollTop)?document.body.scrollTop:document.documentElement.scrollTop
          , navHeight=iZhihu.$body.children().first().height()
          , bar=$('.zu-global-notify.zu-global-notify-info:visible')
          , barHeight=!bar.length?0:bar.outerHeight()
          , baseTop=((barHeight&&bar.css('position')=='fixed')?barHeight:(scrollTop>barHeight?0:barHeight-scrollTop))+navHeight
          , minHeight=112
          , maxHeight=winHeight-baseTop-35
          , tooSmall=maxHeight<minHeight
          , $meta=$cm.closest('.zm-item-meta')
          , metaHeight=2*$meta.height()-$meta.innerHeight()
          , offsetTop=scrollTop-$meta.offset().top
          , offsetBottom=-offsetTop-winHeight
        ;if(tooSmall)maxHeight=minHeight;
        if(!th||isNaN(th)){
            var $t=$cm.clone().css({'position':'absolute','z-index':'-1'}).appendTo(document.body).show()
              , $l=$t.children('.zm-comment-list')
            ;
            if(!$cm.is('.empty')&&$l.children().length>0)$l.css({'position':'absolute','height':'','top':'','bottom':''});
            th=$l.height();
            th+=th==0?minHeight:100;
            $t.remove();$t=null;//console.log(th);
            $cm.css('height',th<=minHeight?minHeight:(th<maxHeight?th-100:maxHeight-80));
        }
        var target={},other={'height':''};
        $cm.attr('izh_cmHeight',th).css({'display':'','visibility':'visible','position':'absolute'});
        if(th<=maxHeight){
            var top=-offsetTop-70,fixHeight=(th<=minHeight?-1:7);
            if(!tooSmall&&top+th>winHeight){
                target={'top':-offsetBottom-th-metaHeight+fixHeight,'bottom':offsetBottom};
            }else{
                offsetTop+=((!tooSmall)&&top>baseTop?top:baseTop);
                target={'top':offsetTop,'bottom':-offsetTop-th-metaHeight+fixHeight};
            }
            $cm.filter('.empty').find('.zm-comment-form .zm-comment-editable').css({'bottom':''});
        }else{
            target={'top':offsetTop+baseTop,'bottom':offsetBottom};
            $cm.filter('.empty').find('.zm-comment-form .zm-comment-editable').css({'bottom':'20px'});
        }
        if(animate){
            $cm.animate(target,function(){$cm.css(other);});
        }else{
            $cm.css($.extend(target,other));
        }
        $cm;
    };
    this.open = function($ac,$cm,icmFocus){// if $ac is null, just re-sizing and re-locating comment-box
        var noCommentOpening = iZhihu.Comment.Opening == null;
        iZhihu.Comment.Opening = $cm.attr('izh-opening','1').css({'display':'none'}).get(0);
        $('.zm-comment-box:visible:not([izh-opening=1])')
            .each(function(i,e){
                $(e).css('visibility','hidden').closest('.zm-item-meta').find('.toggle-comment')[0].click();
            });
        var winWidth=iZhihu.$win.width()
          , mcLeft=iZhihu.$main.offset().left
          , $ct=$cm.closest('.zu-main-content-inner')
          , ctMarginL=parseInt($ct.css('margin-left'))
          , ctWidth=$ct.width()+ctMarginL
          , ctLeft=$ct.offset().left-ctMarginL
          , $meta=$cm.closest('.zm-item-meta')
          , mtWidth=$meta.innerWidth()
          , minWidth=iZhihu.$main.width()-ctWidth
          , cmWidth=mtWidth
          , maxWidth=winWidth-ctWidth
          , o=function(){
                $cm.attr('opened','1');
        		if(!$ac){
                    iZhihu.Comment.box($cm);
                    return;
        		}
                var currTop=_doc.body.scrollTop
                  , $n=$ac.next(),$n=$n.length?$n:$ac.parent().next()
                  , t=$ac.offset().top-iZhihu.$main.offset().top
                  , b=$ac.offset().top-iZhihu.$main.offset().top
                  , w=$ac.width()
                  , inAnswer=$ac.is('.zm-item-answer')
                  , inQuestion=$ac.is('#zh-question-detail')
                  , $questionMeta=$('#zh-question-meta-wrap')//question_meta
                  , h=inQuestion?$questionMeta.offset().top+$questionMeta.height()+parseInt($questionMeta.css('padding-bottom'))-iZhihu.$main.offset().top
                                     :$ac.height()+parseInt($ac.css('padding-bottom'))+parseInt($n.css('padding-top'))
                ;
                if(!$ac.find('.izh_tape_a,.izh_tape_b').length)
                    $ac
                        .append($('<div>', { 'class': 'izh_tape_a' }))
                        .append($('<div>', { 'class': 'izh_tape_b' }))
                if(!$cm)$cm=$ac.find('.zm-comment-box');
                if($cm.length){
                    if(!$cm.attr('tabindex')){
                        $cm.attr('tabindex','-1').focus();
                    }
                    if(inQuestion){
                        $('#izh_QuestionShadow').css({
                            'height':h
                          , 'margin-bottom':-h
                        }).show();
                        $questionMeta.next(':visible').andSelf().addClass('izh_noBorder');
                    }else{
                        $ac.addClass('izh_boxShadow');
                    }
                    $ac.find('.izh_tape_a').css({
                        'position':'absolute'
                      , 'width':1
                      , 'height':h
                      , 'top':0
                      , 'margin-left':w-1
                      , 'z-index':'10000'
                      , 'background-color':'#fff'
                    }).show();
        
                    iZhihu.Comment.box(
                        $cm.css({'left':mtWidth-1}).attr('izh_inQuestion',inQuestion?'1':'0').removeAttr('izh-opening')
                    );
                    
                    $('.mention-popup').attr('data-aid',$ac.attr('data-aid'));
                }else{
                    $ac.find('.zu-question-answer-meta-comment')[0].click();
                }
                $ac.find('.izh_tape_b').css({
                    'position':'absolute'
                  , 'width':1
                  , 'height':h
                  , 'top':0
                  , 'margin-left':w
                  , 'z-index':'9998'
                  , 'background-color':'#eee'
                }).show();
                //$ac.css('border-color','#999999');
                //$n.css('border-color','#999999');
                $('.zh-backtotop').css('visibility','hidden');
                iZhihu.$body.scrollTop(currTop);
                if(icmFocus){
                    var $icm=$(icmFocus).attr('izh_hilight','1')
                      , $list=$icm.closest('.zm-comment-list');
                    $list.scrollTop(icmFocus.offsetTop-$list.get(0).offsetTop);
                    iZhihu.Comment.HiLightItem=icmFocus;
                    iZhihu.Comment.HiLightColor='rgb(255,255,160)';
                    $icm.click(function(){
                        var iZhihu=window.iZhihu;
                        if(iZhihu&&iZhihu.Comment.HiLightItem){
                            $(iZhihu.Comment.HiLightItem).removeAttr('izh_hilight');
                        }
                    });
                }
            };

        if(maxWidth>549)maxWidth=549;
        if(cmWidth>maxWidth)
            cmWidth=maxWidth;
        if(cmWidth<minWidth)
            cmWidth=minWidth;
        $cm.addClass('izh_boxShadow').css($.extend(css_comment,{'width':cmWidth-9}));
        //if(!$cm.is('.empty'))
            $cm.css({'padding':'100px 0px 0px 7px'});
        $('i.zm-comment-bubble',$cm).hide();
        if(noCommentOpening){
            var cmWidthOver=cmWidth-winWidth
              , shiftLeft=cmWidthOver+ctWidth+ctLeft
            ;
            if(shiftLeft>0){
                if(shiftLeft>ctLeft){shiftLeft=mcLeft;}
                else if(cmWidthOver>0){shiftLeft-=cmWidthOver;}
            }
            if(shiftLeft<0){shiftLeft=0;}
            if(shiftLeft && $ac){
                $ct.css({'position':'relative','left':0}).animate({left:-shiftLeft},o);
            }else{
                $ct.css({'position':'relative','left':-shiftLeft});
                o();
            }
        }else{
            o();
        }	
    };
    this.close = function($ac,$cm){
        if(!$cm)$cm=$ac.find('.zm-comment-box');
        var $ct=$cm.closest('.zu-main-content-inner');
        var o=function(){
            $(this).css('position','');
            if(!$ac)return;
            var $n=$ac.next()
              , $n=$n.length?$n:$ac.parent().next()
              , inQuestion=$ac.is('#zh-question-detail');
            if(!$ac){return;}
            if(inQuestion){
                $('#izh_QuestionShadow').hide();
                $('#zh-question-meta-wrap').next(':visible').andSelf().removeClass('izh_noBorder');
            }else{
                $ac.removeClass('izh_boxShadow');
            }
            //$ac.css('border-color','#DDDDDD');
            //$n.css('border-color','#DDDDDD');
            $('.izh_tape_a:visible,.izh_tape_b:visible').hide();
            $('.zh-backtotop').css('visibility','visible');
        };

        if(iZhihu.Comment.Opening == $cm.get(0)){
            iZhihu.Comment.Opening = null;
            $ct.animate({left:0},o);
        }else{
            if(!$ac){$ct.css({left:0});}
            o();
        }
        
    };
    this.processComment = function($cm,focusName){
        var loading=false;
        if($cm.is('.zm-comment-spinner')){
            $cm=$cm.closest('.zm-comment-box');
            loading=true;
        }
        if(!$cm.is('.zm-comment-box'))return;
        var $item=iZhihu.getItem($cm);
        if(iZhihu.Comment.RightComment&&loading){
            var cmLeft=$item.width()-1;
            $cm.css({'left':cmLeft,'width':216,'z-index':'10000'});
        }
        if($cm.filter('.zm-comment-box').has('.zm-comment-list').length){
/* Collections for comment
            $cm.find('.zm-comment-editable').bind('DOMNodeInserted',function(event){
                var $c=$(event.target),$cm=$c.closest('.zm-comment-box');
                if($c.is('a.member_mention')){
                    if($cm.children('.izh_collections').length<=0){
                        $('<div class="izh_collections">loading...</div>').bind('mouseover',function(){
                            $(this).show();
                        }).bind('mouseout',function(){
                            $(this).hide();
                        }).appendTo($cm);
                    }
                    $c.bind('mouseover',function(){
                        var $ce=$(this).closest('.zm-comment-editable'),$cm=$(this).closest('.zm-comment-box');
                        $cm.children('.izh_collections').css({
                            'bottom':$(this).height()-$(this).position().top-1
                          , 'left':$(this).position().left
                        }).show();
                        $.post('http://www.zhihu.com'+$(this).attr('href')+'/collections'
                          , $.param({_xsrf:$('input[name=_xsrf]').val()})
                          , function(result,status,xhr){
                                console.log(result);
                            });
                    });
                    $c.bind('mouseout',function(){
                        var $ce=$(this).closest('.zm-comment-editable'),$cm=$(this).closest('.zm-comment-box');
                        $cm.children('.izh_collections').hide();
                    });
                }
            });
*/
            if(iZhihu.Comment.RightComment){
                $cm.closest('.zm-item-meta').find('.toggle-comment').click(function(event){
                    var $openedBy=$(this)
                      , $ac=$openedBy.closest('.zm-item-meta')
                      , $cm=($ac.parent().is('.zm-item-meta.feed-meta')?$ac.parent():$ac).find('.zm-comment-box').css('visibility','hidden')
                    ;
                    if($cm.length){
                        var $item=iZhihu.getItem($cm);
                        if($cm.is(':hidden')){
                            iZhihu.Comment.open($item,$cm);
                        }else{
                            iZhihu.Comment.close($item,$cm);
                        }
                    }
                });
            }
            //if($cm.is('.empty')) return;
            var $list=$cm.find('.zm-comment-list');
            $list.bind('DOMNodeInserted',function(event){
            //utils.observeDOMNodeAdded($list[0],function(event){
            	/*if(!event.addedNodes)return;
                console.log('Nodes '+event.addedNodes.length+' inserted');
            	for(var i=0;i<event.addedNodes.length;i++){
            		var $icm=$(event.addedNodes[i]);
                }*/
                var $icm=$(event.target).filter('.zm-item-comment,.zm-comment-form');
                if(!$icm.length)return;
                var $list=$(this)
                  , $cm=$list.closest('.zm-comment-box:visible');
                if($icm.is('.zm-item-comment')){
                    //console.log($icm);
                    if(iZhihu.QuickBlock){
                        //console.log('Adding QuickBlock');
                        iZhihu.QuickBlock.addQuickBlockInOneComment($icm);
                    }
                    if(iZhihu.Comment.RightComment){
                        $list.css('height','100%');
                        $icm.show().bind('DOMNodeRemoved',function(event){
                            var $icm=$(event.target);
                            if(!$icm.is('.zm-item-comment'))return;
                            var $list=$icm.hide().closest('.zm-comment-list')
                              , $cm=$list.closest('.zm-comment-box:visible');
                            if($cm.length){
                                //console.log('Refreshing comment list');
                                if($list.children().length==1){
                                    $('.izh-quick-block-switch',$cm).add('.izh-buttons-cm-R',$cm).hide();
                                }
                                iZhihu.Comment.box($cm,false,false);
                            }
                        });
    
                        if($cm.length){
            	            var countNow=$list.children().length
                        	  , countAll=parseInt($cm.attr('data-count'))
                              , countRest=countAll-countNow
                              , notAll=$(this).has('.load-more').length
                        	;
                            if((!notAll)&&countRest>1){
                            	return;
                            }
                            //console.log('Refreshing comment list');
                            $('.izh-quick-block-switch',$cm).add('.izh-buttons-cm-R',$cm).show();
                            iZhihu.Comment.box($cm,false,false);
                            if(notAll||countRest<0)$list.scrollTop($icm.get(0).offsetTop);
                        }
                    }
                }else if($icm.is('.zm-comment-form')){
                    if(iZhihu.Comment.RightComment){
                        if($cm.length){
                            var $rcm=$icm;
                            $icm=$rcm.closest('.zm-item-comment');
                            $rcm.find('a.zm-comment-close.zm-command-cancel').click(function(event){
                                var $rcm=$(this).closest('.zm-comment-form').hide()
                                  , $cm=$rcm.closest('.zm-comment-box:visible');
                                if($cm.length){
                                    iZhihu.Comment.box($cm,false,false);
                                }
                            });
                            $rcm.parent().find('a.reply.zm-comment-op-link').click(function(event){
                                var $rcm=$(this).closest('.zm-comment-content-wrap').children('.zm-comment-form').toggle()
                                  , $icm=$(this).closest('.zm-item-comment')
                                  , $list=$icm.closest('.zm-comment-list')
                                  , $cm=$list.closest('.zm-comment-box:visible');
                                if($cm.length){
                                    iZhihu.Comment.box($cm,false,false);
                                    if($rcm.is(':visible'))$list.scrollTop($icm.get(0).offsetTop-$list.get(0).offsetTop);
                                    $rcm.toggle();
                                }
                            });
                            iZhihu.Comment.box($cm,false,false);
                            $list.scrollTop($icm.get(0).offsetTop-$list.get(0).offsetTop);
                        }
                    }
                }
            });
            var cmClose=function(event,alsoScrollToViewBottom){
                    var $cm=$(this).closest('.zm-comment-box');
                		if($(this).is('[name=closeform]')&&(!$cm.is('.empty')))return;
                    var $item=iZhihu.getItem($cm)//.attr('tabindex','-1').focus().removeAttr('tabindex')
                      , $itemMeta=$cm.closest('.zm-item-meta')
                      , alsoScroll=this.getAttribute('izh-alsoScrollToViewBottom')||''
                      , scrollTop=(document.body.scrollTop)?document.body.scrollTop:document.documentElement.scrollTop
                    ;
                    if(alsoScroll!=='1'){
                        $itemMeta.find('.toggle-comment')[0].click();
                        setTimeout(function(){
                            document.body.scrollTop=scrollTop;
                            document.documentElement.scrollTop=scrollTop;
                        },100);
                        return;
                    }
                    iZhihu.Comment.metaScrollToViewBottom($itemMeta,function(){
                        $itemMeta.find('.toggle-comment')[0].click();
                    },false,true);
                }
              , $btnCC=$('<a>',{
                    'class':'zu-question-answer-meta-comment izh-button-cc'
                  , href:'javascript:void(0);'
                  , click:cmClose
                  , 'data-tip':'s$t$收起评论并跳转至所属回答'
                }).text('收起')
              , $buttonsL=$('<div>',{
                	'class':'izh-buttons-cm-L'
                }).prependTo($cm)
              , $buttonsR=$('<div>',{
                	'class':'izh-buttons-cm-R'
                })
            ;
            if(iZhihu.Comment.RightComment){
                $cm.children('.zm-comment-form').find('[name=closeform]').click(cmClose);
                $btnCC.clone(true).css({
                    'background-image': 'url("/static/img/sprites-1.9.2.png")'
                  , 'background-position': '-261px -62px'
                  , 'background-repeat': 'no-repeat'
                  , 'display': 'inline-block'
                  , 'width': 15
                  , 'height': 15
                  , 'position': 'absolute'
                  , 'left': 0
                  , 'top': 0
                  , 'z-index': '10000'
                }).attr('data-tip','s$l$收起评论').text('').prependTo($cm)
                $buttonsR.prependTo($cm);
                if($list.children().length==0){
                    $buttonsR.hide();
                }
                $btnCC.css({
                    'float':'left'
                  , 'margin-left':7
                }).attr('izh-alsoScrollToViewBottom','1').prepend('<i class="z-icon-izh-fold"/>').prependTo($buttonsL);
                $('<a>',{
                    'class':'izh-button izh-back-top'
                  , 'data-tip':'s$l$返回顶部'
                  , href:'javascript:void(0);'
                  , click:function(){
                        $(this.parentNode).nextAll('.zm-comment-list').scrollTop(0);
                    }
                }).append(
                    $('<i>', { 'class': 'zg-icon z-icon-fold' })
                ).add(
                    $('<a>',{
                        'class':'izh-button izh-show-good'
                      , 'data-tip':'s$l$人气妙评'
                      , href:'javascript:void(0);'
                      , click:function(){
                           var $e=$(this)
                             , $c=$e.closest('.zm-comment-box')
                             , $l=$c.find('.zm-comment-list')
                             , $n=$l.find('.zm-item-comment').has('span.like-num.nil')
                           ;
                           if($e.hasClass('on')){
                               $e.attr('scrollTop_showgood',$l[0].scrollTop);
                               $n.show();
                               iZhihu.Comment.box($c,false,false);
                               $e.removeClass('on');
                               var scrollTop = parseInt($e.attr('scrollTop'));
                               if(!isNaN(scrollTop))
                                   $l.scrollTop(scrollTop);
                           }else{
                               $e.attr('scrollTop',$l[0].scrollTop);
                               $n.hide();
                               iZhihu.Comment.box($c,false,false);
                               $e.addClass('on');
                               var scrollTop = parseInt($e.attr('scrollTop_showgood'));
                               if(!isNaN(scrollTop))
                                   $l.scrollTop(scrollTop);
                           }
                        }
                    }).append(
                        $('<i>', { 'class': 'zg-icon zg-icon-comment-like' })
                    )
                ).css({
                    'float':'right'
                }).appendTo($buttonsR);

                iZhihu.Comment.PageNotScroll = true;
                $list.scroll(function(){
                    var $e=$(this)
                      , $b=$e.closest('.zm-comment-box').find('.izh-back-top')
                    ;
                    if($e.height() < this.scrollTop){
                        $b.removeClass('off');
                    }else{
                        $b.addClass('off');
                    }
                }).scroll();
                iZhihu.Comment.PageNotScroll = false;

                var icmFocus=null;
                    $list.css({
                        'height':$cm.is('.empty')?'':'100%'
                      , 'overflow':'auto'
                    });
                $list.children('.zm-item-comment').each(function(i,e){
                    var $icm=$(e);
                    $icm.bind('DOMNodeRemoved',function(event){
                        var $icm=$(event.target);
                        if(!$icm.is('.zm-item-comment'))return;
                        var $cm=$icm.hide().closest('.zm-comment-box:visible');
                        if($cm.length){
                            if($(this).closest('.zm-comment-list').children().length==1){
                                $('.izh-quick-block-switch',$cm).add('.izh-buttons-cm-R',$cm).hide();
                            }
                            iZhihu.Comment.box($cm,false,false);
                        }
                    });
                    $icm.find('span.like-num').each(function(i,e){
                        var tip=e.getAttribute('data-tip').replace('s$r$','s$l$');
                        if(tip!='')e.setAttribute('data-tip',tip);
                    });
                    if (!icmFocus&&focusName&&focusName!=''
                        && $icm.children('a.zg-anchor-hidden[name="'+focusName+'"]').length){
                        icmFocus=$icm.get(0);
                    }
                });
                iZhihu.Comment.open($item,$cm,icmFocus);
                utils.observeDOMNodeAdded($cm.children('.zm-comment-form').children('.zm-comment-editable')[0],function(event){
                    var $e=$(event.target)
                      , $f=$e.closest('.zm-comment-form')
                      , $l=$f.prev('.zm-comment-list')
                      , $c=$f.closest('.zm-comment-box[opened=1]')
                      , ch=$c.height()
                      , winHeight=iZhihu.$win.height()
                      , scrollTop=document.documentElement.scrollTop+document.body.scrollTop
                      , navHeight=iZhihu.$body.children().first().height()
                      , bar=$('.zu-global-notify.zu-global-notify-info:visible')
                      , barHeight=!bar.length?0:bar.outerHeight()
                      , baseTop=((barHeight&&bar.css('position')=='fixed')?barHeight:(scrollTop>barHeight?0:barHeight-scrollTop))+navHeight
                      , minHeight=112
                      , maxHeight=winHeight-baseTop-35
                    ;
                    if(!$c.length)return;
                    if(!$c.is('.empty')&&$l.children().length>0){
                        lh=$l.height();
                    }else{
                        lh=0;
                    }
                    var $t=$e.clone().appendTo(document.body)
                    	    .css({'position':'absolute','z-index':'-1','width':$e.width(),'min-height':22})
                      , eh=$t.height()
                      , h=Math.max(eh,lh)+(lh==0?90:100)
                    ;
                    $t.remove();$t=null;
                    if(isNaN(ch)||ch!=h){
                        $c.attr('izh_cmHeight',h);
                        iZhihu.Comment.box($c,true,false);
                    }
                    if(!$f.is('.expanded')&&event.addedNodes.length){
                        $f.css({'height':'','bottom':''});
                    }else{
                        eh+=30;
                        $f.css(lh==0||eh>ch?{'height':'','bottom':25}:{'height':eh,'bottom':''});
                    }
                });
            }else{
                $btnCC.prepend('<i class="z-icon-fold"/>')
                .css({
                    'position':'absolute'
                  , 'cursor':'pointer'
                  , 'margin-left':-1
                  , 'left':0
                  , 'background-color':'#fbfbfb'
                  , 'padding':'2px 5px'
                  , 'bottom':-22
                  , 'border':'1px solid #ddd'
                  , 'border-radius':'4px'
                }).insertBefore($cm.find('.zm-comment-box-ft'));
            }
            if(iZhihu.QuickBlock){
                iZhihu.QuickBlock.addQuickBlockInCommentList($buttonsL);
            }
        }
    };

    return this;
}

/**
 * @class Noti7
 */
function Noti7(iZhihu) {
    if ( typeof iZhihu === 'undefined' || !iZhihu || !iZhihu.config['Noti7']) {
        return null;
    }
    iZhihu.Noti7 = this;
    
    this.$noti7 = $('#zh-top-nav-live-new');
    this.$frame = $('.zm-noti7-frame',this.$noti7);
    this.$content = $('.zm-noti7-content-body',this.$noti7);
    this.$footer = $('.zm-noti7-popup-footer',this.$noti7);
    this.$tab = $('.zm-noti7-popup-tab-container','#zh-top-nav-live-new-inner');

    this.css = 
        ['#zh-top-nav-live-new .zm-noti7-popup-footer a[unreadonly="1"]{color:#225599 !important;text-shadow:0 0 1px #225599;}'
        ,''].join('\n');
    this.enhance = function(){
        iZhihu.Noti7.$tab.find('.zm-noti7-popup-tab-item').each(function(i,e){
            utils.observeDOMAttrModified(e,function(event){
                var $e=$(event.target);
                if($e.is('.zm-noti7-popup-tab-item.current')){
                	var currentClass=$e.attr('class')
                	  , $bFilterRead=$('.izh-filter-read',iZhihu.Noti7.$footer);
                	if(currentClass!=$bFilterRead.attr('currentClass')){
                	    $bFilterRead.attr({'unreadOnly':'','currentClass':currentClass});
                	}
                }
            });
        });
        iZhihu.Noti7.$footer.append(
            $('<a>',{
                'class':'izh-filter-read'
              , href:'javascript:void(0);'
              , 'unreadOnly':''
              , click:function(){
                    var unreadOnly=this.getAttribute('unreadOnly')=='1'
                      , $contentVisible=iZhihu.Noti7.$content.filter(':visible')
                      , $scroller=$contentVisible.closest('.zh-scroller-inner')
                      , $items=$contentVisible.find('.zm-noti7-content-item')
                    ;
                    unreadOnly=!unreadOnly;
                    this.setAttribute('unreadOnly',unreadOnly?'1':'');
                    if(unreadOnly){
                        $scroller.attr('scrollTop',$scroller[0].scrollTop);
                        $items.not('.unread').hide();
                        var scrollTop = parseInt($scroller.attr('scrollTop_unread'));
                        if(!isNaN(scrollTop))
                            $scroller.scrollTop(scrollTop);
                    }else{
                        $scroller.attr('scrollTop_unread',$scroller[0].scrollTop);
                        $items.not('.unread').show();
                        var scrollTop = parseInt($scroller.attr('scrollTop'));
                        if(!isNaN(scrollTop))
                            $scroller.scrollTop(scrollTop);
                    }
                }
              
            }).text('隐藏已读')
        );
    };

    return this;
}

/**
 * @class QuickBlock
 */
function QuickBlock(iZhihu) {
    if ( typeof iZhihu === 'undefined' || !iZhihu || !iZhihu.config['QuickBlock']) {
        return null;
    }
    iZhihu.QuickBlock = this;
    
/*
    var css_QuickBlock = {
            'background-position':'-146px -202px'
          , 'width':16
          , 'height':16
      	}
    ;
*/
    this.Pending = {Users:',',Count:0};
    this.Blocking = {Users:',',Count:0};
    this.Unfollowed = {Users:',',Count:0};
    this.Refollowed = {Users:',',Count:0};
    this.Users2B = []
    this.Users2BBQ = []
    this.css = 
        ['.izh_blockCart{background-color:#0771C1;position:fixed;right:0;z-index:9;padding:0 30px 0 60px;border:1px solid #0771C1;border-left-width:10px;border-top-left-radius:6px;}'
        ,'.izh_blockCart .do{color:#fff;text-align:center;display:block;margin:2px;min-width:80px;width:100%;height:20px;}'
        ,'.izh_blockCart.pending .do:after{text-decoration:blink;color:red;}'
        ,'.izh_blockCart .do:after{position:relative;content:attr(izh_num2B);}'
        ,'.izh_blockCart .do .button{color:#fff;}'
        ,'.izh_blockCart .frame{overflow-y:auto;overflow-x:hidden;position:absolute;top:25px;bottom:0;left:0;right:0;background-color:#fff;padding-top:5px;}'
        ,'.izh_blockCart .list{display:block;margin:2px;width:100%;padding-right:5px;}'
        ,'.izh_blockCart .list .rel{border-width:0 2px;border-style:solid;border-color:#fff;width:24px;height:18px;}'
        ,'.izh_blockCart .list.i_fo .rel{border-left-color:#259;background-position:-120px -184px;}'
        ,'.izh_blockCart .list.fo_i .rel{border-right-color:#259;background-position:-120px -164px;}'
        ,'.izh_blockCart .list.i_fo.fo_i .rel{background-position:-78px -200px;}'
        ,'.izh_blockCart .user2B{display:block;margin:2px 0;padding:0 40px 0 60px;}'
        ,'.izh_blockCart .user2B i.zg-icon{display:block;position:absolute;right:0;margin-top:5px;}'
        ,'.izh_blockCart .user2B .name{display:block;color:#fff;background-color:#000;white-space:nowrap;padding:2px 5px;border-radius:3px;}'
        ,'.izh_blockCart .list .user2B.unfo .name{background-color:#f00;}'
        ,'.izh_blockCart .user2B .del{display:block;position:absolute;margin-left:-4.5em;}'
        ,'.izh_blockCart .user2B i.say{display:block;position:absolute;margin-left:-44px;border-radius:6px 6px 0 6px;border:1px solid #999;padding:0 5px 0 3px;}'
        ,'.izh_blockCart .user2B i.say_1{display:block;position:absolute;margin-left:-10px;height:6px;background-color:#fff;width:6px;margin-top:17px;border-bottom:1px solid #999;}'
        ,'.izh_blockCart .user2B i.say_2{display:block;position:absolute;margin-left:-9px;height:6px;background-color:#fff;width:6px;margin-top:17px;border-radius:0 0 0 6px;border:1px solid #999;border-width:0 0 1px 1px}'
        ,'.izh-quick-block{position:absolute;text-align:center;width:4em;margin-top:1.5em;white-space:nowrap;}'
        ,'.izh-quick-block [class^=izh-quick-block]{position:absolute;display:block;white-space:nowrap;}'
        ,'.izh-quick-block:after{content:attr(izh_num2B);margin-top:1em;display:block;}'
        ,'.zm-comment-hd .izh-quick-block-pend{position:absolute;left:0;top:40px;}'
        ,''
        ].join('\n');
    this.unblockAll = function(){
        $('.blocked-users > .item-card').each(function(i,e){
            var uid=$(e).attr('data-id');
            $.post('/settings/unblockuser',$.param({
                _xsrf:$('input[name=_xsrf]').val()
              , uid:uid
            }),function(r){
            	//console.log(r);
            });
        });
	  };
	  this.doUnfollow = function(){
        var $e = iZhihu.QuickBlock.Users2BBQ.shift()
        if(typeof $e === 'undefined') return

        var uid=$e.attr('uid');
        $.post('/node/MemberFollowBaseV2'
          , $.param({
                method:'unfollow_member'
              , params:JSON.stringify({'hash_id':uid})
              , _xsrf:$('input[name=_xsrf]').val()
              })
          , function(r){
                  var query=decodeURIComponent(this.data)
                    , params=utils.getParamInQuery(query,'params')
                  ;
                  eval('params='+params);
                  var bid='fb-'+params.hash_id
                    , who=bid+','
                    , unfollowed=iZhihu.QuickBlock.Unfollowed
                    , refollowed=iZhihu.QuickBlock.Refollowed
                    , $cartDIV=$('#izh_blockCart')
                    , $user=$cartDIV.find('.user2B[uid='+params.hash_id+']')
                    , $list=$user.closest('.list')
                  ;
                  $user.prependTo($list.next().next());
                  if(unfollowed.Users.indexOf(','+who)<0)
                      unfollowed.Users += who;
                  if(refollowed.Users.indexOf(','+who)>=0)
                      refollowed.Users = refollowed.replace(','+who,',');
            }
        ).always(function(data, textStatus, jqXHR){
            iZhihu.QuickBlock.doUnfollow()
        });
	  };
    this.doQuickBlock = function(){
        var $e = iZhihu.QuickBlock.Users2BBQ.shift()
        if(typeof $e === 'undefined') return

        var blocking = iZhihu.QuickBlock.Blocking
          , href = $e.attr('href')
          , who = href.split('/').pop()+','
        ;
        if(typeof blocking === 'undefined' || !blocking){
            blocking = iZhihu.QuickBlock.Blocking = { Users:',', Count:0 };
        }else if(blocking.Users.indexOf(','+who) >= 0){
            return; // Already blocking
        }
        var $cartDIV=$('#izh_blockCart');
        $cartDIV.addClass('blocking');
        blocking.Users += who;
        blocking.Count ++;
        $.post(href+'/block',$.param({
            action:'add'
          , _xsrf:$('input[name=_xsrf]').val() 
        }),function(r){
            var href=this.url.replace('/block','')
              , userID=href.split('/').pop()
              , who=','+userID+','
              , blocking=iZhihu.QuickBlock.Blocking
            ;

            if(0==--blocking.Count)$cartDIV.removeClass('pending');
    
            if(blocking.Users.indexOf(who) < 0)
                return; // No this user in pending
              
            blocking.Users = blocking.Users.replace(who,',');
            $('#izh_blockCart .user2B[href="'+href+'"]').find('.del')[0].click();
            $('a[href$="'+href+'"]').css('text-decoration','line-through');
        }).always(function(data, textStatus, jqXHR){
            iZhihu.QuickBlock.doQuickBlock()
        });
  	};
    this.resizeBlockCart = function($cartDIV){
        function parseCssPx($item, name) {
            var m = $item.css(name);
            if (m != 'undefined') {
                return parseInt(m.replace('px',''));
            }
            return 0;
        }
        var $userDIV = $cartDIV.find('.list .user2B');
        var $titleBox = $('#izh_blockCart .do');
        var h = parseCssPx($cartDIV.find('div.frame'),'paddingTop') 
                + ($userDIV.height() + parseCssPx($userDIV,'marginTop')) * $userDIV.length 
                + $titleBox.height()
                + parseCssPx($titleBox, 'marginTop')
                + parseCssPx($titleBox, 'marginBottom');
        
        if(h+iZhihu.$main.offset().top<iZhihu.$win.height()){
            $cartDIV.css({'height':h,'bottom':''});
        }else{
            $cartDIV.css({'height':'','bottom':0});
        }
    };
    this.getCartDIV=function(){
        var $cartDIV=$('#izh_blockCart');
        if(!$cartDIV.length){
            $cartDIV=$('<div>', { id: 'izh_blockCart', 'class': 'izh_blockCart' }).css({
                'top':iZhihu.$main.offset().top
            }).append(
                $('<div>',{
                    'class':'do'
                  , 'izh_num2B':0
                  , 'title':'下为「候审」列表\n点击左上角可收起/展开\n数字为人犯总数（红色表示仍有人犯正待入列）'
                }).append(
                    $('<a>',{
                        'class':'button delAll'
                      , href:'javascript:void(0);'
                      , title:'清空「候审」列表'
                      , click:function(){
                          var $cartDIV=$('#izh_blockCart');
                          $cartDIV.css('bottom','').find('.list').empty();
                          $(this.parentNode).attr('izh_num2B','0');
                          $cartDIV.css('height','');
                        }
                    }).text('大赦').css({
                        'display':'block'
                      , 'position':'absolute'
                      , 'left':24
                    })
                ).append(
                    $('<input>',{
                        'class':'unfo'
                      , href:'javascript:void(0);'
                      , type:'checkbox'
                      , title:'选中后，将我关注之人标出，改以放逐（取消关注）论处'
                      , click:function(){
                          var $cartDIV=$(this.parentNode.parentNode)
                            , $users=$('.frame .list.i_fo .user2B',$cartDIV)
                            , $action=$('.action',this.parentNode);
                          if(this.checked){
                              $users.addClass('unfo');
                              $action.text('放逐').css('padding','0 2em 0 0').attr('title','对列表内我关注之人取消关注');
                          }else{
                              $users.removeClass('unfo');
                              $action.text('收监').css('padding','0 0 0 2em').attr('title','将下列人犯逐一加入黑名单');
                          }
                      }
                    }).css({
                        'display':'block'
                      , 'float':'left'
                      , 'height':22
                      , 'line-height':22
                    })
                ).append(
                    $('<span>',{
                        'class':''
                      , href:'javascript:void(0);'
                      , title:'选中后，将我关注的人标出，准备「取消关注」'
                    }).text('从轻').css({
                        'display':'block'
                      , 'float':'left'
                      , 'margin-right':20
                    })
                ).append(
                    $('<a>',{
                        'class':'button action'
                      , href:'javascript:void(0);'
                      , title:'将下列人犯逐一加入黑名单'
                      , click:function(){
                            var $cartDIV=$(this.parentNode.parentNode);
                            if($('.unfo',this.parentNode).is(':checked')){
                                $('.list.i_fo .user2B',$cartDIV).each(function(i,e){
                                    iZhihu.QuickBlock.Users2BBQ.push($(e))
                                });
                                iZhihu.QuickBlock.doUnfollow();
                            }else{
                                $('.list .user2B',$cartDIV).each(function(i,e){
                                    iZhihu.QuickBlock.Users2BBQ.push($(e))
                                });
                                iZhihu.QuickBlock.doQuickBlock();
                            }
                        }
                    }).text('收监').css({
                        'display':'block'
                      , 'float':'right'
                      , 'margin-left':20
                      , 'margin-right':-10
                      , 'padding':'0 0 0 2em'
                    })
                ).append(
                    $('<a>',{
                        'class':'zg-icon zg-icon-double-arrow'
                      , href:'javascript:void(0);'
                      , click:function(){
                          var $cartDIV=$('#izh_blockCart');
                          if($cartDIV.attr('mini')!='1'){
                              $cartDIV.find('.frame').hide();
                              $cartDIV.css({'height':'','bottom':''});
                              $cartDIV.attr('mini','1');
                          }else{
                              $cartDIV.find('.frame').show();
                              iZhihu.QuickBlock.resizeBlockCart($cartDIV);
                              $cartDIV.attr('mini','0');
                          }
                      }
                    }).css({
                        'position':'absolute'
                      , 'left':0
                      , 'top':5
                    })
                )
            ).append(
                $('<div>',{'class':'frame'}
                ).append(
                    $('<div>',{
                        'class':'list i_fo fo_i'
                    })
                ).append(
                    $('<div>',{
                        'class':'list i_fo'
                    })
                ).append(
                    $('<div>',{
                        'class':'list fo_i'
                    })
                ).append(
                    $('<div>',{
                        'class':'list'
                    })
                )
            ).appendTo(iZhihu.$body);
        }

        return $cartDIV
    }
    this.in2BlockCart = function(url,retriedCount){
        var $e = iZhihu.QuickBlock.Users2B.shift() || null
          , $cartDIV = iZhihu.QuickBlock.getCartDIV()

        $cartDIV.addClass('pending');
        if(typeof retriedCount == 'undefined')
            retriedCount = 0

        //console.log(retriedCount)
        if (!$e || $e.length === 0){
            if((url||'')==''){
                $cartDIV.removeClass('pending')
            }else{
                $.ajax(['',url].join(''),{
                    type:'GET'
                  , maxRetryCount: 3
                }).done(function(data, textStatus, jqXHR){
                    $.each(data.payload,function(i,e){
                        iZhihu.QuickBlock.addUser2B(e)
                    })
                    iZhihu.QuickBlock.in2BlockCart(data.paging.next)
                }).fail(function(data,textStatus,jXHR){
                    if (++retriedCount < this.maxRetryCount){
                        iZhihu.QuickBlock.in2BlockCart(url,retriedCount)
                    }else{
                        $cartDIV.removeClass('pending')
                    }
                })
            }
            return
        }

        var href = $e.attr('href')
          , username = href.split('/').pop()
          , who = username+','
        ;

        if($cartDIV.find('.user2B[href="'+href+'"]').length){
            return;
        }

        $.ajax('/node/MemberProfileCardV2?'+$.param({params:JSON.stringify({'url_token':username})}), {
            type: 'GET'
          , user2B: $e
          , maxRetryCount: 3
        }).done(function(data, textStatus, jqXHR){
            iZhihu.QuickBlock.addUser2B(data)
            iZhihu.QuickBlock.in2BlockCart(url)
        }).fail(function(data,textStatus,jXHR){
            if (++retriedCount < this.maxRetryCount){
                iZhihu.QuickBlock.Users2B.unshift(this.user2B)
                iZhihu.QuickBlock.in2BlockCart(url,retriedCount)
            }else{
            }
        }).always(function(data,textStatus,jXHR){
            $('#izh_blockCart').removeClass('pending');
        });
    };
    this.addUser2B=function(data){
        if (data === '') return
        var $html=$(data.replace(utils.RegexSrcPic, ''))
          , isZHPC=$html.is('.zh-profile-card')
          , $avatarLink=isZHPC?$html.find('.avatar-link:first'):$html.find('.zm-item-link-avatar:first')
          , href=$avatarLink.attr('href')
        if((href||'')=='')return

        var userID=href.substr(8)
          , userName=isZHPC?$avatarLink.text():$avatarLink.attr('title')
          , $btnFollow=$html.find('button[data-follow]')
          , hashID=!$btnFollow.length?'':$btnFollow.attr('data-id')
          , f_=$btnFollow.length&&$btnFollow.is('.zg-btn-unfollow')
          , _f=$btnFollow.length&&$btnFollow.is('[data-followme=1]')
          , cssF=_f||f_?'zg-icon rel ':''
          , $cartDIV=iZhihu.QuickBlock.getCartDIV()
          , $cart=$cartDIV.find('.list')
          , who=','+userID+','
        ;

        if(hashID==''){
            return; // User blocked or you blocked
        }
        
        if($cartDIV.find('.list .user2B[href="'+href+'"]').length){
            return; // User already in block list
        }

        var $user2B=$('<div>',{
                'class':'user2B'+(f_&&$cartDIV.find('.do .unfo:checked').length?' unfo':'')
              , 'href':href
              , 'uid':hashID
            })
            .append(
                $('<a>',{
                    'class':'button del'
                  , href:'javascript:void(0);'
                  , click:function(){
                        var $user=$(this).closest('.user2B')
                          , $cartDIV=$('#izh_blockCart')
                        ;
                        $user.remove();
                        var num2B=$cartDIV.find('.list .user2B').length;
                        $cartDIV.children('.do').attr('izh_num2B',num2B==0?'0':num2B>999?'1k+':num2B);
                        if(num2B)
                            iZhihu.QuickBlock.resizeBlockCart($cartDIV);
                        else
                            $cartDIV.css('height','');
                    }
                }).text('赦')
            ).append(
                $('<i>',{
                    'class':'say'
                  , 'data-tip':'p$t$'+userID
                }).text('冤枉')
            ).append($('<i>',{'class':'say_1'})
            ).append($('<i>',{'class':'say_2'})
            ).append($('<i>',{'class':cssF})
            ).append(
                $('<a>',{
                    'class':'name'
                  , href:href
                  , target:'_blank'
                }).text(userName)
            ).show()
        ;
        if(f_&&_f){
            $cart.eq(0).append($user2B);
        }else if(f_){
            $cart.eq(1).append($user2B);
        }else if(_f){
            $cart.eq(2).append($user2B);
        }else{
            $cart.eq(3).append($user2B);
        }
        var num2B=$cartDIV.find('.list .user2B').length;
        $cartDIV.children('.do').attr('izh_num2B',num2B==0?'0':num2B>9999?'10k+':num2B);
        iZhihu.QuickBlock.resizeBlockCart($cartDIV);
    }
    this.addQuickBlock = function($a){
        var $voteInfo=$('.zm-item-vote-info',$a)
        if($voteInfo.length){
            var $voters=$voteInfo.children('.voters')
            if($voters.length){
                var s=['，',$voteInfo.attr('data-votecount'),'个也不能忍，果断撕'].join('')
                  , aid=$a.attr('data-aid')||$a.children('[itemprop="ZReactor"]').attr('data-id')
                  , url=['/',$a.attr('data-type')=='p'?'post':'answer','/',aid,'/voters_profile'].join('')
                $('<a>',{href:'javascript:;','class':'text'}).text(s).bind('click',function(event){
                    var $t=$a.find('.author-info > a.name,.zm-item-answer-author-info > a.author-link')
                    if($t&&$t.length){
                        iZhihu.QuickBlock.Users2B.push($t)
                    }
                    iZhihu.QuickBlock.in2BlockCart(url)
                }).appendTo($voteInfo)
            }
        }
    };
    this.addQuickBlockInOneComment = function($cmItem){
        var $where=$('.zm-comment-hd',$cmItem);
        if($where.find('.izh-quick-block-pend').length)return;
        $('<a>',{
            'class':'izh-quick-block-pend izh-button'
          , href:'javascript:void(0);'
          , 'data-tip':'s$l$将此人列入候审名单以待收监'
        }).text('候审').click(function(){
            var $e = $(this).next()
            iZhihu.QuickBlock.Users2B.push($e)
            iZhihu.QuickBlock.in2BlockCart();
        }).prependTo($where).hide();
    };
    this.addQuickBlockInCommentList = function($where){
        // Region: 快速屏蔽
        var $cm=$where.is('.zm-comment-box')?$where:$where.closest('.zm-comment-box')
          , $u=$('.zm-item-comment',$cm)
        ;
        $u.each(function(i,e){
            iZhihu.QuickBlock.addQuickBlockInOneComment($(e));
        });
        var $btnQuickBlock=$('<a>',{
                'class':'izh-quick-block-switch izh-button'
              , href:'javascript:void(0);'
              , 'data-tip':'s$t$开始从评论者中选择屏蔽对象'
            }).text('快速屏蔽').css({'margin-left':7}).prependTo($where).click(function(){
                if(this.getAttribute('on')=='1'){
                    $('.zm-comment-hd .izh-quick-block-pend').hide();
                    $(this).attr({'data-tip':'s$t$开始从评论者中选择屏蔽对象','on':'0'}).removeClass('on');
                }
                else{
                    $('.zm-comment-hd .izh-quick-block-pend').show();
                    $(this).attr({'data-tip':'s$t$结束从评论者中选择屏蔽对象','on':'1'}).addClass('on');
                }
            })
        ;
        if($cm.is('.empty')){
            $btnQuickBlock.hide();
        }
        // Region end
    };
    
    iZhihu.$body.bind('DOMNodeInserted',function(event){
        $(event.target).filter('#zh-tooltip').bind('DOMNodeInserted',function(event){
            var $a=$(event.target).filter('#zh-tooltip-people').find('a[name=focus]')
              , bid=$a.attr('id')
              , who=','+bid+','
            ;
            if($a.is('.zg-btn-unfollow')&&iZhihu.QuickBlock.Unfollowed.Users.indexOf(who)>=0){
                $a.text('关注').removeClass('zg-btn-unfollow').addClass('zg-btn-follow');
            }
            if($a.is('.zg-btn-follow')&&iZhihu.QuickBlock.Refollowed.Users.indexOf(who)>=0){
                $a.text('取消关注').removeClass('zg-btn-follow').addClass('zg-btn-unfollow');
            }
        });
    });
    return this;
}

/**
 * @class QuickFavo
 */
function QuickFavo(iZhihu) {
    if ( typeof iZhihu === 'undefined' || !iZhihu || !iZhihu.config['QuickFavo']) {
        return null;
    }
    iZhihu.QuickFavo = this;
    
    this.DefaultCount = 4;
    this.PinnedList = iZhihu.config['QuickFavoPinned'];
    this.css = 
        ['.izh-Pin4QuickFavo{padding:3px 5px 0;float:right;display:block;margin-top:4px;margin-right:2em;line-height:1.25;}'
        ,'.izh-Pin4QuickFavo .zm-item-top-btn{visibility:visible;margin:0 4px;float:right;}'
        ,'div.izh_fav{position:absolute;z-index:9999;display:none;border:1px solid #999999;background-color:#fff;border-radius:5px 5px 5px 0;margin-left:-1px;}'
        ,'div.izh_fav .title{padding:0 5px;background-color:#0874c4;color:#fff;font-weight:bold;font-size:15px;text-align:center;border-radius:3px 3px 0 0;}'
        ,'div.izh_fav a.fav{display:block;clear:both;float;left;padding:0 36px 0 24px;line-height:2;}'
        ,'div.izh_fav a.fav i{position:absolute;margin-top:0.5em;}'
        ,'div.izh_fav a.fav i.spinner-gray{left:0;}'
        ,'div.izh_fav a.fav i.z-icon-collect{left:10px;visibility:hidden;background-position:-56px -36px;}'
        ,'div.izh_fav a.fav.selected i.z-icon-collect{visibility:visible;}'
        ,'div.izh_fav a.fav:hover{text-decoration:none}'
        ,'div.izh_fav a.fav span{float:right;display:block;margin-right:-32px}'
        ,'.meta-item.on{position:relative;z-index:10000;background-color:#fff;border:1px solid #999999;border-top-color:#fff;margin:-1px -8px -1px -1px;padding:0 7px;border-radius:2px 2px 3px 3px;}'
        ,''].join('\n');
    this.addQuickFavo = function($v,$a){
        if($v.length){
            if($a.children('.izh_fav').length<=0){
                $('<div>', { 'class': 'izh_fav' })
                	.append($('<i>', { 'class': 'spinner-gray' }))
                	.append('&nbsp;加载中...&nbsp;')
                	.bind('mouseover', function(){
	                    $(this).show().parent().find('.meta-item[name=favo]').addClass('on');
                	})
                	.bind('mouseout', function(){
	                    $(this).hide().parent().find('.meta-item[name=favo]').removeClass('on');
	                })
	            .appendTo($a);
            }
            $v.bind('mouseenter',function(){
                var $a=iZhihu.getItem($(this))
                  , $m=$(this).addClass('on').closest('.zm-item-meta')
                  , aid=$a.attr('data-aid')
                  , $op=$(this).offsetParent()
                  , bottom1=parseInt($op.css('margin-bottom'))
                  , bottom2=parseInt($a.css('padding-bottom'))
                  , pos=$(this).position()
                ;
                $a.children('.izh_fav').css({
                    'bottom':(isNaN(bottom1)?0:bottom1)+(isNaN(bottom2)?0:bottom2)+$op.height()-pos.top
                  , 'left':pos.left+$m.position().left
                }).show();
                $.getJSON('/collections/json',$.param({answer_id:aid}),function(result,status,xhr){
                    var aid=this.url.substr(this.url.indexOf('answer_id=')+10)
                      , sel=pageIs.Question?'.zm-item-answer'
                           :pageIs.Home?'.feed-item'
                           :pageIs.Answer?'.zm-item-answer'
                           :''
                      , $a=$(sel+'[data-aid='+aid+']')
                      , $v=$a.children('.izh_fav').empty().append($('<div>',{'class':'title',title:'以下为最近选择的收藏夹'}).append('快速收藏'))
                    ;
                    if(''==sel)return;
                    var favAll=result.msg[0]
                      , favSel=result.msg[1]
                      , num=iZhihu.QuickFavo.DefaultCount
                      , fav=new Array()
                      , favNormal=new Array()
                    ;
                    $.each(favAll,function(i,e){
                        var fID=e[0]
                          , pinned=iZhihu.QuickFavo.PinnedList[fID]
                        ;
                        if(pinned){
                          fav.push(e);
                        }else{
                          favNormal.push(e);
                        }
                    });
                    num -= fav.length;
                    if(num > 0){
                        fav=fav.concat(favNormal.slice(0,num));
                    }
                    favNormal.length=0;
                    while(fav.length){
                        var e=fav.shift()
                          , fID=e[0]
                          , fName=e[1]
                        ;
                        favNormal[fID]=fName;
                        var $f=$('<a/>',{
                                'class':'fav'
                              , href:'javascript:;'
                              , aid:aid
                              , fid:fID
                            }).text(fName).click(function(){
                                var u='/collection/'
                                  , $f=$(this)
                                  , $i=$f.children(':first')
                                ;
                                if($i.hasClass('spinner-gray'))return;
                                u+=$f.hasClass('selected')?'remove':'add';
                                $i.attr('class','spinner-gray');
                                $.post(u,$.param({_xsrf:$('input[name=_xsrf]').val(),answer_id:$(this).attr('aid'),favlist_id:$(this).attr('fid')}),function(result){
                                    var act=this.url.substring(this.url.lastIndexOf('/')+1)
                                      , fid=utils.getParamInQuery(this.data,'favlist_id')
                                      , aid=utils.getParamInQuery(this.data,'answer_id')
                                      , sel=pageIs.Question?'.zm-item-answer'
                                           :pageIs.Home?'.feed-item'
                                           :''
                                      , $vi=''==sel?null:$(sel+'[data-aid='+aid+'] .izh_fav a[fid='+fid+']')
                                      , inc=0;
                                    if(''==sel)return;
                                    if(act=='remove'&&result.msg=='OK'){
                                        $vi.removeClass('selected');
                                        inc=-1;
                                    }else if(act=='add'&&result.msg.length){
                                        $vi.addClass('selected');
                                        inc=1;
                                    }
                                    if(inc!=0){
                                        $vi.children('span').text(parseInt($vi.children('span').text())+inc);
                                    }
                                    $vi.children(':first').attr('class','z-icon-collect');
                                });
                            }).prepend($('<i/>',{'class':'z-icon-collect'}))
                              .append($('<span/>').text(e[3]));
                        $f.appendTo($v/*.children(pinned?'.pinned':'.normal')*/);
                    };
                    $.each(favSel,function(i,e){
                        if(favNormal[e])
                            $v.find('a.fav[fid='+e+']').addClass('selected');
                    });
                });
            });
            $v.bind('mouseleave',function(){
                var $a=iZhihu.getItem($(this).removeClass('on'));
                $a.children('.izh_fav').hide();
            });
        }
    };

    iZhihu.$body.bind('DOMNodeInserted',function(event){
		var $e=$(event.target);
		if($e.is('.modal-dialog')){
			$e.bind('DOMNodeInserted',function(event){
				var $e=$(event.target)
                  , $favList=$e.find('.zm-favo-list-content')
                ;
				if($favList.length){
					var $favItems=$favList.children('.zm-favo-list-item-link[data-lid]')
                      , funcPin=function(e){
                            var pinned=e.checked
                              , $e=$(e)
                              , $f=$e.closest('.zm-favo-list-item-link')
                            ;if(!$f.length)return;
                            var lid=$e.attr('lid')
                              , $checks=$e.closest('.zm-favo-list-content').find('.izh-Pin4QuickFavo .t_jchkbox')
                              , time=50
                              , cssStart={position:'relative','background-color':'#0874C4','z-index':'100'}
                              , cssEnd={position:'','background-color':'','z-index':''}
                              , funcRollUp=function(){
                                    var $b=$e.closest('.zm-favo-list-item-link')
                                      , $a=$b.prev()
                                    ;
                                    if(!$a.length||($a.hasClass('pinned')&&parseInt($a.attr('data-lid'))<parseInt($b.attr('data-lid')))){
                                        return;
                                    }
                                    $b.animate({bottom:$a.outerHeight()},{
                                        duration:time
                                      , step:function(now){$b.css(cssStart);}
                                      , complete:function(){
                                            $b.css($.extend({bottom:0},cssEnd));
                                            $b.insertBefore($a);
                                            funcRollUp();
                                        }
                                    });
                                }
                              , funcRollDown=function(){
                                    var $a=$e.closest('.zm-favo-list-item-link')
                                      , $b=$a.next()
                                    ;
                                    if(!$b.length||(!$b.hasClass('pinned')&&parseInt($b.attr('index'))>parseInt($a.attr('index')))){
                                        return;
                                    }
                                    $a.animate({top:$b.outerHeight()},{
                                        duration:time
                                      , step:function(now){$a.css(cssStart);}
                                      , complete:function(){
                                            $a.css($.extend({top:0},cssEnd));
                                            $a.insertAfter($b);
                                            funcRollDown();
                                        }
                                    });
                                }
                            ;
                            if(pinned){
                                $f.addClass('pinned');
                                funcRollUp();
                            }else{
                                $f.removeClass('pinned');
                                funcRollDown();
                            }
                            iZhihu.QuickFavo.PinnedList[lid]=pinned;
                            utils.setCfg('QuickFavoPinned',iZhihu.QuickFavo.PinnedList);
                        }
                    ;
					$favItems.each(function(i,e){
						var lid=e.getAttribute('data-lid')
                          , $pin=$('<a/>',{
                                href:'javascript:void(0);'
                              , 'class':'izh-Pin4QuickFavo'
                              , 'lid':lid
                              , 'data-tip':'s$b$保持在「快速收藏」菜单顶部显示'
                            }).append($('<span/>').append('置顶').add('<i/>',{'class':'zm-item-top-btn'}))
                              .appendTo($('.zg-gray',e)).attr('index',i)
                        ;
                        e.setAttribute('index',i);
                        $pin.bind('click',function(event){
                            this.checked=!this.checked;
                            funcPin(this);
                            if(this.checked){
                                $(this).children('span').text('取消置顶');
                                $(this).children('i').addClass('zm-item-top-btn-cancel');
                            }else{
                                $(this).children('span').text('置顶');
                                $(this).children('i').removeClass('zm-item-top-btn-cancel');
                            }
                            if(event.preventDefault)
                                event.preventDefault();
                            else if(event.stopPropagation)
                                event.stopPropagation();
                            else
                                event.cancelBubble=true;
                            return false;
                        })[0].checked=false;
                        if(iZhihu.QuickFavo.PinnedList[lid]){
                            $pin.click();
                        }
					});
				}
			});
		}
	});

    return this;
}

/**
 * @class SearchingList
 */
function SearchingList(iZhihu) {
    if ( typeof iZhihu === 'undefined' || !iZhihu) {
        return null
    }
    iZhihu.SearchingList = this
    
    this.$topSearch = $('#zh-top-search-form')
    this.$topSearchInput = $('#zh-top-search-form > input#q')
    if (!this.$topSearch.length) return

    this.SearchEngineOutsideList = {
        'google': {icon:'https://www.google.com/favicon.ico',url:'https://www.google.com/?q=site:zhihu.com%20{0}#q=site:zhihu.com+{0}'}
      , 'baidu': {icon:'http://www.baidu.com/favicon.ico',url:'http://www.baidu.com/s?wd=site:zhihu.com%20{0}'}
    }

    utils.observeDOMNodeAdded(this.$topSearch[0],function(event){
        var _a = event.addedNodes || []
        if (!_a.length) return
        utils.observeDOMNodeAdded(_a[0],function(event){console.log(iZhihu.config['SearchEngineOutside'])
            var _a = event.addedNodes || [null]
              , $item = $(_a[0])
              , seoKey = iZhihu.config['SearchEngineOutside'] || 'baidu'
              , seo = iZhihu.SearchingList.SearchEngineOutsideList[seoKey] || {icon:'',url:''}
              , strSearchUrl = seo.url.replace(/\{0\}/g, function(){return iZhihu.SearchingList.$topSearchInput.val()})
            console.log(seoKey)
            if ($item.is('.ac-row[role=option]')){
                var $a = $item.children('a')
                  , href = $a.attr('href')
                  , css = 'float:right;background-position:-284px -2px;'
                  , $aNew = $('<a>', {class:'zg-icon',style:css,href:href,target:'_blank',click:function(event){
                        event.stopPropagation()
                    }})
                if (href.indexOf('/search?') === 0) {
                    $aNew.css({marginTop:'0.5em'})
                    $item.append($('<a>', {class:'icon',style:'margin-top:0.5em;float:left',href:strSearchUrl,target:'_blank',click:function(event){
                        event.stopPropagation()
                    }}).append($('<img>', {border:0,src:seo.icon,width:16,height:16})))
                } else if (href.indexOf('/question/') < 0) {
                    $aNew.css({marginTop:'-1.5em'})
                }
                $item.append($aNew)
            }
        })
    })

    return this
}

/**
 * @class TopNav
 */
function TopNav(iZhihu) {
    if ( typeof iZhihu === 'undefined' || !iZhihu || !iZhihu.config['TopNavAutoFold']) {
        return null
    }
    iZhihu.TopNav = this
    
    this.$topNav = $('body > .zu-top:first')
        .on('mouseover', function(event){
            this.style.top = '0'
            this.setAttribute('izh-mouseover', '1')
            $('#izhCSS_NotiNum').remove()
        })
        .on('mouseout', function(event){
            this.setAttribute('izh-mouseover', '0')
            iZhihu.TopNav.funcFold()
        })
    if (!this.$topNav.length) return

    this.topNavHeight = this.$topNav.height() - 5

    this.funcFold = function(event){
        var scrollTop = document.documentElement.scrollTop || document.body.scrollTop || 0
          , _self = iZhihu.TopNav
          , isMouseOver = '1' === (_self.$topNav.attr('izh-mouseover') || '')
          , $head = $('head:first')
          , $cssNotiNum = $('#izhCSS_NotiNum')
          , $floatingBar = $('body > .goog-scrollfloater-floating')
        if (scrollTop === 0) {
            _self.$topNav.css({top:0})
        } else if (!isMouseOver) {
            if (scrollTop < _self.topNavHeight) {
                _self.$topNav.css({top:-scrollTop})
                $floatingBar.css({marginTop:-scrollTop})
            } else {
                _self.$topNav.css({top:-_self.topNavHeight})
                $floatingBar.css({marginTop:-_self.topNavHeight})
            }
            if (scrollTop > 20) {
                if (!$cssNotiNum.length) {
                    $('<style>', {
                        id: 'izhCSS_NotiNum'
                      , type: 'text/css'
                    }).appendTo('head:first').text('#zh-top-nav-count,#zh-top-nav-new-pm{position:absolute;top:40px;border-radius:0 !important}.top-nav-profile .zu-top-nav-userinfo{overflow:visible !important}')
                }
                return
            }
        }
        $cssNotiNum.remove()
    }

    iZhihu.$win.scroll(this.funcFold)

    this.onNodeAdded = function(event){
        iZhihu.TopNav.funcFold()
        $.each(event.removedNodes, function(i, e){
            var $floatingBar = $(e).filter('.goog-scrollfloater').css({marginTop:''})
        })
    }

    return this
}

allLinks = function(_name, _listSel, _listName) {
    this.name = _name
    this.listSel = _listSel
    this.listName = _listName
    this.dlgID = 'izh-dlg-' + _name
    this.$dlg = null
    var _initialTitle = _listName + '地址清单'
      , _result = new Array()
      , _loadTimes = 0

    //分析内容
    var processNode = function(content,$dlg){
      var $qCurrent = null;
      $('.zm-item-answer', content).each(function(index, item){
        var $a = $(item)
          , $q = $a.closest(".zm-item").children("h2").children("a")
        ;
        if($q.length){
          $qCurrent=$q;
        }else if($qCurrent){
          $q=$qCurrent;
        }else{
          return;
        }
        var hrefQuestion = url.data.attr["base"] + $q.attr("href").replace(url.data.attr["base"],'');
        var obj = {
            title: $q.text(),
            //questionUrl: hrefQuestion,
            answerUrl: hrefQuestion + ($a.parent().is(".zm-item-fav") ? "/answer/" + $a.attr("data-atoken") : ""),
            answerAuthor: $a.find('.zm-item-answer-author-wrap a[href^="/people"]').text().trim(),
            summary: $a.find(".zm-item-answer-summary").children().remove().end().text(),
            content: $a.find(".zm-editable-content").html()
        };
        _result.push(obj);
        var strTitle = utils.formatStr('* 《{title}》&#13;* {answerAuthor}：&#13;* {summary}', obj)
          , strURL = utils.formatStr('{answerUrl}', obj)
          , $li = $('<li>').append($('<a>', { href: strURL, title: strTitle }).text(strURL)).css({ 'list-style-type': 'none' })
        $('.izhihu-collection-links',$dlg).append($li);
        var count=_result.length;
        $('.izhihu-collection-info',$dlg).text('（努力加载中...已得到记录 ' + count + ' 条）');
      });
    };
        
    var handler = function(pageWant,pageNow,$dlg){
      if (!pageNow)pageNow=1;
      if($dlg.is(':hidden')){
        var count=_result.length;
        $('.izhihu-collection-info',$dlg).text('（加载被终止...已得到记录 ' + count + ' 条）');
        $('#zh-global-spinner').hide();
        return;
      }
      
      if(pageWant==1){
        $('.izhihu-collection-links',$dlg).empty();
        $('#zh-global-spinner').show();
        _result.length=0;
        _loadTimes++;
        $('.izhihu-collection-info',$dlg).text('');
      }
      var $pager=$(_listSel).parent().find('.zm-invite-pager')
        , $lastPage=$pager.children('span').last().prev()
        , totalCount=$pager.length==0?1:Number($lastPage.text())
      ;
      if(pageWant>totalCount){
        $('.izhihu-collection-info',$dlg).text('（加载完成，共得到记录 ' + _result.length + ' 条）');
        $('#zh-global-spinner').hide();
        $('.selAll',$dlg).click();
        return;
      }

      var pageNext=pageWant+1;
      if(pageWant==pageNow){
        processNode($(_listSel).html(),$dlg);
        handler(pageNext,pageNow,$dlg)
      }else{
        var _url=url.data.attr['base']+url.data.attr['path']+'?page='+pageWant;
        $.ajax(_url,{type:'get',context:{loadTimes:_loadTimes}}).done(function(result){
          if(this.loadTimes!=_loadTimes)return;
          processNode(result,$dlg);
          handler(pageNext,pageNow,$dlg)
        });
      }
    };

    //初始化弹出框
    this.initDialog = function(){
        this.$dlg=$('#'+this.dlgID);
        var retVal=0<this.$dlg.length;
        if(!retVal){
            this.$dlg = $('<div>', { id: this.dlgID, 'class': 'modal-dialog allLinks', tabindex: '0', style: 'display: none;width:500px', name: _name, 'listSel': _listSel })
                .append($('<div>', { 'class': 'modal-dialog-title modal-dialog-title-draggable' })
                    .append($('<span>', { 'class': 'modal-dialog-title-text' }).text(_initialTitle))
                    .append($('<span>', { 'class': 'modal-dialog-title-text izhihu-collection-info' }))
                    .append($('<span>', {
                        'class': 'modal-dialog-title-close'
                      , click: function() {
                            $('#zh-global-spinner').hide()
                            $('.modal-dialog-bg').hide()
                            $(this).closest('.modal-dialog').hide()
                        }
                    }))
                )
                .append($('<div>', { 'class': 'modal-dialog-content' })
                    .append($('<div>')
                        .append($('<div>', { 'class': 'zg-section' })
                            .append($('<div>', { 'class': 'izhihu-collection-links zg-form-text-input', tabIndex: '-1', style: 'height:300px;overflow-y:scroll;outline:none;' }))
                            .append($('<form>', { action: 'http://ilovezhihu.duapp.com/saveMe.py', method: 'post', target: '_blank', style: 'display:none' })
                                .append($('<textarea>', { style: "width: 100%;", name: "links", 'class': "izhihu-collection-links-post" }))
                                .append($('<input>', { name: 'title' }))
                            )
                        )
                        .append($('<div>', { 'class': 'zm-command' })
                            .append($('<div>', { 'class': 'zg-left' })
                                .append($('<a>', {
                                    'class': 'zg-btn-blue reload'
                                  , href: 'javascript:void(0);'
                                  , click: function() {
                                        var $d = $(this).closest('.modal-dialog')
                                        handler(1, Number(url.data.param.query['page']), $d)
                                    }
                                }).text('重新获取'))
                            )
                            .append($('<a>', {
                                'class': 'zg-btn-blue save'
                              , href: 'javascript:void(0);'
                              , click: function() {
                                    var $dlg = $(this).closest('.modal-dialog-content')
                                      , $links = $dlg.find('.izhihu-collection-links')
                                      , $linksPost = $dlg.find('.izhihu-collection-links-post')
                                      , $linksTitle = $linksPost.next()
                                      , $form = $linksPost.parent()
                                      , links = ''
                                    ;
                                    $links.find('li a').each(function(i, e) {
                                        links += e.getAttribute('href') + '\n'
                                    })
                                    $linksPost.val(links)
                                    $linksTitle.val($('#zh-fav-head-title,.zm-profile-header-main .title-section a.name').text())
                                    $form.submit()
                                }
                            }).text('保存'))
                        )
                    )
                ).appendTo(document.body)
                .draggable({ handle: '.modal-dialog-title-draggable' })

            if(this.$dlg.length)
                retVal = true

        }
        return retVal
    }

    this.start = function($d) {
        if ($('#zh-global-spinner:visible').length) return
        if (!$d) $d = this.$dlg
        if (!$d) return
        if (!$('.izhihu-collection-links', $d).children().length) {
            handler(1, Number(url.data.param.query['page']), $d)
        }
    }

}

/**
 * 回答页
 */

  if(pageIs.Answer){

var $lblQuestionMeta=$('#zh-question-meta-wrap')//question_meta
;

    var $questionWrap=$('#zh-question-meta-wrap');
    $questionWrap.children('.panel-container').bind('DOMNodeInserted',function(event){
        window.iZhihu.Comment.processComment($(event.target));
    });
    if(window.iZhihu.Comment.RightComment){
        //$questionWrap.children('.meta-item[name=addcomment]').prependTo($questionWrap);
        window.iZhihu.Comment.processCommentButton($questionWrap);
        if(!$('#izh_QuestionShadow').length){
            $('<div>',{'class':'izh_boxShadow',id:'izh_QuestionShadow'}).css({
                'z-index': '-1'
              , 'position': 'relative'
              , 'top': -25
              , 'margin-left': -32
            }).prependTo('body>.zu-main:first').hide();
        }   
    }

    //process each answer
    var $listAnswers=$('.zm-item-answer,.feed-item','#zh-question-answer-wrap');
    if($listAnswers&&$listAnswers.length){
        $listAnswers.each(function(i,e){
            window.iZhihu.Answer.processAnswer($(e),null
              , izhAuthorRear
              , false);
        });
    }

    $('#zh-question-answer-wrap').bind('DOMNodeInserted',function(event){
        var $na=$(event.target).filter('.zm-item-answer');
        if($na.length){
            window.iZhihu.Answer.processAnswer($na,null
                , izhAuthorRear
                , false);
        }
    });

    var $cm=$('.zm-comment-box',$questionWrap);
    if($cm.length && $cm.is(':visible')){
    	var focusName = iZhihu.Comment.scrollFocusCommentOnPageLoad($cm);

    	iZhihu.Comment.metaScrollToViewBottom($cm.closest('.zm-item-meta'),function(){
            iZhihu.Comment.processComment($cm, focusName);
        });
    }
  }

/**
 * 收藏页
 */
  if(pageIs.Collection){
    //添加按钮
    $('#zh-list-meta-wrap')
      .append($('<span>', { 'class': 'zg-bull' }).text('•'))
      .append($('<a>', { href: 'javascript:;', id: 'getAllLinks' }).text('地址清单'));

    var btn = $('#getAllLinks');
    var result = [];
        
    //注册点击事件
    btn.click(function(){
      var allLinksCollection=new allLinks('Collections','#zh-list-answer-wrap','收藏夹内容');
	  if(!allLinksCollection.initDialog())return;
      $('.modal-dialog-bg').show();
      var y = ($win.height() - allLinksCollection.$dlg.width()) / 2
        , x = ($win.width() - allLinksCollection.$dlg.width()) / 2
      ;
      allLinksCollection.$dlg.css({'top': y, 'left': x}).fadeIn('slow');
      allLinksCollection.start();
    });
  }
  if(pageIs.Answers){
    //添加按钮
    $('.zm-profile-section-name')
      .append($('<span>', { 'class': 'zg-bull' }).text('•'))
      .append($('<a>', { href: 'javascript:;', id: 'getAllLinks' }).text('地址清单'));

    var btn = $('#getAllLinks');
    var result = [];
        
    //注册点击事件
    btn.click(function(){
      var allLinksAnswers=new allLinks('Answers','#zh-profile-answer-list','用户回答');
	  if(!allLinksAnswers.initDialog())return;
      $('.modal-dialog-bg').show();
      var y = ($win.height() - allLinksAnswers.$dlg.width()) / 2
        , x = ($win.width() - allLinksAnswers.$dlg.width()) / 2
      ;
      allLinksAnswers.$dlg.css({'top': y, 'left': x}).fadeIn('slow');
      allLinksAnswers.start();
    });
  }

  if(pageIs.MyCollection&&window.iZhihu.QuickFavo){
    var $favItems=$('#zh-favlists-wrap').children('.zm-item');
    $favItems.each(function(i,e){
    });
  }

/*
 * 首页
 */
    var $topstory=$('#is-topstory2')
      , isTopStory=$topstory&&$topstory.length
      , propFeedType='data-type'//:'data-feedtype'
      , $lblHomeTitle=$('#zh-home-list-title')//activity_caption
      , $btnNewActivity=$('#zh-main-feed-fresh-button')//new_activity
      , $feedList=$('.zh-general-list')//feed_list
      , $topLinkHome=$('#zh-top-link-home')
      , $filter=//isTopStory?
            $('<span>', { 'class':'izh-feeds-filter' })
                .append($('<a>', { 'class': 'izh-button izh-feeds-filter-option', 'showFeeds': 'q' })
                    .append($('<i>', { 'class': 'zg-icon' }))
                    .append('问题')
                )
                .append($('<a>', { 'class': 'izh-button izh-feeds-filter-option', 'showFeeds': 'a' })
                    .append($('<i>', { 'class': 'zg-icon' }))
                    .append('回答')
                )
                .append($('<a>', { 'class': 'izh-button izh-feeds-filter-option', 'showFeeds': 'p,r', 'data-tip': 's$t$专栏、圆桌' })
                    .append($('<i>', { 'class': 'zg-icon' }))
                    .append('其他')
                )
      , $filterInfo=$('<a>',{'class':'izh-feeds-filter-info nothing',href:'javascript:void(0);'}).on('click',function(){$filter.trigger($filter.is(':hidden')||$filter.attr('doing')=='hide'?'show':'hide');})
      , ShowFeeds=function(type,enable){
            var id="izhCSS_FilterFeed_"+type
              , nd=document.getElementById(id)
            ;
            if(enable){
                if(nd)nd.parentNode.removeChild(nd);
            }else if(heads.length){
                if(!nd){
                    nd=_doc.createElement('style');
                    nd.type='text/css';
                    nd.id=id;
                    nd.appendChild(_doc.createTextNode('.feed-item['+propFeedType+'^="'+type+'"]{display:none}'));
                    heads[0].appendChild(nd);
                }
                //{ROUNDTABLE_ADD_RELATED: "roundtable",ARTICLE_VOTE_UP: "post_vote",ARTICLE_CREATE: "post_create",RECOMMENDED: "feed_recommended",QUESTION_FOLLOW: "feed_question_follow",QUESTION_CREATE: "feed_question",ANSWER_VOTE_UP: "feed_answer_vote",ANSWER_CREATE: "feed_answer_answer"};
            }
        }
      , refreshFilterInfo=function(){
            var count=$feedList.children('.feed-item:hidden').length
              , info=' >过滤选项<'
            ;
            if(count){
                info='（'+count+'条动态被隐藏）';
                $filterInfo.removeClass('nothing').css({display:''});
            }else{
                $filterInfo.addClass('nothing');
            }   
            $filterInfo.text(info);
        }
      , feedsColumns=function(){ // Implemented by morley, modified by unogz
            //动态的类型
            var feedTypes = //isTopStory?
                [{
                 index: 0,
                 name: '全部',
                 codeName: ''
                }, {
                 index: 1,
                 name: '问题',
                 codeName: 'q'
                }, {
                 index: 2,
                 name: '回答',
                 codeName: 'a'
                }, {
                 index: 3,
                 name: '专栏',
                 codeName: 'p'
                }];
            
            //自定义 CSS 到 head
            var styles = [];
            
            styles.push('.za-filter{display: inline-block;margin-right:10px;cursor:pointer;color:#999;}');
            styles.push('.za-filter.active{color:#259;}');
            styles.push('.za-filter>.zg-num.hide{display:none;}');
            
            $('<style/>').text(styles.join('')).appendTo('head');
            
            var $zhHomeListTitle = $lblHomeTitle;
            
            //根据类型添加过滤按钮 到 #zh-home-list-title
            var filterBtns = []
              , i = feedTypes.length;
            
            while (i--) {
             filterBtns.push(
                 $('<span>').addClass('za-filter')
                 .attr('typeIndex', feedTypes[i].index)
                 .text(feedTypes[i].name)
                 .append($('<span>', { 'class': 'zg-num' }).addClass('hide'))
                 .on('click', toggleFeedType)
             );
            }
            
            filterBtns.reverse();
            filterBtns[0].addClass('active');

            $zhHomeListTitle.contents().filter(function(i,e){
                return (e!=null&&(e.nodeValue||'').indexOf('最新动态')>=0)
            }).remove()
            $zhHomeListTitle.find('i').eq(0).after(filterBtns).remove();
            
            var $targetZero = filterBtns[0].find('.zg-num')
              , curfeedTypeCodeName = ''
            
            function typeMatch($elem) {
             if (curfeedTypeCodeName == '') {
                 $elem.show();
             } else if (0 <= $elem.attr(propFeedType).indexOf(curfeedTypeCodeName)) {
                 $elem.show();
             } else {
                 $elem.hide();
             }
            }
            
            //按钮事件
            function toggleFeedType() {
             var $clicked = $(this);
             $clickedNum = $clicked.find('.zg-num');
             // 交互效果
             filterBtns.forEach(function(item) {
                 item.removeClass('active');
             });
            
             $clicked.addClass('active');
            
             if ($clicked.attr('typeIndex') == 0) {
                 $('.zg-num', '.za-filter').text('').addClass('hide');
             } else {
                 var totalUnread = (parseInt($targetZero.text()) || 0) - (parseInt($clickedNum.text()) || 0);
                 if (totalUnread != 0) {
                     $targetZero.text(totalUnread);
                 } else {
                     $targetZero.text('').addClass('hide');
                 }
            
                 $clickedNum.text('').addClass('hide');
             }
             curfeedTypeCodeName = feedTypes[$clicked.attr('typeIndex')].codeName;
             // 信息流过滤
             $('.feed-item').each(function() {
                 typeMatch($(this));
             });
            }
            
            function getTypeIndexByCodeName(codeName) {
             var i = feedTypes.length;
             while (i--) {
                 if (codeName == feedTypes[i].codeName) {
                     return i;
                 };
             }
            }
            
            var MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
            
            //监听推送
            var hasNewFeed = false;
            //create an observer instance
            var observer = new MutationObserver(function(mutations) {
             if ( !! parseInt($btnNewActivity.text())) {
                 mutations.forEach(function(mutation) {
                     if (mutation.type === 'childList') {
                         console.log('Has New Feed');
                         // 有新推送则触发之
                         hasNewFeed = true;
                         $btnNewActivity.text('');
                         $.when($btnNewActivity[0].click()).done(function() {
                             setTimeout(function() {
                                 hasNewFeed = false;
                             }, 1000);
                         });
                     }
                 });
             };
            });
            
            //pass in the target node, as well as the observer options
            observer.observe(
             $btnNewActivity[0], {
                 childList: true
             });
            
            //监听插入
            $feedList.on("DOMNodeInserted", function(e) {
             var $self = $(e.target);
            
             if ($self.hasClass('feed-item')) {
                 if (hasNewFeed) {
                     $self.hide();
                     var $target = filterBtns[getTypeIndexByCodeName($self.attr(propFeedType))].find('.zg-num');
                     $target.text((parseInt($target.text()) || 0) + 1).removeClass('hide');
                     $targetZero.text((parseInt($targetZero.text()) || 0) + 1).removeClass('hide');
                 } else {
                     typeMatch($self);
                 }
             }
          });
        }
      , homeFeeds=function(izhHomeFeedsColumns){
            if (izhHomeFeedsColumns){
                feedsColumns();
            }else{
                $filter.children('.izh-feeds-filter-option').addClass('on').click(function(event){
                    var i=0
                      , $e=$(this)
                      , fs=$e.attr('showFeeds')
                      , fa=fs.split(',')
                    ;
                    $('.izh-feeds-filter-option[showFeeds="'+fs+'"]').toggleClass('on');
                    for(;i<fa.length;i++){
                        ShowFeeds(fa[i],$e.is('.on'));
                    }
                    refreshFilterInfo();
                });
                if($topLinkHome.length){
                    var $filter2=$('<div>')
                            .css({position:'absolute',border:'1px solid #777',backgroundColor:'#fff'}).hide()
                            .append($filter.clone(true,true).css({display:'block'}))
                            .on('show',function(){
                                var $e=$(this).stop();
                                if($e.is(':hidden'))
                                    $e.css({display:'',opacity:0})
                                $e.animate({opacity:1},'slow');
                            })
                            .on('hide',function(){
                                var $e=$(this).stop();
                                $e.fadeOut('slow');
                            })
                    ;
                    $topLinkHome.after($filter2).parent()
                        .on('mouseenter',function(event){
                            var $e=$(this)
                              , $f=$e.children().last()
                            ;
                            $f.trigger('show');
                            $filterInfo.filter('.nothing').hide();
                        })
                        .on('mouseleave',function(event){
                            var $e=$(this)
                              , $f=$e.children().last()
                            ;
                            $f.trigger('hide');
                            $filterInfo.filter('.nothing').hide();
                        })
                    ;
                }
                if($lblHomeTitle.length){
                    $filterInfo.css({
                        display:'none'
                      , textDecoration:'none'
                      , cursor:'pointer'
                    }).insertBefore(isTopStory?$topstory:$('#feed-ver'));
                    $lblHomeTitle.css({overflow:'hidden'})
                        .prepend($filter)
                        //.children('i:first')
                        .on('mouseenter',function(event){
                            var $e=$(this)
                              , $f=$e.children('.izh-feeds-filter-info.nothing').stop()
                            ;
                            if($f.is(':hidden'))
                                $f.css({display:'',opacity:0})
                            $f.animate({opacity:1},'fast');
                        })
                        .on('mouseleave',function(event){
                            var $e=$(this)
                              , $f=$e.children('.izh-feeds-filter-info.nothing').stop()
                            ;
                            $f.fadeOut('fast');
                        })
                    ;
                    $filter.css({marginLeft:-$filter.width(),display:'none'})
                        .on('show',function(){
                            var $e=$(this);
                            if($e.attr('doing')==='show')return;
                            $e.attr('doing','show').stop();
                            if($e.is(':hidden'))
                                $e.css({display:''})
                            $e.animate({marginLeft:0},'slow',function(){$(this).css('display','').removeAttr('doing');});
                        })
                        .on('hide',function(){
                            var $e=$(this);
                            if($e.attr('doing')==='hide')return;
                            $e.attr('doing','hide').stop();
                            $e.animate({marginLeft:-$filter.width()},'slow',function(){$(this).css('display','none').removeAttr('doing');});
                        })
                        .on('mouseenter',function(event){
                            var $e=$(this)
                            ;
                            $e.trigger('show');
                        })
                        .on('mouseleave',function(event){
                            var $e=$(this)
                            ;
                            $e.trigger('hide');
                        })
                    ;
                    refreshFilterInfo();
                }
            }
        }
    ;
    if(pageIs.Home||pageIs.Debuts){
        $feedList.find('.feed-item').each(function(i,e){
            window.iZhihu.Answer.processAnswer($(e),null
              , izhAuthorRear
              , izhAuthorList
            );
        });
        $feedList.bind('DOMNodeInserted',function(event){
            var $item=$(event.target);
            if($item.is('.feed-item')){
                window.iZhihu.Answer.processAnswer($item,null
                  , $body.attr('izhAuthorRear')=='1'
                  , $body.attr('izhAuthorList')=='1'
                );
                refreshFilterInfo();
            }
        });
    }

    if (pageIs.Home){
    	var bHomeFeedsColumns=window.iZhihu.config['HomeFeedsColumns']
        if (izhHomeNoti&&!bHomeFeedsColumns
         && $lblHomeTitle.length
         && $btnNewActivity.length
        ){
            $lblHomeTitle.css({
                'float':'left'
              , 'margin-bottom':'2px'
              , 'line-height':'32px'
              , 'width':'100%'
              }).next().css('clear','both');
            $btnNewActivity.css({
                'float':'right'
              , 'margin':'0'
              , 'line-height':'22px'
            }).appendTo($lblHomeTitle);
        }
        homeFeeds(bHomeFeedsColumns);
    }


/**
 * 问题页
 */

  if(pageIs.Question){

    var $lblQuestionMeta=$('#zh-question-meta-wrap')//question_meta
      , $listAnswers=$('#zh-question-answer-wrap,#zh-question-collapsed-wrap').children()//$('.zm-item-answer','#zh-single-question')
      , numAnswersCount=$listAnswers.length
      , $btnCollapsedSwitcher=$('#zh-question-collapsed-switcher')
      , numCollapsedCount=!$btnCollapsedSwitcher.length||$btnCollapsedSwitcher.is(':hidden')?0:parseInt($('#zh-question-collapsed-num').text())
      , numAnswersCountTotal=numAnswersCount+numCollapsedCount
      , $reply=$('#zh-question-answer-form-wrap')//reply_form
    ;
    if($lblQuestionMeta.length){
        var s=new Array()
          , $a=$('<a>')
          , $c=$('<span>',{'class':'zg-bull'}).text('•')
          , $p=$lblQuestionMeta.children('.zm-meta-panel').children('a.meta-item:last')
          , $m=$('.zu-answer-form-disabled-wrap:visible > a','#zh-question-answer-form-wrap')
        ;
        if($m.length){
            s.push($m.attr('href'));
            $a.text('我的回答');
        }else if($reply.length){
            var id='new_answer'
              , $b=$('<a>',{name:id}).before($reply.children().first());
            s.push('#draft');
            $a.text('我要回答');
        }
        $c.insertAfter($p);
        $a.attr('href',s.join('')).attr('target','_self')
            .insertAfter($c);
    }
    if (izhAuthorList&&
        numAnswersCountTotal>100&&
        confirm('这个问题的回答数较多，是否暂时关闭「iZhihu 回答目录」？')){
        //$('#izhCSS_comment').remove();
        //return;
        izhAuthorList=false;
        $body.attr('izhAuthorList','0');
    }
    //console.log((new Date()).getTime());
    
    var $lblAnswersCount=$('#zh-question-answer-num')//answers_count
      , $uno=$('<div>',{'class':'uno',style:'float:left'})//izh_AuthorsList
      , $ppT=$('<span>',{'class':'meT',style:'display:none'})//izh_AuthorsList_TopSelfIndicator
      , $frm=$('<div>',{'class':'frame'})//izh_AuthorsList_frame
      , $ppB=$('<span>',{'class':'meB',style:'display:none'})//izh_AuthorsList_BottomSelfIndicator
      , $pp=$('<ul>',{'class':'pp'})//izh_AuthorsList_UL
      , $ppI=$('<div>')
    
    ;

    window.iZhihu.$unoAnswers = $uno
/*
    //答案按时间排序
    if(utils.getCfg('answer_orderByTime')){
      client.click('.zh-answers-filter-popup div[data-key=added_time]');
    }
*/    
    var $questionWrap=$('#zh-question-meta-wrap');
    $questionWrap.children('.panel-container').bind('DOMNodeInserted',function(event){
        window.iZhihu.Comment.processComment($(event.target));
    });
    if(window.iZhihu.Comment.RightComment){
        //$questionWrap.children('.meta-item[name=addcomment]').prependTo($questionWrap);
        window.iZhihu.Comment.processCommentButton($questionWrap);
        if(!$('#izh_QuestionShadow').length){
            $('<div>',{'class':'izh_boxShadow',id:'izh_QuestionShadow'}).css({
                'z-index': '-1'
              , 'position': 'relative'
              , 'top': -25
              , 'margin-left': -32
            }).prependTo('body>.zu-main:first').hide();
        }   
    }

    //process each answer
    if($listAnswers&&$listAnswers.length){
        if(izhAuthorList){
            $uno.appendTo($banner);
            $ppT.appendTo($uno);
            $frm.appendTo($uno);
            $pp.appendTo($frm);
            $ppB.appendTo($uno);
            //uno.appendChild(ppI);
            $uno.$endOfLastA=$('<li>').addClass('endOfLastA').appendTo($pp)
        }
        $listAnswers.each(function(i,e){
            window.iZhihu.Answer.processAnswer($(e),$pp
              , izhAuthorRear
              , izhAuthorList);
        });
        if($reply.children('.zu-answer-form-disabled-wrap').is(':hidden')){
            var $ppla=$('<a>',{href:'#draft',target:'_self'})
                .append($('<table>', { 'class': 'plus' })
                    .append($('<tr>')
                            .append($('<td>'))
                            .append($('<td>'))
                        )
                    .append($('<tr>')
                            .append($('<td>'))
                            .append($('<td>'))
                        )
                    )
                .append($('<span>', { 'class': 'name func' }).text('-new-'))
              , $ppl=$('<li>')
                .append($ppla)
                .appendTo($pp)
            ;
        }
    }
    var resizeAuthorList=function($f){
        // Adjust AuthorList's size and locate its position
        if(!$f||!$f.length)return;
        var frm=$f.get(0);
        var width=window.iZhihu.Answer.ppWidth
          , height=$win.height()-$main.offset().top-3-$f.position().top;
        if(frm.scrollHeight>height){
            $f.height(height);
            width+=20;
        }else{
            $f.height('');
        }
        $f.width(width);
    };
    if(isNaN(numCollapsedCount))numCollapsedCount=0;
    if($listAnswers.length||numCollapsedCount){
        if(izhAuthorList){
            $uno.css({
                'float':'none'
              , 'left':9-$uno.width()
            });
            if(!$btnCollapsedSwitcher.length&&!numCollapsedCount)
                resizeAuthorList($frm);
            $('<div>',{'class':'modal-dialog-title'}).css({
                  'border-top-left-radius':0
            }).insertBefore($ppT);
            $uno.mouseover(function(){
                resizeAuthorList($('.frame',this));
                $(this).css('left','0');
            }).mouseout(function(){
                $(this).css('left',9-$(this).width());
            });
            if(window.iZhihu.Answer._e){
                $uno.children('.meT').css('display',0>window.iZhihu.Answer._e.offsetTop-$frm.scrollTop()?'':'none');
                $uno.children('.meB').css('display',$frm.height()<window.iZhihu.Answer._e.offsetTop-$frm.scrollTop()+window.iZhihu.Answer._e.offsetHeight?'':'none');
            }
        }
        if($btnCollapsedSwitcher.length){
            if(numCollapsedCount>0){
                $('#zh-question-collapsed-wrap').show().bind('DOMNodeInserted',function(event){
                    var $a=$(event.target);
                    if($a.is('.zm-item-answer')){
                        window.iZhihu.Answer.processAnswer($a,$pp
                          , $body.attr('izhAuthorRear')=='1'
                          , $body.attr('izhAuthorList')=='1'
                        );
                        var count = $('.zm-item-answer[izh_processed=1]','#zh-question-collapsed-wrap').length;
                        if(count==numCollapsedCount){
                            resizeAuthorList($frm);
                        }
                    }
                });
            }
            $btnCollapsedSwitcher[0].click();
        }
    }

    $('#zh-question-answer-wrap').bind('DOMNodeInserted',function(event){
        var $na=$(event.target).filter('.zm-item-answer');
        if($na.length){
            window.iZhihu.Answer.processAnswer($na,$pp
              , $body.attr('izhAuthorRear')=='1'
              , $body.attr('izhAuthorList')=='1'
            );
        }
    });
    //console.log((new Date()).getTime());

    var $cm=$('.zm-comment-box',$questionWrap);
    if($cm.length && $cm.is(':visible')){
        var focusName = iZhihu.Comment.scrollFocusCommentOnPageLoad($cm);
    
        iZhihu.Comment.metaScrollToViewBottom($cm.closest('.zm-item-meta'),function(){
            iZhihu.Comment.processComment($cm, focusName);
        });
    }
  }

/**
 * 配置界面
 */

    var $btnSettings = $('<li>')
            .append($('<a>', { href: 'javascript:void(0);', tabindex: '-1' })
                .append($('<i>', { 'class': 'zg-icon zg-icon-dd-settings izhihu-settings' }))
                .append('iZhihu')
            ).click(function(){
                var $settings = $('#izh-dlg-settings')
                $('.modal-dialog-bg').show()
                $('.izh-option', '#izh-dlg-settings').each(function(i, e){
                    var key = e.getAttribute('name')
                      , value = utils.getCfg(key)
                      , $e = $(e)
                    if ($e.is('input:checkbox')) {
                        if(value)
                            $(e).iCheck('check')
                    } else if ($e.is('select')) {
                        e.value = value
                    }
                })
                $settings.css({
                    'z-index':'99'
                  , 'position':'fixed'
                  , 'top': ($win.height() - $settings.height()) / 2
                  , 'left': ($win.width() - $settings.width()) / 2
                }).fadeIn('slow')
            }).insertBefore($('ul#top-nav-profile-dropdown li:last'))
      , $dlgSettings = $('<div>', { id: 'izh-dlg-settings', 'class': 'modal-dialog', tabindex: '0', style: 'display:none;width:600px'})
            .append($('<div>', { 'class': 'modal-dialog-title modal-dialog-title-draggable' })
                .append($('<span>', { 'class': 'modal-dialog-title-text' }).text('配置选项'))
                .append($('<span>', {
                    'class': 'modal-dialog-title-close'
                  , click: function(){
                        $('.modal-dialog-bg').hide()
                        $('#izh-dlg-settings').first().hide()
                    }
                }))
            )
            .append($('<div>', { 'class': 'modal-dialog-content' })
                .append($('<div>', {})
                    .append($('<div>', { 'class': 'zg-section' })
                        .append($('<table>', { 'class': 't_set_tb', border: 0, cellspacing: 0, cellpadding: 5, width: '100%' })
                            .append($('<thead>', {})
                                .append($('<tr>', {})
                                    .append($('<td>', { colspan: 6, align: 'left' }).text('（更改后设置将立刻保存，但只有当页面再次打开时才会生效）')
                                    	.prepend(
                                    		$('<b>').text('功能开关')
                                		)
                                    )
                                )
                            )
                            .append($('<tbody>', {})
/*
                                .append($('<tr>', {})
                                    .append($('<td>', { colspan: 4, align: 'left' }).text('在首页直接浏览常去话题'))
                                    .append($('<td>', { align: 'right'})
                                        .append($('<i>', { 'class': 'icon icon-help', 'data-tip': ""}))
                                    )
                                    .append($('<td>', { align: 'right'})
                                        .append($('<input>', { type: "checkbox", 'class': "izh-option", id: "iZhihu_setHomeTopics", name: "HomeTopics" }))
                                    )
                                )
*/
                                .append($('<tr>', {})
                                    .append($('<td>', { colspan: 4, align: 'left' }).text('改变网页样式外观'))
                                    .append($('<td>', { align: 'right'})
                                        .append($('<i>', { 'class': 'icon icon-help', 'data-tip': "s$t$* 首页隐藏大头像<br/>* 缩进投票按钮（问题/回答页）<br/>* 按钮图标动画 "}))
                                    )
                                    .append($('<td>', { align: 'right'})
                                        .append($('<input>', { type: "checkbox", 'class': "izh-option", id: "iZhihu_setHomeLayout", name: "HomeLayout" }))
                                    )
                                )
                                .append($('<tr>', {})
                                    .append($('<td>', { colspan: 4, align: 'left' }).text('自动收起导航栏'))
                                    .append($('<td>', { align: 'right'})
                                        .append($('<i>', { 'class': 'icon icon-help', 'data-tip': "s$t$* 滚动页面至下方时，自动收起顶部导航栏 "}))
                                    )
                                    .append($('<td>', { align: 'right'})
                                        .append($('<input>', { type: "checkbox", 'class': "izh-option", id: "iZhihu_setTopNavAutoFold", name: "TopNavAutoFold" }))
                                    )
                                )
                                .append($('<tr>', {})
                                    .append($('<td>', { colspan: 4, align: 'left' }).text('调整首页「新动态」提醒按钮'))
                                    .append($('<td>', { align: 'right'})
                                        .append($('<i>', { 'class': 'icon icon-help', 'data-tip': "s$t$挪到 Timeline 右上角<br/>与标题「最新动态」平行"}))
                                    )
                                    .append($('<td>', { align: 'right'})
                                        .append($('<input>', { type: "checkbox", 'class': "izh-option", id: "iZhihu_setHomeNoti", name: "HomeNoti" }))
                                    )
                                )
                                .append($('<tr>', {})
                                    .append($('<td>', { colspan: 4, align: 'left' }).text('开启「首页分栏」'))
                                    .append($('<td>', { align: 'right'})
                                        .append($('<i>', { 'class': 'icon icon-help', 'data-tip': "s$t$将首页动态分类单独显示：<br/>问题、回答、专栏"}))
                                    )
                                    .append($('<td>', { align: 'right'})
                                        .append($('<input>', { type: "checkbox", 'class': "izh-option", id: "iZhihu_setHomeFeedsColumns", name: "HomeFeedsColumns" }))
                                    )
                                )
                                .append($('<tr>', {})
                                    .append($('<td>', { colspan: 4, align: 'left' }).text('将用户信息挪到回答下方'))
                                    .append($('<td>', { align: 'right'})
                                        .append($('<i>', { 'class': 'icon icon-help', 'data-tip': ""}))
                                    )
                                    .append($('<td>', { align: 'right'})
                                        .append($('<input>', { type: "checkbox", 'class': "izh-option", id: "iZhihu_setAuthorRear", name: "AuthorRear" }))
                                    )
                                )
                                .append($('<tr>', {})
                                    .append($('<td>', { align: 'left' }).text('开启「右舷评论」'))
                                    .append($('<td>', { align: 'right'})
                                        .append($('<i>', { 'class': 'icon icon-help', 'data-tip': "s$t$在页面右侧浮动显示打开的评论列表<br/>在首页、问题、回答页中生效"}))
                                    )
                                    .append($('<td>', { align: 'right'})
                                        .append($('<input>', { type: "checkbox", 'class': "izh-option", id: "iZhihu_setRightComment", name: "ShowComment" }))
                                    )
                                    .append($('<td>', { width: 1, nowrap: 'nowrap', align: 'left' }).text('关闭时自动卷屏至对应条目'))
                                    .append($('<td>', { align: 'right'})
                                        .append($('<i>', { 'class': 'icon icon-help', 'data-tip': "s$t$仅对右舷评论生效"}))
                                    )
                                    .append($('<td>', { align: 'right'})
                                        .append($('<input>', { type: "checkbox", 'class': "izh-option", id: "iZhihu_setRightComment_AutoScrollPageWhenClosing", name: "RightComment_AutoScrollPageWhenClosing" }))
                                    )
                                )
                                .append($('<tr>', {})
                                    .append($('<td>', { colspan: 4, align: 'left' }).text('开启「快速屏蔽」（加入黑名单/取消关注）功能'))
                                    .append($('<td>', { align: 'right'})
                                        .append($('<i>', { 'class': 'icon icon-help', 'data-tip': "s$t$在赞同列表、评论列表中使用"}))
                                    )
                                    .append($('<td>', { align: 'right'})
                                        .append($('<input>', { type: "checkbox", 'class': "izh-option", id: "iZhihu_setQuickBlock", name: "QuickBlock" }))
                                    )
                                )
                                .append($('<tr>', {})
                                    .append($('<td>', { colspan: 4, align: 'left' }).text('开启「快速收藏」菜单'))
                                    .append($('<td>', { align: 'right'})
                                        .append($('<i>', { 'class': 'icon icon-help', 'data-tip': "s$t$鼠标移上「收藏」按钮时显示"}))
                                    )
                                    .append($('<td>', { align: 'right'})
                                        .append($('<input>', { type: "checkbox", 'class': "izh-option", id: "iZhihu_setQuickFavo", name: "QuickFavo" }))
                                    )
                                )
                                .append($('<tr>', {})
                                    .append($('<td>', { colspan: 4, align: 'left' }).text('开启「回答目录」'))
                                    .append($('<td>', { align: 'right'})
                                        .append($('<i>', { 'class': 'icon icon-help', 'data-tip': "s$t$在问题页面左侧掩藏，鼠标移上时展开<br/>并在右侧即时显示回答预览"}))
                                    )
                                    .append($('<td>', { align: 'right'})
                                        .append($('<input>', { type: "checkbox", 'class': "izh-option", id: "iZhihu_setAuthorList", name: "AuthorList" }))
                                    )
                                )
                                .append($('<tr>', {})
                                    .append($('<td>', { colspan: 4, align: 'left' }).text('选择「外部搜索引擎」'))
                                    .append($('<td>', { align: 'right'})
                                        .append($('<i>', { 'class': 'icon icon-help', 'data-tip': "s$t$你懂的"}))
                                    )
                                    .append($('<td>', { align: 'right'})
                                        .append($('<select>', { type: "checkbox", 'class': "izh-option", id: "iZhihu_setSearchEngineOutside", name: "SearchEngineOutside"})
                                            .append($('<option>', { value:'google' }).text('Google'))
                                            .append($('<option>', { value:'baidu' }).text('百度'))
                                        )
                                    )
                                )
                            )
                        )
                    )
                    .append($('<div>', { 'class': 'zg-left' })
                        .append('当前版本：'+version+'；')
                        .append('最后更新：'+updateDate)
                        .append($('<br>'))
                        .append('制作：')
                        .append($('<a>', { 'data-tip': "p$t$unogzx", href: "/people/unogzx" }).text('@钢盅郭子'))
                        .append('，')
                        .append($('<a>', { 'data-tip': "p$t$liuyong25", href: "/people/liuyong25" }).text('@天猪(刘勇)'))
                        .append('，')
                        .append($('<a>', { 'data-tip': "p$t$luoxr", href: "/people/luoxr" }).text('@yukirock'))
                        .append('，')
                        .append($('<a>', { 'data-tip': "p$t$morlay", href: "/people/morlay" }).text('@墨磊'))
                        .append($('<br>'))
                        .append('感谢：')
                        .append($('<a>', { 'data-tip': "p$t$PeterDeng", href: "/people/PeterDeng" }).text('@邓文博'))
                        .append('，')
                        .append($('<a>', { 'data-tip': "p$t$cakvfcwz", href: "/people/cakvfcwz" }).text('@水云逸'))
                    )
                    .append($('<div>', { 'class': 'zm-command' })
                        .append($('<a>', { id: 'izhRefresh', 'class': 'zg-btn-blue', href: 'javascript:void(0);' }).text('刷新网页'))
                    )
                )
            ).appendTo(_doc.body).draggable({handle: '.modal-dialog-title-draggable'})

    $('.izh-option', $dlgSettings).each(function(i, e){
        var key = e.getAttribute('name')
          , $chk = $(e).filter('input:checkbox').iCheck({
                checkboxClass: 'icheckbox_square-blue'
              , increaseArea: '20%' // optional
            }).bind('ifChanged', function(event){
                var value = this.checked
                utils.setCfg(key, value)
            })
          , $sel = $(e).filter('select').bind('change', function() {
                utils.setCfg(key, this.value)
            })
    })
    $('#izhRefresh').click(function(){
        location.reload()
    })

/*
 * 设置-屏蔽
 */
if (pageIs.SettingsFilter){
    var all=[]
      , $secBlockedUsers = $('#section-blocked-users')
      , $secBlockedUsersTitle = $secBlockedUsers.children('.settings-section-title:first').children('h2:first')
      , $pnlUnBlockedUsers = $('<div>').appendTo($secBlockedUsersTitle).css({
            float: 'right'
        })
      , $lbFilterBlockedUsers = $('<label/>').appendTo($pnlUnBlockedUsers).css({
            float: 'left'
        })
      , $tbFilterBlockedUsers = $('<input/>', {
            'class': 'zg-form-text-input zg-mr15'
          , placeholder: '用户名或昵称'
        }).appendTo($pnlUnBlockedUsers).on('keyup', function(event){
            var kw=this.value
              , n=0
              , $listBlockedUsers=$secBlockedUsers.find('.blocked-users > .item > .body > a').each(function(i,e){
                    var $a = $(e)
                      , href = e.getAttribute('href') || ''
                      , text = e.innerHTML
                      , notMatch = (href.indexOf(kw) < 0 && text.indexOf(kw) < 0)
                    if(!notMatch){
                        n++
                    }
                    $a.closest('.item').css('display', notMatch ? 'none' : '')
                })
            $lbFilterBlockedUsers.text([n?n+' ':'无','人匹配：'].join(''))
        }).css({
            float: 'left'
        }).trigger('keyup')
      , funcUnblock=function(){
            if(all.length==0){return}
            var e=all.shift()
            $.post('/settings/unblockuser', $.param({
                _xsrf: $('input[name=_xsrf]').val()
              , uid: e.getAttribute('data-id')
            })).done(function(result){
                $(e).remove()
            }).fail(function(result){
                all.push(e)
            }).always(function(result){
                $lbFilterBlockedUsers.text([all.length?all.length+' ':'无','人匹配：'].join(''))
                funcUnblock()
            })
        }
      , h=$tbFilterBlockedUsers.outerHeight()
      , $btUnBlockedUsers = $('<input/>', {
            'class': 'zg-btn zg-btn-unfollow'
          , type: 'button'
          , value: '取消屏蔽'
        }).appendTo($pnlUnBlockedUsers).on('click', function(event){
            $('#section-blocked-users > .settings-item > .settings-item-content > .blocked-users > .item').each(function(i,e){
                var $e = $(e)
                if($e.is(':visible')){
                    all.push(e)
                }
            })
            funcUnblock()
        }).css({
            float: 'left'
        }).height(h)
    $lbFilterBlockedUsers.css('line-height', h+'px')
}

var firstRun = parseInt(utils.getValue('izh_fr','1'));

function _FRshow(){
if(firstRun>0 && document.domain=='zhihu.com'){
    var tboxleft=0;
    var accitem1= $('#zh-top-inner div.top-nav-profile .zu-top-nav-userinfo');
    if(accitem1.length>0){
        tboxleft = accitem1.offset().left;
    }
    if(tboxleft>0){
        $('<div>', { id: 'iZhihu_tbox', 'class': 't_frshow' }).appendTo('body.zhi').hide()
            .append($('<div>', { 'class': 't_txtshow t_tbox' })
                .append('感谢使用')
                .append($('<b>').text('iZhihu'))
                .append($('<br />'))
                .append('您可通过菜单【iZhihu】对功能进行设置')
                .append($('<br />'))
                .append($('<s>')
                    .append($('<i>'))
                )
            );
        $('#iZhihu_tbox').css('left',tboxleft-100).show().mouseenter(function(){
            utils.setValue('izh_fr','0');
            //_Menu();
                $(this).remove();
            });
        }
    }
}
    
setTimeout(function(){
    _FRshow();
},1000);


  console.log('iZhihu '+version+' started.');
  //console.log(window.iZhihu);
  //console.log((new Date()).getTime());
//});
