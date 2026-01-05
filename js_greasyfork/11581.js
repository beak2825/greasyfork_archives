// ==UserScript==
// @name         Pixiv navigation
// @version      0.0.12
// @description  "something useful"
// @author       Me
// @match        http://www.pixiv.net/*
// @grant        none
// @namespace    https://greasyfork.org/users/6644
// @downloadURL https://update.greasyfork.org/scripts/11581/Pixiv%20navigation.user.js
// @updateURL https://update.greasyfork.org/scripts/11581/Pixiv%20navigation.meta.js
// ==/UserScript==

function main() {
    var pathname = window.location.pathname;
    var search = window.location.search;
    if(pathname.search('/bookmark_new_illust.php') === 0 || (pathname.search('/member_illust.php') === 0 && search.search('illust_id') === -1) || pathname.search('/search.php') === 0) {
        new_illustrations_module();
    }
    else if(pathname.search('/member_illust.php') === 0) {
        illustration_module();
    }

    function illustration_module() {
        /*var thumb = jQ('._layout-thumbnail');
        thumb.removeClass('_layout-thumbnail');
        
        jQ(window).keypress(function(event) {
            var key = event.keyCode ? event.keyCode : event.which;
            
            if(key === 120) {
                thumb.trigger('click');
            }
        });*/
    }

    function new_illustrations_module() {
        var images = jQ('.image-item');
        var results = makeIterator(images);

        var activeResult;

        function toggleActive(newResult) {
            if(activeResult) {
                deactivate(activeResult);
            }

            activeResult = newResult;

            activate(newResult);
        }

        function activate(elem) {
            var props = {
                'border-width'  : '2px',
                'border-color'  : '#258fb8',
                'border-style'  : 'solid',
                'border-radius' : '4px',
                'margin'        : '3px 3px -5px 3px'
            };
            elem.css(props);

            elem.find('.work').css('padding-top', '5px');
        }

        function deactivate(elem) {
            elem.removeAttr('style');
            elem.find('.work').removeAttr('style');
        }

        function isElementInViewport (el) {
            var rect = el.getBoundingClientRect();

            return (
                rect.top >= 0 &&
                rect.left >= 0 &&
                rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && /*or $(window).height() */
                rect.right <= (window.innerWidth || document.documentElement.clientWidth) /*or $(window).width() */
            );
        }

        function makeIterator(array, start) {
            var index = start || -1;

            return {
                next: function() {
                    return index < array.length - 1 ? {value : array[++index], end : false} : {end : true};
                },
                prev: function() {
                    return index > 0 ? {value : array[--index], end : false} : {end : true };
                }
            }
        }

        function getCurrentPage() {
            var matches = location.href.match(/p=(\d+)/);
            return matches ? Number(matches[1]) : 1;
        }

        function updateQueryString(key, value, options) {
            if (!options) options = {};

            var url = options.url || location.href;
            var re = new RegExp("([?&])" + key + "=.*?(&|#|$)(.*)", "gi"), hash;

            hash = url.split('#');
            url = hash[0];
            if (re.test(url)) {
                if (typeof value !== 'undefined' && value !== null) {
                    url = url.replace(re, '$1' + key + "=" + value + '$2$3');
                } else {
                    url = url.replace(re, '$1$3').replace(/(&|\?)$/, '');
                }
            } else if (typeof value !== 'undefined' && value !== null) {
                var separator = url.indexOf('?') !== -1 ? '&' : '?';
                url = url + separator + key + '=' + value;
            }

            if ((typeof options.hash === 'undefined' || options.hash) &&
                typeof hash[1] !== 'undefined' && hash[1] !== null)
                url += '#' + hash[1];
            return url;
        }

        jQ(window).keypress(function(e) {
            var key = e.keyCode ? e.keyCode : e.which;

            if(key === 107) {
                var prev = results.prev();
                if(!prev.end) {
                    toggleActive(jQ(prev.value));
                    if(!isElementInViewport(activeResult[0])) {
                        activeResult[0].scrollIntoView(true);
                    }
                }
                else if(!activeResult) {
                    results = makeIterator(images, 20);
                    prev = results.prev();
                    toggleActive(jQ(prev.value));
                    if(!isElementInViewport(activeResult[0])) {
                        activeResult[0].scrollIntoView(true);
                    }
                                        
                }
                else if(getCurrentPage() > 1) {
                    location.href = updateQueryString('p', getCurrentPage() - 1);
                }
            }
            else if(key === 106) {
                var next = results.next();
                if(!next.end) {
                    toggleActive(jQ(next.value));
                    if(!isElementInViewport(activeResult[0])) {
                        activeResult[0].scrollIntoView(false);
                    }
                }
                else {
                    location.href = updateQueryString('p', getCurrentPage() + 1);
                }
            }
            else if((key === 13 || key === 10) && activeResult) {
                var url = activeResult.find('.work').attr('href');

                if(url) {
                    if(e.ctrlKey) {
                        window.open(url, '_blank');
                    }
                    else {
                        location.href = url;
                    }
                }
            }
        });
    }
}

addJQuery(main);

function addJQuery(callback) {
    var script = document.createElement("script");
    script.setAttribute("src", "//ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js");
    script.addEventListener('load', function() {
        var script = document.createElement("script");
        script.textContent = "window.jQ=jQuery.noConflict(true);(" + callback.toString() + ")();";
        document.body.appendChild(script);
    }, false);
    document.body.appendChild(script);
}