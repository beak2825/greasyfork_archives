// ==UserScript==
// @name         在 Aminer 学者头像旁边添加转跳到 scopus 和 publons 的按钮
// @namespace    http://tampermonkey.net/
// @version      1.01
// @description  Aminer will now have shotcuts for scopus and publons.
// @author       qianjunlang
// @match        *.aminer.cn/profile/*
// @icon         https://www.aminer.cn/favicon.ico
// @require      https://cdn.staticfile.org/jquery/3.3.1/jquery.min.js
// @run-at       document-idle
// @compatible   edge
// @compatible   chrome
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/442875/%E5%9C%A8%20Aminer%20%E5%AD%A6%E8%80%85%E5%A4%B4%E5%83%8F%E6%97%81%E8%BE%B9%E6%B7%BB%E5%8A%A0%E8%BD%AC%E8%B7%B3%E5%88%B0%20scopus%20%E5%92%8C%20publons%20%E7%9A%84%E6%8C%89%E9%92%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/442875/%E5%9C%A8%20Aminer%20%E5%AD%A6%E8%80%85%E5%A4%B4%E5%83%8F%E6%97%81%E8%BE%B9%E6%B7%BB%E5%8A%A0%E8%BD%AC%E8%B7%B3%E5%88%B0%20scopus%20%E5%92%8C%20publons%20%E7%9A%84%E6%8C%89%E9%92%AE.meta.js
// ==/UserScript==
    'use strict';
function go_dn(elem_name){
    for(
        let cur_li = $(elem_name) , next_li = cur_li.next();
        next_li.length > 0;
        next_li = cur_li.next()
    ){
        next_li.after(cur_li);
    }
}
//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=

    $(".a-aminer-layouts-footer-footer-footerBg").hide();
    go_dn("section.center_part");

    var mouse_on_effect = {"filter":"drop-shadow(0px 1px 3px #ffffff)", "transition":"0.5s" , "transition-timing-function": "ease-out",};
    var mouse_out_effect = {"filter":"drop-shadow(0px 1px 3px #d0d0d0)", "transition":"0.5s", "transition-timing-function": "ease-out",};

    var rencai_card = ".expert_content";
    var rencai_name = $(".expert_content").find(".name").text();
    rencai_name = rencai_name.replace(/\((.+?)\)/g,''); // /[\u4e00-\u9fa5]/g

//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    const scopus_button = document.createElement('button');
	scopus_button.className = 'btn btn-sm';
    $(scopus_button).css(mouse_out_effect);
    scopus_button.onmouseout = function(){
        $(scopus_button).css(mouse_out_effect);
    }
    scopus_button.onmouseover = function(){
        $(scopus_button).css(mouse_on_effect);
    }
    scopus_button.innerHTML = `
        <img
            src="https://i0.hdslb.com/bfs/article/1010e2e3e7f16664e7862559bd7fb2ac4e7b796d.png"
            alt="scopus-logo"
            height=`+ parseInt($(".avatar_bottom_line").height()) +`px
        />
    `;
	scopus_button.onclick = function() {
		location.href =
            "https://www.scopus.com/results/authorNamesList.uri?st1="
            + rencai_name.split(' ')[rencai_name.split(' ').length-1]
            +"&st2="+ rencai_name.split(' ')[0];
	}
    $(scopus_button).css({
        "z-index": 9999999,
        "border":"0",
        "background-color":"transparent",
        "cursor": "pointer",
        "position": "absolute",
        "left": parseInt(
            $(rencai_card).position().left
            + 20
        ) +"px",
        "top": parseInt(
            $(".watermark").position().top
            + $(".watermark").height()
            - $(".avatar_bottom_line").height()
        ) + "px",
    });
    document.body.append(scopus_button);

//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=

    const publons_button = document.createElement('button');
	publons_button.className = 'btn btn-sm';
    $(publons_button).css(mouse_out_effect);
    publons_button.onmouseout = function(){
        $(publons_button).css(mouse_out_effect);
    }
    publons_button.onmouseover = function(){
        $(publons_button).css(mouse_on_effect);
    }
    publons_button.innerHTML = `
        <img
            src="https://i0.hdslb.com/bfs/article/9e55210b1ec2b9a8c713094a11dee9d9ec294334.png"
            alt="scopus-logo"
            height=`+ parseInt($(".avatar_bottom_line").height() *0.5) +`px
        />
    `;
	publons_button.onclick = function() {
		location.href = "https://publons.com/search/?search=" + rencai_name;
	}
    $(publons_button).css({
        "z-index": 9999999,
        "border":"0",
        "background-color":"transparent",
        "cursor": "pointer",
        "position": "absolute",
        "left": parseInt(
            $(rencai_card).position().left
            + 20
        ) +"px",
        "top": parseInt(
            $(rencai_card).position().top
            + $(".avatar_bottom_line").height()*0.8
        ) + "px",
    });
    document.body.append(publons_button);

window.onload = (function() {
    $(".watermark").hide();
});