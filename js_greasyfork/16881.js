// ==UserScript==
// @name         autopagerize for Clien
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  try to take over the world!
// @author       You
// @include      http://clien.net*
// @include      http://www.clien.net*
// @include      https://clien.net*
// @include      https://www.clien.net*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/16881/autopagerize%20for%20Clien.user.js
// @updateURL https://update.greasyfork.org/scripts/16881/autopagerize%20for%20Clien.meta.js
// ==/UserScript==

if(typeof SITEINFO === 'undefined'){
	SITEINFO = [];
}

/**
    {
        url:          'http://(.*).google.+/(search).+',
        nextLink:     'id("navbar")//td[last()]/a',
        pageElement:  '//div[@id="res"]/div',
        exampleUrl:   'http://www.google.com/search?q=nsIObserver',
    },
	/**/
SITEINFO.push(
    {
        'url': 'http://(.*).?clien.net/.+',
        'pageElement': 'id("content")/div[contains(concat(" ", @class, " "), " board_main ")]/table/tbody/tr | id("content")/div/ul[contains(concat(" ", @class, " "), " srch ")]',
        'nextLink': '//a[contains(@class, "cur_page")]/following-sibling::a[1]',
        'exampleUrl': 'http://clien.career.co.kr/cs2/bbs/board.php?bo_table=park'
    }
);

if(typeof AutoPagerFilters === 'undefined'){
	AutoPagerFilters = [];
}
AutoPagerFilters.push(function(){
	// 공지사항 지우기
	//$('tr.post_notice').remove();
});

// 내가 올린 글
if(location.href.match(/\/cs2\/modules\/my_comment\.php/g)){
	SITEINFO.push(
		{
			'url': 'http://(.*).?clien.net/.+',
			'pageElement': '//div[@id="content"]/div[@class="board_main"]/table/tbody/tr/td/table/tbody/tr',
			'nextLink': '//b/following-sibling::a[1]',
			'exampleUrl': 'http://clien.career.co.kr/cs2/bbs/board.php?bo_table=park'
		}
	);
}