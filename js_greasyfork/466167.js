

// ==UserScript==
// @name        Kenmei+
// @description Simple Kenmei.co QoL improvements. More for personal use but if anyone wants to use it they can.
// @author      Totem#0001
// @match       *://*.kenmei.co/*
// @run-at      document-end
// @version     1.9.7
// @grant       none
// @license     Creative Commons Attribution 4.0 International Public License; http://creativecommons.org/licenses/by/4.0/
// @require     http://code.jquery.com/jquery-3.4.1.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/js-cookie/3.0.5/js.cookie.min.js
// @namespace   https://greasyfork.org/users/1078112
// @downloadURL https://update.greasyfork.org/scripts/466167/Kenmei%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/466167/Kenmei%2B.meta.js
// ==/UserScript==

(function() {
    'use strict'
    var $ = window.jQuery;
    var Cookies = window.Cookies;

    // Load Check
    if (Cookies.get("view-state")) {
        if (Cookies.get("view-state") == "dark") {
            $('html')[0].classList.add("dark")
        } else {
            $('html')[0].className = ""
        }
    } else {
        Cookies.set("view-state","light", { expires: 7, path: '' })
    }

    var checkwin = setInterval(function(){
        var location = window.location.href.toString()
        if (location.indexOf('dashboard') !== -1) {
            function makeid(length) {
                let result = '';
                const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
                const charactersLength = characters.length;
                let counter = 0;
                while (counter < length) {
                    result += characters.charAt(Math.floor(Math.random() * charactersLength));
                    counter += 1;
                }
                return result;
            }

            let read_class = makeid(5)
            let open_class = makeid(5)
            let popup_class = makeid(5)
            let ok_class = makeid(5)
            let content_class = makeid(5)
            let view_toggle_class = makeid(5)

            function waitForElm(selector) {
                return new Promise(resolve => {
                    if (document.querySelector(selector)) {
                        return resolve(document.querySelector(selector));
                    }
                    const observer = new MutationObserver(mutations => {
                        if (document.querySelector(selector)) {
                            resolve(document.querySelector(selector));
                            observer.disconnect();
                        }
                    });

                    observer.observe(document.body, {
                        childList: true,
                        subtree: true
                    });
                });
            }

            waitForElm('div.sm_flex:nth-child(2)').then((elm) => {
                var header_holder = $('.space-x-3')[0]
                var add = $('.bg-blue-600')[0]

                var open_button = '<span data-v-7cd3fa72="" class="' + open_class + ' ml-3 inline-flex rounded-md shadow-sm"><button data-v-106a9a2b="" data-v-6cb82c25="" type="button" class="btn-primary btn-md"><svg class="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="20px" height="20px" viewBox="0 0 20 20" version="1.1" fill="currentColor"><path style=" stroke:none;fill-rule:nonzero;fill:currentColor;fill-opacity:1;" d="M 7.972656 8.355469 C 7.5 8.21875 7.046875 8.101562 6.617188 8.003906 C 6.441406 7.445312 6.355469 6.859375 6.355469 6.273438 C 6.355469 3.710938 8 1.628906 10.03125 1.628906 C 12.0625 1.628906 13.710938 3.707031 13.710938 6.269531 C 13.710938 6.828125 13.632812 7.390625 13.46875 7.921875 C 12.9375 8.035156 12.367188 8.179688 11.761719 8.355469 C 10.902344 8.605469 10.207031 8.855469 9.867188 8.980469 C 9.523438 8.855469 8.832031 8.605469 7.972656 8.355469 Z M 2.972656 11.671875 C 1.785156 11.671875 0.816406 12.640625 0.816406 13.828125 C 0.816406 15.019531 1.785156 15.984375 2.972656 15.984375 C 4.164062 15.984375 5.128906 15.019531 5.128906 13.828125 C 5.128906 12.636719 4.164062 11.671875 2.972656 11.671875 Z M 17.027344 11.671875 C 15.835938 11.671875 14.871094 12.640625 14.871094 13.828125 C 14.871094 15.019531 15.835938 15.984375 17.027344 15.984375 C 18.214844 15.984375 19.183594 15.019531 19.183594 13.828125 C 19.183594 12.636719 18.214844 11.671875 17.027344 11.671875 Z M 14.246094 13.828125 C 14.246094 12.730469 14.894531 11.734375 15.898438 11.289062 L 15.898438 8.257812 C 13.378906 8.257812 9.867188 9.652344 9.867188 9.652344 C 9.867188 9.652344 6.351562 8.257812 3.835938 8.257812 L 3.835938 11.183594 C 4.976562 11.558594 5.753906 12.625 5.753906 13.828125 C 5.753906 15.03125 4.976562 16.097656 3.835938 16.472656 L 3.835938 16.746094 C 6.351562 16.746094 9.867188 18.371094 9.867188 18.371094 C 9.867188 18.371094 13.382812 16.746094 15.898438 16.746094 L 15.898438 16.367188 C 14.894531 15.921875 14.246094 14.925781 14.246094 13.828125 Z M 14.246094 13.828125 "/></svg>Open Updated</button></span>'
                var read_button = '<span data-v-7cd3fa72="" class="' + read_class + '  ml-3 inline-flex rounded-md shadow-sm"><button data-v-106a9a2b="" data-v-6cb82c25="" type="button" class="btn-primary btn-md"><svg class="-ml-1 mr-2 h-5 w-5" data-v-bda35c80="" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" aria-hidden="true" class="h-5 w-5 opacity-50"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>Set all Latest</button></span>'
                var popup_modal = '<div data-v-2836fdb5="" data-v-6dfbf42f="" data-v-b8c2f6b4="" style="z-index: 1000; display: none;" class="' + popup_class + ' vfm vfm--inset vfm--fixed"><div data-v-2836fdb5="" class="vfm__overlay vfm--overlay vfm--absolute vfm--inset !bg-gray-500 !bg-opacity-75 !transition-opacity dark_!bg-gray-900 dark_!opacity-90"></div><div data-v-2836fdb5="" class="kenmei__container vfm__container vfm--absolute vfm--inset vfm--outline-none flex items-end justify-center min-h-screen p-4 text-center sm_items-center sm_p-0" aria-expanded="true" role="dialog" aria-modal="true" tabindex="-1" style=""><div data-v-2836fdb5="" class="UFJuR vfm__content sm_max-w-sm w-full"><div data-v-6dfbf42f="" data-v-2836fdb5-s="" class="modal-body"><div data-v-6dfbf42f="" data-v-2836fdb5-s="" class="bg-white px-4 pt-5 pb-4 sm_p-6 sm_pb-4 rounded-lg dark_bg-gray-800"><div data-v-6dfbf42f="" data-v-2836fdb5-s="" class="sm_flex sm_items-start"><div data-v-2836fdb5-s="" class="flex-col w-full"><div data-v-2836fdb5-s="" class="relative"><div data-v-47636cf4="" data-v-2836fdb5-s="" class="relative"><div data-v-7813ccc8="" data-v-47636cf4="" class="relative"><div data-v-44d9de5f="" data-v-7813ccc8=""><label data-v-44d9de5f="">😱<!----></label><div data-v-44d9de5f="" class="relative rounded-md shadow-sm mt-1"><!----></div><p data-v-44d9de5f="" class="mt-2 text-xs text-gray-500 dark_text-gray-300">No available updated series. <br>Time to wait...</p></div></div></div></div></div></div><br><button data-v-106a9a2b="" data-v-2836fdb5-s="" type="button" class="' + ok_class + ' btn-primary btn-md">Ok</button></div></div><!--v-if--></div></div></div>'
                function init() {
                    // Load Check
                    if (Cookies.get("view-state")) {
                        if (Cookies.get("view-state") == "dark") {
                            $('html')[0].classList.add("dark")
                        }
                    } else {
                        Cookies.set("view-state","light", { expires: 7, path: '' })
                    }

                    if (window.location.pathname == "/dashboard") {
                        if ($(window).width() < 1024) {
                            $(open_button).appendTo($(header_holder).children()[1])
                            $(read_button).appendTo($(header_holder).children()[1])
                            $(popup_modal).appendTo($('.vfm.vfm--inset.vfm--fixed')[0])
                        } else {
                            $(read_button).insertAfter($(header_holder).children()[1])
                            $(open_button).insertAfter($(header_holder).children()[1])
                            $(popup_modal).insertAfter($('.vfm.vfm--inset.vfm--fixed')[0])
                        }
                        var open_elm = $('.' + open_class)[0]
                        var read_elm = $('.' + read_class)[0]
                        var popup_elm = $('.' + popup_class)[0]
                        var ok_button = $('.' + ok_class)[0]
                        var popup_con = $('.' + content_class)[0]

                        // Delete upgrade button
                        var profile_holder = $('.profile > div:nth-child(1)')[0]
                        var toggle_view = '<div data-v-f2285a77="" class="' + view_toggle_class + ' shrink-0"><button data-v-106a9a2b="" data-v-ff742001="" type="button" class="btn-upgrade btn-xs"> <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-moon" viewBox="0 0 16 16"><path d="M6 .278a.768.768 0 0 1 .08.858 7.208 7.208 0 0 0-.878 3.46c0 4.021 3.278 7.277 7.318 7.277.527 0 1.04-.055 1.533-.16a.787.787 0 0 1 .81.316.733.733 0 0 1-.031.893A8.349 8.349 0 0 1 8.344 16C3.734 16 0 12.286 0 7.71 0 4.266 2.114 1.312 5.124.06A.752.752 0 0 1 6 .278zM4.858 1.311A7.269 7.269 0 0 0 1.025 7.71c0 4.02 3.279 7.276 7.319 7.276a7.316 7.316 0 0 0 5.205-2.162c-.337.042-.68.063-1.029.063-4.61 0-8.343-3.714-8.343-8.29 0-1.167.242-2.278.681-3.286z"></path></svg> &nbsp Toggle Dark-Mode </button></div> '

                        var html_elm = $('html')[0]
                        if (!$('.' + view_toggle_class)[0]) {
                            profile_holder.outerHTML = toggle_view + profile_holder.outerHTML
                        }
                        var toggle_elm = $('.' + view_toggle_class)[0]
                        if ($('.button--link')[0]) {
                            $('.button--link')[0].remove()
                        }

                        toggle_elm.addEventListener('click', function(e){
                            if (html_elm.classList.contains("dark")) {
                                html_elm.classList.remove("dark");
                                Cookies.set("view-state","light")
                            } else {
                                html_elm.classList.add("dark");
                                Cookies.set("view-state","dark")
                            }
                        });

                        document.addEventListener('click', function(e){
                            if ($(popup_elm).is(':visible')) {
                                if (!$(popup_con)[0].contains(e.target)){
                                    if (!$(open_elm)[0].contains(e.target)){
                                        popup_elm.style.display = 'none'
                                    }
                                }
                            }
                        });

                        ok_button.addEventListener('click', function(e){
                            if ($(popup_elm).is(':visible')) {
                                popup_elm.style.display = 'none'
                            }
                        });

                        open_elm.addEventListener("click", function () {
                            var updated = 0;
                            waitForElm('.series-link').then((elme) => {
                                var series_holder = $('.divide-y.divide-gray-200.dark_divide-gray-700');
                                var children = series_holder.children();
                                for (var i = 0; i < children.length; i++) {
                                    elme = $('.series-link')[i];
                                    var tableChild = $(children[i]);
                                    if ($($($(tableChild)[0].firstChild.firstChild).children('span')).children('.unread-indicator').length > 0) {
                                        updated = updated + 1;
                                        console.log(elme.firstChild.wholeText + ' is unread');

                                        var chapter_button = $(tableChild).find('.col-span-2.inline-block.mt-2.mr-1.lg_m-0.lg_block')[0].firstChild;
                                        var latest_chapter = $(tableChild).find('.col-span-2.inline-block.lg_block')[1].firstChild;

                                        var chapter_text = chapter_button.innerText.replace('Ch. ', '');
                                        var latest_chapter_text = latest_chapter.innerText.replace('Ch. ', '');

                                        if (chapter_button.href === "") {
                                            var name = $(chapter_button.parentElement.parentElement).children()[0].firstChild.innerText;
                                            alert(name + ' chapter not found. If the bookmarked chapter is grayed out, that is why.');
                                        } else {
                                            var cur_chapter = parseFloat(chapter_text);
                                            var lat_chap = parseFloat(latest_chapter_text);
                                            var eq = lat_chap - cur_chapter;

                                            if (eq === 1 || eq === 0.1) {
                                                latest_chapter.firstChild.click();
                                            } else {
                                                chapter_button.click();
                                            }
                                        }
                                    }
                                }
                                if (updated === 0) {
                                    popup_elm.style.display = 'block';
                                    updated = 0;
                                }
                            });
                        });


                        if ($(window).width() < 1024) {
                            read_elm.addEventListener("click",function(){
                                waitForElm('.series-link').then((elme) => {
                                    var series_holder = $('.divide-y.divide-gray-200.dark_divide-gray-700')
                                    var children = series_holder.children();
                                    for (var i = 0; i < children.length; i++) {
                                        elme = $('.series-link')[i]
                                        var tableChild = $(children[i]);
                                        if ($($($(tableChild)[0].firstChild.firstChild).children('span')).children('.unread-indicator').length > 0) {
                                            console.log(elme.firstChild.wholeText + ' is unread')
                                            $('li.transition > a:nth-child(1) > div:nth-child(1) > div:nth-child(4) > div:nth-child(1) > div:nth-child(3) > div:nth-child(1) > div:nth-child(1) > a:nth-child(1)')[i].click()
                                        }
                                    }
                                });
                            });
                        } else {
                            read_elm.addEventListener("click",function(){
                                waitForElm('.series-link').then((elme) => {
                                    var series_holder = $('.divide-y.divide-gray-200.dark_divide-gray-700')
                                    var children = series_holder.children();
                                    for (var i = 0; i < children.length; i++) {
                                        elme = $('.series-link')[i]
                                        var tableChild = $(children[i]);
                                        if ($($($(tableChild)[0].firstChild.firstChild).children('span')).children('.unread-indicator').length > 0) {
                                            console.log(elme.firstChild.wholeText + ' is unread')
                                            $($($($(tableChild)[0].firstChild.firstChild).children('.actions'))[0].firstChild.firstChild).children()[0].click()
                                        }
                                    }
                                });
                            });
                        }
                    }
                }

                init()
            });
            clearInterval(checkwin)
        }
    }, 250)
})();
