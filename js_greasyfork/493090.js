// ==UserScript==
// @name         PTT 文章&推文隱藏腳本
// @namespace    http://tampermonkey.net/
// @version      1.3-default-JQ-with-GM.config
// @description  隱藏含有特定關鍵字的文章與推文
// @author       LianhuanJ
// @match        https://www.ptt.cc/bbs/*
// @grant        GM_getValue
// @grant        GM.getValue
// @grant        GM_setValue
// @grant        GM.setValue
// @grant        GM_deleteValue
// @grant        GM.deleteValue
// @grant        GM_addValueChangeListener
// @grant        GM_registerMenuCommand
// @grant        GM.registerMenuCommand
// @grant        GM_xmlhttpRequest
// @grant        GM.xmlHttpRequest
// @require      https://greasyfork.org/scripts/371339-gm-webextpref/code/GM_webextPref.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/493090/PTT%20%E6%96%87%E7%AB%A0%E6%8E%A8%E6%96%87%E9%9A%B1%E8%97%8F%E8%85%B3%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/493090/PTT%20%E6%96%87%E7%AB%A0%E6%8E%A8%E6%96%87%E9%9A%B1%E8%97%8F%E8%85%B3%E6%9C%AC.meta.js
// ==/UserScript==
/* jshint esversion: 8 */ 

const block_counts = {article: 0, push: 0};
const func_state = {article_polling: false};
const pref = GM_webextPref({
  default: {
    // For explicit search
    _block_author: [],
    _block_push_id: [],

    // For implicit search
    _block_author_reg: [/[a-zA-Z]+5566$/],
    _block_push_id_reg: [/[a-zA-Z]+5566$/],
    _block_title_keyword: ["(本文已被刪除)"],

    // Color
    _block_title_keyword_color: "#484F4F",
    _block_author_color: "#625750",
    _block_author_reg_color: "#667292",
    _block_push_id_reg_color: "#D96459",
    _block_push_id_color: "#36486B",

    // Switch
    _block_article_with_title: true,
    _block_article_with_author: true,
    _block_article_with_author_reg: true,
    _block_push_with_id: true,
    _block_push_with_id_reg: true,
  },
  body: [
    {
      key: "_block_article_with_title",
      label: "Block Article with Title keyword",
      type: "checkbox",
      children: [
        { key: "_block_title_keyword_color", label: "", type: "color" },
        { key: "_block_title_keyword", label: "", type: "textarea" },
      ]
    },
    {
      key: "_block_article_with_author",
      label: "Block Article with Author",
      type: "checkbox",
      children: [
        { key: "_block_author_color", label: "", type: "color" },
        { key: "_block_author", label: "", type: "textarea" },
      ]
    },
    {
      key: "_block_article_with_author_reg",
      label: "Block Article with Author Regex",
      type: "checkbox",
      children: [
        { key: "_block_author_reg_color", label: "", type: "color" },
        { key: "_block_author_reg", label: "", type: "textarea" },
      ]
    },
    {
      key: "_block_push_with_id",
      label: "Block Push With ID",
      type: "checkbox",
      children: [
        { key: "_block_push_id_color", label: "", type: "color" },
        { key: "_block_push_id", label: "", type: "textarea" },
      ]
    },
    {
      key: "_block_push_with_id_reg",
      label: "Block Push With ID Regex",
      type: "checkbox",
      children: [
        { key: "_block_push_id_reg_color", label: "", type: "color" },
        { key: "_block_push_id_reg", label: "", type: "textarea" },
      ]
    }
  ],
  navbar: false,
  css: " body{width: 100%} label::after{content: ' '} textarea{font-family: 'Consolas'} .webext-pref-toolbar{display: block}",
});

function _blockArticle(autohide, obj, bg_color){
  $(obj).css("background-color", bg_color);
  $(obj).addClass("blocklisted");
  $(obj).toggle(!autohide);
}

function _blockPush(autohide, obj, bg_color, explicity){
  $(obj).css("background-color", bg_color);
  $(obj).addClass("blocklisted");
  $(obj).toggleClass("explicitly", explicity);
  $(obj).toggle(!autohide);
}

function escapeStrArrForRegex(strArr = []){
  let reg_char = ['{', '}', '[', ']', '(', ')', '+', '-', '*', '/', '^', '.', '\\'];
  let reg_char_exp = RegExp(`(${reg_char.map( x => '\\' + x ).join('|')})`, 'g');
  return strArr.map( x => x.replaceAll(reg_char_exp, `\\$1`));
}

function blockArticle(articles = $(), autohide = true){
  let count = 0;

  let block_article_with_author = pref.get('_block_article_with_author');
  let block_article_with_author_reg = pref.get('_block_article_with_author_reg');
  let block_article_with_title = pref.get('_block_article_with_title');

  let block_title_keyword_color = pref.get('_block_title_keyword_color');
  let block_author_color = pref.get('_block_author_color');
  let block_author_reg_color = pref.get('_block_author_reg_color');

  let block_author = pref.get('_block_author');
  let block_author_reg = pref.get('_block_author_reg');
  let block_title_keyword = pref.get('_block_title_keyword');

  block_author_reg = RegExp(block_author_reg, 'g');
  // Another pass `cause GM_webextPref save the values as string
  [block_title_keyword] = [block_title_keyword].map( x => { return (typeof(x) == "string") ? x.split(',') : x ;});

  // Convert Array to Regex pattern
  let block_title_keyword_reg = RegExp(`(${escapeStrArrForRegex(block_title_keyword).join('|')})`, 'g');

  articles.each(function(){
    let this_article = this;
    let blocklisted = false;
    let explicitly_blocklisted = false;

    // Check Authour, explicitly
    let this_article_author = $(this_article).children(".meta").children(".author").text();
    if( !blocklisted && block_article_with_author ){
      if( block_author.includes(this_article_author) ){
        _blockArticle(autohide, this_article, block_author_color);
        explicitly_blocklisted = blocklisted = true;
      }
    }

    // Check Authour, implicitly
    if( !blocklisted && block_article_with_author_reg ){
      if( this_article_author.match(block_author_reg) ){
        _blockArticle(autohide, this_article, block_author_reg_color);
        blocklisted = true;
      }
    }

    // Check Title, implicitly
    let this_article_title = $(this_article).children(".title").text();
    if( !blocklisted && block_article_with_title ){
      if( this_article_title.match(block_title_keyword_reg) ){
        _blockArticle(autohide, this_article, block_title_keyword_color);
        blocklisted = true;
      }
    }

    // Append block-this-author button
    let dropdown_menu = $(this_article).find(".dropdown");
    let block_button =  $(dropdown_menu).children(".item").has("a.blockThisAuthor");
    let unblock_button = $(dropdown_menu).children(".item").has("a.unblockThisAuthor");
    if( block_button.length == 0 )
      block_button = $(`<div class="item"><a class="blockThisAuthor" data-author="${this_article_author}">黑單 ${this_article_author}</a></div>`).appendTo(dropdown_menu);

    if( unblock_button.length == 0 )
      unblock_button = $(`<div class="item"><a class="unblockThisAuthor" data-author="${this_article_author}">解除黑單 ${this_article_author}</a></div>`).appendTo(dropdown_menu);

    $(block_button).toggle(!explicitly_blocklisted);
    $(unblock_button).toggle(explicitly_blocklisted);

    if(blocklisted)
      count++ ;
  });

  return count;
}

function blockPush(pushes = $(), autohide = true){
  let count = 0;

  let block_push_with_id = pref.get('_block_push_with_id');
  let block_push_with_id_reg = pref.get('_block_push_with_id_reg');

  let block_push_id_color = pref.get('_block_push_id_color');
  let block_push_id_reg_color = pref.get('_block_push_id_reg_color');

  let block_push_id = pref.get('_block_push_id');
  let block_push_id_reg = pref.get('_block_push_id_reg');
  // Another pass `cause GM_webextPref save the values as string
  [block_push_id] = [block_push_id].map( x => { return (typeof(x) == "string") ? x.split(',') : x ;});
  block_push_id_reg = RegExp(block_push_id_reg, 'g');

  pushes.each(function(){
    let this_push = this;
    let this_push_ID_place = $(this_push).children(".push-userid");
    let this_push_ID = $(this_push_ID_place).text();
    let blocklisted = false;

    // Check Push ID, explicitly
    if( !blocklisted && block_push_with_id ){
      if( block_push_id.includes(this_push_ID) ){
        _blockPush(autohide, this_push, block_push_id_color, true);
        blocklisted = true;
      }
    }

    // Check Push ID, implicitly
    if( !blocklisted && block_push_with_id_reg ){
      if( this_push_ID.match(block_push_id_reg) ){
        _blockPush(autohide, this_push, block_push_id_reg_color, false);
        blocklisted = true;
      }
    }

    // Block-this-push-ID event
    if( !$(this_push_ID_place).attr("title") ){
      $(this_push_ID_place).attr("title", "加入/解除 推文黑名單");
      $(this_push_ID_place).on("click", () => {
        if( $(this_push).hasClass("explicitly") ){
          if( confirm(`解除推文黑單 ${this_push_ID}？`) )
            pref.set("_block_push_id", Array.from(new Set(pref.get("_block_push_id").toString().split(',').filter( (x)=> x != this_push_ID && x != '' ))).toString());
        }
        else{
          if( confirm(`推文黑單 ${this_push_ID}？`) )
            pref.set("_block_push_id", `${pref.get("_block_push_id").toString()},${this_push_ID}` );
        }
      });
    }

    if(blocklisted)
      count++ ;
  });

  return count;
}

function creatConfigButton(){
  let ButtonPlace = $("#topbar > a.board");
  ButtonPlace.after(`<button class="blocklist_config" style="color: green">設定</button>`);
  $("button.blocklist_config").on("click", pref.openDialog );
}

function resetBlocklist(autohide = true){
  $('.blocklisted').css("background-color", '');
  $('.blocklisted').show();
  $('.blocklisted').removeClass("blocklisted explicitly");
  $(".blocklist_counter").toggleClass("btn selected", !autohide);
}

function updateBlocklistCounter(block_counts){
  // Put blocklisted number somewhere
  if( $("button.blocklist_counter").length == 0 ){
    let counter_place = $("#topbar > a.board");
    counter_place.after(`<button class="blocklist_counter" style="color: red">隱藏: ${block_counts.article + block_counts.push}</button>`);
  }
  else {
    $("button.blocklist_counter").text(`隱藏: ${block_counts.article + block_counts.push}`);
  }
}

async function trackPush(num){
  let now_num = $(".new-push").length ;
  if( num != now_num ){
    block_counts.push = blockPush($(".new-push:eq(-1) > .push"), !$("button.blocklist_counter").hasClass("btn selected"));
    updateBlocklistCounter(block_counts);
  }

  if( $("#article-polling").text() == "推文會自動更新，並會自動捲動" )
    setTimeout( () => {trackPush(now_num);}, 1000 );
  else
    func_state.article_polling = false;
}

function main(autohide = true){
  let start = window.performance.now();
  if( $('.blocklisted').length > 0 )
    resetBlocklist(autohide);

  // Blocking Articles
  console.time("Blocking Articles");
  block_counts.article = blockArticle($(".r-ent"), autohide);
  console.timeEnd("Blocking Articles");

  // Blocking Pushes
  console.time("Blocking Pushes");
  block_counts.push = blockPush($(".push"), autohide);
  console.timeEnd("Blocking Pushes");

  updateBlocklistCounter(block_counts);

  if( $(".blocklist_script_log").length == 0 )
    $('body').append(`<h5 class="blocklist_script_log" style="display: block; text-align: center; color: white">Script time: ${(window.performance.now() - start).toFixed(2)}ms</h5>`);
  else
    $(".blocklist_script_log").text(`Script time: ${(window.performance.now() - start).toFixed(2)}ms`);
}

// init
Promise.all([pref.ready()]).then( () => {
  main(true);
  creatConfigButton();

  // Resize webext-pref-iframe
  $("head").append(`<style>iframe.webext-pref-iframe{width: 90vw !important; margin: 10vh 5vw !important}</style>`);

  // Binding events below
  pref.on("change", () => {main( !$(".blocklist_counter").hasClass("btn selected") );});

  // Blocklist_counter event
  $(".blocklist_counter").on("click", () => {
    $(".blocklisted").toggle(500);
    $(".blocklist_counter").toggleClass("btn selected");
    if( $(".blocklist_counter").hasClass("btn selected") && $(".blocklisted").length > 0 ){
      $('html, body').animate({
        scrollTop: $(".blocklisted:eq(0)").offset().top - Math.max( $("#action-bar-container:eq(0)").outerHeight(), $("#topbar-container").outerHeight() )
      }, 500);}
  });

  // Block-this-author event
  $("a.blockThisAuthor").on("click", function(){
    pref.set("_block_author", `${pref.get("_block_author").toString()},${$(this).data("author")}`);
  });

  $("a.unblockThisAuthor").on("click", function(){
    pref.set("_block_author", Array.from(new Set(pref.get("_block_author").toString().split(',').filter( (x)=> x != $(this).data("author") && x != '' ))).toString());
  });

  // Update pushes event
  $("#article-polling").on("click", function(){
    if( !$(this).hasClass("fatal-error") && !func_state.article_polling )
      func_state.article_polling = true;
      setTimeout( () => {trackPush($(".new-push").length);}, 500 );
  });

});