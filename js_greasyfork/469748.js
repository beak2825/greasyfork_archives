// ==UserScript==
// @name         ecourse2 課程成員擴充功能
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  顯示課程成員系所和書卷獎得主的擴充功能
// @author       巴哈姆特 kao
// @match        https://ecourse2.ccu.edu.tw/local/courseutility/participants*roleid=5
// @icon         https://cdn.discordapp.com/attachments/1021452385899532320/1123512791651864686/yellow_pineapple.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/469748/ecourse2%20%E8%AA%B2%E7%A8%8B%E6%88%90%E5%93%A1%E6%93%B4%E5%85%85%E5%8A%9F%E8%83%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/469748/ecourse2%20%E8%AA%B2%E7%A8%8B%E6%88%90%E5%93%A1%E6%93%B4%E5%85%85%E5%8A%9F%E8%83%BD.meta.js
// ==/UserScript==

(function () {


    let departments = [
        { id_mid: '110', depar_name: '中國文學系', college: '文' },
        { id_mid: '115', depar_name: '外國語文學系', college: '文' },
        { id_mid: '120', depar_name: '歷史系', college: '文' },
        { id_mid: '125', depar_name: '哲學系', college: '文' },
        { id_mid: '210', depar_name: '數學系', college: '理' },
        { id_mid: '220', depar_name: '物理系', college: '理' },
        { id_mid: '235', depar_name: '地球與環境科學系', college: '理' },
        { id_mid: '257', depar_name: '生物醫學科學系', college: '理' },
        { id_mid: '260', depar_name: '化學暨生物化學系', college: '理' },
        { id_mid: '310', depar_name: '社會福利學系', college: '社' },
        { id_mid: '315', depar_name: '心理學系', college: '社', },
        { id_mid: '320', depar_name: '勞工關係學系', college: '社' },
        { id_mid: '330', depar_name: '政治學系', college: '社' },
        { id_mid: '335', depar_name: '傳播學系', college: '社' },
        { id_mid: '410', depar_name: '資訊工程學系', college: '工' },
        { id_mid: '415', depar_name: '電機工程學系', college: '工' },
        { id_mid: '420', depar_name: '機械工程學系', college: '工' },
        { id_mid: '421', depar_name: '機械工程學系光機電整合工程組', college: '工' },
        { id_mid: '422', depar_name: '機械工程學系機械工程組', college: '工' },
        { id_mid: '425', depar_name: '化學工程學系', college: '工', },
        { id_mid: '430', depar_name: '通訊工程學系', college: '工' },
        { id_mid: '510', depar_name: '經濟學系', college: '管' },
        { id_mid: '515', depar_name: '財務金融學系', college: '管' },
        { id_mid: '520', depar_name: '企業管理學系', college: '管' },
        { id_mid: '526', depar_name: '會計與資訊科技學系', college: '管' },
        { id_mid: '530', depar_name: '資訊管理學系', college: '管' },
        { id_mid: '610', depar_name: '法律學系法學組', college: '法' },
        { id_mid: '620', depar_name: '法律學系法制組', college: '法' },
        { id_mid: '630', depar_name: '財經法律學系', college: '法' },
        { id_mid: '710', depar_name: '成人及繼續教育學系', college: '教' },
        { id_mid: '725', depar_name: '犯罪防治學系', college: '教' },
        { id_mid: '736', depar_name: '運動競技學系', college: '教' },
        { id_mid: '910', depar_name: '紫荊不分系學士學位學程', college: '其他' }
    ]


    let presidential_award_list = [
        { depar_id: '110', name: '黃○沛' },
        { depar_id: '110', name: '王○蓉' },
        { depar_id: '110', name: '陳○妤' },
        { depar_id: '110', name: '吳○恩' },
        { depar_id: '110', name: '黃○真' },
        { depar_id: '110', name: '劉○函' },
        { depar_id: '110', name: '江○葶' },
        { depar_id: '110', name: '陳○雯' },
        { depar_id: '115', name: '江○毅' },
        { depar_id: '115', name: '莊○悅' },
        { depar_id: '115', name: '彭○莛' },
        { depar_id: '115', name: '林○廷' },
        { depar_id: '115', name: '王○婷' },
        { depar_id: '115', name: '陳○文' },
        { depar_id: '115', name: '余○曄' },
        { depar_id: '115', name: '羅○淇' },
        { depar_id: '120', name: '高○耀' },
        { depar_id: '120', name: '鄭○華' },
        { depar_id: '120', name: '鐘○廸' },
        { depar_id: '120', name: '吳○儒' },
        { depar_id: '120', name: '陳○安' },
        { depar_id: '120', name: '徐○鈺' },
        { depar_id: '120', name: '徐○緯' },
        { depar_id: '120', name: '楊○希' },
        { depar_id: '125', name: '吳○瑢' },
        { depar_id: '125', name: '李○華' },
        { depar_id: '125', name: '蔡○珊' },
        { depar_id: '125', name: '鄭○靜' },
        { depar_id: '125', name: '賴○聿' },
        { depar_id: '125', name: '陳○茵' },
        { depar_id: '125', name: '盧○羲' },
        { depar_id: '125', name: '曹○陞' },
        { depar_id: '210', name: '許○暐' },
        { depar_id: '210', name: '蔡○任' },
        { depar_id: '210', name: '柯○妤' },
        { depar_id: '210', name: '潘○丞' },
        { depar_id: '210', name: '陳○奕' },
        { depar_id: '210', name: '陳○政' },
        { depar_id: '210', name: '吳○蒨' },
        { depar_id: '210', name: '陳○緯' },
        { depar_id: '220', name: '詹○詒' },
        { depar_id: '220', name: '王○超' },
        { depar_id: '220', name: '林○逸' },
        { depar_id: '220', name: '陳○壕' },
        { depar_id: '220', name: '游○晏' },
        { depar_id: '220', name: '王○賢' },
        { depar_id: '220', name: '曾○恩' },
        { depar_id: '220', name: '黃○琦' },
        { depar_id: '235', name: '李○樺' },
        { depar_id: '235', name: '李○昕' },
        { depar_id: '235', name: '莊○娟' },
        { depar_id: '235', name: '潘○奇' },
        { depar_id: '235', name: '陳○瑾' },
        { depar_id: '235', name: '陳○睿' },
        { depar_id: '235', name: '劉○欣' },
        { depar_id: '235', name: '吳○叡' },
        { depar_id: '257', name: '林○辰' },
        { depar_id: '257', name: '謝○宸' },
        { depar_id: '257', name: '陳○蓁' },
        { depar_id: '257', name: '劉○亭' },
        { depar_id: '257', name: '陳○萱' },
        { depar_id: '257', name: '邵○翔' },
        { depar_id: '257', name: '張○珉' },
        { depar_id: '257', name: '陳○筠' },
        { depar_id: '260', name: '王○鈞' },
        { depar_id: '260', name: '詹○叡' },
        { depar_id: '260', name: '劉○鈞' },
        { depar_id: '260', name: '林○庭' },
        { depar_id: '260', name: '莊○寧' },
        { depar_id: '260', name: '陳○妍' },
        { depar_id: '260', name: '彭○恆' },
        { depar_id: '260', name: '黃○瑄' },
        { depar_id: '310', name: '鍾○軒' },
        { depar_id: '310', name: '黃○彥' },
        { depar_id: '310', name: '林○杉' },
        { depar_id: '310', name: '邱○瑩' },
        { depar_id: '310', name: '莊○珍' },
        { depar_id: '310', name: '黃○綺' },
        { depar_id: '310', name: '丁○驊' },
        { depar_id: '310', name: '鄧○君' },
        { depar_id: '315', name: '莊○晰' },
        { depar_id: '315', name: '李○彤' },
        { depar_id: '315', name: '楊○羽' },
        { depar_id: '315', name: '許○庭' },
        { depar_id: '315', name: '趙○涵' },
        { depar_id: '315', name: '黃○琳' },
        { depar_id: '315', name: '過○絜' },
        { depar_id: '315', name: '丁○晴' },
        { depar_id: '320', name: '王○樺' },
        { depar_id: '320', name: '郭○妮' },
        { depar_id: '320', name: '葉○儀' },
        { depar_id: '320', name: '黃○鈞' },
        { depar_id: '320', name: '傅○㨗' },
        { depar_id: '320', name: '曾○晴' },
        { depar_id: '330', name: '王○柔' },
        { depar_id: '330', name: '李○慈' },
        { depar_id: '330', name: '葉○瑜' },
        { depar_id: '330', name: '楊○翰' },
        { depar_id: '330', name: '黃○綸' },
        { depar_id: '330', name: '周○心' },
        { depar_id: '330', name: '王○婷' },
        { depar_id: '335', name: '黃○卿' },
        { depar_id: '335', name: '簡○盈' },
        { depar_id: '335', name: '何○中' },
        { depar_id: '335', name: '林○萱' },
        { depar_id: '335', name: '范○采晴' },
        { depar_id: '335', name: '郭○璿' },
        { depar_id: '335', name: '李○屏' },
        { depar_id: '335', name: '陳○誼' },
        { depar_id: '410', name: '廖○廷' },
        { depar_id: '410', name: '陳○峰' },
        { depar_id: '410', name: '陳○瑋' },
        { depar_id: '410', name: '黃○偉' },
        { depar_id: '410', name: '黃○叡' },
        { depar_id: '410', name: '鄭○中' },
        { depar_id: '410', name: '許○安' },
        { depar_id: '410', name: '詹○旭' },
        { depar_id: '410', name: '梁○平' },
        { depar_id: '410', name: '鍾○丞' },
        { depar_id: '410', name: '柯○旭' },
        { depar_id: '410', name: '邱○恩' },
        { depar_id: '410', name: '溫○媛' },
        { depar_id: '410', name: '鄭○辰' },
        { depar_id: '410', name: '曾○銘' },
        { depar_id: '415', name: '林○容' },
        { depar_id: '415', name: '林○佑' },
        { depar_id: '415', name: '李○維' },
        { depar_id: '415', name: '邱○甄' },
        { depar_id: '415', name: '陳○炘' },
        { depar_id: '415', name: '林○恩' },
        { depar_id: '415', name: '陳○軒' },
        { depar_id: '415', name: '余○哲' },
        { depar_id: '415', name: '陳○鎰' },
        { depar_id: '415', name: '蔡○均' },
        { depar_id: '415', name: '沈○叡' },
        { depar_id: '415', name: '周○蕾' },
        { depar_id: '415', name: '潘○齊' },
        { depar_id: '415', name: '張○瑜' },
        { depar_id: '415', name: '郭○哲' },
        { depar_id: '415', name: '沈○伶' },
        { depar_id: '421', name: '楊○筑' },
        { depar_id: '421', name: '黃○銘' },
        { depar_id: '422', name: '莊○安' },
        { depar_id: '422', name: '張○君' },
        { depar_id: '422', name: '黃○溦' },
        { depar_id: '422', name: '唐○儀' },
        { depar_id: '422', name: '林○宏' },
        { depar_id: '422', name: '陳○伶' },
        { depar_id: '422', name: '洪○庭' },
        { depar_id: '422', name: '陳○逸' },
        { depar_id: '422', name: '陳○原' },
        { depar_id: '422', name: '張○瀚' },
        { depar_id: '422', name: '何○葶' },
        { depar_id: '422', name: '黃○馴' },
        { depar_id: '422', name: '廖○傑' },
        { depar_id: '422', name: '侯○霖' },
        { depar_id: '422', name: '余○瑋' },
        { depar_id: '422', name: '阮○彤' },
        { depar_id: '425', name: '張○齊' },
        { depar_id: '425', name: '陳○華' },
        { depar_id: '425', name: '劉○瑄' },
        { depar_id: '425', name: '沈○騫' },
        { depar_id: '425', name: '洪○軒' },
        { depar_id: '425', name: '薛○瑋' },
        { depar_id: '425', name: '楊○霖' },
        { depar_id: '425', name: '李○淳' },
        { depar_id: '430', name: '張○妤' },
        { depar_id: '430', name: '吳○叡' },
        { depar_id: '430', name: '張○茹' },
        { depar_id: '430', name: '翁○哲' },
        { depar_id: '430', name: '潘○豪' },
        { depar_id: '430', name: '王○淳' },
        { depar_id: '430', name: '張○晨' },
        { depar_id: '430', name: '黃○豪' },
        { depar_id: '510', name: '陳○博' },
        { depar_id: '510', name: '蔡○紋' },
        { depar_id: '510', name: '董○瑜' },
        { depar_id: '510', name: '厲○佳' },
        { depar_id: '510', name: '陳○柔' },
        { depar_id: '510', name: '傅○萍' },
        { depar_id: '510', name: '林○宇' },
        { depar_id: '510', name: '林○妍' },
        { depar_id: '510', name: '金○宜' },
        { depar_id: '510', name: '余○槿' },
        { depar_id: '510', name: '林○萱' },
        { depar_id: '510', name: '李○中' },
        { depar_id: '510', name: '張○禎' },
        { depar_id: '510', name: '彭○瑄' },
        { depar_id: '510', name: '劉○睿' },
        { depar_id: '510', name: '王○婷' },
        { depar_id: '515', name: '王○涵' },
        { depar_id: '515', name: '宋○濡' },
        { depar_id: '515', name: '葉○倫' },
        { depar_id: '515', name: '陳○誠' },
        { depar_id: '515', name: '劉○琦' },
        { depar_id: '515', name: '孫○傑' },
        { depar_id: '515', name: '黃○榕' },
        { depar_id: '515', name: '蔡○' },
        { depar_id: '515', name: '鄭○風' },
        { depar_id: '515', name: '侯○凱' },
        { depar_id: '515', name: '朱○宇' },
        { depar_id: '515', name: '李○菱' },
        { depar_id: '515', name: '盧○婕' },
        { depar_id: '515', name: '張○清' },
        { depar_id: '515', name: '鄭○文' },
        { depar_id: '515', name: '施○儀' },
        { depar_id: '520', name: '郭○禎' },
        { depar_id: '520', name: '林○薇' },
        { depar_id: '520', name: '陳○孜' },
        { depar_id: '520', name: '吳○寧' },
        { depar_id: '520', name: '林○中' },
        { depar_id: '520', name: '李○樺' },
        { depar_id: '520', name: '張○勝' },
        { depar_id: '520', name: '劉○叡' },
        { depar_id: '520', name: '洪○晏' },
        { depar_id: '520', name: '陳○瑋' },
        { depar_id: '520', name: '黃○琳' },
        { depar_id: '520', name: '熊○儀' },
        { depar_id: '520', name: '鄭○毅' },
        { depar_id: '520', name: '邱○靖' },
        { depar_id: '520', name: '王○姸' },
        { depar_id: '520', name: '蔡○彤' },
        { depar_id: '526', name: '羅○喬' },
        { depar_id: '526', name: '陳○如' },
        { depar_id: '526', name: '黃○瑜' },
        { depar_id: '526', name: '趙○翔' },
        { depar_id: '526', name: '陳○慧' },
        { depar_id: '526', name: '陳○璟' },
        { depar_id: '526', name: '陳○如' },
        { depar_id: '526', name: '林○儒' },
        { depar_id: '530', name: '陳○檥' },
        { depar_id: '530', name: '魏○儒' },
        { depar_id: '530', name: '王○澤' },
        { depar_id: '530', name: '林○煦' },
        { depar_id: '530', name: '王○瑄' },
        { depar_id: '530', name: '戴○泰' },
        { depar_id: '530', name: '陳○凱' },
        { depar_id: '530', name: '洪○傑' },
        { depar_id: '610', name: '施○瑋' },
        { depar_id: '610', name: '楊○昕' },
        { depar_id: '610', name: '陳○筑' },
        { depar_id: '610', name: '凃○彤' },
        { depar_id: '610', name: '賴○冠' },
        { depar_id: '610', name: '陳○芸' },
        { depar_id: '610', name: '陳○源' },
        { depar_id: '610', name: '郭○緯' },
        { depar_id: '620', name: '許○庭' },
        { depar_id: '620', name: '蘇○宣' },
        { depar_id: '620', name: '王○云' },
        { depar_id: '620', name: '潘○樺' },
        { depar_id: '620', name: '王○妘' },
        { depar_id: '620', name: '孫○瑄' },
        { depar_id: '620', name: '李○晉' },
        { depar_id: '620', name: '黃○媛' },
        { depar_id: '630', name: '黃○恩' },
        { depar_id: '630', name: '潘○英' },
        { depar_id: '630', name: '朱○晴' },
        { depar_id: '630', name: '黃○棋' },
        { depar_id: '630', name: '劉○伶' },
        { depar_id: '630', name: '宋○賢' },
        { depar_id: '630', name: '林○涵' },
        { depar_id: '630', name: '吳○姿' },
        { depar_id: '710', name: '戴○妮' },
        { depar_id: '710', name: '賴○蓁' },
        { depar_id: '710', name: '戴○亦' },
        { depar_id: '710', name: '施○廷' },
        { depar_id: '710', name: '魏○昕' },
        { depar_id: '710', name: '林○嬋' },
        { depar_id: '710', name: '陽○宸' },
        { depar_id: '710', name: '萬○俞' },
        { depar_id: '725', name: '莊○茜' },
        { depar_id: '725', name: '林○欣' },
        { depar_id: '725', name: '林○伃' },
        { depar_id: '725', name: '許○綺' },
        { depar_id: '725', name: '史○薇' },
        { depar_id: '725', name: '詹○鈞' },
        { depar_id: '725', name: '劉○穎' },
        { depar_id: '725', name: '王○庭' },
        { depar_id: '736', name: '郭○承' },
        { depar_id: '736', name: '李○易' },
        { depar_id: '736', name: '楊○靚' },
        { depar_id: '736', name: '盧○煜' },
        { depar_id: '736', name: '郭○筠' },
        { depar_id: '736', name: '楊○婷' },
        { depar_id: '736', name: '楊○儀' },
        { depar_id: '736', name: '江○宣' },
        { depar_id: '910', name: '何○燐' },
        { depar_id: '910', name: '黃○嚴' },
        { depar_id: '110', name: '鄭○怡' },
        { depar_id: '120', name: '蕭○鈞' },
        { depar_id: '257', name: '陳○鈞' },
        { depar_id: '260', name: '董○睿' },
        { depar_id: '310', name: '籃○芸' },
        { depar_id: '335', name: '游○涵' },
        { depar_id: '415', name: '李○瑋' },
        { depar_id: '415', name: '林○鈺' },
        { depar_id: '421', name: '劉○幸' },
        { depar_id: '422', name: '蔡○葦' },
        { depar_id: '510', name: '林○淇' },
        { depar_id: '515', name: '張○文' },
        { depar_id: '520', name: '李○穎' },
        { depar_id: '725', name: '吳○璇' }
    ];






    var data = Array.from(document.querySelector("a[data-action='showcount']").textContent);
    if (data.includes('全', '部')) {
        // https://cdn.discordapp.com/attachments/1122388792016380014/1123874376408911892/image.png
        var linkElement = document.querySelector('a[data-action="showcount"]');
        var url = new URL(linkElement.href);
        url.searchParams.set('perpage', '48763');
        linkElement.href = url.toString();
        location.href = linkElement.href;
    }

    var selected_list = Array.from(document.querySelectorAll("a.aabtn"));
    var stdID_list = [];
    var stdName_list = [];

    /*分解ID&姓名*/
    selected_list.forEach(function (current, i) {
        stdID_list[i] = current.textContent.trim().split(" ")[0];
        stdName_list[i] = current.textContent.trim().split(" ")[1];
    });

    /*ID首字中文去除*/
    stdID_list.forEach(function (element, i) {
        let charArray = Array.from(element);
        while (charArray.length > 0 && isNaN(charArray[0])) {
            /*解決usericon問題*/
            if (charArray[1] == '4' && charArray[2] == '4' ||
                charArray[1] == '6' && charArray[2] == '6') {
                charArray.shift();
                charArray.shift();
            }
            else {
                charArray.shift();
            }
        }
        stdID_list[i] = charArray.join('');
        console.log(stdID_list[i] + " " + stdName_list[i]);
    });


    /*學系&書卷獎添加*/
    stdID_list.forEach(function (current, i) {
        if (current.length > 0) {
            var target_id = current.substring(3, 6);
            var target_depar = departments.find(depar_parameter => depar_parameter.id_mid === target_id);

            switch (target_depar.college) {
                case '文':
                    var textNode = document.createTextNode("⠀⠀⠀🟦" + target_depar.depar_name);
                    break;
                case '理':
                    var textNode = document.createTextNode("⠀⠀⠀🟫" + target_depar.depar_name);
                    break;
                case '社':
                    var textNode = document.createTextNode("⠀⠀⠀🟧" + target_depar.depar_name);
                    break;
                case '工':
                    var textNode = document.createTextNode("⠀⠀⠀🟨" + target_depar.depar_name);
                    break;
                case '法':
                    var textNode = document.createTextNode("⠀⠀⠀🟥" + target_depar.depar_name);
                    break;
                case '管':
                    var textNode = document.createTextNode("⠀⠀⠀🟦" + target_depar.depar_name);
                    break;
                case '教':
                    var textNode = document.createTextNode("⠀⠀⠀🟩" + target_depar.depar_name);
                    break;
                default:
                    var textNode = document.createTextNode("⠀⠀⠀🟪" + target_depar.depar_name);
            }

            if (target_depar != null && stdName_list[i].length != 4) {
                selected_list[i].appendChild(textNode);
            }
            else if (target_depar != null && stdName_list[i].length == 4) {
                selected_list[i].appendChild(textNode);
            }
        }

        if (current.length > 0) {
            /*名子首字與第三字相符*/
            let presidential_search = presidential_award_list.filter
                (
                    PA_list_parameter =>
                        (PA_list_parameter.name[0] === stdName_list[i][0]) && (PA_list_parameter.name[2] === stdName_list[i][2])
                )

            for (let j = 0; j < presidential_search.length; j++) {
                /*系所相同*/
                if (presidential_search[j].depar_id === current.substring(3, 6)) {
                    let textNode_2 = document.createTextNode("⠀👑書卷佬");
                    selected_list[i].appendChild(textNode_2);
                    break;
                }
            }
        }
    });


})();