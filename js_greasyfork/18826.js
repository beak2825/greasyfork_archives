// ==UserScript==
// @name         OR
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  try to take over the world!
// @author       You
// @include      http://ol*/front/php/b/board_list.php?board_no=4*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/18826/OR.user.js
// @updateURL https://update.greasyfork.org/scripts/18826/OR.meta.js
// ==/UserScript==
(function() {
    document.addEventListener('DOMContentLoaded', function() {
        $('<button type="button" style="position:fixed;z-index:99999;bottom:0;left:0;width:calc(50% - 1px);height:10%;background-color:#000;color:#fff;text-align:center;">PREV</button>').bind('click', function() {
            $('.this').parents('li').prev('li').find('a').get(0).click();
        }).prependTo('body');
        $('<button type="button" style="position:fixed;z-index:99999;bottom:0;right:0;width:calc(50% - 1px);height:10%;background-color:#000;color:#fff;text-align:center;">NEXT</button>').bind('click', function() {
            $('.this').parents('li').next('li').find('a').get(0).click();
        }).prependTo('body');

        $('head').prepend('\
<style>/**/\
.displaynone {display:inline !important;}\
table * {display:inline;position:static !important;}\
\
caption,\
thead,\
tfoot,\
tbody a,\
tbody .comment,\
img[src*="icon"],\
table td:nth-child(1),\
table td:nth-child(2),\
table td:nth-child(3),\
table td:nth-child(5), \
table td:nth-child(6),\
table td:nth-child(7) {display:none;}\
/**/\
#header,\
.xans-board-title,\
.xans-board-paging,\
#footer,\
#quick {display:none;}\
#container {display:inline !important;}\
\
span[id*="afile_"] img {max-width:100% !important;min-width:auto !important;width:auto;height:auto !important;display:block;margin-bottom:40px !important;}\
</style>');
        BOARD.load_attached_image = function(sId, sFlag, iBoardNo) {
            var iBulletinNo = sId.substr(6, sId.length);
            var sRequestUrl = '/exec/front/Board/Get?no=' + iBulletinNo + '&board_no=' + iBoardNo;
            $.get(sRequestUrl, function(oResponse) {
                //if(!$('#'+sId+' *').length){
                $('#' + sId).append(oResponse.data.thumbnail_image);
                //}
            }, 'json');
        };
        (function($) {
            var window = this,
                options = {},
                content, currentUrl, nextUrl,
                active = false,
                defaults = {
                    autoLoad: true,
                    page: 1,
                    content: '.content',
                    link: 'a[rel=next]',
                    insertBefore: null,
                    appendTo: null,
                    start: function() {},
                    load: function() {},
                    disabled: false
                };
            $.autopager = function(_options) {
                var autopager = this.autopager;
                if (typeof _options === 'string' && $.isFunction(autopager[_options])) {
                    var args = Array.prototype.slice.call(arguments, 1),
                        value = autopager[_options].apply(autopager, args);
                    return value === autopager || value === undefined ? this : value;
                }
                _options = $.extend({}, defaults, _options);
                autopager.option(_options);
                content = $(_options.content).filter(':last');
                if (content.length) {
                    if (!_options.insertBefore && !_options.appendTo) {
                        var insertBefore = content.next();
                        if (insertBefore.length) {
                            set('insertBefore', insertBefore);
                        } else {
                            set('appendTo', content.parent());
                        }
                    }
                }
                setUrl();
                return this;
            };
            $.extend($.autopager, {
                option: function(key, value) {
                    var _options = key;
                    if (typeof key === "string") {
                        if (value === undefined) {
                            return options[key];
                        }
                        _options = {};
                        _options[key] = value;
                    }
                    $.each(_options, function(key, value) {
                        set(key, value);
                    });
                    return this;
                },
                enable: function() {
                    set('disabled', false);
                    return this;
                },
                disable: function() {
                    set('disabled', true);
                    return this;
                },
                destroy: function() {
                    this.autoLoad(false);
                    options = {};
                    content = currentUrl = nextUrl = undefined;
                    return this;
                },
                autoLoad: function(value) {
                    return this.option('autoLoad', value);
                },
                load: function() {
                    if (active || !nextUrl || options.disabled) {
                        return;
                    }
                    active = true;
                    options.start(currentHash(), nextHash());
                    $.get(nextUrl, insertContent);
                    return this;
                }
            });

            function set(key, value) {
                switch (key) {
                    case 'autoLoad':
                        if (value && !options.autoLoad) {
                            $(window).scroll(loadOnScroll);
                        } else if (!value && options.autoLoad) {
                            $(window).unbind('scroll', loadOnScroll);
                        }
                        break;
                    case 'insertBefore':
                        if (value) {
                            options.appendTo = null;
                        }
                        break;
                    case 'appendTo':
                        if (value) {
                            options.insertBefore = null;
                        }
                        break;
                }
                options[key] = value;
            }

            function setUrl(context) {
                //console.log('options.link: ', options.link);
                currentUrl = nextUrl || window.location.href;
                if (nextUrl) {
                    nextUrl = $(context).find('.this').parents('li').next('li').find('a').attr('href');
                } else {
                    nextUrl = $(options.link, context).attr('href');
                }
                console.log('nextUrl', nextUrl);
            }

            function loadOnScroll() {
                if (content.offset().top + content.height() < $(document).scrollTop() + $(window).height()) {
                    $.autopager.load();
                }
            }

            function insertContent(res) {
                var _options = options,
                    nextPage = $('<div/>').append(res.replace(/<script(.|\s)*?\/script>/g, "")),
                    nextContent = nextPage.find(_options.content);
                set('page', _options.page + 1);
                setUrl(nextPage);
                if (nextContent.length) {
                    if (_options.insertBefore) {
                        nextContent.insertBefore(_options.insertBefore);
                    } else {
                        nextContent.appendTo(_options.appendTo);
                    }
                    _options.load.call(nextContent.get(), currentHash(), nextHash());
                    content = nextContent.filter(':last');
                }
                active = false;
            }

            function currentHash() {
                return {
                    page: options.page,
                    url: currentUrl
                };
            }

            function nextHash() {
                return {
                    page: options.page + 1,
                    url: nextUrl
                };
            }
        })(jQuery);
        $.autopager({
            content: 'tbody',
            link: $('.this').parents('li').next('li').find('a'),
            autoLoad: true,
            start: function(current, next) {},
            load: function(current, next) {}
        });
    });
    document.addEventListener('DOMNodeInserted', function() {
        $('img[alt="파일첨부"]').each(function() {
            $(this).removeAttr('alt');
            $(this).trigger('mouseover');
        });
    });
})();