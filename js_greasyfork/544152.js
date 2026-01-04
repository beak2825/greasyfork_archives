// ==UserScript==
// @name         接待电子流信息管理—OWN
// @namespace    接待电子流信息管理—OWN
// @version      8.5
// @description  重构接待电子流数据提取
// @match        https://ibpm.h3c.com/bpm/rule?wf_num=R_S003_B036*
// @match        https://ibpm.h3c.com/bpm/r?wf_num=V_h3c31N025_E001*
// @grant        GM_xmlhttpRequest
// @connect      api.notion.com
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @license      GPL-3.0 License
// @downloadURL https://update.greasyfork.org/scripts/544152/%E6%8E%A5%E5%BE%85%E7%94%B5%E5%AD%90%E6%B5%81%E4%BF%A1%E6%81%AF%E7%AE%A1%E7%90%86%E2%80%94OWN.user.js
// @updateURL https://update.greasyfork.org/scripts/544152/%E6%8E%A5%E5%BE%85%E7%94%B5%E5%AD%90%E6%B5%81%E4%BF%A1%E6%81%AF%E7%AE%A1%E7%90%86%E2%80%94OWN.meta.js
// ==/UserScript==



(function() {
    'use strict';

    // 基础配置常量（不含Notion）
    const CONFIG = {
        RETRY_DELAY: 100,         // 重试延迟时间（毫秒）
        MAX_RETRIES: 10,          // 最大重试次数
        AUTO_EXTRACT_DELAY: 2000  // 自动提取延迟时间（毫秒）
    };

    // 数据映射配置
    const DATA_MAPPINGS = {
        hallMapping: {
            '杭州基地创新体验中心 /Hangzhou Base Innovation Experience Center': '杭州展厅',
            '新华三未来工厂 / H3C Future Factory': '未来工厂',
            '杭州基地创新体验中心': '杭州展厅',
            '新华三未来工厂': '未来工厂',
            '新华三集团望京展厅': '望京展厅',
            '新华三集团望京展厅 / H3C Group Wangjing Exhibition Hall': '望京展厅'
        },

        specialUnitsMapping: {
    '数字政府事业部':'新华三-行业BG/数字政府事业部',
    '数字政务系统部':'新华三-行业BG/数字政府事业部',
    '党政系统部':'新华三-行业BG/数字政府事业部',
    '财税民生系统部':'新华三-行业BG/数字政府事业部',
    '北京销售部':'新华三-行业BG/数字政府事业部',
    '安平系统部':'新华三-行业BG/数字政府事业部',
    '企业事业部':'新华三-行业BG/企业事业部',
    '全球大客户系统部':'新华三-行业BG/企业事业部',
    'AI与创新科技系统部':'新华三-行业BG/企业事业部',
    '智能制造系统部':'新华三-行业BG/企业事业部',
    '央国企系统一部':'新华三-行业BG/企业事业部',
    '央国企系统二部':'新华三-行业BG/企业事业部',
    '中资海外系统部':'新华三-行业BG/企业事业部',
    '金融事业部':'新华三-行业BG/金融事业部',
    '银行系统一部':'新华三-行业BG/金融事业部',
    '银行系统二部':'新华三-行业BG/金融事业部',
    '证券系统部':'新华三-行业BG/金融事业部',
    '保险系统部':'新华三-行业BG/金融事业部',
    '银行系统三部':'新华三-行业BG/金融事业部',
    '互联网事业部':'新华三-行业BG/互联网事业部',
    '互联网系统一部':'新华三-行业BG/互联网事业部',
    '互联网系统二部':'新华三-行业BG/互联网事业部',
    '交通事业部':'新华三-行业BG/交通事业部',
    '轨道系统部':'新华三-行业BG/交通事业部',
    '交通综合系统部':'新华三-行业BG/交通事业部',
    '电力能源事业部':'新华三-行业BG/电力能源事业部',
    '电网系统部':'新华三-行业BG/电力能源事业部',
    '能源系统部':'新华三-行业BG/电力能源事业部',
    '煤炭发电系统部':'新华三-行业BG/电力能源事业部',
    '医疗事业部':'新华三-行业BG/医疗事业部',
    '医院及公共卫生系统部':'新华三-行业BG/医疗事业部',
    '医保及北京销售部':'新华三-行业BG/医疗事业部',
    '教育事业部':'新华三-行业BG/教育事业部',
    '高教系统部':'新华三-行业BG/教育事业部',
    '部委及职教系统部':'新华三-行业BG/教育事业部',
    '科研及北京教育系统部':'新华三-行业BG/教育事业部',
    '商业BG':'新华三-商业BG',
    '新华三商城事业部':'新华三-商业BG/新华三商城事业部',
    'CT分销系统部':'新华三-商业BG/新华三商城事业部',
    'IT分销系统部':'新华三-商业BG/新华三商城事业部',
    '小贝分销系统部':'新华三-商业BG/新华三商城事业部',
    '商城业务发展部':'新华三-商业BG/新华三商城事业部',
    '电商销售系统部':'新华三-商业BG/新华三商城事业部',
    '云与安全系统部':'新华三-商业BG/新华三商城事业部',
    '商业细分事业部':'新华三-商业BG/商业细分事业部',
    '商业企业系统部':'新华三-商业BG/商业细分事业部',
    '商业北京销售部':'新华三-商业BG/商业细分事业部',
    '商业政府系统部':'新华三-商业BG/商业细分事业部',
    '商业教育医疗系统部':'新华三-商业BG/商业细分事业部',
    '商业渠道发展部':'新华三-商业BG/商业渠道发展部',
    '商业赋能部':'新华三-商业BG/商业渠道发展部',
    '商业在线业务部':'新华三-商业BG/商业渠道发展部',
    '渠道及网格拓展部':'新华三-商业BG/商业渠道发展部',
    'SMB产品线':'新华三-商业BG/SMB产品线',
    '产品规划与管理部':'新华三-商业BG/SMB产品线',
    'SMB产品开发部':'新华三-商业BG/SMB产品线',
    'APP与云平台开发部':'新华三-商业BG/SMB产品线',
    '战略及综合采购认证部': '新华三-供应链管理部',
    'IT采购认证部': '新华三-供应链管理部',
    '税务部': '新华三-财经管理部',
    '杭州接待部': '新华三-客户支持部',
    '解决方案管理部': '新华三-解决方案部',
    '苏南区域销售部': '新华三-江苏代表处',
    'OEM拓展部': '新华三-国际BG'
        },

        attendantMapping: {
            袁孟茜: '11618', 吴叶清: '25564', 程博: 'ys46846', 曾子秀: 'ys47596',
            郦治杰: 'ys5072', 余孟媛: 'ys44676', 任晓双: 'ys47600', 朱梅菊: 'ys4777',
            甄思洋: '25569', 马宁: '16049', 陆一铭: '29093', 杨一弘: 'ys45708',
            伊家欣: '32008', 王欢: '25036', 陈亚星: '16048', 张晓宇: '23613', 刘祥辰: 'ys2416'
        },

        businessTypeMapping: {
            '政府事务部邀请客户': '政府',
            '产品线类客户': '其它产品线',
            '国际': '国际业务'
        },

        customerAttributesMapping: {
            '行业BG': '行业BG',
            '商业BG': '商业BG',
            '平台客户': '非市场',
            '政府事务部': '非市场',
            '产品线': '非市场',
            '国际BG': '国际BG',
            '运营商BG': '运营商BG'
        }
    };

    // 选项配置
    const OPTIONS = {
        levelOptions: ['', 'A', 'A+', 'S', 'VIP', 'TOP'],
        customerAttributesOptions: ['', '行业BG', '商业BG', '运营商BG', '国际BG', '紫光系', '非市场'],
        attendantOptionsBeijing: ['', '陆一铭', '杨一弘', '伊家欣', '王欢', '陈亚星', '张晓宇', '刘祥辰'],
        attendantOptionsOther: ['', '袁孟茜', '吴叶清', '程博', '曾子秀', '郦治杰', '余孟媛', '任晓双', '朱梅菊', '甄思洋', '马宁'],
        receptionOptionsBeijing: ['', '紫鸾书院餐叙', '样板点参观', '望京会议'],
        receptionOptionsOther: ['', '样板点参观', '基地会议室交流', '紫鸾书院餐叙', '新华书苑餐叙', '杭州展厅拍摄']
    };

    // 地区映射
    const REGION_MAPPING = {
        cityGroups: {
        '上海': ['上海'],
        '天津': ['天津'],
        '重庆': ['重庆'],
        '广东': ['广州', '深圳', '珠海', '汕头', '佛山', '韶关', '中山', '东莞', '惠州', '揭阳', '潮州', '梅州', '汕尾', '河源', '清远', '云浮', '阳江', '肇庆', '江门', '茂名', '湛江'],
        '浙江': ['杭州', '宁波', '温州', '嘉兴', '湖州', '绍兴', '金华', '衢州', '舟山', '台州', '丽水'],
        '江苏': ['苏州', '南京', '无锡', '常州', '扬州', '徐州', '连云港', '盐城', '南通', '淮安', '宿迁', '泰州', '镇江', '苏南'],
        '安徽': ['合肥', '芜湖', '蚌埠', '淮南', '马鞍山', '淮北', '铜陵', '安庆', '黄山', '滁州', '阜阳', '宿州', '巢湖', '六安', '亳州', '池州', '宣城'],
        '福建': ['福州', '厦门', '泉州', '漳州', '南平', '宁德', '莆田', '三明'],
        '山东': ['济南', '青岛', '淄博', '枣庄', '东营', '潍坊', '烟台', '济宁', '泰安', '威海', '日照', '莱芜', '临沂', '德州', '聊城', '滨州', '菏泽'],
        '江西': ['南昌', '景德镇', '萍乡', '九江', '新余', '鹰潭', '赣州', '吉安', '宜春', '抚州', '上饶'],
        '河南': ['郑州', '开封', '洛阳', '平顶山', '安阳', '鹤壁', '新乡', '焦作', '濮阳', '许昌', '漯河', '三门峡', '商丘', '周口', '驻马店', '南阳', '信阳', '济源'],
        '湖北': ['武汉', '黄石', '十堰', '宜昌', '襄阳', '鄂州', '荆门', '孝感', '荆州', '黄冈', '咸宁', '随州', '恩施', '仙桃', '潜江', '天门', '神农架'],
        '湖南': ['长沙', '株洲', '湘潭', '衡阳', '邵阳', '岳阳', '常德', '张家界', '益阳', '郴州', '永州', '怀化', '娄底', '湘西'],
        '四川': ['成都', '自贡', '攀枝花', '泸州', '德阳', '绵阳', '广元', '遂宁', '内江', '乐山', '南充', '眉山', '宜宾', '广安', '达州', '雅安', '巴中', '资阳', '阿坝', '甘孜', '凉山'],
        '云南': ['昆明', '曲靖', '玉溪', '保山', '昭通', '丽江', '普洱', '临沧', '楚雄', '红河', '文山', '西双版纳', '大理', '德宏', '怒江', '迪庆'],
        '贵州': ['贵阳', '六盘水', '遵义', '安顺', '毕节', '铜仁', '黔西南', '黔东南', '黔南'],
        '陕西': ['西安', '铜川', '宝鸡', '咸阳', '渭南', '延安', '汉中', '榆林', '安康', '商洛'],
        '广西': ['南宁', '柳州', '桂林', '梧州', '北海', '防城港', '钦州', '贵港', '玉林', '百色', '贺州', '河池', '来宾', '崇左'],
        '河北': ['石家庄', '唐山', '秦皇岛', '邯郸', '邢台', '保定', '张家口', '承德', '沧州', '廊坊', '衡水'],
        '山西': ['太原', '大同', '阳泉', '长治', '晋城', '朔州', '晋中', '运城', '忻州', '临汾', '吕梁'],
        '内蒙古': ['呼和浩特', '包头', '乌海', '赤峰', '通辽', '鄂尔多斯', '呼伦贝尔', '巴彦淖尔', '乌兰察布', '锡林郭勒', '兴安', '阿拉善'],
        '辽宁': ['沈阳', '大连', '鞍山', '抚顺', '本溪', '丹东', '锦州', '营口', '阜新', '辽阳', '盘锦', '铁岭', '朝阳', '葫芦岛'],
        '吉林': ['长春', '吉林', '四平', '辽源', '通化', '白山', '松原', '白城', '延边'],
        '黑龙江': ['哈尔滨', '齐齐哈尔', '鸡西', '鹤岗', '双鸭山', '大庆', '伊春', '佳木斯', '七台河', '牡丹江', '黑河', '绥化', '大兴安岭'],
        '海南': ['海口', '三亚', '三沙', '儋州', '琼海', '文昌', '万宁', '东方'],
        '甘肃': ['兰州', '嘉峪关', '金昌', '白银', '天水', '武威', '张掖', '平凉', '酒泉', '庆阳', '定西', '陇南', '临夏', '甘南'],
        '青海': ['西宁', '海东', '海北', '黄南', '果洛', '玉树', '海西'],
        '新疆': ['乌鲁木齐', '克拉玛依', '吐鲁番', '哈密', '昌吉', '博尔塔拉', '巴音郭楞', '阿克苏', '克孜勒苏', '喀什', '和田', '伊犁', '塔城', '阿勒泰'],
        '西藏': ['拉萨', '日喀则', '昌都', '林芝', '山南', '那曲'],
        '宁夏': ['银川', '石嘴山', '吴忠', '固原', '中卫'],
        '台湾': ['台北', '高雄', '基隆', '台中', '台南', '新竹', '嘉义'],
        '香港': ['香港'],
        '澳门': ['澳门']
        }
    };

    // 构建城市到省份的映射
    const cityToProvinceMapping = Object.keys(REGION_MAPPING.cityGroups).reduce((acc, province) => {
        REGION_MAPPING.cityGroups[province].forEach(city => {
            acc[city] = province;
        });
        return acc;
    }, {});

    const provinceList = Object.keys(REGION_MAPPING.cityGroups);

    // 工具函数
    const Utils = {
        // 安全的DOM元素获取
        safeGetElement: (selector, property = 'textContent', defaultValue = '未提供') => {
            try {
                let elem = document.querySelector(selector);
                if (!elem) {
                    const result = document.evaluate(selector, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
                    elem = result.singleNodeValue;
                }
                return elem ? (elem[property] || elem.value || elem.innerText || '').trim() : defaultValue;
            } catch (error) {
                console.error(`Error getting element ${selector}:`, error);
                return defaultValue;
            }
        },

        // 优化的级别获取
        getCustomerLevel: () => {
            // 只保留从input中获取的方式
            const inputLevel = Utils.safeGetElement('input[name="KHLEVEL"]', 'value');
            return inputLevel && inputLevel !== '未提供' ? inputLevel.trim() : '';
        },

        // 优化的接待员获取
        getAttendantInfo: () => {
            // 只保留从ac_results中获取的方式
            const acResults = document.querySelector('.ac_results ul');
            if (acResults) {
                return Utils.getAttendantName(acResults.textContent);
            }

            return '';
        },

        // 格式化日期
        formatDate: (dateStr) => {
            if (!dateStr || dateStr === '未提供') return dateStr;
            const dateParts = dateStr.split(/[\/\-]/);
            if (dateParts.length === 3) {
                return `${dateParts[0]}年${parseInt(dateParts[1], 10)}月${parseInt(dateParts[2], 10)}日`;
            }
            return dateStr;
        },

        // 分割中文姓名
        splitChineseName: (chineseName) => {
            if (!chineseName) return { lastName: '', firstName: '' };

            let lastName = chineseName.substring(0, 1);
            let firstName = chineseName.substring(1);

            const commonLastNames = ['欧阳', '司马', '诸葛', '长孙', '宇文', '慕容', '司徒', '上官'];
            for (let commonLastName of commonLastNames) {
                if (chineseName.startsWith(commonLastName)) {
                    lastName = commonLastName;
                    firstName = chineseName.substring(commonLastName.length);
                    break;
                }
            }

            return { lastName, firstName };
        },

        // 解析输入文本
        parseInputText: (inputText) => {
            if (!inputText) return { halls: '', times: '' };

            const lines = inputText.split('\n').map(line => line.trim()).filter(line => line);
            const result = { halls: [], times: [] };

            lines.forEach(line => {
                if (DATA_MAPPINGS.hallMapping[line]) {
                    result.halls.push(DATA_MAPPINGS.hallMapping[line]);
                } else if (/\d{2}:\d{2}-\d{2}:\d{2}/.test(line)) {
                    result.times.push(line.split('-')[0]);
                } else if (/\d{2}:\d{2}/.test(line)) {
                    result.times.push(line);
                }
            });

            return {
                halls: result.halls.join('/'),
                times: result.times.join('/')
            };
        },

        // 创建选择框
        createSelect: (options, selectedValue = '') => {
            return `
                <select style="width: 100%; padding: 3px; border: 1px solid #ddd; border-radius: 3px; font-size: 12px; height: 24px;">
                    ${options.map(option =>
                        `<option value="${option}" ${selectedValue === option ? 'selected' : ''}>${option}</option>`
                    ).join('')}
                </select>
            `;
        },

        // 根据代码获取接待员姓名
        getAttendantName: (text) => {
            for (const [name, codes] of Object.entries(DATA_MAPPINGS.attendantMapping)) {
                const codeArray = Array.isArray(codes) ? codes : [codes];
                for (const code of codeArray) {
                    if (text.includes(code)) {
                        return name;
                    }
                }
            }
            return '';
        },

        // 处理发起单位
        processInitiatingUnit: (unit) => {
            if (!unit || unit === '未提供') return '未提供';

            if (DATA_MAPPINGS.specialUnitsMapping[unit]) {
                return DATA_MAPPINGS.specialUnitsMapping[unit];
            }

            for (const city in cityToProvinceMapping) {
                if (unit.includes(city)) {
                    return `新华三-${cityToProvinceMapping[city]}代表处`;
                }
            }

            for (const province of provinceList) {
                if (unit.includes(province)) {
                    return `新华三-${province}代表处`;
                }
            }

            return `新华三-${unit}`;
        },

        // 异步重试机制
        retry: async (fn, maxRetries = CONFIG.MAX_RETRIES, delay = CONFIG.RETRY_DELAY) => {
            for (let i = 0; i < maxRetries; i++) {
                try {
                    return await fn();
                } catch (error) {
                    if (i === maxRetries - 1) throw error;
                    await new Promise(resolve => setTimeout(resolve, delay));
                }
            }
        },

        // 防抖函数
        debounce: (func, wait) => {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    clearTimeout(timeout);
                    func(...args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        },

        // 保存位置到localStorage
        savePosition: (x, y) => {
            try {
                localStorage.setItem('receptionTablePosition', JSON.stringify({ x, y }));
            } catch (error) {
                console.error('保存位置失败:', error);
            }
        },

        // 从localStorage获取位置
        getPosition: () => {
            try {
                const saved = localStorage.getItem('receptionTablePosition');
                return saved ? JSON.parse(saved) : { x: 20, y: 20 };
            } catch (error) {
                console.error('获取位置失败:', error);
                return { x: 20, y: 20 };
            }
        },

        // 保存缩小状态
        saveMinimizedState: (isMinimized) => {
            try {
                localStorage.setItem('receptionTableMinimized', isMinimized.toString());
            } catch (error) {
                console.error('保存缩小状态失败:', error);
            }
        },

        // 获取缩小状态
        getMinimizedState: () => {
            try {
                const saved = localStorage.getItem('receptionTableMinimized');
                return saved === 'true';
            } catch (error) {
                console.error('获取缩小状态失败:', error);
                return false;
            }
        }
    };

    // 主要功能类
    class ReceptionDataExtractor {
        constructor() {
            this.isFormPage = window.location.href.includes('V_h3c31N025_E001');
            this.receivedData = '';
            this.styles = this.initStyles();
            this.isDragging = false;
            this.dragOffset = { x: 0, y: 0 };
        }

        initStyles() {
            return {
                button: {
                    padding: '6px 12px', // 缩小按钮尺寸
                    border: 'none',
                    borderRadius: '6px',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                    cursor: 'pointer',
                    fontSize: '12px', // 缩小字体
                    fontWeight: '500',
                    transition: 'all 0.2s ease'
                },
                displayArea: {
                    position: 'fixed',
                    bottom: '20px',
                    right: '20px',
                    backgroundColor: 'white',
                    border: '1px solid #e1e5e9',
                    borderRadius: '12px',
                    padding: '12px', // 减少内边距
                    boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)',
                    zIndex: '10000',
                    maxHeight: '60vh', // 降低最大高度
                    maxWidth: '90vw',
                    overflow: 'auto',
                    backdropFilter: 'blur(10px)',
                    fontSize: '12px' // 缩小整体字体
                },
                displayAreaMinimized: {
                    position: 'fixed',
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: '1px solid #e1e5e9',
                    borderRadius: '25px',
                    padding: '8px 16px',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                    zIndex: '10000',
                    backdropFilter: 'blur(10px)',
                    fontSize: '12px',
                    cursor: 'move',
                    userSelect: 'none',
                    maxWidth: '200px',
                    overflow: 'hidden'
                },
                closeButton: {
                    position: 'absolute',
                    top: '6px',
                    right: '6px',
                    border: 'none',
                    background: '#f8f9fa',
                    color: '#6c757d',
                    borderRadius: '50%',
                    width: '24px', // 缩小关闭按钮
                    height: '24px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.2s ease'
                },
                minimizeButton: {
                    position: 'absolute',
                    top: '6px',
                    right: '36px',
                    border: 'none',
                    background: '#f8f9fa',
                    color: '#6c757d',
                    borderRadius: '50%',
                    width: '24px',
                    height: '24px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.2s ease'
                },
                dragHandle: {
                    position: 'absolute',
                    top: '6px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '20px',
                    height: '4px',
                    backgroundColor: '#dee2e6',
                    borderRadius: '2px',
                    cursor: 'move',
                    transition: 'all 0.2s ease'
                },
                floatingButton: {
                    position: 'fixed',
                    top: '20px',
                    right: '20px',
                    zIndex: '9999',
                    padding: '8px 14px', // 缩小浮动按钮
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: '1px solid rgba(0, 0, 0, 0.1)',
                    borderRadius: '20px',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                    cursor: 'pointer',
                    fontSize: '12px', // 缩小字体
                    color: '#495057',
                    backdropFilter: 'blur(10px)',
                    transition: 'all 0.3s ease',
                    fontWeight: '500'
                },
                pastePanel: {
                    position: 'fixed',
                    top: '60px', // 调整位置配合缩小的浮动按钮
                    right: '20px',
                    zIndex: '9998',
                    backgroundColor: 'white',
                    border: '1px solid #e1e5e9',
                    borderRadius: '12px',
                    padding: '12px', // 减少内边距
                    boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)',
                    display: 'none',
                    backdropFilter: 'blur(10px)',
                    minWidth: '280px',
                    maxWidth: '400px'
                },
                pasteTextarea: {
                    width: '100%',
                    minHeight: '70px', // 缩小文本框
                    maxHeight: '130px',
                    padding: '10px',
                    border: '1px solid #e1e5e9',
                    borderRadius: '8px',
                    fontSize: '12px', // 缩小字体
                    fontFamily: 'Consolas, "Courier New", monospace',
                    resize: 'vertical',
                    outline: 'none',
                    transition: 'border-color 0.2s ease',
                    boxSizing: 'border-box'
                },
                pasteButton: {
                    width: '100%',
                    padding: '8px 12px', // 缩小按钮
                    marginTop: '10px',
                    backgroundColor: '#007bff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '12px', // 缩小字体
                    fontWeight: '500',
                    transition: 'background-color 0.2s ease'
                }
            };
        }

        // 表单页面数据提取和直接处理
        extractDataAndProcess() {
            // 提取展厅数据和陪同领导信息
            const { hallData, accompanyLeaders } = this.extractHallAndLeaderData();

            // 无论是否成功提取到数据都尝试生成表格
            this.tryDirectGeneration(hallData || '', accompanyLeaders);
        }

        // 提取展厅数据和陪同领导信息
        extractHallAndLeaderData() {
            const dataGrid = $('#dg');
            if (!dataGrid.length || !dataGrid.data('datagrid')) {
                console.error('DataGrid not found or dataGrid method is not available.');
                return { hallData: null, accompanyLeaders: '' };
            }

            const rows = dataGrid.datagrid('getRows');
            if (rows.length === 0) {
                console.warn('No data found in the datagrid.');
                return { hallData: null, accompanyLeaders: '' };
            }

            let formData = '';
            const leadersSet = new Set(); // 使用Set避免重复

            rows.forEach((row) => {
                // 提取展厅数据
                if (row.ZT !== undefined && row.ZT.trim() !== '') {
                    formData += `${row.ZT}\n${row.TIME || 'N/A'}\n\n`;
                }

                // 提取陪同领导信息
                if (row.PTLD !== undefined && row.PTLD.trim() !== '' && row.PTLD.trim() !== '陪同领导') {
                    // 清理数据，移除空字符串和多余逗号，过滤掉表头文字
                    const leaders = row.PTLD.split(',').filter(leader => {
                        const trimmed = leader.trim();
                        return trimmed !== '' && trimmed !== '陪同领导';
                    });
                    leaders.forEach(leader => leadersSet.add(leader.trim()));
                }
            });

            // 从DOM中提取陪同领导信息（备用方案）
            if (leadersSet.size === 0) {
                const leaderCells = document.querySelectorAll('td[field="PTLD"] .datagrid-cell');
                leaderCells.forEach(cell => {
                    const text = cell.textContent.trim();
                    if (text && text !== '陪同领导') {
                        const leaders = text.split(',').filter(leader => {
                            const trimmed = leader.trim();
                            return trimmed !== '' && trimmed !== '陪同领导';
                        });
                        leaders.forEach(leader => leadersSet.add(leader.trim()));
                    }
                });
            }

            // 将Set转换为逗号分隔的字符串
            const accompanyLeaders = Array.from(leadersSet).join(',');

            return {
                hallData: formData.trim(),
                accompanyLeaders: accompanyLeaders
            };
        }

        // 尝试直接生成表格
        tryDirectGeneration(hallData, accompanyLeaders = '') {
            const targetWindow = window.opener || window.parent;

            if (targetWindow && targetWindow !== window) {
                try {
                    // 尝试在主窗口中直接调用生成表格函数，包含陪同领导信息
                    targetWindow.postMessage({
                        type: 'directGeneration',
                        data: hallData,
                        leaders: accompanyLeaders
                    }, '*');
                    console.log('直接生成请求已发送到主窗口，包含陪同领导信息');
                } catch (error) {
                    console.error('直接生成失败，需要手动操作:', error);
                }
            } else {
                console.log('未找到主窗口，数据已准备好供手动使用:', hallData);
            }
        }

        // 提取数据并创建表格（保持当前展厅数据和陪同领导）
        extractAndCreateTable() {
            // 重点：从当前表格中读取用户已填写的数据（如果表格存在）
            let currentReception = '';
            let currentTime = '';
            let currentLeaders = '';

            const existingTable = document.querySelector('#displayArea table');
            if (existingTable) {
                // 读取接待信息
                const receptionCell = existingTable.querySelector('tbody tr td:nth-child(8)');
                const receptionSelect = receptionCell.querySelector('select');
                if (receptionSelect) {
                    currentReception = receptionSelect.value;
                } else {
                    currentReception = receptionCell.textContent.trim();
                }

                // 读取时间
                const timeInput = existingTable.querySelector('tbody tr td:nth-child(9) input');
                if (timeInput) {
                    currentTime = timeInput.value.trim();
                }

                // 读取陪同领导
                const leaderCell = existingTable.querySelector('tbody tr td:nth-child(4)');
                currentLeaders = leaderCell.textContent.trim();
            }

            const getData = (selector, prop = 'textContent') =>
                Utils.safeGetElement(selector, prop);

            const date = Utils.formatDate(getData('#STARTTIME'));
            const customerUnit = getData('#LBDW', 'value');
            let businessType = getData('#SYYWDY');
            const members = getData('#ALLNUM');
            const applicant = (getData('#ADD_ID').match(/[\u4e00-\u9fa5]+/g)?.join('')) ||
                            (getData('#ADD_ID').match(/[a-zA-Z]+/g)?.join(' ')) ||
                            getData('#ADD_ID');
            const applicantName = Array.isArray(applicant) ? applicant.join(' ') : applicant;
            const initiatingUnitRaw = getData('#SYBM', 'value');
            const initiatingUnit = Utils.processInitiatingUnit(initiatingUnitRaw);
            const city = getData('#CITY_SHOW');
            const khLevel = Utils.getCustomerLevel();
            const selectedAttendant = Utils.getAttendantInfo();

            // 业务类型映射
            businessType = DATA_MAPPINGS.businessTypeMapping[businessType] || businessType;

            // 获取客户属性
            let customerAttributes = '未提供';
            Object.keys(DATA_MAPPINGS.customerAttributesMapping).forEach(key => {
                const radioButton = document.querySelector(`input[name="YWFL"][value="${key}"]:checked`);
                if (radioButton) {
                    customerAttributes = DATA_MAPPINGS.customerAttributesMapping[key];
                }
            });

            // 根据城市选择相应选项
            const attendantOptions = city === '北京' ? OPTIONS.attendantOptionsBeijing : OPTIONS.attendantOptionsOther;
            const receptionOptions = city === '北京' ? OPTIONS.receptionOptionsBeijing : OPTIONS.receptionOptionsOther;

            // 生成新表格时，传入保留的数据
            this.createDisplayTable({
                date, customerUnit, businessType, members, applicant: applicantName,
                khLevel, reception: currentReception, time: currentTime,
                customerAttributes, initiatingUnit, selectedAttendant,
                attendantOptions, receptionOptions,
                accompanyLeaders: currentLeaders
            });
        }

        // 创建显示表格
        createDisplayTable(data) {
            let displayArea = document.querySelector('#displayArea');
            const savedPosition = Utils.getPosition();
            const isMinimized = Utils.getMinimizedState();

            if (!displayArea) {
                displayArea = document.createElement('div');
                displayArea.id = 'displayArea';
                document.body.appendChild(displayArea);
            } else {
                displayArea.innerHTML = '';
            }

            // 设置位置和样式
            this.applyDisplayAreaStyles(displayArea, savedPosition, isMinimized);

            if (isMinimized) {
                this.createMinimizedView(displayArea, data);
            } else {
                this.createFullView(displayArea, data);
            }

            // 添加拖拽功能
            this.addDragFunctionality(displayArea);
        }

        // 应用显示区域样式
        applyDisplayAreaStyles(displayArea, position, isMinimized) {
            const baseStyles = isMinimized ? this.styles.displayAreaMinimized : this.styles.displayArea;
            Object.assign(displayArea.style, baseStyles);

            displayArea.style.right = 'auto';
            displayArea.style.bottom = 'auto';
            displayArea.style.left = position.x + 'px';
            displayArea.style.top = position.y + 'px';
        }

        // 创建缩小视图
        createMinimizedView(displayArea, data) {
            const minimizedContent = document.createElement('div');
            minimizedContent.style.cssText = `
                display: flex;
                align-items: center;
                gap: 8px;
                font-weight: 500;
            `;

            minimizedContent.innerHTML = `
                <span>📋</span>
                <span style="color: #495057; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                    ${data.customerUnit.length > 10 ? data.customerUnit.substring(0, 10) + '...' : data.customerUnit}
                </span>
                <button id="expandBtn" style="
                    background: none;
                    border: none;
                    color: #007bff;
                    cursor: pointer;
                    padding: 2px 6px;
                    border-radius: 4px;
                    font-size: 12px;
                    transition: all 0.2s ease;
                ">展开</button>
            `;

            displayArea.appendChild(minimizedContent);

            // 展开按钮事件
            const expandBtn = minimizedContent.querySelector('#expandBtn');
            expandBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleMinimize(displayArea, data, false);
            });

            // 悬停效果
            expandBtn.addEventListener('mouseenter', () => {
                expandBtn.style.backgroundColor = '#f8f9fa';
            });
            expandBtn.addEventListener('mouseleave', () => {
                expandBtn.style.backgroundColor = 'transparent';
            });
        }

        // 创建完整视图
        createFullView(displayArea, data) {
            // 创建拖拽手柄
            const dragHandle = document.createElement('div');
            Object.assign(dragHandle.style, this.styles.dragHandle);
            dragHandle.addEventListener('mouseenter', () => {
                dragHandle.style.backgroundColor = '#adb5bd';
            });
            dragHandle.addEventListener('mouseleave', () => {
                dragHandle.style.backgroundColor = '#dee2e6';
            });
            displayArea.appendChild(dragHandle);

            // 创建缩小按钮
            const minimizeButton = document.createElement('button');
            minimizeButton.innerHTML = '−';
            minimizeButton.title = '缩小表格';
            Object.assign(minimizeButton.style, this.styles.minimizeButton);
            minimizeButton.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleMinimize(displayArea, data, true);
            });
            minimizeButton.addEventListener('mouseenter', () => {
                minimizeButton.style.backgroundColor = '#e9ecef';
                minimizeButton.style.color = '#495057';
            });
            minimizeButton.addEventListener('mouseleave', () => {
                minimizeButton.style.backgroundColor = '#f8f9fa';
                minimizeButton.style.color = '#6c757d';
            });
            displayArea.appendChild(minimizeButton);

            // 创建关闭按钮
            const closeButton = document.createElement('button');
            closeButton.innerHTML = '×';
            Object.assign(closeButton.style, this.styles.closeButton);
            closeButton.addEventListener('click', () => displayArea.remove());
            closeButton.addEventListener('mouseenter', () => {
                closeButton.style.backgroundColor = '#e9ecef';
                closeButton.style.color = '#495057';
            });
            closeButton.addEventListener('mouseleave', () => {
                closeButton.style.backgroundColor = '#f8f9fa';
                closeButton.style.color = '#6c757d';
            });
            displayArea.appendChild(closeButton);

            const table = this.createTable(data);
            const buttonContainer = this.createButtonContainer();

            displayArea.appendChild(table);
            displayArea.appendChild(buttonContainer);
        }

        // 切换缩小状态
        toggleMinimize(displayArea, data, minimize) {
            Utils.saveMinimizedState(minimize);

            // 清空内容
            displayArea.innerHTML = '';

            // 重新应用样式
            const savedPosition = Utils.getPosition();
            this.applyDisplayAreaStyles(displayArea, savedPosition, minimize);

            if (minimize) {
                this.createMinimizedView(displayArea, data);
            } else {
                this.createFullView(displayArea, data);
            }

            // 重新添加拖拽功能
            this.addDragFunctionality(displayArea);
        }

        // 添加拖拽功能
        addDragFunctionality(displayArea) {
            let isDragging = false;
            let dragOffset = { x: 0, y: 0 };

            // 鼠标按下事件
            const handleMouseDown = (e) => {
                if (e.target.tagName === 'BUTTON' || e.target.tagName === 'SELECT' || e.target.tagName === 'INPUT') {
                    return;
                }

                isDragging = true;
                const rect = displayArea.getBoundingClientRect();
                dragOffset.x = e.clientX - rect.left;
                dragOffset.y = e.clientY - rect.top;

                displayArea.style.cursor = 'grabbing';
                displayArea.style.userSelect = 'none';

                // 提高z-index确保在拖拽时在最前面
                displayArea.style.zIndex = '10001';

                e.preventDefault();
            };

            // 鼠标移动事件
            const handleMouseMove = (e) => {
                if (!isDragging) return;

                const newX = e.clientX - dragOffset.x;
                const newY = e.clientY - dragOffset.y;

                // 限制在视窗内
                const maxX = window.innerWidth - displayArea.offsetWidth;
                const maxY = window.innerHeight - displayArea.offsetHeight;

                const boundedX = Math.max(0, Math.min(newX, maxX));
                const boundedY = Math.max(0, Math.min(newY, maxY));

                displayArea.style.left = boundedX + 'px';
                displayArea.style.top = boundedY + 'px';

                e.preventDefault();
            };

            // 鼠标释放事件
            const handleMouseUp = () => {
                if (!isDragging) return;

                isDragging = false;
                displayArea.style.cursor = '';
                displayArea.style.userSelect = '';
                displayArea.style.zIndex = '10000';

                // 保存位置
                const rect = displayArea.getBoundingClientRect();
                Utils.savePosition(rect.left, rect.top);
            };

            // 添加事件监听器
            displayArea.addEventListener('mousedown', handleMouseDown);
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);

            // 为缩小状态添加特殊的拖拽样式
            if (Utils.getMinimizedState()) {
                displayArea.style.cursor = 'move';
            }
        }

        // 创建表格
        createTable(data) {
            const table = document.createElement('table');
            table.style.cssText = `
                border: 1px solid #dee2e6;
                width: 100%;
                border-collapse: collapse;
                font-size: 11px; /* 缩小表格字体 */
                background: white;
                border-radius: 8px;
                overflow: hidden;
                margin-top: 20px;
            `;

            table.innerHTML = `
                <thead>
                    <tr style="background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);">
                        ${this.createTableHeaders()}
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        ${this.createTableRow(data)}
                    </tr>
                </tbody>
            `;

            return table;
        }

        createTableHeaders() {
            // 表头包含"陪同领导"字段
            const headers = ['日期', '客户单位', '业务分类', '陪同领导', '人数', '级别', '申请人', '接待信息', '时间', '接待员', '发起单位', '客户属性'];
            return headers.map(header =>
                `<th style="border: 1px solid #dee2e6; padding: 4px 6px; font-weight: 600; color: #495057; text-align: center; white-space: nowrap;">${header}</th>`
            ).join('');
        }

        createTableRow(data) {
            const cellStyle = "border: 1px solid #dee2e6; padding: 3px 6px; vertical-align: middle;";
            // 陪同领导信息为空时显示"/"
            const leaderDisplay = data.accompanyLeaders && data.accompanyLeaders.trim() ? data.accompanyLeaders : '/';

            return `
                <td style="${cellStyle}">${data.date}</td>
                <td style="${cellStyle}">${data.customerUnit}</td>
                <td style="${cellStyle}">${data.businessType}</td>
                <td style="${cellStyle}">${leaderDisplay}</td> <!-- 陪同领导字段，为空显示"/" -->
                <td style="${cellStyle}">${data.members}</td>
                <td style="${cellStyle}">${data.khLevel ? data.khLevel : Utils.createSelect(OPTIONS.levelOptions)}</td>
                <td style="${cellStyle}">${data.applicant}</td>
                <td style="${cellStyle}">${data.reception ? data.reception : Utils.createSelect(data.receptionOptions)}</td>
                <td style="${cellStyle}">
                    <input type="text" style="width: 100%; padding: 2px 4px; border: 1px solid #dee2e6; border-radius: 4px; font-size: 11px; height: 22px;" value="${data.time}" ${data.time ? 'readonly' : ''} />
                </td>
                <td style="${cellStyle}">
                    ${Utils.createSelect(data.attendantOptions, data.selectedAttendant)}
                </td>
                <td style="${cellStyle}">${data.initiatingUnit}</td>
                <td style="${cellStyle}">
                    ${Utils.createSelect(OPTIONS.customerAttributesOptions, data.customerAttributes)}
                </td>
            `;
        }

        // 创建按钮容器
        createButtonContainer() {
            const container = document.createElement('div');
            container.style.cssText = `
                text-align: center;
                margin-top: 10px; /* 减少按钮区上边距 */
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 8px; /* 缩小按钮间距 */
                flex-wrap: wrap;
            `;

            const buttons = [
                { text: '刷新信息', handler: () => this.extractAndCreateTable(), color: '#007bff', tooltip: '重新提取页面信息（保持已填数据）' },
                { text: '复制值班表', handler: this.copyScheduleData.bind(this), color: '#28a745', tooltip: '复制表格数据到剪贴板' },
                { text: '复制部门信息', handler: this.copyDepartmentInfo.bind(this), color: '#17a2b8', tooltip: '复制详细部门信息' }
            ];

            buttons.forEach(({ text, handler, color, tooltip }) => {
                const button = this.createButton(text, handler, color);
                button.title = tooltip;
                container.appendChild(button);
            });

            return container;
        }

        // 创建按钮
        createButton(text, clickHandler, backgroundColor = '#007bff') {
            const button = document.createElement('button');
            button.textContent = text;
            Object.assign(button.style, this.styles.button, {
                backgroundColor: backgroundColor,
                color: 'white',
                border: 'none'
            });

            button.addEventListener('click', clickHandler);
            button.addEventListener('mouseenter', () => {
                button.style.transform = 'translateY(-1px)';
                button.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.15)';
            });
            button.addEventListener('mouseleave', () => {
                button.style.transform = 'translateY(0)';
                button.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
            });

            return button;
        }

        // 复制值班表数据（包含陪同领导信息）
        copyScheduleData() {
            const table = document.querySelector('#displayArea table');
            if (!table) return;

            const rows = table.querySelectorAll('tbody tr');
            const copyText = Array.from(rows).map(row => {
                const cells = row.querySelectorAll('td');
                return Array.from(cells).map(cell => {
                    const child = cell.querySelector('select, input');
                    return child ? (child.value || '') : cell.textContent.trim();
                }).join('\t');
            }).join('\n');

            this.copyToClipboard(copyText);
            this.showToast('值班表数据已复制到剪贴板');
        }

        // 复制部门信息
// 复制部门信息
copyDepartmentInfo() {
    // 获取展厅接待信息和时间
    let receptionInfo = '未提供';
    let receptionTime = '未提供';

    const existingTable = document.querySelector('#displayArea table');
    if (existingTable) {
        // 获取接待信息
        const receptionCell = existingTable.querySelector('tbody tr td:nth-child(8)');
        const receptionSelect = receptionCell.querySelector('select');
        if (receptionSelect) {
            receptionInfo = receptionSelect.value;
        } else {
            receptionInfo = receptionCell.textContent.trim() || '未提供';
        }

        // 获取时间信息
        const timeCell = existingTable.querySelector('tbody tr td:nth-child(9)');
        const timeInput = timeCell.querySelector('input');
        if (timeInput) {
            receptionTime = timeInput.value.trim() || '未提供';
        } else {
            receptionTime = timeCell.textContent.trim() || '未提供';
        }
    }

    const customerInfo = `
客户单位：${Utils.safeGetElement('#LBDW')}
客户级别：${Utils.getCustomerLevel()}
流程申请人：${
  (Utils.safeGetElement('#ADD_ID').match(/[\u4e00-\u9fa5]+/g)?.join('')) ||
  (Utils.safeGetElement('#ADD_ID').match(/[a-zA-Z]+/g)?.join(' ')) ||
  Utils.safeGetElement('#ADD_ID')
} ${Utils.safeGetElement('#PHONENUM')}
接待日期：${Utils.safeGetElement('#STARTTIME')}至${Utils.safeGetElement('#ENDTIME')}
展厅信息：${receptionInfo} ${receptionTime}
受益部门名称：${Utils.safeGetElement('#SYBM')}
受益部门编码：${Utils.safeGetElement('#SYBMBM')}
受益行业名称：${Utils.safeGetElement('#SYHY')}
受益行业编码：${Utils.safeGetElement('#SYHYBM')}
人数：${Utils.safeGetElement('#ALLNUM')}
    `.trim();

    this.copyToClipboard(customerInfo);
    this.showToast('部门信息已复制到剪贴板');
}

        // 显示提示信息
        showToast(message) {
            const toast = document.createElement('div');
            toast.textContent = message;
            toast.style.cssText = `
                position: fixed;
                top: 20px;
                left: 50%;
                transform: translateX(-50%);
                background: rgba(40, 167, 69, 0.9);
                color: white;
                padding: 8px 16px; /* 缩小提示框 */
                border-radius: 25px;
                z-index: 10001;
                font-size: 12px; /* 缩小字体 */
                font-weight: 500;
                backdrop-filter: blur(10px);
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                transition: all 0.3s ease;
            `;

            document.body.appendChild(toast);

            setTimeout(() => {
                toast.style.opacity = '0';
                toast.style.transform = 'translateX(-50%) translateY(-10px)';
                setTimeout(() => {
                    if (toast.parentNode) {
                        toast.parentNode.removeChild(toast);
                    }
                }, 300);
            }, 2000);
        }

        // 复制到剪贴板
        copyToClipboard(text) {
            const tempTextArea = document.createElement('textarea');
            tempTextArea.value = text;
            tempTextArea.style.position = 'fixed';
            tempTextArea.style.opacity = '0';
            document.body.appendChild(tempTextArea);
            tempTextArea.select();

            try {
                document.execCommand('copy');
                console.log('复制成功');
            } catch (error) {
                console.error('复制失败:', error);
            }

            document.body.removeChild(tempTextArea);
        }

        // 创建界面
        createInterface() {
            // 创建浮动按钮
            this.createFloatingButton();
            console.log('界面初始化完成');
        }

        // 创建浮动按钮
        createFloatingButton() {
            const floatingButton = document.createElement('button');
            floatingButton.innerHTML = '📋 数据识别';
            floatingButton.id = 'floatingBtn';
            Object.assign(floatingButton.style, this.styles.floatingButton);

            // 鼠标悬停效果
            floatingButton.addEventListener('mouseenter', () => {
                floatingButton.style.backgroundColor = 'rgba(255, 255, 255, 1)';
                floatingButton.style.transform = 'translateY(-2px)';
                floatingButton.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.2)';
            });

            floatingButton.addEventListener('mouseleave', () => {
                floatingButton.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
                floatingButton.style.transform = 'translateY(0)';
                floatingButton.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
            });

            // 点击事件
            floatingButton.addEventListener('click', () => {
                this.togglePastePanel();
            });

            document.body.appendChild(floatingButton);

            // 创建粘贴面板
            this.createPastePanel();
        }

        // 创建粘贴面板
        createPastePanel() {
            const pastePanel = document.createElement('div');
            pastePanel.id = 'pastePanel';
            Object.assign(pastePanel.style, this.styles.pastePanel);

            const title = document.createElement('div');
            title.textContent = '展厅数据识别';
            title.style.cssText = `
                font-weight: 600;
                color: #495057;
                margin-bottom: 10px;
                font-size: 13px;
            `;

            const textarea = document.createElement('textarea');
            textarea.id = 'pasteTextarea';
            textarea.placeholder = '请在此处粘贴展厅数据...';
            Object.assign(textarea.style, this.styles.pasteTextarea);

            // 聚焦效果
            textarea.addEventListener('focus', () => {
                textarea.style.borderColor = '#007bff';
                textarea.style.boxShadow = '0 0 0 2px rgba(0, 123, 255, 0.25)';
            });

            textarea.addEventListener('blur', () => {
                textarea.style.borderColor = '#e1e5e9';
                textarea.style.boxShadow = 'none';
            });

            const button = document.createElement('button');
            button.textContent = '识别数据';
            Object.assign(button.style, this.styles.pasteButton);

            button.addEventListener('click', () => {
                const content = textarea.value.trim();
                this.processPastedContent(content);
                this.hidePastePanel();
                textarea.value = '';
            });

            // 按钮悬停效果
            button.addEventListener('mouseenter', () => {
                button.style.backgroundColor = '#0056b3';
                button.style.transform = 'translateY(-1px)';
            });

            button.addEventListener('mouseleave', () => {
                button.style.backgroundColor = '#007bff';
                button.style.transform = 'translateY(0)';
            });

            pastePanel.appendChild(title);
            pastePanel.appendChild(textarea);
            pastePanel.appendChild(button);
            document.body.appendChild(pastePanel);

            // 点击外部关闭面板
            document.addEventListener('click', (e) => {
                if (!pastePanel.contains(e.target) && e.target.id !== 'floatingBtn') {
                    this.hidePastePanel();
                }
            });
        }

        // 切换粘贴面板显示状态
        togglePastePanel() {
            const pastePanel = document.getElementById('pastePanel');
            const isVisible = pastePanel.style.display === 'block';

            if (isVisible) {
                this.hidePastePanel();
            } else {
                this.showPastePanel();
            }
        }

        // 显示粘贴面板
        showPastePanel() {
            const pastePanel = document.getElementById('pastePanel');
            const textarea = document.getElementById('pasteTextarea');

            pastePanel.style.display = 'block';
            pastePanel.style.opacity = '0';
            pastePanel.style.transform = 'translateY(-10px)';

            // 动画效果
            setTimeout(() => {
                pastePanel.style.transition = 'all 0.3s ease';
                pastePanel.style.opacity = '1';
                pastePanel.style.transform = 'translateY(0)';
                textarea.focus();
            }, 10);
        }

        // 隐藏粘贴面板
        hidePastePanel() {
            const pastePanel = document.getElementById('pastePanel');
            pastePanel.style.transition = 'all 0.3s ease';
            pastePanel.style.opacity = '0';
            pastePanel.style.transform = 'translateY(-10px)';

            setTimeout(() => {
                pastePanel.style.display = 'none';
            }, 300);
        }

        // 处理粘贴的内容
        processPastedContent(content) {
            console.log('处理粘贴内容:', content);

            // 解析内容并生成表格
            const parsedInput = Utils.parseInputText(content);

            // 如果当前已有表格，则更新展厅数据
            const existingTable = document.querySelector('#displayArea table');
            if (existingTable) {
                this.updateHallDataInTable(parsedInput);
                this.showToast('展厅数据已更新');
            } else {
                // 如果没有表格，则生成新表格
                this.generateTableWithData(parsedInput);
                this.showToast('表格已生成');
            }
        }

        // 更新表格中的展厅数据
        updateHallDataInTable(parsedInput) {
            const table = document.querySelector('#displayArea table');
            if (!table) return;

            const hallCell = table.querySelector('tbody tr td:nth-child(8)');
            const timeCell = table.querySelector('tbody tr td:nth-child(9)');

            if (hallCell) {
                // 更新接待信息
                if (parsedInput.halls) {
                    hallCell.innerHTML = `${parsedInput.halls}`;
                } else {
                    // 如果没有解析到展厅数据，保持选择框
                    const city = Utils.safeGetElement('#CITY_SHOW');
                    const receptionOptions = city === '北京' ? OPTIONS.receptionOptionsBeijing : OPTIONS.receptionOptionsOther;
                    hallCell.innerHTML = Utils.createSelect(receptionOptions);
                }
            }

            if (timeCell) {
                // 更新时间
                const timeInput = timeCell.querySelector('input');
                if (timeInput && parsedInput.times) {
                    timeInput.value = parsedInput.times;
                    timeInput.readOnly = true;
                }
            }
        }

        // 处理接收到的消息
        handleMessage(event) {
            if (!event.data) return;

            switch (event.data.type) {
                case 'directGeneration':
                    // 直接生成表格，包含陪同领导信息
                    this.handleDirectGeneration(event.data.data, event.data.leaders);
                    break;

                default:
                    console.log('未知消息类型:', event.data.type);
            }
        }

        // 处理直接生成请求
        handleDirectGeneration(data, accompanyLeaders = '') {
            console.log('收到直接生成请求，数据:', data, '陪同领导:', accompanyLeaders);

            // 延迟一小段时间后自动生成表格
            setTimeout(() => {
                try {
                    // 如果有数据就解析，没有数据就用空数据
                    const parsedInput = data ? Utils.parseInputText(data) : { halls: '', times: '' };

                    // 直接使用解析后的数据生成表格，包含陪同领导信息
                    this.generateTableWithData(parsedInput, accompanyLeaders);
                    console.log('表格自动生成成功');
                } catch (error) {
                    console.error('自动生成表格失败:', error);
                    // 即使失败也尝试生成空表格
                    this.generateTableWithData({ halls: '', times: '' });
                }
            }, 500);
        }

        // 使用指定数据生成表格
        generateTableWithData(parsedInput, accompanyLeaders = '') {
            const getData = (selector, prop = 'textContent') =>
                Utils.safeGetElement(selector, prop);

            const date = Utils.formatDate(getData('#STARTTIME'));
            const customerUnit = getData('#LBDW', 'value');
            let businessType = getData('#SYYWDY');
            const members = getData('#ALLNUM');
            const applicant = (getData('#ADD_ID').match(/[\u4e00-\u9fa5]+/g)?.join('')) ||
                            (getData('#ADD_ID').match(/[a-zA-Z]+/g)?.join(' ')) ||
                            getData('#ADD_ID');
            const applicantName = Array.isArray(applicant) ? applicant.join(' ') : applicant;
            const initiatingUnitRaw = getData('#SYBM', 'value');
            const initiatingUnit = Utils.processInitiatingUnit(initiatingUnitRaw);
            const city = getData('#CITY_SHOW');
            const khLevel = Utils.getCustomerLevel();
            const selectedAttendant = Utils.getAttendantInfo();

            // 业务类型映射
            businessType = DATA_MAPPINGS.businessTypeMapping[businessType] || businessType;

            // 获取客户属性
            let customerAttributes = '未提供';
            Object.keys(DATA_MAPPINGS.customerAttributesMapping).forEach(key => {
                const radioButton = document.querySelector(`input[name="YWFL"][value="${key}"]:checked`);
                if (radioButton) {
                    customerAttributes = DATA_MAPPINGS.customerAttributesMapping[key];
                }
            });

            // 根据城市选择相应选项
            const attendantOptions = city === '北京' ? OPTIONS.attendantOptionsBeijing : OPTIONS.attendantOptionsOther;
            const receptionOptions = city === '北京' ? OPTIONS.receptionOptionsBeijing : OPTIONS.receptionOptionsOther;

            this.createDisplayTable({
                date, customerUnit, businessType, members, applicant: applicantName,
                khLevel, reception: parsedInput.halls, time: parsedInput.times,
                customerAttributes, initiatingUnit, selectedAttendant,
                attendantOptions, receptionOptions,
                accompanyLeaders: accompanyLeaders
            });
        }

        // 初始化
        async initialize() {
            try {
                if (this.isFormPage) {
                    console.log('表单页面检测到，提取数据并尝试直接处理');
                    this.extractDataAndProcess();
                } else {
                    console.log('主页面检测到，初始化界面');
                    this.createInterface();

                    // 检查是否启用Notion功能
                    if (typeof NotionService !== 'undefined' && NotionService.isConfigured()) {
                        setTimeout(() => NotionService.syncFromPage(), NotionService.NOTION_CONFIG.SYNC_DELAY);
                    }
                }
            } catch (error) {
                console.error('初始化错误:', error);
            }
        }
    }

    // 主程序入口
    class App {
        constructor() {
            this.extractor = new ReceptionDataExtractor();
            this.setupEventListeners();
        }

        setupEventListeners() {
            // 消息监听
            window.addEventListener('message', (event) => {
                this.extractor.handleMessage(event);
            });

            // 页面加载完成后初始化
            if (document.readyState === 'loading') {
                window.addEventListener('load', () => {
                    setTimeout(() => this.extractor.initialize(), CONFIG.AUTO_EXTRACT_DELAY);
                });
            } else {
                setTimeout(() => this.extractor.initialize(), CONFIG.AUTO_EXTRACT_DELAY);
            }
        }
    }

    // 启动应用
    try {
        new App();
        console.log('Reception Data Extractor initialized successfully');
    } catch (error) {
        console.error('Failed to initialize Reception Data Extractor:', error);
    }



    // ==================================================
    // Notion相关功能（发行版可整体注释或删除此部分）
    // ==================================================
    class NotionService {
        // Notion配置参数
        static NOTION_CONFIG = {
            API_KEY: 'secret_wy4UEm2l2TroTz7CFHsNadbnCgwNhcRN6bsao8zN0fL',
            DATABASE_ID: '8e8edae2832547bcb47ce9b36cf0bf6d',
            API_VERSION: '2022-06-28',
            SYNC_DELAY: 1000
        };

        // 检查Notion配置是否完整
        static isConfigured() {
            return !!this.NOTION_CONFIG.API_KEY && !!this.NOTION_CONFIG.DATABASE_ID;
        }

        // 发送API请求
        static async makeRequest(url, options) {
            if (!this.isConfigured()) {
                throw new Error('Notion功能未配置，无法使用');
            }

            return new Promise((resolve, reject) => {
                if (typeof GM_xmlhttpRequest === 'undefined') {
                    reject(new Error('GM_xmlhttpRequest not available'));
                    return;
                }

                GM_xmlhttpRequest({
                    method: options.method || 'POST',
                    url: url,
                    headers: {
                        "Authorization": `Bearer ${this.NOTION_CONFIG.API_KEY}`,
                        "Notion-Version": this.NOTION_CONFIG.API_VERSION,
                        "Content-Type": "application/json",
                        ...options.headers
                    },
                    data: options.data ? JSON.stringify(options.data) : undefined,
                    onload: (response) => {
                        try {
                            const data = JSON.parse(response.responseText);
                            resolve({ status: response.status, data });
                        } catch (error) {
                            resolve({ status: response.status, data: response.responseText });
                        }
                    },
                    onerror: reject
                });
            });
        }

        // 检查记录是否已存在
        static async checkExistingRecord(phone) {
            if (!this.isConfigured()) return false;

            const response = await this.makeRequest(
                `https://api.notion.com/v1/databases/${this.NOTION_CONFIG.DATABASE_ID}/query`,
                {
                    data: {
                        filter: {
                            property: "手机",
                            phone_number: { equals: phone }
                        }
                    }
                }
            );

            return response.data.results?.length > 0;
        }

        // 创建新记录
        static async createRecord(data) {
            if (!this.isConfigured()) return false;

            const response = await this.makeRequest("https://api.notion.com/v1/pages", {
                data: {
                    parent: { database_id: this.NOTION_CONFIG.DATABASE_ID },
                    properties: data
                }
            });

            if (response.status === 200) {
                console.log("数据成功添加到Notion");
                return true;
            } else {
                console.error("添加到Notion失败:", response.data);
                return false;
            }
        }

        // 从页面提取数据并同步到Notion
        static async syncFromPage() {
            if (!this.isConfigured()) return;

            try {
                const nameElement = document.getElementById('ADD_ID');
                const phoneElement = document.getElementById('PHONENUM');
                const departmentElement = document.getElementById('SYBM');

                if (!nameElement || !phoneElement || !departmentElement) {
                    console.log('Notion同步：页面元素未找到，可能页面尚未完全加载');
                    return;
                }

                const fullName = nameElement.textContent.trim();
                const chineseName = fullName.match(/[\u4e00-\u9fa5]+/)?.[0] || '';

                if (!chineseName) {
                    console.log('无法获取到中文名，取消同步到Notion。');
                    return;
                }

                const { lastName, firstName } = Utils.splitChineseName(chineseName);
                const phone = phoneElement.textContent.trim();
                const department = departmentElement.tagName.toLowerCase() === 'input'
                    ? departmentElement.value.trim()
                    : departmentElement.textContent.trim();
                const companyDepartment = `新华三·${department}`;

                // 检查记录是否已存在
                const exists = await this.checkExistingRecord(phone);
                if (exists) {
                    console.log("数据已存在，不重复添加");
                    return;
                }

                // 创建新记录
                const data = {
                    "姓名": { title: [{ text: { content: chineseName } }] },
                    "名字": { rich_text: [{ text: { content: firstName } }] },
                    "姓氏": { rich_text: [{ text: { content: lastName } }] },
                    "手机": { phone_number: phone },
                    "部门": { rich_text: [{ text: { content: department } }] },
                    "公司": { rich_text: [{ text: { content: "新华三" } }] },
                    "公司·部门": { rich_text: [{ text: { content: companyDepartment } }] }
                };

                await this.createRecord(data);

            } catch (error) {
                console.error("Notion同步出错:", error);
            }
        }
    }
    // ==================================================
    // Notion功能结束
    // ==================================================

})();