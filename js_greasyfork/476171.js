// ==UserScript==
// @name         boss直聘自动打招呼
// @namespace    https://github.com/18023785187/auto-job
// @version      0.1.0
// @description  boss直聘自动打招呼油猴脚本
// @author       hym20000418
// @match        *://www.zhipin.com/*
// @icon         none
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/476171/boss%E7%9B%B4%E8%81%98%E8%87%AA%E5%8A%A8%E6%89%93%E6%8B%9B%E5%91%BC.user.js
// @updateURL https://update.greasyfork.org/scripts/476171/boss%E7%9B%B4%E8%81%98%E8%87%AA%E5%8A%A8%E6%89%93%E6%8B%9B%E5%91%BC.meta.js
// ==/UserScript==

/*
    修改该配置即可限定打招呼对象
*/
const config = {
    /**
     * 设置职位入口，可选值 0, 1, 2
     * 0 为以 搜索框搜索 作为职位入口
     * 1 为以 推荐职位——精选职位 作为职位入口
     * 2 为以 推荐职位——最新职位 作为职位入口
     * 
     * 设置三个入口是原因三个入口的职位都不太一样，避免漏了一些职位可以尝试切换入口
     */
    mode: 2,
    /**
     * 目标城市,
     * mode 为 1 或 2 时需要事先设置求职意向为目标城市，否则不生效
     */
    city: '深圳',
    /**
     * 职位关键词
     * mode 为 0 时作为搜索框的关键词键入
     * mode 为 1 或 2 时作为职位列表项中的职位名称匹配（这是因为推荐的职位不是很准确，比如偶尔会出现 “安卓工程师” 之类的职位，这时就需要通过关键词去过滤不匹配的职位）
     */
    keyword: '前端',
    /**
     * 职位名称要排除的关键字，比如 '高级前端工程师' 将会比排除在外
     */
    excludeKeywords: ['高级', '资深', '驻场', '外派', '安卓'],
    /**
     * 是否接受外地职位（职位列表有时会出现外地职位）
     */
    otherPlace: false,
    /**
     * 活跃度，匹配中的才会打招呼
     */
    liveness: ['在线', '刚刚活跃', '今日活跃', '3日内活跃'],
    /**
     * 要排除的公司名
     */
    excludes: ['中软国际', '德科', '睿服'],
    /**
     * 每次访问的最小间隔，防止操作过快被系统判定为机器人，单位秒
     */
    min: 3,
    /**
     * 每次访问的最大间隔，防止操作过快被系统判定为机器人，单位秒
     */
    max: 6,
    /**
     * 打招呼语
     */
    message: '您好，我正在找前端开发的工作，希望有机会与贵司进一步交流',
    /**
     * 工作年限，可多选
     * 经验不限     101
     * 应届生       102
     * 1年以内      103
     * 1-3年        104
     * 3-5年        105
     * 5-10年        106
     * 10年以上       107
     * 在校生          108
     */
    experience: [101, 103, 104, 105],
    /**
     * 薪资待遇，数字类型
     * 3K 以下      402
     * 3-5K         403
     * 5-10K        404
     * 10-20K       405
     * 20-50K       406
     * 50K以上      407
     * 
     * 自定义   [min, max] min表示最小值，max表示最大值，单位 K，如 salary: [13, 15] 表示 13-15K
     */
    salary: [],
    /**
     * 公司规模
     * 0-20人       301
     * 20-99人      302
     * 100-499人    303
     * 500-999人    304
     * 1000-9999人  305
     * 10000人以上  306
     */
    scale: [],
    /**
     * 学历要求
     * 大专 202
     * 本科 203
     * 硕士 204
     * 博士 205
     * 高中 206
     * 中专 208
     * 初中 209
     */
    degree: [],
}

var AutoJob = (function () {
    'use strict';

    /**
     * 监听元素是否生成
     */
    async function monitorElementGeneration(selector) {
        return new Promise(resolve => {
            let el;
            let timer = setInterval(() => {
                el = document.querySelector(selector);
                if(el) {
                    resolve(el);
                    clearInterval(timer);
                }
            }, 100);
        })
    }

    async function monitorElementsGeneration(selector) {
        return new Promise(resolve => {
            let el;
            let timer = setInterval(() => {
                el = document.querySelectorAll(selector);
                if(el.length) {
                    resolve(el);
                    clearInterval(timer);
                }
            }, 100);
        })
    }

    /**
     * 输入最大和最小正整数，在该范围内取随机数
     * @param {*} min 
     * @param {*} max 
     * @returns 
     */
    function random(min, max) {
        return (
            min + (Math.random() * (max - min))
        )
    }

    const cityCodeMap = {
        "北京": 101010100,
        "上海": 101020100,
        "天津": 101030100,
        "重庆": 101040100,
        "哈尔滨": 101050100,
        "齐齐哈尔": 101050200,
        "牡丹江": 101050300,
        "佳木斯": 101050400,
        "绥化": 101050500,
        "黑河": 101050600,
        "伊春": 101050700,
        "大庆": 101050800,
        "七台河": 101050900,
        "鸡西": 101051000,
        "鹤岗": 101051100,
        "双鸭山": 101051200,
        "大兴安岭地区": 101051300,
        "长春": 101060100,
        "吉林": 101060200,
        "四平": 101060300,
        "通化": 101060400,
        "白城": 101060500,
        "辽源": 101060600,
        "松原": 101060700,
        "白山": 101060800,
        "延边朝鲜族自治州": 101060900,
        "沈阳": 101070100,
        "大连": 101070200,
        "鞍山": 101070300,
        "抚顺": 101070400,
        "本溪": 101070500,
        "丹东": 101070600,
        "锦州": 101070700,
        "营口": 101070800,
        "阜新": 101070900,
        "辽阳": 101071000,
        "铁岭": 101071100,
        "朝阳": 101071200,
        "盘锦": 101071300,
        "葫芦岛": 101071400,
        "呼和浩特": 101080100,
        "包头": 101080200,
        "乌海": 101080300,
        "通辽": 101080400,
        "赤峰": 101080500,
        "鄂尔多斯": 101080600,
        "呼伦贝尔": 101080700,
        "巴彦淖尔": 101080800,
        "乌兰察布": 101080900,
        "锡林郭勒盟": 101081000,
        "兴安盟": 101081100,
        "阿拉善盟": 101081200,
        "石家庄": 101090100,
        "保定": 101090200,
        "张家口": 101090300,
        "承德": 101090400,
        "唐山": 101090500,
        "廊坊": 101090600,
        "沧州": 101090700,
        "衡水": 101090800,
        "邢台": 101090900,
        "邯郸": 101091000,
        "秦皇岛": 101091100,
        "太原": 101100100,
        "大同": 101100200,
        "阳泉": 101100300,
        "晋中": 101100400,
        "长治": 101100500,
        "晋城": 101100600,
        "临汾": 101100700,
        "运城": 101100800,
        "朔州": 101100900,
        "忻州": 101101000,
        "吕梁": 101101100,
        "西安": 101110100,
        "咸阳": 101110200,
        "延安": 101110300,
        "榆林": 101110400,
        "渭南": 101110500,
        "商洛": 101110600,
        "安康": 101110700,
        "汉中": 101110800,
        "宝鸡": 101110900,
        "铜川": 101111000,
        "济南": 101120100,
        "青岛": 101120200,
        "淄博": 101120300,
        "德州": 101120400,
        "烟台": 101120500,
        "潍坊": 101120600,
        "济宁": 101120700,
        "泰安": 101120800,
        "临沂": 101120900,
        "菏泽": 101121000,
        "滨州": 101121100,
        "东营": 101121200,
        "威海": 101121300,
        "枣庄": 101121400,
        "日照": 101121500,
        "聊城": 101121700,
        "乌鲁木齐": 101130100,
        "克拉玛依": 101130200,
        "昌吉回族自治州": 101130300,
        "巴音郭楞蒙古自治州": 101130400,
        "博尔塔拉蒙古自治州": 101130500,
        "伊犁哈萨克自治州": 101130600,
        "吐鲁番": 101130800,
        "哈密": 101130900,
        "阿克苏地区": 101131000,
        "克孜勒苏柯尔克孜自治州": 101131100,
        "喀什地区": 101131200,
        "和田地区": 101131300,
        "塔城地区": 101131400,
        "阿勒泰地区": 101131500,
        "石河子": 101131600,
        "阿拉尔": 101131700,
        "图木舒克": 101131800,
        "五家渠": 101131900,
        "铁门关": 101132000,
        "北屯市": 101132100,
        "可克达拉市": 101132200,
        "昆玉市": 101132300,
        "双河市": 101132400,
        "新星市": 101132500,
        "胡杨河市": 101132600,
        "拉萨": 101140100,
        "日喀则": 101140200,
        "昌都": 101140300,
        "林芝": 101140400,
        "山南": 101140500,
        "那曲": 101140600,
        "阿里地区": 101140700,
        "西宁": 101150100,
        "海东": 101150200,
        "海北藏族自治州": 101150300,
        "黄南藏族自治州": 101150400,
        "海南藏族自治州": 101150500,
        "果洛藏族自治州": 101150600,
        "玉树藏族自治州": 101150700,
        "海西蒙古族藏族自治州": 101150800,
        "兰州": 101160100,
        "定西": 101160200,
        "平凉": 101160300,
        "庆阳": 101160400,
        "武威": 101160500,
        "金昌": 101160600,
        "张掖": 101160700,
        "酒泉": 101160800,
        "天水": 101160900,
        "白银": 101161000,
        "陇南": 101161100,
        "嘉峪关": 101161200,
        "临夏回族自治州": 101161300,
        "甘南藏族自治州": 101161400,
        "银川": 101170100,
        "石嘴山": 101170200,
        "吴忠": 101170300,
        "固原": 101170400,
        "中卫": 101170500,
        "郑州": 101180100,
        "安阳": 101180200,
        "新乡": 101180300,
        "许昌": 101180400,
        "平顶山": 101180500,
        "信阳": 101180600,
        "南阳": 101180700,
        "开封": 101180800,
        "洛阳": 101180900,
        "商丘": 101181000,
        "焦作": 101181100,
        "鹤壁": 101181200,
        "濮阳": 101181300,
        "周口": 101181400,
        "漯河": 101181500,
        "驻马店": 101181600,
        "三门峡": 101181700,
        "济源": 101181800,
        "南京": 101190100,
        "无锡": 101190200,
        "镇江": 101190300,
        "苏州": 101190400,
        "南通": 101190500,
        "扬州": 101190600,
        "盐城": 101190700,
        "徐州": 101190800,
        "淮安": 101190900,
        "连云港": 101191000,
        "常州": 101191100,
        "泰州": 101191200,
        "宿迁": 101191300,
        "武汉": 101200100,
        "襄阳": 101200200,
        "鄂州": 101200300,
        "孝感": 101200400,
        "黄冈": 101200500,
        "黄石": 101200600,
        "咸宁": 101200700,
        "荆州": 101200800,
        "宜昌": 101200900,
        "十堰": 101201000,
        "随州": 101201100,
        "荆门": 101201200,
        "恩施土家族苗族自治州": 101201300,
        "仙桃": 101201400,
        "潜江": 101201500,
        "天门": 101201600,
        "神农架": 101201700,
        "杭州": 101210100,
        "湖州": 101210200,
        "嘉兴": 101210300,
        "宁波": 101210400,
        "绍兴": 101210500,
        "台州": 101210600,
        "温州": 101210700,
        "丽水": 101210800,
        "金华": 101210900,
        "衢州": 101211000,
        "舟山": 101211100,
        "合肥": 101220100,
        "蚌埠": 101220200,
        "芜湖": 101220300,
        "淮南": 101220400,
        "马鞍山": 101220500,
        "安庆": 101220600,
        "宿州": 101220700,
        "阜阳": 101220800,
        "亳州": 101220900,
        "滁州": 101221000,
        "淮北": 101221100,
        "铜陵": 101221200,
        "宣城": 101221300,
        "六安": 101221400,
        "池州": 101221500,
        "黄山": 101221600,
        "福州": 101230100,
        "厦门": 101230200,
        "宁德": 101230300,
        "莆田": 101230400,
        "泉州": 101230500,
        "漳州": 101230600,
        "龙岩": 101230700,
        "三明": 101230800,
        "南平": 101230900,
        "南昌": 101240100,
        "九江": 101240200,
        "上饶": 101240300,
        "抚州": 101240400,
        "宜春": 101240500,
        "吉安": 101240600,
        "赣州": 101240700,
        "景德镇": 101240800,
        "萍乡": 101240900,
        "新余": 101241000,
        "鹰潭": 101241100,
        "长沙": 101250100,
        "湘潭": 101250200,
        "株洲": 101250300,
        "衡阳": 101250400,
        "郴州": 101250500,
        "常德": 101250600,
        "益阳": 101250700,
        "娄底": 101250800,
        "邵阳": 101250900,
        "岳阳": 101251000,
        "张家界": 101251100,
        "怀化": 101251200,
        "永州": 101251300,
        "湘西土家族苗族自治州": 101251400,
        "贵阳": 101260100,
        "遵义": 101260200,
        "安顺": 101260300,
        "铜仁": 101260400,
        "毕节": 101260500,
        "六盘水": 101260600,
        "黔东南苗族侗族自治州": 101260700,
        "黔南布依族苗族自治州": 101260800,
        "黔西南布依族苗族自治州": 101260900,
        "成都": 101270100,
        "攀枝花": 101270200,
        "自贡": 101270300,
        "绵阳": 101270400,
        "南充": 101270500,
        "达州": 101270600,
        "遂宁": 101270700,
        "广安": 101270800,
        "巴中": 101270900,
        "泸州": 101271000,
        "宜宾": 101271100,
        "内江": 101271200,
        "资阳": 101271300,
        "乐山": 101271400,
        "眉山": 101271500,
        "雅安": 101271600,
        "德阳": 101271700,
        "广元": 101271800,
        "阿坝藏族羌族自治州": 101271900,
        "凉山彝族自治州": 101272000,
        "甘孜藏族自治州": 101272100,
        "广州": 101280100,
        "韶关": 101280200,
        "惠州": 101280300,
        "梅州": 101280400,
        "汕头": 101280500,
        "深圳": 101280600,
        "珠海": 101280700,
        "佛山": 101280800,
        "肇庆": 101280900,
        "湛江": 101281000,
        "江门": 101281100,
        "河源": 101281200,
        "清远": 101281300,
        "云浮": 101281400,
        "潮州": 101281500,
        "东莞": 101281600,
        "中山": 101281700,
        "阳江": 101281800,
        "揭阳": 101281900,
        "茂名": 101282000,
        "汕尾": 101282100,
        "东沙群岛": 101282200,
        "昆明": 101290100,
        "曲靖": 101290200,
        "保山": 101290300,
        "玉溪": 101290400,
        "普洱": 101290500,
        "昭通": 101290700,
        "临沧": 101290800,
        "丽江": 101290900,
        "西双版纳傣族自治州": 101291000,
        "文山壮族苗族自治州": 101291100,
        "红河哈尼族彝族自治州": 101291200,
        "德宏傣族景颇族自治州": 101291300,
        "怒江傈僳族自治州": 101291400,
        "迪庆藏族自治州": 101291500,
        "大理白族自治州": 101291600,
        "楚雄彝族自治州": 101291700,
        "南宁": 101300100,
        "崇左": 101300200,
        "柳州": 101300300,
        "来宾": 101300400,
        "桂林": 101300500,
        "梧州": 101300600,
        "贺州": 101300700,
        "贵港": 101300800,
        "玉林": 101300900,
        "百色": 101301000,
        "钦州": 101301100,
        "河池": 101301200,
        "北海": 101301300,
        "防城港": 101301400,
        "海口": 101310100,
        "三亚": 101310200,
        "三沙": 101310300,
        "儋州": 101310400,
        "五指山": 101310500,
        "琼海": 101310600,
        "文昌": 101310700,
        "万宁": 101310800,
        "东方": 101310900,
        "定安": 101311000,
        "屯昌": 101311100,
        "澄迈": 101311200,
        "临高": 101311300,
        "白沙黎族自治县": 101311400,
        "昌江黎族自治县": 101311500,
        "乐东黎族自治县": 101311600,
        "陵水黎族自治县": 101311700,
        "保亭黎族苗族自治县": 101311800,
        "琼中黎族苗族自治县": 101311900,
        "香港": 101320300,
        "澳门": 101330100,
        "台湾": 101341100
    };

    class AutoJob {
        constructor(config) {
            this.config = this._formatConfig(config);
        }

        _formatConfig(config) {
            const newConfig = {};

            if (![0, 1, 2].includes(config.mode)) {
                throw new TypeError('mode 的值必须是 0, 1, 2')
            }
            if (typeof config.city !== 'string') {
                throw new TypeError('city 类型必须是 string')
            }
            if (typeof config.keyword !== 'string') {
                throw new TypeError('keyword 类型必须是 string')
            }
            if (typeof config.message !== 'string') {
                throw new TypeError('message 类型必须是 string')
            }
            if (!config.message.length) {
                throw new TypeError('message 不能为空')
            }
            if (config.salary !== undefined) {
                if (typeof config.salary !== 'number' && !Array.isArray(config.salary)) {
                    throw new TypeError('salary 类型必须是 number 或 array')
                }
                if (
                    Array.isArray(config.salary) &&
                    config.salary.length &&
                    (typeof config.salary[0] !== 'number' || typeof config.salary[1] !== 'number')
                ) {
                    throw new TypeError('salary 类型为数组时前两项必须是 number 类型')
                }
            }
            newConfig.mode = config.mode;
            newConfig.city = config.city;
            newConfig.keyword = config.keyword;
            newConfig.otherPlace = !!config.otherPlace;
            newConfig.excludeKeywords = Array.isArray(config.excludeKeywords) ? config.excludeKeywords : [];
            newConfig.experience = Array.isArray(config.experience) ? config.experience : [];
            newConfig.liveness = Array.isArray(config.liveness) ? config.liveness : [];
            newConfig.excludes = Array.isArray(config.excludes) ? config.excludes : [];
            newConfig.scale = Array.isArray(config.scale) ? config.scale : [];
            newConfig.degree = Array.isArray(config.degree) ? config.degree : [];
            newConfig.min = (typeof newConfig.min === 'number' ? newConfig.min : 3) * 1000;
            newConfig.max = (typeof newConfig.max === 'number' ? newConfig.max : 6) * 1000;
            newConfig.message = config.message;
            newConfig.salary = config.salary ?? [];

            return newConfig
        }

        start() {
            if (window.location.pathname === '/web/geek/job') { // 通过搜索框打开的 jobs
                this._traverseJob();
            } else if (window.location.pathname === '/web/geek/recommend') { // 推荐职位的 jobs
                this._traverseRecommend();
            }
            else if (window.location.pathname.indexOf('/job_detail') === 0) { // 详情页
                this._checkValidJob();
            } else if (window.location.pathname === '/web/geek/chat') { // 聊天页
                this._sayHello();
            }
            else {
                this._toJobs();
            }
        }

        /**
         * 首页操作
         * 1、打开推荐职位
         * 2、选择城市并所搜职位关键词
         */
        async _toJobs() {
            const { config } = this;

            // 选择城市并所搜职位关键词
            if (config.mode === 0) {
                const nav = document.querySelector('.nav-city-box');
                const selected = nav.querySelector('.nav-city-selected');
                if (selected.innerText !== config.city) {
                    nav.click();
                    const section = await monitorElementGeneration('.city-group-section');
                    const citys = section.querySelectorAll('a');
                    const targetCity = Array.from(citys).find(city => city.innerText === config.city);
                    if (window.location.pathname !== targetCity.pathname) {
                        targetCity.click();
                    }
                    return
                }
                // 填写职位关键词
                const form = document.querySelector('.search-form');
                const search = form.querySelector('.search-form-con > .ipt-wrap > input');
                search.value = config.keyword;
                const button = form.querySelector('.btn-search');
                button.click();
            } else {
                // 打开推荐职位
                const recommend = await monitorElementGeneration('.merge-city-job-recommend');
                const moreBtn = recommend.querySelector('.common-tab-more > a');
                moreBtn.click();
            }
        }

        /**
         * 修正获取的 jobs 并逐个访问
         */
        async _traverseJob() {
            const { config } = this;

            const url = new URL(window.location.href);
            const { searchParams } = url;

            if (!searchParams.has('page')) {
                searchParams.append('page', 1);
            }
            const page = ~~searchParams.get('page');
            // 限制最多 10 页
            if (page > 10) return

            let isModify = false;
            setSearchParams('city', cityCodeMap[config.city]);
            setSearchParams('query', config.keyword);
            setSearchParams('experience', config.experience);
            setSearchParams('scale', config.scale);
            setSearchParams('degree', config.degree);
            if (Array.isArray(config.salary) && config.salary.length) {
                setSearchParams('salary', -40001);
                setSearchParams('lowSalary', config.salary[0]);
                setSearchParams('highSalary', config.salary[1]);
            } else {
                setSearchParams('salary', config.salary);
            }
            searchParams.set('page', page);
            if (isModify) {
                window.location.search = searchParams.toString();
                return
            }

            await this._traverse();

            searchParams.set('page', page + 1);
            window.location.search = searchParams.toString();

            function setSearchParams(key, value) {
                const oldValue = searchParams.get(key);
                if (oldValue == null || oldValue.toString() !== value.toString()) {
                    searchParams.set(key, value);
                    isModify = true;
                }
            }
        }

        /**
         * 修正获取的 jobs 并逐个访问
         */
        async _traverseRecommend() {
            const { config } = this;

            const url = new URL(window.location.href);
            const { searchParams } = url;

            if (!searchParams.has('page')) {
                searchParams.append('page', 1);
            }
            const page = ~~searchParams.get('page');
            // 限制最多 30 页
            if (page > 30) return

            const cities = await monitorElementsGeneration('.system-search-condition .expect-list > .expect-item');
            const city = Array.from(cities).find(city => city.innerText.includes(config.city));
            if (!city) return

            city.click();

            const jobTabs = await monitorElementsGeneration('.user-jobs-area .job-tab > span');
            Array.from(jobTabs).find(tab => tab.innerText === (config.mode === 2 ? '最新职位' : '精选职位')).click();

            let isModify = false;
            setSearchParams('scale', config.scale);
            setSearchParams('degree', config.degree);
            setSearchParams('experience', config.experience);
            const newUrl = new URL(window.location.href);
            const { searchParams: newSearchParams } = newUrl;
            searchParams.set('expectId', newSearchParams.get('expectId'));
            searchParams.set('sortType', newSearchParams.get('sortType'));
            if (Array.isArray(config.salary) && config.salary.length) {
                setSearchParams('salary', -40001);
                setSearchParams('lowSalary', config.salary[0]);
                setSearchParams('highSalary', config.salary[1]);
            } else {
                setSearchParams('salary', config.salary);
            }
            if (isModify) {
                window.location.search = searchParams.toString();
                return
            }

            await this._traverse();

            searchParams.set('page', page + 1);
            window.location.search = searchParams.toString();

            function setSearchParams(key, value) {
                const oldValue = searchParams.get(key);
                if (oldValue == null || oldValue.toString() !== value.toString()) {
                    searchParams.set(key, value);
                    isModify = true;
                }
            }
        }

        /**
         * 遍历 jobs
         */
        async _traverse() {
            const { config } = this;
            const box = await monitorElementGeneration('.job-list-box');
            const handlers = Array.from(box.querySelectorAll('.job-card-wrapper'))
                .filter(dom => {
                    const isfriend = dom.querySelector('.job-card-left > .job-info > .start-chat-btn');
                    const name = dom.querySelector('.job-card-right .company-name > a');
                    const jobName = dom.querySelector('.job-card-left .job-name');
                    // 过滤已沟通的职位
                    return isfriend.innerText === '立即沟通' &&
                        // 排除的公司
                        !config.excludes.some(exclude => name.innerText.includes(exclude)) &&
                        // 是否接受外地职位
                        (config.otherPlace || !dom.querySelector('.job-card-left > .icon-other-place')) &&
                        // 职位名称匹配
                        jobName.innerText.includes(config.keyword) &&
                        // 职位名称排除关键词
                        !config.excludeKeywords.find(keyword => jobName.innerText.includes(keyword))
                })
                .map(dom => {
                    return () => new Promise(resolve => {
                        setTimeout(() => {
                            dom.click();
                            resolve();
                        }, random(config.min, config.max));
                    })
                });

            for (const handler of handlers) {
                await handler();
            }
        }

        /**
         * 检查 job 是否符合，符合则打招呼
         */
        async _checkValidJob() {
            const { config } = this;
            const info = await monitorElementGeneration('.job-boss-info>.name');
            const liveness = info.querySelector('span');
            if (!liveness || (config.liveness.length && !config.liveness.includes(liveness.innerText))) {
                this._close();
                return
            }
            const commentBtn = await monitorElementGeneration('.job-banner .btn-container :nth-child(2)');
            if (commentBtn.dataset.isfriend === 'true') {
                this._close();
                return
            }
            commentBtn.click();
            const message = await monitorElementGeneration('.dialog-container>.dialog-con>.startchat-content .edit-area');
            const input = message.querySelector('.input-area');
            const send = message.querySelector('.send-message');
            const inputEv = new Event('input', { bubbles: true });
            inputEv.simulated = true;
            input.value = config.message;
            input.dispatchEvent(inputEv);

            setTimeout(() => {
                send.click();

                this._close();
            }, 1000);
        }

        /**
         * 点击立即沟通后有可能直接打开沟通页面，此时需要在当前页发招呼语
         */
        async _sayHello() {
            const content = await monitorElementGeneration('.chat-conversation>.message-content');
            const controls = await monitorElementGeneration('.chat-conversation>.message-controls');
            const mySelf = content.querySelectorAll('.chat-message .item-myself');
            // 如果有，说明该对话框发送过消息，视为已打过招呼，直接返回
            if (mySelf.length) {
                this._close();
                return
            }
            const input = controls.querySelector('.chat-editor #chat-input');
            const send = controls.querySelector('.chat-editor .btn-send');
            const inputEv = new Event('input', { bubbles: true });
            inputEv.simulated = true;
            input.innerText = config.message;
            input.dispatchEvent(inputEv);

            setTimeout(() => {
                send.click();

                this._close();
            }, 1000);
        }

        _close() {
            setTimeout(() => {
                window.close();
            }, 3000);
        }
    }

    return AutoJob;

})();
new AutoJob(config).start()
