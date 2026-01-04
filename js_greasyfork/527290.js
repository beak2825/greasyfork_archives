// ==UserScript==
// @name         Booth Shop Item Sort View | Booth商品管理ソートモード
// @namespace    http://tampermonkey.net/
// @version      0.01Beta
// @description  ショップアイテムを簡単かつ明確に並べ替えるためのシンプルなスクリプト。A simple script to make shop item sort easily and clearly.
// @author       Enko
// @match        https://manage.booth.pm/items
// @icon         https://www.google.com/s2/favicons?sz=64&domain=booth.pm
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/527290/Booth%20Shop%20Item%20Sort%20View%20%7C%20Booth%E5%95%86%E5%93%81%E7%AE%A1%E7%90%86%E3%82%BD%E3%83%BC%E3%83%88%E3%83%A2%E3%83%BC%E3%83%89.user.js
// @updateURL https://update.greasyfork.org/scripts/527290/Booth%20Shop%20Item%20Sort%20View%20%7C%20Booth%E5%95%86%E5%93%81%E7%AE%A1%E7%90%86%E3%82%BD%E3%83%BC%E3%83%88%E3%83%A2%E3%83%BC%E3%83%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //data area
    var onSortMode = false;
    var sortIDrefTask = null;
    setInterval(RefreshSortID, 1000);

    //methods
    function RemoveItemCSS()
    {
        $(".item-wrapper").each(function(){
            this.style.removeProperty("padding-top");
            this.style.removeProperty("padding-bottom");
            this.style.removeProperty("margin-top");
            this.style.removeProperty("margin-bottom");
        });
    }
    function SetItemTransition(isSet){
        $(".item-wrapper").each(function(){
            if (isSet) {
                this.style.setProperty("transition", "0.5s");
            } else {
                this.style.removeProperty("transition");
            }
        });
    }
    function RefreshSortID()
    {
        $(".sort-num").each(function(i,e){
            $(this).text(i+1);
        });
    }
    function ChangeSortMode()
    {
      onSortMode = !onSortMode;
      DoSwitchView(onSortMode);
    }
    function DoSwitchView(isChanged)
    {
      SetItemTransition(true);
      if (isChanged) {
        $(".item-wrapper").each(function(){
            this.style.setProperty("padding-top", "0.5rem", "important");
            this.style.setProperty("padding-bottom", "0.5rem", "important");
            this.style.setProperty("margin-top", "0.5rem", "important");
            this.style.setProperty("margin-bottom", "0.5rem", "important");
        });
        setTimeout(()=>{SetItemTransition(false);}, 501);
      } else {
        SetItemTransition(true);
        RemoveItemCSS();
        setTimeout(()=>{SetItemTransition(false);}, 501);
      }
      $(".dashboard-items-variation").slideToggle();
      $(".dashboard-items-tags").slideToggle();
      $(".dashboard-item-footer").slideToggle();
    }

    //elements storage
    var buttonArea = $(".page-head").next();
    buttonArea = buttonArea.children().first();
    var switchSortBtn = $(`<div class="mobile:px-16 mobile:py-0 commands register-item u-mb-sp-300 u-mr-300 u-mr-sp-0"><a class="btn calm"><span class="cmd-label">詳細の切り替え</span></a></div>`);
    $(switchSortBtn).click(()=>{ChangeSortMode();});

    $(".item-wrapper").each(function(i,e){
        let sortBtn = $(this).children().first();
        let num = $(`<div class="sort-num">${i+1}</div>`);
        sortBtn.prepend(num);
    });

    //add button
    buttonArea.children().last().before(switchSortBtn);
})();