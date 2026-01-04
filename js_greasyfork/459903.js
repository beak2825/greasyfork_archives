// ==UserScript==
// @name              CodeForces Helper
// @name:zh-CN        CodeForces Helper
// @description       Print elegantly
// @description:zh-CN 优雅打印
// @namespace         work.pythoner
// @match             *://*.codeforces.com/*
// @match             *://*.codeforc.es/*
// @run-at            document-end
// @grant             GM_registerMenuCommand
// @version           1.0
// @author            Hanson Hu
// @homepage          https://blog.pythoner.work
// @icon              https://blog.pythoner.work/favicon.ico
// @license           MIT
// @downloadURL https://update.greasyfork.org/scripts/459903/CodeForces%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/459903/CodeForces%20Helper.meta.js
// ==/UserScript==

(function() {

    function getToday() {
        // local tz
        let ret = new Date().toLocaleString('sv').slice(0, 10);
        return ret;
    }

    function getTail(str) {
        let index = str.lastIndexOf('\/');
        return str.substring(index + 1, str.length);
    }

    function onClickPrint() {
        $('.menu-box').remove();
        $('.second-level-menu').remove();
        $('.input-output-copier').remove();
        $('#header').remove();
        $('#sidebar').remove();
        $('#footer').remove();
        $('br').remove();
        $('hr').remove();

        $('.header').css('text-align', 'left');
        $('.problem-statement .sample-tests .input').css('border', '1px solid #eee');
        $('.problem-statement .sample-tests .output').css('border', '1px solid #eee');
        $('.problem-statement .sample-tests .title').css({'border-bottom': '1px solid #eee', 'font-size': '1em'});
        $('#body').css({'max-width': 'none', 'min-width': '0px'});
        $('#pageContent').css({'margin-left': '2em', 'margin-right': '2em', 'padding-top': '0px'});
        $('body').css({'zoom': '80%', 'font-size': '1rem'});

        // override !important
        $('.content-with-sidebar').each(function() {
            this.style.setProperty('margin-right', '2em', 'important');
        });

        $('.header .title').text(title);

        let elem = $('<div style="position: absolute; top: 2px; right: 2px; ' +
                     'font-family: Bahnschrift, Trebuchet MS, sans-serif; ' +
                     'font-weight: lighter; font-stretch: condensed; ' +
                     'font-size: 20px;">' +
                     getToday() +
                     '</div>');
        $('body').append(elem);
    }

    GM_registerMenuCommand('Prepare to print', onClickPrint);

    let contest = getTail($('#sidebar a').attr('href'));
    let title = 'CF' + contest + $('.header .title').text().trim();

})();
