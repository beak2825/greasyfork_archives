// ==UserScript==
// @name         V2EX AutoDarkMode
// @namespace    https://www.7gugu.com/
// @version      1.0
// @description  根据当地的日出日落时间自动切换V2EX的浅色与深色模式
// @author       7gugu
// @include      https://*.v2ex.com/*
// @include      https://v2ex.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/421557/V2EX%20AutoDarkMode.user.js
// @updateURL https://update.greasyfork.org/scripts/421557/V2EX%20AutoDarkMode.meta.js
// ==/UserScript==

(function() {
    'use strict'
    // 函数来源: http://www.lenashane.com/article/20151110-1043.html
    function computeSunRiseSunSet(Latitude, Longitude, TimeZone) {
        var curTime = new Date();
        // Variable names used: B5, C, C2, C3, CD, D, DR, H, HR, HS, L0, L5, M, MR, MS, N, PI, R1, RD, S1, SC, SD, str
        var retVal = new Object();
        var PI = Math.PI;
        var DR = PI / 180;
        var RD = 1 / DR;
        var B5 = Latitude;
        var L5 = Longitude;
        var H = -1 * (curTime.getTimezoneOffset() / 60 * -1); // Local timezone
        // Overriding TimeZone to standardize on UTC
        // H = 0;
        var M = curTime.getMonth() + 1;
        var D = curTime.getDate();
        B5 = DR * B5;
        var N = parseInt(275 * M / 9) - 2 * parseInt((M + 9) / 12) + D - 30;
        var L0 = 4.8771 + .0172 * (N + .5 - L5 / 360);
        var C = .03342 * Math.sin(L0 + 1.345);
        var C2 = RD * (Math.atan(Math.tan(L0 + C)) - Math.atan(.9175 * Math.tan(L0 + C)) - C);
        var SD = .3978 * Math.sin(L0 + C);
        var CD = Math.sqrt(1 - SD * SD);
        var SC = (SD * Math.sin(B5) + .0145) / (Math.cos(B5) * CD);
        if (Math.abs(SC) <= 1) {
            var C3 = RD * Math.atan(SC / Math.sqrt(1 - SC * SC));
            var R1 = 6 - H - (L5 + C2 + C3) / 15;
            var HR = parseInt(R1);
            var MR = parseInt((R1 - HR) * 60);
            retVal.SunRise = parseTime(HR + ":" + MR);
            var TargetTimezoneOffset = (TimeZone * 60 * 60 * 1000) + (retVal.SunRise.getTimezoneOffset() * 60 * 1000);
            var transformedSunRise = new Date(retVal.SunRise.getTime() + TargetTimezoneOffset);
            var strSunRise = "日出" + transformedSunRise.getHours() + ":" + (transformedSunRise.getMinutes() < 10 ? "0" + transformedSunRise.getMinutes() : transformedSunRise.getMinutes());
            var S1 = 18 - H - (L5 + C2 - C3) / 15;
            var HS = parseInt(S1);
            var MS = parseInt((S1 - HS) * 60);
            retVal.SunSet = parseTime(HS + ":" + MS);
            var transformedSunSet = new Date(retVal.SunSet.getTime() + TargetTimezoneOffset);
            var strSunSet = "日落" + transformedSunSet.getHours() + ":" + (transformedSunSet.getMinutes() < 10 ? "0" + transformedSunSet.getMinutes() : transformedSunSet.getMinutes());
            retVal.Noon = new Date((retVal.SunRise.getTime() + retVal.SunSet.getTime()) / 2);
            var transformedNoon = new Date(retVal.Noon.getTime() + TargetTimezoneOffset);
            var strNoon = "正午" + transformedNoon.getHours() + ":" + (transformedNoon.getMinutes() < 10 ? "0" + transformedNoon.getMinutes() : transformedNoon.getMinutes());
        }
        else {
            if (SC > 1) {
                // str="Sun up all day";
                strSunRise = ".";
                strNoon = ".";
                strSunSet = ".";
                var tDate = new Date();
                // Set Sunset to be in the future ...
                retVal.SunSet = new Date(tDate.getFullYear() + 1, tDate.getMonth(), tDate.getDay(), tDate.getHours());
                // Set Sunrise to be in the past ...
                retVal.SunRise = new Date(tDate.getFullYear() - 1, tDate.getMonth(), tDate.getDay(), tDate.getHours() - 1);
            }
            if (SC < -1) {
                // str="Sun down all day";
                strSunRise = ".";
                strNoon = ".";
                strSunSet = ".";
                // Set Sunrise and Sunset to be in the future ...
                retVal.SunRise = new Date(tDate.getFullYear() + 1, tDate.getMonth(), tDate.getDay(), tDate.getHours());
                retVal.SunSet = new Date(tDate.getFullYear() + 1, tDate.getMonth(), tDate.getDay(), tDate.getHours());
            }
        }
        retVal.strSunRise = strSunRise;
        retVal.strNoon = strNoon;
        retVal.strSunSet = strSunSet;
        retVal.str = strSunRise + ' | ' + strNoon + ' | ' + strSunSet;
        return retVal;
    }

    function parseTime(aTime) {
        var aDateTimeObject = 'none';
        if (aTime !== undefined && aTime.length) {
            aDateTimeObject = GMTTime();
            try {
                var theHour = parseInt(aTime.split(':')[0]);
                var theMinutes = parseInt(aTime.split(':')[1]);
                aDateTimeObject.setHours(theHour);
                aDateTimeObject.setMinutes(theMinutes);
            }
            catch (ex) {
            }
        }
        return aDateTimeObject;
    }

    function GMTTime() {
        var aDate = new Date();
        var aDateAdjustedToGMTInMS = aDate.getTime() + (aDate.getTimezoneOffset() * 60 * 1000);
        return (new Date(aDateAdjustedToGMTInMS));
    }
    var timeZone = (0 - new Date().getTimezoneOffset() / 60);
    function getPosition () {
        return new Promise((resolve, reject) => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function (position) {
                    let latitude = position.coords.latitude
                    let longitude = position.coords.longitude
                    let data = {
                        latitude: latitude,
                        longitude: longitude
                    }
                    resolve(data)
                }, function () {
                    reject(arguments)
                })
            } else {
                reject('你的浏览器不支持当前地理位置信息获取')
            }
        })
    }

    var curColor = document.querySelector('.light-toggle > img').alt.toLowerCase()
    // 获取当前经纬度坐标
    var data = getPosition().then(result => {
        let queryData = {
            longtitude: String(result.longitude).match(/\d+\.\d{0,6}/)[0],
            latitude: String(result.latitude).match(/\d+\.\d{0,6}/)[0],
            channelType: '00'
        }
        var res = computeSunRiseSunSet(parseFloat(queryData.latitude),parseFloat(queryData.longtitude),timeZone);
        var sunRise = res.SunRise;//日出时间
        var sunSet = res.SunSet;//日落时间
        var curTime = new Date();//当前时间
        var theme = "dark";//默认是深色模式
        if(curTime >= sunRise && curTime <= sunSet){
            theme = "light"//日出后 & 日落前 设置为浅色模式
        }
        if(curColor !== theme){
            document.querySelector('.light-toggle').click()
        }
    }).catch(err => {
        console.log(err)
    })
    })();