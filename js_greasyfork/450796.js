// ==UserScript==
// @name         Bus Tools
// @namespace    http://tampermonkey.net/
// @version      1.10
// @description  Bus Tools For Me
// @author       Opeee
// @include      *://*javbus.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=javbus.com
// @license      MIT

// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_notification
// @grant        GM_openInTab
// @grant        GM_download
// @grant        GM_setClipboard
// @grant        GM_getResourceURL
// @grant        GM_registerMenuCommand
// @grant        GM_info
// @downloadURL https://update.greasyfork.org/scripts/450796/Bus%20Tools.user.js
// @updateURL https://update.greasyfork.org/scripts/450796/Bus%20Tools.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function clog(e){
        console.log(e);
    }


    let avid = '';
    let avid_s = '';
    function init(){
        avid = $('.info .header')[0].nextElementSibling.textContent;
        avid_s = avid.replace('-','');
        console.log('[BT] avid ',avid);

        $('.row.movie').after(`
        <div id="video-tools">
        </div>`);

        GM_addStyle(`
           #video-tools{padding:15px!important;background:#222;color:#fff;}
        `);
    }

    function deleteElements(){
        $('#star-div').hide();
        $('#mag-submit-show').hide();
        $('.mb20').hide();
        $('h4').hide();
    }

    function addBtn(){
        $('#video-tools').append(`
          <div class="btn-toolbar">
            <div class="btn-group btn-group-sm">
              <div class="btn btn-default savePic">
              <span class="glyphicon glyphicon-picture"></span>
              保存封面
              </div>
            </div>
            <div class="btn-group btn-group-sm">
              <div class="btn btn-default reload">
              <span class="glyphicon glyphicon-reload"></span>
              刷新
              </div>
            </div>

            <div class="input-group input-group-sm" style="width:130px;">
              <input type="text" class="form-control selectAvid" value="${avid}">
              <span class="input-group-btn">
                <div class="btn btn-default copyAvid" type="button">复制</div>
              </span>
            </div>

            <div class="btn-group" style="padding: 5px 2px 5px 10px;">
              BT
            </div>
            <div class="btn-group btn-group-sm">
              <div class="btn btn-default magnet" style="padding: 5px 2px;">
                <span style="padding:5px;background:#000;text-shadow:none;border-radius:3px;">
                  <block style="color:#428bca;font-weight:bold;">Ø</block>
                  <block style="color:#fff;">Magnet</block>
                </span>
              </div>
            </div>

            <div class="btn-group" style="padding: 5px 2px 5px 10px;">
              Online
            </div>
            <div class="btn-group btn-group-sm">
              <div class="btn btn-default missav" style="padding: 5px 2px;">
                <span style="padding:5px;background:#000;text-shadow:none;border-radius:3px;">
                  <block style="color:#fff;">MISS</block>
                  <block style="color:#FE628E;margin-left:-2px;font-weight:bold;">AV</block>
                </span>
              </div>
              <div class="btn btn-default javday" style="padding: 5px 2px;">
                <span style="padding:5px;background:#000;text-shadow:none;border-radius:3px;">
                  <block style="padding:1px 2px;background:#FF8382;color:#000;border-radius:3px;font-weight:bold;">JAV</block>
                  <block style="color:#fff;margin-left:-2px;">DAY</block>
                </span>
              </div>
            </div>

            <div class="btn-group" style="padding: 5px 2px 5px 10px;">
              Search
            </div>
            <div class="btn-group btn-group-sm">
              <div class="btn btn-default lib" style="padding: 5px 2px;">
                <span style="padding:5px;background:#000;text-shadow:none;border-radius:3px;">
                  <block style="color:#F908BB;font-weight:bold;">JAV</block>
                  <block style="color:#fff;margin-left:-2px;">Library</block>
                </span>
              </div>
              <div class="btn btn-default dmm" style="padding: 5px 2px;">
                <span style="padding:5px;background:#000;text-shadow:none;border-radius:3px;">
                  <block style="color:#EE2737;font-weight:bold;">FANZA</block>
                </span>
              </div>
              <div class="btn btn-default mgs" style="padding: 5px 2px;">
                <span style="padding:5px;background:#000;text-shadow:none;border-radius:3px;">
                  <block style="color:#EE2737;">M</block>
                  <block style="color:#fff;margin-left:-2px;">GS</block>
                </span>
              </div>
              <div class="btn btn-default google" style="padding: 5px 2px;">
                <span style="padding:5px;background:#000;text-shadow:none;border-radius:3px;">
                  <block style="color:#4285F4;">G</block>
                  <block style="color:#EB4435;margin-left:-3px;">o</block>
                  <block style="color:#FBBD05;margin-left:-3px;">o</block>
                  <block style="color:#4285F4;margin-left:-3px;">g</block>
                  <block style="color:#34A853;margin-left:-3px;">l</block>
                  <block style="color:#EB4435;margin-left:-3px;">e</block>
                </span>
              </div>
            </div>
          </div>
        `);

        $('.savePic').bind('click',()=>{
            let title = $('h3').text();
            let imgUrl = $('.bigImage img')[0].src;
            GM_download(imgUrl,title);
        });
        $('.reload').bind('click',()=>{
           window.location.reload();
        });
        $('.selectAvid').bind('click',()=>{
            $('.selectAvid').focus().select();
        });
        $('.copyAvid').bind('click',()=>{
            GM_setClipboard(avid);
        });

        $('.magnet').bind('click',()=>{
            let url = `https://0cili.org/search?q=${avid}`;
            GM_openInTab(url);
        });
        $('.missav').bind('click',()=>{
            let  avid_l = avid.toLowerCase();
            let url = `https://missav.com/cn/${avid_l}`;
            GM_openInTab(url);
        });
        $('.javday').bind('click',()=>{
            let url = `https://javday.tv/videos/${avid_s}`;
            GM_openInTab(url);
        });
        $('.lib').bind('click',()=>{
            let url = `https://www.javlibrary.com/cn/vl_searchbyid.php?keyword=${avid}`;
            GM_openInTab(url);
        });
        $('.dmm').bind('click',()=>{
            let url = `https://www.dmm.co.jp/mono/dvd/-/search/=/searchstr=${avid}/`;
            GM_openInTab(url);
        });
        $('.mgs').bind('click',()=>{
            let url = `https://www.mgstage.com/search/cSearch.php?search_word=${avid}&x=0&y=0&search_shop_id=&type=top`;
            GM_openInTab(url);
        });
        $('.google').bind('click',()=>{
            let url = `https://www.google.com/search?q=${avid}`;
            GM_openInTab(url);
        });
    }

    function removeMagClick(){
        GM_addStyle(`
           .mn-link,.mn-copy{margin-right:5px;}
        `);
        let status = false;
        let timer = setInterval(function(){
            let l = $('#magnet-table').find('tr').length;
            if(l>2){
                status=true;
                clearInterval(timer);
                $('#magnet-table tr').removeAttr('onmouseover').removeAttr('onmouseout');
                $('#magnet-table td').removeAttr('onclick');
                let a = $('#magnet-table td:first-child a:first-child');
                for(let i = 0;i<a.length;i++){
                    let url = a.eq(i).attr('href');
                    a.eq(i).after(`<a class="btn btn-mini-new btn-success mn-link" href="${url}" _target="_self">Down</a>`);
                    a.eq(i).after(`<a class="btn btn-mini-new btn-success mn-copy" data-magnet="${url}">Copy</a>`);
                }
                $('#magnet-table td a:not(.mn-link)').removeAttr('href');


                $('.mn-copy').bind('click',function(e){
                    let mn = 'magnet'+ e.currentTarget.dataset.magnet;
                    GM_setClipboard(mn);
                });
            }
        },1000)
        }

    function main(){
        console.log('[BT] Running');
        init();
        deleteElements();
        addBtn();
        removeMagClick();

        setTimeout(function(){
            $('#magnet-table').find('button').remove();
        },1000)
    }

    if($('.info .header')[0]){
        main();
    }

})();