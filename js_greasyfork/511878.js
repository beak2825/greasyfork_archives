// ==UserScript==
// @name         B站弹幕指定UID区间屏蔽
// @namespace    https://github.com/CandyTea
// @license      GPLv3
// @version      1.0
// @description  屏蔽 UID 大于指定数的一大批用户发的弹幕
// @author       me
// @match        *://*.bilibili.com/*
// @downloadURL https://update.greasyfork.org/scripts/511878/B%E7%AB%99%E5%BC%B9%E5%B9%95%E6%8C%87%E5%AE%9AUID%E5%8C%BA%E9%97%B4%E5%B1%8F%E8%94%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/511878/B%E7%AB%99%E5%BC%B9%E5%B9%95%E6%8C%87%E5%AE%9AUID%E5%8C%BA%E9%97%B4%E5%B1%8F%E8%94%BD.meta.js
// ==/UserScript==

const MAX_DIGIT = 10;

// CRC32 破解函数
function make_crc32_cracker() {
    const POLY = 0xedb88320;
    let crc32_table = new Uint32Array(256);

    function make_table() {
        for (let i = 0; i < 256; i++) {
            let crc = i;
            for (let _ = 0; _ < 8; _++) {
                if (crc & 1) {
                    crc = ((crc >>> 1) ^ POLY) >>> 0;
                } else {
                    crc = crc >>> 1;
                }
            }
            crc32_table[i] = crc;
        }
    }

    make_table();

    function update_crc(by, crc) {
        return ((crc >>> 8) ^ crc32_table[(crc & 0xff) ^ by]) >>> 0;
    }

    function compute(arr, init) {
        let crc = init || 0;
        for (let i = 0; i < arr.length; i++) {
            crc = update_crc(arr[i], crc);
        }
        return crc;
    }

    function make_rainbow(N) {
        let rainbow = new Uint32Array(N);
        for (let i = 0; i < N; i++) {
            let arr = [].slice.call(i.toString()).map(Number);
            rainbow[i] = compute(arr);
        }
        return rainbow;
    }

    let rainbow_0 = make_rainbow(100000);
    let five_zeros = Array(5).fill(0);
    let rainbow_1 = rainbow_0.map(function (crc) {
        return compute(five_zeros, crc);
    });

    let rainbow_pos = new Uint32Array(65537);
    let rainbow_hash = new Uint32Array(200000);

    function make_hash() {
        for (let i = 0; i < rainbow_0.length; i++) {
            rainbow_pos[rainbow_0[i] >>> 16]++;
        }
        for (let i = 1; i <= 65536; i++) {
            rainbow_pos[i] += rainbow_pos[i - 1];
        }
        for (let i = 0; i <= rainbow_0.length; i++) {
            let po = --rainbow_pos[rainbow_0[i] >>> 16];
            rainbow_hash[po << 1] = rainbow_0[i];
            rainbow_hash[po << 1 | 1] = i;
        }
    }

    function lookup(crc) {
        let results = [];
        let first = rainbow_pos[crc >>> 16],
            last = rainbow_pos[1 + (crc >>> 16)];
        for (let i = first; i < last; i++) {
            if (rainbow_hash[i << 1] === crc) results.push(rainbow_hash[i << 1 | 1]);
        }
        return results;
    }

    make_hash();

    function crack(maincrc, max_digit) {
        let results = [];
        maincrc = (~maincrc) >>> 0;
        let basecrc = 0xffffffff;

        for (let ndigits = 1; ndigits <= max_digit; ndigits++) {
            basecrc = update_crc(0x30, basecrc);
            if (ndigits < 6) {
                let first_uid = Math.pow(10, ndigits - 1),
                    last_uid = Math.pow(10, ndigits);
                for (let uid = first_uid; uid < last_uid; uid++) {
                    if (maincrc === ((basecrc ^ rainbow_0[uid]) >>> 0)) {
                        results.push(uid);
                    }
                }
            } else {
                let first_prefix = Math.pow(10, ndigits - 6);
                let last_prefix = Math.pow(10, ndigits - 5);
                for (let prefix = first_prefix; prefix < last_prefix; prefix++) {
                    let rem = (maincrc ^ basecrc ^ rainbow_1[prefix]) >>> 0;
                    let items = lookup(rem);
                    for (let z of items) {
                        results.push(prefix * 100000 + z);
                    }
                }
            }
        }
        return results;
    }

    return crack;
}

let _crc32_cracker = null;

// 注册在 pakku 处理弹幕之前调用的函数
tweak_before_pakku(async (chunk) => {
    // 初始化 CRC32 破解器
    _crc32_cracker = _crc32_cracker || make_crc32_cracker();

    // 将每条弹幕的内容进行过滤
    for (const dm of chunk.objs) {
        // 获取 sender_hash
        const senderHash = dm.sender_hash;

        // 解析 sender_hash 为 UID
        const uids = _crc32_cracker(parseInt(senderHash, 16), MAX_DIGIT);

        // 如果没有有效的 UID，则跳过该弹幕
        if (uids.length === 0) {
            console.warn(`Invalid UID for sender_hash: ${senderHash}`);
            continue;
        }

        // 使用第一个有效的 UID
        const uid = uids[0];

        // 屏蔽 UID 大于 93000000 的弹幕
        if (uid > 93000000) {
            console.log(`屏蔽弹幕: ${dm.content} (UID: ${uid})`); // 日志输出
            dm.content = ''; // 清空弹幕内容
        }
    }
});
