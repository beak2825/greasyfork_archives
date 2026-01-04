//来自红烧鱼i https://blog.csdn.net/q1424966670/article/details/118338460
var map = {
    "〇": 0,
    "零": 0,
    "一": 1,
    "壹": 1,
    "二": 2,
    "贰": 2,
    "两": 2,
    "三": 3,
    "叁": 3,
    "四": 4,
    "肆": 4,
    "五": 5,
    "伍": 5,
    "六": 6,
    "陆": 6,
    "七": 7,
    "柒": 7,
    "八": 8,
    "捌": 8,
    "九": 9,
    "玖": 9,
    "十": 10,
    "拾": 10,
    "百": 100,
    "佰": 100,
    "千": 1000,
    "仟": 1000,
    "万": 10000,
    "十万": 100000,
    "百万": 1000000,
    "千万": 10000000,
    "亿": 100000000
};
// 解析失败返回-1，成功返回转换后的数字，不支持负数
function numberDigit(chinese_number) {
    var len = chinese_number.length;
    if (len == 0) return -1;
    if (len == 1) return (map[chinese_number] <= 10) ? map[chinese_number] : -1;
    var summary = 0;
    if (map[chinese_number[0]] == 10) {
        chinese_number = "一" + chinese_number;
        len++;
    }
    if (len >= 3 && map[chinese_number[len - 1]] < 10) {
        var last_second_num = map[chinese_number[len - 2]];
        if (last_second_num == 100 || last_second_num == 1000 || last_second_num == 10000 || last_second_num == 100000000) {
            for (var key in map) {
                if (map[key] == last_second_num / 10) {
                    chinese_number += key;
                    len += key.length;
                    break;
                }
            }
        }
    }
    if (chinese_number.match(/亿/g) && chinese_number.match(/亿/g).length > 1) return -1;
    var splited = chinese_number.split("亿");
    var rest;
    if (splited.length == 2) {
        rest = splited[1] == "" ? 0 : numberDigit(splited[1]);
        return summary + numberDigit(splited[0]) * 100000000 + rest;
    }
    splited = chinese_number.split("万");
    if (splited.length == 2) {
        rest = splited[1] == "" ? 0 : numberDigit(splited[1]);
        return summary + numberDigit(splited[0]) * 10000 + rest;
    }
    var i = 0;
    while (i < len) {
        var first_char_num = map[chinese_number[i]];
        var second_char_num = map[chinese_number[i + 1]];
        if (second_char_num > 9) summary += first_char_num * second_char_num;
        i++;
        if (i == len) summary += first_char_num <= 9 ? first_char_num : 0;
    }
    return summary;
}
