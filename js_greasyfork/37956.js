// ==UserScript==
// @name 自动下注
// @description zidongxiazhu
// @version 0.1.8
// @namespace ys2889.com
// @match *://www.ys2889.com/Game/Index
// @downloadURL https://update.greasyfork.org/scripts/37956/%E8%87%AA%E5%8A%A8%E4%B8%8B%E6%B3%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/37956/%E8%87%AA%E5%8A%A8%E4%B8%8B%E6%B3%A8.meta.js
// ==/UserScript==
(function () {
    var mode = ['odd', 'even', 'big', 'little'] //单、双、大、小
    var diJiQi = parseInt($('#lastno').text().trim(), 10);
    var tryTime = 0;
    var currentModeIndex = 0;

    function main() {
        var result = $('#topTime:visible').text().replace(/\s/g, '').match(/离(\d+)期投注截止还有(\d+)秒/);
        // 等待下注的未压过
        if (result && result.length === 3 && diJiQi !== result[1]) {
            enterAndXiaZhu(result[1])
        } else if ($('#topTime:visible').text() === '已开奖，点此刷新') {
            // 刷新页面看开建结果
            changeGame('jnd28')
            setTimeout(function canGetLastReust(){
                if(parseInt($('#lastno').text().trim(), 10) === diJiQi){
                    changeTryTime();                    
                    // 不管输赢 都要进行下1次投注
                    main();
                }else{
                    setTimeout(canGetLastReust, 1000)
                }
            }, 1000)
        }else{
            setTimeout(main, 1000)
        }
    }
    // *******开启逻辑*******
    setTimeout(main, 1000)

    function isWin() {
        var sum = 0;
        $('.li4 .num').each(function (index, num) {
            sum = sum + parseInt($(num).text(), 10)
        });
        var result;
        switch (currentModeIndex) {
            case 0: // 单
                result = sum % 2 === 1;
                break;
            case 1: // 双
                result = sum % 2 === 0;
                break;
            case 2: // 大
                result = sum >= 14;
                break;
            case 3: // 小
                result = sum <= 13;
                break;
        }
        return result;
    }

    function enterAndXiaZhu(qiShu) {
        // 进入下注页面
        getGameBet(qiShu);
        setTimeout(function isXiaZhuYeMian() {
            // 下注页面
            if ($('#pointerSubmit').length > 0) {
                xiaZhu();
                diJiQi = qiShu;
                main();
            } else {
                setTimeout(isXiaZhuYeMian, 1000)
            }
        }, 1000)
    }

    function xiaZhu() {
        // 选模式
        getModeFn()(mode[currentModeIndex])

        // 改倍数
        zdytz(1000 * Math.pow(2, tryTime))

        setTimeout(function () {
            // 下注
            submitBet()
            setTimeout(function(){
                $('.layui-layer-dialog .layui-layer-btn0').click();
            },100);            
        }, 200)
    }

    function changeTryTime() {
        // 如果赢了，从新压起
        if (isWin()) {
            tryTime = 0;
            chooseMode();
        } else if (tryTime < 7) {
            // 如果输的次数少于7次，继续压
            tryTime++;
        } else {
            // 如果连输7次，从新压起
            tryTime = 0;
            chooseMode();
        }
    }

    // 每次按顺序换押注模式
    function chooseMode() {
        if (currentModeIndex >= 0 && currentModeIndex < 3) {
            currentModeIndex++
        } else {
            currentModeIndex = 0;
        }
    }

    function getModeFn() {
        if (currentModeIndex === 0 || currentModeIndex === 1) {
            return $.fn.AOddEven;
        } else if (currentModeIndex === 2 || currentModeIndex === 3) {
            return $.fn.ABigLittle;
        }
    }
})()