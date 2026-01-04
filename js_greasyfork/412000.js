// ==UserScript==
// @name        北航一键评教脚本
// @namespace   Violentmonkey Scripts
// @match       http://jwxt.buaa.edu.cn:7001/ieas2.1/welcome*
// @match       https://jwxt-buaa-edu-cn-7001-p.vpn.buaa.edu.cn:8118/ieas2.1/welcome*
// @grant       GM_registerMenuCommand
// @version     2021.01
// @author      jason
// @description 2020/9/25 下午9:27:08
// @downloadURL https://update.greasyfork.org/scripts/412000/%E5%8C%97%E8%88%AA%E4%B8%80%E9%94%AE%E8%AF%84%E6%95%99%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/412000/%E5%8C%97%E8%88%AA%E4%B8%80%E9%94%AE%E8%AF%84%E6%95%99%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

function sleep(time) {
    return new Promise((resolve) => setTimeout(resolve, time));
}

let IfClicked = false;

function Start() {
    if (IfClicked) {
        return;
    }
    IfClicked = true;

    let $frame = $('#iframename');
    let frame = $frame[0].contentWindow;
    frame.location.href = '/ieas2.1/xspj/Fxpj_fy';
    $frame.load(async () => {
        frame.$('#queryform').attr('target', 'hiddenframe');
        frame.$('body').append(`<iframe id="hiddenframe" name="hiddenframe" style="display:none"></iframe>`);

        let $hidden = frame.$('#hiddenframe');
        let hidden = $hidden[0].contentWindow;
        $hidden.load(() => {
            hidden.alert = hidden.confirm = function () { return true };
            let $input = hidden.$("input[name^=tabmapzb]");
            for (const i of [1, 5, 10, 15, 20, 25]) {
                $input[i].click();
            }
            hidden.$('#sftj').val('3');
            hidden.tj();
        });

        let $teachers = frame.$('span.yellow>a');
        for (let i = 0; i < $teachers.length; i++) {
            $teachers[i].click();
            await sleep(1000);
        }
        await sleep(1000);
        console.log('评教成功...');
    });
}

GM_registerMenuCommand('开始评教', Start);