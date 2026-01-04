// ==UserScript==
// @name        bangumi书籍外链
// @namespace   rabbitohh
// @description 为书籍单行本添加外链
// @include     *://bgm.tv/subject/*
// @include     *://bangumi.tv/subject/*
// @include     *://chii.in/subject/*
// @version     0.0.6
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/516426/bangumi%E4%B9%A6%E7%B1%8D%E5%A4%96%E9%93%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/516426/bangumi%E4%B9%A6%E7%B1%8D%E5%A4%96%E9%93%BE.meta.js
// ==/UserScript==

$('#infobox').html((function()
{
    var isbn13=$('#infobox').html().match(/ISBN: <\/span\>([\dX\-]+)/)[1];
    if(typeof isbn13=="undefined") return $('#infobox').html();
    isbn13=isbn13.replace(/\-/g, '');
    var isbn10=isbn13.substr(3, 9);
    var tmp=0;
    for(var i=0;i<=8;i++)
    {
        tmp+=parseInt(isbn10[i])*(10-i);
    }
    tmp=11-(tmp%11);
    if(tmp==10) tmp="X";
    if(tmp==11) tmp="0";
    isbn10+=(""+tmp);
    var bx=document.getElementsByClassName("tip_i")[0];
    var sl=document.createElement("p");
    $(sl).append(
        '<span class="tip">链接：</span>'+
        '<a href="https://www.amazon.co.jp/dp/'+isbn10+'" target="_blank" class="l">日亚</a> / '+
        '<a href="https://ndlsearch.ndl.go.jp/search?cs=bib&display=panel&from=0&size=20&keyword='+isbn10+'&f-ht=ndl&f-ht=library" target="_blank" class="l">NDL</a> / '+
        '<a href="https://www.books.or.jp/book-details/'+isbn13+'" target="_blank" class="l">Books</a> / '+
        '<a href="https://www.goodreads.com/book/isbn/'+isbn13+'" target="_blank" class="l">GR</a> / ' +
        '<a href="https://calil.jp/book/'+isbn10+'" target="_blank" class="l">calil</a>'
    );
    bx.appendChild(sl);
}));
