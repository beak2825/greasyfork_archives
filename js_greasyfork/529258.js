// ==UserScript==
// @name         来个OC-城市省份筛选器(临时)
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  单省份选择+可拖动浮窗（适配givemeoc）
// @author       EarthDev
// @match        *://givemeoc.com/*
// @icon         https://www.google.com/s2/favicons?domain=givemeoc.com
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/529258/%E6%9D%A5%E4%B8%AAOC-%E5%9F%8E%E5%B8%82%E7%9C%81%E4%BB%BD%E7%AD%9B%E9%80%89%E5%99%A8%28%E4%B8%B4%E6%97%B6%29.user.js
// @updateURL https://update.greasyfork.org/scripts/529258/%E6%9D%A5%E4%B8%AAOC-%E5%9F%8E%E5%B8%82%E7%9C%81%E4%BB%BD%E7%AD%9B%E9%80%89%E5%99%A8%28%E4%B8%B4%E6%97%B6%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 完整省份数据
    const provinceData = {
        "北京": ["北京"],
        "天津": ["天津"],
        "上海": ["上海"],
        "重庆": ["重庆"],
        "香港": ["香港"],
        "澳门": ["澳门"],
        "台湾": ["台北", "高雄", "台中", "台南", "新北", "基隆", "桃园", "新竹", "嘉义"],
        "新疆": ["乌鲁木齐", "克拉玛依", "吐鲁番", "哈密", "阿克苏", "喀什", "和田", "昌吉", "博尔塔拉", "巴音郭楞", "克孜勒苏", "伊犁", "塔城", "阿勒泰"],
        "宁夏": ["银川", "石嘴山", "吴忠", "固原", "中卫"],
        "内蒙古": ["呼和浩特", "包头", "乌海", "赤峰", "通辽", "鄂尔多斯", "呼伦贝尔", "巴彦淖尔", "乌兰察布", "兴安", "锡林郭勒", "阿拉善"],
        "西藏": ["拉萨", "日喀则", "昌都", "林芝", "山南", "那曲", "阿里"],
        "广西": ["南宁", "柳州", "桂林", "梧州", "北海", "防城港", "钦州", "贵港", "玉林", "百色", "贺州", "河池", "来宾", "崇左"],
        "黑龙江": ["哈尔滨", "齐齐哈尔", "鸡西", "鹤岗", "双鸭山", "大庆", "伊春", "佳木斯", "七台河", "牡丹江", "黑河", "绥化", "大兴安岭"],
        "吉林": ["长春", "吉林", "四平", "辽源", "通化", "白山", "松原", "白城", "延边"],
        "辽宁": ["沈阳", "大连", "鞍山", "抚顺", "本溪", "丹东", "锦州", "营口", "阜新", "辽阳", "盘锦", "铁岭", "朝阳", "葫芦岛"],
        "河北": ["石家庄", "唐山", "秦皇岛", "邯郸", "邢台", "保定", "张家口", "承德", "沧州", "廊坊", "衡水"],
        "河南": ["郑州", "开封", "洛阳", "平顶山", "安阳", "鹤壁", "新乡", "焦作", "濮阳", "许昌", "漯河", "三门峡", "南阳", "商丘", "信阳", "周口", "驻马店", "济源"],
        "山东": ["济南", "青岛", "淄博", "枣庄", "东营", "烟台", "潍坊", "济宁", "泰安", "威海", "日照", "临沂", "德州", "聊城", "滨州", "菏泽"],
        "山西": ["太原", "大同", "阳泉", "长治", "晋城", "朔州", "晋中", "运城", "忻州", "临汾", "吕梁"],
        "陕西": ["西安", "铜川", "宝鸡", "咸阳", "渭南", "延安", "汉中", "榆林", "安康", "商洛"],
        "甘肃": ["兰州", "嘉峪关", "金昌", "白银", "天水", "武威", "张掖", "平凉", "酒泉", "庆阳", "定西", "陇南", "临夏", "甘南"],
        "青海": ["西宁", "海东", "海北", "黄南", "海南", "果洛", "玉树", "海西"],
        "四川": ["成都", "自贡", "攀枝花", "泸州", "德阳", "绵阳", "广元", "遂宁", "内江", "乐山", "南充", "眉山", "宜宾", "广安", "达州", "雅安", "巴中", "资阳", "阿坝", "甘孜", "凉山"],
        "湖北": ["武汉", "黄石", "十堰", "宜昌", "襄阳", "鄂州", "荆门", "孝感", "荆州", "黄冈", "咸宁", "随州", "恩施", "仙桃", "潜江", "天门", "神农架"],
        "湖南": ["长沙", "株洲", "湘潭", "衡阳", "邵阳", "岳阳", "常德", "张家界", "益阳", "郴州", "永州", "怀化", "娄底", "湘西"],
        "江苏": ["南京", "无锡", "徐州", "常州", "苏州", "南通", "连云港", "淮安", "盐城", "扬州", "镇江", "泰州", "宿迁"],
        "浙江": ["杭州", "宁波", "温州", "嘉兴", "湖州", "绍兴", "金华", "衢州", "舟山", "台州", "丽水"],
        "安徽": ["合肥", "芜湖", "蚌埠", "淮南", "马鞍山", "淮北", "铜陵", "安庆", "黄山", "滁州", "阜阳", "宿州", "六安", "亳州", "池州", "宣城"],
        "福建": ["福州", "厦门", "莆田", "三明", "泉州", "漳州", "南平", "龙岩", "宁德"],
        "江西": ["南昌", "景德镇", "萍乡", "九江", "新余", "鹰潭", "赣州", "吉安", "宜春", "抚州", "上饶"],
        "贵州": ["贵阳", "六盘水", "遵义", "安顺", "毕节", "铜仁", "黔西南", "黔东南", "黔南"],
        "云南": ["昆明", "曲靖", "玉溪", "保山", "昭通", "丽江", "普洱", "临沧", "楚雄", "红河", "文山", "西双版纳", "大理", "德宏", "怒江", "迪庆"],
        "广东": ["广州", "韶关", "深圳", "珠海", "汕头", "佛山", "江门", "湛江", "茂名", "肇庆", "惠州", "梅州", "汕尾", "河源", "阳江", "清远", "东莞", "中山", "潮州", "揭阳", "云浮"],
        "海南": ["海口", "三亚", "三沙", "儋州", "五指山", "琼海", "文昌", "万宁", "东方", "定安", "屯昌", "澄迈", "临高", "白沙", "昌江", "乐东", "陵水", "保亭", "琼中"]
    };

    // 样式注入
    GM_addStyle(`
        .province-filter-container {
            position: absolute;
            background: #fff;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
            z-index: 2147483647;
            border: 1px solid #ddd;
            cursor: move;
            user-select: none;
            min-width: 200px;
            max-height: 80vh;
            overflow: auto;
        }
        .filter-header {
            background: #409eff;
            color: white;
            padding: 8px;
            border-radius: 8px 8px 0 0;
            position: sticky;
            top: 0;
        }
        #provinceFilter {
            padding: 10px;
            width: 100%;
            border: none;
        }
        #provinceFilter option {
            padding: 5px 10px;
        }
        #provinceFilter option:hover {
            background: #f5f7fa;
        }
    `);

    // 创建可拖动容器
    function createDraggableContainer() {
        const container = document.createElement('div');
        container.className = 'province-filter-container';
        container.innerHTML = `
            <div class="filter-header">省份筛选（可多选）</div>
            <select id="provinceFilter" multiple size="15">
                ${Object.keys(provinceData).map(p => `<option value="${p}">${p}</option>`).join('')}
            </select>
        `;

        // 初始位置
        container.style.left = '20px';
        container.style.top = '20px';

        // 添加拖动功能
        let isDragging = false;
        let offsetX = 0, offsetY = 0;

        container.querySelector('.filter-header').addEventListener('mousedown', startDrag);
        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', stopDrag);

        function startDrag(e) {
            isDragging = true;
            const rect = container.getBoundingClientRect();
            offsetX = e.clientX - rect.left;
            offsetY = e.clientY - rect.top;
        }

        function drag(e) {
            if (!isDragging) return;
            container.style.left = `${e.clientX - offsetX}px`;
            container.style.top = `${e.clientY - offsetY}px`;
        }

        function stopDrag() {
            isDragging = false;
        }

        document.body.appendChild(container);
        return container;
    }

    // 核心筛选逻辑
    function filterProvince() {
        const selectedProvinces = Array.from(
            document.querySelectorAll('#provinceFilter option:checked')
        ).map(o => o.value);

        document.querySelectorAll('tbody tr.el-table__row').forEach(row => {
            const cityCell = row.querySelector('td.el-table_1_column_3 .cell');
            if (!cityCell) return;

            // 处理多城市情况（如："上海 南京 苏州 深圳"）
            const cityText = cityCell.textContent.trim();
            const cities = cityText.split(/\s+/);

            // 检查是否有任一城市属于选中省份
            const shouldShow = selectedProvinces.length === 0 ||
                cities.some(city => {
                    const province = findProvinceByCity(city);
                    return selectedProvinces.includes(province);
                });

            row.style.display = shouldShow ? '' : 'none';
        });
    }

    // 查找省份函数（增强版）
    function findProvinceByCity(cityName) {
        // 清洗数据：去除"市"后缀，处理特殊格式（如"广东惠州"）
        const cleanCity = cityName
            .replace(/市$/, '')
            .replace(/^.*?(?=\D+$)/, '') // 处理"广东惠州"类格式
            .trim();

        for (const [province, cities] of Object.entries(provinceData)) {
            if (cities.includes(cleanCity)) return province;
        }
        return '未知';
    }

    // 初始化
    function init() {
        const container = createDraggableContainer();
        const select = container.querySelector('#provinceFilter');

        select.addEventListener('change', filterProvince);

        // 添加全选提示
        const header = container.querySelector('.filter-header');
        header.innerHTML += '<div style="font-size:12px;margin-top:3px">（Ctrl+点击多选）</div>';

        // 初始筛选
        filterProvince();
    }

    // 启动逻辑
    const checkExist = setInterval(() => {
        if (document.querySelector('tbody tr.el-table__row')) {
            clearInterval(checkExist);
            init();

            // 添加动态内容监听
            new MutationObserver(() => filterProvince())
                .observe(document.querySelector('tbody'), {
                    childList: true,
                    subtree: true
                });
        }
    }, 500);
})();