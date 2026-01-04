// ==UserScript==
// @name         萌娘百科
// @namespace    https://xzonn.top/
// @version      0.0.7
// @description  用于萌娘百科。
// @author       Xzonn
// @match        https://zh.moegirl.org.cn/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/427200/%E8%90%8C%E5%A8%98%E7%99%BE%E7%A7%91.user.js
// @updateURL https://update.greasyfork.org/scripts/427200/%E8%90%8C%E5%A8%98%E7%99%BE%E7%A7%91.meta.js
// ==/UserScript==
/* global mw, $ */

document.body.onload = function() {
    'use strict';
    if (window.mw && !window.xzMwLoaded) {
        // mw.loader.load('https://zh.moegirl.org.cn/User:AnnAngela/js/SendWelcomeMessage.js?action=raw&ctype=text/javascript');
        mw.loader.load('https://zh.moegirl.org.cn/MediaWiki:Group-sysop.js?action=raw&ctype=text/javascript');
        if (!mw.util) {
            mw.loader.load('https://wiki.biligame.com/twewy/load.php?debug=false&lang=zh&modules=mediawiki.util&skin=vector')
        }
        mw.loader.load('https://wiki.biligame.com/twewy/load.php?debug=false&lang=zh&modules=ext.gadget.Common|ext.gadget.PopupsSupport|ext.gadget.Popups|ext.gadget.HotCat&skin=vector');
        $("#pt-mycontris > a").append(" (" + mw.config.get("wgUserEditCount") + ")");
        $("<style/>").html([
            "https://zh.moegirl.org.cn/MediaWiki:Group-sysop.css?action=raw&ctype=text/css"
        ].map(x => "@import url(\"" + x + "\");").join("\n")).appendTo($("head"));

        (function () {
            var defaultStyle = {
                purple: {
                    labelColor: " ", //anti check
                    labelBackgroundColor: "#9070c0",
                    labelBorderColor: "#b090e0 #7050a0 #9070c0 #b090e0",
                    labelPadding: ".2em .3em .2em .3em",
                    textBorderColor: "#9070c0",
                    textBackgroundColor: "#f0edf5",
                    textPadding: "1em"
                },
                green: {
                    labelColor: " ",
                    labelBackgroundColor: "#75c045",
                    labelBorderColor: "#90d060 #60b030 #75c045 #90d060",
                    labelPadding: ".2em .3em .2em .3em",
                    textBorderColor: "#75c045 #60b030 #60b030 #75c045",
                    textBackgroundColor: "#f5fffa",
                    textPadding: "1em"
                },
                red: {
                    labelColor: " ",
                    labelBackgroundColor: "#FF0000",
                    labelBorderColor: "#FF8888 #CC0000 #FF0000 #FF8888",
                    labelPadding: ".2em .3em .2em .3em",
                    textBorderColor: "#FF0000 #CC0000 #CC0000 #FF0000",
                    textBackgroundColor: "#fffafa",
                    textPadding: "1em"
                },
                blue: {
                    labelColor: " ",
                    labelBackgroundColor: "#5b8dd6",
                    labelBorderColor: "#88abde #3379de #5b8dd6 #88abde",
                    labelPadding: ".2em .3em .2em .3em",
                    textBackgroundColor: "#f0f8ff",
                    textBorderColor: "#5b8dd6 #3379de #3379de #5b8dd6",
                    textPadding: "1em"
                },
                yellow: {
                    labelColor: " ",
                    labelBackgroundColor: "#ffe147",
                    labelBorderColor: "#ffe977 #ffd813 #ffe147 #ffe977",
                    labelPadding: ".2em .3em .2em .3em",
                    textBackgroundColor: "#fffce8",
                    textBorderColor: "#ffe147 #ffd813 #ffd813 #ffe147",
                    textPadding: "1em"
                },
                orange: {
                    labelColor: " ",
                    labelBackgroundColor: "#ff9d42",
                    labelBorderColor: "#ffac5d #ff820e #ff9d42 #ffac5d",
                    labelPadding: ".2em .3em .2em .3em",
                    textBackgroundColor: "#ffeedd",
                    textBorderColor: "#ff9d42 #ff820e #ff820e #ff9d42",
                    textPadding: "1em"
                },
                black: {
                    labelColor: " ",
                    labelBackgroundColor: "#7f7f7f",
                    labelBorderColor: "#999999 #4c4c4c #7f7f7f #999999",
                    labelPadding: ".2em .3em .2em .3em",
                    textBackgroundColor: "#e5e5e5",
                    textBorderColor: "#7f7f7f #4c4c4c #4c4c4c #7f7f7f",
                    textPadding: "1em"
                }
            };
            var sides = {
                top: {
                    className: "tabLabelTop",
                    labelColorSide: "top",
                    labelBorderSide: ["left", "right"],
                    labelColorSideReverse: "bottom",
                    dividerSizeType: "height"
                },
                bottom: {
                    className: "tabLabelBottom",
                    labelColorSide: "bottom",
                    labelBorderSide: ["left", "right"],
                    labelColorSideReverse: "top",
                    dividerSizeType: "height"
                },
                left: {
                    className: "tabLabelLeft",
                    labelColorSide: "left",
                    labelBorderSide: ["top", "bottom"],
                    labelColorSideReverse: "right",
                    dividerSizeType: "width"
                },
                right: {
                    className: "tabLabelRight",
                    labelColorSide: "right",
                    labelBorderSide: ["top", "bottom"],
                    labelColorSideReverse: "left",
                    dividerSizeType: "width"
                }
            };
            var truthy = ["1", "on", "true", "yes"];
            $("body").addClass("tab");
            function getOwnPropertyNamesLength(obj) {
                return Object.getOwnPropertyNames(obj).length;
            }
            function toLowerFirstCase(str) {
                return str.substring(0, 1).toLowerCase() + str.substring(1);
            }
            function toUpperFirstCase(str) {
                return str.substring(0, 1).toUpperCase() + str.substring(1);
            }
            function tabs(content) {
                console.log(new Date());
                content.find(".Tabs").each(function () {
                    var self = $(this);
                    if (self.children(".TabLabel")[0]) {
                        return true;
                    }
                    var classList = Array.from(this.classList).filter(function (n) {
                        return n in defaultStyle;
                    });
                    var data = $.extend({
                        labelPadding: "2px",
                        labelBorderColor: "#aaa",
                        labelColor: "green",
                        labelBackgroundColor: $("#content").css("background-color"),
                        textPadding: "20px 30px",
                        textBorderColor: "#aaa",
                        textBackgroundColor: "white",
                        defaultTab: 1
                    }, classList[0] ? defaultStyle[classList[0]] || {} : {}, this.dataset || {});
                    var styleSheet = {
                        label: {},
                        text: {}
                    };
                    var tabLabel = self.append('<div class="TabLabel"></div>').children(".TabLabel"),
                        tabDivider = self.append('<div class="TabDivider"></div>').children(".TabDivider"),
                        tabContent = self.append('<div class="TabContent"></div>').children(".TabContent"),
                        labelPadding = data.labelPadding,
                        labelColor = data.labelColor,
                        labelSide = data.labelSide in sides ? data.labelSide : "top",
                        side = sides[labelSide],
                        labelColorSideReverse = truthy.includes(data.labelColorSideReverse),
                        dividerSize = parseInt(data.dividerSize),
                        defaultTab = parseInt(data.defaultTab);
                    if (labelSide === "top") {
                        tabLabel.after(tabDivider);
                        tabDivider.after(tabContent);
                    } else if (labelSide === "bottom") {
                        tabContent.after(tabDivider);
                        tabDivider.after(tabLabel);
                    }
                    if (!isNaN(dividerSize) && dividerSize > 0) {
                        self.find(".TabDivider")[side.dividerSizeType](dividerSize);
                    }
                    var labelColorName = toUpperFirstCase(labelColorSideReverse ? side.labelColorSideReverse : side.labelColorSide);
                    self.addClass(side.className);
                    if (labelColorSideReverse) {
                        self.addClass("reverse");
                    }
                    self.children(".Tab").each(function () {
                        if ($(this).children(".TabLabelText").text().replace(/\s/g, "").length || $(this).children(".TabLabelText").children().length) {
                            $(this).children(".TabLabelText").appendTo(tabLabel);
                            $(this).children(".TabContentText").appendTo(self.children(".TabContent"));
                        }
                        $(this).remove();
                    });
                    if (isNaN(defaultTab) || defaultTab <= 0 || defaultTab > tabLabel.children(".TabLabelText").length) {
                        defaultTab = 1;
                    }
                    tabLabel.children(".TabLabelText").on("click", function () {
                        var label = $(this);
                        label.addClass("selected").siblings().removeClass("selected").css({
                            "border-color": "transparent",
                            "background-color": "inherit"
                        });
                        tabContent.children(".TabContentText").eq(tabLabel.children(".TabLabelText").index(label)).addClass("selected").siblings().removeClass("selected").removeAttr("style");
                        if (getOwnPropertyNamesLength(styleSheet.label) > 0) {
                            label.css(styleSheet.label);
                        }
                    }).eq(defaultTab - 1).click();
                    if (labelPadding) {
                        tabLabel.children(".TabLabelText").css("padding", labelPadding);
                    }
                    ["labelBorderColor", "labelBackgroundColor", "textPadding", "textBorderColor", "textBackgroundColor"].forEach(function (n) {
                        var target = /^label/.test(n) ? "label" : "text",
                            key = toLowerFirstCase(n.replace(target, ""));
                        styleSheet[target][key] = data[n];
                    });
                    if (labelColor) {
                        styleSheet.label["border" + labelColorName + "Color"] = labelColor;
                    } else if (styleSheet.label.borderColor) {
                        styleSheet.label["border" + labelColorName + "Color"] = "green";
                    }
                    tabLabel.find(".selected").click();
                    if (getOwnPropertyNamesLength(styleSheet.text) > 0) {
                        tabContent.css(styleSheet.text);
                    }
                    if (data.autoWidth === "yes") {
                        self.addClass("AutoWidth");
                    }
                    if (data.float === "left") {
                        self.addClass("FloatLeft");
                    }
                    if (data.float === "right") {
                        self.addClass("FloatRight");
                    }
                });
            }
            mw.hook("wikipage.content").add(tabs);
        })();
        $("body").addClass("allowed-comment");

        // End
        window.xzMwLoaded = true;
    }
};
jQuery(window).trigger('load');