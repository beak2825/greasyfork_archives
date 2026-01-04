// ==UserScript==
// @name               网易严选按性别分类
// @name:en            You 163 Filter by Sex
// @name:zh-CN         网易严选按性别分类
// @namespace          https://github.com/BlindingDark/You163SexFilter
// @include 	         *://you.163.com/*
// @version            1.1
// @description        给网易严选增加按性别分类的选项
// @description:en     Add sex filter to you.163.com
// @description:zh-CN  给网易严选增加按性别分类的选项
// @author             BlindingDark
// @grant              none
// @license            Apache Licence 2.0
// @downloadURL https://update.greasyfork.org/scripts/35763/You%20163%20Filter%20by%20Sex.user.js
// @updateURL https://update.greasyfork.org/scripts/35763/You%20163%20Filter%20by%20Sex.meta.js
// ==/UserScript==

$(function() {
  const elementText =
    `<div class="category">
       <span class="name">性别：</span>
       <div class="sex">
         <a href="javascript:;" class="categoryItem j-categoryItem active" id="sex_filter_all">全部</a>
         <a href="javascript:;" class="categoryItem j-categoryItem" id="sex_filter_male">男</a>
         <a href="javascript:;" class="categoryItem j-categoryItem" id="sex_filter_female">女</a>
       </div>
     </div>`;

  const NIL = [];
  const MALE_KEYWORDS = ["男", "绅士"];
  const FEMALE_KEYWORDS = ["女", "名媛"];
  let nowStatus = NIL;

  function findElement(elements) {
    return elements.find(e => e.length > 0);
  }

  function findSortBar() {
    return findElement([
      $(".m-sortBar"),
      $(".m-content")
    ]);
  }

  function findGoods() {
    return findElement([
      $("#j-goodsAreaWrap").find(".item"),
      $(".resultList").find(".item")
    ]);
  }

  function findTitle($element) {
    title = $element.find(".name [title]");
    if (title) { return title.text();}
  }

  function injectGoods(sex) {
    nowStatus = sex;

    $.each(findGoods(), (goodIndex, good) => {
      $good = $(good);
      $good.show();

      title = findTitle($good);
      $.each(sex, (keyWordIndex, keyWord) => {
        if (title.includes(keyWord)) {
          $good.hide();
        }
      });
    });
  }

  function initLink(element) {
    $.each([$("#sex_filter_all"),
            $("#sex_filter_male"),
            $("#sex_filter_female")],
           (index, e) => {e.removeClass("active");});

    element.addClass("active");
  }

  function findTopElement() {
    return $(".g-row");
  }

  function initSortBar(){
    let sortBar = findSortBar();

    if (sortBar) {
      sortBar.append(elementText);

      all_filter = $("#sex_filter_all");
      male_filter = $("#sex_filter_male");
      female_filter = $("#sex_filter_female");

      all_filter.click(() => {initLink(all_filter); injectGoods(NIL);});
      male_filter.click(() => {initLink(male_filter); injectGoods(FEMALE_KEYWORDS);});
      female_filter.click(() => {initLink(female_filter); injectGoods(MALE_KEYWORDS);});

      findTopElement().bind('DOMNodeInserted', function(e) {
        injectGoods(nowStatus);
      });
    } else {
      console.log("waiting for sort bar prepared");
      window.setTimeout(initSortBar, 1000);
    }
  }

  function Tampermonkey_jQuery_wait(){
    if(typeof jQuery == 'undefined') {
      console.log("waiting for jQuery prepared");
      window.setTimeout(Tampermonkey_jQuery_wait, 1000);
    }
    else {
      console.log("jQuery ready");
      initSortBar();
    }
  }

  Tampermonkey_jQuery_wait();
});
