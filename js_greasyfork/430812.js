// ==UserScript==
// @name         文献自动下载
// @namespace    stevexie
// @version      0.1
// @description  根据DOI自动搜索打开sci-hub下载文献
// @author       Stevexie
// @include      *://*onlinelibrary.wiley.com/*
// @include      *://*sciencedirect.com/*
// @include      *://pubs.acs.org/*
// @include      *://pubs.rsc.org/*
// @include      *://www.nature.com/*
// @include      *://journals.aps.org/*
// @include      *://aip.scitation.org/*
// @include      *://science.sciencemag.org/*
// @include      *://www.osapublishing.org/*
// @include      *://iopscience.iop.org/*
// @include      *://link.springer.com/*
// @include      *://www.cell.com/*
// @require      http://code.jquery.com/jquery-latest.js
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/430812/%E6%96%87%E7%8C%AE%E8%87%AA%E5%8A%A8%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/430812/%E6%96%87%E7%8C%AE%E8%87%AA%E5%8A%A8%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var sci_hub_url = "sci-hub.se"; // sci-hub.se sci-hub.tw

    //var frame = "<iframe id='myframe'></iframe>";
    //$("body").append(frame);

    var url_g = getDownloadURL();
    if (url_g) {
        addBtn();
        addDownloadBtnEvent(url_g);
    }

    function addBtn(){
        var download = "<div id='wenxiandownload'style='cursor:pointer;z-index:98;display:block;width:30px;height:30px;line-height:30px;position:fixed;left:0;top:300px;text-align:center;overflow:visible'><p style='font-size:25px;color:orange'>文献下载</p></div>";
        $("body").append(download);
    }

    function getDownloadURL(){
        var doi_url;
        var href = window.location.href;

        // wiley
        if (href.match(/onlinelibrary.wiley.com/)) {
            doi_url = $("a.epub-doi").text();
        }

        // elsevier
        if (href.match(/sciencedirect.com/)) {
            doi_url = $("#doi-link > a.doi").text();
        }

        // acs
        if (href.match(/pubs.acs.org/)) {
            doi_url = $("div.article_header-doiurl > a[title='DOI URL']").text();
        }

        // rsc
        if (href.match(/pubs.rsc.org/)) {
            doi_url = $("a.text--small").text();
        }

        // nature
        if (href.match(/nature.com/)) {
            doi_url = $("#article-info-content > div > div:nth-child(2) > ul > li.c-bibliographic-information__list-item.c-bibliographic-information__list-item--doi > p > span.u-clearfix.c-bibliographic-information__value > a").text();
        }

        // aps
        if (href.match(/journals.aps.org/)) {
            doi_url = $("span.doi-field").text();
        }

        // aip
        if (href.match(/aip.scitation.org/)) {
            doi_url = document.querySelector("div[class='publicationContentCitation']").querySelector("a").text;
        }

        // science
        if (href.match(/science.sciencemag.org/)) {
            doi_url = "https://doi.org/" + $("#node705652 > div.highwire-cite.highwire-cite-highwire-article.highwire-citation-jnl-sci-article.clearfix.has-author-tooltip > div").text().split("DOI: ")[1];
        }

        // osapublishing
        if (href.match(/osapublishing.org/)) {
            doi_url = $("#articleContainer > div:nth-child(2) > div > div > ul > li.article-doi > a").text();
        }

        // iopscience
        if (href.match(/iopscience.iop.org/)) {
            doi_url = "https://doi.org/" + $("#doi").text();
        }

        // springer
        if (href.match(/link.springer.com/)) {
            doi_url = $("a[data-track-action='view doi']").text();
        }

        // cell
        if (href.match(/cell.com/)) {
            doi_url = $("a.article-header__doi__value").text();
        }

        return doi_url.replace(/doi.org/, sci_hub_url);
    }

    function getFQ(name, issn) {
        name = name||"";
        issn = issn||"";
        GM_xmlhttpRequest({
            method: 'POST',
            url: "http://letpub.com.cn/index.php?page=journalapp&view=search",
            headers: {"Content-Type": "application/x-www-form-urlencoded"},
            data: "searchname=" + name + "&searchissn=" + issn + "&searchfield=&searchimpactlow=&searchimpacthigh=&searchscitype=&view=search&searchcategory1=&searchcategory2=&searchjcrkind=&searchopenaccess=&searchsort=relevance",
            onload: function(response) {
                var re = /<td style="border:1px #DDD solid; border-collapse:collapse; text-align:left; padding:8px 8px 8px 8px;">(\S*)<\/td>/g;
                var result = response.responseText.match(re)[2].replace(re, "$1");
                if(result) {
                    var fenqu = "<div id='fenqu'style='cursor:pointer;z-index:98;display:block;width:30px;height:30px;line-height:30px;position:fixed;left:0;top:150px;text-align:center;overflow:visible'><p style='font-size:25px;color:blue'>" + result + "</p></div>";
                    $("body").append(fenqu);
                    $("#fenqu").click(function(){
                        window.open("http://letpub.com.cn/index.php?page=journalapp&view=search");
                    });
                }
            }
        });
    }

    function addDownloadBtnEvent(url){
       $("#wenxiandownload").click(function(){
           window.open(url);
       });
    }

    function nameModify(name) {
        var newname = name;
        newname = newname.replace(": ", "-"); //去掉冒号
        newname = newname.replace(/^the/i, ""); //去掉开头the
        return newname;
    }

   $(document).ready(function(){
       var jname_node = "";
       var jname = "";
       var href = window.location.href;

       // wiley
        if (href.match(/onlinelibrary.wiley.com/)) {
            jname_node = $("#journal-banner-image");
            jname = jname_node.attr("alt");
            getFQ(nameModify(jname),"");
        }

        // elsevier
        if (href.match(/sciencedirect.com/)) {
            jname_node = $("#publication-title > a");
            jname = jname_node.text();
            getFQ(nameModify(jname),"");
        }

        // acs
        if (href.match(/pubs.acs.org/)) {
            jname_node = $("#pb-page-content > div > main > article > div.article_header > div.container.container_scaled-down > div > div > div.article_header-right.pull-left.hidden-md.hidden-sm.hidden-xs > div > div.aJhp_link > a");
            jname = jname_node.text();
            getFQ(nameModify(jname),"");
        }

        // rsc
        if (href.match(/pubs.rsc.org/)) {
            jname_node = $("#maincontent > div > div > div.layout__panel.layout__panel--primary.layout__panel--60.layout__panel--filled > section > div > div.list-control > ul > li > a > span.list__text-col > span > h3");
            jname = jname_node.text();
            getFQ(nameModify(jname),"");
        }

        // nature
        if (href.match(/nature.com/)) {
            jname_node = $("#content > div > div > article > div.c-article-main-column.u-float-left.js-main-column > div.c-article-header > header > p > a:nth-child(1) > i");
            jname = jname_node.text();
            getFQ(nameModify(jname),"");
        }

        // aps
        if (href.match(/journals.aps.org/)) {
            jname_node = $("#header > div > div > h2 > a");
            jname = jname_node.text();
            getFQ(nameModify(jname),"");
        }

        // aip
        if (href.match(/aip.scitation.org/)) {
            jname_node = $("a[title='Journal Home']");
            jname = jname_node.text();
            getFQ(nameModify(jname),"");
        }

        // science
        if (href.match(/science.sciencemag.org/)) {
            jname_node = $("#publication-title > a");
            jname = jname_node.text();
            getFQ(nameModify(jname),"");
        }

        // osapublishing
        if (href.match(/osapublishing.org/)) {
            jname_node = $("ul.small.list-inline.col-md-12.article-journal-name > li > strong");
            jname = jname_node.text();
            getFQ(nameModify(jname),"");
        }

       // iopscience
        if (href.match(/iopscience.iop.org/)) {
            jname_node = $("#wd-pub-name > div > a");
            jname = jname_node.text();
            getFQ(nameModify(jname),"");
        }

       // springer
        if (href.match(/link.springer.com/)) {
            jname_node = $("i[data-test='journal-title']");
            jname = jname_node.text();
            getFQ(nameModify(jname),"");
        }

       // cell
        if (href.match(/cell.com/)) {
            jname_node = $("#pb-page-content > div > div:nth-child(1) > div > div > div > div:nth-child(2) > header > div.header__wrapper.clearfix > div:nth-child(2) > div:nth-child(1) > div > span > a");
            jname = jname_node.attr("title");
            getFQ(nameModify(jname),"");
        }


   });

})();