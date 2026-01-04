// ==UserScript==
// @name         CNKI Wikipedia Reference Generator
// @version      0.4.3
// @description  访问中国知网（cnki.net）的论文信息页面时，生成一个引用按钮，引用为维基百科Cite系列模板格式。Generate a citation button with Wikipedia Cite Template style when visiting the thesis detail page in cnki.net
// @author       Wikipedia User:瑞丽江的河水 User:Kcx36
// @license      MIT
// @match        */kcms/detail/detail.aspx?*
// @match        */kcms2/article/abstract*
// @match        */KCMS/detail/detail.aspx?*
// @match        */kcms/doi/*
// @namespace https://greasyfork.org/users/968912
// @downloadURL https://update.greasyfork.org/scripts/452884/CNKI%20Wikipedia%20Reference%20Generator.user.js
// @updateURL https://update.greasyfork.org/scripts/452884/CNKI%20Wikipedia%20Reference%20Generator.meta.js
// ==/UserScript==

(function () {
    'use strict';
    var details = getDetails();
    var reference = generateCitation(details);
    generateButton(reference);
    var copy_btn = document.getElementById('cite_wikipedia');
    copy_btn.onclick = function () {
        var cite_text = document.getElementById('wikipedia_template');
        cite_text.select();
        document.execCommand('copy');
        alert("复制成功");
    }
})();

function getDetails() {
    var dbcode = document.getElementById("paramdbcode").value;
    var title = document.getElementsByTagName("h1")[0].innerHTML;
    var i = 0;
    var temp;
    if (dbcode == "CMFD" || dbcode == "CDFD") {
        var author = document.getElementsByClassName('author')[0].textContent;
        var publisher = document.getElementsByClassName('author')[1].textContent;
        publisher = publisher.replace(/\s/g, "");
        return [author, title, publisher];
    }
    else {
        var author_part = document.getElementById("authorpart");
        var authors = [];
        if (author_part !== undefined) {
            var author_nums = author_part.getElementsByTagName("span").length;
            for (i = 0; i < author_nums; i++) {
                temp = author_part.getElementsByTagName("span")[i];
                if (temp.getElementsByTagName("a").length !== 0) {
                    authors[i] = temp.getElementsByTagName("a")[0].innerHTML;
                    if (authors[i].includes("<sup>")) {
                        authors[i] = authors[i].substring(0, authors[i].indexOf("<sup>"));
                    }
                } else {
                    temp = temp.innerHTML;
                    if (temp.includes("<i class=\"icon-email\">")) {
                        temp = temp.substring(0, temp.indexOf("<i class=\"icon-email\">"));
                    }
                    if (temp.includes(",")) {
                        i = 0;
                        while (temp.includes(",")) {
                            authors[i] = temp.substring(0, temp.indexOf(","));
                            temp = temp.substring(temp.indexOf(",") + 1, temp.length);
                            i++;
                        }
                    }
                    authors[i] = temp;
                }
            }
        }

        var publication_pre = document.getElementsByClassName("top-tip")[0];
        if (publication_pre !== undefined) {
            var publication = publication_pre.getElementsByTagName("span")[0];
            var journal = "";
            var year = "";
            var volume = "";
            var issue = "";
            if (publication !== undefined) {
                var journal_part = publication.getElementsByTagName("a")[0];
                if (journal_part !== undefined) {
                    journal = journal_part.innerHTML;
                    journal = journal.replace("(", "（");
                    journal = journal.replace(")", "）");
                }
                var issue_part = publication.getElementsByTagName("a")[1];
                if (issue_part !== undefined) {
                    issue_part = issue_part.innerHTML;
                    year = issue_part.substring(0, 4);
                    volume = issue_part.substring(issue_part.indexOf(",") + 1, issue_part.indexOf("(")).trim();
                    issue = issue_part.substring(issue_part.indexOf("(") + 1, issue_part.indexOf(")")).trim();
                    if (issue.startsWith("0")) {
                        issue = issue.substring(1, issue.length);
                    }
                }
            }
        }

        var pages = "";
        var total_info = document.getElementsByClassName("total-inform")[0];
        if (total_info !== undefined) {
            var info_nums = total_info.getElementsByTagName("span").length;
            for (i = 0; i < info_nums; i++) {
                temp = total_info.getElementsByTagName("span")[i].innerHTML;
                if (temp.includes("页码：")) {
                    pages = temp.substring(temp.indexOf("页码：") + "页码：".length, temp.length);
                    pages = pages.replace("+", ",");
                    break;
                }
            }
        }

        var doi = "";
        var main_info_length = document.getElementsByClassName("top-space").length;
        if (main_info_length !== 0) {
            for (i = 0; i < main_info_length; i++) {
                temp = document.getElementsByClassName("top-space")[i].getElementsByTagName("span")[0].innerHTML;
                if (temp.includes("DOI：")) {
                    doi = document.getElementsByClassName("top-space")[i].getElementsByTagName("p")[0].innerHTML;
                    break;
                }
            }
        }
        return [authors, title, journal, year, volume, issue, pages, doi];
    }
}

function generateCitation(details) {
    var dbcode = document.getElementById("paramdbcode").value;
    var cnki_id = "{{CNKI|" + document.getElementById("paramfilename").value + "|" + document.getElementById("paramdbcode").value + "}}"
    var reference = "";
    var i, brief_num, temp, date;

    // 期刊
    if (dbcode == "CJFD" || dbcode == "CJFQ") {
        // Header
        if (details[0] !== []) {
            reference = "<ref name=\"" + details[0][0] + "\">{{cite journal";
        } else {
            reference = "<ref>{{cite journal";
        }
        // Author
        if (details[0] !== []) {
            if (details[0].length > 1) {
                for (i = 0; i < details[0].length; i++) {
                    reference = reference + " |author" + (i + 1) + "=" + details[0][i];
                }
            } else {
                reference = reference + " |author=" + details[0][0];
            }
        }
        // Title
        reference = reference + " |title=" + details[1];
        // Journal
        reference = reference + " |journal=" + details[2];
        // Year
        if (details[3] !== "") {
            reference = reference + " |year=" + details[3];
        }
        // volume
        if (details[4] !== "" && details[3] !== details[4]) {
            reference = reference + " |volume=" + details[4];
        }
        // issue
        if (details[5] !== "") {
            reference = reference + " |issue=" + details[5];
        }
        // pages
        if (details[6] !== "") {
            reference = reference + " |pages=" + details[6];
        }
        // doi
        if (details[7] !== "") {
            reference = reference + " |doi=" + details[7];
        }
        // cnki
        reference = reference + " |id=" + cnki_id;
        // Footer
        reference = reference + " }}</ref>";
    }

    // 辑刊，根据 (李伟,王磊,郭伟.引用辑刊的参考文献著录建议[J].编辑学报,2021,33(04):397-399.) 辑刊引用参照书籍引用，使用cite book模板
    else if (dbcode == "CCJD") {
        // Header
        if (details[0] !== []) {
            reference = "<ref name=\"" + details[0][0] + "\">{{cite book";
        } else {
            reference = "<ref>{{cite book";
        }
        // Author
        if (details[0] !== []) {
            if (details[0].length > 1) {
                for (i = 0; i < details[0].length; i++) {
                    reference = reference + " |author" + (i + 1) + "=" + details[0][i];
                }
            } else {
                reference = reference + " |author=" + details[0][0];
            }
        }
        // Chapter
        reference = reference + " |chapter=" + details[1];
        // Title
        reference = reference + " |title=" + details[2];
        if (details[4] !== "") {
            reference = reference + " 第" + details[4] + "辑";
        }
        // Year
        if (details[3] !== "") {
            reference = reference + " |year=" + details[3];
        }
        // pages
        if (details[6] !== "") {
            reference = reference + " |pages=" + details[6];
        }
        // isbn
        reference = reference + " |isbn=<!--建议从第三方查找辑刊ISBN号-->";
        // doi
        if (details[7] !== "") {
            reference = reference + " |doi=" + details[7];
        }
        // cnki
        reference = reference + " |id=" + cnki_id;
        // Footer
        reference = reference + " }}</ref>";
    }

    // 博硕
    else if (dbcode == "CMFD" || dbcode == "CDFD") {
        // Header
        reference = "<ref name=\"" + details[0] + "\">{{cite thesis";
        // Author
        reference = reference + " |author=" + details[0];
        // Title
        reference = reference + " |title=" + details[1];
        // Degree + Year
        if (dbcode == "CMFD") {
            reference = reference + " |degree=硕士 |year=<!--请手动填写-->";
        } else {
            reference = reference + " |degree=博士 |year=<!--请手动填写-->";
        }
        // Publisher
        reference = reference + " |publisher=[[" + details[2];
        // cnki
        reference = reference + "]] |id=" + cnki_id;
        // Footer
        reference = reference + " }}</ref>";
    }

    // 会议
    else if (dbcode == "CPFD") {
        // Header
        reference = "<ref name=\"" + details[0][0] + "\">{{cite conference";
        // Author
        if (details[0] !== []) {
            if (details[0].length > 1) {
                for (i = 0; i < details[0].length; i++) {
                    reference = reference + " |author" + (i + 1) + "=" + details[0][i];
                }
            } else {
                reference = reference + " |author=" + details[0][0];
            }
        }
        // Title
        reference = reference + " |title=" + details[1];
        // Date
        brief_num = document.getElementsByClassName("rowtit").length;
        for (i = 0; i < brief_num; i++) {
            temp = document.getElementsByClassName("rowtit")[i].innerHTML;
            if (temp.includes("会议时间：")) {
                date = document.getElementsByClassName("rowtit")[i].nextElementSibling.innerHTML;
                reference = reference + " |date=" + date;
            }
        }
        // Book Title + Publisher
        reference = reference + " |book-title=<!--请手动填写--> |publisher=<!--请手动填写-->";
        // pages
        if (details[6] !== "") {
            reference = reference + " |pages=" + details[6];
        }
        // cnki
        reference = reference + " |id=" + cnki_id;
        // Footer
        reference = reference + " }}</ref>";
    }

    // 报纸
    else if (dbcode == "CCND") {
        // Header
        reference = "<ref name=\"" + details[0][0] + "\">{{cite news";
        // Author
        if (details[0] !== []) {
            if (details[0].length > 1) {
                for (i = 0; i < details[0].length; i++) {
                    reference = reference + " |author" + (i + 1) + "=" + details[0][i];
                }
            } else {
                reference = reference + " |author=" + details[0][0];
            }
        }
        // Title
        reference = reference + " |title=" + details[1];
        // Newspaper
        reference = reference + " |newspaper=<!--请手动填写-->";
        // Date
        brief_num = document.getElementsByClassName("rowtit").length;
        for (i = 0; i < brief_num; i++) {
            temp = document.getElementsByClassName("rowtit")[i].innerHTML;
            if (temp.includes("报纸日期：")) {
                date = document.getElementsByClassName("rowtit")[i].nextElementSibling.innerHTML;
                reference = reference + " |date=" + date;
            }
        }
        // cnki
        reference = reference + " |id=" + cnki_id;
        // Footer
        reference = reference + " }}</ref>";
    }
    else {
        reference = "本文献暂不支持";
    }
    reference = reference.replace("<ref name=\"undefined\">", "<ref>");
    reference = reference.replace(" |author=undefined", "");
    return reference;
}

function generateButton(reference) {
    var content_body = document.getElementsByClassName("wx-tit")[0].innerHTML;
    var info = "<div style='margin-top: 10px; margin-left: 10%; text-align: left;'><b>引用为维基百科Cite模板格式：</b></div>";
    var textarea = "<div style='margin-top: 5px;'><textarea style='padding: 3px; min-width: 80%; height: 38px; border: 2px solid #ccc; border-radius: 4px; background-color: #f8f8f8; resize:none;' id='wikipedia_template' readonly>" + reference + "</textarea></div>";
    var button = "<div style='margin-top: -35px; margin-left: 87%;'><button id='cite_wikipedia' style='padding-top: 3px; padding-bottom: 3px; padding-left: 7px; padding-right: 7px; cursor: pointer;'>复制</button></div>";
    document.getElementsByClassName("wx-tit")[0].innerHTML = info + textarea + button + content_body;
}