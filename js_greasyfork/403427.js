// ==UserScript==
// @name         Majsoul Research
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.majsoul.com/1/
// @match        https://game.mahjongsoul.com/
// @match        https://mahjongsoul.game.yo-star.com/
// @require      https://cdn.jsdelivr.net/npm/protobufjs@6.9.0/dist/protobuf.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/403427/Majsoul%20Research.user.js
// @updateURL https://update.greasyfork.org/scripts/403427/Majsoul%20Research.meta.js
// ==/UserScript==

(function() {
    const SHOW_ACCOUNT_STATS = true;
    const OVERRIDE_CHARACTER_INFO = true;

    const _WebSocket = window.WebSocket;
    const packets = [];
    const decodedPackets = [];
    const callMap = new Map();
    let root;
    let Wrapper;
    let ws;

    window.WebSocket = class extends _WebSocket {
        constructor(url, ...args) {
            super(url, ...args);
            ws = this;
        }

        /** @override */
        send(data) {
            super.send(data);
            const buffer = new Uint8Array(data);
            // console.log("<< ", buffer);
            const {type, name, content} = parseBuffer(buffer);
            decodedPackets.push({type, name, content});
            console.debug({type, name, content});
            packets.push(buffer);
        }

        /** @override */
        addEventListener(type, listener, ...args) {
            if (type === 'message') {
                super.addEventListener('message', (msg) => this.handleMessage(msg, listener), ...args);
            } else {
                super.addEventListener(type, listener, ...args);
            }
        }

        /** @override */
        set onmessage(listener) {
            super.addEventListener('message', (msg) => this.handleMessage(msg, listener));
        }

        handleMessage(msg, listener) {
            const buffer2 = new Uint8Array(msg.data);
            // console.log('>> ', buffer2);
            const {type, name, content, header} = parseBuffer(buffer2);
            decodedPackets.push({type, name, content});
            console.debug({type, name, content});
            packets.push(buffer2);

            try {
                switch (name) {
                    case 'fetchAccountStatisticInfo':
                        if (SHOW_ACCOUNT_STATS) {
                            showStatistics(content);
                        }
                        break;
                    case 'fetchCharacterInfo':
                        if (OVERRIDE_CHARACTER_INFO) {
                            const fetchCharacterInfoContent = {
                                ...content,
                                characters: content.characters.map((character) => ({
                                    ...character,
                                    level: 5,
                                    exp: 0,
                                })),
                            };
                            const fetchCharacterInfoData = myEncodeResponse('.lq.Lobby.fetchCharacterInfo', fetchCharacterInfoContent, header);
                            console.log('overridden', {type, name, content: fetchCharacterInfoContent});
                            listener({data: fetchCharacterInfoData});
                            return;
                        }
                        break;
                    default:
                }
            } catch (e) {
                console.error(e);
            }

            listener(msg);
        }
    }

    window.getPackets = function() {
        return JSON.stringify(packets.map(buf => Array.from(buf)));
    }

    window.getDecodedPackets = function() {
        return decodedPackets.map(({type, name, content}) => `${type}: ${name}\n${JSON.stringify(content, undefined, 2)}`).join('\n');
    }

    window.send = function(methodName, data) {
        const requestIndex = 23333;
        const method = lookupMethod(root, methodName);
        callMap.set(requestIndex, method);
        const buffer = myEncodeRequest(methodName, data, [2, requestIndex & 0xff, requestIndex >> 8]);
        ws.send(buffer);
    }

    function lookupMethod(root, e) {
        if ("string" == typeof e && (e = e.split(".")),
        0 === e.length)
            return null;
        var t = root.lookupService(e.slice(0, -1));
        if (!t)
            return null;
        var i = e[e.length - 1];
        return t.methods[i].resolve();
    }

    function getRequestIndex(buffer) {
        return (buffer[2] << 8) + buffer[1];
    }

    function parseBuffer(buffer) {
        if (!root) return;
        try {
            switch (buffer[0]) {
                case 1: {
                    const wrappedNotification = Wrapper.decode(buffer.slice(1));

                    const Type = root.lookupType(wrappedNotification.name);
                    const notification = Type.decode(wrappedNotification.data);

                    if (wrappedNotification.name === '.lq.ActionPrototype') {
                        const InnerType = root.lookupType(notification.name);
                        const innerNotification = InnerType.decode(notification.data);
                        return {type: 'Not', name: notification.name, content: innerNotification, isWrapped: true, header: buffer.slice(0, 1)};
                    } else {
                        return {type: 'Not', name: wrappedNotification.name, content: notification, isWrapped: false, header: buffer.slice(0, 1)};
                    }
                }
                case 2: {
                    const wrappedRequest = Wrapper.decode(buffer.slice(3));
                    const method = lookupMethod(root, wrappedRequest.name);
                    callMap.set(getRequestIndex(buffer), method);

                    const RequestType = method.resolvedRequestType;
                    const request = RequestType.decode(wrappedRequest.data);
                    return {type: 'Req', name: wrappedRequest.name, content: request, header: buffer.slice(0, 3)};
                }
                case 3: {
                    const wrappedResponse = Wrapper.decode(buffer.slice(3));
                    const responseMethod = callMap.get(getRequestIndex(buffer));
                    const ResponseType = responseMethod.resolvedResponseType;
                    const response = ResponseType.decode(wrappedResponse.data);
                    return {type: 'Res', name: responseMethod.name, content: response, header: buffer.slice(0, 3)};
                }
            }
        } catch (e) {
            console.error(e);
        }
    }

    function myEncode(MessageType, name, msg, header) {
        const buffer = MessageType.encode(msg).finish();
        const wrappedBuffer = Wrapper.encode({name, data: buffer}).finish();
        const wrappedBufferWithHeader = bufferConcat(header, wrappedBuffer);
        return wrappedBufferWithHeader;
    }

    function myEncodeRequest(methodName, msg, header) {
        const RequestType = lookupMethod(root, methodName).resolvedRequestType;
        return myEncode(RequestType, methodName, msg, header);
    }

    function myEncodeResponse(methodName, msg, header) {
        const ResponseType = lookupMethod(root, methodName).resolvedResponseType;
        return myEncode(ResponseType, '', msg, header);
    }

    function bufferConcat(buffer1, buffer2) {
        const array1 = new Uint8Array(buffer1);
        const array2 = new Uint8Array(buffer2);
        const result = new Uint8Array(array1.length + array2.length);
        result.set(array1, 0);
        result.set(array2, array1.length);
        return result;
    }

    function showStatistics(fetchAccountStatisticInfoRes) {
        const stat = analyzeStatistics(fetchAccountStatisticInfoRes);
        console.log(`
一位率\t${formatPercentage(stat.positionRates[0])}\t\t总对局数\t${formatInt(stat.gameCount)}\t\t和牌率\t${formatPercentage(stat.winRate)}
二位率\t${formatPercentage(stat.positionRates[1])}\t\t平均打点\t${formatInt(stat.avgPoint)}\t\t自摸率\t${formatPercentage(stat.tsumoRate)}
三位率\t${formatPercentage(stat.positionRates[2])}\t\t平均顺位\t${formatDecimal(stat.avgPosition)}\t\t放铳率\t${formatPercentage(stat.loseRate)}
四位率\t${formatPercentage(stat.positionRates[3])}\t\t最大连庄\t${formatInt(stat.highestWinStreak)}\t\t副露率\t${formatPercentage(stat.fuuroRate)}
被飞率\t${formatPercentage(stat.flyRate)}\t\t和了巡数\t${formatDecimal(stat.avgWinTurnCount)}\t\t立直率\t${formatPercentage(stat.riichiRate)}`);
    }

    function formatInt(num) {
        return num.toFixed(0).padEnd(4);
    }

    function formatDecimal(num) {
        return num.toFixed(2);
    }

    function formatPercentage(num) {
        return (num * 100).toFixed(2) + '%';
    }

    function analyzeStatistics(fetchAccountStatisticInfoRes) {
        const levelDataList = fetchAccountStatisticInfoRes.detail_data.rank_statistic.total_statistic.level_data_list;
        if (!levelDataList || !levelDataList.length) {
            console.log('No rank stat found.');
            return;
        }
        const highestLevel = Math.max(
            ...levelDataList.map((data) => data.statistic.game_mode && data.statistic.game_mode.find((modeStat) => modeStat.mode === 2) ? data.rank_level : 0));
        const highestLevelStat = levelDataList.find((data) => data.rank_level === highestLevel).statistic;
        const gameStat = highestLevelStat.game_mode.find((modeStat) => modeStat.mode === 2);
        if (!gameStat) {
            console.log('No south game stat found.');
            return;
        }
        const gameCount = gameStat.game_count_sum;
        const gameRoundCount = gameStat.round_count_sum;
        const winCount = sum(gameStat.round_end.filter((endResult) => endResult.type === 2 || endResult.type === 3).map((endResult) => endResult.sum));
        return {
            positionRates: gameStat.game_final_position.map((count) => count / gameCount),
            flyRate: gameStat.fly_count / gameCount,
            gameCount,
            avgPoint: gameStat.dadian_sum / winCount,
            avgPosition: sum(gameStat.game_final_position.map((count, i) => count / gameCount * (i + 1))),
            highestWinStreak: gameStat.highest_lianzhuang,
            avgWinTurnCount: gameStat.xun_count_sum / winCount,
            winRate: winCount / gameRoundCount,
            tsumoRate: sum(gameStat.round_end.filter((endResult) => endResult.type === 2).map((endResult) => endResult.sum)) / winCount,
            loseRate: sum(gameStat.round_end.filter((endResult) => endResult.type === 4).map((endResult) => endResult.sum)) / gameRoundCount,
            fuuroRate: gameStat.ming_count_sum / gameRoundCount,
            riichiRate: gameStat.liqi_count_sum / gameRoundCount,
        }
    }

    function sum(arr) {
        return arr.reduce((a, b) => a + b, 0);
    }

    async function init() {
        const resUrlPrefix = location.href.replace(/\/$/, '');
        const version = (await (await fetch(`${resUrlPrefix}/version.json`)).json()).version;
        const resMap = (await (await fetch(`${resUrlPrefix}/resversion${version}.json`)).json()).res;
        const protobufDefRawUrl = 'res/proto/liqi.json';
        const protobufDefUrlPrefix = resMap[protobufDefRawUrl].prefix;
        const protobufDefUrl = `${protobufDefUrlPrefix}/${protobufDefRawUrl}`;
        root = await protobuf.load(protobufDefUrl);
        Wrapper = root.lookupType('lq.Wrapper');
    }

    init();
})();
