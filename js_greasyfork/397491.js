// ==UserScript==
// @name            Бесплатный download.audiohero.com
// @name:en         Free download.audiohero.com
// @description     Бесплатная загрузка звуков с download.audiohero.com
// @description:en  Free download of sounds from download.audiohero.com
// @namespace    tuxuuman:audiohero:free
// @version      0.1
// @author       tuxuuman<tuxuuman@gmail.com>
// @match        https://download.audiohero.com*
// @grant        GM_openInTab
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/397491/%D0%91%D0%B5%D1%81%D0%BF%D0%BB%D0%B0%D1%82%D0%BD%D1%8B%D0%B9%20downloadaudioherocom.user.js
// @updateURL https://update.greasyfork.org/scripts/397491/%D0%91%D0%B5%D1%81%D0%BF%D0%BB%D0%B0%D1%82%D0%BD%D1%8B%D0%B9%20downloadaudioherocom.meta.js
// ==/UserScript==

(function() {

    function download(track, url) {
        GM_openInTab(url, { active: true});
    }

    unsafeWindow.sa.components.OptionsMenu = function(b) {
        if (b.tooltip == "Download") {
            let freeBtn = '<div class="download_format option"><div class="download_button fa fa-download fa-2x download_button_icon_container"><div class="image"></div></div><span class="download_format_description">Download free</span></div>';
            b.items.push({custom: $j(freeBtn), format: "mp3", type: "single", disabled: false, onClick: function() {
                var track = trackBank.find(b.itemId);
                if (track) {
                    if (track.file.playHtml5.indexOf('Expires=') > 0) {
                        download(track, track.file.playHtml5);
                    } else {
                        ajax("p=download_auth&source=track_list_explorer&trackId="+track.id, function(c){
                            download(track, track.file.playHtml5 + "?" + c[0].params);
                        });
                    }

                } else {
                    alert("track not found");
                }

            }})
        }

        function f() {
            d = !0;
            l.removeClass("showing");
            m.addClass("menu_showing");
            $j("body").append(l);
            e();
            setTimeout(function() {
                d && (l.addClass("showing"),
                      setTimeout(function() {
                    e()
                }, 200))
            }, 100);
            if (null != b.onShow)
                b.onShow(g);
            if (b.hideOnOutsideClick)
                $j(window).off("." + h).on("click." + h, function(b) {
                    $j(b.target).parents("." + h).length || (c(),
                                                             $j(window).off("." + h))
                })
        }
        function e() {
            var b = m.offset();
            l.css({
                top: Math.min(b.top, $j(window).height() + getScrollY() - l.height()),
                left: Math.max(0, b.left + m.outerWidth() - l.outerWidth())
            })
        }
        function c() {
            d = !1;
            l.removeClass("showing");
            setTimeout(function() {
                d || (l.detach(),
                      m.removeClass("menu_showing"))
            }, 250)
        }
        var g = this
        , d = !1
        , h = "options_menu_" + (new Date).getTime();
        b = $j.extend({
            items: [],
            hideOnMouseLeave: !1,
            hideOnOutsideClick: !1,
            anchorText: null,
            buttonAnchor: !1,
            customAnchor: null,
            itemId: null,
            iconClass: "fa-bars",
            tooltip: "",
            onShow: null
        }, b);
        b.items.length || console.warn("Attempt to create an options menu with no items", b);
        var k = sa.templates.get("options_menu");
        var l = k.get("options_menu", {
            itemId: b.itemId,
            iconClass: b.iconClass,
            tooltip: b.tooltip
        });
        l.addClass(h);
        var m = b.buttonAnchor ? k.get("anchor_as_button", {
            itemId: b.itemId,
            text: b.buttonAnchor,
            iconClass: b.iconClass,
            tooltip: b.tooltip
        }) : b.anchorText ? k.get("anchor_with_text", {
            itemId: b.itemId,
            text: b.anchorText,
            iconClass: b.iconClass,
            tooltip: b.tooltip
        }) : b.customAnchor ? b.customAnchor : k.get("anchor", {
            itemId: b.itemId,
            iconClass: b.iconClass,
            tooltip: b.tooltip
        });
        g.addItem = function(b) {
            if (b.heading) {
                var g = k.get("heading");
                g.html(b.name)
            } else {
                if (b.custom) {
                    if (!b.custom.length)
                        return;
                    g = b.custom;
                    g.addClass("option")
                } else
                    g = k.get("option"),
                        g.html(b.name);
                g.click(function(d) {
                    if (b.onClick)
                        b.onClick(b, g[0], d);
                    b.href && (b.href.match(/^[-_a-zA-Z0-9]+\.php/) ? document.location.href = b.href : setHash(b.href));
                    c()
                })
            }
            l.append(g);
            d && e()
        }
        ;
        for (var n = 0, p = b.items.length; n < p; n++)
            g.addItem(b.items[n]);
        m.add(l.find(".options_menu_close")).click(function(b) {
            d ? c() : f();
            b.preventDefault();
            b.stopPropagation()
        });
        b.items.length && b.items[0].heading && l.find(".heading:first").click(function() {
            c()
        });
        b.hideOnMouseLeave && l.mouseleave(function() {
            c()
        });
        g.getAnchor = function() {
            m.getContainer = function() {
                return l
            }
            ;
            return m
        }
    }
})();