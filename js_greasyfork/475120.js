// ==UserScript==
// @name         ThreadScroll
// @namespace    https://greasyfork.org/ru/users/1142494-llimonix
// @version      0.5
// @description  Бесконечный контент в темах
// @author       llimonix
// @license MIT
// @match        https://zelenka.guru/threads/*
// @match        http://zelenka.guru/threads/*
// @icon         https://i.imgur.com/ZiddNv0.png
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/475120/ThreadScroll.user.js
// @updateURL https://update.greasyfork.org/scripts/475120/ThreadScroll.meta.js
// ==/UserScript==

document.addEventListener("DOMContentLoaded", () => {
    let currentPageURL = $("a[rel='start']").attr("href");
    let pageC = parseInt($(".currentPage").text());
    let pagelast = parseInt($("nav > a:last").text());
    let currentURL = window.location.href;

    function checkURL() {
        let currentURLnew = window.location.href;
        if (currentURLnew != currentURL) {
            currentURL = currentURLnew;
            pageC = parseInt($(".currentPage").text());
            pagelast = parseInt($("nav > a:last").text());
        }
        requestAnimationFrame(checkURL);
    };

    checkURL();

    function updateURL(newURL) {
        window.history.pushState({ path: newURL }, '', newURL);
    }


    function doSomethingWhenScrolledToBottom() {
        if ($('.loadingContent').length == 0) {
            pageC += 1;
            $('.messageList').append(`<div class="Spinner spinner small loadingContent" style="background: center center rgb(39, 39, 39); padding: 0px 15px; border-style: none; border-radius: 10px; line-height: 34px; vertical-align: top; height: 40px; width: 200px; display: block; margin: 15px auto 15px;"><div class="bounce1 bounce"></div><div class="bounce2 bounce"></div><div class="bounce3 bounce"></div></div>`);
            XenForo.ajax(`https://zelenka.guru/${currentPageURL}page-${pageC}`, {}).then(function(data) {
                let contentThread = data.templateHtml;
                let parser = new DOMParser();
                contentThread = parser.parseFromString(contentThread, 'text/html');
                contentThread = $(contentThread).find('li.message');
                $(".Spinner").remove();
                $('.messageList').append(contentThread).xfActivate();
                if ($("a[href='" + `${currentPageURL}page-${pageC}` + "']").length != 0) {
                    let $links = $("a[href='" + `${currentPageURL}page-${pageC}` + "']");
                    $(".currentPage").removeClass("currentPage");
                    $links.addClass("currentPage");
                    updateURL(`https://zelenka.guru/${currentPageURL}page-${pageC}`);
                    let elementToCheck = document.getElementById(".currentPage");
                } else {
                    while ($("a[href='" + `${currentPageURL}page-${pageC}` + "']").length == 0) {
                        $(".PageNavNext").trigger("click");
                    }
                    let $links = $("a[href='" + `${currentPageURL}page-${pageC}` + "']");
                    $(".currentPage").removeClass("currentPage");
                    $links.addClass("currentPage");
                    updateURL(`https://zelenka.guru/${currentPageURL}page-${pageC}`);
                    let elementToCheck = document.getElementById(".currentPage");
                }
            });
        }
    }

    $(window).scroll(function() {
        var documentHeight = $(document).height();
        var scrollPosition = $(window).scrollTop();
        var windowHeight = $(window).height();
        if (screen.width <= 480) {
            if (scrollPosition + windowHeight >= documentHeight - 150) {
                if (pageC < pagelast) {
                    doSomethingWhenScrolledToBottom();
                }
            }
        } else {
            if (scrollPosition + windowHeight >= documentHeight - 10) {
                if (pageC < pagelast) {
                    doSomethingWhenScrolledToBottom();
                }
            }
        }
    });
});
