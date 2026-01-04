// ==UserScript==
// @name         BGM维基动画老条目关联人物参与章节填充
// @namespace    hyary
// @version      0.1.3
// @description  试着将 infobox 里手写的章节参与信息提取到关联里
// @author       hyary
// @license      MIT
// @match        https://bgm.tv/subject/*/add_related/person
// @match        https://bangumi.tv/subject/*/add_related/person
// @match        https://chii.in/subject/*/add_related/person
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/506896/BGM%E7%BB%B4%E5%9F%BA%E5%8A%A8%E7%94%BB%E8%80%81%E6%9D%A1%E7%9B%AE%E5%85%B3%E8%81%94%E4%BA%BA%E7%89%A9%E5%8F%82%E4%B8%8E%E7%AB%A0%E8%8A%82%E5%A1%AB%E5%85%85.user.js
// @updateURL https://update.greasyfork.org/scripts/506896/BGM%E7%BB%B4%E5%9F%BA%E5%8A%A8%E7%94%BB%E8%80%81%E6%9D%A1%E7%9B%AE%E5%85%B3%E8%81%94%E4%BA%BA%E7%89%A9%E5%8F%82%E4%B8%8E%E7%AB%A0%E8%8A%82%E5%A1%AB%E5%85%85.meta.js
// ==/UserScript==
(function () {
    addRelatedPersonParts();
})()


function addRelatedPersonParts() {

    const staffValue = (() => {
        let sv = {};
        chiiLib.relations.genPrsnStaffList(-1)
            .replace(/<option value="(\d+)">([^<]+?) \/ .*?<\/option>/g, (m, v, k) => {
                sv[k] = sv[k] || [];
                sv[k].push(parseInt(v));
            });
        return sv;
    })();

    async function getInfoboxFieldLinks() {
        const rsp = await fetch(document.URL.split('/add_related/person')[0], { method: 'GET' });
        if (!rsp.ok) {
            console.error('无法获取页面信息');
            return;
        }
        const raw = await rsp.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(raw, 'text/html');
        return $("ul#infobox > li", doc)
            .filter((_, el) => /\(.*\d.*\)/.test(el.innerHTML) && $("a", el).length > 0)
            .map((_, el) => {
                const raw = el.innerHTML;
                const role = $("span", el).text().trim().slice(0, -1);
                const roleIDs = staffValue[role];
                if (!roleIDs) {
                    return;
                }
                const segments = raw.split('</span>')[1].split('、');
                let linkParts = [];
                appendLog(`--- 正在解析 ${role} ---`);
                segments.forEach(seg => {
                    seg = seg.trim();
                    const keys = Array.from(seg.matchAll(/<a href="([^"]+)"/g)).map(m => m[1]).sort();
                    if (keys.length > 1) {
                        appendLog(`解析失败：${seg}`);
                        return;
                    }
                    if (keys.length === 0) {
                        appendLog(`无关联信息：${seg}`);
                        return;
                    }
                    const parts = /\(([^()]*?)\)$/.exec(seg);
                    if (!parts) {
                        appendLog(`无章节信息：${seg}`);
                        return;
                    }
                    const p = parts[1].replaceAll('/', ',');
                    // if (['OP', 'ED'].includes(p)) {
                    //     appendLog(`跳过 OP/ED：${seg}`);
                    //     return;
                    // }
                    if (!/^(\d+[,-])*\d+$/.test(p)) {
                        appendLog(`格式可能不符，需复查：${seg}`);
                    }
                    linkParts.push([keys[0], p]);
                });
                return [[roleIDs, linkParts]];
            }).get();
    }

    function getExistingRelation() {
        // relaTabs: { role_id: { link: partElem } }
        let relaTabs = Object.fromEntries(Object.values(staffValue).flatMap(x => x.map(y => [y, {}])));
        $('#crtRelateSubjects li').each((_, el) => {
            const link = $('p.title > a', el).attr('href');
            const roleID = parseInt($('select', el).attr('value'));
            const partElem = $('input[type="text"]', el);
            relaTabs[roleID][link] = partElem;
        });
        return relaTabs;
    }


    $('.subjectListWrapper').after(`
        <div id="dougarenovate-main">
            <div style="margin: 1rem 0.5rem 0 0.5rem; display: flex; justify-content: space-between;">
                <div style="margin: 0.5rem; font-size: 16px; color: #AAA; flex-basis: 40%;"></div>
                <input type="button" id="dougarenovate-btn-start" class="searchBtnL" value="从 infobox 补充参与信息" style="flex-basis: 30%;">
            </div>
            <div id="dougarenovate-prog" style="position: fixed; backdrop-filter: blur(10px); padding: 0 0.5rem; font-size: 14px; color: #AAA; overflow: scroll; max-height: 31.5rem; z-index: 1;"></div>
        </div>
    `);
    $('#dougarenovate-btn-start').on('click', async () => {
        const infoboxLinks = await getInfoboxFieldLinks();
        const existingRelation = getExistingRelation();
        appendLog("--- 开始装填 ---");
        for (const [roleIDs, linkParts] of infoboxLinks) {
            const linkParkElemCandidates = roleIDs.map(x => existingRelation[x]).filter(x => x);
            if (linkParkElemCandidates.length === 0) {
                appendLog(`未关联的职位：${roleIDs}`);
                continue;
            }
            const linkParkElem = linkParkElemCandidates[0];
            for (const [link, parts] of linkParts) {
                linkParkElem[link].val(parts);
            }
        }
        $('#editSummary').val('参照 infobox 补充人物参与章节');
    });

}

function appendLog(text) {
    $('#dougarenovate-prog').append(`<div>${text}</div>`);
}