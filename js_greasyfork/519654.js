// ==UserScript==
// @name         Inoreader在每个分组下添加一次性打开原网页按钮
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  Inoreader每个分组资讯的原网址一次性在新标签页打开
// @author       hui-Zz
// @include      http*://www.inoreader.com/*
// @include      http*://www.innoreader.com/*
// @include      http*://inoreader.com/*
// @include      http*://innoreader.com/*
// @include      http*://beta.inoreader.com/*
// @include      http*://beta.innoreader.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=innoreader.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/519654/Inoreader%E5%9C%A8%E6%AF%8F%E4%B8%AA%E5%88%86%E7%BB%84%E4%B8%8B%E6%B7%BB%E5%8A%A0%E4%B8%80%E6%AC%A1%E6%80%A7%E6%89%93%E5%BC%80%E5%8E%9F%E7%BD%91%E9%A1%B5%E6%8C%89%E9%92%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/519654/Inoreader%E5%9C%A8%E6%AF%8F%E4%B8%AA%E5%88%86%E7%BB%84%E4%B8%8B%E6%B7%BB%E5%8A%A0%E4%B8%80%E6%AC%A1%E6%80%A7%E6%89%93%E5%BC%80%E5%8E%9F%E7%BD%91%E9%A1%B5%E6%8C%89%E9%92%AE.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function open_click_from_grouping(fid){
        let articleDiv = document.querySelectorAll("div[data-type='article']");
        for(let l=0;l<articleDiv.length;l++){
            if(articleDiv[l].getAttribute("data-fid") == fid) {
                let content = articleDiv[l].getElementsByClassName("article_tile_content_wraper");
                let url = content[0].getElementsByTagName("a")
                let href = url[0].getAttribute("href");
                window.open(href);
            }
        }
    }

    // 插入一键打开按钮
    function insertOneClickOpenButton() {
        let footer = document.getElementsByClassName("articles_feed_group_footer py-2 flex justify-content-center mb-2");
        for(let k=0;k<footer.length;k++){
            // 获取分组信息
            let mark = footer[k].getElementsByClassName("mark_section_read btn btn-sm btn-outline-muted-color mt-2 mb-4");
            if(mark && mark[0] && mark[0].innerHTML != "- 将以上部分标记为已读 -"){
                mark[0].innerHTML = "- 将以上部分标记为已读 -";
                const click = mark[0].getAttribute("onclick")
                const reg = /.*,(\d+),this.*/;
                const fid = click.replace(reg,'$1');
                // 插入链接
                const a = document.createElement("div");
                const node = document.createTextNode("—次性打开以上部分");
                a.setAttribute("data-fid", fid);
                a.className = 'mark_section_read btn btn-sm btn-outline-muted-color mt-2 mb-4';
                a.addEventListener("click", function(){
                    this.previousElementSibling.click();
                    open_click_from_grouping(this.getAttribute("data-fid"));
                });
                a.appendChild(node);
                footer[k].appendChild(a);
                mark[0].style.padding = "0px 10px 10px";
            }
        }
        let footer_last = document.getElementsByClassName("articles_feed_group_footer py-2 flex justify-content-center mb-2 articles_feed_group_footer_last");
        let mark_last = document.getElementsByClassName("mark_section_read check_mark_above_as_read_bug  btn btn-outline-text btn-sm");
        if(footer_last && footer_last[0] && mark_last && mark_last[0] && mark_last[0].innerHTML != "\n\t\t\t\t\t\t- 将以上区域标记为已读 -\n\t\t\t\t\t"){
            mark_last[0].innerHTML = "\n\t\t\t\t\t\t- 将以上区域标记为已读 -\n\t\t\t\t\t";
            const click = mark_last[0].getAttribute("onclick")
            const reg = /.*,(\d+),this.*/;
            const fid = click.replace(reg,'$1');
            // 插入链接
            const a = document.createElement("div");
            const node = document.createTextNode("—次性打开以上部分");
            a.setAttribute("data-fid", fid);
            a.className = 'mark_section_read btn btn-sm btn-outline-muted-color mt-2';
            a.addEventListener("click", function(){
                this.previousElementSibling?.previousElementSibling.click();
                open_click_from_grouping(this.getAttribute("data-fid"));
            });
            a.appendChild(node);
            footer_last[0].appendChild(a);
        }
    }

    // 每次资讯分组加载后重新插入一键打开按钮
    const observerHot = new MutationObserver(() => {
        insertOneClickOpenButton();
    });

    // 监听热门评论区域的变化
    let commentContainerHot = document.querySelector('#content-wrapper');
    if (commentContainerHot) {
        observerHot.observe(commentContainerHot, {
            childList: true, // 监听子元素变化
            subtree: true, // 监听子元素及其后代元素变化
        });

        // 初次加载时插入一键打开按钮
        insertOneClickOpenButton();
    }

})();