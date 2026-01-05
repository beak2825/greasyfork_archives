// ==UserScript==
// @name        titulky.com - AutoDownload
// @description:cs Po otevření stránky s titulky začne odpočet pro automatické otevření dialogu pro stažení titulků. V dialogu stažení titulků po zobrazení tlačítka pro stažení začne odpočet pro automatické klepnutí na toto tlačítko. Oba odpočty lze stornovat. Při dosažení denního limitu automaticky přesune kurzor do okénka pro opsání kódu. V případě manuálního otevření dialogu pro stažení se jej znovu nesnaží otevřít.
// @namespace   monnef.tk
// @include     http://*.titulky.com/*
// @include     https://*.titulky.com/*
// @version     3
// @grant       none
// @require     http://cdn.jsdelivr.net/jquery/2.1.4/jquery.min.js
// @description Po otevření stránky s titulky začne odpočet pro automatické otevření dialogu pro stažení titulků. V dialogu stažení titulků po zobrazení tlačítka pro stažení začne odpočet pro automatické klepnutí na toto tlačítko. Oba odpočty lze stornovat. Při dosažení denního limitu automaticky přesune kurzor do okénka pro opsání kódu. V případě manuálního otevření dialogu pro stažení se jej znovu nesnaží otevřít.
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/11477/titulkycom%20-%20AutoDownload.user.js
// @updateURL https://update.greasyfork.org/scripts/11477/titulkycom%20-%20AutoDownload.meta.js
// ==/UserScript==


var debug = true;

function log(msg) {
    if (debug) {
        console.log("[AutoDownload]: " + msg);
    }
}

this.$ = this.jQuery = jQuery.noConflict(true);

log("starting");

function countDown(elem, action, remaining) {
    if (!elem.hasClass("stop")) {
        elem.text(remaining + "s");
        if (remaining <= 0) {
            action();
            elem.css("color", "gray");
        } else {
            setTimeout(function () {
                countDown(elem, action, remaining - 1)
            }, 1000);
        }
    }
}

function createCountDown(time, action) {
    var elem = $("<span/>")
        .css("margin", "0 3px 0 2px");
    var stopButton = $("<button/>").text("Stop");
    stopButton.click(function () {
        elem.addClass("stop");
        stopButton.css("color", "gray");
    });
    var wrapper = $("<span/>").append(elem).append(stopButton);
    countDown(elem, action, time);
    return wrapper;
}

function issueClickEvent(domElem) {
    var click = document.createEvent("MouseEvents");
    click.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
    domElem.dispatchEvent(click);
}

function clickOnDownloadInOneArchive(elem) {
    elem.css("border", "1px solid white");
    // issueClickEvent(elem[0]);
    window.open(elem.attr("href"));
}

function watchForDownloadButton() {
    var button = $("#downdiv button");
    if (button.length > 0 && button.parent().css("display") != "none") {
        var counterWrapper = createCountDown(5, function () {
            log("clicking download button");
            issueClickEvent(button[0]);
        });
        button.after(counterWrapper);
        counterWrapper.before("<- klikám za ");
        log("found button, inserting counter");
    } else {
        log("download button not found, postponing");
        setTimeout(watchForDownloadButton, 1000);
    }
}

function onLoad() {
    $("#opendown").each(function () {
        log("found open download window button");
        var e = $(this);
        var counterWrapper = createCountDown(5, function () {
            var downloadDialog = $("div#cboxLoadedContent");
            var dialogWrapper = downloadDialog.closest("#colorbox");
            if (dialogWrapper.css("display") == "none") {
                clickOnDownloadInOneArchive(e);
            } else {
                log("Download dialog already open, skipping.");
            }
        });

        e.parent().parent().after(counterWrapper);
        var note = $("<div><p>Auto-download skript vám napsal <a href='http://monnef.tk'>monnef</a>. Pokud skript vlastníci <i>titulky.com</i> rozbijí, prosím napište a já, pokud to bude v mých sílách, ho aktualizuji.</p><p>V případě, že se vám funkce skriptu zamlouvá, zvažte prosím malou finanční podporu.</p></div>")
            .css("font-size", "130%")
            .css("margin", "3px")
            .css("border-radius", "2px solid black")
            .css("clear", "both")
            .css("padding", "8px")
            .css("border-radius", "3px")
            .css("background-color", "#E2E2E2")
            .css("width", "659px")
            .css("box-sizing", "border-box");
        note.children().first().css("margin-bottom", "4px");
        var donateLink = $("<a/>").attr("href", "https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=U6PGB7P24WWSU&lc=CZ&item_name=Titulky%2ecom%20%2d%20AutoDownloader&item_number=titCom%2dautoDownloader&currency_code=CZK&bn=PP%2dDonationsBF%3abtn_donate_SM%2egif%3aNonHosted")
            .attr("target", "_blank");
        var donatePic = $("<img>").attr("src", "https://www.paypalobjects.com/en_US/i/btn/btn_donate_SM.gif")
            .css("position", "absolute")
            .css("margin-left", "2px")
            .css("margin-top", "-4px");
        note.children().last().append(donatePic);
        donatePic.wrap(donateLink);
        counterWrapper.wrap("<tr/>").wrap($("<td/>").addClass("detailv"));
        counterWrapper.parent().before($("<td/>"));
        counterWrapper.before("Otevírám odkaz za");
        counterWrapper.closest("table").after(note);
    });

    $("#downdiv").each(function () {
        log("found downdiv, started stalking");
        watchForDownloadButton();
    });
    $("input[name=downkod]").each(function () {
        this.focus();
    });
}

$(onLoad);
