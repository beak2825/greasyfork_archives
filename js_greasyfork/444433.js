// ==UserScript==
// @name         CCO Monitor
// @namespace    -
// @version      0.3
// @description  -
// @author       LianSheng
// @include      https://cybercodeonline.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=cybercodeonline.com
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/444433/CCO%20Monitor.user.js
// @updateURL https://update.greasyfork.org/scripts/444433/CCO%20Monitor.meta.js
// ==/UserScript==

const META = {
    name: "CMON",
    version: "v0.3",
    date: "2022-05-11",
};

(function () {
    console.clear = () => { };

    if (JSON.stringify2 === undefined) JSON.stringify2 = JSON.stringify;
    JSON.stringify = function (A, B, C) {
        const a = Object.assign({}, A);
        let show = true;
        let type = "Unknown";
        let color = "";

        // Reported bug, waiting for resolve.
        // Fixed (2022-05-07).
        if (a && a.percent !== undefined && a.itemId === undefined) {
            type = "DungeonAttack";
            color = "#5ee7ff";
            a.percent = -1000000;
        }

        if (a && a.level !== undefined) {
            type = "NearbyEnemy";
            color = "#5ee7ff";
        }

        if (typeof a === "object" && Object.keys(a).length === 0) {
            type = "Empty";
            color = "#6881a1";
            show = false;
        }

        if (a && a.base64) {
            type = "Encrypted";
            color = "#78634a";
        }

        if (a && a.application_info) {
            type = "MetaInfo";
            color = "#6d4a78";

            // ignore
            return JSON.stringify2(...arguments);
        }

        if (a && a.authToken) {
            type = "Player";
            color = "#ff5e5e";
            a.authToken = "<REDACTED>";
            a.attackPercent = 3000;
        }

        if (a && a.log_event) {
            type = "Logger";
            color = "#fff45e";
        }

        if (a && a.addTarget) {
            type = "DB_AddTarget";
            color = "#ff00f2";

            console.info("Caller: ", arguments.callee.caller);
            console.warn("Callee: ", arguments.callee);

            // Try to hack via firebase documents

            /*
            A.addTarget.query.structuredQuery.limit = 1;

            A.addTarget.query.structuredQuery.orderBy = [
                {
                    direction: "DESCENDING",
                    field: {
                        fieldPath: "ixp"
                    }
                }
            ];

            A.addTarget.query.structuredQuery.where = {
                compositeFilter: {
                    op: "AND",
                    filters: [
                        {
                            fieldFilter:  {
                                field: {
                                    fieldPath: "ixp"
                                },
                                op: "GREATER_THAN",
                                value: {
                                    integerValue: 10000
                                }
                            }
                        },
                        {
                            fieldFilter:  {
                                field: {
                                    fieldPath: "ixp"
                                },
                                op: "LESS_THAN",
                                value: {
                                    integerValue: 959668
                                }
                            }
                        }
                    ]
                }
            };
            */
        }

        if (a && a.removeTarget) {
            type = "DB_RemoveTarget";
            color = "#b000a7";
        }

        if (a && a.topic) {
            if (a.topic.startsWith("realtime")) {
                type = "WS_FetchMessage";
                color = "#b15eff";

                // ignore
                // return JSON.stringify2(...arguments);
            } else if (a.topic == "phoenix") {
                type = "WS_Heartbeat";
                color = "#dc5eff";

                // ignore
                return JSON.stringify2(...arguments);
            } else {
                type = "WS_UnknownTopic";
                color = "#85a8ab";
            }
        }

        // 送禮物 -> 惡作劇，把一組多個拆成多組一個
        if (a && a.receiverId && a.simpleItems) {
            const result = [];

            for (let i = 0; i < a.simpleItems[0].amount; i++) {
                result.push({ id: a.simpleItems[0].id, amount: 1 });

                // 無效的數字將會送出空氣
                // result.push({id: a.simpleItems[0].id, amount: 0.25});
            }

            A.simpleItems = result;
            console.warn(`<PRANK> ${a.simpleItems[0].id} x ${a.simpleItems[0].amount}`);
        }

        show && console.info(`%c【 ${META.name} ${META.version} (${META.date}) 】 (${type})`, `font-weight: bold; color: ${color}`, a);
        return JSON.stringify2(...arguments);
    };
})();