// ==UserScript==
// @name         Select All Items for Pocket
// @namespace    http://tampermonkey.net/
// @version      0.1
// @icon         https://cdn3.iconfinder.com/data/icons/social-media-2169/24/social_media_social_media_logo_getpocket-48.png
// @description  在Pocket列表页内的Bulk模式下，添加全选按钮。
// @author       KennyLee
// @license      AGPL
// @compatible   chrome
// @compatible   firefox
// @match        https://app.getpocket.com/*
// @require      https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/398887/Select%20All%20Items%20for%20Pocket.user.js
// @updateURL https://update.greasyfork.org/scripts/398887/Select%20All%20Items%20for%20Pocket.meta.js
// ==/UserScript==

window.jQuery.noConflict();
(function() {
    'use strict';
    const $ = window.jQuery,
          btnName = 'Select All',
          mainContainerSelector = '[role="main"]',
          bulkEditBtnSelector = '[aria-label^="Bulk"]',
          bulkEditBtnDoneSelector = '[aria-label="Close Bulk Edit"]'
          ;

    let timer = 0;

    function getBulkEditBtn(){
        let $btn = $('button').filter(bulkEditBtnSelector);
        return $btn.length > 0 ? $btn : undefined;
    }

    function getBulkEditDoneBtn(){
        let $btn = $('button').filter(bulkEditBtnDoneSelector);
        return $btn.length > 0 ? $btn : undefined;
    }

    let getMainContainer = function(){
        let $e = $('DIV').filter(mainContainerSelector);
        return $e.length > 0 ? $e : undefined;
    }

    let getAllUnreadItems = function(){
        let $main = getMainContainer();
        if(!$main){
            console.error('cant find main container');
            return undefined;
        }
        let $articles = $main.children('ARTICLE');
        return $articles.length > 0 ? $articles: undefined;
    }

    let selectAllHandler = function(){
        let $articles = getAllUnreadItems();
        if($articles.length > 0){
            let firstElClassValue = $articles.first().attr('class');
            console.log(firstElClassValue);
            $articles.filter('[class="' + firstElClassValue + '"]').click();
        }else {
            console.log('cant find any articles');
        }
    }

    let addSelectAllBtn = function(container){
        if(!container){
            console.error('cant find container');
            return;
        }
        let $btn = getBulkEditDoneBtn().clone();
        let s = 'Select all items';
        $btn.attr({
            'data-tooltip':s,
            'aria-label':s
        }).css({
            marginLeft: '1rem'
        }).text(btnName);
        $btn.click(selectAllHandler);
        $(container).append($btn);
    }

    function buttonListener(){
        let $bulkBtn = getBulkEditBtn();
        if($bulkBtn){
            console.log('find Bulk button successfully.');

            $bulkBtn.on('click', function(){
                let t = 0;
                t = setInterval(function(){
                    let $btn = getBulkEditDoneBtn();
                    if($btn){
                        console.log('find Bulk Edit Done button successfully.');
                        addSelectAllBtn($btn.parent());

                        $btn.on('click',function(){
                            addButtonListener();
                        });

                        clearInterval(t);
                    }else{
                        console.log('cant find Bulk Edit Done button, wait for next time.');
                    }
                }, 1000);
            });

            clearInterval(timer);
        } else {
            console.log('cant find Bulk button, wait for next time.');
        }
    }

    function addButtonListener(){
        timer = setInterval(buttonListener, 2000);
    }

    addButtonListener();
})();