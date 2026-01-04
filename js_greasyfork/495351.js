// ==UserScript==
// @name         【限定公開】RPGEN - チート
// @namespace    https://tampermonkey.net/
// @version      2.4
// @description  RPGENで悪いことができる
// @author       You
// @match        https://rpgen.org/dq/?map=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=rpgen.site
// @license      MIT
// @grant        GM.registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/495351/%E3%80%90%E9%99%90%E5%AE%9A%E5%85%AC%E9%96%8B%E3%80%91RPGEN%20-%20%E3%83%81%E3%83%BC%E3%83%88.user.js
// @updateURL https://update.greasyfork.org/scripts/495351/%E3%80%90%E9%99%90%E5%AE%9A%E5%85%AC%E9%96%8B%E3%80%91RPGEN%20-%20%E3%83%81%E3%83%BC%E3%83%88.meta.js
// ==/UserScript==

(async window => {
    const {$} = window;

    /**
     * rpgen3 JavaScript モジュールを使うためのお作法
     */
    const {importAll, getScript} = await import(`https://rpgen3.github.io/mylib/export/import.mjs`);
    const rpgen3 = await importAll([
        ...[
            'input',
            'util',
        ].map(v => `https://rpgen3.github.io/mylib/export/${v}.mjs`),
        'https://rpgen3.github.io/maze/mjs/search/aStar.mjs',
    ]);

    /**
     * TampermonkeyのGUI
     */
    GM.registerMenuCommand('チートUIを表示する', () => {
        html.empty().show();
        initGUI();
        initInterruptRPGENMapMoving();
        initInterruptRPGENRender();
        initInterruptRPGENEvent();
    });

    const commentFlow = document.getElementById("idCanvasDqCommentsFlowArea");
    const dqCanvas = document.getElementById("idCanvasDq");

    /**
     * GUIの親玉
     */
    const html = $('<div>').appendTo($('body')).css({
        'text-align': 'center',
        padding: '1em',
        'user-select': 'none',
        color: 'white',
        backgroundColor: 'rgba(0,0,0,0.7)',
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 999
    }).hide().on('keypress keydown keyup', event => {
        dqCanvas.dispatchEvent(new KeyboardEvent(event.type, event));
    });

    const calcRPGEN = () => {
        // キャンバスの論理的なサイズと実際の表示サイズの比率
        const xHtmlScale = dqCanvas.offsetWidth / dqCanvas.width;
        const yHtmlScale = dqCanvas.offsetHeight / dqCanvas.height;

        // タイルの実際の表示サイズ
        const tileWidth = window.dq.CHIP_SIZE_X * (window.clip_s / window.dq.scaleMultiplier) * xHtmlScale;
        const tileHeight = window.dq.CHIP_SIZE_Y * (window.clip_s / window.dq.scaleMultiplier) * yHtmlScale;

        // 論理的なサイズ上で非表示になっているタイル数
        const tileXOffset = window.dq.getOffsetX() / window.dq.CHIP_SIZE_X;
        const tileYOffset = window.dq.getOffsetY() / window.dq.CHIP_SIZE_Y;

        // 実際の表示サイズで画面左が0からいくつずれているか
        const xOffset = tileXOffset * tileWidth;
        const yOffset = tileYOffset * tileHeight;

        return {tileWidth, tileHeight, xOffset, yOffset};
    };

    let clickedX = -1;
    let clickedY = -1;
    let onClickRPGENCanvasForDisp = null;
    let onClickRPGENCanvas = null;

    /**
     * RPGENのクリックの座標取得
     */
    commentFlow.addEventListener('mousedown', event => {
        // 要素内でのクリック位置
        const rect = commentFlow.getBoundingClientRect();
        const relativeClickX = event.clientX - rect.left;
        const relativeClickY = event.clientY - rect.top;

        const {tileWidth, tileHeight, xOffset, yOffset} = calcRPGEN();

        // 0からの相対的なクリック位置
        const x = xOffset + relativeClickX;
        const y = yOffset + relativeClickY;

        // クリックしたタイルの位置
        clickedX = Math.floor(x / tileWidth);
        clickedY = Math.floor(y / tileHeight);

        if (onClickRPGENCanvasForDisp) {
            onClickRPGENCanvasForDisp(clickedX, clickedY);
        }

        if (onClickRPGENCanvas) {
            onClickRPGENCanvas(clickedX, clickedY);
        }
    });

    /**
     * GUIの初期化
     */
    const initGUI = () => {
        const head = $('<div>').appendTo(html),
              body = $('<div>').appendTo(html),
              foot = $('<div>').appendTo(html);
        $('<span>').appendTo(head).text('RPGENチート');
        rpgen3.addBtn(head, '×', () => {
            html.hide();
        }).css({
            color: 'white',
            backgroundColor: 'red'
        });
        const isGuide = rpgen3.addInputBool(body, {
            label: 'クリックした場所を光らせる',
            save: true,
            value: true
        });
        const GUIDE_LOOP_TIME = 800; // 発光のループ間隔
        interruptedRPGENRender = () => {
            if (isGuide() && clickedX !== -1 && clickedY !== -1) {
                const rate = (performance.now() | 0) % GUIDE_LOOP_TIME / GUIDE_LOOP_TIME;
                const n = 50 + 30 * rate | 0;
                window.ctx.fillStyle = `hsla(319deg,43%,${n}%,${n}%)`;
                const {tileWidth, tileHeight, xOffset, yOffset} = calcRPGEN();
                window.ctx.fillRect(clickedX * tileWidth - xOffset,
                                    clickedY * tileHeight - yOffset,
                                    tileWidth,
                                    tileHeight);
            }
        };
        const dispPositionOnClickRPGENCanvas = $('<div>').appendTo(body);
        onClickRPGENCanvasForDisp = (x, y) => {
            rpgen3.addInputStr(dispPositionOnClickRPGENCanvas.empty(),{
                label: 'クリックした座標',
                value: `${x}, ${y}`,
                copy: true
            });
        };
        const list = {
            'ここから選択': $('<div>').text('選択しろ'),
            'シンプルチート': $('<div>'),
            'プレイヤーの座標': $('<div>'),
            '他人の追跡': $('<div>'),
            'ランダム着せ替え': $('<div>'),
            'スイッチの切り替え': $('<div>'),
            '所持金の変更': $('<div>'),
            'カメラの移動': $('<div>'),
            'BBSを読む': $('<div>'),
            'イベント監視': $('<div>'),
        };
        const select = rpgen3.addSelect(body,{
            list, label: 'チートコマンド'
        });
        select.elm.on('change', () => {
            select().appendTo(foot.empty());
        });
        {
            const h = list['シンプルチート'];
            rpgen3.addBtn(h, '開錠', () => {
                window.g_isEditable = true;
            });
            rpgen3.addBtn(h, 'イベント脱出', () => {
                window.rpgEG.isExecuting = false;
            });
        }
        {
            const h = list['プレイヤーの座標'];
            const input = rpgen3.addInputStr(h,{
                label: '座標入力'
            });
            rpgen3.addBtn(h, '瞬間移動', () => window.gotoPosByClick(...getInputPosition(input)));
            rpgen3.addBtn(h, 'オート移動', () => autoMoving.init(...getInputPosition(input)));
            rpgen3.addBtn(h, '取得', () => {
                const {targetTileX, targetTileY} = window.humans[0];
                rpgen3.addInputStr(result.empty(),{
                    label: '現在地',
                    value: `${targetTileX}, ${targetTileY}`,
                    copy: true
                });
            });
            const result = $('<div>').appendTo(h);
            const isAutoMovingOnClick = rpgen3.addInputBool(h, {
                label: 'クリックした場所にオート移動',
                save: true,
                value: false
            });
            onClickRPGENCanvas = (x, y) => {
                if (isAutoMovingOnClick()) {
                    autoMoving.init(x, y);
                }
            };
            const dispUpdateAutoMoving = $('<div>').appendTo(h);
            onUpdateAutoMoving = (msg) => {
                dispUpdateAutoMoving.text(msg);
            };
        }
        {
            const h = list['他人の追跡'];
            const toImg = src => $('<img>').prop({src});
            rpgen3.addBtn(h, '更新', () => {
                const map = new Map();
                for (const human of window.humans) {
                    if(human.isEnable && !human.isPlayerChild && human.selfId > 49 && !Number.isNaN(human.graphicId)) {
                        map.set(human.selfId, getImage(human));
                    }
                }
                if (map.size) {
                    const table = $('<table>').appendTo(output.empty()),
                          thead = $('<thead>').appendTo(table),
                          tr = $('<tr>').appendTo(thead);
                    for(const th of ['ID', '服装', '座標', 'ささやき']) {
                        $('<th>').appendTo(tr).text(th);
                    }
                    const tbody = $('<tbody>').appendTo(table);
                    for(const human of window.humans) {
                        if (map.has(human.selfId)) {
                            const tr = $('<tr>').appendTo(thead);
                            $('<td>').appendTo(tr).text(human.selfId);
                            $('<td>').appendTo(tr).append(map.get(human.selfId));
                            const {targetTileX, targetTileY, nchat} = human;
                            $('<td>').appendTo(tr).text(`(${targetTileX}, ${targetTileY})`);
                            $('<td>').appendTo(tr).text(String(nchat).slice(0, 5));
                            tr.on('click', () => autoMoving.init(targetTileX, targetTileY));
                        }
                    }
                } else {
                    $('<div>').appendTo(output.empty()).text('そのマップには　ダレモイナイ。');
                }
            });
            const output = $('<div>').appendTo(h).css({
                overflow: 'scroll',
                maxHeight: '50vh'
            });
            const getImage = human => {
                if(human.isSAnim) {
                    return toImg(`https://rpgen.cc/dq/sAnims/res/${human.graphicId}s.png`);
                }
                if(human.graphicId < 0) {
                    return toImg(`https://rpgen.site/dq/sprites/${Math.abs(human.graphicId)}/sprite.png`);
                }
                return getDqChar(human.graphicId);
            };
            const hImgDqChar = $('<img>').prop({
                src: 'img/dq/char.png'
            }).get(0);
            const getDqChar = i => {
                const width = 16,
                      height = 16,
                      cv = $('<canvas>').prop({width, height}),
                      ctx = cv.get(0).getContext('2d');
                ctx.drawImage(hImgDqChar, 3, 79 + 128 * i, width, height, 0, 0, width, height);
                return cv;
            };
        }
        const RPGEN_LATEST_SANIM_ID = 2100;
        {
            const h = list['ランダム着せ替え'];
            rpgen3.addBtn(h, 'ランダム着せ替え', () => {
                window.humans[0].isSAnim = true;
                window.humans[0].graphicId = RPGEN_LATEST_SANIM_ID * Math.random() | 0;
                window.dq.setLocalPartyGraphics();
                window.dqSock.sendInfoMyHero();
            });
        }
        {
            const h = list['カメラの移動'];
            const input = rpgen3.addInputStr(h,{
                label: '座標入力'
            });
            rpgen3.addBtn(h, '移動', () => window.dq.setCamera(...getInputPosition(input)));
            rpgen3.addBtn(h, 'カメラ固定解除', () => window.dq.setCameraDefault());
        }
        {
            const h = list['スイッチの切り替え'];
            const isON = rpgen3.addInputBool(h, {
                label: 'ONだけ表示',
                save: true,
                value: true
            });
            rpgen3.addBtn(h, '更新', () => {
                output.empty();
                for(let i = 0; i < 100; i++) {
                    const value = window.rpgEG.switches[i];
                    if(isON() && !value) continue;
                    const input = rpgen3.addInputBool(output, {
                        value, label: i + 1,
                    });
                    input.elm.on('change', () => {
                        window.rpgEG.switches[i] = input();
                    });
                }
            });
            const output = $('<div>').appendTo(h).css({
                overflow: 'scroll',
                maxHeight: '50vh'
            });
        }
        {
            const h = list['所持金の変更'];
            const input = rpgen3.addInputStr(h,{
                label: 'ゴールド'
            });
            rpgen3.addBtn(h, '変更', () => {
                window.rpgEG.gold = Number(input());
            });
            rpgen3.addBtn(h, '表示', () => {
                window.dq.isGoldVisible = !window.dq.isGoldVisible;
            });
        }
        {
            const h = list['BBSを読む'];
            const input = rpgen3.addInputStr(h,{
                label: '座標入力'
            });
            const fetchBBS = async (x = -1, y = -1) => {
                if(x === -1) [x, y] = getInputPosition(input);
                const value = await (await fetch(`https://rpgen.site/dq/libs/myLibs/loadContent.php?url=${encodeURIComponent(
                    `https://rpgen.site/dq/maps/${window.dq.mapNum}/thread${x}_${y}.y3`
                )}`)).text();
                rpgen3.addInputStr(result.empty(),{
                    value,
                    copy: true,
                    textarea: true,
                });
            };
            rpgen3.addBtn(h, '座標のBBSを開く', () => fetchBBS());
            rpgen3.addBtn(h, '正面のBBSを開く', () => {
                const {targetTileX, targetTileY, dir} = window.humans[0],
                      d = getDirection(dir);
                fetchBBS(...[targetTileX, targetTileY].map((v, i) => v + d[i]));
            });
            const result = $('<div>').appendTo(h);
        }
        {
            const h = list['イベント監視'];
            selectDebugMode = rpgen3.addSelect(h, {
                label: 'デバッグ',
                list: {
                    'OFF': DEBUG_MODE_OFF,
                    'ブレークポイント': BREAKPOINT_RUN_MODE,
                    'ステップ実行': STEP_RUN_MODE,
                }
            });
            selectDebugMode.elm.on('change', () => {
                nextStep = true;
            });
            rpgen3.addBtn(h, '次のステップ', () => {
                nextStep = true;
            });
            breakPoint = rpgen3.addInputStr(h,{
                label: 'ブレークポイントのコマンド名',
                save: true,
            });
            const result = $('<div>').appendTo(h);
            viewRPGENEventCommand = rpgenEventCommand => {
                result.empty();
                Object.entries(rpgenEventCommand).map(([label,value]) => rpgen3.addInputStr(result,{
                    label,
                    value,
                    copy: true,
                    textarea: true,
                }));
            };
        }
    };

    // 汎用関数

    /**
     * 1回きり実行できる関数
     */
    const onceFunction = func => {
        let done = false;
        return () => {
            if (done) {
                return;
            } else {
                done = true;
                func();
            }
        };
    };

    /**
     * 座標系の入力値の取得
     */
    const getInputPosition = input => {
        const m = input().match(/[0-9]+/g);
        if(m && m.length === 2) {
            return m.map(Number);
        } else {
            throw 'Invalid (x, y) input';
        }
    };

    /**
     * 方向を使いやすい形式に変換する
     */
    const getDirection = d => {
        switch(d) {
            case 0: return [0, -1];
            case 1: return [1, 0];
            case 2: return [0, 1];
            case 3: return [-1, 0];
        }
    };

    // 人間を模倣した自動移動関連

    /**
     * 座標差分から方向を計算する
     */
    const calcDirection = (x, y) => {
        const me = window.humans[0];
        const _x = me.oldTileX - x;
        const _y = me.oldTileY - y;
        if (_x === 0 && _y === 0 || _x !== 0 && _y !== 0) { // 不動または斜め移動
            return null;
        } else if (_x === -1) {
            return window.dq.EAST;
        } else if (_x === 1) {
            return window.dq.WEST;
        } else if (_y === -1) {
            return window.dq.SOUTH;
        } else if (_y === 1) {
            return window.dq.NORTH;
        } else { // 2歩以上進むな
            return null;
        }
    };

    /**
     * 移動中か？
     */
    const checkHeroMoving = () => {
        const me = window.humans[0];
        return me.targetTileX !== me.oldTileX || me.targetTileY !== me.oldTileY;
    };

    /**
     * 1マス進む
     */
    const moveHero = (direction) => {
        if (window.dq.isMapMoving || window.rpgEG.isExecuting) {
            return false;
        }
        let vecX = 0;
        let vecY = 0;
        if (!window.dq.isMessaging) {
            switch (direction) {
                case window.dq.WEST: vecX--; break;
                case window.dq.NORTH: vecY--; break;
                case window.dq.EAST: vecX++; break;
                case window.dq.SOUTH: vecY++; break;
            }
        }
        const me = window.humans[0];
        const moveCompleted = me.targetTileX === me.oldTileX && me.targetTileY === me.oldTileY
        const canMove = !window.dq.isXMenuEnable && moveCompleted;
        if (!canMove) {
            return false;
        }
        const oldMeDir = me.dir;
        for (const human of window.humans) {
            if (!human.isPC || window.dq.isMessaging) {
                continue;
            }
            human.dir = oldMeDir;
            if (human.oldTileX !== me.oldTileX || human.oldTileY !== me.oldTileY) {
                human.targetTileX = me.oldTileX;
                human.targetTileY = me.oldTileY;
            }
        }
        if (!window.dq.isEditMode) { // Moving floor
            switch (window.dq.floor[me.targetTileY][me.targetTileX]) {
                case "16_13": vecX = 0; vecY = -1; break;
                case "16_14": vecX = -1; vecY = 0; break;
                case "17_13": vecX = 1; vecY = 0; break;
                case "17_14": vecX = 0; vecY = 1; break;
            }
        }
        const meOldTileX = me.oldTileX;
        const meOldTileY = me.oldTileY;
        me.targetTileX += vecX;
        me.targetTileY += vecY;
        if (vecX > 0) {
            me.dir = window.dq.EAST;
        } else if (vecX < 0) {
            me.dir = window.dq.WEST;
        }
        if (vecY < 0) {
            me.dir = window.dq.NORTH;
        } else if (vecY > 0) {
            me.dir = window.dq.SOUTH;
        }
        if (me.numChildren > 0 && (vecX !== 0 || vecY !== 0) && window.dqIsOKToMove(0, window.dq.isEditMode, true)) { // Hero's party
            for (let c = window.dq.MAX_CHILD - 1; c >= 0; c--) {
                const ch = me.children[c];
                if (!ch.isEnable) {
                    continue;
                }
                const prIdx = ch.parasiteId;
                const ph = window.humans[prIdx];
                if (c === 0) { // 1st child
                    const cVecX = ph.targetTileX - meOldTileX;
                    const cVecY = ph.targetTileY - meOldTileY;
                    if (cVecX > 0) {
                        ph.dir = window.dq.WEST;
                    } else if (cVecX < 0) {
                        ph.dir = window.dq.EAST;
                    } else if (cVecY > 0) {
                        ph.dir = window.dq.NORTH;
                    } else if (cVecY < 0) {
                        ph.dir = window.dq.SOUTH;
                    }
                    ph.targetTileX = meOldTileX;
                    ph.targetTileY = meOldTileY;
                } else {
                    ph.dir = window.humans[me.children[c - 1].parasiteId].dir;
                    ph.targetTileX = window.humans[me.children[c - 1].parasiteId].oldTileX;
                    ph.targetTileY = window.humans[me.children[c - 1].parasiteId].oldTileY;
                }
            }
            window.dq.setChildrenEnable(0, true);
        }
        return true;
    };

    const movingFloorTiles = new Set(["16_13", "16_14", "17_13", "17_14"]);

    /**
     * 当たり判定取得
     */
    const getCollisionDetection = (x, y) => {
        const i = rpgen3.toI(RPGEN_MAP_WIDTH, x, y);
        if (o1Map.array[i].size !== 0) {
            return true; // 人、移動ポイント、イベントにぶつかる
        }
        if (window.dqIsColMapObject(x, y)) {
            return true; // 地形にぶつかる
        }
        const floor = window.dq.floor[y][x];
        if (movingFloorTiles.has(floor)) {
            return true; // 動く床
        }
        return false;
    };

    const RPGEN_MAP_WIDTH = 300;

    /**
     * 最短経路計算
     */
    const calcShortestRoute = async (x, y) => {
        const me = window.humans[0];
        const sortestRoute = await rpgen3.aStar({
            maze: [...Array(RPGEN_MAP_WIDTH * RPGEN_MAP_WIDTH).keys()].map(i => getCollisionDetection(...rpgen3.toXY(RPGEN_MAP_WIDTH, i))),
            start: [me.oldTileX, me.oldTileY],
            goal: [x, y],
            update: () => {}, // 途中計算は表示しない
            heuristic: (x, y, _x, _y) => Math.abs(_x - x) + Math.abs(_y - y), // マンハッタン距離
            width: RPGEN_MAP_WIDTH,
            height: RPGEN_MAP_WIDTH,
            dfs: false, // 弱い探索にしない
            giveup: false, // 弱い探索にしない
        });
        return sortestRoute;
    }

    const AUTO_MOVING_LOOP_TIME = 100; // 基本のループ間隔
    const AUTO_MOVING_RECALC_TIME = 2000; // 再計算間隔

    /**
     * オート移動
     */
    const autoMoving = new class {
        constructor() {
            this.isEnable = false;
            this.latestRecalcTime = 0; // 最後に再計算した時刻
            this.goalX = 0;
            this.goalY = 0;
            this.route = [];
        }
        init(x, y) {
            if (x >= 0 && x < RPGEN_MAP_WIDTH && y >= 0 && y < RPGEN_MAP_WIDTH && !getCollisionDetection(x, y)) {
                this.isEnable = true;
                this.latestRecalcTime = 0;
                this.goalX = x;
                this.goalY = y;
                this.route = [];
            } else {
                this.isEnable = false;
            }
        }
        async update() {
            if (!this.isEnable || checkHeroMoving()) {
                return;
            }
            if (performance.now() - this.latestRecalcTime > AUTO_MOVING_RECALC_TIME) {
                this.latestRecalcTime = performance.now();
                try {
                    this.route = await calcShortestRoute(this.goalX, this.goalY);
                    this.route.shift(); // 初期位置は不要
                    return '再計算';
                } catch (err) {
                    this.route = [];
                    this.isEnable = false;
                    console.warn('最短経路計算のエラーかも');
                    console.error(err);
                    return '到達不可能';
                }
            }
            if (this.route.length === 0) {
                this.isEnable = false;
                return '到達';
            }
            const next = this.route.shift();
            const direction = calcDirection(...rpgen3.toXY(RPGEN_MAP_WIDTH, next));
            if (direction !== null) {
                moveHero(direction);
                if (checkHeroMoving() === false) {
                    this.isEnable = false;
                    return '不具合A';
                }
            } else {
                this.isEnable = false;
                return '不具合B';
            }
        }
    };
    let onUpdateAutoMoving = null;
    setInterval(async () => {
        const msg = await autoMoving.update();
        if (msg && onUpdateAutoMoving) {
            onUpdateAutoMoving(`${msg}(${rpgen3.getTime(null, 9)})`);
        }
    }, AUTO_MOVING_LOOP_TIME);

    const o1Map = new class {
        constructor() {
            this.array = [];
        }
        #update(human, x, y) {
            const i = rpgen3.toI(RPGEN_MAP_WIDTH, human._oldTileX, human._oldTileY);
            this.array[i]?.delete(human);
            if (0 <= x && x < RPGEN_MAP_WIDTH &&
                0 <= y && y < RPGEN_MAP_WIDTH) {
                const i = rpgen3.toI(RPGEN_MAP_WIDTH, x, y);
                this.array[i].add(human);
            }
        };
        #initPoints(points) {
            for (const point of points) {
                if (point.isEnable) {
                    const i = rpgen3.toI(RPGEN_MAP_WIDTH, point.tileX, point.tileY);
                    this.array[i].add(point);
                }
            }
        }
        init() {
            this.array = [...Array(RPGEN_MAP_WIDTH * RPGEN_MAP_WIDTH)].map(() => new Set());
            this.#initPoints(window.mPoints);
            this.#initPoints(window.rpgEG.ePoints);
            for (const human of window.humans) {
                if (!human.isEnable || human.selfId === 0 || human.selfId > 49) {
                    continue;
                }
                const that = this;
                Object.defineProperties(human, {
                    _oldTileX: {
                        value: human.oldTileX,
                        configurable: false,
                        enumerable: false,
                        writable: true
                    },
                    _oldTileY: {
                        value: human.oldTileY,
                        configurable: false,
                        enumerable: false,
                        writable: true
                    },
                    oldTileX: {
                        set(value) {
                            that.#update(human, value, this._oldTileY);
                            this._oldTileX = value;
                        },
                        get() {
                            return this._oldTileX;
                        },
                        configurable: true,
                        enumerable: true
                    },
                    oldTileY: {
                        set(value) {
                            that.#update(human, this._oldTileX, value);
                            this._oldTileY = value;
                        },
                        get() {
                            return this._oldTileY;
                        },
                        configurable: true,
                        enumerable: true
                    }
                });
                that.#update(human, human.oldTileX, human.oldTileY);
            }
        }
    };

    /**
     * RPGENのマップ移動に介入
     */
    const initInterruptRPGENMapMoving = onceFunction(() => {
        o1Map.init();
        Object.defineProperties(window.dq, {
            _isMapMoving: {
                value: window.dq.isMapMoving,
                configurable: false,
                enumerable: false,
                writable: true
            },
            isMapMoving: {
                set(value) {
                    if (this._isMapMoving === true && value === false) {
                        o1Map.init();
                    }
                    this._isMapMoving = value;
                },
                get() {
                    return this._isMapMoving;
                },
                configurable: true,
                enumerable: true
            },
        });
    });

    // イベント監視

    /**
     * RPGENのイベント整形クラス
     */
    class RPGENEventCommand {
        constructor(eventPoint) {
            this.position = [
                eventPoint.tileX,
                eventPoint.tileY,
            ];
            this.phase = eventPoint.curPhase;
            const {curStep} = window.rpgEG;
            this.step = curStep;
            this.args = window.rpgEG.getCommandArgs(
                eventPoint.phases[eventPoint.curPhase].eventList,
                curStep,
            );
        }
    }

    const DEBUG_MODE_OFF = 0;
    const BREAKPOINT_RUN_MODE = 1;
    const STEP_RUN_MODE = 2;
    let rpgenEventCommand = null;
    let viewRPGENEventCommand = null;
    let selectDebugMode = null;
    let nextStep = true;
    let breakPoint = null;

    /**
     * RPGENのイベントに介入
     */
    const initInterruptRPGENEvent = onceFunction(() => {
        const {advanceCommandStep, popEvent} = window.rpgEG;

        const advanceCommandStep2 = function () {
            switch(selectDebugMode()) {
                case STEP_RUN_MODE:
                    nextStep = false;
                    break;
                case BREAKPOINT_RUN_MODE:
                    if (breakPoint() && breakPoint() === rpgenEventCommand.args[0]) {
                        nextStep = false;
                    }
                    break;
            }
            return advanceCommandStep.call(this);
        };

        const popEvent2 = function (...args) {
            if (selectDebugMode() > 0) {
                if (nextStep === false) {
                    return;
                }
            }
            const index = args[0];
            const eventPoint = window.rpgEG.ePoints[index];
            if (eventPoint){
                rpgenEventCommand = new RPGENEventCommand(eventPoint);
                viewRPGENEventCommand(rpgenEventCommand);
            }
            return popEvent.apply(this, args);
        };

        window.rpgEG.advanceCommandStep = advanceCommandStep2;
        window.rpgEG.popEvent = popEvent2;
    });

    let interruptedRPGENRender = null;

    /**
     * RPGENの描画に介入
     */
    const initInterruptRPGENRender = onceFunction(() => {
        const {dqDraw} = window;
        window.dqDraw = () => {
            dqDraw();
            if (interruptedRPGENRender) {
                interruptedRPGENRender();
            }
        };
        window.dq.restartDqDraw(32);
    });

})(window.unsafeWindow || window);