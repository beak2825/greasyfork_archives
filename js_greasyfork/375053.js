// ==UserScript==
// @name         E-Klase
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Тупо фри функции
// @author       Dragso
// @match        https://my.e-klase.lv/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/375053/E-Klase.user.js
// @updateURL https://update.greasyfork.org/scripts/375053/E-Klase.meta.js
// ==/UserScript==

(function() {
    'use strict';
    if (dataLayer[0].siteVersion == "paid") return;
    if(window.location.pathname == "/Family/ReportPupilMarks/Get"){
String.prototype.getNums = function() {
    var rx = /[+-]?((\.\d+)|(\d+(\.\d+)?)([eE][+-]?\d+)?)/g,
        mapN = this.match(rx) || [];
    return mapN.map(Number);
};
var marks = pupilMarksJsonObject["dataArrayOfMarks"];
var r = new RegExp(/\d+/gm);
var markz = {};
var markzn = {};
marks.forEach(function(element) {
    let ms = 0,
        ma = 0;
    for (let value of element) {
        let ans = value.getNums();
        for (let i = 0; i < ans.length; i++) {
            var lc = markz[element[0]]
            if (lc == null) {
                markz[element[0]] = {
                    1: 0,
                    2: 0
                };
                lc = markz[element[0]];
            }
            markz[element[0]] = {
                1: parseInt(lc[1]) + ans[i],
                2: parseInt(lc[2]) + 1
            };
        }
    }

});

var rows = document.getElementsByTagName("tbody")[0].getElementsByTagName('tr');
var aver = {1:0, 2:0}
for (let i = 0; i < rows.length; i++) {
    if (markz[rows[i].getElementsByTagName("td")[0].innerText] != undefined) {
        let average = markz[rows[i].getElementsByTagName("td")[0].innerText][1] / markz[rows[i].getElementsByTagName("td")[0].innerText][2];
        let last = rows[i].getElementsByTagName("td")[rows[i].getElementsByTagName("td").length - 1];
        aver = {1:parseFloat(aver[1]) + parseFloat(average.toFixed(2)), 2: parseInt(aver[2]) + 1}
        last.outerHTML = `${last.outerHTML} <td data-bind="html: $data">${average.toFixed(2)}</td>`;
    }

}
        console.log(aver[1])
 $('table')[0].outerHTML = `${$('table')[0].outerHTML} <div style=" font-size: 200%"> <h1> Твой средний бал ${(parseFloat(aver[1])/parseInt(aver[2])).toFixed(2)} </h1> </div>`;

}
    if(window.location.pathname == "/Family/Home"){
var today = new Date();
var dd = today.getDate();
var mm = today.getMonth()+1; //January is 0!
var yyyy = today.getFullYear();

if(dd<10) {
    dd = '0'+dd
}

if(mm<10) {
    mm = '0'+mm
}

document.getElementsByClassName("no-diary-expl")[0].outerHTML = ' <section class="actual-lessons"> <div class="container"> <div class="diary-container"></div></div></section>';
              var diaryUrl = `/Family/Diary/TwoDays?Date=${dd + '.' + mm + '.' + yyyy}.`;
             var mobileDiaryUrl = `/Family/Diary/GetOneDay?Date=${dd + '.' + mm + '.' + yyyy}.`;
                loadDiary();

"use strict";

function loadDiary() {
    var n;
    n = isBreakpoint("xs") ? mobileDiaryUrl : diaryUrl;
    $.get(n, function(n) {
        setDiaryHtml(n)
    })
}

function switchDiaryDay(n) {
    n.preventDefault();
    $(".switch-date").css("visibility", "hidden");
    $.get($(this).data("url"), function(n) {
        setDiaryHtml(n);
        isBreakpoint("xs") && $("html, body").animate({
            scrollTop: $(".diary-container").offset().top - 50
        }, 1e3)
    })
}

function setDiaryHtml(n) {
    $(".diary-container").html(n)
}

function openNewPaymentNotificationModal() {
    $("#modal_paym_notification").modal();
    $(".modal-payment-notification-content").load(urlToPaymentNotificationModal)
}

function modalPaymentRemainderActionOnClick(n) {
    $.ajax({
        url: n,
        type: "POST",
        cache: !1,
        dataType: "json",
        contentType: "application/json",
        traditional: !0,
        data: ""
    });
    $("#modal_paym_notification").modal("hide")
}

function bindLatestWidgetNotificationEvents() {
    !isBreakpoint("xs") && hasLatestMarksNotifications() && userHasSeenLatestMarks();
    $(".reset-messages-notifications").on("click", function() {
        hasLatestMessagesNotifications() && userHasSeenLatestMessagesFromTeacher()
    });
    $(".reset-marks-notifications").on("click", function() {
        hasLatestMarksNotifications() && userHasSeenLatestMarks()
    })
}

function bindUserHasSeenNewsEvents() {
    $(".reset-news-notifications").on("click", function(n) {
        n.preventDefault();
        newsNotificationsHaveBeenReset || (userHasSeenLatestNews(), $(".reset-news-notifications .widget-count").remove());
        newsNotificationsHaveBeenReset = !0
    })
}

function userHasSeenLatestMarks() {
    userHasSeenNotificationsCategory(urlToUserHasSeenLatestMarks)
}

function userHasSeenLatestMessagesFromTeacher() {
    userHasSeenNotificationsCategory(urlToUserHasSeenLatestMessagesFromTeacher)
}

function userHasSeenLatestNews() {
    userHasSeenNotificationsCategory(urlToUserHasSeenLatestNews)
}

function userHasSeenNotificationsCategory(n) {
    $.ajax({
        url: n,
        type: "POST",
        cache: !1,
        dataType: "json",
        contentType: "application/json",
        traditional: !0,
        data: ""
    })
}

function hasLatestMarksNotifications() {
    return getLatestMarksNotificationCount() > 0
}

function hasLatestMessagesNotifications() {
    return getLatestMessagesNotificationCount() > 0
}

function getLatestMarksNotificationCount() {
    return getNotificationCount($(".mark-notifications:first"))
}

function getLatestMessagesNotificationCount() {
    return getNotificationCount($(".messages-notifications:first"))
}

function getNotificationCount(n) {
    var t = n.find(".notification-count");
    return t.length ? parseInt(t.html()) : 0
}

function latestUnseenMarkOnClick() {
    $(this).removeClass("new");
    decrementNotificationCount($(".mark-notifications"), getLatestMarksNotificationCount())
}

function latestUnseenMessageOnClick() {
    $(this).removeClass("new");
    decrementNotificationCount($(".messages-notifications"), getLatestMessagesNotificationCount())
}

function decrementNotificationCount(n, t) {
    var i = n.find(".notification-count");
    if (!i.length) return !0;
    t === 1 && i.remove();
    i.html(t - 1)
}

function closeDashboardAdvMessage(n) {
    n.preventDefault();
    var t = $(this);
    $.ajax({
        url: urlToHideDashboardAdvMessage,
        type: "POST",
        cache: !1,
        dataType: "json",
        contentType: "application/json",
        traditional: !0,
        data: JSON.stringify({
            Id: t.data("id")
        }),
        success: function() {
            t.closest(".dashboard-information").hide()
        }
    })
}
var Dashboard, dashboard, urlToDiaryPrevWeek, urlToDiaryNextWeek;
$.fn.isOnScreen = function() {
    var i = $(window),
        t = {
            top: i.scrollTop(),
            left: i.scrollLeft()
        },
        n;
    return t.right = t.left + i.width(), t.bottom = t.top + i.height(), n = this.offset(), n.right = n.left + this.outerWidth(), n.bottom = n.top + this.outerHeight(), !(t.right < n.left || t.left > n.right || t.bottom < n.top || t.top > n.bottom)
};
Dashboard = function(n) {
    this.object = $(n);
    this.resize = function() {
        var t = $(this.object).find(".widget-recent-scores .dashboard-widget"),
            u = $(this.object).find(".widget-notifications .dashboard-widget"),
            i = $(this.object).find(".widget-banner .dashboard-widget"),
            r = $(this.object).find(".widget-information"),
            n, f;
        isBreakpoint("sm") ? ($(i).is(":visible") ? n = $(i).is(":visible") && !$(r).is(":visible") ? $(u).outerHeight() + $(i).outerHeight() + 18 : $(u).outerHeight() + $(i).outerHeight() - $(r).outerHeight() : ($(r).addClass("full"), n = $(u).outerHeight()), $(t).css("height", n), f = n - $(t).find(".widget-header").outerHeight(), $(t).find(".widget-content-viewport").css("height", f)) : ($(t).removeAttr("style"), $(t).find(".widget-content-viewport").removeAttr("style"), $(r).removeClass("full"))
    }
};
dashboard = new Dashboard(".dashboard-upper-widgets");
$(window).resize(function() {
    dashboard.resize()
});
$(document).ready(function() {
    dashboard.resize();
    $(".switch-month-prev").on("click", function(n) {
        n.preventDefault();
        var t = $(this).data("calendar");
        $('.invisible-tab-nav[data-for-calendar="' + t + '"]').filter(".active").prev("li").find('a[data-toggle="tab"]').tab("show")
    });
    $(".switch-month-next").on("click", function(n) {
        n.preventDefault();
        var t = $(this).data("calendar");
        $('.invisible-tab-nav[data-for-calendar="' + t + '"]').filter(".active").next("li").find('a[data-toggle="tab"]').tab("show")
    });
    $(document).on("click", ".dashboard-widget .widget-header, .collapse-this", function(n) {
        n.preventDefault();
        $(this).closest(".dashboard-widget").toggleClass("open");
        $(this).hasClass("collapse-this") && ($(this).closest(".dashboard-widget").isOnScreen() || $("html, body").animate({
            scrollTop: $(this).closest(".dashboard-widget").offset().top - 60
        }, 0))
    });
    $(document).on("click", ".expand-this", function(n) {
        n.preventDefault();
        $(this).closest(".dashboard-widget").find(".widget-items").children().show();
        $(this).closest(".widget-show-all").remove()
    });
    isBreakpoint("xs") && ($(".recent-scores-item").length > 5 ? $(".recent-scores-item").slice(4).hide() : $(".dashboard-widget.recent-scores .widget-show-all").remove(), $(".recent-messages-item").length > 5 ? $(".recent-messages-item").slice(4).hide() : $(".dashboard-widget.recent-messages .widget-show-all").remove());
    $(".widget-notifications a.widget-notification").on("click", function(n) {
        n.preventDefault();
        var t = this.hash;
        $("html, body").animate({
            scrollTop: $(t).offset().top - 110
        }, 1e3, function() {})
    });
    isBreakpoint("xs") && $(".back-to-top-holder").length > 0 && $(window).scroll(function() {
        var r = $(document).height(),
            i = $(window).height(),
            t = $(this).scrollTop(),
            n = $(".back-to-top-holder"),
            u = r - (i + t),
            f = Math.round(t + i) - 53,
            e = Math.round(n.offset().top);
        f > e ? n.addClass("pointview") : n.hasClass("pointview") && (n.addClass("fixed"), u < 245 && n.removeClass("fixed"));
        t == 0 && n.fadeOut(300, function() {
            n.removeClass("fixed pointview").show()
        })
    });
    $(".weekly-results-content .day.enabled").on("click", function(n) {
        var t, r, i;
        n.preventDefault();
        t = $(this);
        r = $(".weekly-results-content .day-content.open");
        $(".weekly-results-content .day.active").not(t).removeClass("active");
        i = t.data("date") ? $('[data-for="' + t.data("date") + '"]') : t.parent().next(".no-scores");
        i.hasClass("open") ? i.hasClass("no-scores") ? (r.removeClass("open"), i.addClass("open")) : i.removeClass("open") : (r.removeClass("open"), i.addClass("open"));
        t.hasClass("active") ? (t.parent().next(".no-scores").removeClass("open"), setTimeout(function() {
            t.removeClass("active")
        }, 900)) : t.addClass("active")
    });
    $(document).on("click", ".widgets-switcher-item", function(n) {
        n.preventDefault();
        var t = $(this);
        $(".widgets-switcher-item.active").removeClass("active");
        $(t).addClass("active");
        $(".widget-recent-holder .dashboard-widget.showing").removeClass("showing");
        $("#" + $(t).data("for")).addClass("showing")
    });
    $(document).on("tap click", ".section-switch-option", function(n) {
        n.preventDefault();
        n.type == "tap" ? ($(this).tab("show"), $(this).parent().find(".active").removeClass("active"), $(this).addClass("active"), $(".weekly-results-table-first-column").equalize(), $(window).trigger("resize")) : n.type == "click" && ($(this).tab("show"), $(this).parent().find(".active").removeClass("active"), $(this).addClass("active"), $(".weekly-results-table-first-column").equalize(), $(window).trigger("resize"))
    })
});
$(window).resize(function() {
    typeof dashboard != "undefined" && dashboard.resize()
});
$(document).ready(function() {
    $(document).on("click", ".actual-lessons-item .lesson-title", function(n) {
        n.preventDefault();
        $(this).closest(".actual-lessons-item").toggleClass("open")
    });
    $(".print-mark-checkbox").on("click", function() {
        var n = $(this),
            t = n.data("block");
        n.is(":checked") ? $("." + t).show() : $("." + t).hide()
    })
});
var messageNotificationsHaveBeenReset = !1,
    marksNotificationsHaveBeenReset = !1,
    newsNotificationsHaveBeenReset = !1,
    diaryLoadingCompleatedOnResize = !0;
$(function() {
    $(".diary-container").on("click", ".switch-date", switchDiaryDay);
    if (typeof urlToPaymentNotificationModal != "undefined" && openNewPaymentNotificationModal(), typeof remainderModalIsHidden != "undefined") $(document).on("click", function(n) {
        var t = $(n.target);
        t.hasClass("modal-paym-remainder-action") && (remainderModalIsHidden = !0);
        remainderModalIsHidden || ($(".modal-paym-remainder-hide").trigger("click"), remainderModalIsHidden = !0)
    });
    $(".modal-payment-notification-content").on("click", ".modal-paym-remainder-action", function(n) {
        n.preventDefault();
        modalPaymentRemainderActionOnClick($(this).attr("href"))
    });
    bindUserHasSeenNewsEvents();
    typeof urlToUserHasSeenLatestMarks != "undefined" && typeof urlToUserHasSeenLatestMessagesFromTeacher != "undefined" && bindLatestWidgetNotificationEvents();
    $(".open-mark-file.new").on("click", latestUnseenMarkOnClick);
    $(".recent-messages-item.new").on("click", latestUnseenMessageOnClick);
    $(".close-dashboard-adv-message").on("click", closeDashboardAdvMessage)
});
$(window).resize(function() {
    diaryLoadingCompleatedOnResize && diaryUrl !== "" && (diaryLoadingCompleatedOnResize = !1, setTimeout(function() {
        loadDiary();
        diaryLoadingCompleatedOnResize = !0
    }, 1e3))
})
    }

})();