// ==UserScript==
// @name         巴哈姆特之顯示文章ip所在國籍
// @description  根據巴哈給的文章ip顯示對應的國旗
// @namespace    nathan60107
// @author       nathan60107(貝果)
// @version      1.7.11
// @license      MIT
// @homepage     https://home.gamer.com.tw/homeindex.php?owner=nathan60107
// @match        https://forum.gamer.com.tw/C*
// @icon         https://forum.gamer.com.tw/favicon.ico
// @require      https://cdn.jsdelivr.net/npm/lodash@4.17.21/lodash.min.js
// @grant        GM_xmlhttpRequest
// @connect      ip-api.com
// @run-at       document-end
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/440562/%E5%B7%B4%E5%93%88%E5%A7%86%E7%89%B9%E4%B9%8B%E9%A1%AF%E7%A4%BA%E6%96%87%E7%AB%A0ip%E6%89%80%E5%9C%A8%E5%9C%8B%E7%B1%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/440562/%E5%B7%B4%E5%93%88%E5%A7%86%E7%89%B9%E4%B9%8B%E9%A1%AF%E7%A4%BA%E6%96%87%E7%AB%A0ip%E6%89%80%E5%9C%A8%E5%9C%8B%E7%B1%8D.meta.js
// ==/UserScript==

(function () {
  let country_flags = [
    { name: '阿富汗', code: 'AF' },
    { name: '奧蘭群島', code: 'AX' },
    { name: '阿爾巴尼亞', code: 'AL' },
    { name: '阿爾及利亞', code: 'DZ' },
    { name: '美屬薩摩亞', code: 'AS' },
    { name: '安道爾', code: 'AD' },
    { name: '安哥拉', code: 'AO' },
    { name: '安奎拉', code: 'AI' },
    { name: '南極洲', code: 'AQ' },
    { name: '安地卡及巴布達', code: 'AG' },
    { name: '阿根廷', code: 'AR' },
    { name: '亞美尼亞', code: 'AM' },
    { name: '阿魯巴', code: 'AW' },
    { name: '澳洲', code: 'AU' },
    { name: '奧地利', code: 'AT' },
    { name: '亞塞拜然', code: 'AZ' },
    { name: '巴哈馬', code: 'BS' },
    { name: '巴林', code: 'BH' },
    { name: '孟加拉', code: 'BD' },
    { name: '巴貝多', code: 'BB' },
    { name: '白俄羅斯', code: 'BY' },
    { name: '比利時', code: 'BE' },
    { name: '貝里斯', code: 'BZ' },
    { name: '貝南', code: 'BJ' },
    { name: '百慕達', code: 'BM' },
    { name: '不丹', code: 'BT' },
    { name: '玻利維亞', code: 'BO' },
    { name: '波士尼亞與赫塞哥維納', code: 'BA' },
    { name: '波札那', code: 'BW' },
    { name: '布威島', code: 'BV' },
    { name: '巴西', code: 'BR' },
    { name: '英屬印度洋領地 ', code: 'IO' },
    { name: '汶萊', code: 'BN' },
    { name: '保加利亞', code: 'BG' },
    { name: '布吉納法索', code: 'BF' },
    { name: '蒲隆地', code: 'BI' },
    { name: '柬埔寨', code: 'KH' },
    { name: '喀麥隆', code: 'CM' },
    { name: '加拿大', code: 'CA' },
    { name: '維德角', code: 'CV' },
    { name: '開曼群島', code: 'KY' },
    { name: '中非共和國', code: 'CF' },
    { name: '查德', code: 'TD' },
    { name: '智利', code: 'CL' },
    { name: '中國', code: 'CN' },
    { name: '聖誕島', code: 'CX' },
    { name: '科克斯（基靈）群島', code: 'CC' },
    { name: '哥倫比亞', code: 'CO' },
    { name: '葛摩', code: 'KM' },
    { name: '剛果共和國', code: 'CG' },
    { name: '剛果民主共和國', code: 'CD' },
    { name: '庫克群島', code: 'CK' },
    { name: '哥斯大黎加', code: 'CR' },
    { name: '象牙海岸', code: 'CI' },
    { name: '克羅埃西亞', code: 'HR' },
    { name: '古巴', code: 'CU' },
    { name: '賽普勒斯', code: 'CY' },
    { name: '捷克', code: 'CZ' },
    { name: '丹麥', code: 'DK' },
    { name: '吉布地', code: 'DJ' },
    { name: '多米尼克', code: 'DM' },
    { name: '多明尼加', code: 'DO' },
    { name: '厄瓜多', code: 'EC' },
    { name: '埃及', code: 'EG' },
    { name: '薩爾瓦多', code: 'SV' },
    { name: '赤道幾內亞', code: 'GQ' },
    { name: '厄利垂亞', code: 'ER' },
    { name: '愛沙尼亞', code: 'EE' },
    { name: '衣索比亞', code: 'ET' },
    { name: '福克蘭群島', code: 'FK' },
    { name: '法羅群島', code: 'FO' },
    { name: '斐濟', code: 'FJ' },
    { name: '芬蘭', code: 'FI' },
    { name: '法國', code: 'FR' },
    { name: '法屬圭亞那', code: 'GF' },
    { name: '法屬玻里尼西亞', code: 'PF' },
    { name: '法屬南部和南極領地', code: 'TF' },
    { name: '加彭', code: 'GA' },
    { name: '甘比亞', code: 'GM' },
    { name: '喬治亞', code: 'GE' },
    { name: '德國', code: 'DE' },
    { name: '加納', code: 'GH' },
    { name: '直布羅陀', code: 'GI' },
    { name: '希臘', code: 'GR' },
    { name: '格陵蘭', code: 'GL' },
    { name: '格瑞那達', code: 'GD' },
    { name: '瓜地洛普', code: 'GP' },
    { name: '關島', code: 'GU' },
    { name: '瓜地馬拉', code: 'GT' },
    { name: '根西', code: 'GG' },
    { name: '幾內亞', code: 'GN' },
    { name: '幾內亞比索', code: 'GW' },
    { name: '蓋亞那', code: 'GY' },
    { name: '海地', code: 'HT' },
    { name: '赫德島和麥克唐納群島', code: 'HM' },
    { name: '梵蒂岡', code: 'VA' },
    { name: '宏都拉斯', code: 'HN' },
    { name: '香港', code: 'HK' },
    { name: '匈牙利', code: 'HU' },
    { name: '冰島', code: 'IS' },
    { name: '印度', code: 'IN' },
    { name: '印尼', code: 'ID' },
    { name: '伊朗', code: 'IR' },
    { name: '伊拉克', code: 'IQ' },
    { name: '愛爾蘭', code: 'IE' },
    { name: '曼島', code: 'IM' },
    { name: '以色列', code: 'IL' },
    { name: '義大利', code: 'IT' },
    { name: '牙買加', code: 'JM' },
    { name: '日本', code: 'JP' },
    { name: '澤西', code: 'JE' },
    { name: '約旦', code: 'JO' },
    { name: '哈薩克', code: 'KZ' },
    { name: '肯亞', code: 'KE' },
    { name: '吉里巴斯', code: 'KI' },
    { name: '北韓', code: 'KP' },
    { name: '韓國', code: 'KR' },
    { name: '科威特', code: 'KW' },
    { name: '吉爾吉斯', code: 'KG' },
    { name: '寮國', code: 'LA' },
    { name: '拉脫維亞', code: 'LV' },
    { name: '黎巴嫩', code: 'LB' },
    { name: '賴索托', code: 'LS' },
    { name: '賴比瑞亞', code: 'LR' },
    { name: '利比亞', code: 'LY' },
    { name: '列支敦斯登', code: 'LI' },
    { name: '立陶宛', code: 'LT' },
    { name: '盧森堡', code: 'LU' },
    { name: '澳門', code: 'MO' },
    { name: '北馬其頓', code: 'MK' },
    { name: '馬達加斯加', code: 'MG' },
    { name: '馬拉威', code: 'MW' },
    { name: '馬來西亞', code: 'MY' },
    { name: '馬爾地夫', code: 'MV' },
    { name: '馬利', code: 'ML' },
    { name: '馬爾他', code: 'MT' },
    { name: '馬紹爾群島', code: 'MH' },
    { name: '馬丁尼克', code: 'MQ' },
    { name: '茅利塔尼亞', code: 'MR' },
    { name: '模里西斯', code: 'MU' },
    { name: '馬約特', code: 'YT' },
    { name: '墨西哥', code: 'MX' },
    { name: '密克羅尼西亞', code: 'FM' },
    { name: '摩爾多瓦', code: 'MD' },
    { name: '摩納哥', code: 'MC' },
    { name: '蒙古', code: 'MN' },
    { name: '蒙哲臘', code: 'MS' },
    { name: '摩洛哥', code: 'MA' },
    { name: '莫三比克', code: 'MZ' },
    { name: '緬甸', code: 'MM' },
    { name: '納米比亞', code: 'NA' },
    { name: '諾魯', code: 'NR' },
    { name: '尼泊爾', code: 'NP' },
    { name: '荷蘭', code: 'NL' },
    { name: '荷屬安地列斯', code: 'AN' },
    { name: '新喀里多尼亞', code: 'NC' },
    { name: '紐西蘭', code: 'NZ' },
    { name: '尼加拉瓜', code: 'NI' },
    { name: '尼日', code: 'NE' },
    { name: '奈及利亞', code: 'NG' },
    { name: '紐埃島', code: 'NU' },
    { name: '諾福克島', code: 'NF' },
    { name: '北馬利安納群島', code: 'MP' },
    { name: '挪威', code: 'NO' },
    { name: '阿曼', code: 'OM' },
    { name: '巴基斯坦', code: 'PK' },
    { name: '帛琉', code: 'PW' },
    { name: '巴勒斯坦領土', code: 'PS' },
    { name: '巴拿馬', code: 'PA' },
    { name: '巴布亞紐幾內亞', code: 'PG' },
    { name: '巴拉圭', code: 'PY' },
    { name: '秘魯', code: 'PE' },
    { name: '菲律賓', code: 'PH' },
    { name: '皮特肯群島', code: 'PN' },
    { name: '波蘭', code: 'PL' },
    { name: '葡萄牙', code: 'PT' },
    { name: '波多黎各', code: 'PR' },
    { name: '卡達', code: 'QA' },
    { name: '留尼旺', code: 'RE' },
    { name: '羅馬尼亞', code: 'RO' },
    { name: '俄羅斯', code: 'RU' },
    { name: '盧安達', code: 'RW' },
    { name: '聖凱倫拿島', code: 'SH' },
    { name: '聖克里斯多福及尼維斯', code: 'KN' },
    { name: '聖露西亞', code: 'LC' },
    { name: '聖皮埃與密克隆群島', code: 'PM' },
    { name: '聖文森及格瑞那丁', code: 'VC' },
    { name: '薩摩亞', code: 'WS' },
    { name: '聖馬利諾', code: 'SM' },
    { name: '聖多美普林西比', code: 'ST' },
    { name: '沙烏地阿拉伯', code: 'SA' },
    { name: '塞內加爾', code: 'SN' },
    { name: '塞爾維亞與蒙特內哥羅', code: 'CS' },
    { name: '塞席爾', code: 'SC' },
    { name: '獅子山', code: 'SL' },
    { name: '新加坡', code: 'SG' },
    { name: '斯洛伐克', code: 'SK' },
    { name: '斯洛維尼亞', code: 'SI' },
    { name: '索羅門群島', code: 'SB' },
    { name: '索馬利亞', code: 'SO' },
    { name: '南非', code: 'ZA' },
    { name: '南喬治亞與南三明治群島', code: 'GS' },
    { name: '西班牙', code: 'ES' },
    { name: '斯里蘭卡', code: 'LK' },
    { name: '蘇丹', code: 'SD' },
    { name: '蘇利南', code: 'SR' },
    { name: '挪威屬斯瓦巴及尖棉', code: 'SJ' },
    { name: '史瓦帝尼王國', code: 'SZ' },
    { name: '瑞典', code: 'SE' },
    { name: '瑞士', code: 'CH' },
    { name: '敘利亞', code: 'SY' },
    { name: '臺灣', code: 'TW' },
    { name: '塔吉克', code: 'TJ' },
    { name: '坦尚尼亞', code: 'TZ' },
    { name: '泰國', code: 'TH' },
    { name: '東帝汶', code: 'TL' },
    { name: '多哥', code: 'TG' },
    { name: '托克勞群島', code: 'TK' },
    { name: '東加', code: 'TO' },
    { name: '千里達及托巴哥', code: 'TT' },
    { name: '突尼西亞', code: 'TN' },
    { name: '土耳其', code: 'TR' },
    { name: '土庫曼', code: 'TM' },
    { name: '特克斯與凱科斯群島', code: 'TC' },
    { name: '吐瓦魯', code: 'TV' },
    { name: '烏干達', code: 'UG' },
    { name: '烏克蘭', code: 'UA' },
    { name: '阿聯', code: 'AE' },
    { name: '英國', code: 'GB' },
    { name: '美國', code: 'US' },
    { name: '美國本土外小島嶼', code: 'UM' },
    { name: '烏拉圭', code: 'UY' },
    { name: '烏茲別克', code: 'UZ' },
    { name: '萬那杜', code: 'VU' },
    { name: '委內瑞拉', code: 'VE' },
    { name: '越南', code: 'VN' },
    { name: '英屬維京群島', code: 'VG' },
    { name: '美屬維京群島', code: 'VI' },
    { name: '瓦利斯和富圖那', code: 'WF' },
    { name: '西撒哈拉', code: 'EH' },
    { name: '葉門', code: 'YE' },
    { name: '尚比亞', code: 'ZM' },
    { name: '辛巴威', code: 'ZW' }
  ]
  let school_flags = {
    "140.112": {
      "name": "國立臺灣大學",
      "url": "https://upload.wikimedia.org/wikipedia/zh/thumb/4/4c/National_Taiwan_University_logo.svg/1200px-National_Taiwan_University_logo.svg.png"
    },
    "140.113": {
      "name": "國立交通大學",
      "url": "https://i.imgur.com/2DCzAtc.png"
    },
    "140.114": {
      "name": "國立清華大學",
      "url": "https://i.imgur.com/K9ZpdZg.png"
    },
    "140.115": {
      "name": "國立中央大學",
      "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/NCULogo.svg/1200px-NCULogo.svg.png"
    },
    "140.116": {
      "name": "國立成功大學",
      "url": "https://upload.wikimedia.org/wikipedia/zh/thumb/8/83/National_Cheng_Kung_University_logo.svg/1200px-National_Cheng_Kung_University_logo.svg.png"
    },
    "140.117": {
      "name": "國立中山大學",
      "url": "https://upload.wikimedia.org/wikipedia/zh/thumb/2/29/National_Sun_Yat-sen_University_logo.svg/1200px-National_Sun_Yat-sen_University_logo.svg.png"
    },
    "140.118": {
      "name": "國立臺灣科技大學",
      "url": "https://upload.wikimedia.org/wikipedia/zh/thumb/b/b1/Taiwan_Tech_Logo.svg/1200px-Taiwan_Tech_Logo.svg.png"
    },
    "140.119": {
      "name": "國立政治大學",
      "url": "https://i.imgur.com/sHW29pp.png"
    },
    "140.120": {
      "name": "國立中興大學",
      "url": "https://upload.wikimedia.org/wikipedia/zh/9/97/NCHU_Logo.jpg"
    },
    "140.121": {
      "name": "國立臺灣海洋大學",
      "url": "https://i.imgur.com/5WtBn5N.png"
    },
    "140.122": {
      "name": "國立臺灣師範大學",
      "url": "https://i.imgur.com/qWULokg.png"
    },
    "140.123": {
      "name": "國立中正大學",
      "url": "https://i.imgur.com/cKBAzZO.png"
    },
    "140.124": {
      "name": "國立臺北科技大學",
      "url": "https://i.imgur.com/lAAtzDw.png"
    },
    "140.125": {
      "name": "國立雲林科技大學",
      "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b1/National_Yunlin_University_of_Science_and_Technology_logo.svg/1200px-National_Yunlin_University_of_Science_and_Technology_logo.svg.png"
    },
    "140.132": {
      "name": "國防大學",
      "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/ROC_National_Defense_University_Logo.svg/1200px-ROC_National_Defense_University_Logo.svg.png"
    },
    "203.64.76": {
      "name": "慈濟大學",
      "url": "https://i.imgur.com/icsNO8z.jpg"
    },
    "140.134": {
      "name": "逢甲大學",
      "url": "https://upload.wikimedia.org/wikipedia/zh/5/55/FCU_LOGO.png"
    },
    "140.135": {
      "name": "中原大學",
      "url": "https://upload.wikimedia.org/wikipedia/zh/thumb/8/83/CYCU.svg/1200px-CYCU.svg.png"
    },
    "140.136": {
      "name": "天主教輔仁大學",
      "url": "https://upload.wikimedia.org/wikipedia/zh/0/00/Fu_Jen_Catholic_University_Seal.png"
    },
    "140.137": {
      "name": "中國文化大學",
      "url": "https://upload.wikimedia.org/wikipedia/zh/thumb/9/95/PCCU_LOGO.svg/1200px-PCCU_LOGO.svg.png"
    },
    "140.138": {
      "name": "元智大學",
      "url": "https://upload.wikimedia.org/wikipedia/zh/3/3c/Yuan_Ze_University_Logo.png"
    },
    "134.208": {
      "name": "國立東華大學",
      "url": "https://upload.wikimedia.org/wikipedia/zh/thumb/4/43/National_Dong_Hwa_University_Logo.svg/1200px-National_Dong_Hwa_University_Logo.svg.png"
    },
    "163.13": {
      "name": "淡江大學",
      "url": "https://upload.wikimedia.org/wikipedia/zh/thumb/d/db/Tamkang_University_logo.svg/1200px-Tamkang_University_logo.svg.png"
    },
    "163.14": {
      "name": "東吳大學",
      "url": "https://upload.wikimedia.org/wikipedia/zh/thumb/1/12/Soochow_University_logo.svg/1200px-Soochow_University_logo.svg.png"
    },
    "163.18": {
      "name": "國立高雄科技大學",
      "url": "https://upload.wikimedia.org/wikipedia/zh/thumb/f/f9/NKUST_Logo.svg/1200px-NKUST_Logo.svg.png"
    },
    "163.21.98": {
      "name": "耕莘健康管理專科學校",
      "url": "https://upload.wikimedia.org/wikipedia/zh/thumb/8/8c/Cardinal_Tien_Junior_College_of_Healthcare_and_Management_logo.svg/1200px-Cardinal_Tien_Junior_College_of_Healthcare_and_Management_logo.svg.png"
    },
    "163.21.236": {
      "name": "臺北市立大學",
      "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/University_of_Taipei_logo.svg/1200px-University_of_Taipei_logo.svg.png"
    },
    "163.22": {
      "name": "國立暨南國際大學",
      "url": "https://upload.wikimedia.org/wikipedia/zh/thumb/8/88/Embelm_of_National_Chi_Nan_University.svg/1200px-Embelm_of_National_Chi_Nan_University.svg.png"
    },
    "163.24": {
      "name": "大仁科技大學",
      "url": "https://upload.wikimedia.org/wikipedia/zh/thumb/e/ef/Tajen_Unversity_logo.svg/1200px-Tajen_Unversity_logo.svg.png"
    },
    "192.83.167": {
      "name": "國立臺中教育大學",
      "url": "https://upload.wikimedia.org/wikipedia/zh/thumb/d/d3/Emblem_of_National_Taichung_University_of_Education.svg/1200px-Emblem_of_National_Taichung_University_of_Education.svg.png"
    },
    "192.83.172": {
      "name": "國立臺中科技大學",
      "url": "https://upload.wikimedia.org/wikipedia/zh/7/77/NUTC_logo.gif"
    },
    "192.83.173": {
      "name": "國立彰化師範大學",
      "url": "https://upload.wikimedia.org/wikipedia/zh/6/6b/National_Changhua_University_of_Education.png"
    },
    "192.83.174": {
      "name": "大葉大學",
      "url": "https://upload.wikimedia.org/wikipedia/zh/5/5c/Dayeh.gif"
    },
    "192.83.179": {
      "name": "國立臺北教育大學",
      "url": "https://upload.wikimedia.org/wikipedia/zh/thumb/6/62/National_Taipei_University_of_Education_logo.svg/1200px-National_Taipei_University_of_Education_logo.svg.png"
    },
    "192.83.181": {
      "name": "國立體育大學",
      "url": "https://upload.wikimedia.org/wikipedia/zh/thumb/3/3f/National_Taiwan_Sport_University_logo.svg/1200px-National_Taiwan_Sport_University_logo.svg.png"
    },
    "192.83.190": {
      "name": "高苑科技大學",
      "url": "https://upload.wikimedia.org/wikipedia/zh/d/d5/KYU_logo.png"
    },
    "192.83.193": {
      "name": "實踐大學",
      "url": "https://upload.wikimedia.org/wikipedia/zh/thumb/5/59/Shih_Chien_University_logo.svg/1200px-Shih_Chien_University_logo.svg.png"
    },
    "192.192.1": {
      "name": "中央警察大學",
      "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/ROC_Central_Police_University_Emblem.svg/1200px-ROC_Central_Police_University_Emblem.svg.png"
    },
    "192.192.2": {
      "name": "嶺東科技大學",
      "url": "https://upload.wikimedia.org/wikipedia/zh/thumb/8/84/Ling_Tung_University_logo.svg/1200px-Ling_Tung_University_logo.svg.png"
    },
    "192.192.3": {
      "name": "台南應用科技大學",
      "url": "https://upload.wikimedia.org/wikipedia/zh/b/b0/%E5%8F%B0%E5%8D%97%E6%87%89%E7%94%A8%E7%A7%91%E6%8A%80%E5%A4%A7%E5%AD%B8LOGO.jpg"
    },
    "192.192.44": {
      "name": "景文科技大學",
      "url": "https://upload.wikimedia.org/wikipedia/zh/thumb/d/d7/Jinwen_University_of_Science_and_Technology_logo.svg/1200px-Jinwen_University_of_Science_and_Technology_logo.svg.png"
    },
    "192.192.45": {
      "name": "嘉南藥理大學",
      "url": "https://upload.wikimedia.org/wikipedia/zh/thumb/d/de/Chia_Nan_University_of_Pharmacy_and_Science_logo.svg/1200px-Chia_Nan_University_of_Pharmacy_and_Science_logo.svg.png"
    },
    "192.192.139": {
      "name": "國立臺灣體育運動大學",
      "url": "https://upload.wikimedia.org/wikipedia/zh/thumb/4/45/Emblem_of_National_Taiwan_University_of_Sport.svg/1200px-Emblem_of_National_Taiwan_University_of_Sport.svg.png"
    },
    "192.192.230": {
      "name": "中華科技大學",
      "url": "https://upload.wikimedia.org/wikipedia/zh/thumb/2/23/China_University_of_Science_and_Technology_logo.svg/1200px-China_University_of_Science_and_Technology_logo.svg.png"
    },
    "120.110": {
      "name": "靜宜大學",
      "url": "https://upload.wikimedia.org/wikipedia/zh/5/54/PU_Logo.png"
    },
    "120.117": {
      "name": "南臺科技大學",
      "url": "https://upload.wikimedia.org/wikipedia/zh/thumb/a/a9/STUT_logo.svg/1200px-STUT_logo.svg.png"
    },
    "120.118": {
      "name": "國立屏東大學",
      "url": "https://upload.wikimedia.org/wikipedia/zh/thumb/6/63/National_Pingtung_University_logo.svg/1200px-National_Pingtung_University_logo.svg.png"
    },
    "120.119": {
      "name": "樹德科技大學",
      "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/STU_logo.svg/1200px-STU_logo.svg.png"
    },
    "120.126": {
      "name": "國立臺北大學",
      "url": "https://upload.wikimedia.org/wikipedia/zh/thumb/1/12/%E5%9C%8B%E7%AB%8B%E8%87%BA%E5%8C%97%E5%A4%A7%E5%AD%B8%E6%A0%A1%E5%BE%BD.svg/1200px-%E5%9C%8B%E7%AB%8B%E8%87%BA%E5%8C%97%E5%A4%A7%E5%AD%B8%E6%A0%A1%E5%BE%BD.svg.png"
    },
    "203.64.215": {
      "name": "臺北城市科技大學",
      "url": "https://upload.wikimedia.org/wikipedia/zh/thumb/8/8d/Taipei_City_University_of_Science_and_Technology_logo.svg/1200px-Taipei_City_University_of_Science_and_Technology_logo.svg.png"
    },
    "210.70.183": {
      "name": "長榮大學",
      "url": "https://upload.wikimedia.org/wikipedia/zh/thumb/b/b2/Chang_Jung_Christian_University_logo.svg/1200px-Chang_Jung_Christian_University_logo.svg.png"
    },
    "210.71.118": {
      "name": "康寧大學",
      "url": "https://upload.wikimedia.org/wikipedia/zh/1/1a/Ukn_logo.jpg"
    },
    "210.60.": {
      "name": "宏國德霖科技大學",
      "url": "https://upload.wikimedia.org/wikipedia/zh/9/92/Hungkuo_Delin_University_of_Technology_logo.png"
    },
    "211.76": {
      "name": "世新大學",
      "url": "https://upload.wikimedia.org/wikipedia/zh/thumb/c/c8/Shih_Hsin_University_logo.svg/1200px-Shih_Hsin_University_logo.svg.png"
    },
  }
  let school_range_flags = {
    "140.126.3~21": {
      "name": "中華大學",
      "url": "https://upload.wikimedia.org/wikipedia/zh/e/e8/Chung_hua_university.jpg"
    },
    "140.127.1~35": {
      "name": "國立屏東科技大學",
      "url": "https://upload.wikimedia.org/wikipedia/zh/thumb/f/fd/NPUSTLogo.svg/1200px-NPUSTLogo.svg.png"
    },
    "140.127.36~80": {
      "name": "國立高雄師範大學",
      "url": "https://i.imgur.com/KrsrxYc.png"
    },
    "140.127.86~110": {
      "name": "輔英科技大學",
      "url": "https://upload.wikimedia.org/wikipedia/zh/thumb/3/33/Fooyin_University_logo.svg/1200px-Fooyin_University_logo.svg.png"
    },
    "140.127.111~120": {
      "name": "國立高雄科技大學",
      "url": "https://upload.wikimedia.org/wikipedia/zh/thumb/f/f9/NKUST_Logo.svg/1200px-NKUST_Logo.svg.png"
    },
    "140.127.149~150": {
      "name": "國立高雄科技大學",
      "url": "https://upload.wikimedia.org/wikipedia/zh/thumb/f/f9/NKUST_Logo.svg/1200px-NKUST_Logo.svg.png"
    },
    "140.133.64~93": {
      "name": "國立高雄科技大學",
      "url": "https://upload.wikimedia.org/wikipedia/zh/thumb/f/f9/NKUST_Logo.svg/1200px-NKUST_Logo.svg.png"
    },
    "140.127.121~140": {
      "name": "正修科技大學",
      "url": "https://upload.wikimedia.org/wikipedia/zh/thumb/6/66/Csu.svg/1200px-Csu.svg.png"
    },
    "140.127.149~160": {
      "name": "中華民國空軍軍官學校",
      "url": "https://upload.wikimedia.org/wikipedia/commons/3/3e/%E4%B8%AD%E8%8F%AF%E6%B0%91%E5%9C%8B%E7%A9%BA%E8%BB%8D%E5%AE%98%E6%A0%A1%E6%A0%A1%E5%BE%BD.png"
    },
    "140.127.164~170": {
      "name": "文藻外語大學",
      "url": "https://upload.wikimedia.org/wikipedia/zh/thumb/3/33/Wenzao_Ursuline_University_of_Languages_logo.svg/1200px-Wenzao_Ursuline_University_of_Languages_logo.svg.png"
    },
    "140.127.171~175": {
      "name": "國立臺東大學",
      "url": "https://upload.wikimedia.org/wikipedia/zh/thumb/7/77/National_Taitung_University_logo.svg/1200px-National_Taitung_University_logo.svg.png"
    },
    "140.127.176~191": {
      "name": "義守大學",
      "url": "https://upload.wikimedia.org/wikipedia/zh/5/58/Logo_of_ISU.png"
    },
    "140.127.198~234": {
      "name": "國立高雄大學",
      "url": "https://upload.wikimedia.org/wikipedia/zh/thumb/1/1a/National_University_of_Kaohsiung_logo.svg/1200px-National_University_of_Kaohsiung_logo.svg.png"
    },
    "140.133.32~63": {
      "name": "國立高雄大學",
      "url": "https://upload.wikimedia.org/wikipedia/zh/thumb/1/1a/National_University_of_Kaohsiung_logo.svg/1200px-National_University_of_Kaohsiung_logo.svg.png"
    },
    "140.128.1~40": {
      "name": "靜宜大學",
      "url": "https://upload.wikimedia.org/wikipedia/zh/5/54/PU_Logo.png"
    },
    "140.128.41~60": {
      "name": "南開科技大學",
      "url": "https://upload.wikimedia.org/wikipedia/zh/8/84/NKUT_logo.jpg"
    },
    "140.128.61~70": {
      "name": "中國醫藥大學",
      "url": "https://upload.wikimedia.org/wikipedia/zh/thumb/d/dd/China_Medical_University_%28Taiwan%29_logo.svg/1200px-China_Medical_University_%28Taiwan%29_logo.svg.png"
    },
    "140.128.71~95": {
      "name": "國立勤益科技大學",
      "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/28/NCUT.svg/1200px-NCUT.svg.png"
    },
    "140.128.96~135": {
      "name": "東海大學",
      "url": "https://upload.wikimedia.org/wikipedia/zh/9/94/Thu_logo.png"
    },
    "140.128.136~147": {
      "name": "中山醫學大學",
      "url": "https://upload.wikimedia.org/wikipedia/zh/a/a7/%E4%B8%AD%E5%B1%B1%E9%86%AB%E5%AD%B8%E5%A4%A7%E5%AD%B8%E6%A0%A1%E5%BE%BD.png"
    },
    "140.128.148~151": {
      "name": "中臺科技大學",
      "url": "https://upload.wikimedia.org/wikipedia/zh/thumb/3/36/Central_Taiwan_University_of_Science_and_Technology_logo.svg/1200px-Central_Taiwan_University_of_Science_and_Technology_logo.svg.png"
    },
    "140.129.1~50": {
      "name": "大同大學",
      "url": "https://upload.wikimedia.org/wikipedia/zh/b/b3/Ttumark.jpg"
    },
    "140.129.51~80": {
      "name": "國立陽明大學",
      "url": "https://upload.wikimedia.org/wikipedia/zh/3/36/Ymedulogo.jpg"
    },
    "140.129.81~85": {
      "name": "台北海洋科技大學",
      "url": "https://upload.wikimedia.org/wikipedia/zh/thumb/3/34/Taipei_University_of_Marine_Technology_logo.svg/1200px-Taipei_University_of_Marine_Technology_logo.svg.png"
    },
    "140.129.86~115": {
      "name": "國防大學",
      "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/ROC_National_Defense_University_Logo.svg/1200px-ROC_National_Defense_University_Logo.svg.png"
    },
    "140.129.116~145": {
      "name": "東南科技大學",
      "url": "https://upload.wikimedia.org/wikipedia/zh/9/92/TNU-NewMark.png"
    },
    "140.130.1~40": {
      "name": "國立虎尾科技大學",
      "url": "https://upload.wikimedia.org/wikipedia/zh/thumb/7/75/NFU_Logo.svg/1200px-NFU_Logo.svg.png"
    },
    "140.130.41~50": {
      "name": "國立嘉義大學",
      "url": "https://upload.wikimedia.org/wikipedia/zh/3/3c/NCYU_LOGO.png"
    },
    "140.130.81~100": {
      "name": "國立嘉義大學",
      "url": "https://upload.wikimedia.org/wikipedia/zh/3/3c/NCYU_LOGO.png"
    },
    "140.130.101~130": {
      "name": "吳鳳科技大學",
      "url": "https://upload.wikimedia.org/wikipedia/zh/thumb/8/8e/Wufeng_University_logo.svg/1200px-Wufeng_University_logo.svg.png"
    },
    "140.130.131~150": {
      "name": "大同技術學院",
      "url": "https://upload.wikimedia.org/wikipedia/zh/6/69/Tatung_Logo.jpg"
    },
    "140.130.151~168": {
      "name": "環球科技大學",
      "url": "https://upload.wikimedia.org/wikipedia/zh/thumb/f/f6/TransWorld_University_logo.svg/1200px-TransWorld_University_logo.svg.png"
    },
    "140.131.1~20": {
      "name": "龍華科技大學",
      "url": "https://upload.wikimedia.org/wikipedia/zh/thumb/3/3e/Lunghwa_University_Logo.jpg/200px-Lunghwa_University_Logo.jpg"
    },
    "140.131.21~30": {
      "name": "國立臺灣藝術大學",
      "url": "https://upload.wikimedia.org/wikipedia/zh/thumb/9/9d/National_Taiwan_University_of_Arts_logo.svg/1200px-National_Taiwan_University_of_Arts_logo.svg.png"
    },
    "140.131.31~40": {
      "name": "華夏科技大學",
      "url": "https://i.imgur.com/tgvkJgX.png"
    },
    "140.131.77~84": {
      "name": "致理科技大學",
      "url": "https://upload.wikimedia.org/wikipedia/zh/7/73/Chihlee_University_of_Technology_round_logo.png"
    },
    "140.131.85~95": {
      "name": "國立臺北護理健康大學",
      "url": "https://upload.wikimedia.org/wikipedia/commons/c/c4/National_Taipei_University_of_Nursing_and_Health_Science_logo.jpg"
    },
    "140.131.108~117": {
      "name": "國立臺北商業大學",
      "url": "https://upload.wikimedia.org/wikipedia/zh/thumb/6/68/National_Taipei_University_of_Business_logo.svg/1200px-National_Taipei_University_of_Business_logo.svg.png"
    },
    "140.133.1~15": {
      "name": "國立臺南大學",
      "url": "https://upload.wikimedia.org/wikipedia/commons/d/d9/NUTNLogo.png"
    },
    "163.15.1~23": {
      "name": "陸軍軍官學校",
      "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/1924_Emblem_of_Chinese_Military_Academy_designed_by_Sun_Yat-sen.png/100px-1924_Emblem_of_Chinese_Military_Academy_designed_by_Sun_Yat-sen.png"
    },
    "163.15.151~180": {
      "name": "高雄醫學大學",
      "url": "https://upload.wikimedia.org/wikipedia/zh/thumb/5/5a/Kaohsiung_Medical_University_logo.svg/1200px-Kaohsiung_Medical_University_logo.svg.png"
    },
    "163.17.131~145": {
      "name": "國立臺中科技大學",
      "url": "https://upload.wikimedia.org/wikipedia/zh/7/77/NUTC_logo.gif"
    },
    "163.17.1~9": {
      "name": "朝陽科技大學",
      "url": "https://i.imgur.com/PwyQ1CV.gif"
    },
    "192.83.170~185": {
      "name": "國立臺北大學",
      "url": "https://upload.wikimedia.org/wikipedia/zh/thumb/1/12/%E5%9C%8B%E7%AB%8B%E8%87%BA%E5%8C%97%E5%A4%A7%E5%AD%B8%E6%A0%A1%E5%BE%BD.svg/1200px-%E5%9C%8B%E7%AB%8B%E8%87%BA%E5%8C%97%E5%A4%A7%E5%AD%B8%E6%A0%A1%E5%BE%BD.svg.png"
    },
    "192.192.35~36": {
      "name": "國立臺北大學",
      "url": "https://upload.wikimedia.org/wikipedia/zh/thumb/1/12/%E5%9C%8B%E7%AB%8B%E8%87%BA%E5%8C%97%E5%A4%A7%E5%AD%B8%E6%A0%A1%E5%BE%BD.svg/1200px-%E5%9C%8B%E7%AB%8B%E8%87%BA%E5%8C%97%E5%A4%A7%E5%AD%B8%E6%A0%A1%E5%BE%BD.svg.png"
    },
    "192.83.182~183": {
      "name": "中信金融管理學院",
      "url": "https://i.imgur.com/1x0Deoy.png"
    },
    "192.83.194~195": {
      "name": "國立高雄科技大學",
      "url": "https://upload.wikimedia.org/wikipedia/zh/thumb/f/f9/NKUST_Logo.svg/1200px-NKUST_Logo.svg.png"
    },
    "192.192.30~32": {
      "name": "崑山科技大學",
      "url": "https://upload.wikimedia.org/wikipedia/zh/thumb/a/a5/Ksutlogo.svg/1200px-Ksutlogo.svg.png"
    },
    "192.192.37~39": {
      "name": "南台科技大學",
      "url": "https://upload.wikimedia.org/wikipedia/zh/thumb/a/a9/STUT_logo.svg/1200px-STUT_logo.svg.png"
    },
    "192.192.40~43": {
      "name": "萬能科技大學",
      "url": "https://upload.wikimedia.org/wikipedia/zh/thumb/f/fd/Vanung_University_logo.svg/1200px-Vanung_University_logo.svg.png"
    },
    "192.192.48~55": {
      "name": "國立空中大學",
      "url": "https://upload.wikimedia.org/wikipedia/zh/thumb/5/5e/National_open_university_logo.jpg/100px-National_open_university_logo.jpg"
    },
    "192.192.56~57": {
      "name": "健行科技大學",
      "url": "https://upload.wikimedia.org/wikipedia/zh/thumb/8/8c/Chien_Hsin_University_of_Science_and_Technology_logo.svg/1200px-Chien_Hsin_University_of_Science_and_Technology_logo.svg.png"
    },
    "192.192.60~67": {
      "name": "長庚大學",
      "url": "https://upload.wikimedia.org/wikipedia/zh/thumb/3/3d/CGU_Logo.svg/1200px-CGU_Logo.svg.png"
    },
    "192.192.74~77": {
      "name": "黎明技術學院",
      "url": "https://upload.wikimedia.org/wikipedia/zh/7/7d/%E9%BB%8E%E6%98%8E%E6%8A%80%E8%A1%93%E5%AD%B8%E9%99%A2%E6%A0%A1%E5%BE%BD.JPG"
    },
    "192.192.78~85": {
      "name": "中國科技大學",
      "url": "https://upload.wikimedia.org/wikipedia/zh/2/28/Ckitc_logo.jpg"
    },
    "192.192.125~129": {
      "name": "僑光科技大學",
      "url": "https://upload.wikimedia.org/wikipedia/zh/thumb/6/62/Overseas_Chinese_University_logo.svg/1200px-Overseas_Chinese_University_logo.svg.png"
    },
    "192.192.132~133": {
      "name": "明志科技大學",
      "url": "https://upload.wikimedia.org/wikipedia/zh/thumb/0/08/MCUT_logo.svg/1200px-MCUT_logo.svg.png"
    },
    "192.192.140~141": {
      "name": "德明財經科技大學",
      "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/13/Takming_University_of_Science_and_Technology_logo.svg/1200px-Takming_University_of_Science_and_Technology_logo.svg.png"
    },
    "192.192.148~159": {
      "name": "世新大學",
      "url": "https://upload.wikimedia.org/wikipedia/zh/thumb/c/c8/Shih_Hsin_University_logo.svg/1200px-Shih_Hsin_University_logo.svg.png"
    },
    "120.97.0~31": {
      "name": "國立臺北商業大學",
      "url": "https://upload.wikimedia.org/wikipedia/zh/thumb/6/68/National_Taipei_University_of_Business_logo.svg/1200px-National_Taipei_University_of_Business_logo.svg.png"
    },
    "120.101.0~47": {
      "name": "國立宜蘭大學",
      "url": "https://upload.wikimedia.org/wikipedia/zh/thumb/7/71/%E5%9C%8B%E7%AB%8B%E5%AE%9C%E8%98%AD%E5%A4%A7%E5%AD%B8.svg/1200px-%E5%9C%8B%E7%AB%8B%E5%AE%9C%E8%98%AD%E5%A4%A7%E5%AD%B8.svg.png"
    },
    "120.107.64~143": {
      "name": "弘光科技大學",
      "url": "https://upload.wikimedia.org/wikipedia/zh/7/73/%E5%BC%98%E5%85%89%E7%A7%91%E6%8A%80%E5%A4%A7%E5%AD%B8%E6%A0%A1%E5%BE%BD.jpg"
    },
    "120.107.144~215": {
      "name": "國立彰化師範大學",
      "url": "https://upload.wikimedia.org/wikipedia/zh/6/6b/National_Changhua_University_of_Education.png"
    },
    "120.107.216~255": {
      "name": "大葉大學",
      "url": "https://upload.wikimedia.org/wikipedia/zh/5/5c/Dayeh.gif"
    },
    "120.109.0~79": {
      "name": "建國科技大學",
      "url": "https://i.imgur.com/LjUcqUT.jpg"
    },
    "120.109.160~191": {
      "name": "修平科技大學",
      "url": "https://i.imgur.com/oDImXqi.png"
    },
    "120.113.64~127": {
      "name": "國立虎尾科技大學",
      "url": "https://upload.wikimedia.org/wikipedia/zh/thumb/7/75/NFU_Logo.svg/1200px-NFU_Logo.svg.png"
    },
    "120.124.96~199": {
      "name": "健行科技大學",
      "url": "https://upload.wikimedia.org/wikipedia/zh/thumb/8/8c/Chien_Hsin_University_of_Science_and_Technology_logo.svg/1200px-Chien_Hsin_University_of_Science_and_Technology_logo.svg.png"
    },
    "120.125.96~111": {
      "name": "國立金門大學",
      "url": "https://upload.wikimedia.org/wikipedia/zh/thumb/0/08/National_Quemoy_University_seal.svg/1200px-National_Quemoy_University_seal.svg.png"
    },
    "203.72.73~87": {
      "name": "慈濟大學",
      "url": "https://i.imgur.com/icsNO8z.jpg"
    },
    "203.71.84~88": {
      "name": "臺北醫學大學",
      "url": "https://upload.wikimedia.org/wikipedia/zh/thumb/a/aa/Taipei_Medical_University_logo_201508.svg/1200px-Taipei_Medical_University_logo_201508.svg.png"
    },
  }
  let bahaip = "104.16.181.30"
  let rawips = jQuery(".edittime.tippy-post-info").map(function () {
    return this.dataset.hideip;
  }).toArray()
  let ips = rawips.map(item => {
    if (item.match(/\d+.\d+.\d+.xxx/)) {
      return item.replace("xxx", "255")
    } else {
      return bahaip
    }
  })

  function code2flag(code, ip) {
    if (ip === bahaip) {
      return {
        name: "巴哈姆特",
        url: `https://forum.gamer.com.tw/favicon.ico`
      }
    } else if (_.find(country_flags, ["code", code])) {
      for (let ip_prefix in school_flags) {
        let flag = school_flags[ip_prefix]
        if (ip.match(`^${ip_prefix}\\.`)) {
          return flag
        }
      }

      for (let ip_range in school_range_flags) {
        let [, ip_AB, ip_C_raw] = ip.match(/(\d+\.\d+)\.(\d+)\.255/)
        let [, ip_range_AB, ip_range_C_start_raw, ip_range_C_end_raw] = ip_range.match(/(\d+\.\d+)\.(\d+)~(\d+)/)
        let [ip_C, ip_range_C_start, ip_range_C_end] = [ip_C_raw, ip_range_C_start_raw, ip_range_C_end_raw].map(item => Number(item))
        let flag = school_range_flags[ip_range]
        if (ip_AB === ip_range_AB && ip_range_C_start <= ip_C && ip_C <= ip_range_C_end) {
          return flag
        }
      }

      return {
        name: _.find(country_flags, ["code", code]).name,
        url: `https://flagicons.lipis.dev/flags/4x3/${code.toLowerCase()}.svg`
      }
    } else {
      return {
        name: code,
        url: `https://flagicons.lipis.dev/flags/4x3/${code.toLowerCase()}.svg`
      }
    }
  }

  function setCountryFlag(rawdata) {
    let data = JSON.parse(rawdata.response)
    let users = jQuery(".c-post__header__author")

    for (let i = 0; i < Math.min(data.length, users.length); i++) {
      let flag = code2flag(data[i].countryCode, ips[i])
      jQuery(users[i].children[0]).after(`<img src="${flag.url}" title="${flag.name}"
          style="vertical-align: middle; height: 26px; border-radius:4px;">`)
    }
  }

  GM_xmlhttpRequest({
    method: "POST",
    url: "http://ip-api.com/batch?fields=countryCode,country",
    data: JSON.stringify(ips),
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    onload: setCountryFlag,
  });
})();