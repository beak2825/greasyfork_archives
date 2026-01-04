(function () {
    // 添加highcharts开源库
    var scr = document.createElement('script')
    scr.src = 'https://cdn.staticfile.org/highcharts/8.2.2/highcharts.min.js'
    document.head.appendChild(scr)
    window.addEventListener('load', () => {
        let uid = document.querySelector('#uhd p>a[href*="https://www.mcbbs.net/?"]').textContent.slice(23) || '1'
        let el = document.querySelector('.u_profile')
        console.log('https://www.mcbbs.net/api/mobile/index.php?module=profile&uid=' + uid)
        jq.ajax({
            type: 'GET',
            url: 'https://www.mcbbs.net/api/mobile/index.php?module=profile&uid=' + uid,
            success: function (data) {
                console.log(data);
                let space = data.Variables.space
                let popular = space.extcredits1;    //人气
                let contrib = space.extcredits6;    //贡献
                let kindnes = space.extcredits7;    //爱心
                let diamond = space.extcredits8;    //钻石
                let post = space.posts;             //回帖
                let thread = space.threads;         //主题
                let digestpost = space.digestposts; //精华
                let uname = space.username
                var json = {};
                json.credits = {
                    href: 'https://www.mcbbs.net/?1579729',
                    text: '小工具由Salt_lovely制作，使用了highcharts开源库'
                }
                json.chart = { backgroundColor: '#fbf2da', plotShadow: false };
                json.tooltip = { pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>' };
                json.title = { text: uname + '积分构成' };
                json.plotOptions = {
                    pie: {
                        allowPointSelect: true,
                        cursor: 'pointer',
                        colors: ['#7ccade', '#cae07b', '#e37bf9', '#fce37c', '#ff9800', '#fd957e', '#9ba8f3'],
                        dataLabels: {
                            enabled: true,
                            format: '{point.name}: {point.y}分, 占{point.percentage:.1f} %',
                        },
                        showInLegend: true
                    }
                };
                json.series = [{
                    type: 'pie',
                    name: '积分占比',
                    data: [
                        { name: '发帖数/' + post + '帖', y: Math.round(post / 3) },
                        { name: '主题数/' + thread + '帖', y: thread * 2 },
                        { name: '精华帖/' + digestpost + '帖', y: digestpost * 45 },
                        { name: '人气/' + popular + '点', y: popular * 3 },
                        { name: '贡献/' + contrib + '点', y: contrib * 10 },
                        { name: '爱心/' + kindnes + '颗', y: kindnes * 4 },
                        { name: '钻石/' + diamond + '颗', y: diamond * 2 },
                    ]
                }];
                let n = document.createElement('div')
                n.id = 'userpie'
                el.appendChild(n)
                Highcharts.chart('userpie', json)
            }
        });
    })
})()
// ==UserScript==
// @name         Salt MCBBS 积分分析
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       Salt
// @match        https://www.mcbbs.net/home.php?mod=space*
// @match        https://www.mcbbs.net/?*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/416071/Salt%20MCBBS%20%E7%A7%AF%E5%88%86%E5%88%86%E6%9E%90.user.js
// @updateURL https://update.greasyfork.org/scripts/416071/Salt%20MCBBS%20%E7%A7%AF%E5%88%86%E5%88%86%E6%9E%90.meta.js
// ==/UserScript==