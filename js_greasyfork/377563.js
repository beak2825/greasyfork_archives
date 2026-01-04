/*
 * Custom resize jQuery event for element version 1.0.1
 *
 * Copyright (c) 2018 Jakub Jankiewicz <http://jcubic.pl/me>
 * Released under the MIT license
 *
 * based on marcj/css-element-queries same license
 */

/* global jQuery, ResizeObserver */
(function($) {
    "use strict";
    // ----------------------------------------------------------------------------------
    // :: Cross-browser resize element plugin
    // :: Taken from ResizeSensor.js file from marcj/css-element-queries (MIT license)
    // :: updated by jQuery Terminal (same license)
    // :: usage:
    // :: to add callback use:
    // ::     $('node').resize(handler_function);
    // :: to remove use:
    // ::     $('node').resize('unbind', handler_function);
    // :: handler function in unbind is optional if omitted all handlers will be removed
    // ----------------------------------------------------------------------------------
   $.fn.resizer = function(callback) {
        var unbind = arguments[0] === "unbind";
        if (!unbind && !$.isFunction(callback)) {
            throw new Error(
                'Invalid argument, it need to a function or string "unbind".'
            );
        }
        if (unbind) {
            callback = $.isFunction(arguments[1]) ? arguments[1] : null;
        }
        return this.each(function() {
            var $this = $(this);
            var callbacks;
            if (unbind) {
                callbacks = $this.data('callbacks');
                if (callback && callbacks) {
                    callbacks.remove(callback);
                    if (!callbacks.has()) {
                        callbacks = null;
                    }
                } else {
                    callbacks = null;
                }
                if (!callbacks) {
                    $this.removeData('callbacks');
                    if (window.ResizeObserver) {
                        var observer = $this.data('observer');
                        if (observer) {
                            observer.unobserve(this);
                            $this.removeData('observer');
                        }
                    } else {
                        $this.find('.resizer').remove();
                    }
                }
            } else if ($this.data('callbacks')) {
                $this.data('callbacks').add(callback);
            } else {
                callbacks = $.Callbacks();
                callbacks.add(callback);
                $this.data('callbacks', callbacks);
                var resizer;
                var first = true;
                if (window.ResizeObserver) {
                    resizer = new ResizeObserver(function() {
                        if (!first) {
                            var callbacks = $this.data('callbacks');
                            callbacks.fireWith($this[0], $.Event('resize'));
                        }
                        first = false;
                    });
                    resizer.observe(this);
                    $this.data('observer', resizer);
                    return;
                }
                var self = this;
                resizer = $('<div/>').addClass('resizer').appendTo(this)[0];
                var style =
                    'position: absolute; left: 0; top: 0; right: 0; bottom: 0; ' +
                    'overflow: hidden; z-index: -1; visibility: hidden;';
                var styleChild = 'position: absolute; left: 0; top: 0; transition: 0s;';
                resizer.style.cssText = style;
                resizer.innerHTML =
                    '<div class="resize-sensor-expand" style="' + style + '">' +
                    '<div style="' + styleChild + '"></div>' + "</div>" +
                    '<div class="resize-sensor-shrink" style="' + style + '">' +
                    '<div style="' + styleChild + ' width: 200%; height: 200%"></div>' +
                    "</div>";

                var expand = resizer.childNodes[0];
                var expandChild = expand.childNodes[0];
                var shrink = resizer.childNodes[1];
                var dirty, rafId, newWidth, newHeight;
                var lastWidth = self.offsetWidth;
                var lastHeight = self.offsetHeight;

                var reset = function() {
                    expandChild.style.width = '100000px';
                    expandChild.style.height = '100000px';

                    expand.scrollLeft = 100000;
                    expand.scrollTop = 100000;

                    shrink.scrollLeft = 100000;
                    shrink.scrollTop = 100000;
                };

                reset();

                var onResized = function() {
                    rafId = 0;

                    if (!dirty) {
                        return;
                    }

                    lastWidth = newWidth;
                    lastHeight = newHeight;
                    callbacks.fireWith($this[0], $.Event('resize'));
                };

                var onScroll = function() {
                    newWidth = self.offsetWidth;
                    newHeight = self.offsetHeight;
                    dirty = newWidth !== lastWidth || newHeight !== lastHeight;

                    if (dirty && !rafId) {
                        rafId = requestAnimationFrame(onResized);
                    }

                    reset();
                };
                $(expand).on("scroll", onScroll);
                $(shrink).on("scroll", onScroll);
            }
        });
    };
    var window_events = $.Callbacks();
    // custom resize jQuery event with handling of default window resize
    $.event.special.resize = {
        setup: function(data, namespaces, eventHandle) {
            if (this === window) {
                window.addEventListener('resize', eventHandle);
            }
        },
        teardown: function() {
            window.removeEventListener('resize');
        },
        add: function(handleObj) {
            if (this === window) {
                window_events.add(handleObj.handler);
            } else {
                $(this).resizer(handleObj.handler);
            }
        },
        remove: function(handleObj) {
            if (this === window) {
                if (!handleObj.handler) {
                    window_events.empty();
                } else {
                    window_events.remove(handleObj.handler);
                }
            } else {
                $(this).resizer('unbind', handleObj.handler);
            }
        },
        handle: function(event, data) {
            window_events.fireWith(window, event, data);
        }
    };
})(jQuery);
