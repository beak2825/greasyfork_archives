// ==UserScript==
// @name         duckduckgo script
// @namespace    http://duckduckgo.com/
// @version      2.0
// @description  make duckduckgo convenient
// @author       charles
// @match        https://duckduckgo.com/?q=*
// @match        https://duckduckgo.com/?t=*
// @icon         https://www.google.com/s2/favicons?domain=duckduckgo.com
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/432980/duckduckgo%20script.user.js
// @updateURL https://update.greasyfork.org/scripts/432980/duckduckgo%20script.meta.js
// ==/UserScript==

GM_addStyle(`
.result__title > .result__a,.result__title > .result__a:hover, .result__title > .result__a:active {
    color: rgb(105, 151, 244) !important;
}
.result__title > .result__a:visited, .result__title > .result__a:visited:hover {
    color: rgb(202, 97, 255) !important;
}
.result__body > .result__snippet > b {
    color: red !important;
}
.highlight{
  cursor: inherit !important;
}
`);

(function () {
    "use strict";

    // Your code here...
    let pre_result_length = 0;
    let counter = 0;
    let change_result_node = function () {
        let result = document.getElementsByClassName("results_links_deep");
        let links = document.getElementById("links");
        if (result.length <= pre_result_length && counter < 100) {
            setTimeout(() => {
                counter = counter + 1;
                change_result_node();
            }, 50);
        } else {
            counter = 0;
            pre_result_length = result.length;
            for (let i = 0; i < result.length; i++) {
                let clone_result = result[i].cloneNode(true);
                let img_parent = result[i].getElementsByClassName(
                    "result__extras__url"
                )[0];
                let img = img_parent.getElementsByClassName("result__icon")[0];
                clone_result
                    .getElementsByClassName("result__extras__url")[0]
                    .replaceChild(
                        img,
                        clone_result.getElementsByClassName("result__icon")[0]
                    );
                links.replaceChild(clone_result, result[i]);
            }
            add_listener_to_more_result(0);
        }
    };
    let add_listener_to_more_result = function (time) {
        let more_result_node = document.getElementsByClassName("result--more__btn");
        if (more_result_node[0] === undefined && time < 100) {
            setTimeout(() => {
                add_listener_to_more_result(time + 1);
            }, 50);
        } else if (more_result_node[0] !== undefined) {
            more_result_node[0].addEventListener("click", () => {
                change_result_node();
                add_side_bar();
            });
        }
    };
    let link_list = undefined;
    let record_add_side_bar_index = 0;
    let add_side_bar = function () {
        let width = document.querySelector(".sidebar-modules").getBoundingClientRect().width;
        let result_extra = document.querySelectorAll(".results_links_deep");
        let result_a = document.querySelectorAll(".result__title");
        if (result_extra.length <= record_add_side_bar_index && counter < 100) {
            setTimeout(() => {
                counter = counter + 1;
                add_side_bar();
            }, 50);
        } else {
            let add_div_function = () => {
                let ul = link_list.querySelector(".link_list");
                if (ul == null) {
                    ul = document.createElement("ul")
                    ul.setAttribute("class", "link_list");
                }
                for (let i = record_add_side_bar_index; i < result_extra.length; i++) {
                    let div = document.createElement("div");
                    let item = result_extra[i].querySelector(".result__extras__url").cloneNode(true);
                    let icon = item.querySelector("span").querySelector("a").querySelector("img");
                    let data_src = icon.getAttribute("data-src");
                    if (data_src != null) {
                        icon.src = data_src;
                    }
                    let title = result_a[i].cloneNode(true);
                    div.appendChild(item);
                    div.appendChild(title);
                    ul.appendChild(div);
                }
                record_add_side_bar_index = result_extra.length;
                link_list.appendChild(ul);
            }
            if (link_list === undefined) {
                link_list = document.createElement("div");
                link_list.className = "link_list";
                link_list.style.width = width.toString() + "px";
                link_list.style.border = "1px solid";
                link_list.style.borderRadius = "5px";
                link_list.style.maxHeight = "300px";
                link_list.style.zIndex = "999";
                link_list.style.overflow = "auto";
                add_div_function();
                side_bar_div.appendChild(link_list);
            } else {
                add_div_function()
            }
        }
    }
    const side_bar_div = document.querySelector(".results--sidebar");
    const duckbar = document.querySelector(".zcm-wrap-wrap");
    window.onscroll = function () {
        let side_module = side_bar_div.querySelector(".module");
        if (side_module == null)
            side_module = side_bar_div.querySelector(".sidebar-modules");
        if (link_list !== undefined && side_module != null) {
            let top_div = side_module.getBoundingClientRect();
            let zoom = duckbar.getBoundingClientRect();
            if (top_div.bottom < 0 || top_div.bottom < zoom.bottom) {
                link_list.style.position = "fixed";
                if (zoom.bottom >= 0) {
                    link_list.style.top = (zoom.bottom + 10) + "px";
                } else {
                    link_list.style.top = "0";
                }
            } else {
                link_list.style.position = "relative";
                link_list.style.top = "0";
            }
        }
    };
    document.onreadystatechange = function () {
        if (document.readyState === "complete") {
            change_result_node();
            add_side_bar();
        }
    };
})();
