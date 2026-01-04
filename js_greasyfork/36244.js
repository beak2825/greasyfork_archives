// ==UserScript==
// @name         bilibili半自动投票辅助脚本
// @namespace    https://greasyfork.org/users/63665
// @homepage     https://greasyfork.org/zh-CN/scripts/36244
// @version      0.4
// @description  bilibili半自动投票辅助脚本。
// @author       fenghengzhi
// @require      https://cdnjs.cloudflare.com/ajax/libs/babel-standalone/6.26.0/babel.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/babel-polyfill/6.26.0/polyfill.min.js
// @match        https://www.bilibili.com/judgement/*
// @downloadURL https://update.greasyfork.org/scripts/36244/bilibili%E5%8D%8A%E8%87%AA%E5%8A%A8%E6%8A%95%E7%A5%A8%E8%BE%85%E5%8A%A9%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/36244/bilibili%E5%8D%8A%E8%87%AA%E5%8A%A8%E6%8A%95%E7%A5%A8%E8%BE%85%E5%8A%A9%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

/* jshint ignore:start */
var inline_src = (`


    $('body').on('click', 'button:contains(开始众裁),button.next:contains(开始下一个众裁)', async function () {
        console.log('buttonclick');
        while (true) {
            let upArror = $('body > div.judgement > div > div.home.home-app-width > div > div.detail-box-wrap > div.content-box > div.fjw-point-wrap > div > header > div.down-arrow');
            if (upArror.length) {
                console.log('success');
                upArror.click();
                return;
            }
            await sleep(500);
        }

    });

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    var button1 = $('<button>投票</button>');
    var button2 = $('<button>封禁</button>');
    var button3 = $('<button>下一个</button>');
    var div = $('<div style="position:fixed;left:0;top:0;z-index:1000000;"></div>').append(button1).append(button2).append(button3);

    async function vote() {
        $('div.cnt.left > ul > li > div > span.agree:not(.active)').click();
        //$('div.cnt.right > ul > li > div > span.unagree:not(.active)').click();
        await sleep(500);
        $('div.paginator.pag.pag-l > div > span.arrow.arrow-right').click();
        //$('div.paginator.pag.pag-r > div > span.arrow.arrow-right').click();
    }

    button1.click(vote);
    button2.click(async function () {
        $('body > div.judgement > div > div.home.home-app-width > div > div.detail-box-wrap > div.content-box > div.vote-wrap-h5 > div > div:nth-child(1) > div > div.legal-btn.legal-btn-color').click();
        while (!$('body > div.judgement > div > div.home.home-app-width > div > div.detail-box-wrap > div.content-box > div.vote-wrap-h5 > div > div.dialog.vote-dialog-new > div.content-outer').is(':visible')) {
            await sleep(500);
        }
        $('label:contains(建议封禁)').click();
        $('button:contains(确认投票)').click();
    });
    button3.click(function () {
        $('button:contains(开始众裁),button.next:contains(开始下一个众裁)').click();
    });
    $('body').append(div);
`).toString();
var c = Babel.transform(inline_src, { presets: [ "es2015", "es2016" , "es2017" ] });
//var c = Babel.transform(inline_src, { presets: [ "es2015", "es2016"] });
//var c = Babel.transform(inline_src, { presets: [ "env" ] });
//console.log(c);
eval(c.code);
/* jshint ignore:end */