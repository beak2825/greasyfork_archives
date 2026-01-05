// ==UserScript==
// @name         Douban Rating
// @namespace    http://your.homepage/
// @version      0.1
// @description  display douban rating and link in e commercial websites' book page, supports jd.com, tmall.com, dangdang.com and amzon.cn..
// @author       You
// @match        *://item.jd.com/*
// @match        *://detail.tmall.com/*
// @match        *://product.dangdang.com/*
// @match        *://www.amazon.cn/*
// @grant        none
// @require http://code.jquery.com/jquery-1.8.2.js
// @downloadURL https://update.greasyfork.org/scripts/28492/Douban%20Rating.user.js
// @updateURL https://update.greasyfork.org/scripts/28492/Douban%20Rating.meta.js
// ==/UserScript==

function addGlobalStyle(css) {
  var head, style;
  head = document.getElementsByTagName('head')[0];
  if (!head) { return; }
  style = document.createElement('style');
  style.type = 'text/css';
  style.innerHTML = css;
  head.appendChild(style);
}
$(document).ready(function(){
  addGlobalStyle (
    '#douban-rating {    \
    font-family: "Helvetica Neue","Hiragino Sans GB","Microsoft Yahei","微软雅黑",Tahoma,Arial,Simhei,STXihei,"华文细黑",sans-serif;  \
	display: inline-block;    \
	margin-left: 20px;   \
    font-size: 14px;     \
    padding: 0;          \
	/* color: red; */    \
	position: relative;    \
	/* color: #b5621b; */  \
  }      \
   \
#douban-rating .douban-score {    \
  font-family: "Microsoft Yahei";  \
  color: red;              \
  font-weight: 400;      \
}     \
#douban-rating .douban-score em {  \
  color: red;        \
  font-size: 20px;    \
}'
  );
});

String.format = function(src){
  if (arguments.length === 0) return null;
  var args = Array.prototype.slice.call(arguments, 1);
  return src.replace(/\{(\d+)\}/g, function(m, i){
    return args[i];
  });
};

/*
 * test if the current url belongs to specified site.
 * you can specify multiple keywords, eg: is_site("sina", "jd", "taobao")
 */
var is_site = function() {
	var parts = window.location.hostname.split(".");
	for (var i=0; i<arguments.length; i++) {
    if (parts.indexOf(arguments[i]) >= 0) {
		  return true;
	  }
  }
	return false;
};

var get_douban_info = function(isbn, callback) {
	if (isbn === null) {
		return;
	}
	var https = (window.location.protocol == "https:");
	var api_url = null;
	if (https) {
		api_url = "https://api.douban.com/v2/book/isbn/" + isbn;
	} else {
		api_url = "http://api.douban.com/v2/book/isbn/" + isbn;
	}

	$.getJSON(api_url+"?callback=?", function(data){
		var douban_url = data["alt"];
		var douban_rank_info = data["rating"];
		var average_rating = data["rating"]["average"];
    var main_score = parseInt(average_rating);
		var sub_score = average_rating.split(".")[1];

    var num_raters = data["rating"]["numRaters"];
		//console.log(douban_url, average_rating, num_raters);

		var html = String.format("<div id=\"douban-rating\"><b>豆瓣评分：</b><span class=\"douban-score\"><em>{1}</em>.{2}</span>分 (<a href=\"{0}\" target=\"_blank\">{3}人评价</a>)</div>", douban_url, main_score, sub_score, num_raters);
    callback(html);
	}).fail(function(jqxhr, textStatus, error){
		var html = null;
		if (jqxhr.status == 404) {
			html = "<span id=\"douban-rating\"><b>豆瓣评分：</b>豆瓣上没有这本书. </span>";
		} else {
      html = String.format("<span id=\"douban-rating\"><b>豆瓣评分：</b>ajax错误({0}). </span>", jqxhr.status);
		}
		callback(html);
	});
};

var insert_rating_to_jd = function(html) {
	var obj = $(html);
	$("#p-author").append(obj);
};

var insert_rating_to_amazon = function(html) {
	var obj = $(html);
	$("#productGuarantee_feature_div").after(obj);
};

var insert_rating_to_dangdang = function(html) {
	var obj = $(html);
	$("#comm_num_up").after(obj);
};

var insert_rating_to_tmall = function(html) {
	var obj = $(html);
	$("#J_PostageToggleCont").after(obj);
};

var get_jd_isbn = function(){
	var keywords = $('meta[name=keywords]').attr("content");
	var isbn_regex = /\d{10,13}/;
	var ret = keywords.match(isbn_regex);
	if (ret != null) {
		return ret[0];
	} else {
		var text = $("#parameter2").text();
		var ret = text.match(isbn_regex);
		if (ret == null) {
			return null;
		}
		return ret[0];
	}
};

var get_amazon_isbn = function(){
	var isbn = null;
	var text = $("#detail_bullets_id").text();
	var ret = text.match(/\d{10,13}/);
	if (ret != null) {
		isbn = ret[0];
	}
	return isbn;
};

var get_dangdang_isbn = function() {
	var keywords = $('meta[name=keywords]').attr("content");
	var isbn_regex = /\d{10,13}/;
	var ret = keywords.match(isbn_regex);
	if (ret != null) {
		return ret[0];
	} else {
		var text = $(".book_messbox").text();
		var ret = text.match(isbn_regex);
		if (ret == null) {
			return null;
		}
		return ret[0];
	}
};

var get_tmall_isbn = function() {
	var isbn = null;
	var text = $("#J_AttrUL").text();
	var ret = text.match(/\d{10,13}/);
	if (ret != null) {
		isbn = ret[0];
	}
	return isbn;
};

$(document).ready(function(){
	var isbn = null;
	if (is_site("jd", "360buy")) {
		isbn = get_jd_isbn();
		get_douban_info(isbn, insert_rating_to_jd);
	} else if (is_site("amazon", "z")) {
		isbn = get_amazon_isbn();
		get_douban_info(isbn, insert_rating_to_amazon);
	} else if (is_site("dangdang")) {
		isbn = get_dangdang_isbn();
		get_douban_info(isbn, insert_rating_to_dangdang);
	} else if (is_site("tmall")) {
		isbn = get_tmall_isbn();
		get_douban_info(isbn, insert_rating_to_tmall);
	}
});
