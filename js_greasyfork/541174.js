// ==UserScript==
// @name         HiFiNi 自动回复 & 动态网盘链接聚焦（典雅版）
// @namespace    https://www.hifini.com/
// @version      1.5
// @description  在 hifini.com 页面右侧添加自动回复（120条中英日俄经典语录）、动态打开网盘链接并聚焦到链接位置，典雅界面优化
// @author       YourName
// @match        https://www.hifini.com/*
// @match        http://www.hifini.com/*
// @grant        none
// @icon         https://www.hifini.com/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/541174/HiFiNi%20%E8%87%AA%E5%8A%A8%E5%9B%9E%E5%A4%8D%20%20%E5%8A%A8%E6%80%81%E7%BD%91%E7%9B%98%E9%93%BE%E6%8E%A5%E8%81%9A%E7%84%A6%EF%BC%88%E5%85%B8%E9%9B%85%E7%89%88%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/541174/HiFiNi%20%E8%87%AA%E5%8A%A8%E5%9B%9E%E5%A4%8D%20%20%E5%8A%A8%E6%80%81%E7%BD%91%E7%9B%98%E9%93%BE%E6%8E%A5%E8%81%9A%E7%84%A6%EF%BC%88%E5%85%B8%E9%9B%85%E7%89%88%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 检查当前URL是否为歌曲页面
    function isSongPage() {
        return /^https?:\/\/www\.hifini\.com\/thread-\d+\.htm(\?.*)?$/.test(location.href);
    }

    // 如果不是歌曲页面则直接返回
    if (!isSongPage()) {
        return;
    }

    // —— 配置区 —— //
    const MIN_INTERVAL = 30000;
    const MAX_INTERVAL = 60000;
    let replyTimer = null;

    // 120条多语种语录库 (中/英/日/俄)
    const quotes = [
        // 中文 (30)
        "路漫漫其修远兮，吾将上下而求索。——《离骚》",
        "满纸荒唐言，一把辛酸泪。——《红楼梦》",
        "世事洞明皆学问，人情练达即文章。——《红楼梦》",
        "不在沉默中爆发，就在沉默中灭亡。——《呐喊》",
        "人生如逆旅，我亦是行人。——苏轼",
        "为天地立心，为生民立命。——张载",
        "弱水三千，只取一瓢饮。——《红楼梦》",
        "天地不仁，以万物为刍狗。——《道德经》",
        "己所不欲，勿施于人。——《论语》",
        "大鹏一日同风起，扶摇直上九万里。——李白",
        "此情可待成追忆，只是当时已惘然。——李商隐",
        "海内存知己，天涯若比邻。——王勃",
        "先天下之忧而忧，后天下之乐而乐。——范仲淹",
        "人生自古谁无死？留取丹心照汗青。——文天祥",
        "成事不说，遂事不谏，既往不咎。——《论语》",
        "祸兮福之所倚，福兮祸之所伏。——《道德经》",
        "老骥伏枥，志在千里。——曹操",
        "曾经沧海难为水，除却巫山不是云。——元稹",
        "我命由我不由天。——《悟真篇》",
        "桃李不言，下自成蹊。——《史记》",
        "非淡泊无以明志，非宁静无以致远。——诸葛亮",
        "君子之交淡如水。——《庄子》",
        "道可道，非常道。——《道德经》",
        "醉里挑灯看剑，梦回吹角连营。——辛弃疾",
        "山重水复疑无路，柳暗花明又一村。——陆游",
        "人生天地间，忽如远行客。——《古诗十九首》",
        "春蚕到死丝方尽，蜡炬成灰泪始干。——李商隐",
        "会当凌绝顶，一览众山小。——杜甫",
        "问渠那得清如许？为有源头活水来。——朱熹",
        "天下兴亡，匹夫有责。——顾炎武",

        // 日文 (30)
        "人間は考える葦である。[人是一根会思考的芦苇]",
        "風立ちぬ、いざ生きめやも。[起风了，唯有努力生存]",
        "月が綺麗ですね。[月色真美啊]",
        "一期一会。[一生仅此一次的相遇]",
        "汝、自身を知れ。[认识你自己]",
        "七転び八起き。[七跌八起]",
        "侘び寂び。[侘寂之美]",
        "花は桜木、人は武士。[花中樱为王，人中武士尊]",
        "明日は明日の風が吹く。[明日自有明日风]",
        "急がば回れ。[欲速则不达]",
        "石の上にも三年。[功到自然成]",
        "情けは人のためならず。[善有善报]",
        "初心忘るべからず。[勿忘初心]",
        "無用の用。[无用之用]",
        "天は自ら助くる者を助く。[天助自助者]",
        "一寸先は闇。[前途莫测]",
        "塵も積もれば山となる。[积尘成山]",
        "喉元過ぎれば熱さを忘れる。[好了伤疤忘了疼]",
        "負けるが勝ち。[以退为进]",
        "不言実行。[默默实干]",
        "諸行無常。[诸行无常]",
        "知らぬが仏。[眼不见心不烦]",
        "雨降って地固まる。[不打不相识]",
        "備えあれば憂いなし。[有备无患]",
        "縁の下の力持ち。[幕后英雄]",
        "虎穴に入らずんば虎子を得ず。[不入虎穴焉得虎子]",
        "井の中の蛙大海を知らず。[井底之蛙]",
        "光陰矢の如し。[光阴似箭]",
        "人間万事塞翁が馬。[塞翁失马]",
        "継続は力なり。[坚持就是力量]",

        // 俄文 (30)
        "Всё счастливые семьи похожи друг на друга, каждая несчастливая семья несчастлива по-своему.[所有幸福的家庭都是相似的，不幸的家庭各有各的不幸]",
        "Человек — это звучит гордо![人这个字，听起来就自豪！]",
        "Красота спасёт мир.[美能拯救世界]",
        "Любить — значит страдать.[爱意味着痛苦]",
        "Жизнь надо прожить так, чтобы не было мучительно больно за бесцельно прожитые годы.[当回首往事时，不因虚度年华而悔恨]",
        "Человек предполагает, а Бог располагает.[谋事在人，成事在天]",
        "Лучше один раз увидеть, чем сто раз услышать.[百闻不如一见]",
        "Век живи — век учись.[活到老，学到老]",
        "Слово — серебро, молчание — золото.[雄辩是银，沉默是金]",
        "Москва не сразу строилась.[罗马不是一天建成的]",
        "Любовь зла — полюбишь и козла.[爱情是盲目的]",
        "Береги платье снову, а честь смолоду.[爱惜衣裳趁新，珍惜名誉趁早]",
        "Счастье — это когда тебя понимают.[幸福就是被理解]",
        "Правда в вине.[酒后吐真言]",
        "Что пройдет, то будет мило.[逝去的都将变得可爱]",
        "Никто не забыт, ничто не забыто.[无人被遗忘，无事被忘却]",
        "Война — это не фейерверк.[战争不是焰火表演]",
        "Смех без причины — признак дурачины.[无故发笑是傻瓜的标志]",
        "Делу время, потехе час.[工作归工作，娱乐归娱乐]",
        "Копейка рубль бережет.[积少成多]",
        "Кончил дело — гуляй смело.[今日事今日毕]",
        "Дорога ложка к обеду.[雪中送炭]",
        "Тише едешь — дальше будешь.[欲速则不达]",
        "Утро вечера мудренее.[三思而后行]",
        "Старый друг лучше новых двух.[衣不如新，人不如故]",
        "Доверяй, но проверяй.[信任但需验证]",
        "Не имей сто рублей, а имей сто друзей.[宁要百友，不要百金]",
        "Хорошо там, где нас нет.[远方总是更美好]",
        "Семь раз отмерь, один раз отрежь.[三思而后行]",
        "В гостях хорошо, а дома лучше.[在家千日好]",

        // 英文 (30)
        "To be, or not to be: that is the question.[生存还是毁灭，这是个问题]",
        "All animals are equal, but some animals are more equal than others.[所有动物一律平等，但有些动物更加平等]",
        "It is a truth universally acknowledged, that a single man in possession of a good fortune, must be in want of a wife.[凡是有钱的单身汉，总想娶位太太]",
        "Stay hungry, stay foolish.[求知若饥，虚心若愚]",
        "The only way to do great work is to love what you do.[成就伟业的唯一途径是热爱事业]",
        "Not all those who wander are lost.[并非所有流浪者都迷失了方向]",
        "May the Force be with you.[愿原力与你同在]",
        "Life is like a box of chocolates, you never know what you're gonna get.[生活就像一盒巧克力，你永远不知道下一颗是什么味道]",
        "Carpe diem.[及时行乐]",
        "So we beat on, boats against the current, borne back ceaselessly into the past.[于是我们继续奋力向前，逆水行舟，被不断地向后推]",
        "It matters not what someone is born, but what they grow to be.[一个人的出身并不重要，重要的是他长大成为什么样的人]",
        "The greatest glory in living lies not in never falling, but in rising every time we fall.[生命中最伟大的光辉不在于永不坠落，而在于坠落后总能再度升起]",
        "To love and win is the best thing. To love and lose, the next best.[爱并成功是至乐；爱而失之交臂，次之]",
        "The course of true love never did run smooth.[真爱之路永不平坦]",
        "We are all in the gutter, but some of us are looking at the stars.[我们都在阴沟里，但仍有人仰望星空]",
        "It is never too late to be what you might have been.[成为你本该成为的人，永远不晚]",
        "There is no friend as loyal as a book.[书籍是最忠诚的朋友]",
        "Not everything that is faced can be changed, but nothing can be changed until it is faced.[并非所有问题都能解决，但若不面对则永远无法改变]",
        "The only thing we have to fear is fear itself.[唯一值得恐惧的是恐惧本身]",
        "Be the change you wish to see in the world.[欲变世界，先变其身]",
        "If you tell the truth, you don't have to remember anything.[说真话就不必记住任何事]",
        "Darkness cannot drive out darkness; only light can do that.[黑暗不能驱逐黑暗，唯有光明可以]",
        "Without music, life would be a mistake.[没有音乐，生活将是个错误]",
        "In three words I can sum up everything I've learned about life: it goes on.[关于生活，我可以用三个词概括：它永不停息]",
        "The journey of a thousand miles begins with one step.[千里之行，始于足下]",
        "What doesn't kill you makes you stronger.[杀不死你的会让你更强大]",
        "The unexamined life is not worth living.[未经审视的人生不值得过]",
        "Where there is love there is life.[有爱的地方就有生命]",
        "We accept the love we think we deserve.[我们只接受自己认为配得上的爱]",
        "Do not go gentle into that good night.[不要温和地走进那个良夜]"
    ];

    // 提取页面主标题文本（去除中括号内容）
    function getPageTitle() {
        const h4 = document.querySelector('h4.break-all');
        if (!h4) return '';
        return h4.textContent.replace(/\[.*?\]/g, '').trim();
    }

    function generateRandomText() {
        return quotes[Math.floor(Math.random() * quotes.length)];
    }

    function doReply() {
        const ta = document.querySelector('textarea#message.form-control[name="message"]');
        const btn = document.querySelector('button#submit.btn-sm');
        if (!ta || !btn) return;
        const text = generateRandomText();
        ta.value = text;
        ta.dispatchEvent(new Event('input', { bubbles: true }));
        btn.click();
        console.log('自动回复已发送：', text);
    }

    function toggleAutoReply(btn) {
        if (replyTimer) {
            clearTimeout(replyTimer);
            replyTimer = null;
            btn.textContent = '开始自动回复';
            btn.classList.remove('active');
        } else {
            btn.textContent = '停止自动回复';
            btn.classList.add('active');
            doReply();
            (function schedule() {
                const delay = MIN_INTERVAL + Math.random() * (MAX_INTERVAL - MIN_INTERVAL);
                replyTimer = setTimeout(() => { doReply(); schedule(); }, delay);
            })();
        }
    }

    function openLanzou() {
        const link = document.querySelector('a[href*="lanzn.com/"]') || document.querySelector('a[href*="pan.baidu.com/s/"]');
        if (link && link.href) {
            window.open(link.href, '_blank');
        } else {
            alert('未找到网盘链接');
        }
    }

    function focusLink() {
        const selectors = [
            'a[href*="hifini.lanzn.com/"]',
            'a[href*="pan.baidu.com/s/"]'
        ];
        for (const sel of selectors) {
            const el = document.querySelector(sel);
            if (el) {
                el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                el.style.boxShadow = '0 0 0 3px rgba(200, 150, 100, 0.5)';
                setTimeout(() => el.style.boxShadow = '', 3000);
                console.log('已聚焦到链接：', el.href);
                break;
            }
        }
    }

    function createPanel() {
        const titleText = getPageTitle();
        const panel = document.createElement('div');
        panel.id = 'tm-elegant-panel';

        // 构建面板内容
        let html = '';
        if (titleText) {
            html += `<div id="tm-page-title">${titleText}</div>`;
        }
        html += `
            <div class="tm-btn-group">
                <button id="tm-auto-reply" class="tm-btn">
                    <i class="icon">✍️</i>开始自动回复
                </button>
                <button id="tm-open-lanzou" class="tm-btn">
                    <i class="icon">📂</i>打开网盘链接
                </button>
                <button id="tm-focus-link" class="tm-btn">
                    <i class="icon">🔍</i>聚焦下载链接
                </button>
            </div>
        `;
        panel.innerHTML = html;
        document.body.appendChild(panel);

        // 按钮事件
        panel.querySelector('#tm-auto-reply').addEventListener('click', e => toggleAutoReply(e.target));
        panel.querySelector('#tm-open-lanzou').addEventListener('click', openLanzou);
        panel.querySelector('#tm-focus-link').addEventListener('click', focusLink);

        // 添加样式
        const style = document.createElement('style');
        style.textContent = `
            #tm-elegant-panel {
                position: fixed;
                top: 100px;
                right: 20px;
                background: rgba(255, 252, 242, 0.95);
                border: 1px solid #d4c8b0;
                border-radius: 14px;
                padding: 18px 16px;
                box-shadow: 0 8px 24px rgba(100, 80, 50, 0.15);
                font-family: 'Georgia', 'Noto Serif SC', serif;
                z-index: 10000;
                text-align: center;
                backdrop-filter: blur(4px);
                min-width: 220px;
                max-width: 280px;
                transition: transform 0.3s ease;
            }
            #tm-elegant-panel:hover {
                transform: translateY(-5px);
            }
            #tm-page-title {
                font-size: 17px;
                font-weight: bold;
                color: #5a433d;
                margin: 0 0 16px;
                padding: 0 10px;
                line-height: 1.4;
                text-shadow: 0 1px 1px rgba(0,0,0,0.05);
                position: relative;
            }
            #tm-page-title::after {
                content: '';
                display: block;
                width: 60px;
                height: 2px;
                background: linear-gradient(to right, transparent, #d4c8b0, transparent);
                margin: 10px auto 0;
            }
            .tm-btn-group {
                display: flex;
                flex-direction: column;
                gap: 12px;
            }
            .tm-btn {
                display: flex;
                align-items: center;
                justify-content: center;
                width: 100%;
                margin: 0;
                padding: 10px 15px;
                background: linear-gradient(135deg, #f9f3e9, #f5ecdf);
                border: 1px solid #c8bba3;
                border-radius: 10px;
                font-size: 14px;
                color: #5a433d;
                cursor: pointer;
                transition: all 0.3s;
                box-shadow: 0 2px 4px rgba(0,0,0,0.05);
            }
            .tm-btn:hover {
                background: linear-gradient(135deg, #f5ecdf, #f0e5d4);
                transform: translateY(-2px);
                box-shadow: 0 4px 8px rgba(100, 80, 50, 0.15);
            }
            .tm-btn:active {
                transform: translateY(0);
            }
            .tm-btn.active {
                background: linear-gradient(135deg, #e8d9c0, #e0d0b5);
                box-shadow: inset 0 2px 4px rgba(0,0,0,0.1);
            }
            .tm-btn .icon {
                margin-right: 8px;
                font-size: 16px;
            }
        `;
        document.head.appendChild(style);
    }

    window.addEventListener('load', () => {
        // 确保只在歌曲页面创建面板
        if (isSongPage()) {
            createPanel();
            focusLink();
        }
    });

})();