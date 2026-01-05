// ==UserScript==
// @name        Ky.is absolute date
// @namespace   rfindley
// @description Adds an absolute date for the Level Up field, filters outliers from average.
// @include     http://ky.is/wanikani/*
// @version     1.0.8
// @author      Robin Findley
// @copyright   2015+, Robin Findley
// @license     MIT; http://opensource.org/licenses/MIT
// @run-at      document-start
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/10500/Kyis%20absolute%20date.user.js
// @updateURL https://update.greasyfork.org/scripts/10500/Kyis%20absolute%20date.meta.js
// ==/UserScript==

(function(){
    
    var number_of_standard_deviations = 2.0;

    DayDateAt = function(sec){
        sec = Math.ceil(sec / (15*60)) * (15*60);
        var t = new Date(sec*1000)
        var wday = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][t.getDay()];
        var hh = ((t.getHours()+23) % 12)+1;
        var mm = t.getMinutes(); if (mm<10) mm = "0"+mm;
        var ampm = (t.getHours()<12 ?'am':'pm')
        return '('+wday+' '+hh+':'+mm+ampm+')';
    }

    function daysHours(t) {
        return '['+(Math.floor(Math.round(t/3600)/24))+' days, '+(Math.round(t/3600)%24)+' hours]';
    }

    function new_avg() {
        var avgTime = 0;
        var reject = [];
        var stda = [];
        var median, medianDev;
        if (currentLevel > 1) {
            var sortedTimePerLevel = timePerLevel.slice(0);
            var sortedDevPerLevel = [];
            sortedTimePerLevel.sort(numericalSort);
            median = sortedTimePerLevel[Math.floor((currentLevel-1)/2)];
            for (var i = 0; i < currentLevel - 1; ++i)
                sortedDevPerLevel.push(Math.abs(timePerLevel[i]-median));
            sortedDevPerLevel.sort(numericalSort);
            medianDev = sortedDevPerLevel[Math.floor((currentLevel-1)*(currentLevel<8?0.5:0.75))];

            var min = median-(medianDev*number_of_standard_deviations);
            var max = median+(medianDev*number_of_standard_deviations);
            var sum=0, cnt=0;
            for (var i = 0; i < currentLevel - 1; ++i) {
                if (Math.abs(timePerLevel[i]-median) <= (medianDev*number_of_standard_deviations)) {
                    sum += timePerLevel[i];
                    cnt++;
                } else {
                    reject.push(i+1);
                }
            }
            avgTime = sum / cnt;
        }
        if (avgTime < 8 * T2DAYS)
            avgTime = 8 * T2DAYS;
        averageLevelTime = avgTime;
        window.currentLevel = currentLevel;
        window.averageLevelTime = averageLevelTime;
        window.currLevelDiff = currLevelDiff;
        window.lastLevelUp = lastLevelUp;
        console.log('Using Median '+daysHours(median)+' +/- '+daysHours(medianDev*number_of_standard_deviations)+'.');
        console.log('Averaging levels between '+daysHours(min)+' and '+daysHours(max)+'.');
        console.log('Rejecting levels ['+reject.join()+']');
    }

    function replaceCode(fname,start_line,end_line,insert_fn) {
        var fill = insert_fn.toString().replace(new RegExp("\n",'g'),"~").replace(new RegExp('^[^~]*~(.*)~[^~]*$','g'),'$1');
        var str = window[fname].toString().replace(' statsCallback','').replace(new RegExp("\n",'g'),"~").replace(new RegExp('[^~]*'+start_line+'.*'+end_line+'[^~]*','g'),fill).replace(new RegExp("~",'g'),"\n");
        eval('window.'+fname+'='+str);
    }

    function main() {
        var labels = $('#info-container .info-left:nth(0)');
        labels.html(labels.html().replace('Level Up In:','Level Up In:<br>'));
        var stats = $('#stat-levelup');
        stats.after('<br><span id="stat-levelupat">Loading...');
        var fstr = levelupCallback.toString();
        var code = fstr.replace(/^[^{]*{/,'').replace(/}$/,'')+"\t$('#stat-levelupat').html(DayDateAt(nextLevelUp+cTime));\n";
        var args = fstr.match(/^[^(]*\(([^)]*)/)[1];
        eval('window.levelupCallback = function('+args+') {'+code+'};');
        replaceCode('statsCallback', 'timePerLevel.sort', 'averageLevelTime = avgTime', new_avg);
    }

    var old_log = console.log;
    console.log = function(text) {
        if (text == 'Requesting stats information') {
            console.log = old_log;
            console.log(text);
            main();
        } else {
            old_log.apply(old_log,arguments);
        }
    }

}).call({});