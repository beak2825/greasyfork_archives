// ==UserScript==
// @name         Steam 市场价格均线
// @namespace    http://tampermonkey.net/
// @version      2024-03-29
// @description  在Steam市场的历史成交价格上显示任意日期内的均线。
// @author       Cliencer Goge
// @match        https://steamcommunity.com/market/listings/*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=steamcommunity.com
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @license      GPLv3
// @downloadURL https://update.greasyfork.org/scripts/491198/Steam%20%E5%B8%82%E5%9C%BA%E4%BB%B7%E6%A0%BC%E5%9D%87%E7%BA%BF.user.js
// @updateURL https://update.greasyfork.org/scripts/491198/Steam%20%E5%B8%82%E5%9C%BA%E4%BB%B7%E6%A0%BC%E5%9D%87%E7%BA%BF.meta.js
// ==/UserScript==
(function() {
    'use strict';
    Hook_pricehistory_zoomLifetime()
    Hook_pricehistory_zoomDays()
    var settingdialog=initsettingdialog()
    var saves = readstorage()
    const url = window.location.href;
    const parts = new URL(url).pathname.split('/');
    const appId = parts[3];
    const itemName = parts[4];
    var lineoption={lines:[],series:[],seriesColors:[]}
    var strFormatPrefix = "¥"
    var strFormatSuffix = ""
    var mainbutton = createButton()
    var prices = g_plotPriceHistory.data[0]
    myCreatePriceHistoryGraph( 5 )
    function generatelineoption(){
        lineoption ={lines:[prices],series:[{lineWidth:3, markerOptions:{show: false, style:'circle'}}],seriesColors:["#688F3E"]}
        for(var line of saves.linelist){
            var lineav = calculateAverage(prices, line.days)
            lineoption.lines.push(lineav)
            lineoption.series.push({lineWidth:1, markerOptions:{show: false, style:'circle'},highlighter:{formatString: '<h5>'+line.days +'日线</h5><strong>%s</strong><br>'+strFormatPrefix +'%0.2f'+strFormatSuffix+'<br>日均售出 %d 件'}})
            lineoption.seriesColors.push(line.color)
        }
    }
    function Hook_pricehistory_zoomDays(){
        if (typeof pricehistory_zoomDays === 'function') {
            console.log("Hook pricehistory_zoomDays成功");
            const originalPricehistoryZoomDays = pricehistory_zoomDays;
            pricehistory_zoomDays = function(arg1, arg2, arg3, arg4) {
                console.log('pricehistory_zoomDays:', arg1, arg2, arg3, arg4);
                return originalPricehistoryZoomDays.apply(this, [arg1, arg2, arg3, arg4]);
            };
        } else {
            console.log("Hook失败，重试");
            setTimeout(Hook_pricehistory_zoomDays,1000)
        }
    }
    function Hook_pricehistory_zoomLifetime(){
        if (typeof pricehistory_zoomLifetime === 'function') {
            console.log("Hook pricehistory_zoomLifetime成功");
            const originalPricehistoryZoomLifetime = pricehistory_zoomLifetime;
            pricehistory_zoomLifetime = function(arg1, arg2, arg3) {
                console.log('pricehistory_zoomLifetime:', arg1, arg2, arg3);
                return originalPricehistoryZoomLifetime.apply(this, [arg1, arg2, arg3]);
            };
        } else {
            console.log("Hook失败，重试");
            setTimeout(Hook_pricehistory_zoomLifetime,1000)
        }
    }
    function myCreatePriceHistoryGraph(numYAxisTicks){
        generatelineoption()
        g_plotPriceHistory.destroy()
        g_plotPriceHistory = null
        var plot = $J.jqplot('pricehistory', lineoption.lines, {
            title:{text: '售价中位数', textAlign: 'left' },
            gridPadding:{left: 45, right:45, top:25},
            axesDefaults:{ showTickMarks:true },
            axes:{
                xaxis:{
                    renderer:$J.jqplot.DateAxisRenderer,
                    tickOptions:{formatString:'%b %#d<span class="priceHistoryTime"> %#I%p<span>'},
                    pad: 1
                },
                yaxis: {
                    pad: 1.1,
                    tickOptions:{formatString:strFormatPrefix + '%0.2f' + strFormatSuffix, labelPosition:'start', showMark: false},
                    numberTicks: numYAxisTicks
                }
            },
            grid: {
                gridLineColor: '#1b2939',
                borderColor: '#1b2939',
                background: '#101822'
            },
            cursor: {
                show: true,
                zoom: true,
                showTooltip: false
            },
            highlighter: {
                show: true,
                lineWidthAdjust: 2.5,
                sizeAdjust: 5,
                showTooltip: true,
                tooltipLocation: 'n',
                tooltipOffset: 20,
                fadeTooltip: true,
                yvalues: 2,
                formatString: '<strong>%s</strong><br>%s<br>已售出 %d 件'
            },
                series:lineoption.series,
                seriesColors: lineoption.seriesColors
            });
            plot.defaultNumberTicks = numYAxisTicks;
            g_plotPriceHistory = plot
            pricehistory_zoomDays( g_plotPriceHistory, g_timePriceHistoryEarliest, g_timePriceHistoryLatest, 7 )
        return plot;
    }
    function calculateAverage(prices, days) {
        const result = [];
        const oneHour = 60 * 60 * 1000;
        const hoursInDay = 24;
        const totalHours = days * hoursInDay;
        prices.forEach((item, index) => {
            const [dateStr, price, quantityStr] = item;
            const date = new Date(dateStr.substring(0, 11) + " " + dateStr.substring(12, 14) + ":00:00");
            const priceNumber = parseFloat(price);
            const quantity = parseInt(quantityStr, 10);
            let totalWeightedPrice = priceNumber * quantity;
            let totalQuantity = quantity;
            let earliestDate = new Date(date.getTime() - totalHours * oneHour);
            let actualHours = 1;
            for (let j = index - 1; j >= 0; j--) {
                const [prevDateStr, prevPrice, prevQuantityStr] = prices[j];
                const prevDate = new Date(prevDateStr.substring(0, 11) + " " + prevDateStr.substring(12, 14) + ":00:00");
                if (prevDate >= earliestDate) {
                    const prevPriceNumber = parseFloat(prevPrice);
                    const prevQuantity = parseInt(prevQuantityStr, 10);
                    totalWeightedPrice += prevPriceNumber * prevQuantity;
                    totalQuantity += prevQuantity;
                    const diffHours = Math.abs((date - prevDate) / oneHour);
                    actualHours += diffHours;
                } else {
                    break;
                }
            }
            const averagePrice = totalWeightedPrice / totalQuantity;
            const averageDailyQuantity = totalQuantity / (actualHours / hoursInDay);
            result.push([dateStr, averagePrice.toFixed(3), averageDailyQuantity.toFixed(3)]);
        });
        return result;
    }
    function createButton(){
        const button = document.createElement('button');
        button.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 256 256" preserveAspectRatio="xMidYMid"><path d="M127.779 0C60.42 0 5.24 52.412 0 119.014l68.724 28.674a35.812 35.812 0 0 1 20.426-6.366c.682 0 1.356.019 2.02.056l30.566-44.71v-.626c0-26.903 21.69-48.796 48.353-48.796 26.662 0 48.352 21.893 48.352 48.796 0 26.902-21.69 48.804-48.352 48.804-.37 0-.73-.009-1.098-.018l-43.593 31.377c.028.582.046 1.163.046 1.735 0 20.204-16.283 36.636-36.294 36.636-17.566 0-32.263-12.658-35.584-29.412L4.41 164.654c15.223 54.313 64.673 94.132 123.369 94.132 70.818 0 128.221-57.938 128.221-129.393C256 57.93 198.597 0 127.779 0zM80.352 196.332l-15.749-6.568c2.787 5.867 7.621 10.775 14.033 13.47 13.857 5.83 29.836-.803 35.612-14.799a27.555 27.555 0 0 0 .046-21.035c-2.768-6.79-7.999-12.086-14.706-14.909-6.67-2.795-13.811-2.694-20.085-.304l16.275 6.79c10.222 4.3 15.056 16.145 10.794 26.46-4.253 10.314-15.998 15.195-26.22 10.895zm121.957-100.29c0-17.925-14.457-32.52-32.217-32.52-17.769 0-32.226 14.595-32.226 32.52 0 17.926 14.457 32.512 32.226 32.512 17.76 0 32.217-14.586 32.217-32.512zm-56.37-.055c0-13.488 10.84-24.42 24.2-24.42 13.368 0 24.208 10.932 24.208 24.42 0 13.488-10.84 24.421-24.209 24.421-13.359 0-24.2-10.933-24.2-24.42z" fill="#1A1918"/></svg>`;
        button.style.position = 'fixed';
        button.style.top = saves.buttonposition;
        button.style.zIndex = '9999'
        button.style.transition = 'transform 0.3s ease';
        button.style.opacity = '0.5';
        button.style.backgroundColor = 'transparent';
        button.style.border = 'none';
        button.style.cursor = 'pointer';
        button.style.left = '0'
        button.style.clipPath = 'polygon(100% 50%, 85% 100%, 0 100%,0 0, 85% 0)';
        button.style.transform = 'translate(0%, -50%)';
        button.style.background = 'linear-gradient(to bottom right, pink, lightblue)';
        var isDragging = false;
        button.onmousedown = function(e) {
            isDragging = true;
            function onMouseMove(e) {
                if (!isDragging) return;
                button.style.top = `${e.clientY}px`;
            }
            function onMouseUp() {
                isDragging = false;
                saves.buttonposition = button.style.top
                window.removeEventListener('mousemove', onMouseMove);
                window.removeEventListener('mouseup', onMouseUp);
                savestorage()
            }
            window.addEventListener('mousemove', onMouseMove);
            window.addEventListener('mouseup', onMouseUp);
        };
        button.onmouseover = function() {
            this.style.opacity = '1';
            this.style.transform = 'translate(0%, -50%)';
        };
        button.onmouseleave = function() {
            if(isDragging) return;
            this.style.opacity = '0.5';
            this.style.transform = 'translate(-50%, -50%)';
        };
        button.addEventListener('click', showsettingdialog);
        button.ondragstart = function() {
            return false;
        };
        document.body.appendChild(button);
        return button
    }
    function showsettingdialog(){
        const colorPickers = document.getElementById('colorPickers');
        colorPickers.innerHTML = '';
        saves.linelist.forEach(item => {
            const colorPickerContainer = document.createElement('div');
            colorPickerContainer.innerHTML = `
            <input type="number" min="1" max="120" class="numberInput" value="${item.days}">
            <input type="color" class="colorInput" value="${item.color}">
        `;
            colorPickers.appendChild(colorPickerContainer);
        });
        settingdialog.style.display = 'block'
    }
    function initsettingdialog(){
        const modal = document.createElement('div');
        modal.style.position = 'fixed';
        modal.style.top = '20%';
        modal.style.left = '5%';
        modal.style.transform = 'translate(0, 0%)';
        modal.style.backgroundColor = '#fff';
        modal.style.padding = '20px';
        modal.style.zIndex = '9999';
        modal.style.display = 'none';
        modal.style.border = '1px solid #ccc';
        modal.style.boxShadow = '0 4px 6px rgba(0,0,0,.1)';
        document.body.appendChild(modal);
        modal.innerHTML = `
       <div> 均线设置</div>
  <div id="colorPickers"></div>
  <button id="confirmBtn">确定</button>
  <button id="cancelBtn">取消</button>
`;
        document.getElementById('confirmBtn').addEventListener('click', function() {
            const numberInputs = document.querySelectorAll('.numberInput');
            const colorInputs = document.querySelectorAll('.colorInput');
            const lineList = [];
            numberInputs.forEach((input, index) => {
                const days = parseInt(input.value);
                const color = colorInputs[index].value;
                if(days < 1) days=1
                if(days > 120) days =120
                lineList.push({ days, color });
            });
            saves.linelist=lineList
            savestorage()
            modal.style.display = 'none';
            try{document.getElementById('modalBG').style.display = 'none'}catch(e){}
            myCreatePriceHistoryGraph( 5 )
            g_plotPriceHistory.redraw()
        });
        document.getElementById('cancelBtn').addEventListener('click', function() {
            modal.style.display = 'none';
            try{document.getElementById('modalBG').style.display = 'none'}catch(e){}
        });
        return modal
    }
    function readstorage(){
        var saves = GM_getValue('saves')
        if(saves) return saves
        saves = {
            buttonposition:'50%',
            linelist:[{
                days:5,
                color:"#FFFFFF",
            },{
                days:10,
                color:"#FFFF0B",
            },{
                days:20,
                color:"#FF80FF",
            },{
                days:30,
                color:"#00E600",
            }]
        }
        return saves
    }
    function savestorage(){
        GM_setValue('saves',saves)
    }
})();