// ==UserScript==
// @name         Joyreactor.cc Infinite Scroll
// @namespace    wabov82916.joyreactor.cc.infinite.scroll
// @version      1.01
// @description  Joyreactor.cc Infinite Scroll and some CSS modification for better mobile user experience
// @author       You
// @match        http://joyreactor.cc/*
// @match        http://*.reactor.cc/*
// @match        http://pornreactor.cc/*
// @grant        unsafeWindow
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js
// @icon         http://joyreactor.cc/favicon.ico
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/408731/Joyreactorcc%20Infinite%20Scroll.user.js
// @updateURL https://update.greasyfork.org/scripts/408731/Joyreactorcc%20Infinite%20Scroll.meta.js
// ==/UserScript==

/* global $, jQuery */
(function() {
    'use strict';

    function GM_addStyle(css) {
        const style = document.getElementById("GM_addStyleBy8626") || (function() {
            const style = document.createElement('style');
            style.type = 'text/css';
            style.id = "GM_addStyleBy8626";
            document.head.appendChild(style);
            return style;
        })();
        const sheet = style.sheet;
        sheet.insertRule(css, (sheet.rules || sheet.cssRules || []).length);
    }

    var isMobile = false; //initiate as false
    // device detection
    if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent)
       || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0,4))) {
        isMobile = true;
    }

    if (isMobile) {
        GM_addStyle( `
            .commentnum {
                font-size: 30px;
                line-height: 74px !important;
            }
        `);
        GM_addStyle( `
            .article .post_content_expand,
            #tagArticle .post_content_expand {
                height: 150px;
            }
        `);
        GM_addStyle( `
            .article .post_content_expand span,
            #tagArticle .post_content_expand span {
                line-height: 150px;
            }
        `);
    }

    function recurringTweaks() {
        var infiniteLoadingGif = "<div class='infinite-loading' style='text-align:center; margin:0 auto; width:50%'><img src='https://i.imgur.com/NH1zQtD.gif'></img></div>";

        function isScrolledIntoView(elem) {
            var top_of_element = elem.offset().top;
            var bottom_of_element = elem.offset().top + elem.outerHeight();
            var bottom_of_screen = $(window).scrollTop() + $(window).innerHeight();
            var top_of_screen = $(window).scrollTop();

            if ((bottom_of_screen > top_of_element) && (top_of_screen < bottom_of_element)){
                return true;
            } else {
                return false
            }
        }

        var pathname = document.location.pathname;
        var currPage = parseInt($('#Pagination .next').attr("href").split("/").slice(-1)[0]);
        var requestNext = true;

        function getPagePath(pageNum) {
            var newPath = pathname.replace(/\/\d+/g, "");
            if (newPath.endsWith("/")) {
                return newPath + pageNum;
            } else {
                return newPath + "/" + pageNum;
            }
        }

        function appendPageItems(pageNum) {
            console.log('loading page: ', pageNum);
            var msg = '';
            $('<div>').load(getPagePath(pageNum), function(html, status) {
                console.log('status: ', status);
                if (status !== 'success') {
                    requestNext = false;
                    msg = 'Oops. There was an error while loading the next page items (page ' + pageNum + ').';
                    console.error(msg);
                    $('<div id="oops_error" style="text-align:center; color:red">' + msg + '<BR><a id="try_again_btn">Try again</a></div>').insertAfter('#catalog_products');
                    $('#try_again_btn').click(function() {
                    	$('#oops_error').remove();
                    	$('.infinite-loading').show();
                    	appendPageItems(pageNum);
                    });
                    $('div .catalog_browsing').show();
                } else if (html.indexOf('class="no-results"') > -1) {
                    console.log('not loaded: ', pageNum);
                    msg = 'No more items :(';
                    console.log(msg);
                    $('<div style="text-align:center">' + msg + '</div>').insertAfter('#catalog_products');
                } else {
                    var posts = $(html).find(".postContainer");
                    $('#post_list').append(posts);
                    requestNext = true;
                    currPage = currPage - 1;
                    console.log('loaded:', pageNum);

                    $(document).trigger("DOMUpdate");
                }

                $('.infinite-loading').hide();
            });
        }

        $('#Pagination').hide();
        $(infiniteLoadingGif).insertBefore('#Pagination');
        $('.infinite-loading').hide();

        $(window).scroll(function() {
            var back_top = $("#post_list > div").last();
            if (requestNext && isScrolledIntoView(back_top)) {
                $('.infinite-loading').show();
                requestNext = false;
                appendPageItems(currPage);
            }
        });
    }

    // load <script> inline to the page so it has access to jQuery "$" global vs TamperMonkey's alternative context
    if (!document.getElementById("hijax")) {
        var hijaxScript = document.createElement("script");
        hijaxScript.setAttribute("id", "hijax");
        hijaxScript.innerHTML = recurringTweaks.toString() + "\r\nrecurringTweaks();";
        document.head.appendChild(hijaxScript);
    }

})();