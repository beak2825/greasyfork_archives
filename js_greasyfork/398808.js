// @name BV号⇆AV号
// @description B站BV号与AV号互转脚本库
// @language zh-CN
const table = [...'fZodR9XQDSUm21yCkr6zBqiveYah8bt4xsWpHnJE7jL5VG3guMTKNPAwcF'];
const s = [11, 10, 3, 8, 4, 6];
const xor = 177451812;
const add = 8728348608;
const bv2av = bv=>{
    let str = '';
    if (bv.length === 12) {
        str = bv;
    } else if (bv.length === 10) {
        str = `BV${bv}`;
    // 根据官方 API，BV 号开头的 BV1 其实可以省略
    // 不过单独省略个 B 又不行（
    } else if (bv.length === 9) {
        str = `BV1${bv}`;
    } else {
        return '¿你在想桃子?';
    };
    if (!str.match(/[Bb][Vv][fZodR9XQDSUm21yCkr6zBqiveYah8bt4xsWpHnJE7jL5VG3guMTKNPAwcF]{10}/gu)) {
        return '¿你在想桃子?';
    };

    let result = 0;
    let i = 0;
    while (i < 6) {
        result += table.indexOf(str[s[i]]) * 58 ** i;
        i += 1;
    };
    return `av${result - add ^ xor}`;
};
const av2bv = av=>{
    let num = NaN;
    if (Object.prototype.toString.call(av) === '[object Number]') {
        num = av;
    } else if (Object.prototype.toString.call(av) === '[object String]') {
        num = parseInt(av.replace(/[^0-9]/gu, ''));
    };
    if (isNaN(num) || num <= 0) {
        // 网页版直接输出这个结果了
        return '¿你在想桃子?';
    };

    num = (num ^ xor) + add;
    let result = [...'bv1  4 1 7  '];
    let i = 0;
    while (i < 6) {
        result[s[i]] = table[Math.floor(num / 58 ** i) % 58];
        i += 1;
    };
    return result.join('');
};