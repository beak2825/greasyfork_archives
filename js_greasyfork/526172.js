// ==UserScript==
// @name         问卷星脚本
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  在问卷星问卷的右上角显示题目数量以及各题型的数量，增强版
// @author       QY
// @match        https://www.wjx.cn/vm/*
// @match        https://www.wjx.cn/vj/*
// @match        https://ks.wjx.top/*
// @match        https://ww.wjx.top/*
// @match        https://w.wjx.top/*
// @match        https://*.wjx.top/*
// @match        https://*.wjx.cn/vm/*
// @match        https://*.wjx.cn/vj/*
// @match        https://*.wjx.com/vm/*
// @grant        none
// @icon         https://image.wjx.com/images/wlogo.png
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/526172/%E9%97%AE%E5%8D%B7%E6%98%9F%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/526172/%E9%97%AE%E5%8D%B7%E6%98%9F%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==
// ==/UserScript==
// ==/UserScript==

(function() {
    'use strict';

    window.addEventListener('load', function() {
        checkCityNamesInTitle();  // 检测问卷标题中的城市或地区名称
        var stats = getQuestionStats();
        var pricing = calculatePricing(stats);
        displayInfoInCorner(stats, pricing);
        checkForPagination(); // 检查是否存在分页
        highlightFillInQuestions(); // 高亮填空题
        highlightShortAnswerQuestions(); // 高亮简答题
        highlightMultipleFillInQuestions(); // 高亮多项填空题
        highlightJumpQuestions(); // 高亮显示跳题信息
        highlightRelatedQuestions(); // 高亮显示关联题信息
        addQuestionNumbers(); // 在每个题目前面标注题号
    });

    function checkCityNamesInTitle() {
        const cityNames = [
            "北京", "上海", "广州", "深圳", "杭州", "南京", "苏州", "天津", "重庆","北京", "上海", "广州", "深圳", "杭州", "南京", "苏州", "天津", "重庆", "武汉", "西安", "成都", "郑州", "青岛", "长沙", "东莞", "佛山", "厦门", "合肥", "福州", "哈尔滨", "昆明", "南宁", "南昌", "贵阳", "兰州", "海口", "石家庄", "太原", "沈阳", "长春", "乌鲁木齐", "拉萨", "银川", "呼和浩特", "大连", "宁波", "温州", "珠海", "汕头", "湛江", "茂名", "中山", "江门", "肇庆", "清远", "韶关", "云浮", "汕尾", "惠州", "阳江", "梅州", "台州", "绍兴", "金华", "衢州", "丽水", "舟山", "南通", "扬州", "镇江", "泰州", "宿迁", "连云港", "淮安", "盐城", "徐州", "常州", "无锡", "娄底", "邵阳", "郴州", "岳阳", "张家界", "常德", "益阳", "怀化", "永州", "黔东南", "铜仁", "吉安", "抚州", "上饶", "景德镇", "鹰潭", "赣州", "萍乡", "新余", "连云港", "乌鲁木齐", "阿克苏", "克拉玛依", "吐鲁番", "哈密", "昌吉", "博乐", "石河子", "三亚", "东方", "琼海", "文昌", "万宁", "定安", "屯昌", "澄迈", "临高", "齐齐哈尔", "牡丹江", "大庆", "佳木斯", "鸡西", "双鸭山", "黑河", "宝鸡", "咸阳", "渭南", "商洛", "安康", "汉中", "榆林", "铜川", "延安", "阿拉善", "乌兰察布", "赤峰", "通辽", "呼伦贝尔", "巴彦淖尔", "鄂尔多斯", "日喀则", "林芝", "昌都", "山南", "那曲", "阿里", "德阳", "绵阳", "广元", "遂宁", "内江", "乐山", "自贡", "攀枝花", "眉山", "潍坊", "临沂", "济宁", "泰安", "枣庄", "日照", "菏泽", "聊城", "滨州", "德州", "烟台", "威海", "淄博", "东营", "滕州", "莱芜", "南昌", "景德镇", "鹰潭", "上饶", "赣州", "萍乡", "新余", "吉安", "抚州", "广安", "达州", "巴中", "自贡", "宜宾", "泸州", "遂宁", "内江", "乐山", "广元", "绵阳", "德阳", "阳江", "清远", "韶关", "湛江", "揭阳", "云浮", "江门", "中山", "佛山", "广州", "深圳", "珠海", "东莞", "汕头", "揭阳", "梅州", "汕尾", "惠州", "茂名", "潍坊", "临沂", "济宁", "泰安", "枣庄", "聊城", "滨州", "菏泽", "德州", "烟台", "威海", "淄博", "济南", "东营", "日照", "莱芜", "扬州", "镇江", "常州", "无锡", "南京", "苏州", "南通", "盐城", "宿迁", "连云港", "淮安", "徐州", "湖州", "嘉兴", "绍兴", "金华", "台州", "丽水", "衢州", "舟山", "宁波市", "温州市", "嘉兴市", "湖州市", "绍兴市", "金华市", "台州市", "丽水市", "衢州市", "舟山市", "昆明市", "大理", "曲靖", "玉溪", "保山", "昭通", "临沧", "丽江", "楚雄", "昭通", "玉溪", "丽江", "大理", "保山", "临沧", "曲靖", "金华", "衢州", "舟山", "温州", "台州", "绍兴", "嘉兴", "湖州", "丽水", "宁波", "西安", "宝鸡", "咸阳", "铜川", "渭南", "商洛", "汉中", "安康", "榆林", "延安", "白银", "张掖", "金昌", "酒泉", "兰州", "天水", "定西", "陇南", "平凉", "庆阳", "临夏", "甘南", "西宁", "海东", "海北", "黄南", "海南", "果洛", "玉树", "阿克苏", "喀什", "克拉玛依", "吐鲁番", "哈密", "昌吉", "博乐", "塔城", "阿勒泰", "石河子", "昌吉", "博乐", "奎屯", "温宿", "阿克苏", "阿拉尔", "库尔勒", "阿图什", "喀什", "和田", "阿克苏", "乌鲁木齐", "阿拉尔", "喀什", "和田", "阿克苏", "石河子", "广州", "珠海", "汕头", "韶关", "清远", "东莞", "中山", "江门", "佛山", "惠州", "梅州", "汕尾", "揭阳", "云浮", "阳江", "茂名", "湛江", "江门", "中山", "温州", "宁波", "台州", "绍兴", "金华", "舟山", "丽水", "衢州", "嘉兴", "湖州", "兰州", "金昌", "白银", "天水", "酒泉", "张掖", "武威", "陇南", "定西", "平凉", "庆阳", "临夏", "甘南", "青海", "海东", "海北", "黄南", "海南", "果洛", "玉树", "阿克苏", "喀什", "克拉玛依", "吐鲁番", "哈密", "昌吉", "博乐", "塔城", "阿勒泰", "乌鲁木齐", "阿拉尔", "库尔勒", "昌吉", "克拉玛依", "吐鲁番", "哈密", "石河子", "金华", "衢州", "舟山", "温州", "台州", "绍兴", "嘉兴", "湖州", "丽水", "宁波", "武汉", "襄阳", "黄石", "十堰", "荆州", "宜昌", "随州", "恩施", "荆门", "咸宁", "鄂州", "黄冈", "孝感", "咸宁", "随州", "恩施", "宜昌", "十堰", "荆州", "武汉", "漳州", "泉州", "福州", "莆田", "宁德", "南平", "三明", "龙岩", "永安", "漳平", "厦门", "福州", "泉州", "漳州", "莆田", "三明", "宁德", "南平", "龙岩", "永安", "赣州", "萍乡", "上饶", "景德镇", "鹰潭", "新余", "吉安", "抚州", "南昌", "九江", "贵阳", "遵义", "安顺", "毕节", "六盘水", "铜仁", "黔南", "黔东南", "黔西南", "凯里", "温州", "宁波", "台州", "绍兴", "金华", "衢州", "舟山", "丽水", "嘉兴", "湖州", "沈阳", "大连", "鞍山", "抚顺", "本溪", "丹东", "锦州", "营口", "阜新", "辽阳", "铁岭", "朝阳", "盘锦", "葫芦岛", "长春", "吉林", "四平", "辽源", "通化", "白山", "松原", "白城", "延边", "哈尔滨", "齐齐哈尔", "大庆", "鸡西", "牡丹江", "佳木斯", "双鸭山", "黑河", "大兴安岭", "伊春", "鹤岗", "七台河", "双鸭山", "伊春", "大庆", "三明", "漳州", "厦门", "泉州", "福州", "宁德", "南平", "莆田", "龙岩", "永安", "漳平", "龙岩", "漳州", "福州", "泉州", "三明", "莆田", "宁德", "南平", "厦门", "太原", "大同", "阳泉", "长治", "晋城", "朔州", "晋中", "运城", "临汾", "吕梁", "呼和浩特", "包头", "乌海", "赤峰", "通辽", "鄂尔多斯", "巴彦淖尔", "乌兰察布", "阿拉善", "长春", "吉林", "四平", "辽源", "通化", "白山", "松原", "白城", "延边", "大庆", "贵阳", "遵义", "安顺", "六盘水", "毕节", "铜仁", "黔东南", "黔南", "黔西南", "凯里", "南昌", "景德镇", "上饶", "赣州", "萍乡", "鹰潭", "新余", "吉安", "抚州", "九江", "合肥", "芜湖", "马鞍山", "铜陵", "安庆", "黄山", "滁州", "淮南", "淮北", "宿州", "蚌埠", "池州", "六安", "亳州", "宣城", "阜阳", "滁州", "宿州", "蚌埠", "芜湖", "广州", "深圳", "珠海", "汕头", "韶关", "清远", "东莞", "中山", "江门", "佛山", "惠州", "梅州", "汕尾", "揭阳", "云浮", "阳江", "茂名", "湛江", "江门", "中山", "温州", "宁波", "台州", "绍兴", "金华", "舟山", "丽水", "衢州", "嘉兴", "湖州", "兰州", "金昌", "白银", "天水", "酒泉", "张掖", "武威", "陇南", "定西", "平凉", "庆阳", "临夏", "甘南", "青海", "海东", "海北", "黄南", "海南", "果洛", "玉树", "阿克苏", "喀什", "克拉玛依", "吐鲁番", "哈密", "昌吉", "博乐", "塔城", "阿勒泰", "乌鲁木齐", "阿拉尔", "库尔勒", "昌吉", "克拉玛依", "吐鲁番", "哈密", "石河子", "广州", "珠海", "汕头", "韶关", "清远", "东莞", "中山", "江门", "佛山", "惠州", "梅州", "汕尾", "揭阳", "云浮", "阳江", "茂名", "湛江", "江门", "中山", "北京", "上海", "武汉", "西安", "合肥", "沈阳", "天津", "重庆", "南京", "青岛", "石家庄", "长春", "哈尔滨", "南昌", "福州", "成都", "厦门", "苏州", "东莞", "深圳", "绍兴", "温州", "宁波", "昆明", "大连", "珠海", "济宁", "贵阳", "南宁", "长沙", "海口", "大理", "柳州", "遵义", "铜仁", "毕节", "六盘水", "凯里", "张家口", "包头", "襄阳", "安庆", "池州", "蚌埠", "黄山", "淮南", "马鞍山", "滁州", "淮北", "亳州", "宿州", "阜阳", "淮安", "无锡", "常州", "扬州", "镇江", "徐州", "盐城", "宿迁", "南通", "泰州", "连云港", "青岛", "日照", "威海", "烟台", "济宁", "潍坊", "临沂", "枣庄", "聊城", "滨州", "德州", "菏泽", "泰安", "枣庄", "临沂", "聊城", "日照", "菏泽", "济宁", "杭州", "宁波", "绍兴", "金华", "台州", "衢州", "丽水", "舟山", "嘉兴", "湖州", "石家庄", "唐山", "保定", "邯郸", "邢台", "承德", "沧州", "廊坊", "衡水", "秦皇岛", "廊坊", "衡水", "邢台", "邯郸", "承德", "沧州", "秦皇岛", "唐山", "保定", "石家庄", "拉萨", "昌都", "山南", "林芝", "那曲", "阿里", "日喀则", "西藏", "拉萨", "林芝", "乌鲁木齐", "克拉玛依", "哈密", "吐鲁番", "阿克苏", "昌吉", "博乐", "塔城", "阿勒泰", "石河子", "库尔勒", "喀什", "阿拉尔", "阿图什", "和田", "巴音郭楞", "吐鲁番", "哈密", "贵阳", "遵义", "安顺", "毕节", "六盘水", "铜仁", "黔东南", "黔西南", "黔南", "凯里", "武汉", "宜昌", "襄阳", "黄石", "十堰", "荆州", "孝感", "黄冈", "咸宁", "恩施", "荆门", "随州", "鄂州", "咸宁", "随州", "恩施", "宜昌", "十堰", "荆州", "武汉", "大连", "鞍山", "抚顺", "本溪", "丹东", "锦州", "营口", "阜新", "辽阳", "铁岭", "朝阳", "盘锦", "葫芦岛", "长春", "吉林", "四平", "辽源", "通化", "白山", "松原", "白城", "延边", "哈尔滨", "齐齐哈尔", "大庆", "鸡西", "牡丹江", "佳木斯", "双鸭山", "黑河", "大兴安岭", "伊春", "鹤岗", "七台河", "双鸭山", "伊春", "大庆", "郑州", "开封", "洛阳", "平顶山", "安阳", "鹤壁", "新乡", "焦作", "濮阳", "许昌", "漯河", "三门峡", "南阳", "商丘", "信阳", "周口", "驻马店", "济源", "合肥", "芜湖", "马鞍山", "铜陵", "安庆", "黄山", "滁州", "淮南", "淮北", "宿州", "蚌埠", "池州", "六安", "亳州", "宣城", "阜阳", "滁州", "宿州", "蚌埠", "芜湖","省", "市", "区", "县", "自治州", "街道", "村", "社区", "自治", "黔", "大湾区", "香港", "澳门", "长三角", "华东","华北","东北","西北","华中","华男","西部","马来西亚","日本",
            "武汉", "西安", "成都", "郑州", "青岛", "长沙", "东莞", "佛山", "厦门",
            "合肥", "福州", "哈尔滨", "昆明", "南宁", "南昌", "贵阳", "兰州", "海口",
            "石家庄", "太原", "沈阳", "长春", "乌鲁木齐", "拉萨", "银川", "呼和浩特"
        ];

        const cityRegex = new RegExp(cityNames.join("|"), "g");
        const titleElement = document.querySelector('#htitle');
        const titleText = titleElement ? titleElement.innerText : '';

        if (cityRegex.test(titleText)) {
            const notification = document.createElement('div');
            notification.textContent = '标题中包含城市/县城/区名称。若需要指定ip，起步报价为1元/份';
            notification.style.position = 'relative';
            notification.style.width = '100%'; // 与标题等宽
            notification.style.backgroundColor = 'yellow';
            notification.style.color = '#000000';
            notification.style.textAlign = 'center';
            notification.style.padding = '8px';
            notification.style.boxShadow = '0 2px 3px rgba(0,0,0,0.2)';
            notification.style.marginTop = '10px'; // 确保提示框与标题有一定的间距

            // 插入到标题元素之后
            titleElement.parentNode.insertBefore(notification, titleElement.nextSibling);
        }
    }

    function getQuestionStats() {
        var totalQuestions = 0;
        var matrixQuestions = 0;
        var matrixSubQuestions = 0;
        var hasScale = false;
        var hasFillIn = false;
        var hasShortAnswer = false;
        var stats = {};
        var lastQuestionOptions = [];
        var sameOptionsCount = 0;

        for (let i = 1; i <= 13; i++) {
            stats[i] = 0;
        }

        var allElements = document.querySelectorAll('fieldset, div.field');
        var questionElements = Array.from(allElements).filter(function(element) {
            return element.querySelector('.topicnumber') || element.querySelector('.topichtml');
        });

        totalQuestions = questionElements.length - 1;

        questionElements.forEach(function(element, index) {
            var type = parseInt(element.getAttribute('type'), 10);
            var options = Array.from(element.querySelectorAll('.label')).map(opt => opt.innerText.trim());
            if (type === 6) {
                matrixQuestions += 1;
                var subQuestions = element.querySelectorAll('tr[tp="d"]').length;
                matrixSubQuestions += subQuestions;
            } else {
                stats[type]++;
                if (index > 1 && options.join(',') === lastQuestionOptions.join(',')) {
                    sameOptionsCount++;
                    if (sameOptionsCount >= 3) {
                        hasScale = true;
                    }
                } else {
                    sameOptionsCount = 1;
                }
                lastQuestionOptions = options;
            }
            if (type === 1) hasFillIn = true;
            if (type === 2) hasShortAnswer = true;
        });

        var adjustedTotalQuestions = totalQuestions - matrixQuestions + matrixSubQuestions;

        return {
            total: adjustedTotalQuestions,
            hasMatrix: matrixQuestions > 0,
            matrixQuestions: matrixQuestions,
            matrixSubQuestions: matrixSubQuestions,
            hasScale: hasScale,
            hasFillIn: hasFillIn,
            hasShortAnswer: hasShortAnswer,
            ...stats
        };
    }

    function calculatePricing(stats) {
        var basePrice = 0;
        var scaleOrMatrixPrice = 0;

        if (stats.total > 40) {
            return "问卷超40题，需人工报价";
        } else if (stats.total <= 30) {
            basePrice = 0.2;
            scaleOrMatrixPrice = 0.4;
        } else if (stats.total <= 35) {
            basePrice = 0.25;
            scaleOrMatrixPrice = 0.5;
        } else if (stats.total <= 40) {
            basePrice = 0.3;
            scaleOrMatrixPrice = 0.6;
        }

        var note = "";
        if (stats.hasFillIn || stats.hasShortAnswer) {
            note += "<span style='color:red;'>注意！此问卷有填空题<br>人工判断是否为建议题,如果是，客户想填就得加钱</span><br>";
        }
        if (stats.hasScale) {
            note += "疑似有未识别量表题，请人工核对";
        }

        if (stats.hasMatrix || stats.hasScale) {
            return {
                base: `${basePrice.toFixed(2)}`,
                scaleOrMatrix: `${scaleOrMatrixPrice.toFixed(2)}`,
                note: note
            };
        } else {
            return {
                base: `${basePrice.toFixed(2)}`,
                note: note
            };
        }
    }

    function displayInfoInCorner(stats, pricing) {
        var infoElement = document.createElement('div');
        infoElement.style.position = 'fixed';
        infoElement.style.top = '10px';
        infoElement.style.right = '10px';
        infoElement.style.zIndex = '9999';
        infoElement.style.display = 'block';
        infoElement.style.border = '2px solid blue';
        infoElement.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
        infoElement.style.color = '#000000';
        infoElement.style.padding = '10px';
        infoElement.style.fontWeight = 'bold';
        infoElement.style.borderRadius = '12px';
        infoElement.style.fontSize = '14px';
        infoElement.style.maxWidth = '220px';
        infoElement.style.wordBreak = 'break-all';

        // 题目总数量
        var totalQuestionsDiv = document.createElement('div');
        totalQuestionsDiv.innerHTML = `总题目数量: ${stats.total}`;
        totalQuestionsDiv.style.fontSize = '16px'; // 字体大一些
        infoElement.appendChild(totalQuestionsDiv);

        // 题型明细
        var detailList = document.createElement('ul');
        detailList.style.margin = '0';
        detailList.style.paddingLeft = '20px';
        detailList.style.listStyleType = 'disc';

        for (let i = 1; i <= 13; i++) {
            let listItemText;
            switch (i) {
                case 1:
                    listItemText = `填空题: ${stats[i]}`;
                    break;
                case 2:
                    listItemText = `简答题: ${stats[i]}`;
                    break;
                case 3:
                    listItemText = `单选题: ${stats[i]}`;
                    break;
                case 4:
                    listItemText = `多选题: ${stats[i]}`;
                    break;
                case 5:
                    listItemText = `量表题: ${stats[i]}`;
                    break;
                case 6:
                    listItemText = `矩阵题: ${stats.matrixQuestions} (${stats.matrixSubQuestions} 子问题)`;
                    break;
                case 7:
                    listItemText = `下拉题: ${stats[i]}`;
                    break;
                case 8:
                    listItemText = `滑动条题: ${stats[i]}`;
                    break;
                case 9:
                    listItemText = `多项填空题: ${stats[i]}`;
                    break;
                case 10:
                    listItemText = `矩阵填空: ${stats[i]}`;
                    break;
                case 11:
                    listItemText = `排序题: ${stats[i]}`;
                    break;
                case 12:
                    listItemText = `比重题: ${stats[i]}`;
                    break;
                case 13:
                    listItemText = `文件上传题: ${stats[i]}`;
                    break;
                default:
                    continue;
            }

            if (stats[i] > 0 || (i === 6 && stats.matrixQuestions > 0)) {
                var listItem = document.createElement('li');
                if ([1, 2, 5, 6, 9].includes(i)) { // 填空题、简答题、量表题、矩阵题、多项填空题、矩阵填空
                    listItem.innerHTML = `<span style="color:red;">${listItemText}</span>`;
                } else {
                    listItem.textContent = listItemText;
                }
                detailList.appendChild(listItem);
            }
        }

        infoElement.appendChild(detailList);

        // 报价信息*该功能已注释掉！
        var pricingDiv = document.createElement('div');
        if (typeof pricing === 'string') {
            pricingDiv.innerHTML = pricing;
        } else {
            var pricingBaseDiv = document.createElement('div');
          //  pricingBaseDiv.innerHTML = `<strong>普通问卷:</strong> ${pricing.base}/份`;

            var pricingScaleOrMatrixDiv = null;
            if (pricing.scaleOrMatrix) {
                pricingScaleOrMatrixDiv = document.createElement('div');
             //   pricingScaleOrMatrixDiv.innerHTML = `<strong>包信效度:</strong> ${pricing.scaleOrMatrix}/份`;
            }

            var pricingNoteDiv = null;
            if (pricing.note) {
                pricingNoteDiv = document.createElement('div');
                pricingNoteDiv.style.fontSize = '12px';
                pricingNoteDiv.style.fontWeight = 'normal';
                pricingNoteDiv.innerHTML = pricing.note;
            }

            // 复制按钮*该功能已注释掉！
            var copyButton = document.createElement('button');
            //copyButton.style.marginTop = '10px';
            //copyButton.style.padding = '5px 10px';
            //copyButton.style.cursor = 'pointer';
            //copyButton.style.backgroundColor = '#007bff';
            //copyButton.style.color = '#ffffff';
            //copyButton.style.border = 'none';
            //copyButton.style.borderRadius = '5px';
            //copyButton.textContent = '复制报价';

            copyButton.addEventListener('click', function() {
                let textToCopy;
                if (pricing.scaleOrMatrix) {
               //     textToCopy = `包信效度${pricing.scaleOrMatrix}一份，普通问卷${pricing.base}元一份。普通问卷不包信效度（填空写无或不写，写填空需加钱，没填空请忽略），50份起拍。您要哪一种要多少份，亲（默认答题IP为全国的，如限制某地另行询价）。`;
                } else {
               //     textToCopy = `您的问卷${pricing.base}一份，（填空写无或不写，写填空需加钱，没填空请忽略），50份起拍。请问您需要多少份，亲。（默认答题IP为全国的，如限制某地另行询价）。`;
                }

                navigator.clipboard.writeText(textToCopy).then(() => {
                    alert('报价已复制到剪贴板！');
                }).catch(err => {
                    console.error('无法复制文本: ', err);
                });
            });

            // 前往填空按钮
            var goToFillInButton = document.createElement('button');
            goToFillInButton.style.marginTop = '10px';
            goToFillInButton.style.marginLeft = '10px';
            goToFillInButton.style.padding = '5px 10px';
            goToFillInButton.style.cursor = 'pointer';
            goToFillInButton.style.backgroundColor = '#28a745';//背景色*墨绿
            goToFillInButton.style.color = '#ffffff';//字体颜色
            goToFillInButton.style.border = 'none';
            goToFillInButton.style.borderRadius = '5px';
            goToFillInButton.textContent = '查看填空';

            var fillInQuestions = document.querySelectorAll('div.field[type="1"], div.field[type="9"], div.field[type="2"], div.field[type="5"], div.field[type="6"]');
            var currentFillInIndex = 0;

            if (fillInQuestions.length > 0) {
                pricingDiv.appendChild(pricingBaseDiv);
                if (pricing.scaleOrMatrix) pricingDiv.appendChild(pricingScaleOrMatrixDiv);
                if (pricing.note) pricingDiv.appendChild(pricingNoteDiv);
                pricingDiv.appendChild(copyButton);
                pricingDiv.appendChild(goToFillInButton);

                goToFillInButton.addEventListener('click', function() {
                    fillInQuestions[currentFillInIndex].scrollIntoView({ behavior: 'smooth' });
                    currentFillInIndex = (currentFillInIndex + 1) % fillInQuestions.length;
                });
            } else {
                pricingDiv.appendChild(pricingBaseDiv);
                if (pricing.scaleOrMatrix) pricingDiv.appendChild(pricingScaleOrMatrixDiv);
                if (pricing.note) pricingDiv.appendChild(pricingNoteDiv);
                pricingDiv.appendChild(copyButton);
            }
        }

        infoElement.appendChild(pricingDiv);

        document.body.appendChild(infoElement);
    }

    // 展开分页问卷
    function expandPage() {
        // 检查是否存在分页并展开
        $('.fieldset').css('display', 'block');
        $('#divSubmit').css('display', 'block');
        $('#divMultiPage').css('display', 'none');
    }

    // 创建提示框
    function createNotification() {
        var notification = document.createElement('div');
        notification.textContent = '检测到问卷有分页，已自动为您展开';
        notification.style.position = 'fixed';
        notification.style.top = '0';
        notification.style.left = '0';
        notification.style.width = '80%';
        notification.style.backgroundColor = 'red';
        notification.style.color = 'white';
        notification.style.textAlign = 'center';
        notification.style.padding = '8px';
        notification.style.boxShadow = '0 2px 3px rgba(0,0,0,0.2)';
        notification.style.zIndex = '9999';
        document.body.appendChild(notification);

        // 1.5秒后移除提示框
        setTimeout(function() {
            notification.remove();
        }, 1500);
    }

    // 检查是否存在分页
    function checkForPagination() {
        var hasPagination = $('#divMultiPage').length > 0;
        if (hasPagination) {
            expandPage();
            createNotification(); // 创建提示框
        }
    }

    // 高亮填空题
    function highlightFillInQuestions() {
        var fillInQuestions = document.querySelectorAll('div.field[type="1"]');
        fillInQuestions.forEach(function(question) {
            var topicHtmlElement = question.querySelector('.topichtml');
            if (topicHtmlElement) {
                topicHtmlElement.style.color = 'red';//标题颜色
                topicHtmlElement.style.fontSize = '18px';
                topicHtmlElement.style.fontWeight = 'bold';
                // 添加提示信息
                var hintText = document.createElement('span');
                hintText.innerHTML = '(请看下这个填空是否需要填写建议，如果客户想写建议，需要告知需要加钱)';
                hintText.style.fontSize = '14px';
                hintText.style.fontWeight = 'normal';
                hintText.style.color = '#000000';//字体颜色*黑色
                hintText.style.backgroundColor = 'yellow';//背景色
                hintText.style.display = 'inline-block';
                hintText.style.padding = '4px 8px';
                hintText.style.borderRadius = '4px';
                hintText.style.marginTop = '5px';
                hintText.style.marginBottom = '5px';
                topicHtmlElement.parentNode.insertBefore(hintText, topicHtmlElement.nextSibling);
            }
        });
    }

    // 高亮简答题
    function highlightShortAnswerQuestions() {
        var shortAnswerQuestions = document.querySelectorAll('div.field[type="2"]');
        shortAnswerQuestions.forEach(function(question) {
            var topicHtmlElement = question.querySelector('.topichtml');
            if (topicHtmlElement) {
                topicHtmlElement.style.color = 'red';//标题颜色
                topicHtmlElement.style.fontSize = '18px';
                topicHtmlElement.style.fontWeight = 'bold';
                // 添加提示信息
                var hintText = document.createElement('span');
                hintText.innerHTML = '(请看下这个简答是否需要填写详细内容，如果客户想写详细内容，需要告知需要加钱)';
                hintText.style.fontSize = '14px';
                hintText.style.fontWeight = 'normal';
                hintText.style.color = '#000000';//字体颜色*黑色
                hintText.style.backgroundColor = 'yellow';//背景色
                hintText.style.display = 'inline-block';
                hintText.style.padding = '4px 8px';
                hintText.style.borderRadius = '4px';
                hintText.style.marginTop = '5px';
                hintText.style.marginBottom = '5px';
                topicHtmlElement.parentNode.insertBefore(hintText, topicHtmlElement.nextSibling);
            }
        });
    }

    // 高亮多项填空题
    function highlightMultipleFillInQuestions() {
        var multipleFillInQuestions = document.querySelectorAll('div.field[type="9"]');
        multipleFillInQuestions.forEach(function(question) {
            var topicHtmlElement = question.querySelector('.topichtml');
            if (topicHtmlElement) {
                topicHtmlElement.style.color = 'red';//标题颜色
                topicHtmlElement.style.fontSize = '18px';
                topicHtmlElement.style.fontWeight = 'bold';
                // 添加提示信息
                var hintText = document.createElement('span');
                hintText.innerHTML = '(看下这个填空需要写什么，复杂不，复杂需要加钱。看下是写建议，还是写数字，还是写什么，如果拿不准联系老板)';
                hintText.style.fontSize = '14px';
                hintText.style.fontWeight = 'normal';
                hintText.style.color = '#000000';//字体颜色*黑色
                hintText.style.backgroundColor = 'yellow';//背景色
                hintText.style.display = 'inline-block';
                hintText.style.padding = '4px 8px';
                hintText.style.borderRadius = '4px';
                hintText.style.marginTop = '5px';
                hintText.style.marginBottom = '5px';
                topicHtmlElement.parentNode.insertBefore(hintText, topicHtmlElement.nextSibling);
            }
        });
    }

    // 函数：高亮显示跳题信息
function highlightJumpQuestions() {
    const questions = document.querySelectorAll('fieldset');
    questions.forEach((question) => {
        const radios = question.querySelectorAll('input[type="radio"]');
        radios.forEach(radio => {
            if (radio.hasAttribute('jumpto')) {
                const jumpTo = radio.getAttribute('jumpto');
                const label = radio.nextElementSibling;
                if (label) {
                    if (jumpTo === "-1") {
                        label.insertAdjacentHTML('afterend', `<span style="color:blue; margin-left: 5px;">(结束问卷)</span>`);
                    } else {
                        label.insertAdjacentHTML('afterend', `<span style="color:blue; margin-left: 5px;">(跳至问题 ${jumpTo})</span>`);
                    }
                }
            }
        });
    });
}

    // 函数：高亮显示关联题信息
    function highlightRelatedQuestions() {
        const questions = document.querySelectorAll('fieldset');
        questions.forEach(question => {
            // 获取 question 的 relation 属性
            const relation = question.getAttribute('relation');
            if (relation) {
                const relations = relation.split(',');
                const labels = question.querySelectorAll('label');
                // 检查对应的前一个问题是否已经选择
                const prevQuestionId = relations[0]; // 获取依赖的第一个问题ID（以逗号分隔）
                const prevQuestion = document.getElementById(`div${prevQuestionId}`);
                const prevQuestionRadios = prevQuestion ? prevQuestion.querySelectorAll('input[type="radio"]') : [];

                // 检查依赖条件：如果第一个问题被回答，则显示相关问题
                prevQuestionRadios.forEach(radio => {
                    radio.addEventListener('change', () => {
                        if (radio.checked) {
                            // 显示相关问题
                            question.style.display = 'block';
                            // 提示用户这是关联题
                            const label = question.querySelector('.field-label');
                            if (label && !label.querySelector('.relation-hint')) {
                                label.insertAdjacentHTML('beforeend', `<span class="relation-hint" style="color: red; margin-left: 10px;">(此问题依赖于问题 ${prevQuestionId})</span>`);
                            }
                        }
                    });
                });
            }
        });
    }

    // 函数：在每个题目前面标注题号
    function addQuestionNumbers() {
        const questions = document.querySelectorAll('div.ui-field-contain');
        console.log('总共找到的题目数：', questions.length); // 调试：显示找到的题目数量

        questions.forEach((question) => {
            const questionId = question.id; // 获取 div 的 id 属性
            const questionNumber = questionId.match(/\d+/); // 提取 id 中的数字作为题号

            if (questionNumber) {
                const fieldLabel = question.querySelector('.field-label');
                const topichtml = fieldLabel ? fieldLabel.querySelector('.topichtml') : null;
                const topicNumber = fieldLabel ? fieldLabel.querySelector('.topicnumber') : null;

                // 隐藏系统设置的题号
                if (topicNumber) {
                    topicNumber.style.display = 'none'; // 隐藏题号
                }

                if (topichtml && !topichtml.innerHTML.includes(`${questionNumber[0]}.`)) {
                    // 确保没有重复的题号，避免再次添加
                    topichtml.innerHTML = `${questionNumber[0]}. ${topichtml.innerHTML}`;
                }
            } else {
                console.log(`没有找到题号（id="divX" 的 X）`, question); // 调试：查看没有提取到题号的 div
            }
        });
    }

    var English = 0;
    var testEnv = 0;
    var partPages = "";
    var isinterview = 0;
    var hideSource = 0;

    var duraTime = 0;
    var answerTime = "";
    var interviewStartTime = "";
    var nowTime = "2024-11-28 22:44:09";
    var isInterview2 = interviewStartTime ? true : false;
    var validQlist = []; //需要置空的题目列表
    var recordType = 0;
    var isactivity = 0;
    var canOpenWxTag = false;
    var saveContact = 0;
    var langVer = 0;
    var hasManuallyCutQues = 0;
    var originalSurveyTitle = "1111";

    function jumpToOld(){
        var ua = navigator.userAgent;
        if (ua.indexOf("MSIE 6.0") > 0 || ua.indexOf("MSIE 7.0") > 0 || ua.indexOf("MSIE 8.0") > 0 || ua.indexOf("MSIE 9.0") > 0) {//ie8以下
            window.location.href = window.location.href.replace("/m/", "/jq/").replace("/vm/", "/vj/");
        }
    }
})();



