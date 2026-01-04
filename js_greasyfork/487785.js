// ==UserScript==
// @name         BuzzerBeater PBP Analyzer
// @namespace    https://greasyfork.org/zh-CN/scripts/487785-buzzerbeater-pbp-analyzer
// @version      0.0.7
// @description  Analyze Buzzerbeater play-by-play for more information.
// @author       AtomicNucleus
// @match        https://www.buzzerbeater.com/match/*/pbp.aspx
// @match        https://www.buzzerbeater.org/match/*/pbp.aspx
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_log
// @grant        GM_addElement
// @downloadURL https://update.greasyfork.org/scripts/487785/BuzzerBeater%20PBP%20Analyzer.user.js
// @updateURL https://update.greasyfork.org/scripts/487785/BuzzerBeater%20PBP%20Analyzer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function addArrays(ar1, ar2) {
        var ar3 = [];
        for (let ar = 0; ar < ar1.length; ar++) {
            ar3.push(ar1[ar] + ar2[ar]);
        }
        return ar3;
    }

    // Get Position by Time Dist
    function getPosition(MINUTE, playerStat) {
        let M = MINUTE.slice(1, );
        let i = M.indexOf(Math.max(...M));
        if (M[i] == 0 && MINUTE[0] == 0) {
            let a = '<b>&nbsp &nbsp &nbsp</b>';
        } else if (M[i] == 0 && MINUTE[0] > 0) { a = ''; } else {
            switch (i) {
                case 0:
                    a = '<b>PG&nbsp</b>';
                    break;
                case 1:
                    a = '<b>SG&nbsp</b>';
                    break;
                case 2:
                    a = '<b>SF&nbsp</b>';
                    break;
                case 3:
                    a = '<b>PF&nbsp</b>';
                    break;
                case 4:
                    a = '<b>C&nbsp &nbsp</b>';
                    break;
            }
        }

        if (playerStat.IsStarter == 1) {
            return a + '<b>' + playerStat.name.split(' (')[0].link(playerStat.href) + '</b>';
        } else if (M[i] == 0 && MINUTE[0] > 0) {
            return a + playerStat.name.split(' (')[0];
        } else {
            return a + playerStat.name.split(' (')[0].link(playerStat.href);
        }

    }

    // Get Names
    const pbp = document.getElementById("cbPbp");
    const names = pbp.querySelectorAll("div table tr td table tr td a");

    var PlayersA = [];
    var PlayersH = [];
    for (let i = 0; i < 12; i++) {
        if ((names[i].innerHTML.length > 0) || (i < 5)) {
            PlayersA.push(names[i].innerHTML);
        }
    }
    for (let i = 12; i < 24; i++) {
        if ((names[i].innerHTML.length > 0) || (i < 17)) {
            PlayersH.push(names[i].innerHTML);
        }
    }


    // Get Teams
    let titleline = document.title;
    let titleSplit = titleline.split(/\| | @ | \|\ /g);
    let teamnameA = titleSplit[1];
    let teamnameH = titleSplit[2];

    PlayersA.push(teamnameA);
    PlayersH.push(teamnameH);


    // Database for gameplay breakdown
    var teamA = [];
    for (let p = 0; p < PlayersA.length; p++) {
        teamA.push({
            name: PlayersA[p],
            href: '',
            OnCourt: 0,
            IsStarter: 0,
            MINUTE: Array(6).fill(0), // 0-total, 1-PG, 2-SG, 3-SF, 4-PF, 5-C
            ISM: Array(3).fill(0), // [Total,Contested,Assisted]
            ISA: Array(3).fill(0),
            JSM: Array(3).fill(0),
            JSA: Array(3).fill(0),
            P3M: Array(3).fill(0),
            P3A: Array(3).fill(0),
            FTM: 0,
            FTA: 0,
            PlusMinus: 0,
            OREB: 0,
            DREB: 0,
            ASTM: Array(3).fill(0), // [IS,JM,P3]
            ASTA: Array(3).fill(0),
            CONTESTM: Array(3).fill(0), // [IS,JM,P3]
            CONTESTA: Array(3).fill(0),
            TO: 0,
            STL: 0,
            BLK: 0,
            FOUL: 0,
            PTS: 0
        })
    }
    var teamH = [];
    for (let p = 0; p < PlayersH.length; p++) {
        teamH.push({
            name: PlayersH[p],
            href: '',
            OnCourt: 0,
            IsStarter: 0,
            MINUTE: Array(6).fill(0), // 0-total, 1-PG, 2-SG, 3-SF, 4-PF, 5-C
            ISM: Array(3).fill(0), // [Total,Contested,Assisted]
            ISA: Array(3).fill(0),
            JSM: Array(3).fill(0),
            JSA: Array(3).fill(0),
            P3M: Array(3).fill(0),
            P3A: Array(3).fill(0),
            FTM: 0,
            FTA: 0,
            PlusMinus: 0,
            OREB: 0,
            DREB: 0,
            ASTM: Array(3).fill(0), // [IS,JM,P3]
            ASTA: Array(3).fill(0),
            CONTESTM: Array(3).fill(0), // [IS,JM,P3]
            CONTESTA: Array(3).fill(0),
            TO: 0,
            STL: 0,
            BLK: 0,
            FOUL: 0,
            PTS: 0
        })
    }

    // adding href
    for (let i = 0; i < 12; i++) {
        if ((names[i].innerHTML.length > 0) || (i < 5)) {
            teamA[i].href = names[i].getAttribute('href');
        }
    }
    for (let i = 12; i < 24; i++) {
        if ((names[i].innerHTML.length > 0) || (i < 17)) {
            teamH[i - 12].href = names[i].getAttribute('href');
        }
    }

    for (var k = 0; k < 5; k++) {
        teamA[k].OnCourt = k + 1;
        teamA[k].IsStarter = 1;
    }

    for (var k = 0; k < 5; k++) {
        teamH[k].OnCourt = k + 1;
        teamH[k].IsStarter = 1;
    }

    // 去除空球员（上场球员不足的情况）

    var teamA = teamA.filter(item => item.name.length > 0);
    var teamH = teamH.filter(item => item.name.length > 0);
    var PlayersA = PlayersA.filter(item => item.length > 0);
    var PlayersH = PlayersH.filter(item => item.length > 0);


    // 事件分类

    // 1 投篮
    // 1-A-B-C-D
    // A: 1-内线投篮 2-中距离投篮 3-三分投篮
    // B: 1-接传球 2-未接传球
    // C: 1-被干扰 2-未被干扰
    // D: 1-进球 2-没进 3-盖帽

    // 2 补充助攻

    // 3 篮板
    // 3-A
    // A: 1-前场板 2-后场板

    // 4 犯规

    // 5 罚球

    // 6 失误与抢断

    // 7 换人



    // Get PBP Lines
    var passerNamed = [];
    var shooterPrev = [];
    var timePast = 0;

    const cph = pbp.getElementById("cphContent_text");
    const lines = cph.querySelectorAll("span table tr td")

    for (var logline = 0; logline < lines.length; logline++) {
        switch (logline % 4) {
            case 0:
                break;
            case 1: //time
                var timeCurrent = lines[logline].firstChild.href.split('=')[1];
                var updatetime = (timeCurrent - timePast) / 60;
                timePast = timeCurrent;
                break;
            case 2:
                break;
            case 3: //line
                const preDes = lines[logline];
                var des = preDes.cloneNode(true); //H([^HS]{1,})S
                // Extract players from <a> elements

                var relatedPlayersNameList = des.getElementsByTagName('a');
                var relatedPlayersSequence = [];
                for (let k = 0; k < relatedPlayersNameList.length; k++) {
                    if (PlayersA.includes(relatedPlayersNameList[k].innerHTML)) {
                        relatedPlayersSequence.push({ team: 0, ind: PlayersA.indexOf(relatedPlayersNameList[k].innerHTML) });
                    } else if (PlayersH.includes(relatedPlayersNameList[k].innerHTML)) {
                        relatedPlayersSequence.push({ team: 1, ind: PlayersH.indexOf(relatedPlayersNameList[k].innerHTML) });
                    } else {
                        relatedPlayersSequence.push({ team: 2, ind: 0 });
                    }

                }

                for (var i = 0; i < teamA.length - 1; i++) {
                    if (teamA[i].OnCourt >= 1) {
                        teamA[i].MINUTE[0] += updatetime;
                        teamA[i].MINUTE[teamA[i].OnCourt] += updatetime;
                    }
                }
                for (var i = 0; i < teamH.length - 1; i++) {
                    if (teamH[i].OnCourt >= 1) {
                        teamH[i].MINUTE[0] += updatetime;
                        teamH[i].MINUTE[teamH[i].OnCourt] += updatetime;
                    }
                }

                Array.prototype.slice.call(des.getElementsByTagName('a')).forEach(
                    function(item) {
                        item.outerHTML = '%';
                        // or item.parentNode.removeChild(item); for older browsers (Edge-)
                    });

                var cleanDes = des.innerHTML;

                // var indexA = Array(PlayersA.length).fill(0)
                // var indexA_back = Array(PlayersA.length).fill(0)
                // for (var l = 0; l < PlayersA.length; l++) {
                //     indexA[l] = des.indexOf(PlayersA[l]);
                //     indexA_back[l] = des.lastIndexOf(PlayersA[l]);
                //     var cleanDes = cleanDes.replaceAll(PlayersA[l], "%");
                // }
                // var indexH = Array(PlayersH.length).fill(0)
                // var indexH_back = Array(PlayersH.length).fill(0)
                // for (var l = 0; l < PlayersH.length; l++) {
                //     indexH[l] = des.indexOf(PlayersH[l]);
                //     indexH_back[l] = des.lastIndexOf(PlayersH[l]);
                //     var cleanDes = cleanDes.replaceAll(PlayersH[l], "%");

                var slice = cleanDes.replaceAll(/ /g, "");
                var slice = slice.replaceAll(/，|。|！|”|“/g, " ");
                var slice = slice.split(/ +/g);
                var slice = slice.filter(function(e) { return e });

                // // 提取球员序号
                // var relatedPlayersSequence = []
                // var relatedPlayersSequence = []
                // for (var n = 0; n < teamA.length; n++) {
                //     if (indexA[n] >= 0) {
                //         relatedPlayersSequence.push({ team: 0, ind: n, occur: indexA[n] });
                //         relatedPlayersSequence.push({ team: 0, ind: n, occur: indexA_back[n] });
                //     }
                // }
                // for (var n = 0; n < teamH.length; n++) {
                //     if (indexH[n] >= 0) {
                //         relatedPlayersSequence.push({ team: 1, ind: n, occur: indexH[n] });
                //         relatedPlayersSequence.push({ team: 1, ind: n, occur: indexH_back[n] });
                //     }
                // }
                // relatedPlayersSequence.sort((a, b) => a.occur - b.occur);
                // relatedPlayersSequence.sort((a, b) => a.occur - b.occur);
                // //console.log(relatedPlayers);


                var category = '';
                // 判断投篮事件
                if ((slice.includes("球进了") ||
                        slice.includes("没进") ||
                        slice.includes("好帽") ||
                        slice.includes("给了一个干扰球") ||
                        slice.includes("得分有效")) &&
                    !slice.includes("%罚球")) {
                    var category = '1';
                    // 投篮事件

                    // 判断投篮位置
                    if (slice.includes("%加速突破到篮下右手上篮") ||
                        slice.includes("%起跳补扣") ||
                        slice.includes("把球往篮框轻轻一点") ||
                        slice.includes("把球砸进篮框") ||
                        slice.includes("%转身低手挑篮") ||
                        slice.includes("暴扣") ||
                        slice.includes("擦板上篮") ||
                        slice.includes("从另一侧上反篮") ||
                        slice.includes("从中路上篮") ||
                        slice.includes("大风车扣篮") ||
                        slice.includes("单手扣篮") ||
                        slice.includes("单手劈扣") ||
                        slice.includes("顶住防守人直接放篮") ||
                        slice.includes("翻身勾手") ||
                        slice.includes("飞跃对面大个子起跳上篮") ||
                        slice.includes("高举高打") ||
                        slice.includes("换左手上篮") ||
                        slice.includes("近距离放篮") ||
                        slice.includes("接球起跳") ||
                        slice.includes("起跳反扣") ||
                        slice.includes("双手暴扣") ||
                        slice.includes("双手扣篮") ||
                        slice.includes("一个小抛投") ||
                        slice.includes("一记挑篮") ||
                        slice.includes("右手上篮") ||
                        slice.includes("在防守人的眼皮底下左手上篮") ||
                        slice.includes("在空中折叠扣篮") ||
                        slice.includes("直接骑扣") ||
                        slice.includes("滞空打板上篮") ||
                        slice.includes("滞空换手拉杆上篮") ||
                        slice.includes("滞空上反篮") ||
                        slice.includes("左手劈扣") ||
                        slice.includes("转身就是一记擦板投篮") ||
                        slice.includes("这球可以直接扣了")
                    ) // 内线投篮
                    {
                        category = category + "1";
                    } else if (
                        slice.includes("%后仰跳投") ||
                        slice.includes("%在侧翼中距离打板投篮") ||
                        slice.includes("%在罚球线附近跳投") ||
                        slice.includes("干拔后仰跳投") ||
                        slice.includes("后仰跳投") ||
                        slice.includes("急停跳投") ||
                        slice.includes("跳投") ||
                        slice.includes("投中距离") ||
                        slice.includes("一记打板跳投") ||
                        slice.includes("一记冷静的中投") ||
                        slice.includes("一记长两分") ||
                        slice.includes("在侧翼急停跳投") ||
                        slice.includes("在牛角位置一记长两分") ||
                        slice.includes("在下落过程中把球投了出去") ||
                        slice.includes("只能后仰跳投") ||
                        slice.includes("中距离急停") ||
                        slice.includes("中距离跳投") ||
                        slice.includes("转身一记金鸡后仰投篮") ||
                        slice.includes("自己干拔后仰投篮")
                    ) // 中距离投篮
                    {
                        category = category + "2";
                    } else if (
                        slice.includes("%离三分线还有一步") ||
                        slice.includes("%离三分线还有一米") ||
                        slice.includes("%一只脚还踩着logo上") ||
                        slice.includes("%在三分线外接球") ||
                        slice.includes("干拔三分") ||
                        slice.includes("后撤步三分") ||
                        slice.includes("三分试一下有没有") ||
                        slice.includes("三分投篮") ||
                        slice.includes("投三分") ||
                        slice.includes("投了") ||
                        slice.includes("一记底角三分球") ||
                        slice.includes("直接拔起投三分") ||
                        slice.includes("直接三分出手") ||
                        slice.includes("直接投了") ||
                        slice.includes("直接投三分") ||
                        slice.includes("%半场拿球") ||
                        slice.includes("%在中圈接球") ||
                        slice.includes("在logo位置投三分")
                    ) // 三分投篮
                    {
                        category = category + "3";
                    }

                    // 判断传球事件
                    if (slice.includes("%击地传球给到%") ||
                        slice.includes("%一记炮弹式传球直塞%") ||
                        //                       slice.includes("%传给侧翼") ||
                        //                       slice.includes("%在弧顶手递手把球给队友") ||
                        //                       slice.includes("回传给%") ||
                        slice.includes("双手传球给到要位的%") ||
                        slice.includes("突破分球给%") ||
                        slice.includes("一记潇洒的nolookpass给到跟进的%") ||
                        //                       slice.includes("队友的传球飞跃篮框") ||
                        //                       slice.includes("接队友传球") ||
                        //                       slice.includes("传的好") ||
                        slice.includes("%这球传的不错") ||
                        slice.includes("%这球给的太漂亮了") ||
                        //                       slice.includes("队友回传") ||
                        //                       slice.includes("队友再回传") ||
                        slice.includes("%控球到前场")
                        //                         ||
                        //                         slice.includes("%在篮下接球") ||
                        //                         slice.includes("%在侧翼接球") ||
                        //                         slice.includes("%在底线接球") ||
                        //                         slice.includes("%在底角接球") ||
                        //                         slice.includes("%低位接球") ||
                        //                         slice.includes("接球起跳") ||
                        //                         slice.includes("%篮下接球") ||
                        //                         slice.includes("空中接球") ||
                        //                         slice.includes("%起跳接球") ||
                        //                         slice.includes("%在三分线外接球")
                    ) // 本条为传球事件
                    {
                        category = category + "1";
                    } else {
                        category = category + "2"; // 本条无传球事件
                    }

                    // 判断干扰情况
                    if (
                        slice.includes("%防的不错") ||
                        slice.includes("%高举双手") ||
                        slice.includes("%急忙上前补防") ||
                        slice.includes("%完全没有失位啊") ||
                        slice.includes("被%紧紧贴防着") ||
                        slice.includes("%漏人了") ||
                        //                         slice.includes("几乎堵死了出手空间") ||
                        //                         slice.includes("无视防守人直接起跳") ||
                        //                         slice.includes("在空中躲开防守人") ||
                        //                         slice.includes("没有出手空间") ||
                        //                         slice.includes("双人包夹") ||
                        //                         slice.includes("双人包夹了") ||
                        //                         slice.includes("%从底线杀入倚住防守人") ||
                        //                         slice.includes("干拔后仰跳投") ||
                        //                         slice.includes("干拔三分") ||
                        //                         slice.includes("自己干拔后仰投篮") ||
                        slice.includes("好帽")
                        //                        slice.includes("上篮假动作避开两名大个子的防守")
                    ) // 本条为干扰事件
                    {
                        category = category + "1"; // 本条为干扰事件
                    } else {
                        category = category + "2"; // 本条无干扰事件
                    }

                    // 判断进球与否
                    if (slice.includes("球进了") ||
                        slice.includes("给了一个干扰球") ||
                        slice.includes("得分有效")
                    ) {
                        category = category + "1";
                    } else if (slice.includes("没进")) {
                        category = category + "2";
                    } else if (slice.includes("好帽")) {
                        category = category + "3";
                    }

                    // 记录数据 根据传球描述和防守描述决定球员所处位置

                    // 如显示干扰者名字（最后一位），投篮人为倒数第二位
                    // 唯一例外，漏人了 + 盖帽，会导致相反
                    if (
                        slice.includes("%防的不错") ||
                        slice.includes("%高举双手") ||
                        slice.includes("%急忙上前补防") ||
                        slice.includes("%完全没有失位啊") ||
                        slice.includes("被%紧紧贴防着")
                    ) {
                        var contestor = [relatedPlayersSequence[relatedPlayersSequence.length - 1].team,
                            relatedPlayersSequence[relatedPlayersSequence.length - 1].ind
                        ];
                        var shooter = [relatedPlayersSequence[relatedPlayersSequence.length - 2].team,
                            relatedPlayersSequence[relatedPlayersSequence.length - 2].ind
                        ];
                    } else if (slice.includes("%漏人了")) {
                        var contestor = [relatedPlayersSequence[relatedPlayersSequence.length - 2].team,
                            relatedPlayersSequence[relatedPlayersSequence.length - 2].ind
                        ];
                        var shooter = [relatedPlayersSequence[relatedPlayersSequence.length - 1].team,
                            relatedPlayersSequence[relatedPlayersSequence.length - 1].ind
                        ];
                    } else {
                        var contestor = [];
                        var shooter = [relatedPlayersSequence[relatedPlayersSequence.length - 1].team,
                            relatedPlayersSequence[relatedPlayersSequence.length - 1].ind
                        ];
                    }

                    // 传球者的位置需要根据具体描述判断

                    if (
                        slice.includes("%击地传球给到%") ||
                        (slice.includes("%控球到前场")) ||
                        slice.includes("突破分球给%") ||
                        slice.includes("一记潇洒的nolookpass给到跟进的%")
                    ) // 传球者为首位
                    {
                        var passer = [relatedPlayersSequence[0].team,
                            relatedPlayersSequence[0].ind
                        ];
                        passerNamed.push(0);
                        shooterPrev.push([]);
                    } else if (
                        slice.includes("%一记炮弹式传球直塞%")
                    ) // 传球者为次位
                    {
                        var passer = [relatedPlayersSequence[1].team,
                            relatedPlayersSequence[1].ind
                        ];
                        passerNamed.push(0);
                        shooterPrev.push([]);
                    } else {
                        passerNamed.push(parseInt(category[1]));
                        var passer = [];
                        shooterPrev.push(shooter);
                    }

                    // 数据更新
                    switch (category) {
                        case "11111":
                            if (shooter[0] == 0) {
                                teamA[shooter[1]].ISM[0] += 1;
                                teamA[shooter[1]].ISM[1] += 1;
                                teamA[shooter[1]].ISM[2] += 1;
                                teamA[shooter[1]].ISA[0] += 1;
                                teamA[shooter[1]].ISA[1] += 1;
                                teamA[shooter[1]].ISA[2] += 1;
                                if (passer.length > 0) {
                                    teamA[passer[1]].ASTM[0] += 1;
                                    teamA[passer[1]].ASTA[0] += 1;
                                }
                                if (contestor.length > 0) {
                                    teamH[contestor[1]].CONTESTM[0] += 1;
                                    teamH[contestor[1]].CONTESTA[0] += 1;
                                }
                                teamA[shooter[1]].PTS += 2;
                            } else if (shooter[0] == 1) {
                                teamH[shooter[1]].ISM[0] += 1;
                                teamH[shooter[1]].ISM[1] += 1;
                                teamH[shooter[1]].ISM[2] += 1;
                                teamH[shooter[1]].ISA[0] += 1;
                                teamH[shooter[1]].ISA[1] += 1;
                                teamH[shooter[1]].ISA[2] += 1;
                                if (passer.length > 0) {
                                    teamH[passer[1]].ASTM[0] += 1;
                                    teamH[passer[1]].ASTA[0] += 1;
                                }
                                if (contestor.length > 0) {
                                    teamA[contestor[1]].CONTESTM[0] += 1;
                                    teamA[contestor[1]].CONTESTA[0] += 1;
                                }
                                teamH[shooter[1]].PTS += 2;
                            }
                            break;
                        case "11112":
                            if (shooter[0] == 0) {
                                teamA[shooter[1]].ISA[0] += 1;
                                teamA[shooter[1]].ISA[1] += 1;
                                teamA[shooter[1]].ISA[2] += 1;
                                if (passer.length > 0) {
                                    teamA[passer[1]].ASTA[0] += 1;
                                }
                                if (contestor.length > 0) {
                                    teamH[contestor[1]].CONTESTA[0] += 1;
                                }
                            } else if (shooter[0] == 1) {
                                teamH[shooter[1]].ISA[0] += 1;
                                teamH[shooter[1]].ISA[1] += 1;
                                teamH[shooter[1]].ISA[2] += 1;
                                if (passer.length > 0) {
                                    teamH[passer[1]].ASTA[0] += 1;
                                }
                                if (contestor.length > 0) {
                                    teamA[contestor[1]].CONTESTA[0] += 1;
                                }
                            }
                            break;
                        case "11113":
                            if (shooter[0] == 0) {
                                teamA[shooter[1]].ISA[0] += 1;
                                teamA[shooter[1]].ISA[1] += 1;
                                teamA[shooter[1]].ISA[2] += 1;
                                if (passer.length > 0) {
                                    teamA[passer[1]].ASTA[0] += 1;
                                }
                                if (contestor.length > 0) {
                                    teamH[contestor[1]].CONTESTA[0] += 1;
                                    teamH[contestor[1]].BLK += 1;
                                }
                            } else if (shooter[0] == 1) {
                                teamH[shooter[1]].ISA[0] += 1;
                                teamH[shooter[1]].ISA[1] += 1;
                                teamH[shooter[1]].ISA[2] += 1;
                                if (passer.length > 0) {
                                    teamH[passer[1]].ASTA[0] += 1;
                                }
                                if (contestor.length > 0) {
                                    teamA[contestor[1]].CONTESTA[0] += 1;
                                    teamA[contestor[1]].BLK += 1;
                                }
                            }
                            break;
                        case "11121":
                            if (shooter[0] == 0) {
                                teamA[shooter[1]].ISM[0] += 1;
                                teamA[shooter[1]].ISM[2] += 1;
                                teamA[shooter[1]].ISA[0] += 1;
                                teamA[shooter[1]].ISA[2] += 1;
                                if (passer.length > 0) {
                                    teamA[passer[1]].ASTM[0] += 1;
                                    teamA[passer[1]].ASTA[0] += 1;
                                }
                                teamA[shooter[1]].PTS += 2;
                            } else if (shooter[0] == 1) {
                                teamH[shooter[1]].ISM[0] += 1;
                                teamH[shooter[1]].ISM[2] += 1;
                                teamH[shooter[1]].ISA[0] += 1;
                                teamH[shooter[1]].ISA[2] += 1;
                                if (passer.length > 0) {
                                    teamH[passer[1]].ASTM[0] += 1;
                                    teamH[passer[1]].ASTA[0] += 1;
                                }
                                teamH[shooter[1]].PTS += 2;
                            }
                            break;
                        case "11122":
                            if (shooter[0] == 0) {
                                teamA[shooter[1]].ISA[0] += 1;
                                teamA[shooter[1]].ISA[2] += 1;
                                if (passer.length > 0) {
                                    teamA[passer[1]].ASTA[0] += 1;
                                }
                            } else if (shooter[0] == 1) {
                                teamH[shooter[1]].ISA[0] += 1;
                                teamH[shooter[1]].ISA[2] += 1;
                                if (passer.length > 0) {
                                    teamH[passer[1]].ASTA[0] += 1;
                                }
                            }
                            break;
                        case "11123":
                            if (shooter[0] == 0) {
                                teamA[shooter[1]].ISA[0] += 1;
                                teamA[shooter[1]].ISA[2] += 1;
                                if (passer.length > 0) {
                                    teamA[passer[1]].ASTA[0] += 1;
                                }
                                if (contestor.length > 0) {
                                    teamH[contestor[1]].BLK += 1;
                                }
                            } else if (shooter[0] == 1) {
                                teamH[shooter[1]].ISA[0] += 1;
                                teamH[shooter[1]].ISA[2] += 1;
                                if (passer.length > 0) {
                                    teamH[passer[1]].ASTA[0] += 1;
                                }
                                if (contestor.length > 0) {
                                    teamA[contestor[1]].BLK += 1;
                                }
                            }
                            break;
                        case "11211":
                            if (shooter[0] == 0) {
                                teamA[shooter[1]].ISM[0] += 1;
                                teamA[shooter[1]].ISM[1] += 1;
                                teamA[shooter[1]].ISA[0] += 1;
                                teamA[shooter[1]].ISA[1] += 1;
                                if (contestor.length > 0) {
                                    teamH[contestor[1]].CONTESTM[0] += 1;
                                    teamH[contestor[1]].CONTESTA[0] += 1;
                                }
                                teamA[shooter[1]].PTS += 2;
                            } else if (shooter[0] == 1) {
                                teamH[shooter[1]].ISM[0] += 1;
                                teamH[shooter[1]].ISM[1] += 1;
                                teamH[shooter[1]].ISA[0] += 1;
                                teamH[shooter[1]].ISA[1] += 1;
                                if (contestor.length > 0) {
                                    teamA[contestor[1]].CONTESTM[0] += 1;
                                    teamA[contestor[1]].CONTESTA[0] += 1;
                                }
                                teamH[shooter[1]].PTS += 2;
                            }
                            break;
                        case "11212":
                            if (shooter[0] == 0) {
                                teamA[shooter[1]].ISA[0] += 1;
                                teamA[shooter[1]].ISA[1] += 1;
                                if (contestor.length > 0) {
                                    teamH[contestor[1]].CONTESTA[0] += 1;
                                }
                            } else if (shooter[0] == 1) {
                                teamH[shooter[1]].ISA[0] += 1;
                                teamH[shooter[1]].ISA[1] += 1;
                                if (contestor.length > 0) {
                                    teamA[contestor[1]].CONTESTA[0] += 1;
                                }
                            }
                            break;
                        case "11213":
                            if (shooter[0] == 0) {
                                teamA[shooter[1]].ISA[0] += 1;
                                teamA[shooter[1]].ISA[1] += 1;
                                if (contestor.length > 0) {
                                    teamH[contestor[1]].CONTESTA[0] += 1;
                                    teamH[contestor[1]].BLK += 1;
                                }
                            } else if (shooter[0] == 1) {
                                teamH[shooter[1]].ISA[0] += 1;
                                teamH[shooter[1]].ISA[1] += 1;
                                if (contestor.length > 0) {
                                    teamA[contestor[1]].CONTESTA[0] += 1;
                                    teamA[contestor[1]].BLK += 1;
                                }
                            }
                            break;
                        case "11221":
                            if (shooter[0] == 0) {
                                teamA[shooter[1]].ISM[0] += 1;
                                teamA[shooter[1]].ISA[0] += 1;
                                teamA[shooter[1]].PTS += 2;
                            } else if (shooter[0] == 1) {
                                teamH[shooter[1]].ISM[0] += 1;
                                teamH[shooter[1]].ISA[0] += 1;
                                teamH[shooter[1]].PTS += 2;
                            }
                            break;
                        case "11222":
                            if (shooter[0] == 0) {
                                teamA[shooter[1]].ISA[0] += 1;
                            } else if (shooter[0] == 1) {
                                teamH[shooter[1]].ISA[0] += 1;
                            }
                            break;
                        case "11223":
                            if (shooter[0] == 0) {
                                teamA[shooter[1]].ISA[0] += 1;
                                if (contestor.length > 0) {
                                    teamH[contestor[1]].BLK += 1;
                                }
                            } else if (shooter[0] == 1) {
                                teamH[shooter[1]].ISA[0] += 1;
                                if (contestor.length > 0) {
                                    teamA[contestor[1]].BLK += 1;
                                }
                            }
                            break;
                        case "12111":
                            if (shooter[0] == 0) {
                                teamA[shooter[1]].JSM[0] += 1;
                                teamA[shooter[1]].JSM[1] += 1;
                                teamA[shooter[1]].JSM[2] += 1;
                                teamA[shooter[1]].JSA[0] += 1;
                                teamA[shooter[1]].JSA[1] += 1;
                                teamA[shooter[1]].JSA[2] += 1;
                                if (passer.length > 0) {
                                    teamA[passer[1]].ASTM[1] += 1;
                                    teamA[passer[1]].ASTA[1] += 1;
                                }
                                if (contestor.length > 0) {
                                    teamH[contestor[1]].CONTESTM[1] += 1;
                                    teamH[contestor[1]].CONTESTA[1] += 1;
                                }
                                teamA[shooter[1]].PTS += 2;
                            } else if (shooter[0] == 1) {
                                teamH[shooter[1]].JSM[0] += 1;
                                teamH[shooter[1]].JSM[1] += 1;
                                teamH[shooter[1]].JSM[2] += 1;
                                teamH[shooter[1]].JSA[0] += 1;
                                teamH[shooter[1]].JSA[1] += 1;
                                teamH[shooter[1]].JSA[2] += 1;
                                if (passer.length > 0) {
                                    teamH[passer[1]].ASTM[1] += 1;
                                    teamH[passer[1]].ASTA[1] += 1;
                                }
                                if (contestor.length > 0) {
                                    teamA[contestor[1]].CONTESTM[1] += 1;
                                    teamA[contestor[1]].CONTESTA[1] += 1;
                                }
                                teamH[shooter[1]].PTS += 2;
                            }
                            break;
                        case "12112":
                            if (shooter[0] == 0) {
                                teamA[shooter[1]].JSA[0] += 1;
                                teamA[shooter[1]].JSA[1] += 1;
                                teamA[shooter[1]].JSA[2] += 1;
                                if (passer.length > 0) {
                                    teamA[passer[1]].ASTA[1] += 1;
                                }
                                if (contestor.length > 0) {
                                    teamH[contestor[1]].CONTESTA[1] += 1;
                                }
                            } else if (shooter[0] == 1) {
                                teamH[shooter[1]].JSA[0] += 1;
                                teamH[shooter[1]].JSA[1] += 1;
                                teamH[shooter[1]].JSA[2] += 1;
                                if (passer.length > 0) {
                                    teamH[passer[1]].ASTA[1] += 1;
                                }
                                if (contestor.length > 0) {
                                    teamA[contestor[1]].CONTESTA[1] += 1;
                                }
                            }
                            break;
                        case "12113":
                            if (shooter[0] == 0) {
                                teamA[shooter[1]].JSA[0] += 1;
                                teamA[shooter[1]].JSA[1] += 1;
                                teamA[shooter[1]].JSA[2] += 1;
                                if (passer.length > 0) {
                                    teamA[passer[1]].ASTA[1] += 1;
                                }
                                if (contestor.length > 0) {
                                    teamH[contestor[1]].CONTESTA[1] += 1;
                                    teamH[contestor[1]].BLK += 1;
                                }
                            } else if (shooter[0] == 1) {
                                teamH[shooter[1]].JSA[0] += 1;
                                teamH[shooter[1]].JSA[1] += 1;
                                teamH[shooter[1]].JSA[2] += 1;
                                if (passer.length > 0) {
                                    teamH[passer[1]].ASTA[1] += 1;
                                }
                                if (contestor.length > 0) {
                                    teamA[contestor[1]].CONTESTA[1] += 1;
                                    teamA[contestor[1]].BLK += 1;
                                }
                            }
                            break;
                        case "12121":
                            if (shooter[0] == 0) {
                                teamA[shooter[1]].JSM[0] += 1;
                                teamA[shooter[1]].JSM[2] += 1;
                                teamA[shooter[1]].JSA[0] += 1;
                                teamA[shooter[1]].JSA[2] += 1;
                                if (passer.length > 0) {
                                    teamA[passer[1]].ASTM[1] += 1;
                                    teamA[passer[1]].ASTA[1] += 1;
                                }
                                teamA[shooter[1]].PTS += 2;
                            } else if (shooter[0] == 1) {
                                teamH[shooter[1]].JSM[0] += 1;
                                teamH[shooter[1]].JSM[2] += 1;
                                teamH[shooter[1]].JSA[0] += 1;
                                teamH[shooter[1]].JSA[2] += 1;
                                if (passer.length > 0) {
                                    teamH[passer[1]].ASTM[1] += 1;
                                    teamH[passer[1]].ASTA[1] += 1;
                                }
                                teamH[shooter[1]].PTS += 2;
                            }
                            break;
                        case "12122":
                            if (shooter[0] == 0) {
                                teamA[shooter[1]].JSA[0] += 1;
                                teamA[shooter[1]].JSA[2] += 1;
                                if (passer.length > 0) {
                                    teamA[passer[1]].ASTA[1] += 1;
                                }
                            } else if (shooter[0] == 1) {
                                teamH[shooter[1]].JSA[0] += 1;
                                teamH[shooter[1]].JSA[2] += 1;
                                if (passer.length > 0) {
                                    teamH[passer[1]].ASTA[1] += 1;
                                }
                            }
                            break;
                        case "12123":
                            if (shooter[0] == 0) {
                                teamA[shooter[1]].JSA[0] += 1;
                                teamA[shooter[1]].JSA[2] += 1;
                                if (passer.length > 0) {
                                    teamA[passer[1]].ASTA[1] += 1;
                                }
                                if (contestor.length > 0) {
                                    teamH[contestor[1]].BLK += 1;
                                }
                            } else if (shooter[0] == 1) {
                                teamH[shooter[1]].JSA[0] += 1;
                                teamH[shooter[1]].JSA[2] += 1;
                                if (passer.length > 0) {
                                    teamH[passer[1]].ASTA[1] += 1;
                                }
                                if (contestor.length > 0) {
                                    teamA[contestor[1]].BLK += 1;
                                }
                            }
                            break;
                        case "12211":
                            if (shooter[0] == 0) {
                                teamA[shooter[1]].JSM[0] += 1;
                                teamA[shooter[1]].JSM[1] += 1;
                                teamA[shooter[1]].JSA[0] += 1;
                                teamA[shooter[1]].JSA[1] += 1;
                                if (contestor.length > 0) {
                                    teamH[contestor[1]].CONTESTM[1] += 1;
                                    teamH[contestor[1]].CONTESTA[1] += 1;
                                }
                                teamA[shooter[1]].PTS += 2;
                            } else if (shooter[0] == 1) {
                                teamH[shooter[1]].JSM[0] += 1;
                                teamH[shooter[1]].JSM[1] += 1;
                                teamH[shooter[1]].JSA[0] += 1;
                                teamH[shooter[1]].JSA[1] += 1;
                                if (contestor.length > 0) {
                                    teamA[contestor[1]].CONTESTM[1] += 1;
                                    teamA[contestor[1]].CONTESTA[1] += 1;
                                }
                                teamH[shooter[1]].PTS += 2;
                            }
                            break;
                        case "12212":
                            if (shooter[0] == 0) {
                                teamA[shooter[1]].JSA[0] += 1;
                                teamA[shooter[1]].JSA[1] += 1;
                                if (contestor.length > 0) {
                                    teamH[contestor[1]].CONTESTA[1] += 1;
                                }
                            } else if (shooter[0] == 1) {
                                teamH[shooter[1]].JSA[0] += 1;
                                teamH[shooter[1]].JSA[1] += 1;
                                if (contestor.length > 0) {
                                    teamA[contestor[1]].CONTESTA[1] += 1;
                                }
                            }
                            break;
                        case "12213":
                            if (shooter[0] == 0) {
                                teamA[shooter[1]].JSA[0] += 1;
                                teamA[shooter[1]].JSA[1] += 1;
                                if (contestor.length > 0) {
                                    teamH[contestor[1]].CONTESTA[1] += 1;
                                    teamH[contestor[1]].BLK += 1;
                                }
                            } else if (shooter[0] == 1) {
                                teamH[shooter[1]].JSA[0] += 1;
                                teamH[shooter[1]].JSA[1] += 1;
                                if (contestor.length > 0) {
                                    teamA[contestor[1]].CONTESTA[1] += 1;
                                    teamA[contestor[1]].BLK += 1;
                                }
                            }
                            break;
                        case "12221":
                            if (shooter[0] == 0) {
                                teamA[shooter[1]].JSM[0] += 1;
                                teamA[shooter[1]].JSA[0] += 1;
                                teamA[shooter[1]].PTS += 2;
                            } else if (shooter[0] == 1) {
                                teamH[shooter[1]].JSM[0] += 1;
                                teamH[shooter[1]].JSA[0] += 1;
                                teamH[shooter[1]].PTS += 2;
                            }
                            break;
                        case "12222":
                            if (shooter[0] == 0) {
                                teamA[shooter[1]].JSA[0] += 1;
                            } else if (shooter[0] == 1) {
                                teamH[shooter[1]].JSA[0] += 1;
                            }
                            break;
                        case "12223":
                            if (shooter[0] == 0) {
                                teamA[shooter[1]].JSA[0] += 1;
                                if (contestor.length > 0) {
                                    teamH[contestor[1]].BLK += 1;
                                }
                            } else if (shooter[0] == 1) {
                                teamH[shooter[1]].JSA[0] += 1;
                                if (contestor.length > 0) {
                                    teamA[contestor[1]].BLK += 1;
                                }
                            }
                            break;
                        case "13111":
                            if (shooter[0] == 0) {
                                teamA[shooter[1]].P3M[0] += 1;
                                teamA[shooter[1]].P3M[1] += 1;
                                teamA[shooter[1]].P3M[2] += 1;
                                teamA[shooter[1]].P3A[0] += 1;
                                teamA[shooter[1]].P3A[1] += 1;
                                teamA[shooter[1]].P3A[2] += 1;
                                if (passer.length > 0) {
                                    teamA[passer[1]].ASTM[2] += 1;
                                    teamA[passer[1]].ASTA[2] += 1;
                                }
                                if (contestor.length > 0) {
                                    teamH[contestor[1]].CONTESTM[2] += 1;
                                    teamH[contestor[1]].CONTESTA[2] += 1;
                                }
                                teamA[shooter[1]].PTS += 3;
                            } else if (shooter[0] == 1) {
                                teamH[shooter[1]].P3M[0] += 1;
                                teamH[shooter[1]].P3M[1] += 1;
                                teamH[shooter[1]].P3M[2] += 1;
                                teamH[shooter[1]].P3A[0] += 1;
                                teamH[shooter[1]].P3A[1] += 1;
                                teamH[shooter[1]].P3A[2] += 1;
                                if (passer.length > 0) {
                                    teamH[passer[1]].ASTM[2] += 1;
                                    teamH[passer[1]].ASTA[2] += 1;
                                }
                                if (contestor.length > 0) {
                                    teamA[contestor[1]].CONTESTM[2] += 1;
                                    teamA[contestor[1]].CONTESTA[2] += 1;
                                }
                                teamH[shooter[1]].PTS += 3;
                            }
                            break;
                        case "13112":
                            if (shooter[0] == 0) {
                                teamA[shooter[1]].P3A[0] += 1;
                                teamA[shooter[1]].P3A[1] += 1;
                                teamA[shooter[1]].P3A[2] += 1;
                                if (passer.length > 0) {
                                    teamA[passer[1]].ASTA[2] += 1;
                                }
                                if (contestor.length > 0) {
                                    teamH[contestor[1]].CONTESTA[2] += 1;
                                }
                            } else if (shooter[0] == 1) {
                                teamH[shooter[1]].P3A[0] += 1;
                                teamH[shooter[1]].P3A[1] += 1;
                                teamH[shooter[1]].P3A[2] += 1;
                                if (passer.length > 0) {
                                    teamH[passer[1]].ASTA[2] += 1;
                                }
                                if (contestor.length > 0) {
                                    teamA[contestor[1]].CONTESTA[2] += 1;
                                }
                            }
                            break;
                        case "13113":
                            if (shooter[0] == 0) {
                                teamA[shooter[1]].P3A[0] += 1;
                                teamA[shooter[1]].P3A[1] += 1;
                                teamA[shooter[1]].P3A[2] += 1;
                                if (passer.length > 0) {
                                    teamA[passer[1]].ASTA[2] += 1;
                                }
                                if (contestor.length > 0) {
                                    teamH[contestor[1]].CONTESTA[2] += 1;
                                    teamH[contestor[1]].BLK += 1;
                                }
                            } else if (shooter[0] == 1) {
                                teamH[shooter[1]].P3A[0] += 1;
                                teamH[shooter[1]].P3A[1] += 1;
                                teamH[shooter[1]].P3A[2] += 1;
                                if (passer.length > 0) {
                                    teamH[passer[1]].ASTA[2] += 1;
                                }
                                if (contestor.length > 0) {
                                    teamA[contestor[1]].CONTESTA[2] += 1;
                                    teamA[contestor[1]].BLK += 1;
                                }
                            }
                            break;
                        case "13121":
                            if (shooter[0] == 0) {
                                teamA[shooter[1]].P3M[0] += 1;
                                teamA[shooter[1]].P3M[2] += 1;
                                teamA[shooter[1]].P3A[0] += 1;
                                teamA[shooter[1]].P3A[2] += 1;
                                if (passer.length > 0) {
                                    teamA[passer[1]].ASTM[2] += 1;
                                    teamA[passer[1]].ASTA[2] += 1;
                                }
                                teamA[shooter[1]].PTS += 3;
                            } else if (shooter[0] == 1) {
                                teamH[shooter[1]].P3M[0] += 1;
                                teamH[shooter[1]].P3M[2] += 1;
                                teamH[shooter[1]].P3A[0] += 1;
                                teamH[shooter[1]].P3A[2] += 1;
                                if (passer.length > 0) {
                                    teamH[passer[1]].ASTM[2] += 1;
                                    teamH[passer[1]].ASTA[2] += 1;
                                }
                                teamH[shooter[1]].PTS += 3;
                            }
                            break;
                        case "13122":
                            if (shooter[0] == 0) {
                                teamA[shooter[1]].P3A[0] += 1;
                                teamA[shooter[1]].P3A[2] += 1;
                                if (passer.length > 0) {
                                    teamA[passer[1]].ASTA[2] += 1;
                                }
                            } else if (shooter[0] == 1) {
                                teamH[shooter[1]].P3A[0] += 1;
                                teamH[shooter[1]].P3A[2] += 1;
                                if (passer.length > 0) {
                                    teamH[passer[1]].ASTA[2] += 1;
                                }
                            }
                            break;
                        case "13123":
                            if (shooter[0] == 0) {
                                teamA[shooter[1]].P3A[0] += 1;
                                teamA[shooter[1]].P3A[2] += 1;
                                if (passer.length > 0) {
                                    teamA[passer[1]].ASTA[2] += 1;
                                }
                                if (contestor.length > 0) {
                                    teamH[contestor[1]].BLK += 1;
                                }
                            } else if (shooter[0] == 1) {
                                teamH[shooter[1]].P3A[0] += 1;
                                teamH[shooter[1]].P3A[2] += 1;
                                if (passer.length > 0) {
                                    teamH[passer[1]].ASTA[2] += 1;
                                }
                                if (contestor.length > 0) {
                                    teamA[contestor[1]].BLK += 1;
                                }
                            }
                            break;
                        case "13211":
                            if (shooter[0] == 0) {
                                teamA[shooter[1]].P3M[0] += 1;
                                teamA[shooter[1]].P3M[1] += 1;
                                teamA[shooter[1]].P3A[0] += 1;
                                teamA[shooter[1]].P3A[1] += 1;
                                if (contestor.length > 0) {
                                    teamH[contestor[1]].CONTESTM[2] += 1;
                                    teamH[contestor[1]].CONTESTA[2] += 1;
                                }
                                teamA[shooter[1]].PTS += 3;
                            } else if (shooter[0] == 1) {
                                teamH[shooter[1]].P3M[0] += 1;
                                teamH[shooter[1]].P3M[1] += 1;
                                teamH[shooter[1]].P3A[0] += 1;
                                teamH[shooter[1]].P3A[1] += 1;
                                if (contestor.length > 0) {
                                    teamA[contestor[1]].CONTESTM[2] += 1;
                                    teamA[contestor[1]].CONTESTA[2] += 1;
                                }
                                teamH[shooter[1]].PTS += 3;
                            }
                            break;
                        case "13212":
                            if (shooter[0] == 0) {
                                teamA[shooter[1]].P3A[0] += 1;
                                teamA[shooter[1]].P3A[1] += 1;
                                if (contestor.length > 0) {
                                    teamH[contestor[1]].CONTESTA[2] += 1;
                                }
                            } else if (shooter[0] == 1) {
                                teamH[shooter[1]].P3A[0] += 1;
                                teamH[shooter[1]].P3A[1] += 1;
                                if (contestor.length > 0) {
                                    teamA[contestor[1]].CONTESTA[2] += 1;
                                }
                            }
                            break;
                        case "13213":
                            if (shooter[0] == 0) {
                                teamA[shooter[1]].P3A[0] += 1;
                                teamA[shooter[1]].P3A[1] += 1;
                                if (contestor.length > 0) {
                                    teamH[contestor[1]].CONTESTA[2] += 1;
                                    teamH[contestor[1]].BLK += 1;
                                }
                            } else if (shooter[0] == 1) {
                                teamH[shooter[1]].P3A[0] += 1;
                                teamH[shooter[1]].P3A[1] += 1;
                                if (contestor.length > 0) {
                                    teamA[contestor[1]].CONTESTA[2] += 1;
                                    teamA[contestor[1]].BLK += 1;
                                }
                            }
                            break;
                        case "13221":
                            if (shooter[0] == 0) {
                                teamA[shooter[1]].P3M[0] += 1;
                                teamA[shooter[1]].P3A[0] += 1;
                                teamA[shooter[1]].PTS += 3;
                            } else if (shooter[0] == 1) {
                                teamH[shooter[1]].P3M[0] += 1;
                                teamH[shooter[1]].P3A[0] += 1;
                                teamH[shooter[1]].PTS += 3;
                            }
                            break;
                        case "13222":
                            if (shooter[0] == 0) {
                                teamA[shooter[1]].P3A[0] += 1;
                            } else if (shooter[0] == 1) {
                                teamH[shooter[1]].P3A[0] += 1;
                            }
                            break;
                        case "13223":
                            if (shooter[0] == 0) {
                                teamA[shooter[1]].P3A[0] += 1;
                                if (contestor.length > 0) {
                                    teamH[contestor[1]].BLK += 1;
                                }
                            } else if (shooter[0] == 1) {
                                teamH[shooter[1]].P3A[0] += 1;
                                if (contestor.length > 0) {
                                    teamA[contestor[1]].BLK += 1;
                                }
                            }
                            break;
                    }

                    // 正负值
                    if (category[0] == "1" && category[4] == "1") {
                        if (category[1] == "1" || category[1] == "2") {
                            for (var i = 0; i < teamA.length - 1; i++) {
                                if (teamA[i].OnCourt >= 1) {
                                    teamA[i].PlusMinus += 2 * ((-2) * shooter[0] + 1);
                                }
                            }
                            for (var i = 0; i < teamH.length - 1; i++) {
                                if (teamH[i].OnCourt >= 1) {
                                    teamH[i].PlusMinus += 2 * (2 * shooter[0] - 1);
                                }
                            }
                        } else if (category[1] == "3") {
                            for (var i = 0; i < teamA.length - 1; i++) {
                                if (teamA[i].OnCourt >= 1) {
                                    teamA[i].PlusMinus += 3 * ((-2) * shooter[0] + 1);
                                }
                            }
                            for (var i = 0; i < teamH.length - 1; i++) {
                                if (teamH[i].OnCourt >= 1) {
                                    teamH[i].PlusMinus += 3 * (2 * shooter[0] - 1);
                                }
                            }
                        }

                    }
                } // 2 补充助攻
                //console.log(passerNamed)
                if (slice.includes("%这球传的不错") ||
                    slice.includes("%这球给的太漂亮了") ||
                    passerNamed[length.passerNamed - 1] > 0) {
                    var passer = [relatedPlayersSequence[0].team,
                        relatedPlayersSequence[0].ind
                    ];
                    let shootType = passerNamed[passerNamed.length - 1];
                    if (passer[0] == 0) {
                        teamA[passer[1]].ASTM[shootType - 1] += 1;
                        teamA[passer[1]].ASTA[shootType - 1] += 1;
                        if (shootType == 1) {
                            teamA[shooterPrev[shooterPrev.length - 1][1]].ISM[2] += 1;
                            teamA[shooterPrev[shooterPrev.length - 1][1]].ISA[2] += 1;
                        } else if (shootType == 2) {
                            teamA[shooterPrev[shooterPrev.length - 1][1]].JSM[2] += 1;
                            teamA[shooterPrev[shooterPrev.length - 1][1]].JSA[2] += 1;
                        } else if (shootType == 3) {
                            teamA[shooterPrev[shooterPrev.length - 1][1]].P3M[2] += 1;
                            teamA[shooterPrev[shooterPrev.length - 1][1]].P3A[2] += 1;
                        }


                    } else if (passer[0] == 1) {
                        teamH[passer[1]].ASTM[shootType - 1] += 1;
                        teamH[passer[1]].ASTA[shootType - 1] += 1;
                        if (shootType == 1) {
                            teamH[shooterPrev[shooterPrev.length - 1][1]].ISM[2] += 1;
                            teamH[shooterPrev[shooterPrev.length - 1][1]].ISA[2] += 1;
                        } else if (shootType == 2) {
                            teamH[shooterPrev[shooterPrev.length - 1][1]].JSM[2] += 1;
                            teamH[shooterPrev[shooterPrev.length - 1][1]].JSA[2] += 1;
                        } else if (shootType == 3) {
                            teamH[shooterPrev[shooterPrev.length - 1][1]].P3M[2] += 1;
                            teamH[shooterPrev[shooterPrev.length - 1][1]].P3A[2] += 1;
                        }
                    }


                }

                // 3-1 前场板
                if (
                    slice.includes("%把位置卡死了") ||
                    slice.includes("%从侧翼起跳") ||
                    slice.includes("%捡到了进攻篮板") ||
                    slice.includes("%拿到进攻篮板") ||
                    slice.includes("拿到进攻篮板") ||
                    slice.includes("拼抢下进攻篮板") ||
                    slice.includes("抢到进攻篮板!")
                ) {
                    var rebounder = [relatedPlayersSequence[0].team,
                        relatedPlayersSequence[0].ind
                    ];

                    if (rebounder[0] == 0) {
                        teamA[rebounder[1]].OREB += 1;
                    } else if (rebounder[0] == 1) {
                        teamH[rebounder[1]].OREB += 1;
                    }

                }

                // 3-2 后场板
                if (
                    slice.includes("%控制住防守篮板") ||
                    slice.includes("%拿下防守篮板") ||
                    slice.includes("%抢到篮板") ||
                    slice.includes("%轻松拿到这个防守篮板") ||
                    slice.includes("%摘下防守篮板")
                ) {
                    var rebounder = [relatedPlayersSequence[0].team,
                        relatedPlayersSequence[0].ind
                    ];

                    if (rebounder[0] == 0) {
                        teamA[rebounder[1]].DREB += 1;
                    } else if (rebounder[0] == 1) {
                        teamH[rebounder[1]].DREB += 1;
                    }

                }

                // 4-1 防守犯规
                else if (
                    slice.includes("诶？什么情况？裁判吹了%一次犯规") ||
                    slice.includes("给的是%的投篮犯规")
                ) {
                    var fouler = [relatedPlayersSequence[0].team,
                        relatedPlayersSequence[0].ind
                    ];

                    if (fouler[0] == 0) {
                        teamA[fouler[1]].FOUL += 1;
                    } else if (fouler[0] == 1) {
                        teamH[fouler[1]].FOUL += 1;
                    }

                }
                // 4-2 进攻犯规
                else if (
                    slice.includes("裁判怎么说？进攻犯规")
                ) {
                    var fouler = [relatedPlayersSequence[0].team,
                        relatedPlayersSequence[0].ind
                    ];

                    if (fouler[0] == 0) {
                        teamA[fouler[1]].FOUL += 1;
                        teamA[fouler[1]].TO += 1;
                    } else if (fouler[0] == 1) {
                        teamH[fouler[1]].FOUL += 1;
                        teamH[fouler[1]].TO += 1;
                    }

                }

                // 5-1 罚进
                else if (
                    slice.includes("%罚球有了") ||
                    slice.includes("%罚中") ||
                    slice.includes("%罚进") ||
                    slice.includes("%稳稳罚进") ||
                    slice.includes("打在篮框前沿") ||
                    slice.includes("还是进了")
                ) {
                    //console.log(teamA[0].OnCourt)
                    var fter = [relatedPlayersSequence[0].team,
                        relatedPlayersSequence[0].ind
                    ];

                    if (fter[0] == 0) {
                        teamA[fter[1]].FTM += 1;
                        teamA[fter[1]].FTA += 1;
                        teamA[fter[1]].PTS += 1;

                        for (var i = 0; i < teamA.length - 1; i++) {
                            if (teamA[i].OnCourt >= 1) {
                                teamA[i].PlusMinus += 1;

                            }
                        }
                        for (var i = 0; i < teamH.length - 1; i++) {
                            if (teamH[i].OnCourt >= 1) {
                                teamH[i].PlusMinus -= 1;
                            }
                        }

                    } else if (fter[0] == 1) {
                        teamH[fter[1]].FTM += 1;
                        teamH[fter[1]].FTA += 1;
                        teamH[fter[1]].PTS += 1;

                        for (var i = 0; i < teamA.length - 1; i++) {
                            if (teamA[i].OnCourt >= 1) {
                                teamA[i].PlusMinus -= 1;
                            }
                        }
                        for (var i = 0; i < teamH.length - 1; i++) {
                            if (teamH[i].OnCourt >= 1) {
                                teamH[i].PlusMinus += 1;
                            }
                        }
                    }

                }

                // 5-2 未罚进
                else if (
                    slice.includes("弹框而出") || (slice.includes("%罚球") && slice.includes("没进"))
                ) {
                    var fter = [relatedPlayersSequence[0].team,
                        relatedPlayersSequence[0].ind
                    ];

                    if (fter[0] == 0) {
                        teamA[fter[1]].FTA += 1;
                    } else if (fter[0] == 1) {
                        teamH[fter[1]].FTA += 1;
                    }

                }

                // 6-1 抢断 失误者前 抢断者后
                else if (
                    slice.includes("%把传球断了") ||
                    slice.includes("%把球断了") ||
                    slice.includes("%长传,被%断到传球") ||
                    slice.includes("%直接把球给断了") ||
                    slice.includes("被%断了") ||
                    slice.includes("%把球断了")
                ) {
                    var toer = [relatedPlayersSequence[0].team,
                        relatedPlayersSequence[0].ind
                    ];
                    var stealer = [relatedPlayersSequence[1].team,
                        relatedPlayersSequence[1].ind
                    ];

                    if (toer[0] == 0) {
                        teamA[toer[1]].TO += 1;
                        teamH[stealer[1]].STL += 1;
                    } else if (toer[0] == 1) {
                        teamH[toer[1]].TO += 1;
                        teamA[stealer[1]].STL += 1;
                    }


                }

                // 6-2 个人失误
                else if (
                    slice.includes("%把球运到了脚上") ||
                    slice.includes("%进攻三秒违例") ||
                    slice.includes("%直接把球传出了界外") ||
                    slice.includes("你早传啊") ||
                    slice.includes("三秒违例") ||
                    slice.includes("这球走步了啊") ||
                    slice.includes("%传给弧顶") ||
                    slice.includes("%传球给底线")
                ) {
                    var toer = [relatedPlayersSequence[0].team,
                        relatedPlayersSequence[0].ind
                    ];

                    if (toer[0] == 0) {
                        teamA[toer[1]].TO += 1;
                    } else if (toer[0] == 1) {
                        teamH[toer[1]].TO += 1;
                    }
                }

                // 6-3 团队失误
                else if (
                    slice.includes("%24秒进攻违例")
                ) {
                    var toer = [relatedPlayersSequence[0].team,
                        relatedPlayersSequence[0].ind
                    ];

                    if (toer[0] == 0) {
                        teamA[toer[1]].TO += 1;
                    } else if (toer[0] == 1) {
                        teamH[toer[1]].TO += 1;
                    }
                }

                // 7-1 换人 前被后换下
                else if (
                    slice.includes("%被%换下") ||
                    slice.includes("%被%换下场") ||
                    slice.includes("%你打的像坨屎") ||
                    slice.includes("和%耳语着什么")
                ) {
                    var subout = [relatedPlayersSequence[0].team,
                        relatedPlayersSequence[0].ind
                    ];
                    var subin = [relatedPlayersSequence[1].team,
                        relatedPlayersSequence[1].ind
                    ];

                    if (subout[0] == 0) {
                        teamA[subin[1]].OnCourt = teamA[subout[1]].OnCourt;
                        teamA[subout[1]].OnCourt = 0;
                    } else if (subout[0] == 1) {
                        teamH[subin[1]].OnCourt = teamH[subout[1]].OnCourt;
                        teamH[subout[1]].OnCourt = 0;
                    }
                }

                // 7-2 换人 前把后换下
                else if (
                    slice.includes("和%击了个掌") ||
                    slice.includes("换下%") ||
                    slice.includes("换下了%") ||
                    slice.includes("换下了他") ||
                    slice.includes("他准备替换%上场了") ||
                    slice.includes("在技术台下等候多时的%站起来") ||
                    slice.includes("指了指%") ||
                    slice.includes("给%使了个眼色")
                ) {
                    var subout = [relatedPlayersSequence[1].team,
                        relatedPlayersSequence[1].ind
                    ];
                    var subin = [relatedPlayersSequence[0].team,
                        relatedPlayersSequence[0].ind
                    ];

                    if (subout[0] == 0) {
                        teamA[subin[1]].OnCourt = teamA[subout[1]].OnCourt;
                        teamA[subout[1]].OnCourt = 0;
                    } else if (subout[0] == 1) {
                        teamH[subin[1]].OnCourt = teamH[subout[1]].OnCourt;
                        teamH[subout[1]].OnCourt = 0;
                    }
                }

                // 7-3 互换位置
                else if (
                    slice.includes("%与%拍手之后") ||
                    slice.includes("%给%递了个眼神")
                ) {
                    var subout = [relatedPlayersSequence[1].team,
                        relatedPlayersSequence[1].ind
                    ];
                    var subin = [relatedPlayersSequence[0].team,
                        relatedPlayersSequence[0].ind
                    ];

                    if (subout[0] == 0) {
                        let swap = teamA[subin[1]].OnCourt;
                        teamA[subin[1]].OnCourt = teamA[subout[1]].OnCourt;
                        teamA[subout[1]].OnCourt = swap;
                    } else if (subout[0] == 1) {
                        let swap = teamH[subin[1]].OnCourt;
                        teamH[subin[1]].OnCourt = teamH[subout[1]].OnCourt;
                        teamH[subout[1]].OnCourt = swap;
                    }
                }
        }
    }


    // rank by PTS and team stat
    var teamAP = teamA.slice(0, teamA.length - 1).sort((a, b) => ((b.PTS - a.PTS) || (+(b.PTS == a.PTS) && (b.MINUTE[0] - a.MINUTE[0]))));
    teamAP.push(teamA[teamA.length - 1]);
    teamA = teamAP;

    for (let i = 0; i < teamA.length - 1; i++) {

        teamA[teamA.length - 1].ISM = addArrays(teamA[teamA.length - 1].ISM, teamA[i].ISM);
        teamA[teamA.length - 1].JSM = addArrays(teamA[teamA.length - 1].JSM, teamA[i].JSM);
        teamA[teamA.length - 1].P3M = addArrays(teamA[teamA.length - 1].P3M, teamA[i].P3M);
        teamA[teamA.length - 1].ISA = addArrays(teamA[teamA.length - 1].ISA, teamA[i].ISA);
        teamA[teamA.length - 1].JSA = addArrays(teamA[teamA.length - 1].JSA, teamA[i].JSA);
        teamA[teamA.length - 1].P3A = addArrays(teamA[teamA.length - 1].P3A, teamA[i].P3A);
        teamA[teamA.length - 1].CONTESTM = addArrays(teamA[teamA.length - 1].CONTESTM, teamA[i].CONTESTM);
        teamA[teamA.length - 1].CONTESTA = addArrays(teamA[teamA.length - 1].CONTESTA, teamA[i].CONTESTA);
        teamA[teamA.length - 1].ASTM = addArrays(teamA[teamA.length - 1].ASTM, teamA[i].ASTM);
        teamA[teamA.length - 1].ASTA[0] = teamA[teamA.length-1].ISA[0] - teamA[teamA.length-1].ISA[1]
        teamA[teamA.length - 1].ASTA[1] = teamA[teamA.length-1].JSA[0] - teamA[teamA.length-1].JSA[1]
        teamA[teamA.length - 1].ASTA[2] = teamA[teamA.length-1].P3A[0] - teamA[teamA.length-1].P3A[1]
        teamA[teamA.length - 1].FTM += teamA[i].FTM;
        teamA[teamA.length - 1].FTA += teamA[i].FTA;
        teamA[teamA.length - 1].OREB += teamA[i].OREB;
        teamA[teamA.length - 1].DREB += teamA[i].DREB;
        teamA[teamA.length - 1].TO += teamA[i].TO;
        teamA[teamA.length - 1].STL += teamA[i].STL;
        teamA[teamA.length - 1].BLK += teamA[i].BLK;
        teamA[teamA.length - 1].FOUL += teamA[i].FOUL;
        teamA[teamA.length - 1].PTS += teamA[i].PTS;
        teamA[teamA.length - 1].MINUTE[0] += teamA[i].MINUTE[0];
    }
    teamA[teamA.length - 1].PlusMinus = '';
    teamA[teamA.length - 1].MINUTE[0] /= 5;


    GM_log(teamA)
    GM_log(teamH)
    // Team A - Basics

    const boxToAdd = pbp.getElementsByClassName("boxcontent")[0];
    const boxRef = pbp.getElementsByTagName("table")[0];
    const tableA1 = document.createElement("p");
    boxToAdd.insertBefore(tableA1, boxRef);

    let table = document.createElement('table');
    table.style = 'width: 99%'
    let thead = document.createElement('thead');
    thead.className = 'tableheader';
    let tbody = document.createElement('tbody');
    table.appendChild(thead);
    table.appendChild(tbody);

    tableA1.appendChild(table);

    let headText = [teamA[teamA.length - 1].name,
        '分钟',
        '命中',
        '内投',
        '中距离',
        '三分',
        '罚球',
        '+/-',
        '攻板',
        '篮板',
        '助攻',
        '失误',
        '抢断',
        '盖帽',
        '犯规',
        '得分'
    ];
    let r1 = document.createElement('tr');
    r1.className = 'tableHeader';
    for (let i = 0; i < headText.length; i++) {
        let heading_1 = document.createElement('th');
        if (i == 0) {
            heading_1.style = 'text-align:left';
        }
        heading_1.innerHTML = headText[i];
        r1.appendChild(heading_1);
    }

    thead.appendChild(r1);

    for (let i = 0; i < teamA.length; i++) {
        let r2 = document.createElement('tr');
        if (i == teamA.length - 1) {
            r2.className = 'headline';
        } else if (i % 2 == 1) {
            r2.style = 'background:#EEEEEE';
        } else {
            r2.style = 'background:#FFFFFF';
        }
        var bodytext = [getPosition(teamA[i].MINUTE, teamA[i]),
            teamA[i].MINUTE[0].toFixed(0),
            `${teamA[i].ISM[0]+teamA[i].JSM[0]+teamA[i].P3M[0]} - ${teamA[i].ISA[0]+teamA[i].JSA[0]+teamA[i].P3A[0]}`,
            `${teamA[i].ISM[0]} - ${teamA[i].ISA[0]}`,
            `${teamA[i].JSM[0]} - ${teamA[i].JSA[0]}`,
            `${teamA[i].P3M[0]} - ${teamA[i].P3A[0]}`,
            `${teamA[i].FTM} - ${teamA[i].FTA}`,
            (teamA[i].PlusMinus <= 0 ? "" : "+") + teamA[i].PlusMinus,
            teamA[i].OREB,
            teamA[i].OREB + teamA[i].DREB,
            teamA[i].ASTM[0] + teamA[i].ASTM[1] + teamA[i].ASTM[2],
            teamA[i].TO,
            teamA[i].STL,
            teamA[i].BLK,
            teamA[i].FOUL,
            teamA[i].PTS,
            teamA[i].FTM
        ];

        for (let j = 0; j < headText.length; j++) {
            let dat = document.createElement('td');
            if (j > 0) {
                dat.style = 'text-align:center';
            }

            dat.innerHTML = bodytext[j];
            r2.appendChild(dat);
        }
        tbody.appendChild(r2);
    }

    r2 = document.createElement('tr');
    r2.className = 'headline';
    var bodytext = ['',
        '',
        ((teamA[teamA.length - 1].ISM[0] + teamA[teamA.length - 1].JSM[0] + teamA[teamA.length - 1].P3M[0]) / (teamA[teamA.length - 1].ISA[0] + teamA[teamA.length - 1].JSA[0] + teamA[teamA.length - 1].P3A[0])).toFixed(3),
        ((teamA[teamA.length - 1].ISM[0]) / (teamA[teamA.length - 1].ISA[0])).toFixed(3),
        ((teamA[teamA.length - 1].JSM[0]) / (teamA[teamA.length - 1].JSA[0])).toFixed(3),
        ((teamA[teamA.length - 1].P3M[0]) / (teamA[teamA.length - 1].P3A[0])).toFixed(3),
        ((teamA[teamA.length - 1].FTM) / (teamA[teamA.length - 1].FTA)).toFixed(3),
    ];

    for (let j = 0; j < bodytext.length; j++) {
        let dat = document.createElement('td');
        dat.style = 'text-align:center'
        dat.innerHTML = bodytext[j];
        r2.appendChild(dat);
    }
    tbody.appendChild(r2);

    // Team A - Offense

    const tableA2 = document.createElement("p");
    boxToAdd.insertBefore(tableA2, boxRef);

    table = document.createElement('table');
    table.style = 'width: 99%'
    thead = document.createElement('thead');
    tbody = document.createElement('tbody');
    table.appendChild(thead);
    table.appendChild(tbody);

    tableA2.appendChild(table);

    headText = [teamA[teamA.length - 1].name,
        '真实<br>命中率',
        '总命中率',
        '干扰下<br>投篮',
        '干扰下<br>命中',
        '接球攻<br>投篮',
        '接球攻<br>命中',
        '传内线',
        '传中距离',
        '传三分',
        '传球<br>转化率'
    ];
    r1 = document.createElement('tr');
    r1.className = 'tableHeader';
    for (let i = 0; i < headText.length; i++) {
        let heading_1 = document.createElement('th');
        if (i == 0) {
            heading_1.style = 'text-align:left';
        }
        heading_1.innerHTML = headText[i];
        r1.appendChild(heading_1);
    }

    thead.appendChild(r1);

    for (let i = 0; i < teamA.length; i++) {
        let r2 = document.createElement('tr');
        if (i == teamA.length - 1) {
            r2.className = 'headline';
        } else if (i % 2 == 1) {
            r2.style = 'background:#EEEEEE';
        } else {
            r2.style = 'background:#FFFFFF';
        }
        bodytext = [
            getPosition(teamA[i].MINUTE, teamA[i]),
            (teamA[i].PTS / (teamA[i].ISA[0] + teamA[i].JSA[0] + teamA[i].P3A[0] + teamA[i].FTA * 0.44) / 2).toFixed(3),
            ((teamA[i].ISM[0] + teamA[i].JSM[0] + teamA[i].P3M[0]) / (teamA[i].ISA[0] + teamA[i].JSA[0] + teamA[i].P3A[0])).toFixed(3),
            `${teamA[i].ISM[1]+teamA[i].JSM[1]+teamA[i].P3M[1]} - ${teamA[i].ISA[1]+teamA[i].JSA[1]+teamA[i].P3A[1]}`,
            ((teamA[i].ISM[1] + teamA[i].JSM[1] + teamA[i].P3M[1]) / (teamA[i].ISA[1] + teamA[i].JSA[1] + teamA[i].P3A[1])).toFixed(3),
            `${teamA[i].ISM[0] - teamA[i].ISM[1] + teamA[i].JSM[0] - teamA[i].JSM[1] + teamA[i].P3M[0] - teamA[i].P3M[1]} - ${teamA[i].ISA[0] - teamA[i].ISA[1] + teamA[i].JSA[0] - teamA[i].JSA[1] + teamA[i].P3A[0] - teamA[i].P3A[1]}`,
            ((teamA[i].ISM[0] - teamA[i].ISM[1] + teamA[i].JSM[0] - teamA[i].JSM[1] + teamA[i].P3M[0] - teamA[i].P3M[1]) / (teamA[i].ISA[0] - teamA[i].ISA[1] + teamA[i].JSA[0] - teamA[i].JSA[1] + teamA[i].P3A[0] - teamA[i].P3A[1])).toFixed(3),
            `${teamA[i].ASTM[0]} - ${teamA[i].ASTA[0]}`,
            `${teamA[i].ASTM[1]} - ${teamA[i].ASTA[1]}`,
            `${teamA[i].ASTM[2]} - ${teamA[i].ASTA[2]}`,
            ((teamA[i].ASTM[0] + teamA[i].ASTM[1] + teamA[i].ASTM[2]) / (teamA[i].ASTA[0] + teamA[i].ASTA[1] + teamA[i].ASTA[2])).toFixed(3)
        ];
        //bodytext.replace('NaN','-');
        for (let j = 0; j < headText.length; j++) {
            let dat = document.createElement('td');
            if (j > 0) {
                dat.style = 'text-align:center';
            }
            if (bodytext[j] == 'NaN') {
                bodytext[j] = '-';
            }
            dat.innerHTML = bodytext[j];
            r2.appendChild(dat);
        }
        tbody.appendChild(r2);
    }


    // Team A - Advanced

    const tableA3 = document.createElement("p");
    boxToAdd.insertBefore(tableA3, boxRef);

    table = document.createElement('table');
    table.style = 'width: 99%'
    thead = document.createElement('thead');
    tbody = document.createElement('tbody');
    table.appendChild(thead);
    table.appendChild(tbody);

    tableA3.appendChild(table);

    headText = [teamA[teamA.length - 1].name,
        '防内投',
        '防中距离',
        '防三分',
        '防总计',
        '防对手<br>命中率',
        '球权<br>使用率',
        '助攻率',
        '篮板率',
        '进攻<br>篮板率',
        '防守<br>篮板率',
        '失误率'
    ];
    r1 = document.createElement('tr');
    r1.className = 'tableHeader';

    for (let i = 0; i < headText.length; i++) {
        let heading_1 = document.createElement('th');
        if (i == 0) {
            heading_1.style = 'text-align:left';
        }
        heading_1.innerHTML = headText[i];
        r1.appendChild(heading_1);
    }

    thead.appendChild(r1);

    // 全队没有使用率、助攻率等数据
    for (let i = 0; i < teamA.length - 1; i++) {
        var r2 = document.createElement('tr');
        if (i == teamA.length - 1) {
            r2.className = 'headline';
        } else if (i % 2 == 1) {
            r2.style = 'background:#EEEEEE';
        } else {
            r2.style = 'background:#FFFFFF';
        }
        bodytext = [
            getPosition(teamA[i].MINUTE, teamA[i]),
            `${teamA[i].CONTESTM[0]} - ${teamA[i].CONTESTA[0]}`,
            `${teamA[i].CONTESTM[1]} - ${teamA[i].CONTESTA[1]}`,
            `${teamA[i].CONTESTM[2]} - ${teamA[i].CONTESTA[2]}`,
            `${teamA[i].CONTESTM[0]+teamA[i].CONTESTM[1]+teamA[i].CONTESTM[2]} - ${teamA[i].CONTESTA[0]+teamA[i].CONTESTA[1]+teamA[i].CONTESTA[2]}`,
            ((teamA[i].CONTESTM[0] + teamA[i].CONTESTM[1] + teamA[i].CONTESTM[2]) / (teamA[i].CONTESTA[0] + teamA[i].CONTESTA[1] + teamA[i].CONTESTA[2])).toFixed(3),
            ((teamA[i].ISA[0] + teamA[i].JSA[0] + teamA[i].P3A[0] + 0.44 * teamA[i].FTA + teamA[i].TO) * teamA[teamA.length - 1].MINUTE[0] / (teamA[i].MINUTE[0] * (teamA[teamA.length - 1].ISA[0] + teamA[teamA.length - 1].JSA[0] + teamA[teamA.length - 1].P3A[0] + 0.44 * teamA[teamA.length - 1].FTA + teamA[teamA.length - 1].TO))).toFixed(3),
            ((teamA[i].ASTM[0] + teamA[i].ASTM[1] + teamA[i].ASTM[2]) / (teamA[i].MINUTE[0] / teamA[teamA.length - 1].MINUTE[0] * (teamA[teamA.length - 1].ISM[0] + teamA[teamA.length - 1].JSM[0] + teamA[teamA.length - 1].P3M[0]) - (teamA[i].ISM[0] + teamA[i].JSM[0] + teamA[i].P3M[0]))).toFixed(3),
            ((teamA[i].OREB + teamA[i].DREB) * teamA[teamA.length - 1].MINUTE[0] / (teamA[i].MINUTE[0] * (teamA[teamA.length - 1].OREB + teamA[teamA.length - 1].DREB + teamH[teamH.length - 1].OREB + teamH[teamH.length - 1].DREB))).toFixed(3),
            ((teamA[i].OREB) * teamA[teamA.length - 1].MINUTE[0] / (teamA[i].MINUTE[0] * (teamA[teamA.length - 1].OREB + teamH[teamH.length - 1].DREB))).toFixed(3),
            ((teamA[i].DREB) * teamA[teamA.length - 1].MINUTE[0] / (teamA[i].MINUTE[0] * (teamA[teamA.length - 1].DREB + teamH[teamH.length - 1].OREB))).toFixed(3),
            (teamA[i].TO / (teamA[i].ISA[0] + teamA[i].JSA[0] + teamA[i].P3A[0] + 0.44 * teamA[i].FTA + teamA[i].TO)).toFixed(3)
        ];
        //bodytext.replace('NaN','-');
        for (let j = 0; j < headText.length; j++) {
            let dat = document.createElement('td');
            if (j > 0) {
                dat.style = 'text-align:center';
            }
            if (bodytext[j] == 'NaN') {
                bodytext[j] = '-';
            }
            dat.innerHTML = bodytext[j];
            r2.appendChild(dat);
        }
        tbody.appendChild(r2);


    }
    //last line
    r2 = document.createElement('tr');
    r2.className = 'headline';
    bodytext = [
        teamA[teamA.length - 1].name,
        `${teamA[teamA.length-1].CONTESTM[0]} - ${teamA[teamA.length-1].CONTESTA[0]}`,
        `${teamA[teamA.length-1].CONTESTM[1]} - ${teamA[teamA.length-1].CONTESTA[1]}`,
        `${teamA[teamA.length-1].CONTESTM[2]} - ${teamA[teamA.length-1].CONTESTA[2]}`,
        `${teamA[teamA.length-1].CONTESTM[0] + teamA[teamA.length - 1].CONTESTM[1] + teamA[teamA.length - 1].CONTESTM[2]} - ${teamA[teamA.length - 1].CONTESTA[0] + teamA[teamA.length - 1].CONTESTA[1] + teamA[teamA.length - 1].CONTESTA[2]}`,
        ((teamA[teamA.length - 1].CONTESTM[0] + teamA[teamA.length - 1].CONTESTM[1] + teamA[teamA.length - 1].CONTESTM[2]) / (teamA[teamA.length - 1].CONTESTA[0] + teamA[teamA.length - 1].CONTESTA[1] + teamA[teamA.length - 1].CONTESTA[2])).toFixed(3),
        '-', '-', '-', '-', '-', '-'
    ];
    //bodytext.replace('NaN','-');

    for (let j = 0; j < headText.length; j++) {
        let dat = document.createElement('th');
        if (j > 0) {
            dat.style = 'text-align:center';
        } else {
            dat.style = 'text-align:left';
        }
        if (bodytext[j] == 'NaN') {
            bodytext[j] = '-';
        }
        dat.innerHTML = bodytext[j];
        r2.appendChild(dat);

        tbody.appendChild(r2);
    }


    // rank by PTS and team stat
    var teamHP = teamH.slice(0, teamH.length - 1).sort((a, b) => ((b.PTS - a.PTS) || (+(b.PTS == a.PTS) && (b.MINUTE[0] - a.MINUTE[0]))));
    teamHP.push(teamH[teamH.length - 1]);
    teamH = teamHP;

    for (let i = 0; i < teamH.length - 1; i++) {
        teamH[teamH.length - 1].ISM = addArrays(teamH[teamH.length - 1].ISM, teamH[i].ISM);
        teamH[teamH.length - 1].JSM = addArrays(teamH[teamH.length - 1].JSM, teamH[i].JSM);
        teamH[teamH.length - 1].P3M = addArrays(teamH[teamH.length - 1].P3M, teamH[i].P3M);
        teamH[teamH.length - 1].ISA = addArrays(teamH[teamH.length - 1].ISA, teamH[i].ISA);
        teamH[teamH.length - 1].JSA = addArrays(teamH[teamH.length - 1].JSA, teamH[i].JSA);
        teamH[teamH.length - 1].P3A = addArrays(teamH[teamH.length - 1].P3A, teamH[i].P3A);
        teamH[teamH.length - 1].CONTESTM = addArrays(teamH[teamH.length - 1].CONTESTM, teamH[i].CONTESTM);
        teamH[teamH.length - 1].CONTESTA = addArrays(teamH[teamH.length - 1].CONTESTA, teamH[i].CONTESTA);
        teamH[teamH.length - 1].ASTM = addArrays(teamH[teamH.length - 1].ASTM, teamH[i].ASTM);
        teamH[teamH.length - 1].ASTA[0] = teamH[teamH.length-1].ISA[0] - teamH[teamH.length-1].ISA[1]
        teamH[teamH.length - 1].ASTA[1] = teamH[teamH.length-1].JSA[0] - teamH[teamH.length-1].JSA[1]
        teamH[teamH.length - 1].ASTA[2] = teamH[teamH.length-1].P3A[0] - teamH[teamH.length-1].P3A[1]
        teamH[teamH.length - 1].FTM += teamH[i].FTM;
        teamH[teamH.length - 1].FTA += teamH[i].FTA;
        teamH[teamH.length - 1].OREB += teamH[i].OREB;
        teamH[teamH.length - 1].DREB += teamH[i].DREB;
        teamH[teamH.length - 1].TO += teamH[i].TO;
        teamH[teamH.length - 1].STL += teamH[i].STL;
        teamH[teamH.length - 1].BLK += teamH[i].BLK;
        teamH[teamH.length - 1].FOUL += teamH[i].FOUL;
        teamH[teamH.length - 1].PTS += teamH[i].PTS;
        teamH[teamH.length - 1].MINUTE[0] += teamH[i].MINUTE[0];
    }
    teamH[teamH.length - 1].PlusMinus = '';
    teamH[teamH.length - 1].MINUTE[0] /= 5;


    // Team H - Basics

    const tableH1 = document.createElement("p");
    boxToAdd.insertBefore(tableH1, boxRef);

    table = document.createElement('table');
    table.style = 'width: 99%'
    thead = document.createElement('thead');
    thead.className = 'tableheader';
    tbody = document.createElement('tbody');
    table.appendChild(thead);
    table.appendChild(tbody);

    tableH1.appendChild(table);

    headText = [teamH[teamH.length - 1].name,
        '分钟',
        '命中',
        '内投',
        '中距离',
        '三分',
        '罚球',
        '+/-',
        '攻板',
        '篮板',
        '助攻',
        '失误',
        '抢断',
        '盖帽',
        '犯规',
        '得分'
    ];
    r1 = document.createElement('tr');
    r1.className = 'tableHeader';
    for (let i = 0; i < headText.length; i++) {
        let heading_1 = document.createElement('th');
        if (i == 0) {
            heading_1.style = 'text-align:left';
        }
        heading_1.innerHTML = headText[i];
        r1.appendChild(heading_1);
    }

    thead.appendChild(r1);

    for (let i = 0; i < teamH.length; i++) {
        let r2 = document.createElement('tr');
        if (i == teamH.length - 1) {
            r2.className = 'headline';
        } else if (i % 2 == 1) {
            r2.style = 'background:#EEEEEE';
        } else {
            r2.style = 'background:#FFFFFF';
        }
        bodytext = [getPosition(teamH[i].MINUTE, teamH[i]),
            teamH[i].MINUTE[0].toFixed(0),
            `${teamH[i].ISM[0]+teamH[i].JSM[0]+teamH[i].P3M[0]} - ${teamH[i].ISA[0]+teamH[i].JSA[0]+teamH[i].P3A[0]}`,
            `${teamH[i].ISM[0]} - ${teamH[i].ISA[0]}`,
            `${teamH[i].JSM[0]} - ${teamH[i].JSA[0]}`,
            `${teamH[i].P3M[0]} - ${teamH[i].P3A[0]}`,
            `${teamH[i].FTM} - ${teamH[i].FTA}`,
            (teamH[i].PlusMinus <= 0 ? "" : "+") + teamH[i].PlusMinus,
            teamH[i].OREB,
            teamH[i].OREB + teamH[i].DREB,
            teamH[i].ASTM[0] + teamH[i].ASTM[1] + teamH[i].ASTM[2],
            teamH[i].TO,
            teamH[i].STL,
            teamH[i].BLK,
            teamH[i].FOUL,
            teamH[i].PTS,
            teamH[i].FTM
        ];

        for (let j = 0; j < headText.length; j++) {
            let dat = document.createElement('td');
            if (j > 0) {
                dat.style = 'text-align:center';
            }
            dat.innerHTML = bodytext[j];
            r2.appendChild(dat);
        }
        tbody.appendChild(r2);
    }

    r2 = document.createElement('tr');
    r2.className = 'headline';
    var bodytext = ['',
        '',
        ((teamH[teamH.length - 1].ISM[0] + teamH[teamH.length - 1].JSM[0] + teamH[teamH.length - 1].P3M[0]) / (teamH[teamH.length - 1].ISA[0] + teamH[teamH.length - 1].JSA[0] + teamH[teamH.length - 1].P3A[0])).toFixed(3),
        ((teamH[teamH.length - 1].ISM[0]) / (teamH[teamH.length - 1].ISA[0])).toFixed(3),
        ((teamH[teamH.length - 1].JSM[0]) / (teamH[teamH.length - 1].JSA[0])).toFixed(3),
        ((teamH[teamH.length - 1].P3M[0]) / (teamH[teamH.length - 1].P3A[0])).toFixed(3),
        ((teamH[teamH.length - 1].FTM) / (teamH[teamH.length - 1].FTA)).toFixed(3),
    ];

    for (let j = 0; j < bodytext.length; j++) {
        let dat = document.createElement('td');
        dat.style = 'text-align:center'
        dat.innerHTML = bodytext[j];
        r2.appendChild(dat);
    }
    tbody.appendChild(r2);

    // Team H - Offense

    const tableH2 = document.createElement("p");
    boxToAdd.insertBefore(tableH2, boxRef);

    table = document.createElement('table');
    table.style = 'width: 99%'
    thead = document.createElement('thead');
    tbody = document.createElement('tbody');
    table.appendChild(thead);
    table.appendChild(tbody);

    tableH2.appendChild(table);

    headText = [teamH[teamH.length - 1].name,
        '真实<br>命中率',
        '总命中率',
        '干扰下<br>投篮',
        '干扰下<br>命中',
        '接球攻<br>投篮',
        '接球攻<br>命中',
        '传内线',
        '传中距离',
        '传三分',
        '传球<br>转化率'
    ];
    r1 = document.createElement('tr');
    r1.className = 'tableHeader';
    for (let i = 0; i < headText.length; i++) {
        let heading_1 = document.createElement('th');
        if (i == 0) {
            heading_1.style = 'text-align:left';
        }
        heading_1.innerHTML = headText[i];
        r1.appendChild(heading_1);
    }

    thead.appendChild(r1);

    for (let i = 0; i < teamH.length; i++) {
        let r2 = document.createElement('tr');
        if (i == teamH.length - 1) {
            r2.className = 'headline';
        } else if (i % 2 == 1) {
            r2.style = 'background:#EEEEEE';
        } else {
            r2.style = 'background:#FFFFFF';
        }
        bodytext = [
            getPosition(teamH[i].MINUTE, teamH[i]),
            (teamH[i].PTS / (teamH[i].ISA[0] + teamH[i].JSA[0] + teamH[i].P3A[0] + teamH[i].FTA * 0.44) / 2).toFixed(3),
            ((teamH[i].ISM[0] + teamH[i].JSM[0] + teamH[i].P3M[0]) / (teamH[i].ISA[0] + teamH[i].JSA[0] + teamH[i].P3A[0])).toFixed(3),
            `${teamH[i].ISM[1]+teamH[i].JSM[1]+teamH[i].P3M[1]} - ${teamH[i].ISA[1]+teamH[i].JSA[1]+teamH[i].P3A[1]}`,
            ((teamH[i].ISM[1] + teamH[i].JSM[1] + teamH[i].P3M[1]) / (teamH[i].ISA[1] + teamH[i].JSA[1] + teamH[i].P3A[1])).toFixed(3),
            `${teamH[i].ISM[0] - teamH[i].ISM[1] + teamH[i].JSM[0] - teamH[i].JSM[1] + teamH[i].P3M[0] - teamH[i].P3M[1]} - ${teamH[i].ISA[0] - teamH[i].ISA[1] + teamH[i].JSA[0] - teamH[i].JSA[1] + teamH[i].P3A[0] - teamH[i].P3A[1]}`,
            ((teamH[i].ISM[0] - teamH[i].ISM[1] + teamH[i].JSM[0] - teamH[i].JSM[1] + teamH[i].P3M[0] - teamH[i].P3M[1]) / (teamH[i].ISA[0] - teamH[i].ISA[1] + teamH[i].JSA[0] - teamH[i].JSA[1] + teamH[i].P3A[0] - teamH[i].P3A[1])).toFixed(3),
            `${teamH[i].ASTM[0]} - ${teamH[i].ASTA[0]}`,
            `${teamH[i].ASTM[1]} - ${teamH[i].ASTA[1]}`,
            `${teamH[i].ASTM[2]} - ${teamH[i].ASTA[2]}`,
            ((teamH[i].ASTM[0] + teamH[i].ASTM[1] + teamH[i].ASTM[2]) / (teamH[i].ASTA[0] + teamH[i].ASTA[1] + teamH[i].ASTA[2])).toFixed(3)
        ];
        //bodytext.replace('NaN','-');
        for (let j = 0; j < headText.length; j++) {
            let dat = document.createElement('td');
            if (j > 0) {
                dat.style = 'text-align:center';
            }
            if (bodytext[j] == 'NaN') {
                bodytext[j] = '-';
            }
            dat.innerHTML = bodytext[j];
            r2.appendChild(dat);
        }
        tbody.appendChild(r2);
    }

    // Team H - Advanced

    const tableH3 = document.createElement("p");
    boxToAdd.insertBefore(tableH3, boxRef);

    table = document.createElement('table');
    table.style = 'width: 99%'
    thead = document.createElement('thead');
    tbody = document.createElement('tbody');
    table.appendChild(thead);
    table.appendChild(tbody);

    tableH3.appendChild(table);

    headText = [teamH[teamH.length - 1].name,
        '防内投',
        '防中距离',
        '防三分',
        '防总计',
        '防对手<br>命中率',
        '球权<br>使用率',
        '助攻率',
        '篮板率',
        '进攻<br>篮板率',
        '防守<br>篮板率',
        '失误率'
    ];
    r1 = document.createElement('tr');
    r1.className = 'tableHeader';
    for (let i = 0; i < headText.length; i++) {
        let heading_1 = document.createElement('th');
        if (i == 0) {
            heading_1.style = 'text-align:left';
        }
        heading_1.innerHTML = headText[i];
        r1.appendChild(heading_1);
    }

    thead.appendChild(r1);

    // 全队没有使用率、助攻率等数据
    for (let i = 0; i < teamH.length - 1; i++) {
        var r2 = document.createElement('tr');
        if (i == teamH.length - 1) {
            r2.className = 'headline';
        } else if (i % 2 == 1) {
            r2.style = 'background:#EEEEEE';
        } else {
            r2.style = 'background:#FFFFFF';
        }
        bodytext = [
            getPosition(teamH[i].MINUTE, teamH[i]),
            `${teamH[i].CONTESTM[0]} - ${teamH[i].CONTESTA[0]}`,
            `${teamH[i].CONTESTM[1]} - ${teamH[i].CONTESTA[1]}`,
            `${teamH[i].CONTESTM[2]} - ${teamH[i].CONTESTA[2]}`,
            `${teamH[i].CONTESTM[0]+teamH[i].CONTESTM[1]+teamH[i].CONTESTM[2]} - ${teamH[i].CONTESTA[0]+teamH[i].CONTESTA[1]+teamH[i].CONTESTA[2]}`,
            ((teamH[i].CONTESTM[0] + teamH[i].CONTESTM[1] + teamH[i].CONTESTM[2]) / (teamH[i].CONTESTA[0] + teamH[i].CONTESTA[1] + teamH[i].CONTESTA[2])).toFixed(3),
            ((teamH[i].ISA[0] + teamH[i].JSA[0] + teamH[i].P3A[0] + 0.44 * teamH[i].FTA + teamH[i].TO) * teamH[teamH.length - 1].MINUTE[0] / (teamH[i].MINUTE[0] * (teamH[teamH.length - 1].ISA[0] + teamH[teamH.length - 1].JSA[0] + teamH[teamH.length - 1].P3A[0] + 0.44 * teamH[teamH.length - 1].FTA + teamH[teamH.length - 1].TO))).toFixed(3),
            ((teamH[i].ASTM[0] + teamH[i].ASTM[1] + teamH[i].ASTM[2]) / (teamH[i].MINUTE[0] / teamH[teamH.length - 1].MINUTE[0] * (teamH[teamH.length - 1].ISM[0] + teamH[teamH.length - 1].JSM[0] + teamH[teamH.length - 1].P3M[0]) - (teamH[i].ISM[0] + teamH[i].JSM[0] + teamH[i].P3M[0]))).toFixed(3),
            ((teamH[i].OREB + teamH[i].DREB) * teamH[teamH.length - 1].MINUTE[0] / (teamH[i].MINUTE[0] * (teamH[teamH.length - 1].OREB + teamH[teamH.length - 1].DREB + teamA[teamA.length - 1].OREB + teamA[teamA.length - 1].DREB))).toFixed(3),
            ((teamH[i].OREB) * teamH[teamH.length - 1].MINUTE[0] / (teamH[i].MINUTE[0] * (teamH[teamH.length - 1].OREB + teamA[teamA.length - 1].DREB))).toFixed(3),
            ((teamH[i].DREB) * teamH[teamH.length - 1].MINUTE[0] / (teamH[i].MINUTE[0] * (teamH[teamH.length - 1].DREB + teamA[teamA.length - 1].OREB))).toFixed(3),
            (teamH[i].TO / (teamH[i].ISA[0] + teamH[i].JSA[0] + teamH[i].P3A[0] + 0.44 * teamH[i].FTA + teamH[i].TO)).toFixed(3)
        ];
        //bodytext.replace('NaN','-');
        for (let j = 0; j < headText.length; j++) {
            let dat = document.createElement('td');
            if (j > 0) {
                dat.style = 'text-align:center';
            }
            if (bodytext[j] == 'NaN') {
                bodytext[j] = '-';
            }
            dat.innerHTML = bodytext[j];
            r2.appendChild(dat);
        }
        tbody.appendChild(r2);


    }
    //last line
    r2 = document.createElement('tr');
    r2.className = 'headline';
    bodytext = [
        teamH[teamH.length - 1].name,
        `${teamH[teamH.length-1].CONTESTM[0]} - ${teamH[teamH.length-1].CONTESTA[0]}`,
        `${teamH[teamH.length-1].CONTESTM[1]} - ${teamH[teamH.length-1].CONTESTA[1]}`,
        `${teamH[teamH.length-1].CONTESTM[2]} - ${teamH[teamH.length-1].CONTESTA[2]}`,
        `${teamH[teamH.length-1].CONTESTM[0] + teamH[teamH.length - 1].CONTESTM[1] + teamH[teamH.length - 1].CONTESTM[2]} - ${teamH[teamH.length - 1].CONTESTA[0] + teamH[teamH.length - 1].CONTESTA[1] + teamH[teamH.length - 1].CONTESTA[2]}`,
        ((teamH[teamH.length - 1].CONTESTM[0] + teamH[teamH.length - 1].CONTESTM[1] + teamH[teamH.length - 1].CONTESTM[2]) / (teamH[teamH.length - 1].CONTESTA[0] + teamH[teamH.length - 1].CONTESTA[1] + teamH[teamH.length - 1].CONTESTA[2])).toFixed(3),
        '-', '-', '-', '-', '-', '-'
    ];
    //bodytext.replace('NaN','-');

    for (let j = 0; j < headText.length; j++) {
        let dat = document.createElement('td');
        if (j > 0) {
            dat.style = 'text-align:center';
        } else {
            dat.style = 'text-align:left';
        }
        if (bodytext[j] == 'NaN') {
            bodytext[j] = '-';
        }
        dat.innerHTML = bodytext[j];
        r2.appendChild(dat);

        tbody.appendChild(r2);
    }









})();