// ==UserScript==
// @name         四川航空web端半自动下单
// @namespace    http://tampermonkey.net/
// @version      0.0.1
// @author       Mz_xing
// @description  四川航空半自动下单
// @match        https://www.sichuanair.com/
// @match        https://flights.sichuanair.com/3uair/ibe/checkout/passengerDetailsPage.do?*
// @match        https://flights.sichuanair.com/3uair/ibe/ticket/*
// @match        https://flights.sichuanair.com/3uair/ibe/checkout/shoppingCart.do?*
// @match        https://flights.sichuanair.com/3uair/ibe/checkout/passengerDetailsPage.do?*
// @match        https://flights.sichuanair.com/3uair/ibe/checkout/airOrderAncillaries.do?*
// @downloadURL https://update.greasyfork.org/scripts/423378/%E5%9B%9B%E5%B7%9D%E8%88%AA%E7%A9%BAweb%E7%AB%AF%E5%8D%8A%E8%87%AA%E5%8A%A8%E4%B8%8B%E5%8D%95.user.js
// @updateURL https://update.greasyfork.org/scripts/423378/%E5%9B%9B%E5%B7%9D%E8%88%AA%E7%A9%BAweb%E7%AB%AF%E5%8D%8A%E8%87%AA%E5%8A%A8%E4%B8%8B%E5%8D%95.meta.js
// ==/UserScript==

(function () {
    'use strict';

    var codeDic = {
        'PEK': 'CITY_BJS_CN',
        'CTU': 'CITY_CTU_CN',
        'CGQ': 'CITY_CGQ_CN',
        'CSX': 'CITY_CSX_CN',
        'CKG': 'CITY_CKG_CN',
        'DLC': 'CITY_DLC_CN',
        'CAN': 'CITY_CAN_CN',
        'KWE': 'CITY_KWE_CN',
        'HRB': 'CITY_HRB_CN',
        'HAK': 'CITY_HAK_CN',
        'HGH': 'CITY_HGH_CN',
        'TNA': 'CITY_TNA_CN',
        'KMG': 'CITY_KMG_CN',
        'LXA': 'CITY_LXA_CN',
        'LJG': 'CITY_LJG_CN',
        'KHN': 'CITY_KHN_CN',
        'NKG': 'CITY_NKG_CN',
        'NNG': 'CITY_NNG_CN',
        'NGB': 'CITY_NGB_CN',
        'SYX': 'CITY_SYX_CN',
        'SHA': 'CITY_SHA_CN',
        'SZX': 'CITY_SZX_CN',
        'SHE': 'CITY_SHE_CN',
        'TSN': 'CITY_TSN_CN',
        'TSA': 'CitTwTaibei209',
        'TPE': 'CitTwTaibei209',
        'WNZ': 'CITY_WNZ_CN',
        'URC': 'CITY_URC_CN',
        'XMN': 'CITY_XMN_CN',
        'XIY': 'CITY_SIA_CN',
        'XNN': 'CITY_XNN_CN',
        'HKG': 'CitHkHongkon422',
        'INC': 'CITY_INC_CN',
        'AAT': 'CITY_AAT_CN',
        'AKU': 'CITY_AKU_CN',
        'AXF': 'CitCnALASHAN825',
        'AOG': 'CITY_AOG_CN',
        'AKA': 'CITY_AKA_CN',
        'BAR': 'CitCnBOAO946',
        'CHG': 'CITY_CHG_CN',
        'BZX': 'CitCnBAZHONG274',
        'BHY': 'CITY_BHY_CN',
        'BFJ': 'CitCnBIJIE044',
        'BSD': 'CitCnBAOSHAN261',
        'BAV': 'CITY_BAV_CN',
        'AEB': 'CitCnBAISE045',
        'BPX': 'CitCnCHANGDU259',
        'CIH': 'CitCnCHANGZH373',
        'CZX': 'CITY_CZX_CN',
        'NBS': 'CitCnCHANGBA768',
        'CIF': 'CITY_CIF_CN',
        'CGD': 'CITY_CGD_CN',
        'DAT': 'CITY_DAT_CN',
        'DNH': 'CITY_DNH_CN',
        'DOY': 'CITY_DOY_CN',
        'DAX': 'CitCnDAZHOU180',
        'DCY': 'CitCnDAOCHEN354',
        'DIG': 'CITY_DIG_CN',
        'DLU': 'CITY_DLU_CN',
        'DDG': 'CITY_DDG_CN',
        'DSN': 'CitCnEERDUOS393',
        'ENH': 'CITY_ENH_CN',
        'FUG': 'CITY_FUG_CN',
        'FOC': 'CITY_FOC_CN',
        'GYS': 'CitCnGUANGYU504',
        'KOW': 'CITY_KOW_CN',
        'KHH': 'CITY_KHH_TW',
        'KWL': 'CITY_KWL_CN',
        'GYU': 'CitCnGUYUAN194',
        'GZG': 'CitCnGESAER160',
        'HLD': 'CITY_HLD_CN',
        'HET': 'CITY_HET_CN',
        'HFE': 'CITY_HFE_CN',
        'HDG': 'CitCnHANDAN147',
        'AHJ': 'CitCnHONGYUA402',
        'HIA': 'CitCnHUAIAN159',
        'HUZ': 'CitCnHUIZHOU309',
        'TXN': 'CITY_TXN_CN',
        'HMI': 'CITY_HMI_CN',
        'HEK': 'CitCnHEIHE044',
        'HNY': 'CitCnHENGYAN378',
        'HTN': 'CITY_HTN_CN',
        'JGN': 'CITY_JGN_CN',
        'JJN': 'CitCnQUANZHO420',
        'JZH': 'CitCnJIUZHAI616',
        'JNG': 'CITY_JNG_CN',
        'JGS': 'CitCnJINGGAN792',
        'YIW': 'CITY_YIW_CN',
        'JXA': 'CitCnJIXI965',
        'SWA': 'CITY_SWA_CN',
        'JDZ': 'CITY_JDZ_CN',
        'JIU': 'CITY_JIU_CN',
        'JGD': 'CitCnJIAGEDA456',
        'JSJ': 'CitCnJIANSAN790',
        'JIC': 'CitCnJINCHAN363',
        'KJI': 'CitCnKANASI160',
        'KHG': 'CITY_KHG_CN',
        'KJH': 'CitCnKAILI051',
        'KGT': 'CitCnKANGDIN364',
        'KRL': 'CITY_KRL_CN',
        'KCA': 'CITY_KCA_CN',
        'LHW': 'CITY_LHW_CN',
        'LYI': 'CITY_LYI_CN',
        'LCX': 'CitCnLIANCHE466',
        'LZY': 'CitCn485',
        'LZO': 'CITY_LZO_CN',
        'LYG': 'CITY_LYG_CN',
        'LZH': 'CitCnLIUZHOU313',
        'LLV': 'CitCnLIULIAN382',
        'LFQ': 'CitCnLINFEN165',
        'LLB': 'CitCnLIBO951',
        'LPF': 'CitCnLIUPANS619',
        'JMJ': 'CitCnLANCANG253',
        'LNL': 'CitCnLONGNAN278',
        'MIG': 'CitCnMIANYAN381',
        'NZH': 'CitCnMANZHOU512',
        'LUM': 'CITY_LUM_CN',
        'MXZ': 'CITY_MXZ_CN',
        'NAO': 'CitCnNANCHON373',
        'NTG': 'CITY_NTG_CN',
        'NNY': 'CITY_NNY_CN',
        'PZI': 'CitCnPANZHIH497',
        'SYM': 'CITY_SYM_CN',
        'JIQ': 'CitCnQIANJIA475',
        'TAO': 'CITY_TAO_CN',
        'NDG': 'CitCnQIQIHAE381',
        'IQN': 'CITY_IQN_CN',
        'JUZ': 'CitCnQUZHOU213',
        'RIZ': 'CitCnRIZHAO182',
        'HPG': 'CitCnHONGPIN387',
        'SJW': 'CitCnSHIJIAZ814',
        'QSZ': 'CitCnSHACHE149',
        'THQ': 'CitCnTIANSHU398',
        'TVS': 'CitCnTANGSHA381',
        'TYN': 'CITY_TYN_CN',
        'HYN': 'CitCn047',
        'RMQ': 'CitTwTAIZHON423',
        'TCZ': 'CitCnTENGCHO486',
        'TEN': 'CitCnTONGREN294',
        'TLQ': 'CitCnTULUFAN296',
        'WNH': 'CitCn185',
        'WUA': 'CitCnWUHAI071',
        'WUH': 'CITY_WUH_CN',
        'WEH': 'CITY_WEH_CN',
        'WGN': 'CitCnWUGANG178',
        'WUX': 'CitCnWUXI990',
        'WXN': 'poiCnWANZHOU317',
        'WUZ': 'CitCnWUZHOU219',
        'WUS': 'CitCnWUYISHA417',
        'HLH': 'CITY_HLH_CN',
        'DTU': 'CitCnWUDALIA690',
        'WEF': 'CitCnWEIFANG266',
        'WSK': 'CitCnWUSHAN191',
        'SQJ': 'CitCnSANMING278',
        'SQD': 'CitCnSHANGRA380',
        'WDS': 'CitCnSHIYAN181',
        'PVG': 'CITY_SHA_CN',
        'JHG': 'CITY_JHG_CN',
        'XUZ': 'CITY_XUZ_CN',
        'XIC': 'CitCnXICHANG267',
        'GXH': 'CitCnXIAHE056',
        'XFN': 'CITY_XFN_CN',
        'ACX': 'CitCnXINGYI193',
        'WUT': 'CitCnWUTAISH509',
        'YKH': 'CitCnYINGKOU303',
        'UYN': 'CITY_UYN_CN',
        'YCU': 'CitCnYUNCHEN394',
        'YBP': 'CITY_YBP_CN',
        'YIH': 'CITY_YIH_CN',
        'YNJ': 'CITY_YNJ_CN',
        'YIC': 'CitCnYICHUN185',
        'YTY': 'CitCnYANGZHO414',
        'YUS': 'CitCnYUSHUZA786',
        'YNZ': 'CITY_YNZ_CN',
        'YNT': 'CITY_YNT_CN',
        'LLF': 'CitCnYONGZHO428',
        'ENY': 'CITY_ENY_CN',
        'YLX': 'CitCnYULIN090',
        'CGO': 'CITY_CGO_CN',
        'DYG': 'CITY_DYG_CN',
        'ZHY': 'CitCnZHONGWE404',
        'ZUH': 'CITY_ZUH_CN',
        'HSN': 'CitCnZHOUSHA409',
        'ZHA': 'CITY_ZHA_CN',
        'ZYI': 'CitCnZUNYIXI470',
        'WMT': 'CitCnMAOTAI164',
        'ZAT': 'CitCnZHAOTON403',
        'ZQZ': 'CitCnZHANGJI708',
        'YZY': 'CitCnZHANGYE287',
        'CNX': 'CitTh18Chian351',
        'DXB': 'CitAe25Dubai812',
        'CJU': 'CitKrCHEJU068',
        'MLE': 'CITY_MLE_MV',
        'SIN': 'CitSgSingapo506',
        'NRT': 'CitJpNarita177',
        'KIX': 'CitJpOsaka065',
        'PRG': 'CITY_PRG_CZ',
        'SGN': 'CitVnHoChiMi563',
        'KTM': 'CitNp27Kathm021',
        'KBV': 'CitTh8Krabi6781',
        'BKK': 'CITY_BKK_TH',
        'SVO': 'CITY_MOW_RU',
        'MEL': 'CitAuVcMelbo923',
        'HKT': 'CITY_HKT_TH',
        'ICN': 'CitKrSeoul093',
        'YVR': 'CitCaVancouv501',
        'SYD': 'CIT_AU_NS_Sydn',
        'CXR': 'CitVn12NhaTr159',
        'TAE': 'CitKr35Daegu828',
        'DAD': 'CitVn16DaNan972',
        'PUS': 'CITY_PUS_KR',
        'HAN': 'CitVnHenei069',
        'CMB': 'CitLkColombo282',
        'FSZ': 'CitJpShizuok779',
        'KLO': 'CitPhKalibo162',
        'MDL': 'CitMmMandala377',
        'NGO': 'CitJpNagoya177',
        'KUL': 'CitMyKualaLu785',
        'CJJ': 'CitKr36Cheon079',
        'CEI': 'poiThChiangR514',
        'CEB': 'CitPhCebu951',
        'TLV': 'CITY_TLV_IL',
        'MWX': 'CitKrWuan984',
        'KOS': 'CitKhSihanou937',
        'RGN': 'CitMmYangon190',
        'CGK': 'CitIdYAJIADA248',
        'VVO': 'CitRuVladivo757',
        'VTE': 'CitLaVientia488',
        'CTS': 'CitJpSapporo310',
        'IST': 'CitTrIstanbu416',
        'CPH': 'CITY_CPH_DK',
        'HEL': 'CITY_HEL_FI',
        'LED': 'REG_RU_StPeter',
        'ZRH': 'CITY_ZRH_CH',
        'FCO': 'CITY_ROM_IT',
        'VIE': 'REG_AT_Vienna',
        'ATH': 'CITY_ATH_GR',
        'LAX': 'CitUsLosAnge653',
        'CAI': 'CitEgCairo050',
        'AKL': 'CitNzAucklan387',
        'ADL': 'CitAuAdelaid343',
        'PER': 'CitAuPerth081',
        'SPN': 'CitMp15Saipa000'
    };
    var allCityDic = {
        'PEK': '北京',
        'MY2': '北京',
        'PKX': '北京',
        'PVG': '上海',
        'SHA': '上海',
        'HDG': '邯郸',
        'CIH': '长治',
        'SJW': '石家庄',
        'CKG': '重庆',
        'KMG': '昆明',
        'CTU': '成都',
        'XIY': '西安',
        'SZX': '深圳',
        'HKG': '香港',
        'XMN': '厦门',
        'KNH': '金门',
        'HGH': '杭州',
        'DEQ': '湖州',
        'LZO': '泸州',
        'NAO': '南充',
        'TAO': '青岛',
        'DBC': '白城',
        'HLH': '乌兰浩特',
        'YSQ': '松原',
        'HRB': '哈尔滨',
        'CGO': '郑州',
        'HSJ': '郑州',
        'CAN': '广州',
        'FUO': '佛山',
        'BZX': '巴中',
        'GYS': '广元',
        'TSN': '天津',
        'TNA': '济南',
        'HAK': '海口',
        'KWE': '贵阳',
        'CSX': '长沙',
        'URC': '乌鲁木齐',
        'NKG': '南京',
        'AKU': '阿克苏',
        'AQG': '安庆',
        'AAT': '阿勒泰',
        'AOG': '鞍山',
        'AHJ': '红原',
        'AVA': '安顺',
        'YIE': '阿尔山',
        'NGQ': '阿里',
        'RHT': '阿拉善右旗',
        'AXF': '阿拉善左旗',
        'MFM': '澳门',
        'ZUH': '珠海',
        'JNG': '济宁',
        'LYI': '临沂',
        'BAV': '包头',
        'BHY': '北海',
        'WEF': '潍坊',
        'RIZ': '日照',
        'ET1': '鄂托克前旗',
        'WUA': '乌海',
        'INC': '银川',
        'BSD': '保山',
        'AEB': '百色',
        'RLK': '巴彦淖尔',
        'BFJ': '毕节',
        'BPL': '博乐',
        'TVS': '唐山',
        'CGQ': '长春',
        'CZX': '常州',
        'CGD': '常德',
        'CIF': '赤峰',
        'AEQ': '赤峰',
        'CHG': '朝阳',
        'NBS': '白山',
        'JUH': '池州',
        'BPX': '昌都',
        'CDE': '承德',
        'PQ1': '承德',
        'HNY': '衡阳',
        'LLF': '永州',
        'WGN': '邵阳',
        'CWJ': '沧源',
        'DLC': '大连',
        'DDG': '丹东',
        'DLU': '大理',
        'DAT': '大同',
        'XNN': '西宁',
        'HBQ': '祁连',
        'JIC': '金昌',
        'DOY': '东营',
        'DNH': '敦煌',
        'WSK': '巫山',
        'HPG': '神农架',
        'ENH': '恩施',
        'DAX': '达州',
        'DQA': '大庆',
        'DCY': '稻城',
        'JUZ': '衢州',
        'YIW': '义乌',
        'HEW': '东阳',
        'HXD': '德令哈',
        'JM1': '荆门',
        'XFN': '襄樊',
        'WUH': '武汉',
        'DSN': '鄂尔多斯',
        'ERL': '二连浩特',
        'NNY': '南阳',
        'XAI': '信阳',
        'UYN': '榆林',
        'LLV': '吕梁',
        'ENY': '延安',
        'ZD1': '肇东',
        'EJN': '额济纳旗',
        'FOC': '福州',
        'MFK': '马祖',
        'LZN': '南竿',
        'FUG': '阜阳',
        'SQD': '上饶',
        'WUS': '武夷山',
        'FYN': '富蕴',
        'FYJ': '抚远',
        'KWL': '桂林',
        'KOW': '赣州',
        'SHE': '沈阳',
        'YKH': '营口',
        'YYA': '岳阳',
        'JIU': '九江',
        'ZQZ': '张家口',
        'TXN': '黄山',
        'JDZ': '景德镇',
        'GOQ': '格尔木',
        'MIG': '绵阳',
        'GXH': '夏河',
        'LHW': '兰州',
        'WNH': '文山',
        'ACX': '兴义',
        'GYU': '固原',
        'GMQ': '果洛',
        'KHH': '高雄',
        'TNN': '台南',
        'WDS': '十堰',
        'HFE': '合肥',
        'HET': '呼和浩特',
        'HTN': '和田',
        'TNH': '通化',
        'HLD': '海拉尔',
        'JNZ': '锦州',
        'LYA': '洛阳',
        'HUZ': '惠州',
        'HZG': '汉中',
        'JZH': '九寨沟',
        'HEK': '黑河',
        'HMI': '哈密',
        'HIA': '淮安',
        'HCJ': '河池',
        'HJJ': '怀化',
        'DYG': '张家界',
        'HUN': '花莲',
        'YNJ': '延吉',
        'MDG': '牡丹江',
        'HYN': '台州',
        'HTT': '花土沟',
        'HUO': '霍林郭勒',
        'YIN': '伊宁',
        'SWA': '揭阳',
        'JMU': '佳木斯',
        'SH1': '佳木斯',
        'JHG': '西双版纳',
        'WUX': '无锡',
        'YIC': '宜春',
        'JGS': '井冈山',
        'JGN': '嘉峪关',
        'KHN': '南昌',
        'JGD': '加格达奇',
        'DF1': '丹凤',
        'JXA': '鸡西',
        'LFQ': '临汾',
        'YCU': '运城',
        'ZHA': '湛江',
        'KRL': '库尔勒',
        'JJN': '泉州',
        'CYI': '嘉义',
        'JSJ': '建三江',
        'KHG': '喀什',
        'KCA': '库车',
        'KRY': '克拉玛依',
        'KJI': '布尔津',
        'KGT': '康定',
        'KJH': '凯里',
        'LJG': '丽江',
        'LZH': '柳州',
        'LXA': '拉萨',
        'LYG': '连云港',
        'LNJ': '临沧',
        'HZH': '黎平',
        'LLB': '荔波',
        'WXN': '万州',
        'LZY': '林芝',
        'WNZ': '温州',
        'LPF': '六盘水',
        'YNT': '烟台',
        'JMJ': '澜沧',
        'LCX': '龙岩',
        'NGB': '宁波',
        'NZH': '满洲里',
        'LUM': '芒市',
        'MXZ': '梅州',
        'OHE': '漠河',
        'MZG': '马公',
        'WMT': '遵义',
        'ZYI': '遵义',
        'NNG': '南宁',
        'NTG': '南通',
        'NLH': '宁蒗',
        'PZI': '攀枝花',
        'SYM': '普洱',
        'XUZ': '徐州',
        'NDG': '齐齐哈尔',
        'BPE': '秦皇岛',
        'IQN': '庆阳',
        'IQM': '且末',
        'JIQ': '黔江',
        'BAR': '琼海',
        'RKZ': '日喀则',
        'SYX': '三亚',
        'SHF': '石河子',
        'SQJ': '三明',
        'XIL': '锡林浩特',
        'QSZ': '莎车',
        'TYN': '太原',
        'TYC': '太原',
        'TGO': '通辽',
        'TEN': '铜仁',
        'TCZ': '腾冲',
        'TCG': '塔城',
        'TLQ': '吐鲁番',
        'THQ': '天水',
        'TPE': '台北',
        'TSA': '台北',
        'TTT': '台东',
        'RMQ': '台中',
        'YTY': '扬州',
        'LNL': '陇南',
        'WEH': '威海',
        'WUZ': '梧州',
        'ZHY': '中卫',
        'UCB': '乌兰察布',
        'WZQ': '乌拉特中旗',
        'XIC': '西昌',
        'DIG': '迪庆',
        'WUT': '忻州',
        'NLT': '新源',
        'YIH': '宜昌',
        'YBP': '宜宾',
        'YNZ': '盐城',
        'LDS': '伊春',
        'YUS': '玉树',
        'HSN': '舟山',
        'ZAT': '昭通',
        'YZY': '张掖',
        'NZL': '扎兰屯',
        'GZG': '甘孜',
        'HN3': '武汉',
        'GH1': '根河',
        'TWC': '图木舒克',
        'DTU': '五大连池',
        'YC2': '盐池',
        'RQA': '若羌'
    };

    function setCookie(cname, cvalue, exdays, domain) {
        let d = new Date();
        d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
        let expires = "expires=" + d.toGMTString();
        document.cookie = cname + "=" + cvalue + ";Path=/;domain=" + domain + ";" + expires;
    }

    function getCookie(cname) {
        let name = cname + "=";
        let ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i].trim();
            if (c.indexOf(name) === 0) return c.substring(name.length, c.length);
        }
        return "";
    }

    // 搜索价格信息
    function selectPriceUrl(flightInfo) {
        console.log("选择出发抵达,以及日期");
        // 出发
        jQuery("#Search-OriginDestinationInformation-Origin-location_input_location").val(allCityDic[flightInfo.depAirport]);
        jQuery("#Search-OriginDestinationInformation-Origin-location").val(codeDic[flightInfo.depAirport]);
        jQuery("#Search-OriginDestinationInformation-Origin-location_input_location").attr("data-airportcode", codeDic[flightInfo.depAirport]);
        jQuery("#Search-OriginDestinationInformation-Origin-location_input_location").focusout();

        // 抵达
        jQuery("#Search-OriginDestinationInformation-Destination-location_input_location").val(allCityDic[flightInfo.arrAirport]);
        jQuery("#Search-OriginDestinationInformation-Destination-location").val(codeDic[flightInfo.arrAirport]);
        jQuery("#Search-OriginDestinationInformation-Destination-location_input_location").attr("data-airportcode", codeDic[flightInfo.arrAirport]);
        jQuery("#Search-OriginDestinationInformation-Destination-location_input_location").focusout();

        // 日期
        jQuery("input[name='Search/DateInformation/departDate_display']").val(flightInfo.depDate);
        jQuery("input[name='Search/DateInformation/departDate']").val(flightInfo.depDate);

        // 乘客人数
        let manNum = 0;
        let childNum = 0;

        for (let passengerInfo of flightInfo.passengerInfos) {
            if (passengerInfo.ageType === "ADULT") {
                manNum += 1;
            } else if (passengerInfo.ageType === "CHILD") {
                childNum += 1;
            }
        }
        // 成人数量
        jQuery("input[name='Search/Passengers/adults']").val(manNum);

        // 儿童数量
        jQuery("input[name='Search/Passengers/children']").val(childNum);

        // 婴儿数量
        jQuery("input[name='Search/Passengers/infants']").val("0");

        // 优惠码
        jQuery("input[name='Search/promotionCode']").val("");

        // 提交
        submitForm();
    }

    // 选择价格信息
    function selectPrice(flightNo) {
        let allTbdSection = jQuery(".tbd-section");
        for (let tbdSectionIndex in allTbdSection) {
            let _tbdSection = allTbdSection.eq(tbdSectionIndex);
            if (_tbdSection.find(".flight-code").text() === flightNo) {
                let _allPriceTd = _tbdSection.find(".vip-td");
                // 最低价格
                let minPriceStr = _tbdSection.attr("lowestprice");
                // 点击价格展开预定
                _allPriceTd.eq(_allPriceTd.length - 1).click();
                // 获取相同价格
                window.setTimeout(
                    function () {
                        selectCreatePrice(minPriceStr);
                    },
                    1500
                );
            }
        }
    }

    /*
        选择价格
     */
    function selectCreatePrice(targetPrice) {
        let allTbDataDetail = document.getElementsByClassName("tb-data-detail");
        for (let tbDataDetail of allTbDataDetail) {
            if (tbDataDetail.getAttribute("style") !== "display: block;") {
                continue
            }
            // 选择预定
            for (let tbDataDetailChild of tbDataDetail.childElements()) {
                // let _nowPrice = tbDataDetailChild.getElementsByClassName("price")[0].querySelector("span").textContent;
                let _nowPrice = tbDataDetailChild.getElementsByClassName("price")[0].textContent;
                if (_nowPrice.indexOf(targetPrice) !== -1) {
                    tbDataDetailChild.getElementsByClassName("tb-cell reserve-op")[0].firstElementChild.click();
                }
            }

        }
    }

    /*
        选择下一步
     */
    function shoppingCartNext() {
        let allATag = document.getElementById("btn_fligth").getElementsByTagName("a");
        for (let a of allATag) {
            if (a.textContent === "下一步") {
                a.click();
            }
        }
    }

    // 排序
    function sortUserInfo(userInfo) {
        const newUserInfo = [];
        for (let i = 0; i < userInfo.length; i++) {
            if (userInfo[i]["ageType"] === "ADULT") {
                newUserInfo.splice(0, 0, userInfo[i]);
            } else {
                newUserInfo.push(userInfo[i]);
            }
        }
        return newUserInfo
    }

    // 填写乘客信息
    function writeUserInfo(userInfoLi) {
        console.log("开始添加乘客信息");
        // 乘客信息进行排序
        userInfoLi = sortUserInfo(userInfoLi);

        for (let i in userInfoLi) {
            let userInfo = userInfoLi[parseInt(i)];
            if(!userInfo){
                continue
            }
            let passengerIndex = "product$1000$/passenger$" + (parseInt(i) + 1) + "$/";
            jQuery("input[name='" + passengerIndex + 'Customer/PersonName/Surname' + "']").val(userInfo.name);  // 姓名
            if (userInfo.cardType === "NI") {
                // 证件  护照： 2， 身份证： 5
                jQuery("input[name='" + passengerIndex + 'Passport/DocType' + "']").val("5");
            } else if (userInfo.cardType === "PP") {
                jQuery("input[name='" + passengerIndex + 'Passport/DocType' + "']").val("2");
            } else {
                alert("请手动选择 " + userInfo.name + "的证件类型")
            }

            jQuery("input[name='" + passengerIndex + 'Passport/DocID' + "']").val(userInfo.cardNum);

            if (userInfo.ageType !== "ADULT") {
                jQuery("input[name='" + passengerIndex + 'dateOfBirthPassenger/Date' + "']").val(userInfo.birthday);     // 儿童生日
            }
        }

        // 填写联系人
        jQuery("input[name='Profile/Customer/Telephone$3$/@PhoneNumber']").val("18075193789");
        // 更换联系人
        jQuery("input[name='Profile/Customer/PersonName/Surname']").val("王子");

        // 点击 同意接受条款
        jQuery("input[name='termsAndConditions']").click();
        // 点击 下一步
        document.getElementById("domesticPaxDetailSubmitform").click();

        // 不要保险
        jQuery("#noNeedInsurance").click()
    }

    // 去支付
    function airOrderAncillaries(){
        // 预约座位不要
        jQuery("#agrees").click();
        // 去支付
        jQuery("input[name='checkInProductSubmitform']").click();
    }

    // document 加载完毕后执行下面代码
    jQuery(document).ready(function () {
        // 乘客信息和航班信息
        debugger;
        var flightInfoAndUserInfo = window.localStorage.getItem("flightInfoAndUserInfo") || getCookie("flightInfoAndUserInfo");
        if (flightInfoAndUserInfo) {
            flightInfoAndUserInfo = JSON.parse(flightInfoAndUserInfo);
        }

        var nowLocationPathname = window.location.pathname;
        if ("/" === nowLocationPathname && window.location.href.indexOf("#") !== -1) {
            // 搜索价格信息
            var flightInfo = decodeURIComponent(window.location.href.split("#")[1]);
            // 保存到 cookie 中
            setCookie(
                "flightInfoAndUserInfo",
                flightInfo,
                1,
                ".sichuanair.com"
            );
            flightInfo = JSON.parse(flightInfo);
            if(flightInfo.passengerInfos.length > 5){
                return alert("最多5人下单, 儿童不得超过2人")
            }
            window.localStorage.setItem("flightInfoAndUserInfo", JSON.stringify(flightInfo));
            selectPriceUrl(flightInfo);
        } else if (nowLocationPathname.indexOf("/3uair/ibe/ticket") !== -1) {
            // 选择价格信息
            console.log("开始选择价格信息");
            window.setTimeout(
                function () {
                    try {
                        selectPrice(flightInfoAndUserInfo.flightNo)
                    } catch (e) {
                        console.log("出现异常")
                    }
                },
                1000
            );
            console.log("等待")

        } else if ("/3uair/ibe/checkout/shoppingCart.do" === nowLocationPathname) {
            shoppingCartNext();
        } else if ("/3uair/ibe/checkout/passengerDetailsPage.do" === nowLocationPathname) {
            // 填写乘客信息
            writeUserInfo(flightInfoAndUserInfo.passengerInfos);
        } else if ("/3uair/ibe/checkout/airOrderAncillaries.do" === nowLocationPathname) {
            airOrderAncillaries();
        }
    });

    var nowLocationPathname = window.location.pathname;
    if ("/3uair/ibe/checkout/passengerDetailsPage.do" === nowLocationPathname) {
        window.setTimeout(
            function () {
                debugger;
                var flightInfoAndUserInfo = window.localStorage.getItem("flightInfoAndUserInfo") || getCookie("flightInfoAndUserInfo");
                if (flightInfoAndUserInfo) {
                    flightInfoAndUserInfo = JSON.parse(flightInfoAndUserInfo);
                }
                // 填写乘客信息
                writeUserInfo(flightInfoAndUserInfo.passengerInfos);
            },
            1500
        );

    }

})();