// ==UserScript==
// @name         https://boqima.com 福利上车开车视频在线看
// @namespace
// @version      1.0.3
// @description  https://boqima.com 内视频检索长片链接avgle在线看（看avgle需要梯子）
// @author       boqila

// @require      http://ajax.aspnetcdn.com/ajax/jQuery/jquery-2.1.4.min.js

// @include     https://www.boqila.com/*
// @include     https://www.boqima.com/*
// @include     https://boqila.com/*
// @include     https://boqima.com/*
// @grant        GM_addStyle
// @grant        GM_getResourceURL
// @run-at       document-idle





// 大陆用户推荐Chrome + Tampermonkey（必须扩展） + XX-Net(代理) + Proxy SwitchyOmega（扩展）的环境下配合使用。



// @namespace https://greasyfork.org/users/170347
// @downloadURL https://update.greasyfork.org/scripts/39528/https%3Aboqimacom%20%E7%A6%8F%E5%88%A9%E4%B8%8A%E8%BD%A6%E5%BC%80%E8%BD%A6%E8%A7%86%E9%A2%91%E5%9C%A8%E7%BA%BF%E7%9C%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/39528/https%3Aboqimacom%20%E7%A6%8F%E5%88%A9%E4%B8%8A%E8%BD%A6%E5%BC%80%E8%BD%A6%E8%A7%86%E9%A2%91%E5%9C%A8%E7%BA%BF%E7%9C%8B.meta.js
// ==/UserScript==
/* jshint -W097 */
(function() {
	'use strict';
	//icon图标
	var icon = GM_getResourceURL('icon');






	GM_addStyle([
		'.min {width:66px;min-height: 233px;height:auto;cursor: pointer;}',
		'.container {width: 100%;float: left;}',
		'.col-md-3 {float: left;max-width: 260px;}',
		'.col-md-9 {width: inherit;}',
		'.footer {padding: 20px 0;background: #1d1a18;float: left;}',
		'#nong-table-new {margin: initial !important;important;color: #666 !important;font-size: 13px;text-align: center;background-color: #F2F2F2;float: left;}',
	].join(''));

    var AVGLE_SEARCH_JAV_API_URL = 'https://api.avgle.com/v1/jav/';
    var page = 0;
    var limit = '?limit=2';
    var index =0;
    var a_array=[];
    var AVID = "";
    AVID = $("title").text();
    var exp1 = /^\[([A-Za-z0-9-]+)\]/g;
    AVID = AVID.match(exp1);
    AVID = AVID[0];
    AVID = AVID.slice(1,-1);




	if(AVID.length){
        $.getJSON(AVGLE_SEARCH_JAV_API_URL + encodeURIComponent(AVID) + '/' + page + limit, function (response) {
            console.log(response);
            if (response.success) {
                var videos = response.response.videos;
                if(response.response.total_videos>0){
                    console.log("番号输出:"+AVID);
                    var iframe='<iframe width="900" height="600" src='+videos[0].embedded_url+' frameborder="0" scrolling="auto" allowfullscreen></iframe>';
                    $("img[class='zoom']").first().wrap('<div id="avgle"></div>');
                    $("#avgle").append(iframe);
                   $("img[class='zoom']").first().hide();
                }
            }
        });
		//debugger;
		//console.log("时间000000:"+ new Date().getTime());
	}

})();