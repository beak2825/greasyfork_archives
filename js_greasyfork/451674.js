// ==UserScript==
// @name         feiszw_remove_advs
// @namespace    http://netoday.cn
// @version      0.1.32
// @description  Remove divs of advertisements at https://m.feiszw.com
// @author       crazy_pig
// @match        https://m.feibzw.com/chapter-*
// @match        https://m.a6ksw.com/*
// @match        https://m.zydsfgc.com/*
// @match        http://www.soruncg.com/*
// @match        https://m.liumanhua.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @require      https://code.jquery.com/jquery-2.1.4.min.js
// @downloadURL https://update.greasyfork.org/scripts/451674/feiszw_remove_advs.user.js
// @updateURL https://update.greasyfork.org/scripts/451674/feiszw_remove_advs.meta.js
// ==/UserScript==
this.$ = this.jQuery = jQuery.noConflict(true);

(function() {
    'use strict';

    // get url user visited
    var _url = (window.location + "").toLowerCase();

    if (_url.indexOf("a6ksw.com") >= 0){

        setInterval(function (){
            if (null !== $('#chaptercontent') && 'undefined' !== typeof $('#chaptercontent')){
                $('body').removeAttr('id');
                $('body').removeAttr('class');
                $('body').attr('style','background-color:#181C1F;color:#EAF2F7;');
                let navHtml = '<div style="margin-top: 10px;margin-left: 20%;font-size: 25px;height: 50px;">'+$('.Readpage')[0].innerHTML+'</div>';
                $('#chaptercontent').find('a').remove();
                $('#chaptercontent').find('script').remove();
                $('#chaptercontent').find('div').remove();
                $('#chaptercontent').find('style').remove();
                let html = '<div id="chaptercontent" style="padding: 20px;">'+$('#chaptercontent').html()+'</div>';
                $('body').children().remove();
                $('body').html(navHtml+html+navHtml);
                let links = $('#chaptercontent').find('a');
                for(let i =0;i<links.lengh;i++){
                    links[i].removeAttribute('id');
                    links[i].removeAttribute('class');
                }
                ////改变背景颜色和文字颜色
                $('#chaptercontent').css({"background-color":"#016974","color":"#E4DD40","font-family":"Microsoft YaHei","font-size":"20px"});
            }
        }, 300);
    } else if (_url.indexOf("soruncg.com") >= 0){
        setInterval(function (){
            if (null !== $('#container') && 'undefined' !== typeof $('#container')){
                $('body').removeAttr('id');
                $('body').removeAttr('class');
                let html = $('#container').html();
                $('#container').remove();
                $('body').children().remove();
                $('body').append('<div id="container" style="padding: 20px;">'+html.replaceAll('<br>　　<br>　　<br>　　<br>','<br><br>')+'</div>');
                $('.layout-tit').remove();
                $('.appguide-wrap').remove();
                $('.posterror').remove();
//
                $('body').attr('style','background-color:#016974;color:#E4DD40;');
                $('#container').attr('style','background-color:#016974;color:#E4DD40;');
            }
        }, 300);
    } else if (_url.indexOf("zydsfgc.com") >= 0){
        setInterval(function (){
            $('ins').hide();
            //$('#readbg').attr('style','background-color:#016974;color:#E4DD40;font-family:Microsoft YaHei;font-size:20px;');
            $('.ls').attr('style','background:#016974;background-color:#016974;color:#E4DD40;font-family:Microsoft YaHei;font-size:20px;');
            $('.mlfy_main').attr('style','background:#016974;background-color:#016974;color:#E4DD40;font-family:Microsoft YaHei;font-size:20px;');
            $('.mlfy_page').attr('style','background:#016974;background-color:#016974;color:#E4DD40;font-family:Microsoft YaHei;font-size:20px;');
            $('.toolbar span a').attr('style','color:#E4DD40;');
            $('.mlfy_page a').attr('style','color:#E4DD40;');
        }, 300);
    } else if (_url.indexOf("liumanhua.com") >= 0){
        setInterval(function (){
            for (let i = $('body').children().size() - 1; i >= 0 ; i--){
                try{
                    if ($('body').children()[i].className === 'bottom-tool-bar'){
                        break;
                    }else{
                        $('body').children()[i].remove();
                    }
                }catch(e){}
            }
        }, 300);
    }else{
        // edit last theme to green
        _change_style();

        setInterval(function (){
            _recursion_set_style(document.body.children);
        }, 300);
    }
})();

function _change_style(){
    document.body.style = "font-family: \"Microsoft YaHei\"; background-color: #016974; padding-bottom: 130px;";
    $("#crumb").remove();
    $("#header").css({"background-color":"#181C1F","color":"#EAF2F7"});
    $("#tools").css({"background-color":"#181C1F","color":"#EAF2F7"});
    $("#maintool").css({"background-color":"#181C1F","color":"#EAF2F7"});
    $("#moretool").css({"background-color":"#181C1F","color":"#EAF2F7"});
    $("#nr1").css("color","#E4DD40");
    $("#nr_title").css("color","#FFFFFF");
    $("#nr_botton").remove();
}

/**
 * set font \ background-color \ font-family
 */
function _recursion_set_style(childrenNodes){
    if (typeof(childrenNodes) !== 'undefined'){
        var i;
        // set visibility hidden
        var startFlag = false;
        for (i =0; i < childrenNodes.length ; i++){
            if (startFlag &&
               'SCRIPT' !== childrenNodes[i].tagName.trim().toUpperCase() &&
               'SPAN' !== childrenNodes[i].tagName.trim().toUpperCase()){
                    childrenNodes[i].style.visibility = "hidden";
            }
            if ('SCRIPT' === childrenNodes[i].tagName.trim().toUpperCase() &&
                childrenNodes[i].getAttribute("src") === "/js/show.min.js"){
                childrenNodes[i].removeAttribute("src");
            }
            if('AUDIO' === childrenNodes[i].tagName.trim().toUpperCase()){
                startFlag = true;
            }
            if(childrenNodes[i].innerText.indexOf("中文域名一键直达") >= 0){
                childrenNodes[i].innerHTML = "<a href=\"https://m.feiszw.com/\" style=\"font-weight:bold; color: #fff;text-align:center;margin-bottom:24px;font-size:.8rem\">飞速中文网移动版首页</a>";
            }
        }
    }
}