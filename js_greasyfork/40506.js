// ==UserScript==
// @name         I just don't want to see it.
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  love&peace
// @author       Nobody
// @include      *://*.jjwxc.net/*
// @exclude      https://wap.jjwxc.net/*
// @require      https://code.jquery.com/jquery-latest.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/40506/I%20just%20don%27t%20want%20to%20see%20it.user.js
// @updateURL https://update.greasyfork.org/scripts/40506/I%20just%20don%27t%20want%20to%20see%20it.meta.js
// ==/UserScript==
var loading = document.createElement("div");
loading.innerHTML = "<div id='a_mask' style='width: 100%;height: 100%;position: fixed;top: 0px;left: 0px;display: block;z-index: 2001;background-color: rgb(0, 0, 0);opacity: 1;'><img id='a_mask_img' style='position:fixed;top:0;left:0;width:100%;height:100%;' src='https://s1.ax1x.com/2018/04/11/CAK1ZF.gif'/></div>";
document.body.insertBefore(loading, document.body.firstChild);

(function() {
    'use strict';
    var keywords = [];
    var novelIds = [];
    var authorIds=['1322620'];
    $.each(keywords,function(i){
        var keyword = keywords[i];
        if(keyword){
            $('a:contains('+keyword+')').each(function(){
                //console.log('I black you cauz you contain keyword:'+ keyword);
                $(this).html('████████');
                $(this).removeAttr('href');
                $(this).removeAttr('title');
                $(this).removeAttr('alt');
            });
        }
    });

    $.each(authorIds,function(i){
        var authorId = authorIds[i];
        if(authorId){
            $.ajax({
                url: "oneauthor.php?authorid="+authorId,
                cache: false,
                async: true,
                success: function (html) {
                    var rawData = html.split('href="');
                    for(var i=0;i<rawData.length;i++){
                        var rawData0 = rawData[i];
                        if(rawData0.indexOf('novelid=')!=-1){
                            var rawData1 = rawData0.split('">')[0];
                            if(rawData1.indexOf('novelid=')!=-1){
                                if(rawData1.indexOf('"')!=-1){
                                    rawData1 = rawData1.split('"')[0];
                                }
                                var myNovelId = rawData1.split('novelid=')[1];
                                if(myNovelId){
                                    $('a[href$="novelid='+myNovelId+'"]').each(function(){
                                        //console.log('I black you cauz I dislike novel:'+ novelId);
                                        $(this).html('████████');
                                        $(this).removeAttr('href');
                                        $(this).removeAttr('title');
                                        $(this).removeAttr('alt');
                                    });
                                }

                            }
                        }
                    }
                }
            });
            $('a[href$="authorid='+authorId+'"]').each(function(){
                //console.log('I black you cauz I dislike author:'+ authorId);
                $(this).html('████████');
                $(this).removeAttr('href');
                $(this).removeAttr('title');
                $(this).removeAttr('alt');
            });
        }
    });

    $.each(novelIds,function(i){
        var novelId = novelIds[i];
        if(novelId){
            $('a[href$="novelid='+novelId+'"]').each(function(){
                //console.log('I black you cauz I dislike novel:'+ novelId);
                $(this).html('████████');
                $(this).removeAttr('href');
                $(this).removeAttr('title');
                $(this).removeAttr('alt');
            });
        }
    });
    removeLoadMask();
})();

function removeLoadMask(){
    $('#a_mask').remove();
}