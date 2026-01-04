// ==UserScript==
// @name         【PPTV】看球隐藏比分，白天把录像当直播看，不会看到比赛结果
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  再也不用熬夜看球，或看录像时看到比分了。
// @author       IQiu
// @include      *sports.pptv.com/*
// @include      *ppsport.com/*
// @grant        none
// @require      http://cdn.bootcss.com/jquery/1.12.4/jquery.min.js
// @require      http://code.jquery.com/jquery-latest.js
// @downloadURL https://update.greasyfork.org/scripts/382744/%E3%80%90PPTV%E3%80%91%E7%9C%8B%E7%90%83%E9%9A%90%E8%97%8F%E6%AF%94%E5%88%86%EF%BC%8C%E7%99%BD%E5%A4%A9%E6%8A%8A%E5%BD%95%E5%83%8F%E5%BD%93%E7%9B%B4%E6%92%AD%E7%9C%8B%EF%BC%8C%E4%B8%8D%E4%BC%9A%E7%9C%8B%E5%88%B0%E6%AF%94%E8%B5%9B%E7%BB%93%E6%9E%9C.user.js
// @updateURL https://update.greasyfork.org/scripts/382744/%E3%80%90PPTV%E3%80%91%E7%9C%8B%E7%90%83%E9%9A%90%E8%97%8F%E6%AF%94%E5%88%86%EF%BC%8C%E7%99%BD%E5%A4%A9%E6%8A%8A%E5%BD%95%E5%83%8F%E5%BD%93%E7%9B%B4%E6%92%AD%E7%9C%8B%EF%BC%8C%E4%B8%8D%E4%BC%9A%E7%9C%8B%E5%88%B0%E6%AF%94%E8%B5%9B%E7%BB%93%E6%9E%9C.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var hideJiJing = true;
    var jijings = [];
    $(document.body).hide();
    $(document).ready(function(){
        if($('a.btn.specialBtn').length > 0){
            var matches = $('a.btn.specialBtn').map(function(i,a){var dl=$(a).parent('dl');return {h:dl.find('.home .team-name').text(),g:dl.find('.guest .team-name').text(),t:dl.find('span.time').text().trim(),s:dl.find('span.status').text().trim(),url:a.href};});
            var html = '';
            matches.each(function(i,m){html+=`比赛时间:${m.t}  ${m.h} vs ${m.g}   <a href='${m.url}'>回看</a><br/>`});
            $(document.body).html(html);
            $(document.body).show();
            return;
        }
        $('.fighting-title').hide();
        $('.information').hide();
        $('.main.grid').hide();
        $('.img.fl span').each(function(i,s){
            try{
                var tm = $(s).text();
                if(tm.indexOf(':')>-1) {
                    tm = tm.substring(0,tm.indexOf(':'));
                    tm = parseFloat(tm);
                    if(tm<20){
                        jijings.push($(s).closest('a.video-vod').hide());
                    }
                }
            }catch(e){}
        });
        setTimeout(function(){$('li.bx:visible:first').trigger('click');},4000);
        $('.footer').hide();
        $('.nav-wrap').hide();
        $('.livebox .score span').text('');
        $('.main p').each(function(i,v){
            var t = $(v).text().replace(/[0123456789]/g,"[X]");
            $(v).text(t);
        });
        $('.fighting-siderbar').after('<div style="cursor: pointer;"><a style="color:white;cur" id="jijing">显示集锦</a></div>');
        $('#jijing').click(function(){
            if(hideJiJing){
                $(this).text('隐藏集锦');
                for(var i=0;i<jijings.length;i++){
                    jijings[i].show();
                }
            }else{
                $(this).text('显示集锦');
                for(var j=0;j<jijings.length;j++){
                    jijings[j].hide();
                }
            }
            hideJiJing=!hideJiJing;
        });
        $(document.body).show();
    });
})();