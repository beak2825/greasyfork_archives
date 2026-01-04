// ==UserScript==
// @name         pngtree审核图片查询
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  pngtree审核图片查询通过搜索google图片对比
// @author       draco
// @match        https://www.google.com/search?tbs=sbi*
// @match        https://www.google.com.hk/search?tbs=sbi*
// @match        https://www.google.co.jp/search?tbs=sbi*
// @match        https://www.google.com.tw/search?tbs=sbi*
// @match        https://support.pngtree.com/?r=manage/check-upload*
// @grant		 GM_getValue
// @grant		 GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/407834/pngtree%E5%AE%A1%E6%A0%B8%E5%9B%BE%E7%89%87%E6%9F%A5%E8%AF%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/407834/pngtree%E5%AE%A1%E6%A0%B8%E5%9B%BE%E7%89%87%E6%9F%A5%E8%AF%A2.meta.js
// ==/UserScript==

(function() {
    'use strict';
     window.onload=function(){
         if(window.location.href.match(/https:\/\/(.*?)\/search\?tbs=sbi/)){
            console.log(111)
             if(!document.querySelector('.normal-header')){window.close()}
         }
         if(window.location.href.match(/https:\/\/support\.pngtree\.com\/\?r=manage\/check\-upload/)){
             var num = parseInt(GM_getValue('mon-li-num',5));
             var allnum = $('.list_box .card-img img').length;
             var pernum = parseInt(allnum/num);
             var remainnum = allnum-num*pernum;
             $('.list_box').each(function(val){
                 $(this).find('.card-check').before('<span style="margin-left: 50px;"><a href="#mon-a-'+(val+1)+'" class="mon-a-link'+(val+1)+'"></a><a href="javascript:;" name="mon-a-'+(val+1)+'">'+(val+1)+'</a></span>')
             })

             function getastr(){
                 var str = '';
                 for(var i=0;i<pernum;i++){
                     //console.log(i,pernum,num)
                     str += '<a class="am-btn am-btn-sm am-btn-primary am-radius mon-a-go" data-num="'+(i*num)+'" style="margin-right: 3px;margin-top:3px;">'+ (i*num+1)+'-'+(i*num+num)+'</a>'
                 }
                 if(remainnum>0){
                     str += '<a class="am-btn am-btn-sm am-btn-primary am-radius mon-a-go" data-num="'+(allnum-remainnum)+'" style="margin-right: 3px;margin-top:3px;">'+ (allnum-remainnum+1)+'-'+(allnum)+'</a>'
                 }
                 return str;
             }


             $('.admin-content-body').prepend('<div class="mon-div" style="width: 500px;position: fixed;z-index: 9999;background: #efefef;border: 1px solid;right: 0;"><input type="text" class="default-mon-num" style="width: 30px;" value="'+num+'">每次打开数量<div class="mon-alink">'+getastr()+'</div></div>')

             $(document).on('blur','.default-mon-num',function(){
                 num = parseInt($(this).val());
                 GM_setValue('mon-li-num',num);
                 pernum = parseInt(allnum/num);
                 var remainnum = allnum-num*pernum;
                 var str = getastr();
                 $('.mon-div').html('<input type="text" class="default-mon-num" style="width: 30px;" value="'+num+'">每次打开数量<div class="mon-alink">'+str+'</div>');
             })

             $(document).on('click','.mon-a-go',function(){
                 var ind = $(this).data('num');
                 var j = num;
                 $(this).removeClass('am-btn-primary').addClass('am-btn-success');
                 $('.mon-a-link'+(ind+1))[0].click();
                 $('.list_box').slice(ind,ind+num).each(function(){
                     window.open('https://www.google.com/searchbyimage?image_url='+$(this).find('.card-img img').prop('src'));
                 })
             });
         }
     }
})();