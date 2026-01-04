// ==UserScript==
// @name         在 bing词典 中聚合显示 有道 的结果 添加转跳至各种在线工具的按钮
// @namespace    http://tampermonkey.net/
// @version      11.2.1
// @license      MIT
// @description  1. Display youdao.com results alongside the original results on bing.com/dict. 2. Provide shortcuts for many online tools.
// @author       庶民player
// @match        *.bing.com/dict*
// @match        *.bing.net/dict*
// @icon         https://cn.bing.com/sa/simg/favicon-2x.ico
// @run-at       document-idle
// @compatible   edge
// @compatible   chrome
// @compatible   safari
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/441472/%E5%9C%A8%20bing%E8%AF%8D%E5%85%B8%20%E4%B8%AD%E8%81%9A%E5%90%88%E6%98%BE%E7%A4%BA%20%E6%9C%89%E9%81%93%20%E7%9A%84%E7%BB%93%E6%9E%9C%20%E6%B7%BB%E5%8A%A0%E8%BD%AC%E8%B7%B3%E8%87%B3%E5%90%84%E7%A7%8D%E5%9C%A8%E7%BA%BF%E5%B7%A5%E5%85%B7%E7%9A%84%E6%8C%89%E9%92%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/441472/%E5%9C%A8%20bing%E8%AF%8D%E5%85%B8%20%E4%B8%AD%E8%81%9A%E5%90%88%E6%98%BE%E7%A4%BA%20%E6%9C%89%E9%81%93%20%E7%9A%84%E7%BB%93%E6%9E%9C%20%E6%B7%BB%E5%8A%A0%E8%BD%AC%E8%B7%B3%E8%87%B3%E5%90%84%E7%A7%8D%E5%9C%A8%E7%BA%BF%E5%B7%A5%E5%85%B7%E7%9A%84%E6%8C%89%E9%92%AE.meta.js
// ==/UserScript==


function clone_a(name) {
    const original = document.getElementById('b-scopeListItem-images');
    if (!original) return;

    const tmp = original.cloneNode(true);
    tmp.id = name;
    original.parentNode.insertBefore(tmp, original.nextSibling);
}
function clone_b(name) {
    const original = document.getElementById('b-scopeListItem-flights');
    if (!original) return;

    const tmp = original.cloneNode(true);
    tmp.id = name;
    original.parentNode.insertBefore(tmp, original.nextSibling);
}

function check_emp(x) {
  return x.length > 0;
}

function go_dn(elem_name) {
    const elem = document.querySelector(elem_name);
    if (!elem) return;

    const parent = elem.parentNode;
    let nextSibling = elem.nextElementSibling;

    while (nextSibling) {
        parent.appendChild(elem); // 将当前元素移至末尾，实现下移
        nextSibling = elem.nextElementSibling;
    }
}

(function() {
    'use strict';

    var wd = "NONE";

    var path = window.location.pathname.split('/').filter(check_emp);
    if(path.length > 1)
        wd = path[path.length -1];

    var vals = window.location.search.substring(1).split('&');
    for(var i in vals){
        var pair = vals[i].split('=');
        if(pair[0] == "q") wd = pair[1];
    }

    wd = wd.replace(/%20/g,'+');
    wd = wd.split('+').filter(check_emp).join('+');

    try{
        if(vals.length > 2) window.history.replaceState(null, null, 'https://' + window.location.hostname + '/dict/search?mkt=zh-CN&q=' + wd);
    }catch(error){}

//-=-=-=-=-=-=-=-=-=-=-=-=-以下修改各种按钮-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
    document.getElementById('b-scopeListItem-local').style.display = 'none';


    clone_b('oxford');clone_b('cambridge');clone_b('mw');clone_b('pwr');

    const mwLink = document.getElementById('mw').querySelector('a');
    mwLink.textContent = "webster";
    mwLink.href = "https://www.merriam-webster.com/dictionary/" + wd;

    const oxfordLink = document.getElementById('oxford').querySelector('a');
    oxfordLink.textContent = "oxford";
    oxfordLink.href = 'https://www.oxfordlearnersdictionaries.com/definition/english/'+wd;

    const cambridgeLink = document.getElementById('cambridge').querySelector('a');
    cambridgeLink.textContent = "cambridge";
    cambridgeLink.href = 'https://dictionary.cambridge.org/zhs/dictionary/english/'+wd;

    const pwrLink = document.getElementById('pwr').querySelector('a');
    pwrLink.textContent = "pwr thesaurus";
    pwrLink.href = 'https://www.powerthesaurus.org/'+wd;

    const flightsLink = document.getElementById('b-scopeListItem-flights').querySelector('a');
    flightsLink.textContent = "urban dict";
    flightsLink.href = 'https://www.urbandictionary.com/define.php?term='+wd;

    go_dn("#b-scopeListItem-flights");

    clone_a('acronyms');clone_a('jtw');clone_a('anti');clone_a('full_write');clone_a('rhyme');clone_a('wenku');

    const wenkuLink = document.getElementById('wenku').querySelector('a');
    wenkuLink.textContent = "论文例句 & 替词";
    wenkuLink.href = 'http://www.esoda.org/?q='+ wd;

    const antiLink = document.getElementById('anti').querySelector('a');
    antiLink.textContent = "反义词";
    antiLink.href = 'https://zh.powerthesaurus.org/' + wd +'/antonyms';

    const rhymeLink = document.getElementById('rhyme').querySelector('a');
    rhymeLink.textContent = "押韵";
    rhymeLink.href = 'https://www.wordhippo.com/what-is/words-that-rhyme-with/'+ wd + '.html';

    const fullWriteLink = document.getElementById('full_write').querySelector('a');
    fullWriteLink.textContent = "全写";
    fullWriteLink.href = 'https://www.allacronyms.com/'+ wd;

    const acronymsLink = document.getElementById('acronyms').querySelector('a');
    acronymsLink.textContent = "缩写";
    acronymsLink.href = 'https://acronymify.com/search?q='+ wd;

    const jtwLink = document.getElementById('jtw').querySelector('a');
    jtwLink.textContent = "搭配";
    jtwLink.href = 'http://www.just-the-word.com/main.pl?word='+ wd;

    const videoLink = document.getElementById('b-scopeListItem-video').querySelector('a');
    videoLink.textContent = "源流";
    videoLink.href = 'https://www.etymonline.com/word/'+ wd;

    const imagesLink = document.getElementById('b-scopeListItem-images').querySelector('a');
    imagesLink.textContent = "同义词";
    imagesLink.href = 'https://www.thesaurus.com/browse/'+ wd;

    go_dn("#jtw");
    go_dn("#wenku");
    go_dn("#b-scopeListItem-images");
    go_dn("#anti");
    go_dn("#acronyms");
    go_dn("#full_write");
    go_dn("#b-scopeListItem-dictionary");
    go_dn("#b-scopeListItem-video");
    go_dn("#rhyme");
    go_dn("#b-scopeListItem-menu");

//-=-=-=-=-=-=-=-=-=-=-=-=-以下显示各种按钮-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
    const mouse_on_effect = {filter: "drop-shadow(0px 1px 3px #808080)", transition: "0.1s", transitionTimingFunction: "ease-out"};
    const mouse_out_effect = {filter: "drop-shadow(0px 1px 3px #d0d0d0)", transition: "0.1s", transitionTimingFunction: "ease-out"};


    const linggle_button = document.createElement('button');
	linggle_button.className = 'btn btn-sm';
    const headerElem = document.getElementById('b_header');
    const logoElem = document.querySelector('.b_logo');
    Object.assign(linggle_button.style, {
        border: "0",
        backgroundColor: "transparent",
        cursor: "pointer",
        position: "absolute",
        left: (headerElem.offsetLeft + 57) + "px",
        top: (headerElem.offsetTop + headerElem.offsetHeight - 37) + "px"
    });
    linggle_button.innerHTML = `
        <img
            src="https://search.linggle.com/linggle-logo.png"
            alt="linggle-logo"
            width=${parseInt(logoElem.offsetWidth * 0.6)}px
        />
    `;
	linggle_button.onclick = function() {
		location.href = "https://search.linggle.com/?q=" + wd;
	}
    document.body.append(linggle_button);


    const ludwig_button = document.createElement('button');
    ludwig_button.className = 'btn btn-sm';
    Object.assign(ludwig_button.style, {
        border: "0",
        backgroundColor: "transparent",
        cursor: "pointer",
        position: "absolute",
        left: (headerElem.offsetLeft + 14) + "px",
        top: (headerElem.offsetTop + headerElem.offsetHeight - 37 -11) + "px"
    });
    ludwig_button.innerHTML = `
        <img
            src="https://ludwig.guru/icons/icon_144x144.png"
            alt="ludwig-logo"
            height=${parseInt(logoElem.offsetHeight * 2.0)}px
        />
    `;
	ludwig_button.onclick = function() {
		location.href = "https://ludwig.guru/s/" + wd;
	}
    document.body.append(ludwig_button);

    const searchForm = document.getElementById('sb_form_q');
    const searchBox = document.getElementById('sb_search');
    const gaoshan_height = parseInt(searchForm.offsetHeight * 1.25);

    const gaoshan_button = document.createElement('button');
    gaoshan_button.className = 'btn btn-sm';
    Object.assign(gaoshan_button.style, {
        border: "0",
        backgroundColor: "transparent",
        cursor: "pointer",
        position: "absolute",
        left: parseInt(searchBox.offsetLeft + searchBox.offsetWidth + 2.7 * gaoshan_height) + "px",
        top: parseInt(searchForm.offsetTop + searchForm.offsetHeight - gaoshan_height + 6) + "px"
    });
    Object.assign(gaoshan_button.style, {
        filter: mouse_out_effect.filter,
        transition: mouse_out_effect.transition,
        transitionTimingFunction: mouse_out_effect.transitionTimingFunction
    });
    gaoshan_button.onmouseout = function() {
        Object.assign(gaoshan_button.style, {
            filter: mouse_out_effect.filter,
            transition: mouse_out_effect.transition,
            transitionTimingFunction: mouse_out_effect.transitionTimingFunction
        });
    };
    gaoshan_button.onmouseover = function() {
        Object.assign(gaoshan_button.style, {
            filter: mouse_on_effect.filter,
            transition: mouse_on_effect.transition,
            transitionTimingFunction: mouse_on_effect.transitionTimingFunction
        });
    };
    gaoshan_button.innerHTML = `
        <img
            src= "https://picx.zhimg.com/v2-23056dfc4cb2193ea32e50a5679cbfce_1440w.png"
            alt="gaoshan-logo"
            height=`+ gaoshan_height +`px
        />
    `;
	gaoshan_button.onclick = function() {
		location.href = "http://www.dicts.cn/";
	}
    document.body.append(gaoshan_button);

    const deepl_button = document.createElement('button');
    deepl_button.className = 'btn btn-sm';
    Object.assign(deepl_button.style, {
        border: "0",
        backgroundColor: "transparent",
        cursor: "pointer",
        position: "absolute",
        left: parseInt(searchBox.offsetLeft + searchBox.offsetWidth + 1.55 * gaoshan_height) + "px",
        top: parseInt(searchForm.offsetTop + searchForm.offsetHeight - gaoshan_height + 10) + "px"
    });

    Object.assign(deepl_button.style, {
        filter: mouse_out_effect.filter,
        transition: mouse_out_effect.transition,
        transitionTimingFunction: mouse_out_effect.transitionTimingFunction
    });

    deepl_button.onmouseout = function() {
        Object.assign(deepl_button.style, {
            filter: mouse_out_effect.filter,
            transition: mouse_out_effect.transition,
            transitionTimingFunction: mouse_out_effect.transitionTimingFunction
        });
    };
    deepl_button.onmouseover = function() {
        Object.assign(deepl_button.style, {
            filter: mouse_on_effect.filter,
            transition: mouse_on_effect.transition,
            transitionTimingFunction: mouse_on_effect.transitionTimingFunction
        });
    };
    deepl_button.innerHTML = `
        <img
            src= "https://static.deepl.com/img/logo/DeepL_Logo_darkBlue_v2.svg"
            alt="deepl-logo"
            height=`+ gaoshan_height +`px
        />
    `;
	deepl_button.onclick = function() {
		location.href = "https://www.deepl.com/translator#en/zh/" + wd.replace(/\+/g,' ');
	}
    document.body.append(deepl_button);

    const baidu_button = document.createElement('button');
    baidu_button.className = 'btn btn-sm';
    Object.assign(baidu_button.style, {
        border: "0",
        backgroundColor: "transparent",
        cursor: "pointer",
        position: "absolute",
        left: parseInt(searchBox.offsetLeft + searchBox.offsetWidth + 0.37 * gaoshan_height) + "px",
        top: parseInt(searchForm.offsetTop + searchForm.offsetHeight - gaoshan_height + 10) + "px"
    });
    Object.assign(baidu_button.style, {
        filter: mouse_out_effect.filter,
        transition: mouse_out_effect.transition,
        transitionTimingFunction: mouse_out_effect.transitionTimingFunction
    });
    baidu_button.onmouseout = function() {
        Object.assign(baidu_button.style, {
            filter: mouse_out_effect.filter,
            transition: mouse_out_effect.transition,
            transitionTimingFunction: mouse_out_effect.transitionTimingFunction
        });
    };
    baidu_button.onmouseover = function() {
        Object.assign(baidu_button.style, {
            filter: mouse_on_effect.filter,
            transition: mouse_on_effect.transition,
            transitionTimingFunction: mouse_on_effect.transitionTimingFunction
        });
    };
    baidu_button.innerHTML = `
        <img
            src= "https://pica.zhimg.com/80/v2-4e3567b24ba7d7cfc8d496d932f73ed6_1440w.webp"
            alt="baidu-logo"
            height=`+ gaoshan_height*0.8 +`px
        />
    `;
    baidu_button.onclick = function() {
        location.href = "https://chat.baidu.com/search?word=翻译：「" + wd.replace(/\+/g,' ')+"」。搜索涉及的术语、名言或俗语等约定俗成的内容，提供各种翻译版本，并注明原句出处或权威参考等来源。若有多句，逐句分解，每句给出多种翻译后综合一种最佳版本。输出应包含：找到的参考（用表格呈现）、（若有多句）每句翻译选项（用无序列表呈现）和最终版本。";
    }
    document.body.append(baidu_button);

//-=-=-=-=-=-=-=-=-=-=-=-=-=-以下显示有道-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
    const sidebar = document.querySelector(".sidebar");
    if (sidebar) sidebar.style.display = "none";

    const idRh = document.getElementById("id_rh");
    if (idRh) idRh.style.display = "none";

    const idRhW = document.getElementById("id_rh_w");
    if (idRhW) idRhW.remove();

    if (wd == "NONE") return;

    var youdao_top_padding = 190;
    var youdao_left_padding = 120;
    var youdao_width = 640;
    var lfArea = document.querySelector(".lf_area");
    var bing_width = lfArea ? lfArea.offsetWidth : 0; // Similar to $(".lf_area").width()
    var margin = window.innerWidth - youdao_width - bing_width;

    document.getElementById("b_footer").style.display = "none";

    if (lfArea) {
        lfArea.style.position = "absolute";
        lfArea.style.left = parseInt(margin * 0.34) + "px";
    }

    var closeButtons = document.querySelectorAll('.pos_close');
    closeButtons.forEach(function(button) {
        button.click();
    });
    const expend_button = document.getElementById("ex_id");
    if (expend_button) expend_button.click();



    var noResults = document.querySelector(".no_results");
    var isNoResultsVisible = noResults ? (window.getComputedStyle(noResults).display !== "none") : false;
    if (!isNoResultsVisible) {

        var div = document.createElement('div');
        div.style.overflow = "hidden";
        div.style.position = "absolute";
        div.style.right = parseInt(margin * 0.16) + "px";


        var contentPadding = document.querySelector(".contentPadding");
        if (contentPadding) {
            // Get position similar to $(".contentPadding").position().top
            var rect = contentPadding.getBoundingClientRect();
            var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            div.style.top = (rect.top + scrollTop) + "px";
            div.style.height = document.documentElement.scrollHeight * 1.02 - (rect.top + scrollTop) + "px";
        }

        div.style.width = youdao_width + "px";

        var iframe = document.createElement('iframe');
        iframe.style.position = "relative";
        iframe.style.top = (-youdao_top_padding) + "px";
        iframe.style.left = (-youdao_left_padding) + "px";
        iframe.src = "https://dict.youdao.com/w/" + wd.replace(/\+/g, ' ');
        iframe.frameBorder = "0";
        iframe.scrolling = "no";
        iframe.width = (youdao_left_padding + youdao_width) + "px";
        iframe.height = document.documentElement.scrollHeight * 1.02 + "px";

        div.appendChild(iframe);
        document.body.appendChild(div);
    } else {

        var bgdiv = document.createElement('div');
        bgdiv.style.overflow = "hidden";
        bgdiv.style.position = "absolute";
        bgdiv.style.left = "0px";

        var header = document.getElementById("b_header");
        if (header) {
            bgdiv.style.top = (header.offsetHeight + 25) + "px";
            bgdiv.style.height = document.documentElement.scrollHeight-(header.offsetHeight + 25) + "px";
            bgdiv.style.width = header.offsetWidth + "px";

            //bgdiv.height = document.documentElement.scrollHeight + "px";

            var iframe = document.createElement('iframe');
            iframe.width = header.offsetWidth + "px";
            iframe.style.position = "relative";
            iframe.style.top = (-youdao_top_padding) + "px";
            iframe.src = "https://www.youdao.com/w/" + wd.replace(/\+/g, ' ');
            iframe.frameBorder = "0";
            iframe.scrolling = "no";
            iframe.height = document.documentElement.scrollHeight + "px";

            bgdiv.appendChild(iframe);
            document.body.appendChild(bgdiv);

            // Create additional empty div
            var emptyDiv = document.createElement('div');
            emptyDiv.style.overflow = "hidden";
            emptyDiv.style.position = "absolute";
            emptyDiv.style.backgroundColor = "#fcfcfe";
            emptyDiv.style.left = "810px";
            emptyDiv.style.top = (header.offsetHeight + 50) + "px";
            emptyDiv.style.width = (header.offsetWidth - 850) + "px";
            emptyDiv.style.height = (document.documentElement.scrollHeight - 250) + "px";

            document.body.appendChild(emptyDiv);
        }
    }
})();