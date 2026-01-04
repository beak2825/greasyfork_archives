// ==UserScript==
// @name         NovelUpdates covers on front page + only JP
// @namespace    NovelUpdatesCoversOnFrontPageOnlyJP
// @version      1.2
// @description  Adds novel covers on the front page. Also leaves only JP novels on the front page.
// @author       JuuzaAmakusa
// @match        https://novelupdates.com/
// @match        https://www.novelupdates.com/
// @match        http://novelupdates.com/
// @match        http://www.novelupdates.com/
// @match        https://novelupdates.com/?pg=*
// @match        https://www.novelupdates.com/?pg=*
// @match        http://novelupdates.com/?pg=*
// @match        http://www.novelupdates.com/?pg=*
// @grant        GM.xmlHttpRequest
// @downloadURL https://update.greasyfork.org/scripts/395825/NovelUpdates%20covers%20on%20front%20page%20%2B%20only%20JP.user.js
// @updateURL https://update.greasyfork.org/scripts/395825/NovelUpdates%20covers%20on%20front%20page%20%2B%20only%20JP.meta.js
// ==/UserScript==
(function () {
    "use strict";
    if (typeof window.orientation !== 'undefined')
    {
        var series_list = document.querySelectorAll("table.tbl_m_release > tbody > tr > td > a:not([class])");
        [].forEach.call(series_list, function(series) {
            var is_japanese = series.parentNode.querySelector("span.orgjp");
            if (!is_japanese) {
                series.parentNode.parentNode.remove();
            }
            else {
                series.parentNode.querySelector("span.orgjp").remove();
                var tbody_image_node = document.createElement("img");
                tbody_image_node.src = "https://www.novelupdates.com/img/noimagefound.jpg";
                tbody_image_node.style.width = "15%";
                tbody_image_node.style.float = "left";
                tbody_image_node.style.margin = "5px";
                tbody_image_node.style.marginRight = "10px";
                tbody_image_node.className = "hover_thumb";
                series.style.paddingLeft = "10px";
                series.parentNode.prepend(tbody_image_node);
                series.parentNode.querySelector("span[style]").remove();
                series.parentNode.querySelector("label[onclick]").style.marginLeft = "15px";
                series.parentNode.querySelector("label[onclick]").style.marginRight = "15px";
                series.parentNode.querySelector("label[onclick]").style.marginTop = "10px";
                series.parentNode.querySelector("label[onclick]").style.marginBottom = "10px";
            }
        });
        [].forEach.call(series_list, async function(series) {
            await getUrlBody(series.href).then(function(nvl_response) {
                var tbody_image_node = series.parentNode.parentNode.querySelector("td > img");
                var cute_image = nvl_response.response.match(/\"https\:\/\/cdn\.novelupdates\.com\/images\/\d{4}\/\d{2}\/.+\.\w+\"/i);
                if (cute_image) {
                    tbody_image_node.src = cute_image[0].substring(1, cute_image[0].length - 1);
                    series.parentNode.querySelector("label[onclick]").style.marginTop = (tbody_image_node.clientHeight / 2).toString() + "px";
                    series.parentNode.querySelector("label[onclick]").style.marginBottom = (tbody_image_node.clientHeight / 2).toString() + "px";
                }
            }, function(err) {
                console.log(err);
            });
        });
    }
    else {
        var hover_div = document.createElement("div");
        hover_div.id = "hoverUI";
        var container = document.querySelector("div.l-canvas");
        container.append(hover_div);
        document.onmousemove = function(e) {
            const hover_div = document.getElementById("hoverUI");
            if (hover_div.firstChild) {
                if (e.pageY + hover_div.firstChild.clientHeight > window.scrollY + window.innerHeight) {
                    hover_div.firstChild.style.top = (window.scrollY + window.innerHeight - hover_div.firstChild.clientHeight).toString() + "px";
                }
                else {
                    hover_div.firstChild.style.top = e.pageY.toString() + "px";
                }
                hover_div.firstChild.style.left = (e.pageX + 5).toString() + "px";
            }
        };
        var thead_list = document.querySelectorAll("table#myTable > thead > tr");
        [].forEach.call(thead_list, function(thead) {
            //<th class="header">Image</th>
            var thead_image = document.createElement("th");
            thead_image.className = "header";
            var thead_text = document.createTextNode("Image");
            thead_image.appendChild(thead_text);
            thead.prepend(thead_image);
        });
        var series_list = document.querySelectorAll("table#myTable > tbody > tr > td[class] > a");
        [].forEach.call(series_list, function(series) {
            var is_japanese = series.parentNode.querySelector("span.orgjp");
            if (!is_japanese) {
                series.parentNode.parentNode.remove();
            }
            else {
                series.parentNode.querySelector("span.orgjp").remove();
                series.style.paddingLeft = "10px";
                var tbody_image = document.createElement("td");
                tbody_image.style.width = "10%";
                var tbody_image_node = document.createElement("img");
                tbody_image_node.src = "https://www.novelupdates.com/img/noimagefound.jpg";
                tbody_image_node.className = "hover_thumb";
                tbody_image_node.onmouseover = function(e) {
                    const hover_div = document.getElementById("hoverUI");
                    var hover_div_image = document.createElement("img");
                    hover_div_image.src = tbody_image_node.src;
                    hover_div.append(hover_div_image);
                    hover_div_image.style.position = "absolute";
                    hover_div_image.style.zIndex = "100";
                    hover_div_image.style.maxHeight = window.innerHeight.toString() + "px";
                    hover_div_image.style.maxWidth = window.innerWidth.toString() + "px";
                    if (e.pageY + hover_div_image.clientHeight > window.scrollY + window.innerHeight) {
                        hover_div_image.style.top = (window.scrollY + window.innerHeight - hover_div_image.clientHeight).toString() + "px";
                    }
                    else {
                        hover_div_image.style.top = e.pageY.toString() + "px";
                    }
                    hover_div_image.style.left = (e.pageX + 5).toString() + "px";
                };
                tbody_image_node.onmouseout = function() {
                    const hover_div = document.getElementById("hoverUI");
                    while (hover_div.firstChild) {
                        hover_div.removeChild(hover_div.firstChild);
                    }
                };
                tbody_image.appendChild(tbody_image_node);
                series.parentNode.parentNode.prepend(tbody_image);
            }
        });
        [].forEach.call(series_list, async function(series) {
            await getUrlBody(series.href).then(function(nvl_response) {
                var tbody_image_node = series.parentNode.parentNode.querySelector("td > img");
                var cute_image = nvl_response.response.match(/\"https\:\/\/cdn\.novelupdates\.com\/images\/\d{4}\/\d{2}\/.+\.\w+\"/i);
                if (cute_image) {
                    tbody_image_node.src = cute_image[0].substring(1, cute_image[0].length - 1);
                }
            }, function(err) {
                console.log(err);
            });
        });
    }
})();

function getUrlBody(link) {
    return new Promise(function(resolve, reject) {
        GM.xmlHttpRequest({
            method: "GET",
            url: link,
            onload: function(response) {
                resolve(response);
            }
        });
        setTimeout(() => {
            reject(new Error("Request timed out."));
        }, 30000);
    });
}