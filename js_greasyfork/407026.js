// ==UserScript==
// @name         在百度百科中添加灰机Wiki中文维基MBA智库等按钮
// @name:en      Add Buttons to MBA Zhiku|WikipediaCN|HuijiWiki in Baidupedia
// @namespace    Black Rabbit
// @version      1.1.6
// @description  在百度百科中添加相同式样的Magi搜索（暂停服务，替换成灰机Wiki）、中文维基、MBA智库按钮。
// @description:en  Add same looks' buttons in Baidupedia, that jump to MBA Zhiku, WikipediaCN, HuijiWiki.
// @match      http://baike.baidu.com/*
// @match      https://baike.baidu.com/*
// @author       Black Rabbit
// @run-at       document-end
// @icon        https://baike.baidu.com/favicon.ico
// @require      https://code.jquery.com/jquery-3.7.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/407026/%E5%9C%A8%E7%99%BE%E5%BA%A6%E7%99%BE%E7%A7%91%E4%B8%AD%E6%B7%BB%E5%8A%A0%E7%81%B0%E6%9C%BAWiki%E4%B8%AD%E6%96%87%E7%BB%B4%E5%9F%BAMBA%E6%99%BA%E5%BA%93%E7%AD%89%E6%8C%89%E9%92%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/407026/%E5%9C%A8%E7%99%BE%E5%BA%A6%E7%99%BE%E7%A7%91%E4%B8%AD%E6%B7%BB%E5%8A%A0%E7%81%B0%E6%9C%BAWiki%E4%B8%AD%E6%96%87%E7%BB%B4%E5%9F%BAMBA%E6%99%BA%E5%BA%93%E7%AD%89%E6%8C%89%E9%92%AE.meta.js
// ==/UserScript==

var timeout = 100; // you could increase this value by 100 per step, according your Network status
// Edit the search site as you like
var name1 = "中文维基";
var url1 = "https://zh.wikipedia.org/wiki/";
var name2 = "MBA智库";
var url2 = "https://wiki.mbalib.com/wiki/Special:Search?search=";
var name3 = "灰机Wiki";
var url3 = "https://www.huijiwiki.com/index.php?title=%E7%89%B9%E6%AE%8A:%E5%85%A8%E5%B1%80%E6%90%9C%E7%B4%A2&key=";

function nn_method(){
    var headwidth = document.getElementsByClassName('index-module_lemmaSearchBar__5xejA');
    headwidth = headwidth[0];
    headwidth.style.width = "1300px";
    var query = $('div.index-module_inputWrapper__d-MvE > input.index-module_searchInput__Q0ER3');
    //Huiji
    $('div.index-module_rightWrapper__gKXFG > button.index-module_lemmaBtn__uEM7b').after('<button class="hjwiki my_button" style="margin-left: 4px">' + name3 + '</button>');
    $('.hjwiki').on({
        click: function () {
            window.open(url3 + query.val());
            return false;
        }
    });
    //mba
    $('div.index-module_rightWrapper__gKXFG > button.index-module_lemmaBtn__uEM7b').after('<button class="mbazk my_button" style="margin-left: 4px">' + name2 + '</button>');
    $('.mbazk').on({
        click: function () {
            window.open(url2 + query.val());
            return false;
        }
    });

    //wiki
    $('div.index-module_rightWrapper__gKXFG > button.index-module_lemmaBtn__uEM7b').after('<button class="wikizn my_button" style="margin-left: 4px">' + name1 + '</button>');
    $('.wikizn').on({
        click: function () {
            window.open(url1 + query.val());
            return false;
        }
    });

    $(".my_button").css({
        "-webkit-appearance": "none",
        "background": "#38f",
        "border": "1px solid",
        "border-color": "#38f #38f #2d78f4",
        "border-radius": "0",
        "color": "#fff",
        "cursor": "pointer",
        "display": "inline-block",
        "float": "left",
        "font-family": "arial",
        "font-size": "16px",
        "height": "40px",
        "letter-spacing": "1px",
        "outline": "medium",
        "width": "104px"
    });

    $(".my_button").hover(function(){$(this).css({"background": "#317ef3", "border-color": "#317ef3"})},
                          function(){ $(this).css({"background": "#38f", "border-color": "#38f #38f #2d78f4"}) } );

    $('div.index-module_searchBar__L5IRU.clearfix.index-module_top-search__blbxv > div.index-module_rightWrapper__gKXFG > button').css({
        "font-size": "13px",
        "height": "34px",
        "width": "72px"
    });
}

// function ori_method() {
//     var headwidth = document.getElementsByClassName('wgt-searchbar wgt-searchbar-new wgt-searchbar-main cmn-clearfix wgt-searchbar-large');
//     headwidth = headwidth[0];
//     headwidth.style.width = "1300px";

//     //Huiji
//     $('#searchForm > #search').after('<button class="hjwiki" type="button">' + name3 + '</button>');
//     $('.hjwiki').on({
//         click: function () {
//             window.open(url3 + $('#query').val());
//             return false;
//         }
//     });

//     //mba
//     $('#searchForm > #search').after('<button class="mbazk" type="button">' + name2 + '</button>');
//     $('.mbazk').on({
//         click: function () {
//             window.open(url2 + $('#query').val());
//             return false;
//         }
//     });
//     //wiki
//     $('#searchForm > #search').after('<button class="wikizn" type="button">' + name1 + '</button>');
//     $('.wikizn').on({
//         click: function () {
//             window.open(url1 + $('#query').val());
//             return false;
//         }
//     });

//     $('.wgt-searchbar.wgt-searchbar-new.wgt-searchbar-simple.cmn-clearfix  > .search > .form > form > button').css({
//         "font-size": "13px",
//         "height": "34px",
//         "width": "72px"
//     });

//     console.log("Run old method");
// }

// function new_method() {
//     var headwidth = document.getElementsByClassName('lemmaSearchBar_iqVhO');
//     headwidth = headwidth[0];
//     headwidth.style.width = "1300px";
//     var query = $('div.lemmaSearchBarWrapper_uK_i6 > div.lemmaSearchBar_iqVhO > div.searchBar_y3cFr.clearfix > div.rightWrapper_MV_63 > div.inputWrapper_pg1f_ > input.searchInput_qiZhW');

//     //Huiji
//     $('div.rightWrapper_MV_63 > button.lemmaBtn_F27pH').after('<button class="hjwiki my_button" style="margin-left: 4px">' + name3 + '</button>');
//     $('.hjwiki').on({
//         click: function () {
//             window.open(url3 + query.val());
//             return false;
//         }
//     });

//     //mba
//     $('div.rightWrapper_MV_63 > button.lemmaBtn_F27pH').after('<button class="mbazk my_button" style="margin-left: 4px">' + name2 + '</button>');
//     $('.mbazk').on({
//         click: function () {
//             window.open(url2 + query.val());
//             return false;
//         }
//     });

//     //wiki
//     $('div.rightWrapper_MV_63 > button.lemmaBtn_F27pH').after('<button class="wikizn my_button" style="margin-left: 4px">' + name1 + '</button>');
//     $('.wikizn').on({
//         click: function () {
//             window.open(url1 + query.val() );
//             return false;
//         }
//     });

//     $(".my_button").css({
//         "-webkit-appearance": "none",
//         "background": "#38f",
//         "border": "1px solid",
//         "border-color": "#38f #38f #2d78f4",
//         "border-radius": "0",
//         "color": "#fff",
//         "cursor": "pointer",
//         "display": "inline-block",
//         "float": "left",
//         "font-family": "arial",
//         "font-size": "16px",
//         "height": "40px",
//         "letter-spacing": "1px",
//         "outline": "medium",
//         "width": "104px"
//     });

//     $(".my_button").hover(function(){$(this).css({"background": "#317ef3", "border-color": "#317ef3"})},
//                           function(){ $(this).css({"background": "#38f", "border-color": "#38f #38f #2d78f4"}) } );

//     $('.searchBar_y3cFr.clearfix.top-search_mjMaD > .rightWrapper_MV_63 > button').css({
//         "font-size": "13px",
//         "height": "34px",
//         "width": "72px"
//     });

//     console.log("Run new method");
// }

function detect() {
    //     console.log("detecting . . . .");
    //     var body = document.body;
    //     if (body.getAttribute("class")) {
    //         console.log("ori DOM");
    //         ori_method();
    //     } else {
    //         console.log("new DOM");
    //         new_method();
    //     }
    nn_method();
}

setTimeout(detect,timeout);