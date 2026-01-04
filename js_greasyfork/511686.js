// ==UserScript==
// @name         8bobetfair
// @namespace    com.oldtan.8bobetfair
// @version      1.1.6
// @description  8bo必发
// @author       oldtan
// @include      https://8bo.com/football/info-betfair/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @require    http://code.jquery.com/jquery-1.11.0.min.js

// @downloadURL https://update.greasyfork.org/scripts/511686/8bobetfair.user.js
// @updateURL https://update.greasyfork.org/scripts/511686/8bobetfair.meta.js
// ==/UserScript==
// function sleep(time){
//     var timeStamp = new Date().getTime();
//     var endTime = timeStamp + time;
//     while(true){
//         if (new Date().getTime() > endTime){
//             return;
//         }
//     }
// }

$(document).ready(function() {
   
    // 选择表格
    var $table = $('.z8table.z8compact.z9betfair1');

    // 在标题行的买家和卖家挂牌ul中添加"比例"列名
    var $thead = $table.find('.z8thead');
    // $thead.find('.c0c.c0bor2l').eq(1).find('ul').append('<li>买卖市场比</li>');
    $thead.find('.c0c.c0bor2l').eq(2).find('ul').append('<li>买卖市场比</li>');

//     // 计算买家和卖家的总挂牌量
    var totalBuyerVolume = 0;
    var totalSellerVolume = 0;
    $table.find('.z8tbody .z8tr').each(function() {
        // 获取买家挂牌的挂牌量并累加
        var buyerVolume = parseInt($(this).find('.c0c.c0bor2l').eq(1).find('li').eq(1).text().replace(/,/g, ''), 10);
        totalBuyerVolume += buyerVolume;

        // 获取卖家挂牌的挂牌量并累加
        var sellerVolume = parseInt($(this).find('.c0c.c0bor2l').eq(2).find('li').eq(1).text().replace(/,/g, ''), 10);
        totalSellerVolume += sellerVolume;
    });

    // 计算每个赛果的买家和卖家挂牌量占比，并添加到表格中
    $table.find('.z8tbody .z8tr').each(function() {
        // 获取当前行
        var $row = $(this);

        // 获取买家挂牌的挂牌量
        var buyerVolume = parseInt($row.find('.c0c.c0bor2l').eq(1).find('li').eq(1).text().replace(/,/g, ''), 10);

        // 计算买家占比
        // var buyerPercentage = (buyerVolume / totalBuyerVolume * 100).toFixed(2) + '%';

        // 创建一个新的li元素用于买家占比
        // var $buyerPercentageLi = $('<li>' + buyerPercentage + '</li>');

        // 在买家挂牌ul中添加买家占比
        // var $buyerUl = $row.find('.c0c.c0bor2l').eq(1).find('ul');
        // $buyerUl.append($buyerPercentageLi);

        // 获取卖家挂牌的挂牌量
        var sellerVolume = parseInt($row.find('.c0c.c0bor2l').eq(2).find('li').eq(1).text().replace(/,/g, ''), 10);

        // 计算卖家占比
        var sellerPercentage = ((sellerVolume+buyerVolume) / (totalSellerVolume+totalBuyerVolume) * 100).toFixed(2) + '%';

        // 创建一个新的li元素用于卖家占比
        var $sellerPercentageLi = $('<li>' + sellerPercentage + '</li>');

        // 在卖家挂牌ul中添加卖家占比
        var $sellerUl = $row.find('.c0c.c0bor2l').eq(2).find('ul');
        $sellerUl.append($sellerPercentageLi);
    });

    // 计算每个赛果的买卖挂牌量之间的差异指数（倍数）(适合低水:看小排大,高水反之)
    $table.find('.z8tbody .z8tr').each(function() {
        // 获取当前行
        var $row = $(this);

        // 获取买家挂牌量
        var buyerVolumeText = $row.find('.c0c.c0bor2l').eq(1).find('li').eq(1).text();
        var buyerVolume = parseFloat(buyerVolumeText.replace(/,/g, ''));

        // 获取卖家挂牌量
        var sellerVolumeText = $row.find('.c0c.c0bor2l').eq(2).find('li').eq(1).text();
        var sellerVolume = parseFloat(sellerVolumeText.replace(/,/g, ''));

        // 计算差异指数（倍数）
        var difference倍数;
        if (buyerVolume === 0 || sellerVolume === 0) {
            difference倍数 = (buyerVolume === 0) ? '无穷大' : '无穷大';
        } else {
            difference倍数 = Math.max(buyerVolume / sellerVolume, sellerVolume / buyerVolume);
        }

        // 创建一个新的li元素用于显示差异指数（倍数）
        var $differenceLi = $('<li>' + difference倍数.toFixed(2) + ' 倍</li>');

        // 在当前行的第四个ul中添加差异指数（倍数）
        var $fourthUl = $row.find('.c0c.c0bor2l').eq(2).find('ul'); // 选择当前行的第四个ul
        $differenceLi.appendTo($fourthUl); // 使用appendTo方法添加元素
    });


    // 计算挂牌量差异的绝对值相对于两者挂牌量总和的比例(高水:看大排小,低水反之,但是目前感觉适合高水看大,且越看平越不平)
    $table.find('.z8tbody .z8tr').each(function() {
        // 获取当前行
        var $row = $(this);

        // 获取买家挂牌量
        var buyerVolumeText = $row.find('.c0c.c0bor2l').eq(1).find('li').eq(1).text();
        var buyerVolume = parseFloat(buyerVolumeText.replace(/,/g, ''));

        // 获取卖家挂牌量
        var sellerVolumeText = $row.find('.c0c.c0bor2l').eq(2).find('li').eq(1).text();
        var sellerVolume = parseFloat(sellerVolumeText.replace(/,/g, ''));

        // 计算总挂牌量和差异指数
        var totalVolume = buyerVolume + sellerVolume;
        var difference = Math.abs(buyerVolume - sellerVolume);
        var predictionIndex = (difference / totalVolume) * 100;

        // 创建一个新的li元素用于显示预测指数
        var $predictionLi = $('<li>' + predictionIndex.toFixed(2) + '%</li>');
        // var $predictionLi = $('<li>' + calculateVariance(buyerVolume,sellerVolume) + '</li>');

        // 在当前行的第三个ul中添加预测指数
        var $thirdUl = $row.find('.c0c.c0bor2l').eq(2).find('ul'); // 选择当前行的第三个ul
        $predictionLi.appendTo($thirdUl); // 使用appendTo方法添加元素
    });



    // 基于挂牌量差异和概率的加权预测模型。这种方法会考虑买家挂牌量、卖家挂牌量以及99家平均概率，来给出一个综合的预测指标。(感觉综合能力挺强,通吃高低水)
    // 如果预测指数为正数且较大，预测买家挂牌量较高的结果更有可能出现。
    // 如果预测指数为负数且较大，预测卖家挂牌量较高的结果更有可能出现。
    // 如果预测指数接近零，表示市场对结果的看法比较均衡。
    $table.find('.z8tbody .z8tr').each(function() {
        // 获取当前行
        var $row = $(this);

        // 获取买家挂牌量
        var buyerVolumeText = $row.find('.c0c.c0bor2l').eq(1).find('li').eq(1).text();
        var buyerVolume = parseFloat(buyerVolumeText.replace(/,/g, ''));

        // 获取卖家挂牌量
        var sellerVolumeText = $row.find('.c0c.c0bor2l').eq(2).find('li').eq(1).text();
        var sellerVolume = parseFloat(sellerVolumeText.replace(/,/g, ''));

        // 获取99家平均概率
        var probabilityText = $row.find('.c0c.c0bor2l').eq(0).find('li').eq(1).text();
        var probability = parseFloat(probabilityText);

        // 计算预测指数
        var difference = buyerVolume - sellerVolume;
        var predictionIndex = (difference / probability) * 100;

        // 创建一个新的li元素用于显示预测指数
        var $predictionLi = $('<li>' + predictionIndex.toFixed(2) + '</li>');

        // 在当前行的第三个ul中添加预测指数
        var $thirdUl = $row.find('.c0c.c0bor2l').eq(2).find('ul'); // 选择当前行的第三个ul
        $predictionLi.appendTo($thirdUl); // 使用appendTo方法添加元素
    });



    // 基于挂牌量和概率的调和平均数来预测比赛结果的方法。这种方法将考虑买家挂牌量、卖家挂牌量以及99家平均概率，并通过调和平均数给出一个综合的预测指标
    // 预测指数 > 100：预测该结果更有可能出现。
    // 预测指数 < 100：预测该结果较不可能出现。
    // 预测指数 ≈ 100：市场对结果的看法比较均衡。
    $table.find('.z8tbody .z8tr').each(function() {
        // 获取当前行
        var $row = $(this);

        // 获取买家挂牌量
        var buyerVolumeText = $row.find('.c0c.c0bor2l').eq(1).find('li').eq(1).text();
        var buyerVolume = parseFloat(buyerVolumeText.replace(/,/g, ''));

        // 获取卖家挂牌量
        var sellerVolumeText = $row.find('.c0c.c0bor2l').eq(2).find('li').eq(1).text();
        var sellerVolume = parseFloat(sellerVolumeText.replace(/,/g, ''));

        // 获取99家平均概率
        var probabilityText = $row.find('.c0c.c0bor2l').eq(0).find('li').eq(1).text();
        var probability = parseFloat(probabilityText);

        // 计算预测指数
        var predictionIndex = ((buyerVolume + sellerVolume) / probability) * 100;

        // 创建一个新的li元素用于显示预测指数
        var $predictionLi = $('<li>' + predictionIndex.toFixed(2) + '</li>');

        // 在当前行的第三个ul中添加预测指数
        var $thirdUl = $row.find('.c0c.c0bor2l').eq(2).find('ul'); // 选择当前行的第三个ul
        $predictionLi.appendTo($thirdUl); // 使用appendTo方法添加元素
    });


    // 选择所有.c0c下的li元素，并设置宽度为33%
    $('.z9betfair1 .c0c li').css('width', '33%');
    // 设置每个ul中带有.c0c类的li元素的第一个宽度为10%，第二个为15%
    $table.find('ul').each(function() {
        $(this).find('li.c0c').first().css('width', '20%');
        $(this).find('li.c0c').eq(1).css('width', '20%');
        $(this).find('li.c0c').eq(2).css('width', '30%');
        $(this).find('li.c0c').eq(3).css('width', '30%');
        // $(this).find('li.c0c').eq(3).css('width', '20%');
    });

    // 假设的计算公式：预测值 = (买家挂牌量 - 卖家挂牌量) / (买家挂牌价位 + 卖家挂牌价位)(感觉看大)
//     $('.z9betfair5 .z8tr').each(function() {
//         var buyerPrice = parseFloat($(this).find('.c0c.c0bor2l:eq(0) ul li:eq(0)').text());
//         var buyerVolume = parseInt($(this).find('.c0c.c0bor2l:eq(0) ul li:eq(1)').text().replace(/,/g, ''));
//         var sellerPrice = parseFloat($(this).find('.c0c.c0bor2l:eq(1) ul li:eq(0)').text());
//         var sellerVolume = parseInt($(this).find('.c0c.c0bor2l:eq(1) ul li:eq(1)').text().replace(/,/g, ''));

//         var prediction = (buyerVolume - sellerVolume) / (buyerPrice + sellerPrice);

//         // 将预测值添加到每行的末尾
//         $(this).find('.c0c.c0bor2l:last ul').append('<li>' + prediction.toFixed(2) + '</li>');
//     });

    $('.z9betfair5').find('.c0c.c0bor2l').eq(1).find('ul').append('<li>买卖市场比</li>');
     // 计算买家和卖家的总挂牌量
    var totalBuyerVolume5 = 0;
    var totalSellerVolume5 = 0;
    $('.z9betfair5 .z8tr').each(function() {
        // 获取买家挂牌的挂牌量并累加
        var buyerVolume = parseInt($(this).find('.c0c.c0bor2l').eq(0).find('li').eq(1).text().replace(/,/g, ''), 10);
        totalBuyerVolume5 += buyerVolume;

        // 获取卖家挂牌的挂牌量并累加
        var sellerVolume = parseInt($(this).find('.c0c.c0bor2l').eq(1).find('li').eq(1).text().replace(/,/g, ''), 10);
        totalSellerVolume5 += sellerVolume;
    });

    // 计算每个赛果的买家和卖家挂牌量占比，并添加到表格中
    $('.z9betfair5 .z8tr').each(function() {
        // 获取当前行
        var $row = $(this);

        // 获取买家挂牌的挂牌量
        var buyerVolume = parseInt($row.find('.c0c.c0bor2l').eq(0).find('li').eq(1).text().replace(/,/g, ''), 10);

        // 获取卖家挂牌的挂牌量
        var sellerVolume = parseInt($row.find('.c0c.c0bor2l').eq(1).find('li').eq(1).text().replace(/,/g, ''), 10);

        // 计算卖家占比
        var sellerPercentage = ((sellerVolume+buyerVolume) / (totalSellerVolume5+totalBuyerVolume5) * 100).toFixed(2) + '%';

        // 创建一个新的li元素用于卖家占比
        var $sellerPercentageLi = $('<li>' + sellerPercentage + '</li>');

        // 在卖家挂牌ul中添加卖家占比
        var $sellerUl = $row.find('.c0c.c0bor2l').eq(1).find('ul');
        $sellerUl.append($sellerPercentageLi);
    });

    // 新的计算公式：预测值 = ((买家挂牌量 * 买家挂牌价位) + (卖家挂牌量 * 卖家挂牌价位)) / (买家挂牌量 + 卖家挂牌量)(感觉看小)
//     $('.z9betfair5 .z8tr').each(function() {
//         var buyerPrice = parseFloat($(this).find('.c0c.c0bor2l:eq(0) ul li:eq(0)').text());
//         var buyerVolume = parseInt($(this).find('.c0c.c0bor2l:eq(0) ul li:eq(1)').text().replace(/,/g, ''));
//         var sellerPrice = parseFloat($(this).find('.c0c.c0bor2l:eq(1) ul li:eq(0)').text());
//         var sellerVolume = parseInt($(this).find('.c0c.c0bor2l:eq(1) ul li:eq(1)').text().replace(/,/g, ''));

//         var prediction = (buyerVolume * buyerPrice + sellerVolume * sellerPrice) / (buyerVolume + sellerVolume);

//         // 检查最后一个.c0c.c0bor2l元素内是否有ul元素
//         var $lastUl = $(this).find('.c0c.c0bor2l:last ul');
//         if ($lastUl.length === 0) {
//             // 如果没有，创建一个新的ul元素并添加到.c0c.c0bor2l元素中
//             $lastUl = $('<ul></ul>').appendTo($(this).find('.c0c.c0bor2l:last ul'));
//         }

//         // 将预测值添加到ul中
//         $lastUl.append('<li>' + prediction.toFixed(2) + '</li>');
//     });

    //---------------------------------------------交易量----------------------------------------------------------------------------------



    // 获取.z9betfair6下的.z8content中的所有ul元素
//     var $contentUl = $('.z9betfair3 .z8content ul.z8tr');
//     // 遍历每个ul元素
//     $contentUl.each(function() {
//         // 提取价位和交易比例
//         var priceText = $(this).find('li.c0c.c0bor2l ul li').eq(0).text(); // 假设价位在第一个li
//         var volumePercentText = $(this).find('li.c0c.c0bor2l ul li').eq(1).text(); // 假设交易比例在第三个li
//         var price = parseFloat(priceText);
//         var volumePercent = parseFloat(volumePercentText.replace(/,/g, '')) ;// 100; // 将百分比转换为小数

//         // 计算方差
//         var variance = calculateVariance(price, volumePercent);

//         // 创建新的li元素
//         var $newLi = $('<li class="c0c c0bor2l"><ul><li>' + variance.toFixed(2) + '</li></ul></li>');

//         // 将新的li元素添加到当前ul元素的末尾
//         $(this).append($newLi);
//     });
//     $('.z9betfair3 .c0c:nth-child(1)').css('width', '10%');
//     $('.z9betfair3 .c0c:nth-child(2)').css('width', '40%');
//     $('.z9betfair3 .c0c:nth-child(3)').css('width', '30%');
//     $('.z9betfair3 .c0c:nth-child(4)').css('width', '20%');

    //---------------------------------------------大小球----------------------------------------------------------------------------------



    // 获取.z9betfair6下的.z8content中的所有ul元素
    var $contentUl = $('.z9betfair6 .z8content ul.z8tr');
    // 遍历每个ul元素
    $contentUl.each(function() {
        // 提取价位和交易比例
        var priceText = $(this).find('li.c0c.c0bor2l ul li').eq(0).text(); // 假设价位在第一个li
        var volumePercentText = $(this).find('li.c0c.c0bor2l ul li').eq(1).text(); // 假设交易比例在第三个li
        var price = parseFloat(priceText);
        var volumePercent = parseFloat(volumePercentText.replace(/,/g, '')) ;// 100; // 将百分比转换为小数

        // 计算方差
        var variance = calculateVariance(price, volumePercent);

        // 创建新的li元素
        var $newLi = $('<li class="c0c c0bor2l"><ul><li>' + variance.toFixed(2) + '</li></ul></li>');

        // 将新的li元素添加到当前ul元素的末尾
        $(this).append($newLi);
    });

    // 方差计算函数
    function calculateVariance(price, volumePercent) {
        console.log(price, volumePercent);
        var mean = (price + volumePercent) / 2;
        var variance = (price - mean) * (price - mean) + (volumePercent - mean) * (volumePercent - mean);
        // var variance = Math.pow(price - mean, 2) + Math.pow(volumePercent - mean, 2);
        // variance /= 2; // 因为我们只有两个数据点
        return variance / 2;
    }

    // 设置.z9betfair6下所有.c0c元素的宽度为30%
    $('.z9betfair6 .c0c.c0bor2l:nth-child(2)').css('width', '40%');
    $('.z9betfair6 .c0c.c0bor2l:nth-child(3)').css('width', '30%');
    $('.z9betfair6 .c0c.c0bor2l:nth-child(4)').css('width', '20%');



});



function Toast(msg,duration){
      duration=isNaN(duration)?3000:duration;
      var m = document.createElement('div');
      m.innerHTML = msg;
      m.style.cssText="max-width:60%;min-width: 150px;padding:0 14px;height: 60px;color: rgb(255, 255, 255);line-height: 60px;text-align: center;border-radius: 4px;position: fixed;top: 40%;left: 50%;transform: translate(-50%, -50%);z-index: 999999;background: rgba(0, 0, 0,.7);font-size: 16px;";
      document.body.appendChild(m);
      setTimeout(function() {
        var d = 0.5;
        m.style.webkitTransition = '-webkit-transform ' + d + 's ease-in, opacity ' + d + 's ease-in';
        m.style.opacity = '0';
        setTimeout(function() { document.body.removeChild(m) }, d * 1000);
      }, duration);
    }


function Toast2(msg,duration){
      duration=isNaN(duration)?3000:duration;
      var m = document.createElement('div');
      m.innerHTML = msg;
      m.style.cssText="max-width:60%;min-width: 150px;padding:0 14px;height: 60px;color: rgb(255, 255, 255);line-height: 60px;text-align: center;border-radius: 4px;position: fixed;top: 50%;left: 50%;transform: translate(-50%, -50%);z-index: 999999;background: rgba(0, 0, 0,.7);font-size: 16px;";
      document.body.appendChild(m);
      setTimeout(function() {
        var d = 0.5;
        m.style.webkitTransition = '-webkit-transform ' + d + 's ease-in, opacity ' + d + 's ease-in';
        m.style.opacity = '0';
        setTimeout(function() { document.body.removeChild(m) }, d * 1000);
      }, duration);
    }



