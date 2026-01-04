// ==UserScript==
// @name        校园智慧英语作业助手
// @namespace   https://github.com/andywang425
// @version     0.2
// @author      andywang425
// @description 自动完成校园智慧英语网页版的默写作业，获取口试和听力答案
// @include     /https?:\/\/129.211.74.198\/.*/
// @require     https://cdn.bootcss.com/jquery/3.2.1/jquery.min.js
// @require     https://cdn.jsdelivr.net/gh/lzghzr/TampermonkeyJS@ba7671a0d7d7d13253c293724cfea78a8dc1665c/Ajax-hook/Ajax-hook.js
// @require     https://cdn.jsdelivr.net/gh/sentsin/layer@0018e1a54fbfb455d7b30d5a2901294dd0ab52c5/dist/layer.js
// @license     MIT
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/408698/%E6%A0%A1%E5%9B%AD%E6%99%BA%E6%85%A7%E8%8B%B1%E8%AF%AD%E4%BD%9C%E4%B8%9A%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/408698/%E6%A0%A1%E5%9B%AD%E6%99%BA%E6%85%A7%E8%8B%B1%E8%AF%AD%E4%BD%9C%E4%B8%9A%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==
function sleep(millisecond) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve()
        }, millisecond)
    })
};
function getClass(className) {
    var res = document.getElementsByClassName(className);
    if (res === undefined) {
        return getClass(className);
    }
    else return res;
};
const main = () => {
    $('head').append('<link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/gh/sentsin/layer@v3.1.1/dist/theme/default/layer.css">');//加载样式
    var AnsLsit = [];
    const submitTime = 120;//默写提交前等待时间
    ah.proxy({
        onRequest: (config, handler) => {
            handler.next(config);
        },
        onResponse: async (response, handler) => {
            if (response.config.url.indexOf("/exam/all.asp") > -1) {
                var jsonRes = JSON.parse(response.response);
                console.log("/exam/all.asp", jsonRes);
                await sleep(500);
                if (!!jsonRes.aProcess && $("#scoreTotal").length === 0) {
                    for (const i of jsonRes.aContent) {
                        console.log('sType', i.sType)
                        switch (i.sType) {
                            case 'written':
                                layer.msg('检测到默写，开始自动答题');
                                for (const Ans of jsonRes.aProcess) {
                                    console.log("aProcess Ans " + Ans.iOrder + ".", Ans.sAnswer || "无");
                                    AnsLsit.push(Ans.sAnswer);
                                }
                                var classes = await getClass("pjAnswer");
                                var count = 0;
                                for (const c of classes) {
                                    console.log('class', c);
                                    c.focus();
                                    var finalAns = AnsLsit[count].split("/")[0]
                                    c.value = finalAns;
                                    ++count;
                                    await sleep(300)
                                };
                                layer.msg(`答题完成，${submitTime}秒后自动提交`);
                                console.log("答题完成，等待中", submitTime + '秒');
                                setTimeout(() => {
                                    console.log("点击提交按钮");
                                    if ($("#BtnSubmit").length > 0) $("#BtnSubmit").click();
                                }, submitTime * 1000);
                                break;

                            case 'spoken':
                                layer.msg('检测到口试，开始获取答案');
                                var cnt = 0;
                                var AnsString = '';
                                for (const Ans of jsonRes.aProcess) {
                                    console.log("aProcess Ans " + Ans.iOrder + ".", Ans.sAnswer || "无");
                                    if (!!Ans.sAnswer) {
                                        ++cnt
                                        AnsString += String(cnt) + '. ' + Ans.sAnswer + '<br><br>'
                                    }
                                };
                                layer.open({
                                    type: 1,
                                    title: '口试答案',
                                    shade: 0,
                                    area: String(document.documentElement.clientWidth * 0.8) + 'px',
                                    content: AnsString
                                });
                                break;

                            case 'listen':
                                layer.msg('检测到听力，开始获取答案');
                                var cntL = 0;
                                var AnsStringL = '';
                                for (const AnsL of jsonRes.aProcess) {
                                    console.log("aProcess Ans " + AnsL.iOrder + ". ", AnsL.sAnswer || "无");
                                    if (!!AnsL.sAnswer) {
                                        ++cntL
                                        AnsStringL += String(cntL) + '.' + AnsL.sAnswer + '&nbsp;'
                                        if (cntL % 10 === 0) AnsStringL += '<br>'
                                    }
                                };
                                layer.open({
                                    type: 1,
                                    title: '听力答案',
                                    shade: 0,
                                    content: AnsStringL
                                });L
                                break;
                        }
                        break;
                    }

                }
            }
            handler.next(response);
        }
    });
}
main();