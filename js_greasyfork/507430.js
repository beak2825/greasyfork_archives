// ==UserScript==
// @name         Mahjong AI Reviwer Extended
// @namespace    KEENOY
// @version      1.0.1
// @license      MIT
// @description  Functional extension for https://mjai.ekyu.moe/
// @author       KEENOY
// @require      http://code.jquery.com/jquery-latest.js
// @match        https://mjai.ekyu.moe/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mjai.ekyu.moe
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/507430/Mahjong%20AI%20Reviwer%20Extended.user.js
// @updateURL https://update.greasyfork.org/scripts/507430/Mahjong%20AI%20Reviwer%20Extended.meta.js
// ==/UserScript==

let autosaveEnabled = false;
let pageLang;
const l10n = {
    tsumo: {"ko": "쯔모", "en": "Tsumo", "ja": "ツモ", "zh-cn": "自摸"},
    ron: {"ko": "론", "en": "Ron", "ja": "ロン", "zh-cn": "荣和"},
    ryuukyoku: {
        "ko": "유국", "en": "Ryuukyoku", "ja": "流局", "zh-cn": "流局",
        kouhai: {"ko": "황패유국", "en": "Ryuukyoku", "ja": "荒牌", "zh-cn": "荒牌"},
        yao9: {"ko": "구종구패", "en": "Kyuushu kyuuhai", "ja": "九種九牌", "zh-cn": "九種九牌"},
        reach4: {"ko": "사가리치", "en": "Suucha riichi", "ja": "四家立直", "zh-cn": "四家立直"},
        kaze4: {"ko": "사풍연타", "en": "Suufon renda", "ja": "四風連打", "zh-cn": "四風連打"},
        ron3: {"ko": "삼가화", "en": "Sanchahou", "ja": "三家和", "zh-cn": "三家和"},
        kan4: {"ko": "사깡유국", "en": "Suukaikan", "ja": "四槓流れ", "zh-cn": "四槓流れ"},
        nm: {"ko": "유국만관", "en": "Nagashi Mangan", "ja": "流し満貫", "zh-cn": "流し満貫"},
    },
    riichi: {"ko": "리치", "en": "Riichi", "ja": "リーチ", "zh-cn": "立直"},
    seats: [
        {"ko": "나", "en": "Me", "ja": "自家", "zh-cn": "自家"},
        {"ko": "하가", "en": "Shimocha", "ja": "下家", "zh-cn": "下家"},
        {"ko": "대면", "en": "Toimen", "ja": "対面", "zh-cn": "对家"},
        {"ko": "상가", "en": "Kamicha", "ja": "上家", "zh-cn": "上家"},
    ],
    autosaveLabel: {"ko": "설정 보존", "en": "KEEP SETTINGS", "ja": "設定保存", "zh-cn": "KEEP SETTINGS", "ru": "KEEP SETTINGS"},
    autosaveHelp: {
        "ko": '"UI", "언어", "고급 옵션 -> 레이팅 보기" 설정을 보존합니다.',
        "en": 'Preserve "UI", "Language", "Advanced options -> Show rating" settings.',
        "ja": "「UI」, 「言語」, 「高度なオプション -> レーティングを表示する」 設定を保存します。",
        "zh-cn": 'Preserve "UI", "Language", "Advanced options -> Show rating" settings.',
        "ru": 'Сохранить настройки: "UI", "Язык" и "Продвинутые настройки -> Отображать рейтинг"',
    },
    toc: {
        honba: {"ko": "본장", "en": "Honba", "ja": "本場", "zh-cn": "Honba"},
        result: {"ko": "결과", "en": "Result", "ja": "結果", "zh-cn": "Result"},
        total: {"ko": "종합", "en": "Total", "ja": "トータル", "zh-cn": "Total"},
        matchRate: {"ko": "일치율", "en": "Match Rate", "ja": "一致率", "zh-cn": "Match Rate"},
        badMoveRate: {"ko": "악수율", "en": "Bad Move Rate", "ja": "悪手率", "zh-cn": "Bad Move Rate"},
    },
    rating: {"ko": "레이팅", "en": "Rating", "ja": "Rating", "zh-cn": "Rating"},
    badmoveNav: {
        title: {"ko": "악수 (추천도 ≤ 5.00)", "en": "Bad Moves (score ≤ 5.00)", "ja": "悪手（推薦度 ≤ 5.00）", "zh-cn": "Bad Moves (score ≤ 5.00)"},
    },
    summaryRegEx: {"ko": /^((\d+)순).*?(?:#(\d+).*)?$/, "en": /^(Turn (\d+)).*?(?:#(\d+).*)?$/, "ja": /^((\d+)巡目).*?(?:#(\d+).*)?$/, "zh-cn": /^((\d+)巡).*?(?:#(\d+).*)?$/},
    defense: {
        genbutsu: {"ko": "현물", "en": "Genbutsu", "ja": "現物", "zh-cn": "Genbutsu"},
        suji: {"ko": "스지", "en": "Suji", "ja": "筋", "zh-cn": "Suji"},
        nakasuji: {"ko": "나카스지", "en": "Nakasuji", "ja": "中筋", "zh-cn": "Nakasuji"},
        omotesuji: {"ko": "오모테스지", "en": "Omotesuji", "ja": "表筋", "zh-cn": "Omotesuji"},
        katasuji: {"ko": "카타스지", "en": "Katasuji", "ja": "方筋", "zh-cn": "Katasuji"},
        jihaiKabe: {"ko": "자패 벽", "en": "Jihai Kabe", "ja": "字牌壁", "zh-cn": "Jihai Kabe"},
        jihaiOneChance: {"ko": "자패 원찬스", "en": "Jihai One-Chance", "ja": "字牌ワンチャンス", "zh-cn": "Jihai One-Chance"},
    },
    furo: {
        "ko": "후로", "en": "Furo", "ja": "副露", "zh-cn": "Furo",
        skip: {"ko": "스킵", "en": "Skip", "ja": "スルー", "zh-cn": "跳过"},
        chi: {"ko": "치", "en": "Chii", "ja": "チー", "zh-cn": "吃"},
        pon: {"ko": "퐁", "en": "Pon", "ja": "ポン", "zh-cn": "碰"},
        kan: {"ko": "깡", "en": "Kan", "ja": "カン", "zh-cn": "杠"},
    },
    discard: {"ko": "타", "en": "Discard", "ja": "打", "zh-cn": "打"},
    turn: {"ko": "순", "en": "Turn", "ja": "巡目", "zh-cn": "Turn"},
    thisTurn: {"ko": "이번 순", "en": "This Turn", "ja": "今巡目", "zh-cn": "This Turn"},
    furo3AfterTurn6: {"ko": "6순 이후 3후로", "en": "3 furo after 6th turn", "ja": "6巡目以降 3副露", "zh-cn": "3 furo after 6th turn"},
    furo2AfterTurn12: {"ko": "12순 이후 2후로", "en": "2 furo after 12th turn", "ja": "12巡目以降 2副露", "zh-cn": "2 furo after 12th turn"},
};
const $tooltip = $("<div></div>").css({
    position: "absolute",
    backgroundColor: "white",
    padding: "0.25em",
    border: "1px solid #ddd",
    borderRadius: "5px",
});
$tooltip.attach = ($target, textGenerator, direction /*"left" or "right"*/, preventDefault = true) => {
    const onHandler = function() {
        $tooltip.text(textGenerator($target));
        const targetOffset = $target.offset();
        const tooltipOffset = {left: 0, top: targetOffset.top + ($target.height() - $(this).outerHeight()) / 2};

        switch (direction) {
            case "left": tooltipOffset.left = targetOffset.left - $tooltip.width() - 20; break;
            case "right": tooltipOffset.left = targetOffset.left + $target.width() + 10; break;
            default: break;
        }

        $tooltip.css({visibility: "visible", left: `${tooltipOffset.left}px`, top: `${tooltipOffset.top}px`});
    }
    const offHandler = function() {
        $tooltip.text("");
        $tooltip.css({visibility: "hidden"});
    }
    if (preventDefault) $target.click(ev => ev.preventDefault());
    $target.hover(onHandler, offHandler);
    $target.onTooltip ? $target.onTooltip.push(onHandler) : $target.onTooltip = [onHandler];
    $target.offTooltip ? $target.offTooltip.push(offHandler) : $target.offTooltip = [offHandler];
};
$tooltip.detach = ($target) => {
    $target.off("mouseover", "**", $target.onTooltip).off("mouseleave", "**", $target.offTooltip);
}

(function() {
    'use strict';

    $("body").append($tooltip);
    pageLang = $("html").attr("lang").toLowerCase();

    const pathname = window.location.pathname;
    const mediaQueryWidth = window.matchMedia("(min-width: 900px)");

    if (pathname.includes("killerducky")) {
        return;
    } else if (pathname.includes("report")) {
        // ### 결과 페이지 ###

        const [playerSeat, rating] = parseMetaData();
        const $allHonbas = $(".kyoku-heading").parent();

        const [movesByHonba, wrongMovesByHonba, badMovesByHonba] = getMovesByHonba($allHonbas);
        const allMoves = movesByHonba.flat();
        const allWrongMoves = wrongMovesByHonba.flat();
        const allBadMoves = badMovesByHonba.flat();

        const logsByHonba = getLogsByHonba($allHonbas, playerSeat);
        console.log(logsByHonba);
        const honbaResults = $allHonbas.map(i => [[getHonbaResult(playerSeat, logsByHonba[i])]]);

        // === TOC === //

        const $toc = $(".kyoku-toc");

        // Rating
        if (rating > 0)
        {
            const $rating = $(`<span>${rating}</span>`);
            const ratingColor = (rating >= 90) ? "#007bff"
            : (rating >= 80) ? "#28a745"
            : (rating >= 70) ? "#fd7e14"
            : "red";

            $rating.css({
                marginLeft: "10px",
                color: ratingColor,
            });

            const ratingLabel$ = $(`<sub>${l10n.rating[pageLang]}</sub>`);

            ratingLabel$.css({
                fontWeight: "normal",
                fontStyle: "italic",
            });

            $toc.siblings("summary").append($rating, ratingLabel$);
        }

        // ▼ New TOC
        const $toc2 = $("<table></table>").css({width: "100%", borderCollapse: "collapse"});

        const $tocHeader = $("<thead></thead>");
        const $tocHeaderTr = $("<tr></tr>").appendTo($tocHeader);
        $tocHeaderTr.append(`<th>${l10n.toc.honba[pageLang]}</th>`);
        $tocHeaderTr.append(`<th>${l10n.toc.result[pageLang]}</th>`);
        $tocHeaderTr.append(`<th>${l10n.toc.matchRate[pageLang]}</th>`);
        $tocHeaderTr.append(`<th>${l10n.toc.badMoveRate[pageLang]}</th>`);

        const $tocBody = $("<tbody></tbody>");

        let worstMatchRate = 100, bestMatchRate = 0;
        let worstBadMoveRate = 0, bestBadMoveRate = 100;

        // 본장 별 데이터
        for (var row = 0; row < $allHonbas.length; row ++) {
            const $trMain = $("<tr/>").css({backgroundColor: row % 2 == 0 ? "inherit" : "#ddd7"}).appendTo($tocBody);

            // 본장 열
            const $honbaHeader = $allHonbas.eq(row).children(".kyoku-heading");
            const honbaId = $honbaHeader.attr("id");
            const honbaName = $honbaHeader.find(".chapter").first().text();
            $(`<td><a href="#${honbaId}" class="no-visit">${honbaName}</a></td>`).css({
                textWrap: "nowrap",
            }).appendTo($trMain);

            // 결과 열
            const $resultCell = $(`<td/>`).appendTo($trMain);
            honbaResults[row].forEach(results => {
                results.forEach(result => {
                    const $resultWrap = $(`<p></p>`).css({display: "flex", flexWrap: "wrap", marginBlock: "unset"}).appendTo($resultCell);
                    const $resultMain = $(`<span>${result[0]} <b>${result[1]}</b></span>`).css({flexGrow: 1});
                    const $resultSub = $(`<span>${result[2]}</span>`).css({flexGrow: 1, textAlign: "right", fontStyle: "italic", color: "#777"});
                    $resultWrap.append($resultMain, $resultSub);
                });
            });

            // 일치율/악수율 열
            const $matchRateCell = $(`<td/>`).css({textAlign: "right", textWrap: "nowrap"}).appendTo($trMain);
            const $badMoveCell = $(`<td/>`).css({textAlign: "right", textWrap: "nowrap"}).appendTo($trMain);

            if (movesByHonba[row].length > 0) {
                const honbaMatchRate = Math.round((1 - (wrongMovesByHonba[row].length / movesByHonba[row].length)) * 10000)/100;
                $matchRateCell.text(`${honbaMatchRate.toFixed(2)}%`);
                if (worstMatchRate > honbaMatchRate) worstMatchRate = honbaMatchRate;
                if (bestMatchRate < honbaMatchRate) bestMatchRate = honbaMatchRate;

                const honbaBadMoveRate = Math.round(badMovesByHonba[row].length / movesByHonba[row].length * 10000)/100;
                $badMoveCell.text(`${honbaBadMoveRate.toFixed(2)}%`);
                if (worstBadMoveRate < honbaBadMoveRate) worstBadMoveRate = honbaBadMoveRate;
                if (bestBadMoveRate > honbaBadMoveRate) bestBadMoveRate = honbaBadMoveRate;
            } else {
                $matchRateCell.text("-");
                $badMoveCell.text("-");
            }

            // collapsable 세부 통계
            const $trDetails = $("<tr/>").appendTo($tocBody);
            const $tdDetails = $('<td colspan=4/>').css({backgroundColor: row % 2 == 0 ? "inherit" : "#ddd7"}).appendTo($trDetails);

            // [turn, type, discard, turnOffset]
            const riichis = logsByHonba[row].tenpaiWarning.filter((warning, index) => warning?.[1] == "riichi");
            const firstRiichi = riichis.length > 0 ? riichis.sort((a, b) => a[0] - b[0])[0] : null;

            // 수순별 통계
            const $moveBlockLineBeforeRiichi = $("<span/>").appendTo($tdDetails);
            const $moveBlockLineAfterRiichi = $("<span/>").css({backgroundColor: "coral"}).appendTo($tdDetails);
            movesByHonba[row].forEach((move, i, arr) => {
                const blockColor = move.recommValue <= 5 ? '🟥' : move.recommRank > 1 ? '🟨' : '⬜';
                const isStageEdge = i < arr.length - 1 && move.turn > 0 && move.turn % 6 == 0 && arr[i + 1]?.turn % 6 != 0;
                const $moveBlock = $(`<span title="${move.turn} ${l10n.turn[pageLang]}">${blockColor}</span>`).css({
                    marginRight: isStageEdge ? "1em" : "",
                });

                if (firstRiichi && move.turn > firstRiichi[0] + firstRiichi[3][playerSeat]) {
                    $moveBlock.appendTo($moveBlockLineAfterRiichi);
                } else {
                    $moveBlock.appendTo($moveBlockLineBeforeRiichi);
                }
            });
        }

        const $matchRateCells = $tocBody.find(`td:nth-child(3)`);
        $matchRateCells.filter((i, x) => $(x).text() == `${worstMatchRate.toFixed(2)}%`).css({fontWeight: "bold", color: "red"});
        $matchRateCells.filter((i, x) => $(x).text() == `${bestMatchRate.toFixed(2)}%`).css({fontWeight: "bold", color: "blue"});
        const $badmoveRateCells = $tocBody.find(`td:nth-child(4)`);
        $badmoveRateCells.filter((i, x) => $(x).text() == `${worstBadMoveRate.toFixed(2)}%`).css({fontWeight: "bold", color: "red"});
        $badmoveRateCells.filter((i, x) => $(x).text() == `${bestBadMoveRate.toFixed(2)}%`).css({fontWeight: "bold", color: "blue"});

        // 종합 데이터
        const $tocFoot = $("<tfoot></tfooty>");
        const $tocFooterTr = $("<tr></tr>").appendTo($tocFoot);
        $tocFooterTr.append(`<td colspan="2"></td>`);
        $tocFooterTr.append(`<td>${Math.round((1 - (allWrongMoves.length / allMoves.length)) * 10000)/100}%</td>`).css({textAlign: "right", fontStyle: "italic"});
        $tocFooterTr.append(`<td>${Math.round((allBadMoves.length/allMoves.length) * 10000)/100}%</td>`).css({textAlign: "right", fontStyle: "italic"});

        $toc2.append($tocHeader, $tocBody, $tocFoot);
        $toc2.find("td").css({padding: "0.5em"});
        $toc.before($toc2);
        $toc.empty();

        // === 본문 === //

        $allHonbas.each((honbaIndex, honba) => {
            const $honbaHeading = $(honba).children(".kyoku-heading").css({display: "block", marginInline: "0.5em"});
            const $honbaResult = $honbaHeading.find(".end-status-item").first();
            $honbaResult
                .removeClass("end-status-item")
                .css({fontWeight: "normal", fontStyle: "italic", fontSize: "60%", color: "#777"})
                .empty();
            honbaResults[honbaIndex].forEach(results => {
                results.forEach(result => {
                    const agariText = result[1] ? $(`<span>${result[1]}</span>`).css({fontWeight: "bold", color: "red"}) : null;
                    $honbaResult.append($("<p>").css({
                        marginBlock: "0.2em",
                        display: "flex",
                        justifyContent: "end",
                        gap: "0.5em",
                    }).append(`<span>${result[0]}</span>`, agariText, `<span>${result[2]}</span>`));
                });
            });
        });

        // 위험군 표시
        logsByHonba.forEach((log, honbaIndex) => {
            log.tenpaiWarning.forEach((warning, seatIndex) => {
                if (!warning) return;

                const [turn, type, discard, turnOffset] = warning;
                let isDefinite, warningColor, warningText, warningIcon;

                if (type == "riichi")
                {
                    isDefinite = true;
                    warningColor = "red";
                    warningText = l10n.riichi[pageLang];
                    warningIcon = drawTileSvg(discard).css({rotate: "90deg"});
                }
                else
                {
                    isDefinite = false;
                    warningColor = "orange";
                    switch (type) {
                        case "4furo": warningText = `4 ${l10n.furo[pageLang]}`; break;
                        case "3furoAfter6turn": warningText = `${l10n.furo3AfterTurn6[pageLang]} (${turn + 1})`; break;
                        case "2furoAfter12turn": warningText = `${l10n.furo2AfterTurn12[pageLang]} (${turn + 1})`; break;
                        default: break;
                    }
                    warningIcon = $(`<span>🚨</span>`);
                }

                drawWarning(log, honbaIndex, seatIndex, turn, warningColor, warningIcon, warningText, isDefinite, turnOffset);
            });
        });

        function drawWarning(log, honbaIndex, targetSeat, targetTurn, warningColor, $warningIcon, warningText, includeOthersDiscards, turnOffset) {
            if (targetSeat == playerSeat) return;

            movesByHonba[honbaIndex].filter(move => {
                return move.turn > targetTurn + turnOffset[playerSeat];
            }).forEach(move => {
                const targetSeatText = l10n.seats[(targetSeat - playerSeat + 4) % 4][pageLang];
                const $warningIconClone = $warningIcon.clone();
                move.$.find(".summary-right").append($(`<span>${targetSeatText}</span>`).css({color: warningColor}), $warningIconClone);
                $tooltip.attach($warningIconClone, _ => warningText, "left");

                // 안전패 표시
                const [genbutsus, kabes, oneChances] = findSafeTiles(log, playerSeat, targetSeat, targetTurn, move.turn - turnOffset[playerSeat], includeOthersDiscards, turnOffset);

                const defenseTiles = {};

                // 원찬스와 벽은 그대로 안전패가 아님.
                oneChances.forEach(tile => {
                    // 자패 원찬스
                    if (40 < tile && tile < 50) defenseTiles[toTileId(tile)] = "jihaiOneChance"
                });
                kabes.forEach(tile => {
                    // 자패 벽
                    if (40 < tile && tile < 50) defenseTiles[toTileId(tile)] = "jihaiKabe";
                });
                findSuji(genbutsus).filter(suji => suji.type != "katasuji").forEach(({tile, type}) => defenseTiles[toTileId(tile)] = type);
                genbutsus.forEach(tile => defenseTiles[toTileId(tile)] = "genbutsu");

                move.$.find(":not(.summary-right svg, li svg) > use.face").each((_, tile) => {
                    const tileId = $(tile).attr("href");
                    const defenseType = defenseTiles[tileId];
                    if (defenseType) {
                        let $defenseHelpHandle = $(tile).parent().siblings(".defense-help").first();
                        if (!$defenseHelpHandle.length) {
                            $defenseHelpHandle = $(`<span class="defense-help"> 🛡️</span>`).css({cursor: "help"}).insertAfter($(tile).parent());
                            $defenseHelpHandle.prop("tooltips", []);
                            $tooltip.attach($defenseHelpHandle, $handle => $handle.prop("tooltips").join(", "), "right");
                        }

                        const tooltips = $defenseHelpHandle.prop("tooltips");
                        const defenseTypeText = l10n.defense[defenseType][pageLang];
                        const thisTurnSuffix = (defenseType == "genbutsu" && genbutsus.discardedThisTurn.some(dTile => toTileId(dTile) == $(tile).attr("href"))) ? ` (${l10n.thisTurn[pageLang]})` : "";
                        var tooltipText;
                        if (defenseType == "jihaiKabe" || defenseType == "jihaiOneChance") {
                            tooltipText = `${defenseTypeText}${thisTurnSuffix}`;
                        } else {
                            tooltipText = `${targetSeatText} ${defenseTypeText}${thisTurnSuffix}`;
                        }
                        if (!tooltips.includes(tooltipText)) tooltips.push(tooltipText);
                        $defenseHelpHandle.prop("tooltips", tooltips);
                    }
                });
            });
        }

        // === 악수 내비게이터 === //

        let badmoveNavCollapsed = false;

        const $badmoveNavigator = $('<nav/>').css(getBadMoveNavStyles(mediaQueryWidth.matches));
        const $badmoveNavHeader = $(`<header>${l10n.badmoveNav.title[pageLang]}</header>`).css({...getBadMoveNavHeaderStyles(mediaQueryWidth.matches), listStyle: `inside ${badmoveNavCollapsed ? "disclosure-closed" : "disclosure-open"}`});
        const $badmoveNavBody = $('<div></div>').css(getBadMoveNavBodyStyles(mediaQueryWidth.matches));

        function redrawNavigator(isWide) {
            $badmoveNavHeader.css({listStyle: `inside ${badmoveNavCollapsed ? "disclosure-closed" : "disclosure-open"}`});
            if (badmoveNavCollapsed) {
                $badmoveNavigator.css({translate: isWide ? "calc(-100% + 40px) 50%" : "50% calc(-100% + 40px)"});
            } else {
                $badmoveNavigator.css({translate: isWide ? "0% 50%" : "50% 0%"});
            }
        }

        mediaQueryWidth.addEventListener("change", ({matches}) => {
            badmoveNavCollapsed = false;
            redrawNavigator(matches);
        });

        $badmoveNavHeader.click(_ => {
            badmoveNavCollapsed = !badmoveNavCollapsed;
            redrawNavigator(mediaQueryWidth.matches)
        });

        let focusedEntry = null;
        let focusedListItem = null;

        for (var i = 0; i < badMovesByHonba.length; i++) {
            const badMovesInHonba = badMovesByHonba[i];
            const badMoveList = $("<ul/>");
            badMoveList.css({
                padding: 0,
                marginBlock: "0.5em",
                marginInline: "0.5em",
            });

            badMovesInHonba.forEach(move => {
                const listItem = $(`<li></li>`).css({
                    listStyle: "none",
                    display: "flex",
                    gap: "1em",
                    padding: "0.2em 0.5em",
                    cursor: "pointer",
                    justifyContent: "space-between",
                });

                const listItemTurn = $(`<span>${move.kyoku} ${move.turnText}</span>`);
                const listItemRecommend = $(`<span>${move.recommValue.toFixed(2)}</span>`)
                if (move.recommValue < 0.01) listItemRecommend.css({color: "red"});
                else if (move.recommValue < 1) listItemRecommend.css({color: "orange"});
                listItem.append(listItemTurn);
                listItem.append(listItemRecommend);

                listItem.on( "mouseenter", () => {
                    listItem.css({backgroundColor: "rgba(255, 213, 213, 0.7)"});
                }).on( "mouseleave", () => {
                    listItem.css({backgroundColor: "transparent"});
                });

                listItem.click(() => {
                    unfocusBadMove(focusedEntry, focusedListItem);
                    move.$.css({
                        backgroundColor: "#ddd",
                        border: "2px solid black"
                    });
                    move.$.attr("open", "");
                    move.$.children("summary").first().click(_ => unfocusBadMove(focusedEntry, focusedListItem));
                    move.$.attr("open", "");
                    $('html, body').animate({
                        scrollTop: move.$.offset().top - 100
                    }, 0);
                    move.$.children("details").first().attr("open", "");
                    listItem.css("font-weight", "bold");
                    focusedEntry = move.$;
                    focusedListItem = listItem;
                    return false;
                });

                badMoveList.append(listItem);
            });

            $badmoveNavBody.append(badMoveList);
        }
        $badmoveNavigator.append($badmoveNavBody, $badmoveNavHeader);
        $("body").append($badmoveNavigator);

        mediaQueryWidth.addEventListener("change", ({matches}) => {
            $badmoveNavigator.removeAttr("style").css(getBadMoveNavStyles(matches));
            $badmoveNavHeader.removeAttr("style").css(getBadMoveNavHeaderStyles(matches));
            $badmoveNavBody.removeAttr("style").css(getBadMoveNavBodyStyles(matches));
        });

        function getBadMoveNavStyles(isWide) {
            const sharedStyles = {position: "fixed", display: "flex", backgroundColor: "rgba(255, 255, 255, 1)", border: "2px solid rgba(0, 0, 0, 0.2)", zIndex: 1000};
            const wideStyles = {left: "0px", bottom: "50vh", translate: "0% 50%", borderRadius: "0px 10px 10px 0px", borderLeft: "none"};
            const narrowStyles = {flexDirection: "column", top: "0px", right: "50vw", translate: "50% 0%", borderRadius: "0px 0px 10px 10px", borderTop: "none"};
            return {...sharedStyles, ...(isWide ? wideStyles : narrowStyles)};
        }
        function getBadMoveNavHeaderStyles(isWide) {
            const sharedStyles = {display: "list-item", padding: "10px", fontWeight: "bold", textAlign: "center", cursor: "pointer", };
            const wideStyles = {margin: "10px 0", width: "20px", writingMode: "vertical-rl", borderLeft: "1px dashed black" };
            const narrowStyles = {margin: "0 10px", height: "20px", borderTop: "1px dashed black"};
            return {...sharedStyles, ...(isWide ? wideStyles : narrowStyles)};
        }
        function getBadMoveNavBodyStyles(isWide) {
            const sharedStyles = {};
            const wideStyles = {maxHeight: "min(calc(100vh - 20px), 60vh)", overflowY: "auto"};
            const narrowStyles = {display: "flex", maxWidth: "calc(100vw - 20px)", overflowX: "auto", textWrap: "nowrap"};
            return {...sharedStyles, ...(isWide ? wideStyles : narrowStyles)};
        }
    } else {
        // <!-- 입력 페이지 -->

        const logUrl = new URLSearchParams(window.location.search).get("url");
        drawAutosaveCheck();
        if (!logUrl)
            assignClilboardUrl();
        initSettings();

        const $langLinks = $(".breadcrumb li a");
        $langLinks.each((index, link) => {
            const $link = $(link);
            const originalUrl = $link.attr("href");
            $link.removeAttr("href");
            $link.click(_ => window.location.href = `${originalUrl}?url=${$("input[name=log-url]")[0].value}`);
        });
    }
})();

function assignClilboardUrl() {
    navigator.clipboard.readText().then(clipboard => {
        clipboard = clipboard.replace(/((雀魂牌譜)|(작혼 패보)|(Mahjong Soul Game Log)):\s*/, "");

        let match = clipboard.match(/(tenhou.net)|(mahjongsoul)/);
        if (match)
        {
            $("input[name=log-url]")[0].value = clipboard;
            $("input[name=input-method][value=log-url]")[0].click();
            return;
        }

        match = clipboard.match(/^([0-9a-z]{20}@\d)$/);
        if (match) {
            $("input[name=riichi-city-log-id]")[0].value = match[1];
            $("input[name=input-method][value=riichi-city-log-id]")[0].click();
            return;
        }
    });
}
function initSettings() {
    const autosaveSaved = JSON.parse(window.localStorage.getItem("autosave"));
    $('#autosave')[0].checked = autosaveSaved;
    autosaveEnabled = autosaveSaved;

    if (!autosaveSaved)
        return;

    const uiSaved = window.localStorage.getItem("ui");
    const uiSelect = $("select[name=ui]")[0];
    if (autosaveEnabled)
    {
        for (var uiIndex = 0; uiIndex < uiSelect.length; uiIndex++) {
            if (uiSelect[uiIndex].value == uiSaved) uiSelect[uiIndex].selected = true;
        }
    }
    uiSelect.addEventListener("change", _ => {
        if (autosaveEnabled) window.localStorage.setItem("ui", uiSelect.value);
    });

    const langSaved = window.localStorage.getItem("lang");
    const langSelect = $("select[name=lang]")[0];
    if (autosaveEnabled)
    {
        for (var langIndex = 0; langIndex < langSelect.length; langIndex++) {
            if (langSelect[langIndex].value == langSaved) langSelect[langIndex].selected = true;
        }
    }
    langSelect.addEventListener("change", _ => {
        if (autosaveEnabled) window.localStorage.setItem("lang", langSelect.value);
    });

    const showRatingCheckboxSaved = JSON.parse(window.localStorage.getItem("show-rating"));
    let showRatingCheckbox = $("input[name=show-rating]")[0];
    if (autosaveEnabled)
    {
        showRatingCheckbox.checked = showRatingCheckboxSaved;
    }
    showRatingCheckbox.addEventListener("change", _ => {
        if (autosaveEnabled) window.localStorage.setItem("show-rating", showRatingCheckbox.checked);
    });
}
function drawAutosaveCheck() {
    const $label = $(`<label for="autosave">${l10n.autosaveLabel[pageLang]}</label>`);
    $label.css({marginLeft: "0.5em", cursor: "pointer"});

    const $checkbox = $('<input type="checkbox" id="autosave">');
    $checkbox.css({marginLeft: "2em", cursor: "pointer"});

    const $help = $('<span>(?)</span>');
    $help.css({marginLeft: "0.5em", cursor: "help"});
    $help.attr("title", l10n.autosaveHelp[pageLang]);

    $('h2').first().append($checkbox, $label, $help);
    $checkbox[0].addEventListener("change", _ => {
        autosaveEnabled = $checkbox[0].checked;
        window.localStorage.setItem("autosave", autosaveEnabled);
    });
}

function parseMetaData() {
    const $metadata = $("details:nth(1)");
    if ($metadata.length == 0)
        return -1;
    $metadata.attr("open", "");

    const $playerSeat = $metadata.find("dl dd:nth(4)");
    const $rating = $metadata.find("dl dd:nth(7)");

    $metadata.removeAttr("open");
    return [$playerSeat.text(), $rating.text()];
}
function getMovesByHonba($allHonbas) {
    const movesByHonba = [], wrongMovesByHonba = [], badMovesByHonba = [];

    $allHonbas.each((_, honba) => {
        const _movesInHonba = getMoves($(honba));
        const _wrongMovesInHonba = _movesInHonba.filter(move => move.recommRank > 1);
        const _badMovesInHonba = _wrongMovesInHonba.filter(move => move.recommValue <= 5);

        movesByHonba.push(_movesInHonba);
        wrongMovesByHonba.push(_wrongMovesInHonba);
        badMovesByHonba.push(_badMovesInHonba);
    });

    return [movesByHonba, wrongMovesByHonba, badMovesByHonba];

    function getMoves($kyoku) {
        const moves = [];

        const kyoku = $kyoku.find(".chapter").text();
        const $movesInRound = $kyoku.find("details.entry");

        $movesInRound.each((_, move) => {
            const $move = $(move);
            const moveMatch = $move.find("summary").text().match(l10n.summaryRegEx[pageLang]);
            const recommRank = moveMatch[3] ?? 1;
            const recommValue = $move.find("table tbody tr").eq(recommRank - 1).children().last().text();
            const roundedRecommValue = Math.round(recommValue * 100) / 100;

            const $summary = $move.children("summary").first();
            const $summaryLeftSpan = $(`<span class="summary-left"></span>`).css({flex: 1, textWrap: "nowrap"});
            const $summaryRightSpan = $(`<span class="summary-right"></span>`).css({
                height: "1em",
                flex: 1, textWrap: "nowrap", display: "flex",
                justifyContent: "end", alignItems: "center", gap: "0.75em",
            });

            $summary.contents().appendTo($summaryLeftSpan);
            const $summaryWrap = $('<div class="summary-wrap"></div>').css({
                display: "inline-flex",
                flexWrap: "wrap",
                width: "calc(100% - 20px)",
                rowGap: "0.75em",
            }).append($summaryLeftSpan, $summaryRightSpan);
            $summary.append($summaryWrap);

            moves.push({
                $: $move, // jQuery 오브젝트
                kyoku: kyoku, // 국+본장
                turnText: moveMatch[1], // 타패순 텍스트
                turn: moveMatch[2], // 타패순
                recommRank: Number(recommRank), // 추천순
                recommValue: roundedRecommValue, // 추천도
            });
        });

        return moves;
    }
}
function getLogsByHonba($allHonbas, playerSeat) {
    const $logs = $allHonbas.find(".r-box textarea");
    return $logs.map((_, log) => {
        let logParsed = JSON.parse($(log).text()).log[0]; // as there's only one honba in the log

        const logObj = [{}, {}, {}, {}];
        logObj.kyoku = logParsed[0][0];
        logObj.honba = logParsed[0][1];
        logObj.kyoutaku = logParsed[0][2];
        logObj.doraIndicators = [[-1, logParsed[2][0]]];

        logParsed[1].forEach((startPoint, seatIndex) => {
            logObj[seatIndex].startPoint = startPoint;
        }); // 시작 점수

        for (var seatPlayDataIndex = 0; seatPlayDataIndex <= 11; seatPlayDataIndex++) {
            const seatIndex = Math.floor(seatPlayDataIndex / 3);
            const dataIndex = seatPlayDataIndex % 3;

            switch (dataIndex) {
                case 0: // 배패
                    logObj[seatIndex].haipai = logParsed[4+seatPlayDataIndex];
                    break;
                case 1: // 쯔모
                    logObj[seatIndex].tsumo = logParsed[4+seatPlayDataIndex];
                    break;
                case 2: // 버림패 (강)
                    logObj[seatIndex].kawa = logParsed[4+seatPlayDataIndex];
                    break;
                default: break;
            }
        }

        logObj.forEach(seat => {
            // 쯔모기리 형식 변경 (60 => x{nm})
            seat.kawa = seat.kawa.map((tile, tileIndex) => {
                const match = tile.toString().match(/^(r?)60$/);
                if (match) tile = `${match[1]}x${seat.tsumo[tileIndex]}`;
                return tile;
            });
        });

        // == 결과 ==
        logObj.finish = {
            result: logParsed[16][0], // 和了, 流局, 九種九牌, ...
            agari: [],
            ron: false,
            bonusScore: 0,
        };

        for (var agariIndex = 1; agariIndex < logParsed[16].length - 1; agariIndex += 2) {
            logObj.finish.agari.push({
                scoreChanges: logParsed[16][agariIndex],
                from: logParsed[16][agariIndex + 1][0],
                to: logParsed[16][agariIndex + 1][1], // 쯔모면 from과 동일
                scoreText: logParsed[16][agariIndex + 1][3],
                yakuText: logParsed[16][agariIndex + 1][4],
            });
        }

        // == 순 별 분석 ==
        logObj.tenpaiWarning = [null, null, null, null]; // [해당 플레이어 기준 순, 경고 타입, 버림 패, 상대순]을 각 항목에 할당.

        const furoCount = [0, 0, 0, 0];
        const lastTurnDiff = [0, 0, 0, 0];
        const turnDiff = [0, 0, 0, 0];
        const isTenpaiWarningPending = [false, false, false, false];

        let turn = 0;
        let turnLoop = true;
        while (turnLoop) {
            for (var seatIndex = 0; seatIndex < 4; seatIndex++) {
                lastTurnDiff[seatIndex] = turnDiff[seatIndex];
                const {tsumo, kawa} = logObj[seatIndex];
                turnLoop = (turn < tsumo.length && turn < kawa.length) || isTenpaiWarningPending[seatIndex];

                const tsumoNow = (turn < tsumo.length) ? tsumo[turn].toString() : "";
                const kawaNow = (turn < kawa.length) ? kawa[turn].toString() : "";

                let furo = ["c", tsumoNow.indexOf("c")]; //치
                if (furo[1] == -1) furo = ["p", tsumoNow.indexOf("p")]; // 퐁
                if (furo[1] == -1) furo = ["m", tsumoNow.indexOf("m")]; // 대명깡
                if (furo[1] == -1) furo = ["k", kawaNow.indexOf("k")]; // 소명깡
                if (furo[1] == -1) furo = ["a", kawaNow.indexOf("a")]; // 안깡
                if (furo[1] == -1) furo = [null, -1];

                if (furo[0]) {
                    if (furo[0] == "p" || furo[0] == "c") {
                        furoCount[seatIndex]++;
                    }
                    if (furo[0] == "p" || furo[0] == "m") {
                        if (furo[1] == 2) {
                            // 대면에서 가져옴
                            turnDiff[(seatIndex + 3) % 4]--;
                        } else if (furo[1] == 4 || furo[1] == 6) {
                            // 하가에서 가져옴
                            turnDiff[(seatIndex + 3) % 4]--;
                            turnDiff[(seatIndex + 2) % 4]--;
                        }
                    }
                    if (furo[0] == "m" || furo[0] == "k" || furo[0] == "a") {
                        // 깡은 자신 순서 +1
                        // 도라 표시패는 [플레이어 기준 턴, 추가된 도라] 형식으로 저장.
                        const normalizedTurnDiff = normalizeTurnDiff(logObj.kyoku % 4, seatIndex, turnDiff);
                        logObj.doraIndicators.push([turn + normalizedTurnDiff[playerSeat], logParsed[2][logObj.doraIndicators.length]]);
                        turnDiff[seatIndex] = turnDiff[seatIndex] + 1;
                    }
                }

                // 텐파이 경고 할당
                const tenpaiWarning = getTenpaiWarning(isTenpaiWarningPending[seatIndex], logObj.tenpaiWarning[seatIndex], kawaNow, furoCount[seatIndex], turn);
                if (tenpaiWarning)
                {
                    isTenpaiWarningPending[seatIndex] = true;
                    logObj.tenpaiWarning[seatIndex] = [turn, ...tenpaiWarning, turnDiff];
                }
                if (isTenpaiWarningPending[seatIndex])
                {
                    // - 매 seatIndex 순회마다 tenpaiWarning을 순회하여 "(현재 턴 + 현재 turnDiff[setIndex]) - (경고 개시 턴 + 경고 개시 시점 turnDiff[seatIndex])"를 비교한다.
                    // - 위 값이 1이라면 이전 턴 turnDiff 값을 반영한다.

                    const pending = logObj.tenpaiWarning[seatIndex];
                    const verified = (turn + turnDiff[seatIndex]) - (pending[0] + pending.at(-1)[seatIndex]) == 1;
                    if (verified)
                    {
                        isTenpaiWarningPending[seatIndex] = false;
                        logObj.tenpaiWarning[seatIndex] = [pending[0], pending[1], pending[2], normalizeTurnDiff(logObj.kyoku % 4, seatIndex, lastTurnDiff)];
                    }
                }
            } // 플레이어 (자리) 루프
            turn++;
        } // 턴 루프

        logObj.finish.bonusScore = (logObj.honba) * 300 + (logObj.kyoutaku * 1000); // 연장봉 + 공탁
        logObj.finish.ron = logObj.finish.agari.length > 0 && (logObj.finish.agari.length > 1 || logObj.finish.agari[0].from != logObj.finish.agari[0].to);
        return [logObj];

        isTenpaiWarningPending.forEach((pending, seatIndex) => {
            if (pending) logObj.tenpaiWarning[seatIndex][logObj.tenpaiWarning[seatIndex].length - 1] = normalizeTurnDiff(logObj.kyoku % 4, seatIndex, lastTurnDiff);
        });
    }).toArray();

    function getTenpaiWarning(isTenpaiPending, lastTenpaiWarning, kawaNow, furoCount, turn) {
        if (lastTenpaiWarning?.[1] == "riichi") return null;
        const riichiTile = kawaNow.match(/r(x?\d{2})/)?.[1];

        if (riichiTile) return ["riichi", processTile(riichiTile)];

        if (lastTenpaiWarning?.[1] == "4furo") return null;
        if (furoCount >= 4) return ["4furo", processTile(kawaNow)];

        if (lastTenpaiWarning?.[1] == "3furoAfter6turn") return null;
        if (furoCount >= 3 && turn >= 6) return ["3furoAfter6turn", processTile(kawaNow)];

        if (lastTenpaiWarning?.[1] == "2furoAfter12turn") return null;
        if (furoCount >= 2 && turn >= 12) return ["2furoAfter12turn", processTile(kawaNow)];

        return null;
    }
}


function normalizeTurnDiff(oyaSeat, referenceSeat, turnDiff) {
    const oyaZeroPositions = [0, 1, 2, 3].map(i => (i - oyaSeat + 4) % 4);
    const turnOffsetApplied = turnDiff.map((diff, index) => {
        const turnOffset = (oyaZeroPositions[index] < oyaZeroPositions[referenceSeat] ? 1 : 0);
        return diff + turnOffset;
    });
    return turnOffsetApplied.map((diff, index) => diff - turnOffsetApplied[referenceSeat]);
}
function unfocusBadMove(focusedEntry, focusedListItem) {
    focusedListItem?.css({fontWeight: "normal"});
    if (focusedEntry) {
        focusedEntry.css({
            backgroundColor: "transparent",
            border: "1px solid #aaa"
        });
        focusedEntry.children("summary").first().off("click");
        focusedEntry.children("details").first().removeAttr("open");
    }
}
function getHonbaResult(playerSeat, logObj) {
    const finish = logObj.finish;

    if (finish.agari.length == 0) {
        // 유국
        return [[l10n.ryuukyoku[pageLang], "", translateRyuukoku(logObj.finish.result)]];
    }

    const earliestAgari = finish.agari.sort(agari => agari.from)[0].from;

    return finish.agari.map(agari => {
        let returnArr = ["", "", ""];
        const agariSeat = l10n.seats[(agari.from - playerSeat + 4) % 4][pageLang];
        const agariScoreMatch = agari.scoreText.match(/(\d+)(?:-(\d+))?点/);
        const bonusScoreText = earliestAgari == agari.from && finish.bonusScore > 0 ? ` + ${finish.bonusScore}` : "";
        if (finish.ron) {
            // 론 => "{화료자} -> {방총자} 론 {오름 점수} + {추가 점수}"
            const houjyuu = l10n.seats[(agari.to - playerSeat + 4) % 4][pageLang];
            returnArr[0] = `${agariSeat} → ${houjyuu}`;
            returnArr[1] = l10n.ron[pageLang];
            returnArr[2] = `${agariScoreMatch[1]}${bonusScoreText}`;
        } else {
            // 쯔모 => "{화료자} 쯔모 {오름 점수 1} {오름 점수 2} + {추가 점수}"
            returnArr[0] = agariSeat;
            returnArr[1] = l10n.tsumo[pageLang];
            returnArr[2] = (agariScoreMatch[2]) ? `${agariScoreMatch[1]}, ${agariScoreMatch[2]}` : `${agariScoreMatch[1]} all` + bonusScoreText;
        }
        return returnArr;
    });
}

function drawTileSvg(tile) {
    return $(`<svg class="tile"><use class="face" href="${toTileId(tile)}"></use></svg>`);
}
function toTileId(tile) {
    const pais = "mpseswnpfc";
    const tileNumber = tile % 10;
    const tileType = tile - tileNumber
    let tileId = "";

    switch (tileType) {
        case 10: tileId = `#pai-${tileNumber}m`; break; // 만
        case 20: tileId = `#pai-${tileNumber}p`; break; // 통
        case 30: tileId = `#pai-${tileNumber}s`; break; // 삭
        case 40: tileId = `#pai-${pais[tileNumber + 2]}`; break; // 자패
        case 50: tileId = `#pai-5${pais[tileNumber - 1]}r` // 아카도라
        default: break;
    }

    return tileId;
}
function akaToNormal(tile) {
    if (!tile || tile < 50) return tile;
    return (tile % 50) * 10 + 5;
}
function processTile(tile, doAkaToNormal = true) {
    let tileNumber;
    if (tile == null) return null;
    if (typeof tile == "number") tileNumber = tile;
    else {
        const match = tile.match(/^r?x?(?:\d{2,6})?[cpkma]?(\d{2})(?:\d{2,8})?$/); // 안깡 및 소명깡은 로그에서 강에 포함되지만 실제로 버려지지는 않으므로 현물이 아님
        tileNumber = match ? match[1] : null;
        if (doAkaToNormal) tileNumber = akaToNormal(tileNumber);
    }
    return Number(tileNumber);
}
function findSafeTiles(logObj, playerSeatIndex, targetSeatIndex, targetTurn, currentTurn, includeOthersDiscards, turnOffset) {
    const discardedThisTurn = [null, null, null, null];
    let genbutsus = [];

    logObj.forEach(({kawa, tsumo}, seatIndex) => {
        const collectedGenbutsus = [];
        const isBetweenTargetAndPlayer = (seatIndex - targetSeatIndex + 4) % 4 < (playerSeatIndex - targetSeatIndex + 4) % 4;

        var i;
        if (seatIndex == targetSeatIndex) {
            for (i = 0; i < Math.min(kawa.length, currentTurn); i++) {
                const processedTile = processTile(kawa[i]);
                collectedGenbutsus.push(processedTile);
                if (collectedGenbutsus.length == currentTurn) {
                    discardedThisTurn[seatIndex] = processedTile;
                    break;
                }
            }
        }
        if (includeOthersDiscards && seatIndex != targetSeatIndex) {
            for (i = targetTurn + turnOffset[seatIndex]; i < currentTurn + turnOffset[seatIndex]; i++) {
                if (i < kawa.length && (i < currentTurn + turnOffset[seatIndex] - 1 || isBetweenTargetAndPlayer)) {
                    const processedTile = processTile(kawa[i]);
                    collectedGenbutsus.push(processedTile);
                    if (i == currentTurn + turnOffset[seatIndex] && isBetweenTargetAndPlayer) discardedThisTurn[seatIndex] = processTile(kawa[i]);
                }
            }
        }

        genbutsus = [...genbutsus, ...collectedGenbutsus];
    });

    const allVisibleTiles = logObj[playerSeatIndex].haipai.slice().sort();
    const furoRegex = /^r?x?(\d{2})?(\d{2})?(\d{2})?(?:[cpkma]\d{2})(\d{2})?(\d{2})?(\d{2})$/;
    logObj.forEach(({kawa, tsumo}, seatIndex) => {
        if (seatIndex == playerSeatIndex) {
            for (var i = 0; i < currentTurn + turnOffset[seatIndex]; i++) {
                const furo = tsumo[i].toString().match(furoRegex);
                if (!furo) allVisibleTiles.push(processTile(tsumo[i]));
            }
        } else {
            const isBetweenTargetAndPlayer = (seatIndex - targetSeatIndex + 4) % 4 < (playerSeatIndex - targetSeatIndex + 4) % 4;
            kawa.forEach((kawaNow, index) => {
                if (index < currentTurn + turnOffset[seatIndex] - 1 || isBetweenTargetAndPlayer && index == currentTurn + turnOffset[seatIndex] - 1) {
                    const furo = kawaNow.toString().match(furoRegex);
                    if (furo) allVisibleTiles.push(...furo.splice(1).filter(x => x).map(x => Number(x)));
                    else allVisibleTiles.push(processTile(kawaNow));
                }
            });
            tsumo.forEach((tsumoNow, index) => {
                if (index < currentTurn + turnOffset[seatIndex] - 1 || isBetweenTargetAndPlayer && index == currentTurn + turnOffset[seatIndex] - 1) {
                    const furo = tsumoNow.toString().match(furoRegex);
                    if (furo) allVisibleTiles.push(...furo.splice(1).filter(x => x).map(x => Number(x)));
                }
            });
        }
    });
    const doraIndicators = logObj.doraIndicators.filter(([turn, tile]) => turn < currentTurn).map(([turn, tile]) => tile);

    allVisibleTiles.push(...doraIndicators);

    const kabes = [];
    const oneChances = [];
    const duplicates = allVisibleTiles.reduce((acc, tile) => {
        acc[tile.toString()] = (acc[tile.toString()] || 0) + 1;
        return acc;
    }, {});

    for (var tile in duplicates) {
        if (duplicates[tile] >= 4) kabes.push(Number(tile)); // 퐁 한 뒤 소명깡한 경우 중복 처리되어 6개로 집계되지만 어차피 벽이므로 문제는 없음.
        else if (duplicates[tile] == 3) oneChances.push(Number(tile));
    }

    genbutsus = sortAndDistinct(genbutsus);
    genbutsus.discardedThisTurn = discardedThisTurn;
    return [genbutsus, kabes, oneChances];
}
function findSuji(genbutsu) {
    const results = []; // {number tile, string type}
    const sujiBox = [
        [[false, false, false], [false, false, false], [false, false, false]], // 만 [147, 258, 369]
        [[false, false, false], [false, false, false], [false, false, false]], // 통 [147, 258, 369]
        [[false, false, false], [false, false, false], [false, false, false]], // 삭 [147, 258, 369]
    ];

    genbutsu.forEach(tile => {
        if (tile >= 40) return;
        const tileType = Math.floor(tile / 10) - 1;
        const tileNumber = (tile % 10);
        sujiBox[tileType][(tileNumber - 1) % 3][Math.trunc((tileNumber - 1) / 3)] = true;
    });

    for (var tileType = 0; tileType < 3; tileType++) {
        for (var sujiType = 0; sujiType < 3; sujiType++) {
            const sujis = sujiBox[tileType][sujiType];
            const tileBase = (tileType + 1) * 10 + (sujiType + 1);
            if (sujis[0] && sujis[2]) results.push({tile: tileBase + 3, type: "nakasuji"}); // 나카스지
            else if (sujis[0]) results.push({tile: tileBase + 3, type: "katasuji"}); // 카타스지
            else if (sujis[2]) results.push({tile: tileBase + 3, type: "katasuji"}); // 카타스지

            if (sujis[1]) { // 오모테스지
                results.push({tile: tileBase, type: "omotesuji"});
                results.push({tile: tileBase + 6, type: "omotesuji"});
            };
        }
    }

    return results;
}
function sortAndDistinct(source, sorter) {
    return source.slice().sort(sorter).reduce((acc, tile, index, arr) => {
        if (index == 0 || arr[index - 1] != tile) acc.push(tile);
        return acc;
    }, []);
}
function translateRyuukoku(input) {
    switch (input) {
        case "流局": return l10n.ryuukyoku.kouhai[pageLang];
        case "九種九牌": return l10n.ryuukyoku.yao9[pageLang];
        case "四家立直": return l10n.ryuukyoku.reach4[pageLang];
        case "四風連打": return l10n.ryuukyoku.kaze4[pageLang];
        case "三家和": return l10n.ryuukyoku.ron3[pageLang];
        case "四槓流れ": return l10n.ryuukyoku.kan4[pageLang];
        case "流し満貫": return l10n.ryuukyoku.nm[pageLang];
        default: return input;
    }
}