// ==UserScript==
// @name authorsmith
// @name:en Authorsmith Tool
// @name:zh-CN Authorsmith 工具
// @author RonGL <33112486@qq.com>
// @namespace https://github.com/rongl
// @description Authorsmith 自动化
// @description:en Authorsmith 自动化
// @description:zh-CN Authorsmith 自动化
// @version  1.01
// @match *://*/*
// @grant none
// @require  https://cdn.bootcss.com/jquery/3.3.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/376876/authorsmith.user.js
// @updateURL https://update.greasyfork.org/scripts/376876/authorsmith.meta.js
// ==/UserScript==

(function() {
    //alert(window.location.search);
    var path = window.location.pathname;
    var pathMatch = null;
    if(pathMatch = window.location.pathname.match(/^\/accounts\/(?:[a-zA-Z\.\-\_]+)\/authorsmith\/section\/(?:(structure|index|config_array)\.(?:phtml|php))?$/)){
        var file = pathMatch[1];
        if(typeof(file)=='undefined'){
            file = "index";
        }
        switch(file){
            case "index":
                cms();
                break;
            case "structure":
                cms();
                cmsStructure();
                break;
            case "config_array":
                cmsConfigArray();
                break;
        }
    }else{
        console.log("url path:"+path+" <----- gm[authorsmith]");
    }

})();

function cmsConfigArray(){
    if (window.top === window.self) {
        $('form').submit(function(){
            $('#_gmIframe').remove();
            $('body').append('<iframe id="_gmIframe" name="_gmIframe" src="" style="width: 300px; height: 200px;border: 1px solid #999;position: fixed;top: 50%; right: 20px;margin-top: -100px;background: #fff"></iframe>');
            $(this).attr('target','_gmIframe');
        });
    }
}

function cmsStructure(){
    $('#Layer11').find('a').each(function(index, el) {
        if($(this).attr('onclick')=='javascript:array_edit();'){
            $(this).removeAttr('onclick').addClass('configLink').data('transform',true);
            // $(this).attr('onclick','window.open("config_array.php?id="+document.getElementById(\'temp\')+"&section='+_getQueryString('section')+'",\'_blank\')');
        }
    });

    $('a.configLink').click(function(){
        $('#Layer11').hide();
        $('#Layer22').hide();
        window.open("config_array.php?id="+$('#temp').val()+"&section="+_getQueryString('section'),'_blank');
    });
}

function cms(){
    $('a').click(function(){
        if($(this).data('transform') != true){
            var href = $(this).attr('href');
            var matchLineView = href.match(/^javascript:LineView\('(.*)'\);$/);
            if(matchLineView != null){
                $(this).attr('href',matchLineView[1]).attr('target','_blank');
            }
            $(this).data('transform',true);
        }
    });
}

function _getQueryString(name){
     var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
     var r = window.location.search.substr(1).match(reg);
     if(r!=null)return  unescape(r[2]); return null;
}
