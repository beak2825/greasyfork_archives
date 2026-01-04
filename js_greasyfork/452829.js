// ==UserScript==
// @name         UCDRS Wikipedia Reference Generator
// @version      0.1.4
// @description  访问全国图书馆参考咨询联盟（ucdrs.superlib.net）的书籍信息页面时，生成一个引用按钮，引用为维基百科Cite Book模板格式。Generate a reference button with Wikipedia Cite Book Template style when visiting the book detail page in ucdrs.superlib.net
// @author       Wikipedia User:瑞丽江的河水
// @license      MIT
// @match        http://book.ucdrs.superlib.net/views/specific/2929/bookDetail.jsp?*
// @grant        GM_setValue
// @grant        GM_getValue
// @namespace https://greasyfork.org/users/968912
// @downloadURL https://update.greasyfork.org/scripts/452829/UCDRS%20Wikipedia%20Reference%20Generator.user.js
// @updateURL https://update.greasyfork.org/scripts/452829/UCDRS%20Wikipedia%20Reference%20Generator.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var pages_style = GM_getValue('page_styles') === 2 ? 2 : 1;
    var details = getDetails();
    var reference = generateCitation(details, pages_style);
    generateButton(reference);
    var copy_btn = document.getElementById('cite_wikipedia');
    copy_btn.onclick = function () {
        var cite_text = document.getElementById('wikipedia_template');
        cite_text.select();
        document.execCommand('copy');
        alert("复制成功");
    }

    var pages_style_1 = document.getElementById('pages_style_1');
    pages_style_1.onclick = function () {
        GM_setValue('page_styles', 1);
        location.reload();
    }

    var pages_style_2 = document.getElementById('pages_style_2');
    pages_style_2.onclick = function () {
        GM_setValue('page_styles', 2);
        location.reload();
    }
})();

function getDetails() {
    var title = document.getElementsByClassName("tutilte")[0].innerHTML;
    var author = "";
    var publication = "";
    var location = "";
    var publisher = "";
    var year = "";
    var isbn = "";
    var dd_num = document.getElementsByTagName("dd").length;
    for(var i = 0; i < dd_num; i++) {
        var temp = document.getElementsByTagName("dd")[i].innerHTML;
        if(temp.includes("【作　者】")) {
            author = temp;
        } else if (temp.includes("【出版项】")) {
            publication = temp;
        } else if (temp.includes("【ISBN号】")) {
            isbn = temp;
        }
    }
    var regex = /\t|\n| /gi;
    title = title.replaceAll(/  /gi, ' ');
    author = author.substring(author.indexOf("【作　者】") + "【作　者】".length, author.length).replaceAll(regex, '');
    publication = publication.substring(publication.indexOf("【出版项】") + "【出版项】".length, publication.length).replaceAll(regex, '');
    location = publication.substring(0, publication.indexOf("："));
    location = location_exception_handling(location);
    publisher = publication.substring(publication.indexOf("：") + "：".length, publication.indexOf(","));
    year = publication.substring(publication.indexOf(",") + ",".length, publication.indexOf("."));
    isbn = isbn.substring(isbn.indexOf("【ISBN号】") + "【ISBN号】".length, isbn.length).replaceAll(regex, '').replaceAll('M', '');
    return [author, title, location, publisher, year, isbn];
}

function location_exception_handling(location) {
    if(location==="芒") {
        location = "芒市";
    }
    return location;
}

function generateCitation(details, pages_style) {

    // Header
    var reference = "{{cite book";
    if(pages_style === 1) {
        var ref_name;
        if(details[5] !== "") {
            ref_name = ":" + details[5];
        } else {
            ref_name = details[1].substring(0, 5);
        }
        reference = "<ref name=\"" + ref_name + "\">" + reference;
    } else {
        reference = "<ref>" + reference;
    }

    // Author
    if(details[0] !== "") {
        details[0] = details[0].replace(/，/g,",");
        details[0] = details[0].replace(/；/g,"; ");
        reference = reference + " |author=" + details[0];
    }

    // Title
    reference = reference + " |title=" + details[1];

    // Location
    if(details[2] !== "") {
        reference = reference + " |location=" + details[2];
    }

    // Publisher
    if(details[3] !== "") {
        reference = reference + " |publisher=" + details[3];
    }

    // Year
    if(details[4] !== "") {
        reference = reference + " |year=" + details[4];
    }

    // ISBN
    if(details[5] !== "") {
        var pure_isbn = details[5].replace(/·|-/g,"");
        if(pure_isbn.length < 10) {
            reference = reference + " |csbn=" + details[5];
        } else {
            reference = reference + " |isbn=" + details[5];
            if(!checkISBN(pure_isbn)) {
                reference = reference + " |ignore-isbn-error=true";
            }
        }
    }

    // pages
    if(pages_style === 2) {
        reference = reference + " |pages=";
    }

    // Footer
    reference = reference + " }}";
    if(pages_style === 1) {
        reference = reference + "</ref>{{rp|}}";
    } else {
        reference = reference + "</ref>";
    }
    return reference;
}

function checkISBN(isbn) {
    var isbn_array = Array.from(isbn);
    var check_digit;
    if(isbn_array.length === 10) {
        check_digit = (1 * isbn_array[0] + 2 * isbn_array[1] + 3 * isbn_array[2] + 4 * isbn_array[3] + 5 * isbn_array[4] + 6 * isbn_array[5] + 7 * isbn_array[6] + 8 * isbn_array[7] + 9 * isbn_array[8]) % 11;
        if(check_digit === 10) {
            check_digit = 'X';
        }
        if(check_digit != isbn_array[9]) {
            return false;
        }
    } else if(isbn_array.length === 13) {
        check_digit = (1 * isbn_array[0] + 3 * isbn_array[1] + 1 * isbn_array[2] + 3 * isbn_array[3] + 1 * isbn_array[4] + 3 * isbn_array[5] + 1 * isbn_array[6] + 3 * isbn_array[7] + 1 * isbn_array[8] + 3 * isbn_array[9] + 1 * isbn_array[10] + 3 * isbn_array[11]) % 10;
        if(check_digit !== 0) {
            check_digit = 10 - check_digit;
        }
        if(check_digit != isbn_array[12]) {
            return false;
        }
    }
    return true;
}

function generateButton(reference) {
    var content_body = document.getElementsByClassName("tu_content")[0].innerHTML;
    content_body = "<div>" + content_body + "</div>";
    var info = "<div style='margin-top: 10px;'><b>引用为维基百科Cite Book模板格式：</b></div>";
    var pages_style_selector_1 = "<button id='pages_style_1' style='padding-top: 3px; padding-bottom: 3px; padding-left: 7px; padding-right: 7px; cursor: pointer;'>{{rp|}}</button>";
    var pages_style_selector_2 = "<button id='pages_style_2' style='padding-top: 3px; padding-bottom: 3px; padding-left: 7px; padding-right: 7px; cursor: pointer;'>|pages=</button>";
    var pages_style_selector = pages_style_selector_1 + " " + pages_style_selector_2;
    var textarea = "<div style='margin-top: 5px;'><textarea style='padding: 3px; min-width: 80%; height: 50px; border: 2px solid #ccc; border-radius: 4px; background-color: #f8f8f8; resize:none;' id='wikipedia_template' readonly>" + reference + "</textarea></div>";
    var button = "<div style='margin-top: 10px; margin-left: 72%;'><button id='cite_wikipedia' style='padding-top: 3px; padding-bottom: 3px; padding-left: 7px; padding-right: 7px; cursor: pointer;'>复制</button></div>";
    document.getElementsByClassName("tu_content")[0].innerHTML = content_body + info + pages_style_selector + textarea + button;
}