// ==UserScript==
// @name         HUS-Modle閲覧性向上
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  このスクリプトは、北海道科学大学の学生用サイト(moodle.hus.ac.jp)を見やすくするための物です。作者が見やすく感じるだけであなたにとっては見づらいかもしれません。
// @author       RPL_LSF
// @match        https://moodle.hus.ac.jp/
// @grant        none
/* load jQuery */
// @require http://ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/372790/HUS-Modle%E9%96%B2%E8%A6%A7%E6%80%A7%E5%90%91%E4%B8%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/372790/HUS-Modle%E9%96%B2%E8%A6%A7%E6%80%A7%E5%90%91%E4%B8%8A.meta.js
// ==/UserScript==

function main(){
    //不必要な要素の削除
    //$('#frontpage-category-names').remove();
    $('.logo').remove();

    //マイコース追加
    //ナビゲーションをコピーして不要なものを消す。
    $('#skipsitenews').after('<div id="US-myCourse_"></div>');
    $('#inst27').clone(true).appendTo('#US-myCourse_');
    $('#US-myCourse_ > #inst27 > .header').unwrap();
    $('#US-myCourse_ > .content > ul > li > ul > li:lt(2)').remove();
    $('#US-myCourse_ > .content > ul > li > ul > li:eq(1)').remove();
    $('#US-myCourse_ > .content > ul > li > p').remove();
    $('#US-myCourse_ > .content > ul > li > ul').unwrap();
    $('#US-myCourse_ > .content > ul > ul').unwrap();
    $('#US-myCourse_ > .content ul li p').unwrap();
    $('#US-myCourse_ > .content ul p').unwrap();
    $('#US-myCourse_ > .content > p > span').unwrap();
    $('#US-myCourse_ > .content > span').remove();
    $('#US-myCourse_ > div:eq(0)').remove();
    $('#US-myCourse_ > div > p').unwrap();
    $('#US-myCourse_ > p > a').unwrap();

    //外枠作成
    $('#skipsitenews').after(
        '<br>'+
        '<a class="skip skip-block" href="#US-skipMyCourse">マイコース をスキップする</a>'+
        '<div id=US-myCourse><h2>マイコース</h2><div class="course_category_tree clearfix frontpage-category-names">'+
        '  <div class="collapsible-actions"><a class="collapseexpand collapse-all" href="#">すべてを折りたたむ</a></div>'+
        '  <div class="content"><div class="subcategories">'+
        //'    <div class="info"><h3 class="categoryname">月</h3></div>'+
        '  </div></div>'+
        '</div></div>'+
        '<span class="skip-block-to" id="US-skipMyCourse"></span>');

    //コピーしたナビゲーションを外枠の中へ移す
    while($('#US-myCourse_ > a').length){
        $('#US-myCourse_ > a:eq(0)').wrap('<div class="category notloaded"><div class="info"><h4 class="categoryname"></h4></div></div>');
    }
    $('#US-myCourse_').appendTo('#US-myCourse > div > .content > .subcategories');
}

main();