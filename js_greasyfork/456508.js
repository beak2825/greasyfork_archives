// ==UserScript==
// @name         生财有术志愿者后台打卡统计专用
// @namespace    http://www.heigoou.com
// @version      1.1
// @description  https://i.shengcaiyoushu.com/volunteer/operation/activity/user?id=XXX 作为一个懒人，不想手动统计，干脆做个工具一目了然
// @author       北封,jexxx
// @match        https://i.shengcaiyoushu.com/volunteer/operation/activity/user*
// @require      https://fastly.jsdelivr.net/npm/echarts@5.4.1/dist/echarts.min.js
// @icon         data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMzYwcHgiIGhlaWdodD0iMzYwcHgiIHZpZXdCb3g9IjAgMCAzNjAgMzYwIiB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPgogICAgPCEtLSBHZW5lcmF0b3I6IFNrZXRjaCA2MC4xICg4ODEzMykgLSBodHRwczovL3NrZXRjaC5jb20gLS0+CiAgICA8dGl0bGU+57yW57uEPC90aXRsZT4KICAgIDxkZXNjPkNyZWF0ZWQgd2l0aCBTa2V0Y2guPC9kZXNjPgogICAgPGRlZnM+CiAgICAgICAgPHBvbHlnb24gaWQ9InBhdGgtMSIgcG9pbnRzPSIxLjEzMzQwMjI0ZS0wNSAwIDM1OS45OTk4NjMgMCAzNTkuOTk5ODYzIDM2MCAxLjEzMzQwMjI0ZS0wNSAzNjAiPjwvcG9seWdvbj4KICAgIDwvZGVmcz4KICAgIDxnIGlkPSIxLjEt5by556qXIiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj4KICAgICAgICA8ZyBpZD0i57yW57uEIj4KICAgICAgICAgICAgPGc+CiAgICAgICAgICAgICAgICA8bWFzayBpZD0ibWFzay0yIiBmaWxsPSJ3aGl0ZSI+CiAgICAgICAgICAgICAgICAgICAgPHVzZSB4bGluazpocmVmPSIjcGF0aC0xIj48L3VzZT4KICAgICAgICAgICAgICAgIDwvbWFzaz4KICAgICAgICAgICAgICAgIDxnIGlkPSJDbGlwLTIiPjwvZz4KICAgICAgICAgICAgICAgIDxwYXRoIGQ9Ik0xOTAuMTU5NCwzMzUuMDA1MiBDOTYuNTE4NCwzNDAuOTk2MiAxOS4wMDA0LDI2My40NzgyIDI0Ljk5MzQsMTY5LjgzODIgQzI5Ljk0NjQsOTIuNDQ2MiA5Mi40NjE0LDI5LjkzNjIgMTY5Ljg1MjQsMjQuOTkxMiBDMjYzLjQ4MjQsMTkuMDA5MiAzNDAuOTg3NCw5Ni41MTMyIDMzNS4wMDg0LDE5MC4xNDQyIEMzMzAuMDYzNCwyNjcuNTM3MiAyNjcuNTUzNCwzMzAuMDUzMiAxOTAuMTU5NCwzMzUuMDA1MiBNMTg4LjQ0ODQsMC4xOTQyIEM4Mi41NDE0LC00LjY3MzggLTQuNjczNiw4Mi41NDIyIDAuMTk0NCwxODguNDQ3MiBDNC40Mzg0LDI4MC43ODMyIDc5LjIxNjQsMzU1LjU2MTIgMTcxLjU1MjQsMzU5LjgwNjIgQzI3Ny40NTc0LDM2NC42NzQyIDM2NC42NzQ0LDI3Ny40NTkyIDM1OS44MDU0LDE3MS41NTIyIEMzNTUuNTU4NCw3OS4yMTYyIDI4MC43ODM0LDQuNDQxMiAxODguNDQ4NCwwLjE5NDIiIGlkPSJGaWxsLTEiIGZpbGw9IiMwQTVENEYiIG1hc2s9InVybCgjbWFzay0yKSI+PC9wYXRoPgogICAgICAgICAgICA8L2c+CiAgICAgICAgICAgIDxwYXRoIGQ9Ik0xNjYuMzQ5OCwyMDguOTY4MSBMMTY2LjM0OTgsMjIxLjc4OTEgTDE0OC43MjM4LDIyMS43ODkxIEMxNDguMDYxOCwyMjEuNzg5MSAxNDcuODA3OCwyMjAuOTI0MSAxNDguMzYzOCwyMjAuNTY0MSBMMTY2LjM0OTgsMjA4Ljk2ODEgWiBNMTkzLjY0ODgsMTYxLjQ5MTEgTDE5My42NDg4LDE0OS4wMTAxIEwyMTAuNTk4OCwxNDkuMDEwMSBDMjExLjMzNjgsMTQ5LjAxMDEgMjExLjYyMDgsMTQ5Ljk3NTEgMjEwLjk5NzgsMTUwLjM3MzEgTDE5My42NDg4LDE2MS40OTExIFogTTI0Ny40NjY4LDIyMS43ODkxIEwxOTMuODc3OCwyMjEuNzg5MSBMMTkzLjY1MDgsMjE5LjU5MjEgTDE5My42NDg4LDE5MS40NzkxIEwyNDguMTM1OCwxNTYuNzY4MSBDMjUzLjQ2MzgsMTUzLjM3MzEgMjU2Ljc0NTgsMTQ1LjM5ODEgMjU0LjIwMzgsMTM2Ljg1NTEgQzI1MS43ODI4LDEyOS4yNzIxIDI0NC43MzM4LDEyNC4xMjQxIDIzNi43NzI4LDEyNC4xMjQxIEwxOTMuNjQ4OCwxMjQuMTI0MSBMMTkzLjY0ODgsODcuOTcyMSBDMTkzLjY0ODgsODQuMTYzMSAxOTAuNTYwOCw4MS4wNzYxIDE4Ni43NTE4LDgxLjA3NjEgTDE3My4yNDI4LDgxLjA3NjEgQzE2OS40MzU4LDgxLjA3NjEgMTY2LjM0OTgsODQuMTYyMSAxNjYuMzQ5OCw4Ny45NjkxIEwxNjYuMzQ5OCwxMjQuMTI0MSBMMTEyLjc0NjgsMTI0LjEyNDEgQzEwNy45Nzk4LDEyNC4xMjQxIDEwNC4xMTI4LDEyNy45ODkxIDEwNC4xMTI4LDEzMi43NTkxIEwxMDQuMTEyOCwxNDAuMjA5MSBDMTA0LjExMjgsMTQ1LjA3MTEgMTA4LjA1MzgsMTQ5LjAxMDEgMTEyLjkxMjgsMTQ5LjAxMDEgTDE2Ni4zNDk4LDE0OS4wMTAxIEwxNjYuMzQ5OCwxNzkuMDEzMSBMMTEyLjczMjgsMjEzLjQxODEgQzEwNi44Njg4LDIxNy4xODgxIDEwMy4yMjM4LDIyNS44MTIxIDEwNS40OTQ4LDIzMy41NzIxIEMxMDcuODUwOCwyNDEuMjM5MSAxMTQuOTMzOCwyNDYuNDc0MSAxMjIuOTU2OCwyNDYuNDc0MSBMMTY2LjM0OTgsMjQ2LjQ3NDEgTDE2Ni4zNDk4LDI3NS41NDQxIEMxNjYuMzQ5OCwyNzkuMzU0MSAxNjkuNDM3OCwyODIuNDQwMSAxNzMuMjQ1OCwyODIuNDQwMSBMMTg2Ljc2MDgsMjgyLjQ0MDEgQzE5MC41NjQ4LDI4Mi40NDAxIDE5My42NDg4LDI3OS4zNTgxIDE5My42NDg4LDI3NS41NTMxIEwxOTMuNjQ4OCwyNDYuNDc0MSBMMjQ3LjU2MDgsMjQ2LjQ3NDEgQzI1Mi4xNTY4LDI0Ni40NzQxIDI1NS44ODM4LDI0Mi43NDYxIDI1NS44ODM4LDIzOC4xNTAxIEwyNTUuODgzOCwyMzAuMjA0MSBDMjU1Ljg4MzgsMjI1LjU1NzEgMjUyLjExNjgsMjIxLjc4OTEgMjQ3LjQ2NjgsMjIxLjc4OTEgTDI0Ny40NjY4LDIyMS43ODkxIFoiIGlkPSJGaWxsLTMiIGZpbGw9IiMwQTVENEYiPjwvcGF0aD4KICAgICAgICAgICAgPHBhdGggZD0iTTIyOC45Mjg5LDEwNi42NjQ0IEwyNDEuMTM0OSwxMDYuNjY0NCBDMjQ1LjI0NTksMTA2LjY2NDQgMjQ4LjU3ODksMTAzLjMzMTQgMjQ4LjU3ODksOTkuMjIxNCBMMjQ4LjU3ODksODguNTIzNCBDMjQ4LjU3ODksODQuNDExNCAyNDUuMjQzOSw4MS4wNzY0IDI0MS4xMzE5LDgxLjA3NjQgTDIyOC45Mjg5LDgxLjA3NjQgQzIyNC44MTg5LDgxLjA3NjQgMjIxLjQ4NTksODQuNDA5NCAyMjEuNDg1OSw4OC41MTk0IEwyMjEuNDg1OSw5OS4yMjE0IEMyMjEuNDg1OSwxMDMuMzMxNCAyMjQuODE4OSwxMDYuNjY0NCAyMjguOTI4OSwxMDYuNjY0NCIgaWQ9IkZpbGwtNSIgZmlsbD0iIzBBNUQ0RiI+PC9wYXRoPgogICAgICAgIDwvZz4KICAgIDwvZz4KPC9zdmc+
// @grant        none
// @license GPLv3
// @run-at document-end

// @downloadURL https://update.greasyfork.org/scripts/456508/%E7%94%9F%E8%B4%A2%E6%9C%89%E6%9C%AF%E5%BF%97%E6%84%BF%E8%80%85%E5%90%8E%E5%8F%B0%E6%89%93%E5%8D%A1%E7%BB%9F%E8%AE%A1%E4%B8%93%E7%94%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/456508/%E7%94%9F%E8%B4%A2%E6%9C%89%E6%9C%AF%E5%BF%97%E6%84%BF%E8%80%85%E5%90%8E%E5%8F%B0%E6%89%93%E5%8D%A1%E7%BB%9F%E8%AE%A1%E4%B8%93%E7%94%A8.meta.js
// ==/UserScript==

(function () {

    'use strict';
    let baseData = data;
    let stage = baseData.stage;
    let xData = [];
    let dayInfo = {};

    for (let d = 0; d < stage.length; d++) {
        let dayItem = stage[d];

        let time = dayItem.gmt_start * 1000;
        if (time > new Date().getTime()) {
            // 还没到的时间，就不统计了
            break;
        }

        let date = new Date(time);
        let year = date.getFullYear();
        let month = date.getMonth() + 1; // 月份
        let day = date.getDate(); // 日
        let dayStr = year + '-' + month + '-' + day;

        let dayData = {
            id: dayItem.id,
            idx: dayItem.idx,
            name: dayItem.name,
            dayStr: dayStr,
        };
        dayInfo[dayData.id] = dayData;
        xData.push(dayData.name + '\r\n' + dayData.dayStr);
    }
    $('.cxd-Panel--form').after('<div id="bf-container" style="width: 100%;height: 400px"></div>');
    $('#bf-container').after('<div id="pf-container" style="width: 100%;height: 400px"></div>');
    $('#pf-container').after('<div id="text-container" style="width: 90%;margin-left:auto;"></div>')
    $.post(window.location.href.replace('user', 'user/ajax'), function (response) {
        var items = response.data.items
        var result = {};
        // let totalPeople = Object.keys(response.data.extra.user).length;
        let yDaKaDataObject = {};
        const days = Object.keys(dayInfo);
        const highPoints = []; // 重点关注对象
        let wxids = new Set();
        for (let dd = 0; dd < days.length; dd++) {
            const dInfo = dayInfo[days[dd]];
            for (var k = 0; k < items.length; k++) {
                const item = items[k];
                if (item.identity) {
                    // identity: "志愿者" 领队 教练角色不统计
                    continue;
                }
                wxids.add(item.info['微信号（微信ID）']);
                yDaKaDataObject[dInfo['id']] = yDaKaDataObject[dInfo['id']] || {};


                var cnt = item.project_cnt;
                if (!result[cnt]) {
                    result[cnt] = [];
                }
                var name = response.data.extra.user[item.xq_group_number]['name'];
                var wx_name = response.data.extra.user[item.xq_group_number]['wx_name'];
                if (name != wx_name) {
                    name = name + '(' + wx_name + ')';
                }
                var user = name;
                var project_left_cnt = item.project_left_cnt;
                if (dd === 0) highPoints.push({ user, cnt, project_left_cnt });
                if (!result[cnt].includes(user)) {
                    result[cnt].push(user);
                }
                const project = item.project;
                yDaKaDataObject[dInfo['id']]['n'] = yDaKaDataObject[dInfo['id']]['n'] || [];
                yDaKaDataObject[dInfo['id']]['y'] = yDaKaDataObject[dInfo['id']]['y'] || [];

                if (project) {
                    if (project[dInfo['id']]) {
                        yDaKaDataObject[dInfo['id']]['y'].push(user);

                    } else {
                        yDaKaDataObject[dInfo['id']]['n'].push(user);
                    }


                } else {
                    if (!yDaKaDataObject[dInfo['id']]['n'].includes(user)) {
                        yDaKaDataObject[dInfo['id']]['n'].push(user);
                    }
                }


            }


        }

        let yNoDaKaData = [];
        let yDaKaData = [];

        for (let da = 0; da < days.length; da++) {
            const dayDaka = yDaKaDataObject[days[da]];
            const dayStep = dayInfo[days[da]];
            let daKaData = {
                value: dayDaka['y'].length,
                names: dayDaka['y'],
                percent: (Math.round((dayDaka['y'].length / (dayDaka['y'].length+dayDaka['n'].length)) * 100) / 100),
            };
            yDaKaData.push(daKaData);
            let ndaKaData = {
                value: dayDaka['n'].length,
                names: dayDaka['n'],
                percent: (Math.round((dayDaka['n'].length / (dayDaka['y'].length+dayDaka['n'].length)) * 100) / 100),
            };
            yNoDaKaData.push(ndaKaData)

        }

        var text = '';
        var keys = Object.keys(result);
        var step = 0;
        var _highPoints = highPoints.sort(function (a, b) {
            return Number(a.cnt) - Number(b.cnt);
        });
        for (var j = 0; j < keys.length; j++) {
            var day = keys[j];
            var people = result[day];
            step = step + people.length;
            text += '完成打卡 ' + day + ' 天的有 ' + people.length + ' 人，他们是：' + people + '<br>';
        }
        // console.log(text);
        // console.log(yNoDaKaData[yNoDaKaData.length-1].names);
        text += '-------------------------华丽的分割线-------------------------------------<br>'
        text += '今日未打卡人员>>>' + yNoDaKaData[yNoDaKaData.length - 1].names+'<br><br>';
        text += '微信ID：';
        for(let wId of wxids){
            text += wId+' , ';
        }
        $('#text-container').html(text)
        var dom = document.getElementById('bf-container');
        var pdom = document.getElementById('pf-container');
        var myChart = echarts.init(dom, null, { renderer: 'canvas', useDirtyRect: false });
        var myChart2 = echarts.init(pdom, null, { renderer: 'canvas', useDirtyRect: false });

        var option;

        option = {
            tooltip: {
                trigger: 'axis',
                backgroundColor: '#FFFFFF',
                borderColor: '#EEF1F7',
                borderWidth: 1,
                textStyle: {
                    width: 160,
                    height: 250,
                    lineHeight: 24,
                    color: '#666666',
                    fontSize: '14',
                    fontFamily: 'SourceHanSansCN-Normal'
                },
                formatter: params => {
                    // 获取xAxis data中的数据
                    let dataStr = `<div><p style="font-weight:bold;margin:0 8px 15px;">${params[0].axisValue} 打卡统计</p></div>`
                    params.forEach(item => {
                        dataStr += `<div>
          <div style="margin: 0 8px;">
            <span style="display:inline-block;margin-right:5px;width:10px;height:10px;background-color:${item.color};"></span>
            <span>${item.seriesName} ${item.data.percent}：</span>
            <span style="float:right;color:#000000;margin-left:20px;">${item.data.value}人</span>`;
                        let names = item.data.names;
                        names.forEach(name => {
                            dataStr += `${name} `
                        });

                        //
                        //
                        dataStr +=
                            `</div>
        </div>`
                    })
                    return dataStr
                }
            },

            legend: {
            },
            // grid: {
            //   left: '3%',
            //   right: '4%',
            //   bottom: '3%',
            //   containLabel: true
            // },
            xAxis: {
                type: 'category',
                data: xData
            },
            yAxis: [
                {
                    type: 'value',
                    name: '积极打卡',
                },
                {
                    type: 'value',
                    name: '偷懒了~',
                },
            ],
            series: [
                {
                    name: '积极打卡',
                    type: 'bar',
                    stack: 'total',
                    label: {
                        show: true
                    },
                    emphasis: {
                        focus: 'series'
                    },
                    data: yDaKaData,

                },
                {
                    name: '偷懒了~',
                    type: 'bar',
                    stack: 'total',
                    label: {
                        show: true
                    },
                    emphasis: {
                        focus: 'series'
                    },
                    data: yNoDaKaData
                },
            ]
        };

        var option2 = {

            xAxis: {
                type: 'category',
                data: _highPoints.map(item => item.user),
                axisLabel: {
                    show: true,
                    interval: 0,
                    rotate: 40,
                    textStyle: {
                        color: '#333'
                    }
                },
            },
            yAxis: [
                {
                    type: 'value',
                    name: '打卡',
                },
            ],
            series: [
                {
                    name: '打卡',
                    type: 'bar',
                    stack: 'total',
                    label: {
                        show: true
                    },
                    emphasis: {
                        focus: 'series'
                    },
                    data: _highPoints.map(item => item.cnt),

                },
            ]
        };

        if (option && typeof option === 'object') {
            myChart.setOption(option);
        }

        if (option2 && typeof option2 === 'object') {
            myChart2.setOption(option2);
        }

        window.addEventListener('resize', () => {
            myChart.resize();
            myChart2.resize();
        });
    });
})();