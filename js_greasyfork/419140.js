// ==UserScript==
// @name         ExHentai 更改標題字串
// @namespace    ExHentai-Title-Changer
// @version      0.2
// @description  更改標題字串, 配合 E-Hentai Downloader 共同使用
// @author       blackca
// @match        https://exhentai.org/g/*
// @match        https://e-hentai.org/g/*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/419140/ExHentai%20%E6%9B%B4%E6%94%B9%E6%A8%99%E9%A1%8C%E5%AD%97%E4%B8%B2.user.js
// @updateURL https://update.greasyfork.org/scripts/419140/ExHentai%20%E6%9B%B4%E6%94%B9%E6%A8%99%E9%A1%8C%E5%AD%97%E4%B8%B2.meta.js
// ==/UserScript==


$(document).ready(function () {
    var n=$('h1#gn'), j=$('h1#gj'), temp = n.text();
    j.text().trim() == '' ? ( j.text(n.text()) ) : ( (n.text(j.text())), (j.text(temp)) );

    n.text().match(/^\(COMIC1☆[1-9]{1}\)/) && ( n.text(n.text().replace(/^\(COMIC1☆/,'(COMIC1☆0')) );
    n.text().match(/^\(紅楼夢\s?[1-9]{1}\)/) && ( n.text(n.text().replace(/^\(紅楼夢\s?/,'(紅楼夢0')) );
    n.text().match(/^\(例大祭\s?[1-9]{1}\)/) && ( n.text(n.text().replace(/^\(例大祭\s?/,'(例大祭0')) );
    n.text().match(/^\(歌姫庭園\s?[1-9]{1}\)/) && ( n.text(n.text().replace(/^\(歌姫庭園\s?/,'(歌姫庭園0')) );
    n.text().match(/^\(ふたけっと\s?[1-9]{1}\)/) && ( n.text(n.text().replace(/^\(ふたけっと\s?/,'(ふたけっと0')) );
    n.text().match(/^\(コミティア\s?[1-9]{2}\)/) && ( n.text(n.text().replace(/^\(コミティア\s?/,'(コミティア0')) );
    n.text().match(/(【|\[|\()?((中国|中國|中文)(語|语)?(翻译|翻譯|翻訳)?|[^\x00-\xff]+(汉化|漢化|嵌字|制作|製作)(組|组)?(?!所)|CHINESE)(】|\]|\)?)/gi) && ( n.text(n.text().replace(/(【|\[|\()?((中国|中國|中文)(語|语)?(翻译|翻譯|翻訳|制作|製作)?|[^\x00-\xff]+(汉化|漢化|嵌字|制作|製作)(組|组)?(?!所)|CHINESE)(】|\]|\)?)/gi,'[中国翻訳]')) );
    n.text().match(/(【|\[|\()(DL版|Digital|\d{1,}年\d{1,2}月\d{1,2}日)(】|\]|\))/gi) && ( n.text(n.text().replace(/(【|\[|\()(DL版|Digital|\d{1,}年\d{1,2}月\d{1,2}日)(】|\]|\))/gi,'')) );

    n.text().match(/(\s?（|）\s?)/g) && ( n.text(n.text().replace(/\s?（/g,' (').replace(/）\s?/g,') ')) );
    n.text().match(/(\s?【|】\s?)/g) && ( n.text(n.text().replace(/\s?【/g,' [').replace(/】\s?/g,'] ')) );
    n.text().match(/((\S)\[|\](\S))/g) && ( n.text(n.text().replace(/(\S)\[/g,'$1 [').replace(/\](\S)/g,'] $1')) );
    n.text().match(/(\/|\?|！|:|・|･|·|\*|\<|\>|\ー)/g) && ( n.text(n.text().replace(/(\/|:)/g,' ').replace(/\?/g,'？').replace(/\！/g,'!').replace(/(・・・)/g,'…').replace(/(･|·)/g,'・').replace(/\*/g,'✱').replace(/(\<|\>)/g,'-').replace(/\ー/g,'ー').replace(/\~/g,'～')) );

    n.text( n.text().trim() );
    n.text().match(/^\[(中国|中國|中文)(翻译|翻譯|翻訳)\]/) && ( n.text(n.text().replace(/^\[(中国|中國|中文)(翻译|翻譯|翻訳)\]/,'')).append(' [中国翻訳]') );
    n.text().match(/\[(中国|中國|中文)(翻译|翻譯|翻訳)\]\s?\[(中国|中國|中文)(翻译|翻譯|翻訳)\]$/) && ( n.text(n.text().replace(/\[(中国|中國|中文)(翻译|翻譯|翻訳)\]\s?\[(中国|中國|中文)(翻译|翻譯|翻訳)\]$/,'[中国翻訳]')) );
});