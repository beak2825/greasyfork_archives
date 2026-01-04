// ==UserScript==
// @name         Nyaa增强
// @namespace    http://tampermonkey.net/
// @version      1.0.6
// @description  Nyaa去广告，直接复制链接，多选复制链接
// @author       Spark
// @license      MIT
// @match        https://sukebei.nyaa.si/*
// @match        https://nyaa.si/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=nyaa.si
// @grant        GM_addStyle
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/483000/Nyaa%E5%A2%9E%E5%BC%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/483000/Nyaa%E5%A2%9E%E5%BC%BA.meta.js
// ==/UserScript==

(function () {

    GM_addStyle(".detail-copy {color: #337ab7;cursor:pointer;}");
    GM_addStyle(".detail-copy:hover {color: #23527c;}")
    GM_addStyle(".detail-copy:hover span {text-decoration: underline;}")

    var selectors = ["#e71bf691-4eb4-453f-8f11-6f40280c18f6",
        "#ec01fd54-016b-41b4-bec9-b9b93f9b3b77",
        "#dd4ce992-766a-4df0-a01d-86f13e43fd61",
        "#e7a3ddb6-efae-4f74-a719-607fdf4fa1a1",
        "#ts_ad_video_za9ov",
        ".exo_wrapper",
    ];
    var querySelector = document.querySelector;

    function removeAd(e) {
        for (var selector of selectors) {
            removeBySelector(selector);
        }
        document.querySelector = function () {
            return {}
        };
    }

    function hideAd() {
        for (var selector of selectors) {
            GM_addStyle(selector + "{display:none!important;}");
        }
    }

    GM_addStyle("tr.checked { background-color: #CECECE!important;}");

    hideAd();
    var target = document.body;
    // var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
    var observer = new MutationObserver(function (e) {
        // removeAd(e);
        openInNewTab();
    });
    var observerConfig = {
        childList: true,
        subtree: true
    }
    observer.observe(target, observerConfig);

    function removeBySelector(selector) {
        var dom = querySelector.call(document, selector);
        dom && dom.remove();
    }

    function openInNewTab() {
        var links = [];
        links.push(...document.querySelectorAll("tr td:nth-child(2) a:not(.comments)"))

        links.push(...document.querySelectorAll("#torrent-description a"));
        // 评论区链接
        links.push(...document.querySelectorAll("#comments a"));
        for (var link of links) {
            link.setAttribute("target", "_blank");
        }
    }

    var addCopyButtonOnDetailPageFlag = false;
    function addCopyButtonOnDetailPage() {
        if (addCopyButtonOnDetailPageFlag) return;
        var panel = document.querySelector(".panel-footer");
        if (!panel) return;
        panel.appendChild(new Text(" or "));
        var span = document.createElement("span");
        span.addEventListener("click", function (e) {
            var a = this.parentNode.querySelector("a:nth-child(2)");
            GM_setClipboard(a.href, { type: "text", mimetype: "text/plain" });
            console.log(a.href);
            toast("已复制");
        });
        span.classList.add("detail-copy");
        span.innerHTML = "<i class='fa fa-clipboard'></i> <span>Copy</span>"
        panel.appendChild(span);
        addCopyButtonOnDetailPageFlag = true;
    }
    addCopyButtonOnDetailPage();

    // 添加多选
    var magnets = [];
    function addCheckbox() {
        // 添加th
        var th = document.createElement("th");
        th.classList.add("text-center");
        var selectAll = document.createElement("input")
        selectAll.type = "checkbox";
        selectAll.id = "selectAll";

        // 全选/取消全选
        selectAll.addEventListener("change", function (e) {
            var checkboxs = document.querySelectorAll("input[type='checkbox'][data-magnet]");
            magnets = [];
            checkboxs.forEach(box => {
                box.checked = this.checked;
                if (this.checked) {
                    box.setAttribute("checked", "checked");
                    magnets.push(box.dataset.magnet);
                    $("tbody tr").addClass("checked");
                } else {
                    box.removeAttribute("checked");
                    $("tbody tr").removeClass("checked");
                }
            })
        });

        th.appendChild(selectAll);

        var copy = document.createElement("span");
        var i = document.createElement("i");
        i.setAttribute("class", "fa fa-clipboard");
        copy.appendChild(i);
        copy.classList.add("detail-copy");
        copy.style.marginLeft = "5px";
        copy.addEventListener("click", function () {
            if (magnets.length == 0) {
                toast("未选中任何条目");
                return;
            }
            var copyStr = magnets.join("\n");
            GM_setClipboard(copyStr);
            toast("已复制选中条目链接");
        })
        th.appendChild(copy);

        var after = document.querySelector("th.hdr-size");
        if (after != null) {
            after.parentNode.insertBefore(th, after);
        }

        // 为每行添加checkbox
        var tds = document.querySelectorAll("tr td:nth-child(3)");
        for (var td of tds) {
            var checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            var index = td.parentNode.children[2].children.length - 1;
            var magnet = td.parentNode.children[2].children[index].href;
            checkbox.dataset.magnet = magnet;

            checkbox.addEventListener("change", function (e) {
                console.log("change");
                var magnet = this.dataset.magnet;
                if (this.checked) {
                    this.setAttribute("checked", "checked")
                    magnets.push(magnet);
                } else {
                    this.removeAttribute("checked");
                    var index = magnets.indexOf(magnet);
                    if (index != -1) {
                        magnets.splice(index, 1);
                    }
                }
                console.log($(this).closest("tr"));
                $(this).closest("tr").toggleClass("checked");
                var allCheckboxSize = document.querySelectorAll("input[type='checkbox'][data-magnet]").length;
                var checkedCheckboxSize = document.querySelectorAll("input[type='checkbox'][data-magnet][checked='checked']").length;

                if (allCheckboxSize == checkedCheckboxSize && checkedCheckboxSize != 0) {
                    selectAll.checked = true;
                } else {
                    selectAll.checked = false;
                }
            });

            var appendTd = document.createElement("td");
            appendTd.classList.add("text-center");
            appendTd.appendChild(checkbox);
            td.parentNode.insertBefore(appendTd, td.parentNode.children[3]);

            // 在checkbox右边添加copy按钮
            var span = document.createElement("span");
            var icon = document.createElement("i");
            icon.setAttribute("class", "fa fa-clipboard");
            span.appendChild(icon);
            span.classList.add("detail-copy");
            span.addEventListener("click", function (e) {
                if (magnets.length != 0) {
                    var copyStr = magnets.join("\n");
                    GM_setClipboard(copyStr);
                    toast("已复制选中条目链接");
                    return;
                }
                var a = this.parentNode.previousElementSibling.querySelector("a:last-child");
                GM_setClipboard(a.href, { type: "text", mimetype: "text/plain" });
                console.log(a.href);
                toast("已复制");
            });
            span.style.marginLeft = "5px";
            appendTd.appendChild(span);
        }
    }

    addCheckbox();

    function toast(msg) {
        var toastSpan = document.createElement("span");
        toastSpan.style.top = "45%";
        toastSpan.style.left = "50%";
        toastSpan.style.color = "#fff";
        toastSpan.style.position = "fixed";
        toastSpan.style.borderRadius = "4px"
        toastSpan.style.padding = "8px 16px"
        toastSpan.style.background = "rgba(0,0,0,0.3)";
        toastSpan.style.transform = "translate(-50%, -50%)";
        toastSpan.style.transition = "opacity .3s"
        toastSpan.style.opacity = "1";
        toastSpan.innerText = msg;
        document.body.appendChild(toastSpan);
        setTimeout(function () {
            toastSpan.style.opacity = "0";
            setTimeout(function () {
                toastSpan.remove(toastSpan);
            }, 300);
        }, 1200);
    }
})();