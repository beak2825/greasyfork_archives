// ==UserScript==
// @name         Mobile01 (2019/08) - Load all pages beta
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Load next page content until the end.
// @author       nio127
// @match        https://www.mobile01.com/topicdetail.php*
// @grant        unsafeWindow
// @require http://code.jquery.com/jquery-3.4.1.min.js

// @downloadURL https://update.greasyfork.org/scripts/388443/Mobile01%20%28201908%29%20-%20Load%20all%20pages%20beta.user.js
// @updateURL https://update.greasyfork.org/scripts/388443/Mobile01%20%28201908%29%20-%20Load%20all%20pages%20beta.meta.js
// ==/UserScript==

(function() {
    //'use strict';



var NEXT_PAGE_TYPE =
{
    "FROM_ACTIVE" : 1,
    "FROM_NEXT" : 2
};
var dataset = {
    "mobile01": {
        "site" : "mobile01",
        "url_match" : "www.mobile01.com/*",
        "content_selector" : ".l-content__main>.u-gapNextV--lg",
        "content_index" : 2,
        "next_page_type" : NEXT_PAGE_TYPE.FROM_ACTIVE,
        "next_page_selector" : ".c-pagination--next",
        "active_page_selector" : ".l-pagination__page.is-active",
        "append_to" : ".l-content__main",
        "hide_selectors" : [
            ".u-gapNextV--lg>.l-navigation",
            ".u-gapNextV--lg>.l-heading"
        ],
        "sep_html" : "<hr class='page_separator' /><p class='page_info'>page: <a class='page_num'></a></p>"
    }
};
//var content = document.querySelector('.goods_content');
//var page_count = content.querySelectorAll('p.news-list-btn a').length;
//var callback_count = page_count - 1;
var loop_count = 1;

var show_message = function(count)
{
    var box = document.createElement("div");
    var html = [];

    html.push('<span style="display:block;margin:0px auto; opacity:1; vertical-align:middle; text-align:center; color:#fff; ">');
    html.push(count + " pages loaded...");
    html.push('</span>');
    box.innerHTML = html.join("");
    box.style = "background:#333; opacity:0.4; width:100%; position:fixed; bottom:0px; padding:5px; ";

    document.body.appendChild(box);

    setTimeout(function deleteMe(){
        document.body.removeChild(box);
    }, 3000);
};

var load_next_page = function (rule, content)//, loop_count)
{
//    var link_count = content.querySelectorAll('#goods-list-pages a').length;
//    var url = content.querySelectorAll('#goods-list-pages a')[(link_count-1)].href;
    if (content == undefined)
        content = document;

    var get_next_url = function(node) {
        var next_link;
        if (rule["next_page_type"] == NEXT_PAGE_TYPE.FROM_NEXT)
        {
            next_link = node.querySelector(rule["next_page_selector"]);
        }
        else if (rule["next_page_type"] == NEXT_PAGE_TYPE.FROM_ACTIVE)
        {
            next_link = node.querySelector(rule["active_page_selector"]);
            next_link = next_link.nextElementSibling;
            console.log('next_link', next_link);
            if (next_link && next_link.href == undefined)
            {
                next_link = next_link.querySelector("a");
            }
        }
        var next_url = "";
        if (next_link != undefined)
        {
            next_url = next_link.href;
            console.log("next_url = " + next_url);
        }
        else
        {
            console.log("cannot find next page link!");
        }
        return next_url;
    };


    var xhr = new XMLHttpRequest();
    var url = get_next_url(content);
    if (url == "")
    {
        //show load message
        show_message(loop_count);

        //exit
        return -1;
    }
    xhr.open('GET', url);
    xhr.onload = function() {
        if (xhr.status === 200) {
            //loop_count--;
            var data = xhr;
            tmp = document.createElement('div');
            tmp.innerHTML = data.responseText;

            var next_contents = tmp.querySelectorAll(rule["content_selector"]);
            var next_content;
            if (rule["content_index"] != -1)
            {
                next_content = next_contents[rule["content_index"]];
            }
            else
            {
                next_content = next_contents[0];
            }

            //hide elements
            if (rule["hide_selectors"].length)
            {
                var hide_length = rule["hide_selectors"].length;
                for (i=0; i<hide_length; i++)
                {
                    var items = next_content.querySelectorAll(rule["hide_selectors"]);
                    items.forEach(function(item) {
                        item.style.display = "none";
                    });
                }
            }

            //content.append(next_content);
            var append_to = document.querySelector(rule["append_to"]);

            //before next page content, insert separate html
            var sep_div = document.createElement("div");
            sep_div.innerHTML = rule["sep_html"];
            sep_div.id = "next_page_" + ++loop_count;
            sep_div.querySelector("a").href = url;
            sep_div.querySelector("a").innerText = loop_count;
            append_to.append(sep_div);

            //append next page content
            append_to.append(next_content);

            //check if next page exists
            load_next_page(rule, next_content);

            delete tmp;
        }
        else {
            alert('Request failed.  Returned status of ' + xhr.status);
        }
    };
    xhr.send();
};

load_next_page(dataset["mobile01"]);

    //$(".c-pagination--next");

    //refresh mobile01's pictures/attachments

    $("article img.lazy").each(function() {
        var srccontent = $(this).attr("data-src");
        srccontent.replace(/\/\/attach\.mobile01\.com\/attach\/.*?\/mobile01-.*?_m(1|2|3).(jpg|png|gif)/ig, function(matched, p1) {
            $("img[data-src$='"+matched+"']").addClass("m"+p1+"size");
        });
    });

    console.log("unsafeWindow = " + (undefined == unsafeWindow));
    var lazyLoadInstance = new unsafeWindow.LazyLoad({
        elements_selector: ".lazy"
    });
    unsafeWindow.li = lazyLoadInstance;
    console.log("lazyload = " + lazyLoadInstance);
    setTimeout(function() {unsafeWindow.li.update();console.log("update!");}, 5000);
    if (lazyLoadInstance) {
        lazyLoadInstance.update();
    }



})();