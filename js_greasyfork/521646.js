// ==UserScript==
// @name             Sploop decorations
// @version          1.2
// @description      adds some visual stuff
// @author           nyanner
// @match            *://sploop.io/*
// @match            *://lostworld.io/*
// @run-at           document-start
// @icon             https://sploop.io/img/ui/favicon.png
// @grant            none
// @namespace https://greasyfork.org/users/960747
// @downloadURL https://update.greasyfork.org/scripts/521646/Sploop%20decorations.user.js
// @updateURL https://update.greasyfork.org/scripts/521646/Sploop%20decorations.meta.js
// ==/UserScript==

(() => {
    "use strict";
    const TYPEOF = value => Object.prototype.toString.call(value).slice(8, -1).toLowerCase();
    const NumberSystem = [ {
        radix: 2,
        prefix: "0b0*"
    }, {
        radix: 8,
        prefix: "0+"
    }, {
        radix: 10,
        prefix: ""
    }, {
        radix: 16,
        prefix: "0x0*"
    } ];
    class Regex {
        constructor(code, unicode) {
            this.code = code;
            this.COPY_CODE = code;
            this.unicode = unicode || false;
            this.hooks = {};
        }
        static parseValue(value) {
            try {
                return Function(`return (${value})`)();
            } catch (err) {
                return null;
            }
        }
        isRegexp(value) {
            return TYPEOF(value) === "regexp";
        }
        generateNumberSystem(int) {
            const copy = [ ...NumberSystem ];
            const template = copy.map((({prefix, radix}) => prefix + int.toString(radix)));
            return `(?:${template.join("|")})`;
        }
        parseVariables(regex) {
            regex = regex.replace(/\{VAR\}/g, "(?:let|var|const)");
            regex = regex.replace(/\{QUOTE\}/g, "['\"`]");
            regex = regex.replace(/ARGS\{(\d+)\}/g, ((...args) => {
                let count = Number(args[1]), arr = [];
                while (count--) arr.push("\\w+");
                return arr.join("\\s*,\\s*");
            }));
            regex = regex.replace(/NUMBER\{(\d+)\}/g, ((...args) => {
                const int = Number(args[1]);
                return this.generateNumberSystem(int);
            }));
            return regex;
        }
        format(name, inputRegex, flags) {
            this.totalHooks += 1;
            let regex = "";
            if (Array.isArray(inputRegex)) {
                regex = inputRegex.map((exp => this.isRegexp(exp) ? exp.source : exp)).join("\\s*");
            } else if (this.isRegexp(inputRegex)) {
                regex = inputRegex.source;
            }
            regex = this.parseVariables(regex);
            if (this.unicode) {
                regex = regex.replace(/\\w/g, "(?:[^\\x00-\\x7F-]|\\$|\\w)");
            }
            const expression = new RegExp(regex.replace(/\{INSERT\}/, ""), flags);
            const match = this.code.match(expression);
            return regex.includes("{INSERT}") ? new RegExp(regex, flags) : expression;
        }
        template(type, name, regex, substr) {
            const expression = new RegExp(`(${this.format(name, regex).source})`);
            const match = this.code.match(expression) || [];
            this.code = this.code.replace(expression, type === 0 ? "$1" + substr : substr + "$1");
            return match;
        }
        match(name, regex, flags, debug = false) {
            const expression = this.format(name, regex, flags);
            const match = this.code.match(expression) || [];
            this.hooks[name] = {
                expression,
                match
            };
            return match;
        }
        matchAll(name, regex, debug = false) {
            const expression = this.format(name, regex, "g");
            const matches = [ ...this.code.matchAll(expression) ];
            this.hooks[name] = {
                expression,
                match: matches
            };
            return matches;
        }
        replace(name, regex, substr, flags) {
            const expression = this.format(name, regex, flags);
            this.code = this.code.replace(expression, substr);
            return this.code.match(expression) || [];
        }
        replaceAll(name, regex, substr, flags) {
            const expression = this.format(name, regex, "g");
            this.code = this.code.replaceAll(expression, substr);
            return this.code.match(expression) || [];
        }
        append(name, regex, substr) {
            return this.template(0, name, regex, substr);
        }
        prepend(name, regex, substr) {
            return this.template(1, name, regex, substr);
        }
        insert(name, regex, substr) {
            const {source} = this.format(name, regex);
            if (!source.includes("{INSERT}")) throw new Error("Your regexp must contain {INSERT} keyword");
            const findExpression = new RegExp(source.replace(/^(.*)\{INSERT\}(.*)$/, "($1)($2)"));
            this.code = this.code.replace(findExpression, `$1${substr}$2`);
            return this.code.match(findExpression);
        }
    }
    let Variables, decorations;
    const applyHooks = code => {
        const Hook = new Regex(code, true);
        window.COPY_CODE = (Hook.COPY_CODE.match(/^(\(function \w+\(\w+\)\{.+)\(.+?\);$/) || [])[1];
        Hook.append("EXTERNAL fix", /\(function (\w+)\(\w+\)\{/, "let $2 = eval(`(() => ${COPY_CODE})()`);delete window.COPY_CODE;");
        Hook.replace("fix", /\(function (\w+)\(\w+\)\{/, `(function snowvibe(){`);
        Hook.replace("fix", /"function"==typeof \w+&&\(\w+=\w\(\w+,\w+\)\);/, ``);
        const myData = Hook.match("myPlayer", /=(\w.get\(\w{2}\));\w&&\w\(\)/)[1];
        const X = Hook.match("playerX", /\{this\.(\w{2})=\w\|\|0/)[1];
        const Y = Hook.match("playerY", /,this\.(\w{2})=\w\|\|0\}/)[1];
        const ID = Hook.match("ID", /&&\w{2}===\w\.(\w{2})\){/)[1];
        const ID2 = Hook.match("ID2", /-1!==\w+\.(\w+)&&/)[1];
        const currentWeapon = Hook.match("crntWeapon", /,\w.(\w{2})===/)[1];
        const angle = Hook.match("angle", /;\w.(\w{2})=\w\(\)/)[1];
        const weaponName = Hook.match("wpnName", /(\w{2}):"XX/)[1];
        const health = Hook.match("health", /(\w{2})<<8;/)[1];
        const weaponDamage = Hook.match("wpnDamage", /(\w{2}):32,reload:300/)[1];
        const teamID = Hook.match("test", /,\w=\w.(\w{2})\|.+?\<\<8/)[1];
        const radius = Hook.match("radius", /(\w{2}):220/)[1];
        const [, currentItem, hat] = Hook.match("hat", /\(\w+\.(\w+)\|\w+\.(\w+)<<NUMBER{8}\)/);
        const size = Hook.match("size", /\.(\w{2})\+50/)[1];
        const inWhichObject = Hook.match("iwo", /110\).+?,1===\w.(\w{2})&&!\w{2}/)[1];
        const weaponID = Hook.match("el", /(\w{2}):0,\w{2}:22,reload:150/)[1];
        const itemType = Hook.matchAll("el", /,(\w+):9,\w+:2/)[1][1];
        const itemsID = Hook.match("IDs", />1\){.{3}(\w{2})/)[1];
        const itemBar = Hook.match("defaultData", /(\W\w+>NUMBER{1}\W.+?(\w+)\.(\w+).+?)function/)[3];
        const objCount = Hook.match("Quantity", /\),this.(\w{2})=\w\):/)[1];
        const weaponList = Hook.match("weaponList", /\?Math\.PI\/2.+?(\w\(\))/)[1];
        const isTyping = Hook.match("is typing", /=\+new Date,(\w{2})=!1,/)[1];
        const damageReduce = Hook.match("damage reduce value", /10,(\w{2}):\.75,/)[1];
        const [, animations, hitAngle, weaponAnimation, animationTime, animationSpeed, playAnimation] = Hook.match("weapon animations", /0,\w\.(\w{2})\.(\w{2})=.{4}(\w{2})\.(\w{2}).{6}(\w{2}).+?(\w{2})\(\.01/);
        const sortedEntities = Hook.match("entities", /,\w=0;\w=(\w)\[/)[1];
        const speedBuff = Hook.match("speed", /(\w+):1\.23/)[1];
        const weaponSpeedBuff = Hook.match("speed", /300,(\w+):\.85/)[1];
        const cam = Hook.match("cam", /,\w\)}},(\w{2})=new function/)[1];
        const ctx = Hook.match("ctx", /(\w{2})=\w{2}(\[\w\(\d{3}\)\]|\.getContext)\("2d"\),\w{2}/)[1];
        const [, camX, camY] = Hook.match("data", /height:20,(\w+).+?.(\w+)/);
        const [, biomeY, biomeHeight] = Hook.match("data", /\w{2}:160,(\w{2}):160,\w{2}.+?(\w{2}):/);
        const local = "window.storage";
        Hook.append("newImg", /(\w).{9}(.{9})."clan_decline"\)\);/, `\n    $2[777] = $3("yFlower"));\n    $2[777].src = "https://cdn.glitch.global/80f01abb-e90c-4a7c-8f06-4aab31fdf28a/yellowFlower.png?v=1714580473155";\n    $2[666] = $3("rFlower"));\n    $2[666].src = "https://cdn.glitch.global/80f01abb-e90c-4a7c-8f06-4aab31fdf28a/redFlower.png?v=1714579975791";\n    $2[555] = $3("berry"));\n    $2[555].src = "https://cdn.glitch.global/80f01abb-e90c-4a7c-8f06-4aab31fdf28a/zxc.png?v=1714581353965";\n    $2[1000] = $3("bigEGG"));\n    $2[1000].src = "https://cdn.glitch.global/80f01abb-e90c-4a7c-8f06-4aab31fdf28a/bigEGG.png?v=1714650054208";\n    $2[999] = $3("miniEGG"));\n    $2[999].src = "https://cdn.glitch.global/80f01abb-e90c-4a7c-8f06-4aab31fdf28a/miniEGGpng.png?v=1714650626845";\n    $2[888] = $3("ybigEGG"));\n    $2[888].src = "https://cdn.glitch.global/80f01abb-e90c-4a7c-8f06-4aab31fdf28a/ybigEGG.png?v=1714757303463";\n    `);
        Hook.append("player id", /\((\w)\[0\]\){case \w+\(\).\w+.\w+:/, `${local}.myID = $2[1];`);
        const generatePositions = (amount, id) => {
            let flowers = [];
            for (let i = 0; i < amount; i++) {
                let obj = {
                    [Variables.x]: Math.floor(Math.random() * (9800 - 200 + 1)) + 200,
                    [Variables.y]: Math.floor(Math.random() * (7450 - 200 + 1)) + 200,
                    id
                };
                flowers.push(obj);
            }
            return flowers;
        };
        Variables = {
            myPlayer: {
                myData,
                x: `${myData}.${X}`,
                y: `${myData}.${Y}`,
                id: `${myData}.${ID}`,
                teamID: `${myData}.${teamID}`,
                angle: `${myData}.${angle}`
            },
            x: X,
            y: Y,
            id: ID,
            id2: ID2,
            hat,
            size,
            camX,
            camY,
            type: "type",
            angle,
            biomeY,
            health,
            radius,
            teamID,
            itemsID,
            isTyping,
            weaponID,
            objCount,
            itemType,
            hitAngle,
            speedBuff,
            weaponList,
            weaponName,
            animations,
            biomeHeight,
            weaponDamage,
            damageReduce,
            playAnimation,
            inWhichObject,
            currentWeapon,
            animationTime,
            animationSpeed,
            weaponAnimation,
            weaponSpeedBuff
        };
        decorations = [ {
            id: 1e3,
            [Variables.x]: 29.99999999999999,
            [Variables.y]: 2550.0000000056198
        }, {
            id: 1e3,
            [Variables.x]: 214.0002966762103,
            [Variables.y]: 2492.0291726187397
        }, {
            id: 1e3,
            [Variables.x]: 382.0748870194689,
            [Variables.y]: 2440.6865700037215
        }, {
            id: 1e3,
            [Variables.x]: 573.9858511507157,
            [Variables.y]: 2503.996448203956
        }, {
            id: 1e3,
            [Variables.x]: 761.9999908462445,
            [Variables.y]: 2442.0386539633755
        }, {
            id: 1e3,
            [Variables.x]: 952.0590210896952,
            [Variables.y]: 2505.0498958190256
        }, {
            id: 1e3,
            [Variables.x]: 1259.9862437885706,
            [Variables.y]: 2452.0322384681695
        }, {
            id: 1e3,
            [Variables.x]: 1450.0232490356113,
            [Variables.y]: 2512.003077236567
        }, {
            id: 1e3,
            [Variables.x]: 1641.999998107236,
            [Variables.y]: 2447.999837480006
        }, {
            id: 1e3,
            [Variables.x]: 1764.0000434531719,
            [Variables.y]: 2505.0000611454825
        }, {
            id: 1e3,
            [Variables.x]: 1988.0000024140948,
            [Variables.y]: 2475.3910402273605
        }, {
            id: 1e3,
            [Variables.x]: 2179.999948255453,
            [Variables.y]: 2539.9980611367455
        }, {
            id: 1e3,
            [Variables.x]: 2371.000480338862,
            [Variables.y]: 2415.9959284149245
        }, {
            id: 1e3,
            [Variables.x]: 2498.0000070562905,
            [Variables.y]: 2536.0629494204723
        }, {
            id: 1e3,
            [Variables.x]: 2686.9998878301403,
            [Variables.y]: 2472.9999999978954
        }, {
            id: 1e3,
            [Variables.x]: 2925.999527997155,
            [Variables.y]: 2485.018991363512
        }, {
            id: 1e3,
            [Variables.x]: 3097.732209871221,
            [Variables.y]: 2439.997508765663
        }, {
            id: 1e3,
            [Variables.x]: 3273.968723799376,
            [Variables.y]: 2549.999193626759
        }, {
            id: 1e3,
            [Variables.x]: 3464.8013362358633,
            [Variables.y]: 2485.988137109807
        }, {
            id: 1e3,
            [Variables.x]: 3658.901643634054,
            [Variables.y]: 2485.9999999926995
        }, {
            id: 1e3,
            [Variables.x]: 3831.043036235859,
            [Variables.y]: 2526.0001627953843
        }, {
            id: 1e3,
            [Variables.x]: 4082.9596476709476,
            [Variables.y]: 2461.9236918125425
        }, {
            id: 1e3,
            [Variables.x]: 3956.0004172683734,
            [Variables.y]: 2461.99999999995
        }, {
            id: 1e3,
            [Variables.x]: 4277.747414095257,
            [Variables.y]: 2513.8991451561224
        }, {
            id: 1e3,
            [Variables.x]: 4509.000161954971,
            [Variables.y]: 2580.0064837158116
        }, {
            id: 1e3,
            [Variables.x]: 4400.0000005704605,
            [Variables.y]: 2479.9017377199107
        }, {
            id: 1e3,
            [Variables.x]: 4781.002734792941,
            [Variables.y]: 2488.1308565839
        }, {
            id: 1e3,
            [Variables.x]: 4967.00551941161,
            [Variables.y]: 2551.1279965524545
        }, {
            id: 1e3,
            [Variables.x]: 5160.050201842505,
            [Variables.y]: 2488.0470865591833
        }, {
            id: 1e3,
            [Variables.x]: 5352.999570332228,
            [Variables.y]: 2552.020740569861
        }, {
            id: 1e3,
            [Variables.x]: 5543.93781742945,
            [Variables.y]: 2488.0029731646046
        }, {
            id: 1e3,
            [Variables.x]: 5737.000002635433,
            [Variables.y]: 2427.172435813349
        }, {
            id: 1e3,
            [Variables.x]: 5928.993634014561,
            [Variables.y]: 2464.136863940179
        }, {
            id: 1e3,
            [Variables.x]: 6116.258412735068,
            [Variables.y]: 2460.7532317948144
        }, {
            id: 1e3,
            [Variables.x]: 6320.9560100313865,
            [Variables.y]: 2503.999997449834
        }, {
            id: 1e3,
            [Variables.x]: 6559.886115789101,
            [Variables.y]: 2497.8825216612922
        }, {
            id: 1e3,
            [Variables.x]: 6808.045482957361,
            [Variables.y]: 2434.7954508014664
        }, {
            id: 1e3,
            [Variables.x]: 6686.313048001445,
            [Variables.y]: 2434.000063238881
        }, {
            id: 1e3,
            [Variables.x]: 7007.821502411624,
            [Variables.y]: 2497.842353327186
        }, {
            id: 1e3,
            [Variables.x]: 7201.89346427579,
            [Variables.y]: 2434.814349475234
        }, {
            id: 1e3,
            [Variables.x]: 7394.0000069265125,
            [Variables.y]: 2496.000855023708
        }, {
            id: 1e3,
            [Variables.x]: 7586.991570724414,
            [Variables.y]: 2496.002150801967
        }, {
            id: 1e3,
            [Variables.x]: 7774.35475739181,
            [Variables.y]: 2433.97018813505
        }, {
            id: 1e3,
            [Variables.x]: 7965.652671373453,
            [Variables.y]: 2433.9999999745323
        }, {
            id: 1e3,
            [Variables.x]: 8105.065104471541,
            [Variables.y]: 2448.041779867961
        }, {
            id: 1e3,
            [Variables.x]: 8357.00328524934,
            [Variables.y]: 2485.986261225132
        }, {
            id: 1e3,
            [Variables.x]: 8500.999736983238,
            [Variables.y]: 2584.090122606014
        }, {
            id: 1e3,
            [Variables.x]: 8679.159237507823,
            [Variables.y]: 2413.199101719817
        }, {
            id: 1e3,
            [Variables.x]: 8908.11207669312,
            [Variables.y]: 2493.8815710969857
        }, {
            id: 1e3,
            [Variables.x]: 9100.266251022786,
            [Variables.y]: 2430.0089637733436
        }, {
            id: 1e3,
            [Variables.x]: 9286.056462091026,
            [Variables.y]: 2485.9780466880356
        }, {
            id: 1e3,
            [Variables.x]: 9538.995084609018,
            [Variables.y]: 2450.9396355931212
        }, {
            id: 1e3,
            [Variables.x]: 9732.002382560924,
            [Variables.y]: 2514.7415554647096
        }, {
            id: 1e3,
            [Variables.x]: 9924.06913400942,
            [Variables.y]: 2450.3753934720717
        }, {
            id: 999,
            [Variables.x]: 9633.066283895572,
            [Variables.y]: 2774.965527966431
        }, {
            id: 999,
            [Variables.x]: 9368.367656473702,
            [Variables.y]: 2638.760240996886
        }, {
            id: 999,
            [Variables.x]: 9108.93843443585,
            [Variables.y]: 2637.9999992425182
        }, {
            id: 999,
            [Variables.x]: 8886.996496464813,
            [Variables.y]: 2740.465721502559
        }, {
            id: 999,
            [Variables.x]: 8591.98848042534,
            [Variables.y]: 2697.955473152916
        }, {
            id: 999,
            [Variables.x]: 8364.02653944699,
            [Variables.y]: 2742.099189166931
        }, {
            id: 999,
            [Variables.x]: 8018.224819551448,
            [Variables.y]: 2652.8442740990295
        }, {
            id: 999,
            [Variables.x]: 7777.999486631112,
            [Variables.y]: 2606.9522705110076
        }, {
            id: 999,
            [Variables.x]: 7558.001173278906,
            [Variables.y]: 2890.046991103157
        }, {
            id: 999,
            [Variables.x]: 8127.3105680599665,
            [Variables.y]: 2890.999995021336
        }, {
            id: 999,
            [Variables.x]: 7398.508914037662,
            [Variables.y]: 2668.8699230283755
        }, {
            id: 999,
            [Variables.x]: 6708.262218454327,
            [Variables.y]: 2866.24706119208
        }, {
            id: 999,
            [Variables.x]: 6880.874061431822,
            [Variables.y]: 2568.0547673207466
        }, {
            id: 999,
            [Variables.x]: 7048.001181302265,
            [Variables.y]: 2683.998365437441
        }, {
            id: 999,
            [Variables.x]: 6384.51880056193,
            [Variables.y]: 2633.012344760018
        }, {
            id: 999,
            [Variables.x]: 6229.001527052843,
            [Variables.y]: 2724.000037299408
        }, {
            id: 999,
            [Variables.x]: 6185.032206096412,
            [Variables.y]: 2552.328289336163
        }, {
            id: 999,
            [Variables.x]: 5833.001081234768,
            [Variables.y]: 2515.000004783373
        }, {
            id: 999,
            [Variables.x]: 5635.013000179002,
            [Variables.y]: 2715.132991764611
        }, {
            id: 999,
            [Variables.x]: 4983.825719408364,
            [Variables.y]: 2630.2715949351987
        }, {
            id: 999,
            [Variables.x]: 4808.991452957154,
            [Variables.y]: 2675.0019236474545
        }, {
            id: 999,
            [Variables.x]: 4529.012077026215,
            [Variables.y]: 2794.998442785668
        }, {
            id: 999,
            [Variables.x]: 4248.154513207736,
            [Variables.y]: 2644.1945023172448
        }, {
            id: 999,
            [Variables.x]: 3829.7973412358106,
            [Variables.y]: 2707.1158592753254
        }, {
            id: 999,
            [Variables.x]: 3546.763829523222,
            [Variables.y]: 2679.8762554251716
        }, {
            id: 999,
            [Variables.x]: 3265.379713427688,
            [Variables.y]: 2884.726069333624
        }, {
            id: 999,
            [Variables.x]: 2752.170958277778,
            [Variables.y]: 2757.172314205808
        }, {
            id: 999,
            [Variables.x]: 2342.000023920623,
            [Variables.y]: 2541.7259192431193
        }, {
            id: 999,
            [Variables.x]: 2393.0000001045064,
            [Variables.y]: 2546.020440082226
        }, {
            id: 999,
            [Variables.x]: 2375.214639614609,
            [Variables.y]: 2785.050511999293
        }, {
            id: 999,
            [Variables.x]: 2011.4663935069682,
            [Variables.y]: 2678.3053400094395
        }, {
            id: 999,
            [Variables.x]: 2319.999998340479,
            [Variables.y]: 2512.063388541019
        }, {
            id: 999,
            [Variables.x]: 1781.5653155460602,
            [Variables.y]: 2919.7695949555446
        }, {
            id: 999,
            [Variables.x]: 1457.9829399058456,
            [Variables.y]: 2732.69666008065
        }, {
            id: 999,
            [Variables.x]: 1121.8816981507593,
            [Variables.y]: 2643.8009150795624
        }, {
            id: 999,
            [Variables.x]: 902.8558665635351,
            [Variables.y]: 2914.533541069445
        }, {
            id: 999,
            [Variables.x]: 617.7088262599689,
            [Variables.y]: 3000.208332291725
        }, {
            id: 999,
            [Variables.x]: 115.76284446446414,
            [Variables.y]: 2761.1691492848804
        }, {
            id: 999,
            [Variables.x]: 443.999174424608,
            [Variables.y]: 2626.910633614252
        }, {
            id: 999,
            [Variables.x]: 401.0006173978146,
            [Variables.y]: 532.9993392260212
        }, {
            id: 888,
            [Variables.x]: 146.3497840873793,
            [Variables.y]: 7519.927999039886
        }, {
            id: 888,
            [Variables.x]: 391.0196308967286,
            [Variables.y]: 7549.085720093481
        }, {
            id: 888,
            [Variables.x]: 543.1371807981709,
            [Variables.y]: 7533.976836147818
        }, {
            id: 888,
            [Variables.x]: 697.0531620113139,
            [Variables.y]: 7550.005525482361
        }, {
            id: 888,
            [Variables.x]: 841.2366989055986,
            [Variables.y]: 7546.024636082353
        }, {
            id: 888,
            [Variables.x]: 1002.1840190174183,
            [Variables.y]: 7499.675493417864
        }, {
            id: 888,
            [Variables.x]: 1142.6196506884087,
            [Variables.y]: 7548.285257450758
        }, {
            id: 888,
            [Variables.x]: 1304.2958114699852,
            [Variables.y]: 7548.0000001380395
        }, {
            id: 888,
            [Variables.x]: 1461.2890760037862,
            [Variables.y]: 7504.484162973849
        }, {
            id: 888,
            [Variables.x]: 1599.1268933314354,
            [Variables.y]: 7552.456685165645
        }, {
            id: 888,
            [Variables.x]: 1759.204500911972,
            [Variables.y]: 7529.112818068299
        }, {
            id: 888,
            [Variables.x]: 1885.5663898853736,
            [Variables.y]: 7535.997014384194
        }, {
            id: 888,
            [Variables.x]: 2008.864282123885,
            [Variables.y]: 7534.011987392109
        }, {
            id: 888,
            [Variables.x]: 2169.451157581377,
            [Variables.y]: 7508.428652937195
        }, {
            id: 888,
            [Variables.x]: 2321.4119053460654,
            [Variables.y]: 7524.004600254365
        }, {
            id: 888,
            [Variables.x]: 2445.37679324718,
            [Variables.y]: 7556.959438438634
        }, {
            id: 888,
            [Variables.x]: 2605.4951406107575,
            [Variables.y]: 7557.0000001068265
        }, {
            id: 888,
            [Variables.x]: 2745.837252598174,
            [Variables.y]: 7513.389117185103
        }, {
            id: 888,
            [Variables.x]: 2870.119102149074,
            [Variables.y]: 7545.351524404612
        }, {
            id: 888,
            [Variables.x]: 3053.1769305206426,
            [Variables.y]: 7545.000003910216
        }, {
            id: 888,
            [Variables.x]: 3154.026610855043,
            [Variables.y]: 7492.703531529384
        }, {
            id: 888,
            [Variables.x]: 3241.745184056783,
            [Variables.y]: 7558.0648618785635
        }, {
            id: 888,
            [Variables.x]: 3452.00226701193,
            [Variables.y]: 7544.999961196074
        }, {
            id: 888,
            [Variables.x]: 3567.4144062974487,
            [Variables.y]: 7498.745675591474
        }, {
            id: 888,
            [Variables.x]: 3688.934608223305,
            [Variables.y]: 7531.10369153833
        }, {
            id: 888,
            [Variables.x]: 3791.186191689511,
            [Variables.y]: 7520.999459482911
        }, {
            id: 888,
            [Variables.x]: 3906.079096108739,
            [Variables.y]: 7543.998942932907
        }, {
            id: 888,
            [Variables.x]: 4044.2380426104028,
            [Variables.y]: 7543.999999992666
        }, {
            id: 888,
            [Variables.x]: 4174.286212080739,
            [Variables.y]: 7505.998008278797
        }, {
            id: 888,
            [Variables.x]: 4319.522512008703,
            [Variables.y]: 7537.101396727113
        }, {
            id: 888,
            [Variables.x]: 4433.000000004023,
            [Variables.y]: 7513.999999995751
        }, {
            id: 888,
            [Variables.x]: 4555.716798990464,
            [Variables.y]: 7546.0026680826795
        }, {
            id: 888,
            [Variables.x]: 4670.1247637998,
            [Variables.y]: 7523.046104406854
        }, {
            id: 888,
            [Variables.x]: 4794.617556083352,
            [Variables.y]: 7555.999791719118
        }, {
            id: 888,
            [Variables.x]: 4941.651040639689,
            [Variables.y]: 7524.000003661002
        }, {
            id: 888,
            [Variables.x]: 5042.602176094363,
            [Variables.y]: 7556.0006088283935
        }, {
            id: 888,
            [Variables.x]: 5180.459249490879,
            [Variables.y]: 7556.00000000101
        }, {
            id: 888,
            [Variables.x]: 5303.000933676377,
            [Variables.y]: 7501.028451187172
        }, {
            id: 888,
            [Variables.x]: 5419.518179728937,
            [Variables.y]: 7548.018130776565
        }, {
            id: 888,
            [Variables.x]: 5557.021528601353,
            [Variables.y]: 7525.360710641226
        }, {
            id: 888,
            [Variables.x]: 5679.548749434651,
            [Variables.y]: 7558.387682614479
        }, {
            id: 888,
            [Variables.x]: 5817.081907074551,
            [Variables.y]: 7535.225502179956
        }, {
            id: 888,
            [Variables.x]: 5955.801011406585,
            [Variables.y]: 7536.998169722631
        }, {
            id: 888,
            [Variables.x]: 6058.068886876112,
            [Variables.y]: 7503.843014156425
        }, {
            id: 888,
            [Variables.x]: 6182.08285499084,
            [Variables.y]: 7536.468905493149
        }, {
            id: 888,
            [Variables.x]: 6319.000298599492,
            [Variables.y]: 7559.223506154572
        }, {
            id: 888,
            [Variables.x]: 6456.0438409023,
            [Variables.y]: 7559.000001239853
        }, {
            id: 888,
            [Variables.x]: 6593.708873816226,
            [Variables.y]: 7559.000000000004
        }, {
            id: 888,
            [Variables.x]: 6694.621021783071,
            [Variables.y]: 7503.922669545933
        }, {
            id: 888,
            [Variables.x]: 6802.017532395823,
            [Variables.y]: 7543.013844983488
        }, {
            id: 888,
            [Variables.x]: 6939.576139515191,
            [Variables.y]: 7519.736835652795
        }, {
            id: 888,
            [Variables.x]: 7094.688032200829,
            [Variables.y]: 7540.085798774424
        }, {
            id: 888,
            [Variables.x]: 7226.998639368321,
            [Variables.y]: 7522.058989048326
        }, {
            id: 888,
            [Variables.x]: 7387.01121045099,
            [Variables.y]: 7544.002188008208
        }, {
            id: 888,
            [Variables.x]: 7525.164163912381,
            [Variables.y]: 7520.477342503655
        }, {
            id: 888,
            [Variables.x]: 7682.63209343086,
            [Variables.y]: 7520.950333690332
        }, {
            id: 888,
            [Variables.x]: 7819.874119219743,
            [Variables.y]: 7474.529781602834
        }, {
            id: 888,
            [Variables.x]: 7914.101850271172,
            [Variables.y]: 7546.273684819922
        }, {
            id: 888,
            [Variables.x]: 8075.163398710387,
            [Variables.y]: 7523.178479254832
        }, {
            id: 888,
            [Variables.x]: 8243.626299995074,
            [Variables.y]: 7529.999928226666
        }, {
            id: 888,
            [Variables.x]: 8381.398267091548,
            [Variables.y]: 7506.778270687802
        }, {
            id: 888,
            [Variables.x]: 8610.0060525894,
            [Variables.y]: 7529.696290884706
        }, {
            id: 888,
            [Variables.x]: 8770.417583524257,
            [Variables.y]: 7553.000247702051
        }, {
            id: 888,
            [Variables.x]: 8448.995853929235,
            [Variables.y]: 7553.000000000004
        }, {
            id: 888,
            [Variables.x]: 8929.703318071148,
            [Variables.y]: 7552.999999999999
        }, {
            id: 888,
            [Variables.x]: 9044.893738170069,
            [Variables.y]: 7504.45378526034
        }, {
            id: 888,
            [Variables.x]: 9233.46060143763,
            [Variables.y]: 7495.997477063163
        }, {
            id: 888,
            [Variables.x]: 9348.000125187058,
            [Variables.y]: 7541.000685853901
        }, {
            id: 888,
            [Variables.x]: 9572.018260313409,
            [Variables.y]: 7527.314604546699
        }, {
            id: 888,
            [Variables.x]: 9702.810491263053,
            [Variables.y]: 7511.700779821693
        }, ...generatePositions(100, 777), ...generatePositions(100, 666), ...generatePositions(100, 555) ];
        log(Variables);
        window.Variables = Variables;
        Hook.prepend("injected?", /^\(function/, `log("Injected!");`);
        Hook.append("biomes", /\w\(9282\),(\w{2})=\w\.\w\(\w{2}\).+?;/, `${local}.biomes=$2();${local}.changeIndex($2());`);
        Hook.append("camera object", /0,40\);/, `${local}.cam=${cam};`);
        Hook.append("define renderer", /function (\w{2})\(\w,\w,\w,\w\){const \w=\w\[.+?}/, `;${local}.renderObj=$2;`);
        Hook.append("my x,y", /const (\w)=\w\.get\(\w{2}\);/, `${local}.defineData($2);`);
        Hook.append("frame update", /Date,(\w)=\(\w-\w{2}\)\/1e3;/, `${local}.updateFrame($2);`);
        Hook.append("hook canvas", /\.\w{2}&&\w{2}\(\w\[\w\],\w\[\w\]\.\w{2},\w\(\)\.\w{2},\w\)/, `;${local}.hookCanvas(${ctx});`);
        Hook.append("renderer", /=1}function \w{2}\((\w),\w\){.+?\),.+?,/, `${local}.renderDecorations($2),`);
        return Hook.code;
    };
    window.eval = new Proxy(window.eval, {
        apply(target, _this, args) {
            const code = args[0];
            if (code.length > 1e5) {
                args[0] = applyHooks(code);
                window.eval = target;
                document.title = "Sploop";
                target.apply(_this, args);
                return;
            }
            return target.apply(_this, args);
        }
    });
    const main_log = console.log;
    window.log = main_log;
    let delta;
    const isIntersect = (Ax, Ay, Aw, Ah, Bx, By, Bw, Bh) => Bx + Bw > Ax && By + Bh > Ay && Ax + Aw > Bx && Ay + Ah > By;
    const coolDownOver = (currentTimeStamp, previousTimeStamp, interval) => currentTimeStamp - previousTimeStamp > interval;
    const defineData = myPlayer => {
        if (myPlayer) {
            storage.myX = myPlayer[Variables.x];
            storage.myY = myPlayer[Variables.y];
        }
    };
    const renderDecorations = ctx => {
        decorations.forEach((decoration => {
            if (Math.hypot(storage.myX - Number(decoration[Variables.x]), storage.myY - Number(decoration[Variables.y])) < 1500) storage.renderObj(decoration, decoration.id, ctx);
        }));
    };
    const biomes = {
        snow: {
            x: 160,
            y: 160,
            w: 9840,
            h: 2230
        },
        desert: {
            x: 160,
            y: 9190,
            w: 9840,
            h: 840
        },
        river: {
            x: 160,
            y: 8e3,
            w: 9840,
            h: 1e3
        }
    };
    let strength = .07;
    let riverAccumulator = 0;
    const hookCanvas = ctx => {
        if (!ctx || !storage.cam) return;
        const canvas = document.querySelector("#game-canvas");
        const scaleFactor = 1;
        const vx = storage.cam[Variables.camX] - canvas.width / scaleFactor / 2;
        const vy = storage.cam[Variables.camY] - canvas.height / scaleFactor / 2;
        const vw = canvas.width / scaleFactor;
        const vh = canvas.height / scaleFactor;
        const s_x = biomes.snow.x;
        const s_y = biomes.snow.y;
        const s_w = biomes.snow.w;
        const s_h = biomes.snow.h;
        const d_x = biomes.desert.x;
        const d_y = biomes.desert.y;
        const d_w = biomes.desert.w;
        const d_h = biomes.desert.h;
        const r_x = biomes.river.x;
        const r_y = biomes.river.y;
        const r_w = biomes.river.w;
        const r_h = biomes.river.h;
        const canSeeDesert = isIntersect(d_x, d_y, d_w, d_h, vx, vy, vw, vh);
        const canSeeSnow = isIntersect(s_x, s_y, s_w, s_h, vx, vy, vw, vh);
        const canSeeRiver = isIntersect(r_x, r_y, r_w, r_h, vx, vy, vw, vh);
        if (canSeeRiver) {
            riverAccumulator = (riverAccumulator + delta) % (2 * Math.PI);
            const offset = strength * Math.sin(riverAccumulator);
            storage.biomes[4][Variables.biomeY] -= offset;
            storage.biomes[4][Variables.biomeHeight] += offset;
        }
        if (canSeeSnow) {
            particles.updateType(0);
        } else if (canSeeDesert) {
            particles.updateType(1);
        }
        if (canSeeSnow || canSeeDesert) particles.render(ctx, delta, vx, vy, vw, vh);
    };
    const updateFrame = ms => {
        delta = ms;
    };
    let assets = {};
    assets.canvasCache = {};
    assets.createCanvasCacheKey = function(key, width, height) {
        return `${key}-${width}x${height}`;
    };
    assets.getCanvas = function(key, width, height) {
        return this.canvasCache[this.createCanvasCacheKey(key, width, height)];
    };
    assets.deleteCanvas = function(key, width, height) {
        delete assets.canvasCache[this.createCanvasCacheKey(key, width, height)];
    };
    assets.imgCache = {};
    assets.drawImageToCanvas = function(img, canvas, tint) {
        let ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        if (tint) {
            ctx.save();
            ctx.globalCompositeOperation = "source-atop";
            ctx.fillStyle = tint;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.restore();
        }
    };
    assets.createCanvas = function(key, width, height) {
        width = Math.ceil(width);
        height = Math.ceil(height);
        let canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        assets.canvasCache[this.createCanvasCacheKey(key, width, height)] = canvas;
        return canvas;
    };
    assets.getImage = function(path, width = 256, height = 256, tint = null) {
        width = Math.ceil(width);
        height = Math.ceil(height);
        let canvasKey = tint ? `${path}:${tint}` : path;
        let canvas = this.getCanvas(canvasKey, width, height);
        if (!canvas) {
            canvas = this.createCanvas(canvasKey, width, height);
            let img = assets.imgCache[path];
            if (img) {
                if (img.isLoaded) {
                    this.drawImageToCanvas(img, canvas, tint);
                } else {
                    img.addEventListener("load", (() => this.drawImageToCanvas(img, canvas, tint)));
                }
            } else {
                let img = new Image;
                img.isLoaded = false;
                img.src = path;
                img.addEventListener("load", (() => {
                    this.drawImageToCanvas(img, canvas, tint);
                    img.isLoaded = true;
                }));
                img.addEventListener("error", (() => {
                    console.error("Error loading image:", path);
                    delete assets.imgCache[path];
                    this.deleteCanvas(path, width, height);
                }));
                this.imgCache[path] = img;
            }
        }
        return canvas;
    };
    let utils = {};
    utils.drawImage = (ctx, img, x, y, scale = 1) => {
        ctx.drawImage(img, x - img.width / 2, y - img.height / 2);
    };
    class ParticleManager {
        constructor(game) {
            this.game = game;
            this.particles = [];
            this.toDispose = [];
            this.config = {
                0: {
                    maxLife: 2e3,
                    speed: 20
                }
            };
        }
        generateParticles(quanity = 10, type = 0) {
            for (let i = 0; i < quanity; i++) {
                this.particles.push([ 100 + Math.random() * 100, 40 * Math.random(), type, performance.now() - 2e3 * Math.random(), Math.PI * Math.random() ]);
            }
        }
        updateType(type) {
            for (let i = 0; i < this.particles.length; i++) {
                this.particles[i][2] = type;
            }
        }
        flush() {
            this.particles = [];
        }
        resetParticle(particle, timeStamp, vx, vy, vw, vh) {
            particle[3] = timeStamp - Math.random() * 2e3;
            particle[1] = vy + Math.random() * vh;
            particle[0] = vx + Math.random() * vw;
        }
        render(ctx, delta, vx, vy, vw, vh) {
            const now = performance.now();
            for (let i = 0; i < this.particles.length; i++) {
                const particle = this.particles[i];
                particle[4] = (particle[4] + delta) % (2 * Math.PI);
                if (coolDownOver(now, particle[3], this.config[0].maxLife)) this.resetParticle(particle, now, vx, vy, vw, vh);
                particle[1] += 100 * delta * Math.sin(particle[4] > Math.PI ? particle[4] + Math.PI : particle[4]);
                particle[0] += 100 * delta * Math.cos(particle[4]);
                const alpha = Math.abs(Math.sin(Math.PI * (now - particle[3]) / this.config[0].maxLife));
                ctx.globalAlpha = alpha;
                switch (particle[2]) {
                  case 0:
                    utils.drawImage(ctx, assets.getImage("https://cdn.glitch.global/f130fdcd-6684-4ec2-86bd-350f8a62abb7/snow.png?v=1734601216160", 32, 32), particle[0], particle[1]);
                    break;

                  case 1:
                    utils.drawImage(ctx, assets.getImage("https://cdn.glitch.global/f130fdcd-6684-4ec2-86bd-350f8a62abb7/sand.png?v=1734601248796", 32, 32), particle[0], particle[1]);
                    break;
                }
                ctx.globalAlpha = 1;
            }
        }
    }
    const changeIndex = biomes => {
        [biomes[biomes.length - 1], biomes[biomes.length - 2]] = [ biomes[biomes.length - 2], biomes[biomes.length - 1] ];
        biomes[4][Variables.biomeY] = 7995;
        biomes[4][Variables.biomeHeight] = 9005;
    };
    const particles = new ParticleManager;
    particles.generateParticles(4, 1);
    window.particleManager = particles;
    const storage = {
        myX: 0,
        myY: 0,
        renderObj: undefined,
        cam: undefined,
        biomes: undefined,
        updateFrame,
        hookCanvas,
        defineData,
        changeIndex,
        renderDecorations
    };
    window.storage = storage;
})();