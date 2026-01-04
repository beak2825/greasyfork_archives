// ==UserScript==
// @name         The Watch Pages 商品信息采集
// @namespace    http://tampermonkey.net/
// @version      2.0.5
// @description  从The Watch Pages的商品页面提取商品信息并同时打印信息到控制台并下载CSV文件
// @author       Your Name
// @match        https://www.thewatchpages.com/watches/*
// @exclude      https://www.thewatchpages.com/watches/all/
// @icon         https://www.thewatchpages.com/favicon.ico
// @grant        none
// @license MIT
// @require      https://cdn.jsdelivr.net/npm/lodash@4.17.21/lodash.min.js
// @downloadURL https://update.greasyfork.org/scripts/510071/The%20Watch%20Pages%20%E5%95%86%E5%93%81%E4%BF%A1%E6%81%AF%E9%87%87%E9%9B%86.user.js
// @updateURL https://update.greasyfork.org/scripts/510071/The%20Watch%20Pages%20%E5%95%86%E5%93%81%E4%BF%A1%E6%81%AF%E9%87%87%E9%9B%86.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 获取元素文本内容函数
    function getInnerText(element) {
        return element ? element.textContent.trim() : '';
    }

    // 获取元素文本内容并处理空值函数
    function getInnerTextOrDefault(element, defaultValue) {
        return getInnerText(element) || defaultValue;
    }


    // 获取品牌
    let vendorElement = document.querySelector('.leading-snug .title');
    let vendor = getInnerTextOrDefault(vendorElement, '未知品牌');
    console.log('品牌:', vendor); // 输出品牌信息到控制台

    // 获取商品标题
    let titleElement = document.querySelector('.leading-snug span.block');
    let title = getInnerTextOrDefault(titleElement, '未知商品标题');
    console.log('商品标题:', title); // 输出商品标题到控制台

    // 获取规格信息
    let sizeElement = document.querySelector('dl.flex div:nth-of-type(1) dd');
    let caseSize = getInnerTextOrDefault(sizeElement, '未知尺寸');
    console.log('尺寸:', caseSize); // 输出尺寸信息到控制台

    let materialElement = document.querySelector('dl.flex div:nth-of-type(3) dd');
    let caseMaterial = getInnerTextOrDefault(materialElement, '未知材质');
    console.log('材质:', caseMaterial); // 输出材质信息到控制台

    let movementElement = document.querySelector('dl.flex div:nth-of-type(5) dd');
    let movement = getInnerTextOrDefault(movementElement, '未知机芯');
    console.log('机芯:', movement); // 输出机芯信息到控制台

    let model = `${caseSize}-${caseMaterial}-${movement}`;
    console.log('型号:', model); // 输出组合后的型号信息到控制台

    // 获取价格并去掉特殊符号
    let priceElement = document.querySelector('.watch-price .woocommerce-Price-amount');
    let price = getInnerTextOrDefault(priceElement, '未知价格').replace(/[^\d.,]/g, '');
    console.log('价格:', price); // 输出价格信息到控制台

    // 获取图片链接并排除特定部分
    let allImageElements = document.querySelectorAll('picture source');
    let excludedSection = document.querySelector('section.mb-12.md\\:container.xl\\:mb-14');

    let validImages = Array.from(allImageElements)
    .filter(img => !excludedSection || !excludedSection.contains(img)) // 排除指定部分内的图片
    .map(img => img.srcset.split(',')[0].trim().split(' ')[0].split('?')[0])
    .filter((value, index, self) => self.indexOf(value) === index)
    .filter(imgUrl => ![
        'https://cdn.thewatchpages.com/app/uploads/2024/04/26192349/cuervo-y-sobrinos-churchill-sir-winston-2810b1swb-8.jpeg',
        'https://cdn.thewatchpages.com/app/uploads/2024/05/31003510/kross-studio-the-chromatic-watch-roll-red-wrksc-frd22-1.jpeg',
        'https://cdn.thewatchpages.com/app/uploads/2024/07/09130246/JAA03657.jpg',
        'https://cdn.thewatchpages.com/app/uploads/2024/09/03164818/nicholashoultatthepressconferenceoftheorderwearingjaeger-lecoultre%40gettyimages-copy-1.jpg',
        'https://cdn.thewatchpages.com/app/uploads/2022/02/01112029/MBandf_MADGallery_Dubai_15_Lres.jpg',
        'https://cdn.thewatchpages.com/app/uploads/2024/05/22143007/jaeger-lecoultre-polaris-perpetual-calendar-q908263j-5.jpeg',
        'https://cdn.thewatchpages.com/app/uploads/2020/10/13210444/manufacturing_TITONI_59.jpg',
        'https://cdn.thewatchpages.com/app/uploads/2024/05/28092453/rm_27_05_sf_fabien_01-copy.jpg',
        'https://cdn.thewatchpages.com/app/uploads/2020/11/13205927/frederique-constant-flyback-chronograph-manufacture-about-vintage-special-edition-fc-760cph4h6-2.jpg'
    ].includes(imgUrl));

    // 自然排序函数
    function naturalSort(a, b) {
        return a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' });
    }

    // 提取URL中的日期部分并用于排序
    function extractDateFromUrl(url) {
        const match = url.match(/\/(\d{4})\/(\d{2})\/(\d{2})\//);
        return match ? `${match[1]}-${match[2]}-${match[3]}` : ''; // 将日期格式化为 YYYY-MM-DD
    }

    // 使用 lodash 进行排序
    validImages = _.chain(validImages)
                   .groupBy(extractDateFromUrl) // 按日期分组
                   .mapValues(images => _.sortBy(images, naturalSort)) // 对相同日期的图片按自然顺序升序排列
                   .values()
                   .flatten()
                   .value();

    console.log('图片链接（日期+自然排序后）:', validImages); // 输出排序后的图片链接到控制台

    // 获取面包屑信息
    let breadcrumbElement = document.querySelector('#breadcrumb ol');
    let breadcrumbs = getInnerTextOrDefault(breadcrumbElement, '未知面包屑路径').split('\n').join(' > ');
    console.log('面包屑路径:', breadcrumbs); // 输出面包屑路径信息到控制台

    // 获取规格信息
    let technicalDataElement = document.querySelector('.spec-items');
    let technicalDataText = getInnerTextOrDefault(technicalDataElement, '无规格信息').replace(/,/g, '，');
    console.log('规格信息:', technicalDataText); // 输出规格信息到控制台


    // 整合信息
    let basicInfo = `${vendor} ${title} ${model}`.trim();
    let dataTxt = `${basicInfo}\n` +
        `品牌: ${vendor}\n` +
        `型号: ${model}\n` +
        `面包屑路径: ${breadcrumbs}\n` +
        `规格信息:\n${technicalDataText}\n` +
        `Product 链接:\n${validImages.join('\n')}\n`;

    // 使用逗号作为分隔符来创建CSV内容
    let csvRows = [
        ['商品标题', '商品描述', '商品图片'],  // CSV表头
        [`"${basicInfo}"`, `"${technicalDataText.replace(/\n/g, ' ')}"`, `"${validImages.join(',')}"`] // CSV内容
    ];

    // 将数组转换为CSV格式的字符串
    let csvContent = csvRows.map(e => e.join(',')).join('\n');

    // 创建下载链接并触发下载
    let sanitizedFileName = basicInfo.replace(/[^\w\s]/gi, '').replace(/\s+/g, '_');
    let encodedUri = encodeURI(`data:text/csv;charset=utf-8,${csvContent}`);
    let link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${sanitizedFileName}.csv`); // 使用变量 sanitizedFileName 作为文件名
    document.body.appendChild(link); // Required for FF

    link.click();
    document.body.removeChild(link);


})();