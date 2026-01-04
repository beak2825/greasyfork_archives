// ==UserScript==
// @name         B站观看视频时长记录
// @version      0.2
// @description  记录每天观看b站视频的时长，促进激励自己猛猛学习
// @author       liewstar
// @match        https://www.bilibili.com/video/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        none
// @require      https://cdn.jsdelivr.net/npm/echarts@5.5.0/dist/echarts.min.js
// @license      GNU General Public License v3.0
// @namespace https://greasyfork.org/users/1301704
// @downloadURL https://update.greasyfork.org/scripts/494973/B%E7%AB%99%E8%A7%82%E7%9C%8B%E8%A7%86%E9%A2%91%E6%97%B6%E9%95%BF%E8%AE%B0%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/494973/B%E7%AB%99%E8%A7%82%E7%9C%8B%E8%A7%86%E9%A2%91%E6%97%B6%E9%95%BF%E8%AE%B0%E5%BD%95.meta.js
// ==/UserScript==

(function() {
    'use strict';


    if(!localStorage.getItem('openChart')) {
        localStorage.setItem('openChart',true)
    }

    var echarDiv = document.createElement('div')
    echarDiv.style.cssText = 'background-color: #FFFFFF;overflow: hidden; z-index: 3; position: fixed; padding: 5px; width: 400px; height: 400px;';


    echarDiv.id = 'container'
    var targetElement = document.body.firstChild
    document.body.insertBefore(echarDiv, targetElement)
    initChart()
    if(localStorage.getItem('openChart') == 'true') {
        echarDiv.style.display = 'block'
    }else {
        echarDiv.style.display = 'none'
    }

        // 监听keydown事件
    document.addEventListener('keydown', function(event) {
        if (event.ctrlKey && event.key === 'q') {
            //图标处于关闭状态就显示
            if(echarDiv.style.display == 'none') {
                initChart()
                localStorage.setItem('openChart',true)
                echarDiv.style.display = 'block'
            }else {
                localStorage.setItem('openChart',false)
                echarDiv.style.display = 'none'
            }

        }
    });

    var div = document.createElement('div');
    div.style.cssText = 'left: 45%; top: 16%; background: #1a59b7; color: #ffffff; overflow: hidden; z-index: 3; position: fixed; padding: 5px; text-align: center; width: 175px; height: 22px; border-bottom-left-radius: 4px; border-bottom-right-radius: 4px; border-top-left-radius: 4px; border-top-right-radius: 4px;';
    div.innerText = '今日学习时长'
    document.body.appendChild(div)

    // 选择视频元素
    let video = document.querySelector('video');

    // 用于记录播放时间的变量
    let playbackTime = 0;
    let timer = null;


    //不存在today的key的话，先新建
    var myData = {"2024-05-13":25}
    if(!localStorage.getItem('myData')) {
        update('2024-05-13',0)
    }

    // 加载之前存储的播放时长
    if(localStorage.getItem('myData')) {
        playbackTime = parseInt(getTimeByDate(getToday()))
        console.log(`${getToday()}已经学习了 ${playbackTime}秒 `);
    }



    video.addEventListener('play', onPlay);
    video.addEventListener('pause', onPauseOrStop);
    video.addEventListener('ended', onPauseOrStop);


    function onVideoSwitch(newSrc) {
        console.log(`视频切换到了新的源: ${newSrc}`);
        //location.reload()
    }

    // 创建一个MutationObserver实例来观察src属性的变化
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'src') {
            // 视频的src属性发生了变化
            onVideoSwitch(mutation.target.src);
            onPauseOrStop()
        }
        });
    });

    observer.observe(video, {
        attributes: true,
        attributeFilter: ['src']
    });


    function onPlay() {
        console.log('继续猛猛学')
        timer = setInterval(() => {
            playbackTime++; // 每秒增加一秒
            if(playbackTime%20 == 0) {
              var nowHour = new Date().getHours()
              var nowMinutes = new Date().getMinutes()
              var nowSecond = new Date().getSeconds()
              //凌晨12点左右的时候更新时长数据
              if ((nowHour === 23 && nowMinutes === 59 && nowSecond >= 5) || (nowHour === 0 && nowMinutes === 0 && nowSecond <= 5)) {
                playbackTime = 0
              }
              update(getToday(), playbackTime)
            }
            displayPlaybackTime(playbackTime); // 更新显示
        }, 1000);
    }


    // 暂停或停止事件处理函数
    function onPauseOrStop() {
        console.log('已暂停')
        clearInterval(timer);
        timer = null;
    }


    // 更新显示的函数
    function displayPlaybackTime(todaySeconds) {
        var hour = convertSecondsToTime(todaySeconds).hours
        var minutes = convertSecondsToTime(todaySeconds).minutes
        var seconds = convertSecondsToTime(todaySeconds).seconds
        div.innerText = `今日学习时长:${hour}小时${minutes}分钟${seconds}秒`
        console.log(video.src)
        console.log(`Playback time: ${todaySeconds}秒`);
    }


    //更新数据
    function update(key, value) {
        // 从localStorage中取出已有的数据
        var storedData = JSON.parse(localStorage.getItem("myData")) || {};

        // 检查要更新的日期是否存在于数据对象中
        if (storedData.hasOwnProperty(key)) {
            // 更新现有的数据项
            storedData[key] = value;
        } else {
            // 如果日期不存在，可以添加新的数据项
            storedData[key] = value;
        }

        // 将更新后的数据对象重新存储到localStorage中
        localStorage.setItem("myData", JSON.stringify(storedData));
    }

    //取到数据
    function getTimeByDate(date) {
        var retrievedData = JSON.parse(localStorage.getItem("myData"));
        return retrievedData[date] == null?0:retrievedData[date]
    }

    //时间戳格式化为xxxx-xx-xx
    function format(timeStamp) {
        var date = new Date(timeStamp)
        return date.toISOString().split('T')[0]
    }

    function convertSecondsToTime(seconds) {
        // 计算时
        const hours = Math.floor(seconds / 3600);
        // 计算分
        const minutes = Math.floor((seconds - (hours * 3600)) / 60);
        // 计算剩余的秒
        const remainingSeconds = seconds - (hours * 3600) - (minutes * 60);

        return {
          hours: hours,
          minutes: minutes,
          seconds: remainingSeconds
        };
      }

      const timeStructure = convertSecondsToTime(3661);
      console.log(timeStructure); // { hours: 1, minutes: 1, seconds: 1 }

      function getToday() {
        var today = format(new Date().getTime() + 8 * 60 * 60 * 1000)
        return today
      }
      function initChart() {
        var jsonData = JSON.parse(localStorage.getItem('myData'))

        var xData = []
        var yData = []

        for(var key in jsonData) {
            xData.push(key)
            yData.push(jsonData[key] / 60)
        }
        var chart = echarts.init(document.getElementById('container'))

        var option = {
            title: {
                text: '每日学习时间(Ctrl+Q:隐藏/显示)'
            },
            tooltip: {},
            xAxis: {
                type: 'category',
                data: xData
            },
            yAxis: {
                type: 'value'
            },
            series: [{
                data: yData,
                type: 'bar'
            }]
        };

        //显示图表
        chart.setOption(option);
        echarDiv.style.cssText = 'background-color: #FFFFFF;top:22%;right:5%;overflow: hidden; z-index: 3; position: fixed; padding: 5px; width: 400px; height: 400px;';

    }


})();