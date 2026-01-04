// ==UserScript==
// @name         pdd快递库
// @namespace    https://porder.shop.jd.com/
// @version      1.0
// @description  快递库
// @author       YOU
// @icon         https://www.jd.com/favicon.ico
// @grant        none
// ==/UserScript==
var 拼多多快递公司 = [
    {
        "shippingId": 115,
        "shippingName": "中通快递"
    },
    {
        "shippingId": 121,
        "shippingName": "韵达快递"
    },
    {
        "shippingId": 85,
        "shippingName": "圆通快递"
    },
    {
        "shippingId": 1,
        "shippingName": "申通快递"
    },
    {
        "shippingId": 3,
        "shippingName": "百世快递"
    },
    {
        "shippingId": 119,
        "shippingName": "天天快递"
    },
    {
        "shippingId": 132,
        "shippingName": "邮政快递包裹"
    },
    {
        "shippingId": 117,
        "shippingName": "优速快递"
    },
    {
        "shippingId": 118,
        "shippingName": "邮政EMS"
    },
    {
        "shippingId": 44,
        "shippingName": "顺丰快递"
    },
    {
        "shippingId": 384,
        "shippingName": "极兔速递"
    },
    {
        "shippingId": 129,
        "shippingName": "宅急送快递"
    },
    {
        "shippingId": 131,
        "shippingName": "德邦快递"
    },
    {
        "shippingId": 324,
        "shippingName": "邮政标准快递"
    },
    {
        "shippingId": 120,
        "shippingName": "京东快递"
    },
    {
        "shippingId": 408,
        "shippingName": "1919酒类直供"
    },
    {
        "shippingId": 387,
        "shippingName": "21cake物流"
    },
    {
        "shippingId": 232,
        "shippingName": "AAE全球专递"
    },
    {
        "shippingId": 346,
        "shippingName": "安得物流"
    },
    {
        "shippingId": 345,
        "shippingName": "安能快运"
    },
    {
        "shippingId": 352,
        "shippingName": "安迅物流"
    },
    {
        "shippingId": 394,
        "shippingName": "澳邮中国快运"
    },
    {
        "shippingId": 233,
        "shippingName": "Aramex"
    },
    {
        "shippingId": 376,
        "shippingName": "百世国际"
    },
    {
        "shippingId": 3,
        "shippingName": "百世快递"
    },
    {
        "shippingId": 229,
        "shippingName": "百世快运"
    },
    {
        "shippingId": 338,
        "shippingName": "斑马物联网"
    },
    {
        "shippingId": 195,
        "shippingName": "贝海国际速递"
    },
    {
        "shippingId": 200,
        "shippingName": "程光物流"
    },
    {
        "shippingId": 262,
        "shippingName": "传喜物流"
    },
    {
        "shippingId": 236,
        "shippingName": "COE东方快递"
    },
    {
        "shippingId": 349,
        "shippingName": "当当网"
    },
    {
        "shippingId": 263,
        "shippingName": "大田物流"
    },
    {
        "shippingId": 131,
        "shippingName": "德邦快递"
    },
    {
        "shippingId": 230,
        "shippingName": "德邦物流"
    },
    {
        "shippingId": 239,
        "shippingName": "DHL中国"
    },
    {
        "shippingId": 397,
        "shippingName": "叮当快送"
    },
    {
        "shippingId": 264,
        "shippingName": "递四方"
    },
    {
        "shippingId": 354,
        "shippingName": "D速物流"
    },
    {
        "shippingId": 213,
        "shippingName": "EMS-国际件"
    },
    {
        "shippingId": 226,
        "shippingName": "EWE全球快递"
    },
    {
        "shippingId": 389,
        "shippingName": "方舟国际速递"
    },
    {
        "shippingId": 268,
        "shippingName": "飞豹快递"
    },
    {
        "shippingId": 337,
        "shippingName": "飞洋快递"
    },
    {
        "shippingId": 403,
        "shippingName": "丰网速运"
    },
    {
        "shippingId": 365,
        "shippingName": "复融供应链"
    },
    {
        "shippingId": 223,
        "shippingName": "富腾达"
    },
    {
        "shippingId": 363,
        "shippingName": "高捷物流"
    },
    {
        "shippingId": 382,
        "shippingName": "海信物流"
    },
    {
        "shippingId": 413,
        "shippingName": "哈啰出行"
    },
    {
        "shippingId": 157,
        "shippingName": "黑猫宅急便"
    },
    {
        "shippingId": 273,
        "shippingName": "恒路物流"
    },
    {
        "shippingId": 385,
        "shippingName": "合众速递"
    },
    {
        "shippingId": 374,
        "shippingName": "HKE国际速递"
    },
    {
        "shippingId": 197,
        "shippingName": "环球速运"
    },
    {
        "shippingId": 395,
        "shippingName": "汇森速运"
    },
    {
        "shippingId": 276,
        "shippingName": "佳吉快运"
    },
    {
        "shippingId": 277,
        "shippingName": "佳怡物流"
    },
    {
        "shippingId": 275,
        "shippingName": "加运美"
    },
    {
        "shippingId": 362,
        "shippingName": "加州猫速递"
    },
    {
        "shippingId": 340,
        "shippingName": "京东大件物流"
    },
    {
        "shippingId": 120,
        "shippingName": "京东快递"
    },
    {
        "shippingId": 281,
        "shippingName": "京广速递"
    },
    {
        "shippingId": 384,
        "shippingName": "极兔速递"
    },
    {
        "shippingId": 136,
        "shippingName": "九曳供应链"
    },
    {
        "shippingId": 383,
        "shippingName": "空港宏远电商物流"
    },
    {
        "shippingId": 183,
        "shippingName": "跨越速运"
    },
    {
        "shippingId": 405,
        "shippingName": "老百姓大药房"
    },
    {
        "shippingId": 135,
        "shippingName": "联邦快递"
    },
    {
        "shippingId": 285,
        "shippingName": "联昊通"
    },
    {
        "shippingId": 368,
        "shippingName": "美快国际"
    },
    {
        "shippingId": 291,
        "shippingName": "民航快递"
    },
    {
        "shippingId": 407,
        "shippingName": "农夫山泉"
    },
    {
        "shippingId": 393,
        "shippingName": "千机网1小时达"
    },
    {
        "shippingId": 409,
        "shippingName": "全友家居"
    },
    {
        "shippingId": 398,
        "shippingName": "泉源堂"
    },
    {
        "shippingId": 359,
        "shippingName": "群航国际货运"
    },
    {
        "shippingId": 227,
        "shippingName": "日日顺物流"
    },
    {
        "shippingId": 364,
        "shippingName": "商桥物流"
    },
    {
        "shippingId": 305,
        "shippingName": "盛丰物流"
    },
    {
        "shippingId": 306,
        "shippingName": "盛辉物流"
    },
    {
        "shippingId": 390,
        "shippingName": "圣塔智能物流"
    },
    {
        "shippingId": 355,
        "shippingName": "申通国际"
    },
    {
        "shippingId": 1,
        "shippingName": "申通快递"
    },
    {
        "shippingId": 391,
        "shippingName": "顺丰国际"
    },
    {
        "shippingId": 44,
        "shippingName": "顺丰快递"
    },
    {
        "shippingId": 372,
        "shippingName": "顺丰快运"
    },
    {
        "shippingId": 358,
        "shippingName": "顺心捷达"
    },
    {
        "shippingId": 341,
        "shippingName": "速必达"
    },
    {
        "shippingId": 155,
        "shippingName": "速尔快递"
    },
    {
        "shippingId": 228,
        "shippingName": "苏宁快递"
    },
    {
        "shippingId": 386,
        "shippingName": "SYNSHIP快递"
    },
    {
        "shippingId": 392,
        "shippingName": "泰进物流"
    },
    {
        "shippingId": 210,
        "shippingName": "天地华宇"
    },
    {
        "shippingId": 336,
        "shippingName": "天际快递"
    },
    {
        "shippingId": 119,
        "shippingName": "天天快递"
    },
    {
        "shippingId": 246,
        "shippingName": "UPS"
    },
    {
        "shippingId": 186,
        "shippingName": "usps"
    },
    {
        "shippingId": 388,
        "shippingName": "娃哈哈到家配送"
    },
    {
        "shippingId": 312,
        "shippingName": "万家物流"
    },
    {
        "shippingId": 380,
        "shippingName": "威盛快递"
    },
    {
        "shippingId": 370,
        "shippingName": "威时沛运"
    },
    {
        "shippingId": 216,
        "shippingName": "新邦物流"
    },
    {
        "shippingId": 315,
        "shippingName": "信丰物流"
    },
    {
        "shippingId": 396,
        "shippingName": "幸福西饼物流"
    },
    {
        "shippingId": 218,
        "shippingName": "新顺丰NSF"
    },
    {
        "shippingId": 375,
        "shippingName": "新西兰平安物流"
    },
    {
        "shippingId": 317,
        "shippingName": "亚风速递"
    },
    {
        "shippingId": 156,
        "shippingName": "亚马逊物流"
    },
    {
        "shippingId": 373,
        "shippingName": "亚马逊综合物流"
    },
    {
        "shippingId": 319,
        "shippingName": "燕文物流"
    },
    {
        "shippingId": 399,
        "shippingName": "益丰大药房"
    },
    {
        "shippingId": 339,
        "shippingName": "易客满"
    },
    {
        "shippingId": 348,
        "shippingName": "壹米滴答"
    },
    {
        "shippingId": 356,
        "shippingName": "一智通"
    },
    {
        "shippingId": 335,
        "shippingName": "优邦国际速运"
    },
    {
        "shippingId": 117,
        "shippingName": "优速快递"
    },
    {
        "shippingId": 324,
        "shippingName": "邮政标准快递"
    },
    {
        "shippingId": 118,
        "shippingName": "邮政EMS"
    },
    {
        "shippingId": 325,
        "shippingName": "邮政国际包裹"
    },
    {
        "shippingId": 132,
        "shippingName": "邮政快递包裹"
    },
    {
        "shippingId": 205,
        "shippingName": "远成快运"
    },
    {
        "shippingId": 381,
        "shippingName": "圆通国际"
    },
    {
        "shippingId": 85,
        "shippingName": "圆通快递"
    },
    {
        "shippingId": 406,
        "shippingName": "跃陆物流"
    },
    {
        "shippingId": 367,
        "shippingName": "韵达国际"
    },
    {
        "shippingId": 121,
        "shippingName": "韵达快递"
    },
    {
        "shippingId": 344,
        "shippingName": "韵达快运"
    },
    {
        "shippingId": 129,
        "shippingName": "宅急送快递"
    },
    {
        "shippingId": 411,
        "shippingName": "芝华仕"
    },
    {
        "shippingId": 401,
        "shippingName": "中汲物流"
    },
    {
        "shippingId": 347,
        "shippingName": "中粮我买网"
    },
    {
        "shippingId": 332,
        "shippingName": "中铁快运"
    },
    {
        "shippingId": 214,
        "shippingName": "中铁物流"
    },
    {
        "shippingId": 371,
        "shippingName": "中通国际"
    },
    {
        "shippingId": 115,
        "shippingName": "中通快递"
    },
    {
        "shippingId": 360,
        "shippingName": "中外运速递"
    },
    {
        "shippingId": 211,
        "shippingName": "中邮速递"
    },
    {
        "shippingId": 366,
        "shippingName": "中远e环球"
    },
    {
        "shippingId": 379,
        "shippingName": "转运四方物流"
    },
    {
        "shippingId": 361,
        "shippingName": "卓志速运"
    }
]