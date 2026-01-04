// ==UserScript==
// @name         雀魂牌谱批量下载脚本，转为天凤格式
// @namespace    mjsoul
// @version      0.0.2
// @description  批量下载雀魂牌谱并转换为天凤格式
// @include      https://mahjongsoul.game.yo-star.com/
// @include      https://game.mahjongsoul.com/
// @include      https://game.maj-soul.com/1/
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/534120/%E9%9B%80%E9%AD%82%E7%89%8C%E8%B0%B1%E6%89%B9%E9%87%8F%E4%B8%8B%E8%BD%BD%E8%84%9A%E6%9C%AC%EF%BC%8C%E8%BD%AC%E4%B8%BA%E5%A4%A9%E5%87%A4%E6%A0%BC%E5%BC%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/534120/%E9%9B%80%E9%AD%82%E7%89%8C%E8%B0%B1%E6%89%B9%E9%87%8F%E4%B8%8B%E8%BD%BD%E8%84%9A%E6%9C%AC%EF%BC%8C%E8%BD%AC%E4%B8%BA%E5%A4%A9%E5%87%A4%E6%A0%BC%E5%BC%8F.meta.js
// ==/UserScript==

(function() {
    //********** 全局配置 **********
    //格式转换配置
    const NAMEPREF = 0;     // 2为英文，1为适度的日文，0为全日文
    const VERBOSELOG = false; // 输出mjs记录到输出文件 - 会导致文件太大，无法在tenhou.net/5查看
    const PRETTY = false;   // 让输出的日志更易于人类阅读
    const SHOWFU = false;   // 始终显示符/番数 - 即使是满贯等特殊和牌

    let ALLOW_KIRIAGE = false; // 可能允许切上满贯
    let TSUMOLOSSOFF = false;  // 三麻自摸损失，在三麻自摸损失关闭时设为true

    //牌理相关常量
    const DAISANGEN = 37; // 大三元在cfg.fan.fan.map_中的索引
    const DAISUUSHI = 50; // 大四喜在cfg.fan.fan.map_中的索引
    const TSUMOGIRI = 60; // 天凤的摸切符号

    //日语/罗马音/英语名称的映射
    const JPNAME = 0;
    const RONAME = 1;
    const ENNAME = 2;
    const RUNES = {
        /*和牌限制*/
        "mangan"         : ["満貫",         "Mangan ",         "Mangan "               ],
        "haneman"        : ["跳満",         "Haneman ",        "Haneman "              ],
        "baiman"         : ["倍満",         "Baiman ",         "Baiman "               ],
        "sanbaiman"      : ["三倍満",       "Sanbaiman ",      "Sanbaiman "            ],
        "yakuman"        : ["役満",         "Yakuman ",        "Yakuman "              ],
        "kazoeyakuman"   : ["数え役満",     "Kazoe Yakuman ",  "Counted Yakuman "      ],
        "kiriagemangan"  : ["切り上げ満貫", "Kiriage Mangan ", "Rounded Mangan "       ],
        /*局终止条件*/
        "agari"          : ["和了",         "Agari",           "Agari"                 ],
        "ryuukyoku"      : ["流局",         "Ryuukyoku",       "Exhaustive Draw"       ],
        "nagashimangan"  : ["流し満貫",     "Nagashi Mangan",  "Mangan at Draw"        ],
        "suukaikan"      : ["四開槓",       "Suukaikan",       "Four Kan Abortion"     ],
        "sanchahou"      : ["三家和",       "Sanchahou",       "Three Ron Abortion"    ],
        "kyuushukyuuhai" : ["九種九牌",     "Kyuushu Kyuuhai", "Nine Terminal Abortion"],
        "suufonrenda"    : ["四風連打",     "Suufon Renda",    "Four Wind Abortion"    ],
        "suuchariichi"   : ["四家立直",     "Suucha Riichi",   "Four Riichi Abortion"  ],
        /*得分*/
        "fu"             : ["符",           /*"Fu",*/"符",     "Fu"                    ],
        "han"            : ["飜",           /*"Han",*/"飜",    "Han"                   ],
        "points"         : ["点",           /*"Points",*/"点", "Points"                ],
        "all"            : ["∀",            "∀",               "∀"                     ],
        "pao"            : ["包",           "pao",             "Responsibility"        ],
        /*房间*/
        "tonpuu"         : ["東喰",         " East",           " East"                 ],
        "hanchan"        : ["南喰",         " South",          " South"                ],
        "friendly"       : ["友人戦",       "Friendly",        "Friendly"              ],
        "tournament"     : ["大会戦",       "Tounament",       "Tournament"            ],
        "sanma"          : ["三",           "3-Player ",       "3-Player "             ],
        "red"            : ["赤",           " Red",            " Red Fives"            ],
        "nored"          : ["",             " Aka Nashi",      " No Red Fives"         ]
    };

    //********** UI函数 **********

    // 创建下载菜单
    function showDownloadMenu() {
        const menuDiv = document.createElement("div");
        menuDiv.style.position = "fixed";
        menuDiv.style.top = "50%";
        menuDiv.style.left = "50%";
        menuDiv.style.transform = "translate(-50%, -50%)";
        menuDiv.style.padding = "20px";
        menuDiv.style.backgroundColor = "white";
        menuDiv.style.border = "1px solid #ccc";
        menuDiv.style.borderRadius = "5px";
        menuDiv.style.boxShadow = "0 0 10px rgba(0,0,0,0.2)";
        menuDiv.style.zIndex = "10000";

        menuDiv.innerHTML = `
            <h3 style="margin-top:0;">选择下载方式</h3>
            <button id="manual-input" style="display:block;width:100%;margin-bottom:10px;padding:8px;">手动输入多个链接/UUID</button>
            <button id="file-input" style="display:block;width:100%;padding:8px;">从文本文件加载</button>
            <button id="cancel-download" style="display:block;width:100%;margin-top:10px;padding:8px;">取消</button>
        `;

        document.body.appendChild(menuDiv);

        document.getElementById("manual-input").onclick = function() {
            document.body.removeChild(menuDiv);
            GetPaipusJSON();
        };

        document.getElementById("file-input").onclick = function() {
            document.body.removeChild(menuDiv);
            GetPaipusFromFile();
        };

        document.getElementById("cancel-download").onclick = function() {
            document.body.removeChild(menuDiv);
        };
    }

    // 创建状态显示元素
    function createStatusDiv() {
        const statusDiv = document.createElement("div");
        statusDiv.style.position = "fixed";
        statusDiv.style.top = "10px";
        statusDiv.style.right = "10px";
        statusDiv.style.padding = "10px";
        statusDiv.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
        statusDiv.style.color = "white";
        statusDiv.style.borderRadius = "5px";
        statusDiv.style.zIndex = "9999";
        document.body.appendChild(statusDiv);
        return statusDiv;
    }

    //********** 批量下载函数 **********

    function GetPaipusJSON(paipulinks = []) {
        // 如果没有提供牌谱链接，则提示用户输入多个链接或UUID
        if (paipulinks.length === 0) {
            const input = prompt("请输入多个牌谱链接或UUID（用逗号或换行符分隔）");
            if (!input || input.trim() === "") return;

            // 通过逗号或换行符分割获取多个链接
            paipulinks = input.split(/[,\n]/).map(link => link.trim()).filter(link => link !== "");
        }

        if (paipulinks.length === 0) return;

        // 创建下载状态显示元素
        const statusDiv = createStatusDiv();

        // 顺序处理链接，避免同时发送过多请求
        processNextLink(paipulinks, 0, statusDiv);
    }

    // 从文件加载牌谱链接/UUID
    function GetPaipusFromFile() {
        // 创建文件输入元素
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = '.txt';
        fileInput.style.display = 'none';
        document.body.appendChild(fileInput);

        // 设置文件读取逻辑
        fileInput.onchange = function() {
            const file = fileInput.files[0];
            if (!file) {
                document.body.removeChild(fileInput);
                return;
            }

            const reader = new FileReader();
            reader.onload = function(e) {
                const content = e.target.result;
                const links = content.split(/[\r\n,]+/).map(link => link.trim()).filter(link => link !== "");

                document.body.removeChild(fileInput);

                if (links.length > 0) {
                    const confirmMessage = `找到 ${links.length} 个链接/UUID。确认下载？`;
                    if (confirm(confirmMessage)) {
                        GetPaipusJSON(links);
                    }
                } else {
                    alert("文件中未找到有效的链接或UUID。");
                }
            };

            reader.readAsText(file);
        };

        // 触发文件选择对话框
        fileInput.click();
    }

    function processNextLink(paipulinks, index, statusDiv) {
        if (index >= paipulinks.length) {
            statusDiv.innerHTML = "所有下载已完成！";
            setTimeout(() => {
                document.body.removeChild(statusDiv);
            }, 3000);
            return;
        }

        const paipulink = paipulinks[index];
        statusDiv.innerHTML = `正在处理 ${index + 1}/${paipulinks.length}: ${paipulink}`;

        // 提取UUID
        let uuid = paipulink;
        if (paipulink.includes('=')) {
            const linkParts = paipulink.split('=');
            const uuidParts = linkParts[linkParts.length - 1].split('_');
            uuid = uuidParts[0];

            if (uuidParts.length > 2 && parseInt(uuidParts[2]) === 2) {
                uuid = game.Tools.DecodePaipuUUID(uuid);
            }
        }

        // 下载单个牌谱
        downloadSinglePaipu(uuid, () => {
            setTimeout(() => {
                processNextLink(paipulinks, index + 1, statusDiv);
            }, 500); // 串行下载，防止被ban
        });
    }

    //********** 单个牌谱下载和转换 **********

    function downloadSinglePaipu(uuid, callback) {
        const pbWrapper = net.ProtobufManager.lookupType(".lq.Wrapper");
        const pbGameDetailRecords = net.ProtobufManager.lookupType(".lq.GameDetailRecords");

        app.NetAgent.sendReq2Lobby(
            "Lobby",
            "fetchGameRecord",
            {game_uuid: uuid, client_version_string: GameMgr.Inst.getClientVersion()},
            function(error, gameRecord) {
                if (error) {
                    console.error(`下载 ${uuid} 时出错:`, error);
                    callback(); // 即使出错也调用回调继续下一个下载
                    return;
                }

                try {
                    // 转换为天凤格式并处理
                    let tenhouFormat = convertToTenhou(gameRecord);
                    downloadTenhouJSON(tenhouFormat, uuid);
                    callback();
                }
                catch (e) {
                    console.error(`处理 ${uuid} 时出错:`, e);
                    callback(); // 确保回调被调用，即使有错误发生
                }
            }
        );
    }


    function downloadTenhouJSON(data, uuid) {
        let a = document.createElement("a");
        a.href = URL.createObjectURL(
            new Blob([JSON.stringify(data, null, PRETTY ? "  " : null)],
                {type: "text/plain"}));
        a.download = "tenhou_" + uuid + ".json";
        a.style.display = "none";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        console.log(`成功下载天凤格式: ${uuid}`);
    }

    //********** 天凤格式转换核心函数 **********

    // 局信息，每个新一轮重置
    let kyoku = [];
    kyoku.init = function(leaf) {
        // [局, 本场, 立直棒] - 注意：4倍数对三麻有效
        this.nplayers = leaf.scores.length;
        this.round = [4 * leaf.chang + leaf.ju, leaf.ben, leaf.liqibang];
        this.initscores = leaf.scores; pad_right(this.initscores, 4, 0);
        this.doras = leaf.dora ? [tm2t(leaf.dora)] : leaf.doras.map(e => tm2t(e));
        this.draws = [[],[],[],[]];
        this.discards = [[],[],[],[]];
        this.haipais = this.draws.map((_, i) => leaf["tiles" + i] ? leaf["tiles" + i].map(f => tm2t(f)) : []);

        // 将庄家手牌中的最后一张视为摸牌
        if (this.haipais[leaf.ju] && this.haipais[leaf.ju].length) {
            this.poppedtile = this.haipais[leaf.ju].pop();
            this.draws[leaf.ju].push(this.poppedtile);
        }

        // 需要的信息，但不一定在每个记录中都有
        this.dealerseat = leaf.ju;
        this.ldseat = -1; // 谁打出的最后一张牌
        this.nriichi = 0; // 当前立直数 - 需要计分，流局标记
        this.nkan = 0; // 当前杠数 - 仅用于流局标记

        // 包牌规则
        this.nowinds = new Array(4).fill(0); // 每个玩家明风牌的计数
        this.nodrags = new Array(4).fill(0); // 每个玩家明三元牌的计数
        this.paowind = -1; // 提供最后一张风牌的座位，-1表示无人负责
        this.paodrag = -1; // 提供最后一张三元牌的座位

        return this;
    };

    // 导出局信息
    kyoku.dump = function(uras) {
        let entry = [];
        entry.push(kyoku.round);
        entry.push(kyoku.initscores);
        entry.push(kyoku.doras);
        entry.push(uras);
        kyoku.haipais.forEach((f, i) => {
            entry.push(f);
            entry.push(kyoku.draws[i]);
            entry.push(kyoku.discards[i]);
        });

        return entry;
    }

    // 包牌检查的牌
    const WINDS = ["1z", "2z", "3z", "4z"].map(e => tm2t(e));
    const DRAGS = ["5z", "6z", "7z", "0z"].map(e => tm2t(e)); // 0z是赤发

    // 包牌计数器 - 每次碰、大明杠、暗杠时调用
    kyoku.countpao = function(tile, owner, feeder) {
        // owner和feeder是座位号，tile应为天凤格式
        if (WINDS.includes(tile)) {
            if (4 == ++this.nowinds[owner])
                this.paowind = feeder;
        }
        else if (DRAGS.includes(tile)) {
            if (3 == ++this.nodrags[owner])
                this.paodrag = feeder;
        }

        return;
    }

    // seat1相对于seat0的位置
    function relativeseating(seat0, seat1) {
        // 0: 上家, 1: 对家, 2: 下家
        return (seat0 - seat1 + 4 - 1) % 4;
    }

    // 将mjs记录转换为天凤日志
    function generatelog(mjslog) {
        let log = [];
        mjslog.forEach((e, leafidx) => {
            switch (e.constructor.name) {
                case "RecordNewRound":
                {   // 新的一轮
                    kyoku.init(e);
                    return;
                }
                case "RecordDiscardTile":
                {   // 打牌 - 标记摸切和立直
                    let symbol = e.moqie ? TSUMOGIRI : tm2t(e.tile);

                    // 我们假装庄家的初始第14张牌是摸上来的 - 所以需要手动检查第一次打牌
                    if (e.seat == kyoku.dealerseat && !kyoku.discards[e.seat].length && symbol == kyoku.poppedtile)
                        symbol = TSUMOGIRI;

                    if (e.is_liqi) { // 立直宣言
                        kyoku.nriichi++;
                        symbol = "r" + symbol;
                    }
                    kyoku.discards[e.seat].push(symbol);
                    kyoku.ldseat = e.seat; // 用于荣和、碰等

                    // 有时候会在这里传入dora
                    if (e.doras && e.doras.length > kyoku.doras.length)
                        kyoku.doras = e.doras.map(f => tm2t(f));

                    return;
                }
                case "RecordDealTile":
                {   // 摸牌 - 杠后会传入新的dora
                    if (e.doras && e.doras.length > kyoku.doras.length)
                        kyoku.doras = e.doras.map(f => tm2t(f));

                    kyoku.draws[e.seat].push(tm2t(e.tile));

                    return;
                }
                case "RecordChiPengGang":
                {   // 副露 - 吃、碰、大明杠
                    switch (e.type) {
                        case 0:
                        {   // 吃
                            kyoku.draws[e.seat].push(
                                "c" +
                                tm2t(e.tiles[2]) +
                                tm2t(e.tiles[0]) +
                                tm2t(e.tiles[1])
                            );

                            return;
                        }
                        case 1:
                        {   // 碰
                            let worktiles = e.tiles.map(f => tm2t(f));
                            let idx = relativeseating(e.seat, kyoku.ldseat);
                            kyoku.countpao(worktiles[0], e.seat, kyoku.ldseat);
                            // 弹出被调用的牌并添加'p'前缀
                            worktiles.splice(idx, 0, "p" + worktiles.pop());
                            kyoku.draws[e.seat].push(worktiles.join(""));

                            return;
                        }
                        case 2:
                        {   // 大明杠
                            let calltiles = e.tiles.map(f => tm2t(f));
                            // < 上家 0 | 对家 1 | 下家 3 >
                            let idx = relativeseating(e.seat, kyoku.ldseat);

                            kyoku.countpao(calltiles[0], e.seat, kyoku.ldseat);
                            calltiles.splice(2 == idx ? 3 : idx, 0, "m" + calltiles.pop());
                            kyoku.draws[e.seat].push(calltiles.join(""));
                            // 天凤在discards中为此添加0
                            kyoku.discards[e.seat].push(0);
                            // 登记杠
                            kyoku.nkan++;

                            return;
                        }
                        default:
                            console.log(
                                "无法处理 " + e.constructor.name + "(" + leafidx + ")"
                            );

                        return;
                    }
                }
                case "RecordAnGangAddGang":
                {   // 杠 - 加杠'k', 暗杠'a'
                    // 注意：e.tiles只是一张牌；naki放在discards中
                    let til = tm2t(e.tiles);
                    kyoku.ldseat = e.seat; // 用于抢杠和，不会与上一个打牌冲突
                    switch (e.type) {
                        case 3:
                        {   // 暗杠
                            kyoku.countpao(til, e.seat, -1); // 计数该组为可见，但不设置包牌
                            // 从配牌和摸牌中获取用于暗杠的牌
                            // 这是愚蠢的因为可能涉及n个赤宝牌
                            let ankantiles = kyoku.haipais[e.seat].filter(t => (deaka(t) == deaka(til) ? true : false))
                                .concat(kyoku.draws[e.seat].filter(t => (deaka(t) == deaka(til) ? true : false)));
                            til = ankantiles.pop(); // 选哪张牌作为暗杠标记并不重要 - 选最后摸到的
                            kyoku.discards[e.seat].push(ankantiles.join("") + "a" + til); // 添加naki
                            kyoku.nkan++;

                            return;
                        }
                        case 2:
                        {   // 加杠
                            // 从.draws中获取碰副露并替换新符号
                            let nakis = kyoku.draws[e.seat].filter(w => {
                                if ('string' === typeof w) // naki
                                    return w.includes("p" + deaka(til)) || w.includes("p" + makeaka(til)); // 碰涉及相同类型的牌
                                else
                                    return false;
                            });

                            kyoku.discards[e.seat].push(nakis[0].replace(/p/, "k" + til)); // 添加naki
                            kyoku.nkan++;

                            return;
                        }
                        default:
                        {
                            console.log("不知道如何处理 "
                                + e.constructor.name + " type: " + e.type);

                            return;
                        }
                    }

                    return;
                }
                case "RecordBaBei":
                {   // 拔北 - 该记录（仅）提供{seat, moqie}
                    // 注意：天凤不会根据它们被摸到的时间标记北，所以我们也不会
                    kyoku.discards[e.seat].push("f44");

                   return;
                }
                /////////////////////////////////////////////////////
                // 局终了:
                // "RecordNoTile" - 流局
                // "RecordHule"   - 和了 - 荣和/自摸
                // "RecordLiuJu"  - 流局
                //////////////////////////////////////////////////////
                case "RecordLiuJu":
                {   // 流局
                    let entry = kyoku.dump([]);

                    if (1 == e.type)
                        entry.push([RUNES.kyuushukyuuhai[NAMEPREF]]); // 九种九牌
                    else if (2 == e.type)
                        entry.push([RUNES.suufonrenda[NAMEPREF]]); // 四风连打
                    else if (4 == kyoku.nriichi) // TODO: 实际获取类型代码
                        entry.push([RUNES.suuchariichi[NAMEPREF]]); // 四立直
                    else if (4 <= kyoku.nkan) // TODO: 实际获取类型代码
                        entry.push([RUNES.suukaikan[NAMEPREF]]); // 四开杠，在有4个杠的三家和上可能误报
                    else
                        entry.push([RUNES.sanchahou[NAMEPREF]]); // 三家和 - 实际上在mjs中无法获取

                    log.push(entry);

                    return;
                }
                case "RecordNoTile":
                {   // 流局
                    let entry = kyoku.dump([]);
                    let delta = new Array(4).fill(0.);

                    // 注意：mjs在每个人都(无)听时不会给出delta_scores - TODO: 减少这种过度复杂性
                    if (e.scores && e.scores[0] && e.scores[0].delta_scores && e.scores[0].delta_scores.length)
                        e.scores.forEach(f => f.delta_scores.forEach((g, i) => delta[i] += g)); // 对于罕见的多个流满，我们对数组求和

                    if (e.liujumanguan) // 流满
                        entry.push([RUNES.nagashimangan[NAMEPREF], delta])
                    else    // 正常流局
                        entry.push([RUNES.ryuukyoku[NAMEPREF], delta]);
                    log.push(entry);

                    return;
                }
                case "RecordHule":
                {   // 和了
                    let agari = [];
                    let ura = [];
                    e.hules.forEach(f => {
                        if (ura.length < (f.li_doras ? f.li_doras.length : 0)) // 取最长的里宝列表 - 双响中有立直+不宣
                            ura = f.li_doras.map(g => tm2t(g));
                        agari.push(parsehule(f, kyoku));
                    });
                    let entry = kyoku.dump(ura);

                    entry.push([RUNES.agari[JPNAME]].concat(agari.flat())); // 需要日语的和了
                    log.push(entry);

                    return;
                }
                default:
                    console.log("不知道如何处理 " + e.constructor.name + "(" + leafidx + ")");
                return;
            }
        });

        return log;
    }

    // 解析mjs和牌为天凤agari列表
    function parsehule(h, kyoku) {
        // 天凤日志查看器需要点、飜)或役満)结尾的字符串，记分字符串的其余部分完全是可选的
        // 谁赢了，点数来自(如果是自摸则是自己)，谁赢了或者如果是包牌：谁负责
        let res = [h.seat, h.zimo ? h.seat : kyoku.ldseat, h.seat];
        let delta = []; // 我们需要自己计算delta来处理双响/三响
        let points = 0;
        let rp = (-1 != kyoku.nriichi) ? 1000 * (kyoku.nriichi + kyoku.round[2]) : 0; // 立直棒点数，-1表示已经拿取
        let hb = 100 * kyoku.round[1]; // 本场支付基础

        // 包牌逻辑
        let pao = false;
        let liableseat = -1;
        let liablefor = 0;

        if (h.yiman) {
            // 只检查役满和牌
            h.fans.forEach(e => {
                if (DAISUUSHI == e.id && (-1 != kyoku.paowind)) {
                    // 大四喜包牌
                    pao = true;
                    liableseat = kyoku.paowind;
                    liablefor += e.val; // 现实中只能包一次
                }
                else if (DAISANGEN == e.id && (-1 != kyoku.paodrag)) {
                    pao = true;
                    liableseat = kyoku.paodrag;
                    liablefor += e.val;
                }
            });
        }

        if (h.zimo) {
            // 子家对庄家的支付
            delta = new Array(kyoku.nplayers).fill(-hb - h.point_zimo_xian - tlround((1/2) * (h.point_zimo_xian)))
            if (h.seat == kyoku.dealerseat) { // 庄家自摸
                delta[h.seat] = rp + (kyoku.nplayers - 1) * (hb + h.point_zimo_xian) + 2 * tlround((1/2) * (h.point_zimo_xian));
                points = h.point_zimo_xian + tlround((1/2) * (h.point_zimo_xian));
            }
            else { // 子家自摸
                delta[h.seat] = rp + hb + h.point_zimo_qin + (kyoku.nplayers - 2) * (hb + h.point_zimo_xian) + 2 * tlround((1/2) * (h.point_zimo_xian));
                delta[kyoku.dealerseat] = -hb - h.point_zimo_qin - tlround((1/2) * (h.point_zimo_xian));
                points = h.point_zimo_xian + "-" + h.point_zimo_qin;
            }
        }
        else {
            // 荣和
            delta = new Array(kyoku.nplayers).fill(0.)
            delta[h.seat] = rp + (kyoku.nplayers - 1) * hb + h.point_rong;
            delta[kyoku.ldseat] = -(kyoku.nplayers - 1) * hb - h.point_rong;
            points = h.point_rong;
            kyoku.nriichi = -1; // 标记立直棒已取，以防双响
        }

        // 包牌支付
        // 把包牌视为责任玩家偿还其他玩家 - 适用于多役满
        const OYA = 0;
        const KO = 1;
        const RON = 2;
        const YSCORE = [ // 役满得分表
            // 庄家,   子家,   荣和得分
            [0,      16000, 48000], // 庄家赢
            [16000,  8000,  32000]  // 子家赢
        ];

        if (pao) {
            res[2] = liableseat; // 这是天凤的做法 - 对于赤木或天凤.net/5似乎并不重要

            if (h.zimo) { // 责任玩家需要偿还n个役满自摸支付
                if (h.qinjia) { // 庄家自摸
                    // 应该将自摸损失视为荣和，幸运的是所有役满值都能安全地被北家分割
                    delta[liableseat] -= 2 * hb + liablefor * 2 * YSCORE[OYA][KO] + tlround((1/2) * liablefor * YSCORE[OYA][KO]); // 1? 只偿还其他子家
                    delta.forEach((e, i) => {
                        if (liableseat != i && h.seat != i && kyoku.nplayers >= i)
                            delta[i] += hb + liablefor * YSCORE[OYA][KO] + tlround((1/2) * liablefor * (YSCORE[OYA][KO]));
                    });
                    if (3 == kyoku.nplayers) // 庄家应该从责任者那里获得北家的支付
                        delta[h.seat] += (TSUMOLOSSOFF ? 0 : liablefor * YSCORE[OYA][KO]);
                }
                else { // 子家自摸
                    delta[liableseat] -= (kyoku.nplayers - 2) * hb + liablefor * (YSCORE[KO][OYA] + YSCORE[KO][KO]) + tlround((1/2) * liablefor * YSCORE[KO][KO]);
                    delta.forEach((e, i) => {
                        if (liableseat != i && h.seat != i && kyoku.nplayers >= i) {
                            if (kyoku.dealerseat == i)
                                delta[i] += hb + liablefor * YSCORE[KO][OYA] + tlround((1/2) * liablefor * YSCORE[KO][KO]);
                            else
                                delta[i] += hb + liablefor * YSCORE[KO][KO] + tlround((1/2) * liablefor * YSCORE[KO][KO]);
                        }
                    });
                }
            }
            else { // 荣和
                // 责任座位向放铳座位支付1/2役满+全部本场
                delta[liableseat] -= (kyoku.nplayers - 1) * hb + (1/2) * liablefor * YSCORE[h.qinjia ? OYA : KO][RON];
                delta[kyoku.ldseat] += (kyoku.nplayers - 1) * hb + (1/2) * liablefor * YSCORE[h.qinjia ? OYA : KO][RON];
            }
        } // if pao

        // 附加点数符号
        points += RUNES.points[JPNAME] + ((h.zimo && h.qinjia) ? RUNES.all[NAMEPREF] : "");

        // 得分字符串
        let fuhan = h.fu + RUNES.fu[NAMEPREF] + h.count + RUNES.han[NAMEPREF];
        if (h.yiman) // 役满
            res.push((SHOWFU ? fuhan : "") + RUNES.yakuman[NAMEPREF] + points);
        else if (13 <= h.count) // 数和役满
            res.push((SHOWFU ? fuhan : "") + RUNES.kazoeyakuman[NAMEPREF] + points);
        else if (11 <= h.count) // 三倍满
            res.push((SHOWFU ? fuhan : "") + RUNES.sanbaiman[NAMEPREF] + points);
        else if (8 <= h.count) // 倍满
            res.push((SHOWFU ? fuhan : "") + RUNES.baiman[NAMEPREF] + points);
        else if (6 <= h.count) // 跳满
            res.push((SHOWFU ? fuhan : "") + RUNES.haneman[NAMEPREF] + points);
        else if (5 <= h.count || (4 <= h.count && 40 <= h.fu) || (3 <= h.count && 70 <= h.fu)) // 满贯
            res.push((SHOWFU ? fuhan : "") + RUNES.mangan[NAMEPREF] + points);
        else if (ALLOW_KIRIAGE && ((4 == h.count && 30 == h.fu) || (3 == h.count && 60 == h.fu))) // 切上满贯
            res.push((SHOWFU ? fuhan : "") + RUNES.kiriagemangan[NAMEPREF] + points);
        else // 普通和牌
            res.push(fuhan + points);

        h.fans.forEach(e => res.push(
            (JPNAME == NAMEPREF ? cfg.fan.fan.map_[e.id].name_jp : cfg.fan.fan.map_[e.id].name_en)
            + "(" + (h.yiman ? (RUNES.yakuman[JPNAME]) : (e.val + RUNES.han[JPNAME])) + ")"
        ));

        return [pad_right(delta, 4, 0.), res];
    }

    // 将'2m'转换为2 + 10等
    function tm2t(str) {
        // 天凤的牌编码:
        //   11-19    - 1-9万
        //   21-29    - 1-9筒
        //   31-39    - 1-9索
        //   41-47    - 东南西北 白发中
        //   51,52,53 - 赤5万, 赤5筒, 赤5索
        let num = parseInt(str[0]);
        const tcon = { m: 1, p: 2, s: 3, z: 4 };

        return num ? 10 * tcon[str[1]] + num : 50 + tcon[str[1]];
    }

    // 从赤牌返回普通牌，天凤表示
    function deaka(til) {
        if (5 == ~~(til/10))
            return 10*(til%10)+(~~(til/10));

        return til;
    }

    // 返回牌的赤版本
    function makeaka(til) {
        if (5 == (til%10)) // 是5(或白)
            return 10*(til%10)+(~~(til/10));
        return til; // 不能是/已经是赤牌
    }

    // 如果TSUMOLOSSOFF==true则向上取整到最接近的百，否则返回0
    function tlround(x) {
        return TSUMOLOSSOFF ? 100*Math.ceil(x/100) : 0;
    }

    // 将a填充到长度l，用f填充，用于填充日志为>三麻
    const pad_right = (a, l, f) =>
        !Array.from({length: l - a.length})
        .map(_ => a.push(f)) || a;

    // 将mjs记录转换为天凤格式
    function convertToTenhou(record) {
        let res = {};
        let ruledisp = "";
        let lobby = ""; // 通常为0，是自定义房间号
        let nplayers = record.head.result.players.length;
        let nakas = nplayers - 1; // 默认

        // 提取牌谱记录
        var mjslog = [];
        var mjsact = net.MessageWrapper.decodeMessage(record.data).actions;
        mjsact.forEach(e => {
            if (e.result && e.result.length !== 0)
                mjslog.push(net.MessageWrapper.decodeMessage(e.result))
        });

        res["log"] = generatelog(mjslog);

        // PF4是四麻，PF3是三麻
        // 规则显示
        if (3 == nplayers && JPNAME == NAMEPREF)
            ruledisp += RUNES.sanma[JPNAME];
        if (record.head.config.meta.mode_id) // 排位或休闲
            ruledisp += (JPNAME == NAMEPREF) ?
                cfg.desktop.matchmode.map_[record.head.config.meta.mode_id].room_name_jp
                : cfg.desktop.matchmode.map_[record.head.config.meta.mode_id].room_name_en;
        else if (record.head.config.meta.room_id) // 友人场
        {
            lobby = ": " + record.head.config.meta.room_id; // 可以设置房间号为大厅号
            ruledisp += RUNES.friendly[NAMEPREF]; // "友人战";
            nakas = record.head.config.mode.detail_rule.dora_count;
            TSUMOLOSSOFF = (3 == nplayers) ? !record.head.config.mode.detail_rule.have_zimosun : false;
        }
        else if (record.head.config.meta.contest_uid) // 比赛
        {
            lobby = ": " + record.head.config.meta.contest_uid;
            ruledisp += RUNES.tournament[NAMEPREF]; // "大会战";
            nakas = record.head.config.mode.detail_rule.dora_count;
            TSUMOLOSSOFF = (3 == nplayers) ? !record.head.config.mode.detail_rule.have_zimosun : false;
        }
        if (1 == record.head.config.mode.mode) {
            ruledisp += RUNES.tonpuu[NAMEPREF]; // " 东风战";
        }
        else if (2 == record.head.config.mode.mode) {
            ruledisp += RUNES.hanchan[NAMEPREF]; // " 东南战";
        }

        if (!record.head.config.meta.mode_id && !record.head.config.mode.detail_rule.dora_count) {
            if (JPNAME != NAMEPREF)
                ruledisp += RUNES.nored[NAMEPREF];
            res["rule"] = {"disp": ruledisp, "aka53": 0, "aka52": 0, "aka51": 0};
        }
        else {
            if (JPNAME == NAMEPREF)
                ruledisp += RUNES.red[JPNAME];
            res["rule"] = {"disp": ruledisp, "aka": 1};
        }

        // 玩家名称
        res["name"] = new Array(4).fill('AI');
        if (record.head.accounts) {
            record.head.accounts.forEach(e => res["name"][e.seat] = e.nickname);
        }
        // 为三麻AI清理
        if (3 == nplayers) {
            res["name"][3] = "";
        }

        // 可选标题 - 为什么不在这里给出房间号和时间戳; 1000用于unix到.js时间戳的转换
        res["title"] = [
            ruledisp + lobby,
            (new Date(record.head.end_time * 1000)).toLocaleString()
        ];

        // 可选地导出mjs记录，注意：这可能会使文件太大，无法在tenhou.net/5查看器中使用
        if (VERBOSELOG) {
            res["mjshead"] = record.head;
            res["mjslog"] = mjslog;
            res["mjsrecordtypes"] = mjslog.map(e => e.constructor.name);
        }

        return res;
    }
    //********** 键盘监听 **********

    // 检查界面状态
    function checkscene(scene) {
        return scene && ((scene.Inst && scene.Inst._enable) || (scene._Inst && scene._Inst._enable));
    }



    //********** 辅助函数 **********
    // 为UI添加批量下载按钮
    function addDownloadButton() {
        // 等待游戏UI加载完成
        const checkInterval = setInterval(() => {
            if (uiscript && uiscript.UI_Sushe) {
                clearInterval(checkInterval);

                // 创建批量下载按钮
                const downloadBtn = document.createElement('button');
                downloadBtn.textContent = '批量下载牌谱';
                downloadBtn.style.position = 'fixed';
                downloadBtn.style.bottom = '20px';
                downloadBtn.style.right = '20px';
                downloadBtn.style.padding = '10px';
                downloadBtn.style.backgroundColor = '#4CAF50';
                downloadBtn.style.color = 'white';
                downloadBtn.style.border = 'none';
                downloadBtn.style.borderRadius = '5px';
                downloadBtn.style.cursor = 'pointer';
                downloadBtn.style.zIndex = '9999';

                downloadBtn.addEventListener('click', showDownloadMenu);

                document.body.appendChild(downloadBtn);
            }
        }, 1000);
    }

    // 初始化
    addDownloadButton();

    console.log("雀魂牌谱批量下载+天凤格式转换器已加载，按's'键下载当前牌谱，或点击右下角按钮批量下载");
})();