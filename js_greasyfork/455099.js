// ==UserScript==
// @name              QuickDawn
// @namespace         https://ngabbs.com/thread.php?fid=10
// @description       在银色黎明的快速回帖界面中添加常用词
// @version           0.12
// @author            fyy99
// @match             *://ngabbs.com/*
// @match             *://bbs.nga.cn/*
// @match             *://nga.178.com/*
// @run-at            document-end
// @note              v0.10 初始版本
// @note              v0.11 改用Object
// @note              v0.12 完善预设，增加自动加载和修正匹配href、增加常用链接、说明文字，调整补位功能(InfSein)
// @grant             none
// @downloadURL https://update.greasyfork.org/scripts/455099/QuickDawn.user.js
// @updateURL https://update.greasyfork.org/scripts/455099/QuickDawn.meta.js
// ==/UserScript==

(function() {
    setInterval(function () {
        const href = document.location.href;
        if (document.quickdawn_url == href) {
            return;
        }
        document.quickdawn_url = href;
        setTimeout(() => {
            if (document.location.href != href) {
                return;
            }
            if (document.location.href.includes('/read.php')) {


            // 快捷回帖内容(无需care长度)
            var replies = {
                'NUKED': `NUKED.`,
                '个人版': `您举报/投诉的帖子/事项属于某个个人版面，个人版面的版主可以依据其自定的版规、甚至个人喜好去处理版面版务。
银色黎明仅负责处理全局禁言的处罚仲裁和原则问题(违反通用版规或国家法律)级别的举报受理，除此以外的所有个人版面版务事项请尝试通过举报、站内信版面版务，以及在本版面@版面版务等方式自行联系。`,
                '系统撤销': `触发关键词导致的系统操作。
现已撤销。`,
                '自顶贴': `
银色黎明申诉请勿自顶主题。扫帖为从后往前扫，自顶贴只会导致被处理的速度降低，甚至被忽略处理。`,
                '选错tag': `
发帖请务必选择正确的tag 选择不正确的tag 版主将难以发现和处理 进而导致投诉被忽略
烦请参阅[tid=18485089][b]银色黎明发帖前必看[/b][/tid]的相关内容`,
                '没tag': `银色黎明发帖请按照[tid=18485089][b]置顶帖规范[/b][/tid]带上tag。仲裁往往根据tag搜索、集中处理自己管辖的大区的投诉，没有tag或使用不正确的tag将导致你的投诉被忽略。`,
                '不归我管': `不在手游区仲裁范围。请阅读[tid=18485089][b]银色黎明发帖前必看[/b][/tid]后，使用正确的tag重新发帖。`,
                'CCQ': `请阅读[url=https://bbs.nga.cn/read.php?tid=21902747][b]银色黎明常见问题汇总[/b][/url] Q13.`,
                '没链接': `
下次投诉举报请至少附带一个链接，版主不一定能通过图片定位。
您可以尝试提供[b][事发地主题链接]、[事发地回复链接或楼层编号]、[涉及用户的用户中心链接或文本形式的准确的用户名/UID][/b]三类信息中的一项或多项，以便我们及时定位并处理。`,
                '过审/打捞': `申请帖子过审及自动删除恢复事项请到[url=https://bbs.nga.cn/read.php?tid=19025853][b]有价值/有意义帖子冲水 集中打捞申请帖[/b][/url]进行申请。`,
                // '舟': `[伦蒂尼姆布莱克地狱酒吧]版面的主题版主认为不合适即可删除，操作不接受申诉。`,
                '开发版': `相关建议可以到[url=https://bbs.nga.cn/thread.php?fid=335][b]开发版[/b][/url]提出。`,
                '为啥隐藏':`为避免敏感信息和个人隐私泄露，银色黎明的投诉帖仅在仲裁回复和审核之后才会被放出来。`,
                '求放回':`已将申请递交版务组，审核结果会另外回复。`,
                '放回':`已予放回，仅此一次机会。请遵守通用版规和版面版规，再有违规将是永久CCQ。`,
                '&#10003;补位': `[size=100%][/size]`,
            };

                // 常用链接
                var hrefs = {
                    '通用版规':`https://bbs.nga.cn/read.php?tid=22586501`,
                    '常见问题':`https://bbs.nga.cn/read.php?tid=21902747`,
                };

            // 仅在银色黎明(FID=10)生效
            if (window.__CURRENT_FID != 10) {

                replies = {
                    '&#10003;补位': `[size=100%][/size]`,
                };
            }
            // 添加button

            const fast_post_textarea = document.querySelector("#fast_post_c textarea");


            if (fast_post_textarea) {
                const btns_div = document.createElement('div');
                btns_div.style.padding = '2px 0 6px';
                //const btns_b = document.createElement('b');
                //btns_b.innerHTML = '<b></b>';
                var style = document.createElement('b');
                const txt = document.createTextNode("快速回复预设: ");
                //style.style= 'font-size:110%;';
                //txt.innerHTML = '<b></b>';
                style.appendChild(txt);
                btns_div.appendChild(style);

                fast_post_textarea.parentNode.insertBefore(btns_div, fast_post_textarea);
                for (let reply in replies) {
                    const reply_button = document.createElement('button');
                    reply_button.type = 'button';
                    reply_button.innerHTML = reply;
                    reply_button.title = "[回复以下内容]\n"+replies[reply];
                    reply_button.addEventListener('click', () => {
                        window.postfunc.addText(`${replies[reply]}`);
                    });
                    btns_div.appendChild(reply_button);
                }
                var style_2 = document.createElement('b');
                const txt_2 = document.createTextNode(" || 常用链接指引: ");
                //style_2.style= 'font-size:110%;';
                style_2.appendChild(txt_2);
                btns_div.appendChild(style_2);

                for(let href in hrefs) {
                    const href_button = document.createElement('a');
                    //href_button.type = 'button';
                    href_button.href = hrefs[href];
                    href_button.target = '_blank';
                    href_button.innerHTML = " ["+href+"] ";
                    href_button.title = "[前往这一链接]\n"+hrefs[href];
                    btns_div.appendChild(href_button);
                }
            }
            }
        }, 1000);
    }, 100);
})();