// ==UserScript==
// @name         【演示脚本】--特定系统演示脚本
// @namespace    http://tampermonkey.net/
// @version      2.1.2.5
// @description  特殊系统的演示脚本，使用前请刷新页面。
// @author       CashoneLee
// @match        http://106.3.97.67:8410/#/navigation/page
// @match        http://106.3.97.67:8410/#/*
// @grant        window.onurlchange
// @license MIT
// @require      http://code.jquery.com/jquery-2.1.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/502342/%E3%80%90%E6%BC%94%E7%A4%BA%E8%84%9A%E6%9C%AC%E3%80%91--%E7%89%B9%E5%AE%9A%E7%B3%BB%E7%BB%9F%E6%BC%94%E7%A4%BA%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/502342/%E3%80%90%E6%BC%94%E7%A4%BA%E8%84%9A%E6%9C%AC%E3%80%91--%E7%89%B9%E5%AE%9A%E7%B3%BB%E7%BB%9F%E6%BC%94%E7%A4%BA%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==


// 初始化滚动位置
var scrollTop = 0;
// 初始化当前索引为 0
var currentIndex = 0;
var gdtimerId;
var rege=30;
var nowitd = 0;
var picarry=['https://www.sanyasw.cn/floodwms/upload/20240814/47026338f7d3c8c996b746931fd62f7b.jpg','https://www.sanyasw.cn/floodwms/upload/20240814/5c4b4af433488d5cfb26a39849ad0108.jpg',' https://www.sanyasw.cn/floodwms/upload/20240814/8ae0b54afb26f9b672fa76e7c5c96ee0.jpg','https://www.sanyasw.cn/floodwms/upload/20240814/d69e1a0db82e62b96c8bdcccc54938f6.jpg']

// 定时器，每隔一段时间滚动
// 停止计时器的函数
function stopTimer() {
  //停止滚动
  scrollTop = 0;
  currentIndex = 0;
  $('.div-container').animate({
      scrollTop: 0
    }, 10);
  clearInterval(gdtimerId);
}

function initEcharts() {
    // 引入 Echarts 库
    var script = document.createElement('script');
    script.src = 'https://cdn.bootcdn.net/ajax/libs/echarts/5.2.2/echarts.min.js';
    document.head.appendChild(script);
    let angle = 0;//角度，用来做简单的动画效果的
    let value = 94.2;
    script.onload = function() {
        // 准备图表配置
        var option = {
            title: {
        text: '{a|'+ value +'}{c|%}',
        x: 'center',
        y: 'center',
        textStyle: {
            rich:{
                a: {
                    fontWeight: "normal", // 主标题文字字体的粗细。 'normal' 'bold'  'bolder'  'lighter' 500|600
                    fontFamily: "Impact", // 主标题文字的字体系列。
                    fontSize: 32,
                    color: '#31cbf4'
                },

                c: {
                    fontSize: 12,
                    color: '#ffffff80',
                    padding: [15,3]
                }
            }
        }
    },
  grid: {
    containLabel: true,
    left: 0,
    top:0
  },
    legend: {
        type: "plain",
        orient: "vertical",
        right: 0,
        top: "0%",
        align: "auto",
        data: [{
            name: '涨价后没吃过',
            icon: "circle"
        }, {
            name: '天天吃',
            icon: "circle"
        }, {
            name: '三五天吃一次',
            icon: "circle"
        }, {
            name: '半个月吃一次',
            icon: "circle"
        }],
        textStyle: {
            color: "white",
            fontSize: 16,
            padding: [10, 1, 10, 0]
        },
        selectedMode:false
    },
    series: [ {
            name: "ring5",
            type: 'custom',
            coordinateSystem: "none",
            renderItem: function(params, api) {
                return {
                    type: 'arc',
                    shape: {
                        cx: api.getWidth() / 2,
                        cy: api.getHeight() / 2,
                        r: Math.min(api.getWidth(), api.getHeight()) / 2 * 0.9,
                        startAngle: (0+angle) * Math.PI / 180,
                        endAngle: (90+angle) * Math.PI / 180
                    },
                    style: {
                        stroke: "#0CD3DB",
                        fill: "transparent",
                        lineWidth: 1.5
                    },
                    silent: true
                };
            },
            data: [0]
        }, {
            name: "ring5",
            type: 'custom',
            coordinateSystem: "none",
            renderItem: function(params, api) {
                return {
                    type: 'arc',
                    shape: {
                        cx: api.getWidth() / 2,
                        cy: api.getHeight() / 2,
                        r: Math.min(api.getWidth(), api.getHeight()) / 2 * 0.9,
                        startAngle: (180+angle) * Math.PI / 180,
                        endAngle: (270+angle) * Math.PI / 180
                    },
                    style: {
                        stroke: "#0CD3DB",
                        fill: "transparent",
                        lineWidth: 1.5
                    },
                    silent: true
                };
            },
            data: [0]
        }, {
            name: "ring5",
            type: 'custom',
            coordinateSystem: "none",
            renderItem: function(params, api) {
                return {
                    type: 'arc',
                    shape: {
                        cx: api.getWidth() / 2,
                        cy: api.getHeight() / 2,
                        r: Math.min(api.getWidth(), api.getHeight()) / 2 * 0.95,
                        startAngle: (270+-angle) * Math.PI / 180,
                        endAngle: (40+-angle) * Math.PI / 180
                    },
                    style: {
                        stroke: "#0CD3DB",
                        fill: "transparent",
                        lineWidth: 1.5
                    },
                    silent: true
                };
            },
            data: [0]
        }, {
            name: "ring5",
            type: 'custom',
            coordinateSystem: "none",
            renderItem: function(params, api) {
                return {
                    type: 'arc',
                    shape: {
                        cx: api.getWidth() / 2,
                        cy: api.getHeight() / 2,
                        r: Math.min(api.getWidth(), api.getHeight()) / 2 * 0.95,
                        startAngle: (90+-angle) * Math.PI / 180,
                        endAngle: (220+-angle) * Math.PI / 180
                    },
                    style: {
                        stroke: "#0CD3DB",
                        fill: "transparent",
                        lineWidth: 1.5
                    },
                    silent: true
                };
            },
            data: [0]
        }, {
            name: "ring5",
            type: 'custom',
            coordinateSystem: "none",
            renderItem: function(params, api) {
                let x0 = api.getWidth() / 2;
                let y0 = api.getHeight() / 2;
                let r = Math.min(api.getWidth(), api.getHeight()) / 2 * 0.95;
                let point = getCirlPoint(x0, y0, r, (90+-angle))
                return {
                    type: 'circle',
                    shape: {
                        cx: point.x,
                        cy: point.y,
                        r: 4
                    },
                    style: {
                        stroke: "#0CD3DB",//粉
                        fill: "#0CD3DB"
                    },
                    silent: true
                };
            },
            data: [0]
        }, {
            name: "ring5",  //绿点
            type: 'custom',
            coordinateSystem: "none",
            renderItem: function(params, api) {
                let x0 = api.getWidth() / 2;
                let y0 = api.getHeight() / 2;
                let r = Math.min(api.getWidth(), api.getHeight()) / 2 * 0.95;
                let point = getCirlPoint(x0, y0, r, (270+-angle))
                return {
                    type: 'circle',
                    shape: {
                        cx: point.x,
                        cy: point.y,
                        r: 4
                    },
                    style: {
                        stroke: "#0CD3DB",      //绿
                        fill: "#0CD3DB"
                    },
                    silent: true
                };
            },
            data: [0]
        }, {
            name: '吃猪肉频率',
            type: 'pie',
            radius: ['80%', '60%'],
            silent: true,
            clockwise: true,
            startAngle: 90,
            z: 0,
            zlevel: 0,
            label: {
                normal: {
                    position: "center",

                }
            },
            data: [{
                    value: value,
                    name: "",
                    itemStyle: {
                        normal: {
                            color: { // 完成的圆环的颜色
                                colorStops: [{
                                    offset: 0,
                                    color: '#4FADFD' // 0% 处的颜色
                                }, {
                                    offset: 1,
                                    color: '#28E8FA' // 100% 处的颜色
                                }]
                            },
                        }
                    }
                },
                {
                    value: 100-value,
                    name: "",
                    label: {
                        normal: {
                            show: false
                        }
                    },
                    itemStyle: {
                        normal: {
                            color: "#173164"
                        }
                    }
                }
            ]
        },

        {
            name: "",
            type: "gauge",
            radius: "110%",
            center: ['50%', '50%'],
            startAngle: 0,
            endAngle: 359.9,
            splitNumber: 8,
            hoverAnimation: true,
            axisTick: {
                show: false
            },
            splitLine: {
                length: 20,
                lineStyle: {
                    width: 2,
                    color: "#061740"
                }
            },
            axisLabel: {
                show: false
            },
            pointer: {
                show: false
            },
            axisLine: {
                lineStyle: {
                    opacity: 0
                }
            },
            detail: {
                show: false
            },
            data: [{
                value: 0,
                name: ""
            }]
        },

    ]
        };

        // 获取图表容器元素
        var chartContainer = document.getElementById('jbqkets');

        // 初始化图表
        var myChart = echarts.init(chartContainer);

        // 应用配置
        myChart.setOption(option);
      //获取圆上面某点的坐标(x0,y0表示坐标，r半径，angle角度)
      function getCirlPoint(x0, y0, r, angle) {
          let x1 = x0 + r * Math.cos(angle * Math.PI / 180)
          let y1 = y0 + r * Math.sin(angle * Math.PI / 180)
          return {
              x: x1,
              y: y1
          }
      }

      function draw(){
          angle = angle+3
          myChart.setOption(option, true)
         //window.requestAnimationFrame(draw);
      }

      setInterval(function() {
          //用setInterval做动画感觉有问题
          draw()
      }, 50);

      drline();
          };
}

function cssadd(){
  var style = document.createElement('style');
      style.type = 'text/css';
      style.innerHTML = `
      .xzjt{
        position: absolute;
        top: 9%;
        left: 23%;
        width: 800px;
        /* text-align: left; */
        height: 800px;
        padding-top: 24%;
        /* border: 1px solid #fff; */
        border-radius: 50%;
        transition: transform 0.5s ease;
        transform: rotate(30deg);
      }
      .tab-content {
        display: none;
        margin-left: 12px;
        margin-top: 15px;
        border: 2px solid #143767;
        height: 600px;
        width: 97%;
        border-radius: 15px;
        box-shadow: inset 0px 0px 40px #0e0f0f87;
        padding: 15px;
      }

      .tab-content img{
        height: 570px;
        width: 1270px ;
      }

      .tbleft
      {
        width: 60%;
        height: 100%;
        float: left;
        /* border: 1px solid #0e7596; */
        border-radius: 15px;
        box-shadow: 0px 0px 17px #00000070;
        margin-right: 15px;
        overflow: hidden;
      }
       .tbright
      {
        width: 38.81%;
        height: 100%;
        float: left;
        /* border: 1px solid #0e7596; */
        border-radius: 15px;
        box-shadow: 0px 0px 17px #00000070;
      }
     .active-tab {
        display: block;
      }
      .jtab{
        position: absolute;
        left: 5%;
        top: 15%;
        width: 90%;
        z-index: 999999;
        overflow: hidden;
      }
      .tab-button{
        width: 23%;
        height: 50px;
        border-radius: 10px;
        background: none;
        color: #a1a1a1a8;
        font-size: 20px;
        font-weight: bold;
        border: 2px solid #699aa9;
        margin-right: 15px;

      }
      .tabactive{
        color: #6edbff;
        background: repeating-linear-gradient(180deg, #000000ba, #00428d);
        border: 2px solid #23c9ff;
      }
      .xzjt img{
        width: 60px !important;
        transform: rotateY(180deg) rotate(5deg);
      }
      .cityc{
        position: absolute;
        top: 40%;
        left: 31%;
        width: 38%;
        opacity: 0.8;
      }

      .ct2{
        transform: rotateX(180deg);
        bottom: -49%;
        opacity: 0.2;
      }
      .lipointlbn{
        height: 150px;
        width: 150px;
        position: absolute;
        opacity:0.2;
      }
      .opcla{
        opacity:1;
      }
      .jiedcont{
          position: absolute;
          top: 30%;
          left: 15%;
          color: #83ebff;
          text-shadow: 0px 0px 20px #00233d;
          font-weight: bold;
          font-size: 18px;
      }
      .jiedpic{
          position: absolute;
        height: 100%;
        width: 100%;
      }
      .jiedpic img{
            height: 120%;
            width: 120% !important;
      }
      .clspnl{
        width: 40px;
        position: absolute;
        right: 10px;
        background: #419ef0;
        z-index: 999;
        height: 40px;
        border-radius: 50%;
        top: 10px;
        font-size: 24px;
        color: #ffffff;
        font-weight: bold;
        box-shadow: 0px 0px 20px 0px #000000;
      }
      .xh ,.shijian ,.neirong ,.danwei{
        float: left;
        text-align:center;
      }
      .xh{
        width: 12%;
      }
      .shijian{
        width: 20%;
      }
      .danwei{
        width: 30%;
      }
      .neirong{
        width: 36%;
      }
      .div-container {
        overflow: hidden;
        height: 600px;
        width: 42%;
        left: 30%;
        width: 605px;
        top: 18%;
        z-index: 999;
        position: absolute;

        border: 1px solid #23c9ff;
        border-radius: 50%;
        padding: 0px;

        box-shadow: 0px 0px 20px 0px #1d99c8;
        box-shadow: inset 0px 0px 160px 40px #000000;
      }

      .div-item {
        width: 100%;
        height: 50px;
        font-size: 14px;
        color: #17779626;
        float: left;
        clear: both;
        border-bottom: 1px solid #428bca3d;
        line-height: 50px;
        }

      .active {
         font-weight:bold;
         color:#e4c109;
          font-size:18px;
        }

      .fudongrq {
        width: 750px;
        height: 850px;
        position: fixed;
        background: #112d5400;
        left: -750px;
        top: 120px;
        padding: 20px;
        display: none;
        /* border: 1px solid #0283ad; */
        border-radius: 10px;
        box-shadow: 0px 4px 20px #05536c;
      }
      .indvi{
        height: 28%;
        /* border: 1px solid #ffffff; */
        box-shadow: 0px 4px 20px #001f4d;
        border-radius: 10px;
        padding: 20px;
        margin-bottom: 20px;
        background: #0c284ffa;
      }
      .indvi2{
        height: 8%;
        background: repeating-linear-gradient(315deg, #240c5b, #0064b5);
        font-size: 24px;
        color: #ffffff;
        padding: 15px;
        padding-left: 20px;
      }
      .tcstyle{
        width: 1490px;
        height: 850px;
        position: fixed;
        left: 30.5%;
        background: repeating-linear-gradient(199deg, #0b5ebdf2, #000000f5);
        top: 10%;
        padding: 10px;
        display: block;
        border-radius: 10px;
        box-shadow: 0px 4px 26px #001e40;
        text-align: center;
        padding: 20px;
      }
      .tcstyle img{
        position:absolute;
        width:1450px;
      }
      .inpciod{
        width: 200px;
        height:160px;
        float: left;
      }
      .piwordd{
         float:left;
         width: 469px;
          height: 160px;
      }
      .piwordd h1{
        font-size: xx-large !important;
        color: #ffffff;
      }
      .piwordd p{
        font-size: 17px;
        color: #ffffff;
        line-height: 31px;
        text-indent: 2em;
        letter-spacing: 1px;
      }
      .lan{
       color:#23c9ff;
      }
      .cardtitle{
        width: 100%;
        clear: both;
        height: 40px;
        /* line-height: 35px; */
        color: #fff;
        background: url(http://150.129.138.35:42200/ams-view-platform/img/title-long-bg.04ce9a01.png) no-repeat;
        display: flex;
        padding-left: 40px;
        font-size: 20px;
        font-weight: bold;
      }
      .jieddiv{
        float: left;

        width: 24%;
        height: 82%;
        margin-right: 5px;
      }
      .jdpic{
        height: 76%;
        padding: 15px;
        float: left;
        width: 100%;
        clear: both;
      }
      .jdcont{
        float: left;
        width: 100%;
        text-align: center;
        color: #23c9ff;
        font-weight: bold;
        font-size: 20px;
      }
      .jiantou{
      position: absolute;
          width: 100%;
          height: 30px;
      }
      .jiantou div{
          float: left;
          position: relative;

          width: 13%;
          height: 98px;

          top: 31%;
      }
      #jt1{
        margin-left: 112px;
      }
      #jt2{
         margin-left: 70px;
      }
      #jt3{
         margin-left: 70px;
      }
      #jt4{
         margin-left: 60px;
      }
      .titlepnl{
        width: 300px;
        right: 40%;
        top: 5.5%;
        background: none;
        box-shadow: none;
      }
      .gdpan{
        overflow: hidden;
        height: 600px;
        z-index: 99999;
        position: absolute;
        top: 18%;
        border-radius: 50%;
        padding: 0px;
        left: 30%;
        width: 605px;
        /* background: red; */
        box-shadow: 0px 0px 20px #23c9ff;
        border: 5px solid #4f99ef;

      }
      .gdgliang{
        width: 10px;
        width: 110%;
        /* background: red; */
        height: 50px;
        position: absolute;
        top: 50%;
        left: -5%;
        box-shadow: 0px 0px 40px 0px #23c9ff;
        border-radius: 22px;
        border: 5px solid #187ee3;
      }
      .linepoint{
        height: 60%;
        clear: both;
        position: absolute;
        width: 100%;
        /* background: red; */
        padding-top: 10%;
        left: 0;
        top: 0;
      }
      .ptleft{
        left:15%;
      }
      .ptright{
        left:75%;
      }

      .st2,.st6{ top: 60%; }
      .st3,.st7{ top: 90%; }
      .st4,.st8{ top: 120%;}
      .st2,.st3{ left: 10%; }
      .st6,.st7{ left:80%; }

      .ggfdnt{
        height: 59px;
        width: 40px;
        border: 1px solid #71b1f0;
        position: absolute;
        left: 28.3%;
        top: 16%;
        z-index: 999999;
        cursor: pointer;
        height: 93px;
        /* background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADsAAAA7CAYAAADFJfKzAAAAAXNSR0IArs4c6QAAAARzQklUCAgICHwIZIgAAACDSURBVGiB7dtBDYAwFATRX4IDgigEcOodMUjAAgJQhYaiojSZP0/BjoAtaz1bJDFHRLzPfY0e0tuy7cc0esSfjKUylspYKmOpjKUylspYKmOpjKUylspYKmOpjKUylspYKmOpjKUylspYKmOpjKUylspYKmOpjKUylspYqlSxJdNj6wOHUQhpwiFeiAAAAABJRU5ErkJggg==) no-repeat; */
        color: #ffffff;
        font-size: 12px;
        display: none;
        line-height: 21px;
        text-align: center;
        border-radius: 20px;
        /* text-align: center; */
        padding-top: 15px;
        box-shadow: 0px 0px 20px #0b5ebd;
      }
    #yjhxd{
      width:56%;
      height:86%;
      border-radius:15px;
      position:absolute;
      border: 5px solid #ffd73f;
    }
    #zcpic
      {
        width: 56.2% !important;
        border-radius: 15px;
        padding: 10px;
      }
    .indeccar{
      width: 25%;
      float: left;
      height: 50px;
      /* padding: 5px; */
      color: #6ba9e0;
      background: #174477;
      line-height: 50px;
    }
    .carcc{
      height: 200px;
      margin-bottom:15px;
    }
    .caton{
      background: none;
      color: #ffffff;
      font-weight: bold;
    }
    .carside{
      border-radius: 5px;
      padding: 5px;
      background: #ffff00;
      color: #323232;
    }
    .yjdj
    {
      width: 30%;
      float: left;
      height: 100%;
      border: 1px solid #edde3b;
      font-size: 24px;
      FONT-WEIGHT: bold;
      color: #d9cf22;
      border-radius: 5px;
      box-shadow: inset 0px 0px 15px;
      padding-top: 20px;
    }
    .yjnr{
        width: 69%;
        float: left;
        text-align: left;
        padding: 15px;
    }
    .yjnrtc{
      width: 30%;
      float: left;
      height: 50px;
      line-height: 50px;
      /* background: #3a424b; */
      color: #428bca;

    }
    .yjnrtcnt{
      width: 69%;
      color: #ffffff;
    }
    .gind{
          line-height: 25px;
      padding-top: 15px;
    }
    .wryel{
      height: 50px;
      float: left;
      font-size: 25px;
      text-align: center;
      width: 100%;
      line-height: 0px;
       background: url(https://www.sanyasw.cn/floodwms/upload/20240827/879f77af1bc577b61de7134e27a40af8.png);
    }
    .hr{
        height: 5px;
      width: 100%;
      background: #838410;
    }
    .rounded-triangle{
      position: relative;
      height: 100px;
      width: 100%;
      text-align: center;
      padding: 25px;
          top: 20px;
    }
    .rounded-triangle #jst{
      width: auto !important;
      position: absolute;
      height: 100px !important;
      left: 30px;
    }
    .wrnry{
        position: relative;
    top: 20px;
    }
    .btbb{
        position: relative;
        top: 56px;

        height: 100%;
        width: 100%;
    }
      `;


    // 将<style>元素添加到<head>中，以便在整个文档中应用这些样式
    document.head.appendChild(style);
}

function drline(){
   // 获取图表容器元素
        var lineonet = document.getElementById('linecharts');

        // 初始化图表
        var LineChart = echarts.init(lineonet);

        let dataArr = [{
           value: 90,
           name: '系统集成',
           itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                 {
                    offset: 0,
                    color: '#1d456f'
                    },
                    {
                    offset: 1,
                    color: '#3e96c3'
                    }
                 ])
              }
           },{
           value: 90,
           name: '数据接入',
           itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                 {
                    offset: 0,
                    color: '#1d456f'
                    },
                    {
                    offset: 1,
                    color: '#3e96c3'
                    }
                 ])
              }
           },
           {
           value: 90,
           name: '数据清洗',
           itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                 {
                    offset: 0,
                    color: '#1d456f'
                    },
                    {
                    offset: 1,
                    color: '#3e96c3'
                    }
                 ])
              }
           },
           {
              value: 100,
              name: '可视化要求',
              itemStyle: {
                 color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                 {
                    offset: 0,
                    color: '#1d456f'
                    },
                    {
                    offset: 1,
                    color: '#3e96c3'
                    }
                 ])
              }
           },
           {
           value: 100,
           name: '系统功能研发',
           itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                 {
                    offset: 0,
                    color: '#1d456f'
                    },
                    {
                    offset: 1,
                    color: '#3e96c3'
                    }
                 ])
              }
           }
        ];

        let lab = '//106.3.97.67:8410/assets/circle-1.bbc3ce2f.png';
        var lineoption={
           grid: {
              show: false,                                 //是否显示图表背景网格
              left: '0%',                                    //图表距离容器左侧多少距离
              right: '5%',                                //图表距离容器右侧侧多少距离
              bottom: '0%',                              //图表距离容器上面多少距离
              top: '15%',                                       //图表距离容器下面多少距离

          },
          xAxis: {
              show: false
           },
           tooltip: {
              show: false
           },
           yAxis: [
              {
                 triggerEvent: true,
                 show: true,
                 data: ['数据接入','数据清洗','系统集成','可视化要求','系统功能研发'],
                 axisLine: {
                    show: false
                 },
                 splitLine: {
                    show: false
                 },
                 axisTick: {
                    show: false
                 },
                 axisLabel: {
                    interval: 0,
                    inside: true,
                    color: '#fff',
                    margin: 0,
                    padding: [0, 0, 5, 0],
                    align: 'left',
                    verticalAlign: 'bottom',
                    formatter: function (value, index) {
                       // return '{title|' + value + '}:{index|' + dataArr[index].value + '%}';
                       return `{title|${value}}: {index|  ${dataArr[index].value }%}`;

                    },
                    rich: {
                       // 此title对应的是 formatter|前的title
                       title: {
                          fontSize: 14
                       },
                       // 此index对应的是 formatter|前的index
                       index: {
                          fontSize: 14,
                          fontWeight: 'bold',
                          // padding: [0,0,0,600],
                          // backgroundColor:'red',
                          align: 'left',
                          width: '100%',
                       }
                    }
                 }
              }
           ],
           series: [
              {
                 type: 'bar',
                 barMinWidth: '5',
                 yAxisIndex: 0,
                 data: dataArr,
                 barWidth: 2,
                 z: 1,
                 itemStyle: {
                    normal: {
                       barBorderRadius: 20
                    }
                 }
              },
              {
                 data: dataArr,
                 type: 'pictorialBar',
                 barMaxWidth: 20,
                 symbolPosition: 'end',
                 symbol: 'image://' + lab,
                 symbolOffset: [10, 0],
                 symbolSize: [20, 20],
                 zlevel: 2,
                 silent: true
              },
              {
                 type: 'bar',
                 barGap: '-100%',
                 yAxisIndex: 0,
                 data: [100,100,100,100],
                 barWidth: 5,
                 itemStyle: {
                    barBorderRadius: 0,
                    color: '#132C5A'
                 },
                 z: 0,
                 silent: true
              }
           ]
        }
        // 应用配置
        LineChart.setOption(lineoption);
}
//导航页
function checkinit(){

    // 替换为您的 Lottie JSON 文件的实际路径
    //var lottieJsonUrl = 'https://www.sanyasw.cn/floodwms/upload/20240808/140c3a14295c2466a247c4d2e841025b.json';
    var lottieJsonUrl='https://www.sanyasw.cn/floodwms/upload/20240808/b2febaac9acb8a6231a243bb9a0644bf.json'
    //var lotsj = 'https://www.sanyasw.cn/floodwms/upload/20240808/c770108bbde5c7b9c279857861c35d60.json';
    var lotlixiang = 'https://www.sanyasw.cn/floodwms/upload/20240808/32eab8cbcc6477b44a87bcc5bb2c7546.json'
    var lotpingshen='https://www.sanyasw.cn/floodwms/upload/20240808/baeb06a026a5849358e9580b23719118.json'
    var lotsheji='https://www.sanyasw.cn/floodwms/upload/20240808/1475109673abd7f2390e970336a4addf.json'
    var lotyanfa='https://www.sanyasw.cn/floodwms/upload/20240808/fc6b7e904c1f70491576e670e0e26c01.json'
    var lotjts = 'https://www.sanyasw.cn/floodwms/upload/20240808/0d5c43ececfe11a85301365eaa344053.json'

    // 加载 Lottie 库
    var script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/bodymovin/5.7.6/lottie.min.js';
    script.onload = function() {

        // 当 Lottie 库加载完成后，加载并播放动画
        var animationloti = lottie.loadAnimation({
            container:document.getElementById("lottie"), // 选择要添加动画的 DOM 元素
            path: lottieJsonUrl,
            renderer: 'svg',
            loop: true,
            autoplay: true
        });

        //立项
        var animationloti12 = lottie.loadAnimation({
            container:document.getElementById("jdpic1"), // 选择要添加动画的 DOM 元素
            path: lotlixiang,
            renderer: 'svg',
            loop: true,
            autoplay: true
        });
      //评审
       var animationloti13 = lottie.loadAnimation({
            container:document.getElementById("jdpic2"), // 选择要添加动画的 DOM 元素
            path: lotpingshen,
            renderer: 'svg',
            loop: true,
            autoplay: true
        });
      //设计
       var animationloti14= lottie.loadAnimation({
            container:document.getElementById("jdpic3"), // 选择要添加动画的 DOM 元素
            path: lotsheji,
            renderer: 'svg',
            loop: true,
            autoplay: true
        });
      //研发
       var animationloti15 = lottie.loadAnimation({
            container:document.getElementById("jdpic4"), // 选择要添加动画的 DOM 元素
            path: lotyanfa,
            renderer: 'svg',
            loop: true,
            autoplay: true
        });

      //jt1
      var animationlotijt1 = lottie.loadAnimation({container:document.getElementById("jt1"),
            path: lotjts,
            renderer: 'svg',
            loop: true,
            autoplay: true
        });
       var animationlotijt2 = lottie.loadAnimation({container:document.getElementById("jt2"),
            path: lotjts,
            renderer: 'svg',
            loop: true,
            autoplay: true
        });
       var animationlotijt3 = lottie.loadAnimation({container:document.getElementById("jt3"),
            path: lotjts,
            renderer: 'svg',
            loop: true,
            autoplay: true
        });
       var animationlotijt4 = lottie.loadAnimation({container:document.getElementById("jt4"),
            path: lotjts,
            renderer: 'svg',
            loop: true,
            autoplay: true
        });

    };
    document.head.appendChild(script);



      /* globals jQuery, $, waitForKeyElements */

    // 1. 创建浮动容器的HTML结构
    const container = document.createElement('div');
    container.id = "ysdiv"
    container.className  = "fudongrq"
    container.style = " left: -750px; display: none;"
    // 假设容器内容是一些文本
    const contentdiv1 = document.createElement('div');
    contentdiv1.className='indvi'
    contentdiv1.id="ct1"
    //页面结构
    const ct1html = `
      <div class='cardtitle'>项目<span class='lan'>基本情况</span>介绍</div>
      <div class='inpciod' id="jbqkets">&nbsp;</div>
      <div class='piwordd' id="linecharts">&nbsp;</div>
    `

    contentdiv1.innerHTML = ct1html;
    contentdiv1.onclick=function(){
      cli(contentdiv1.id);
    }

    const contentdiv2 = document.createElement('div');
     contentdiv2.className='indvi'
    contentdiv2.id="ct2"

      const ct2html = `
      <div class='cardtitle'>项目<span class='lan'>整体定位</span>介绍</div>
      <div class='inpciod' id="lottie"></div>
      <div class='piwordd'>
        <p>1、加强公路养护管理，完善安全应急保障体系，推动公路智慧化与周边资源开发相结合，拓展路衍经济，不断提升精细化管理运营水平；</p>
        <p>2、为海南全域旅游发展提供重要交通支撑，努力将环岛旅游公路及沿海景点、驿站品牌化。</p>
<!--         <p>为广大公众的日常出行提供丰富、及时、准确的信息服务，使公众能够提前规划行程，合理安排出行方式和时间，从而提高出行效率和满意度。</p> -->
      </div>
    `
    contentdiv2.innerHTML = ct2html;

    contentdiv2.onclick=function(){
      cli(contentdiv2.id);
    }

    const contentdiv3 = document.createElement('div');
    contentdiv3.className='indvi'
    contentdiv3.id="ct3"

    const ct3html = `
      <div class='cardtitle'>项目<span class='lan'>实施阶段</span>介绍</div>
       <div class="jiantou"><div id="jt1"></div><div id="jt2"></div><div id="jt3"></div><div id="jt4"></div></div>
      <div class='jieddiv'><div class="jdpic" id="jdpic1"></div><div class="jdcont">项目立项</div></div>
      <div class='jieddiv'><div class="jdpic" id="jdpic2"></div><div class="jdcont">项目评审</div></div>
      <div class='jieddiv'><div class="jdpic" id="jdpic3"></div><div class="jdcont">项目设计</div></div>
      <div class='jieddiv'><div class="jdpic" id="jdpic4"></div><div class="jdcont">项目实施</div></div>
    `
    contentdiv3.innerHTML = ct3html
    contentdiv3.onclick=function(){
      cli(contentdiv3.id);
    }

    const contentdiv4 = document.createElement('div');
    contentdiv4.className='indvi indvi2'
    contentdiv4.id="ct4"
    contentdiv4.textContent = '下一阶段平台方向思考';
    contentdiv4.onclick=function(){
      cli(contentdiv4.id);
    }
    container.appendChild(contentdiv2);
    container.appendChild(contentdiv1);

    container.appendChild(contentdiv3);
   container.appendChild(contentdiv4);

    // 2. 创建并打开/收缩的按钮
    const toggleButton = document.createElement('div');
    toggleButton.style = "width: 60px;height: 140px;position: fixed;background: #23c9ff1a;border: 1px solid #1d99c8;left: 0px;top: 40%;font-size: 24px;color: #ffffff;border-radius: 0px 20px 20px 0px;padding: 10px;text-align: center;line-height: 1.25;";


    //2.1创建弹窗
    const showwind = document.createElement('div');
    showwind.id="tsc";
    showwind.className = "tcstyle"
    showwind.style="display:none"

    toggleButton.textContent = '项目概况';
    $("#cdnl").onclick = function() {
        if (container.style.display === 'none') {
            container.style.display = 'block';

           $(container).animate({
              left: '100px'
            }, 1000); // 移动时长为1秒

        } else {
           $(container).animate({
              left: '-750px'
            }, 1000,function(){
             $(container).hide()
           }); // 移动时长为1秒
            //container.style.display = 'none';
            showwind.style.display = 'none';

        }
    };
    toggleButton.onclick = function() {
        if (container.style.display === 'none') {
            container.style.display = 'block';

           $(container).animate({
              left: '100px'
            }, 1000); // 移动时长为1秒

        } else {
           $(container).animate({
              left: '-750px'
            }, 1000,function(){
             $(container).hide()
           }); // 移动时长为1秒
            //container.style.display = 'none';
            showwind.style.display = 'none';

        }
    };

    // 3. 将容器和按钮添加到body中
    document.body.appendChild(container);
    document.body.appendChild(toggleButton);
    document.body.appendChild(showwind);

    //$("#ysdiv").append(toggleButton);
    $(".line-block").css({"display" : 'none'});
}

function cli(cid){
 // 先定义一个全局变量来保存计时器的 ID


  showwind = document.getElementById('tsc');
   if (cid =="ct1"){
      showwind.innerHTML="<img src='https://www.sanyasw.cn/floodwms/upload/20240827/339f6783ca7f15151edf59ab6567447e.jpg' />";
  }else if (cid =="ct2"){
     // showwind.innerHTML="<img src='https://www.sanyasw.cn/floodwms/upload/20240808/5d3aeb7496e0bb9326f98f67a5da2b75.jpg' />";
     showwind.innerHTML=`
     <div class="clspnl" id='cdnl'>X</div>
     <div class="clspnl titlepnl" id='pntile1'>&nbsp;</div>
    <div  class="pannelgb"><img src='https://www.sanyasw.cn/floodwms/upload/20240823/bd612b20096e62cbd5b01eb47e0e924a.jpg' /></div>

    <div class="pannelgb"><img src="https://www.sanyasw.cn/floodwms/upload/20240808/cfa5cca081e44ae0b67ceed5bc6252b2.png" /></div>
   `
       $("#pntile1").text("整体项目定位")
  }else if (cid =="ct3"){
      stopTimer()
      //showwind.innerHTML="<img src='https://cdnjson.com/images/2024/08/01/_20240801161506.png' />";
      showwind.innerHTML=`
     <div class="clspnl" id='cdnl'>X</div>
     <div class="clspnl titlepnl" id='pntile'>&nbsp;</div>
     <div class="gdpan"><div class="gdgliang">&nbsp;</div></div>
    <div class="pannelgb"><img src="https://www.sanyasw.cn/floodwms/upload/20240813/e3ee56c39f2c1b65e43a7726cff185e3.png" /></div>
    <div class="pannelgb"><img src="https://www.sanyasw.cn/floodwms/upload/20240808/cfa5cca081e44ae0b67ceed5bc6252b2.png" /></div>
    <div class='linepoint'>
     <div class='lipointlbn opcla st1 ptleft'><div class='jiedpic'><img src='https://www.sanyasw.cn/floodwms/upload/20240813/a2bae5a913dcf26b882feee672e5457b.png' /></div><div class='jiedcont'><p>2020年05月</p><p>成立项目小组</p></div></div>
     <div class='lipointlbn st2 ptleft'><div class='jiedpic'><img src='https://www.sanyasw.cn/floodwms/upload/20240813/a2bae5a913dcf26b882feee672e5457b.png' /></div><div class='jiedcont'><p>2020年09月</p><p>可行性分析</p></div></div>
     <div class='lipointlbn st3 ptleft'><div class='jiedpic'><img src='https://www.sanyasw.cn/floodwms/upload/20240813/a2bae5a913dcf26b882feee672e5457b.png' /></div><div class='jiedcont'><p>2020年09月</p><p>可行性分析</p></div></div>
     <div class='lipointlbn st4 ptleft'><div class='jiedpic'><img src='https://www.sanyasw.cn/floodwms/upload/20240813/a2bae5a913dcf26b882feee672e5457b.png' /></div><div class='jiedcont'><p>2020年09月</p><p>初步设计</p></div></div>

     <div class='lipointlbn st5 ptright'><div class='jiedpic'><img src='https://www.sanyasw.cn/floodwms/upload/20240813/a2bae5a913dcf26b882feee672e5457b.png' /></div><div class='jiedcont'><p>2020年11月</p><p>施工图设计</p></div></div>
     <div class='lipointlbn st6 ptright'><div class='jiedpic'><img src='https://www.sanyasw.cn/floodwms/upload/20240813/a2bae5a913dcf26b882feee672e5457b.png' /></div><div class='jiedcont'><p>2022年05月</p><p>智慧化提升</p></div></div>
     <div class='lipointlbn st7 ptright'><div class='jiedpic'><img src='https://www.sanyasw.cn/floodwms/upload/20240813/a2bae5a913dcf26b882feee672e5457b.png' /></div><div class='jiedcont'><p>2023年10月</p><p>招投标备案</p></div></div>
     <div class='lipointlbn st8 ptright'><div class='jiedpic'><img src='https://www.sanyasw.cn/floodwms/upload/20240813/a2bae5a913dcf26b882feee672e5457b.png' /></div><div class='jiedcont'><p>2023年10月</p><p>招标审批</p></div></div>
     <div class='linetile'>时间轴演示</div>
      <div class='cityc ct1'><img src='https://www.sanyasw.cn/floodwms/upload/20240813/0bc8e892cef295a1f3bca7d243012d0c.png' /></div>
       <div class='cityc ct2'><img src='https://www.sanyasw.cn/floodwms/upload/20240813/0bc8e892cef295a1f3bca7d243012d0c.png' /></div>
      <div class='xzjt'><img src='https://www.sanyasw.cn/floodwms/upload/20240813/3504db0531b63db4890dcc6f7c0121bb.png' /></div>
    </div>
   <div class="div-container">
    <div class="div-item "><div class="xh">3</div><div class="shijian">2020年09月</div><div class="danwei">省交通厅</div><div class="neirong">完成可行性报告批复</div></div>
    <div class="div-item"><div class="xh">4</div><div class="shijian">2020年09月</div><div class="danwei">省发改委</div><div class="neirong">完成初步设计批复 </div></div>
    <div class="div-item"><div class="xh">5</div><div class="shijian">2020年11月</div><div class="danwei">省交通厅</div><div class="neirong">完成施工图设计批复 </div></div>
    <div class="div-item"><div class="xh">6</div><div class="shijian">2022年05月</div><div class="danwei">大数据管理局</div><div class="neirong">完成智慧化提升部分审查 </div></div>
    <div class="div-item"><div class="xh">7</div><div class="shijian">2023年10月</div><div class="danwei">省交通厅</div><div class="neirong">完成招投标方案备案</div></div>
    <div class="div-item"><div class="xh">8</div><div class="shijian">2023年10月</div><div class="danwei">省公共资源交易中心</div><div class="neirong">完成招标审批</div></div>

    <div class="div-item active"><div class="xh">1</div><div class="shijian">2020年05月</div><div class="danwei">交控科技公司</div><div class="neirong">成立环岛旅游公路领导小组</div></div>
    <div class="div-item"><div class="xh">2</div><div class="shijian">2020年09月</div><div class="danwei">省发改委</div><div class="neirong">完成可行性报告批复</div></div>
    <div class="div-item "><div class="xh">3</div><div class="shijian">2020年09月</div><div class="danwei">省交通厅</div><div class="neirong">完成可行性报告批复</div></div>
    <div class="div-item"><div class="xh">4</div><div class="shijian">2020年09月</div><div class="danwei">省发改委</div><div class="neirong">完成初步设计批复 </div></div>
    <div class="div-item"><div class="xh">5</div><div class="shijian">2020年11月</div><div class="danwei">省交通厅</div><div class="neirong">完成施工图设计批复 </div></div>
    <div class="div-item"><div class="xh">6</div><div class="shijian">2022年05月</div><div class="danwei">大数据管理局</div><div class="neirong">完成智慧化提升部分审查 </div></div>
    <div class="div-item"><div class="xh">7</div><div class="shijian">2023年10月</div><div class="danwei">省交通厅</div><div class="neirong">完成招投标方案备案</div></div>
    <div class="div-item"><div class="xh">8</div><div class="shijian">2023年10月</div><div class="danwei">省公共资源交易中心</div><div class="neirong">完成招标审批</div></div>

    <div class="div-item"><div class="xh">1</div><div class="shijian">2020年05月</div><div class="danwei">交控科技公司</div><div class="neirong">成立环岛旅游公路领导小组</div></div>
    <div class="div-item"><div class="xh">2</div><div class="shijian">2020年09月</div><div class="danwei">省发改委</div><div class="neirong">完成可行性报告批复</div></div>
    <div class="div-item "><div class="xh">3</div><div class="shijian">2020年09月</div><div class="danwei">省交通厅</div><div class="neirong">完成可行性报告批复</div></div>
    <div class="div-item"><div class="xh">4</div><div class="shijian">2020年09月</div><div class="danwei">省发改委</div><div class="neirong">完成初步设计批复 </div></div>
    <div class="div-item"><div class="xh">5</div><div class="shijian">2020年11月</div><div class="danwei">省交通厅</div><div class="neirong">完成施工图设计批复 </div></div>
    <div class="div-item"><div class="xh">6</div><div class="shijian">2022年05月</div><div class="danwei">大数据管理局</div><div class="neirong">完成智慧化提升部分审查 </div></div>
    <div class="div-item"><div class="xh">7</div><div class="shijian">2023年10月</div><div class="danwei">省交通厅</div><div class="neirong">完成招投标方案备案</div></div>
    <div class="div-item"><div class="xh">8</div><div class="shijian">2023年10月</div><div class="danwei">省公共资源交易中心</div><div class="neirong">完成招标审批</div></div>

     <div class="div-item"><div class="xh">1</div><div class="shijian">2020年05月</div><div class="danwei">交控科技公司</div><div class="neirong">成立环岛旅游公路领导小组</div></div>
    <div class="div-item"><div class="xh">2</div><div class="shijian">2020年09月</div><div class="danwei">省发改委</div><div class="neirong">完成可行性报告批复</div></div>
    <div class="div-item"><div class="xh">3</div><div class="shijian">2020年09月</div><div class="danwei">省交通厅</div><div class="neirong">完成可行性报告批复</div></div>
    <div class="div-item"><div class="xh">4</div><div class="shijian">2020年09月</div><div class="danwei">省发改委</div><div class="neirong">完成初步设计批复 </div></div>
    <div class="div-item"><div class="xh">5</div><div class="shijian">2020年11月</div><div class="danwei">省交通厅</div><div class="neirong">完成施工图设计批复 </div></div>
    <div class="div-item"><div class="xh">6</div><div class="shijian">2022年05月</div><div class="danwei">大数据管理局</div><div class="neirong">完成智慧化提升部分审查 </div></div>
    <div class="div-item"><div class="xh">7</div><div class="shijian">2023年10月</div><div class="danwei">省交通厅</div><div class="neirong">完成招投标方案备案</div></div>
    <div class="div-item"><div class="xh">8</div><div class="shijian">2023年10月</div><div class="danwei">省公共资源交易中心</div><div class="neirong">完成招标审批</div></div>

      <div class="div-item"><div class="xh">1</div><div class="shijian">2020年05月</div><div class="danwei">交控科技公司</div><div class="neirong">成立环岛旅游公路领导小组</div></div>
    <div class="div-item"><div class="xh">2</div><div class="shijian">2020年09月</div><div class="danwei">省发改委</div><div class="neirong">完成可行性报告批复</div></div>
    <div class="div-item"><div class="xh">3</div><div class="shijian">2020年09月</div><div class="danwei">省交通厅</div><div class="neirong">完成可行性报告批复</div></div>
    <div class="div-item"><div class="xh">4</div><div class="shijian">2020年09月</div><div class="danwei">省发改委</div><div class="neirong">完成初步设计批复 </div></div>
    <div class="div-item"><div class="xh">5</div><div class="shijian">2020年11月</div><div class="danwei">省交通厅</div><div class="neirong">完成施工图设计批复 </div></div>
    <div class="div-item"><div class="xh">6</div><div class="shijian">2022年05月</div><div class="danwei">大数据管理局</div><div class="neirong">完成智慧化提升部分审查 </div></div>
    <div class="div-item"><div class="xh">7</div><div class="shijian">2023年10月</div><div class="danwei">省交通厅</div><div class="neirong">完成招投标方案备案</div></div>
    <div class="div-item"><div class="xh">8</div><div class="shijian">2023年10月</div><div class="danwei">省公共资源交易中心</div><div class="neirong">完成招标审批</div></div>

     <div class="div-item"><div class="xh">1</div><div class="shijian">2020年05月</div><div class="danwei">交控科技公司</div><div class="neirong">成立环岛旅游公路领导小组</div></div>
    <div class="div-item"><div class="xh">2</div><div class="shijian">2020年09月</div><div class="danwei">省发改委</div><div class="neirong">完成可行性报告批复</div></div>
 <div class="div-item "><div class="xh">3</div><div class="shijian">2020年09月</div><div class="danwei">省交通厅</div><div class="neirong">完成可行性报告批复</div></div>
    <div class="div-item"><div class="xh">4</div><div class="shijian">2020年09月</div><div class="danwei">省发改委</div><div class="neirong">完成初步设计批复 </div></div>
    <div class="div-item"><div class="xh">5</div><div class="shijian">2020年11月</div><div class="danwei">省交通厅</div><div class="neirong">完成施工图设计批复 </div></div>



  </div>

     `
    // 定义一个数组存放所有的 div 元素
    $("#pntile").text("项目主要里程碑")
    var divItems = $('.div-item');
    var tcItems = $('.lipointlbn ');
    // 重新开启计时器的函数
    function restartTimer() {
      //运行滚动

      gdtimerId = setInterval(function() {

        scrollTop = scrollTop+50;  // 每次滚动 50 像素（一个 div 的高度）
        if (scrollTop >= 50 * (divItems.length - 11)) {  // 当滚动到最后一个 div 时，回到顶部
          scrollTop = 0;
          rege = 30;
        }

        $('.div-container').animate({
          scrollTop: scrollTop
        }, 500);


        // 获取当前显示区域内的起始索引
        var startIndex = Math.floor(scrollTop / 50);

        // 获取当前显示区域内的第 5 个 div 并进行高亮
        var fifthDivInView = divItems.slice(startIndex, startIndex + 7).eq(6);
        divItems.removeClass('active');
        fifthDivInView.addClass('active');
        tcItems.removeClass('opcla');
        tcItems.eq($(fifthDivInView).find('div').eq(0).text()-1).addClass('opcla');
        var sgrage = parseInt($(fifthDivInView).find('div').eq(0).text())
        switch(sgrage){
          case 1:
            rege = 30;
            break;
          case 2:
            rege = 10;
            break;
          case 3:
            rege = -7;
            break;
          case 4:
            rege = -30;
            break;
          case 5:
            rege = 156;
            break;
          case 6:
            rege = 178;
            break;
          case 7:
            rege = 194;
            break;
          case 8:
            rege = 215;
            break;
        }

        $('.xzjt').css('transform', 'rotate(' + rege + 'deg)');

      }, 3000);  // 1000 毫秒，即 1 秒
    }

    // 调用重新开启计时器的函数
    restartTimer();


    //定义滚动结束===========
  }else if (cid =="ct4"){
    //showwind.innerHTML="<video src='https://sf1-cdn-tos.huoshanstatic.com/obj/media-fe/xgplayer_doc_video/mp4/xgplayer-demo-360p.mp4' controls autoplay width=1450></video>";
     showwind.innerHTML=`
     <div class="clspnl" id='cdnl'>X</div>
     <div class="clspnl titlepnl" id='pntile1'>&nbsp;</div>
    <div  class="pannelgb jtab">
     <div class='jdtabnt'>
        <button class="tab-button tabactive" data-tab="tab1">推进 · 数据资产整合</button>
        <button class="tab-button" data-tab="tab2">联动 · 终端统筹管理</button>
        <button class="tab-button" data-tab="tab3">完善 · 平台治超能力</button>
        <button class="tab-button" data-tab="tab4">提高 · 安全服务意识</button>
      </div>
      <div id="tab1" class="tab-content active-tab">
        <img src="https://www.sanyasw.cn/floodwms/upload/20240823/309e508ed8f273a5770476a94e6030b3.png" />
<!--         <div class='tbleft'>第一个左边</div>
        <div class='tbright'>第一个右边</div> -->
      </div>
      <div id="tab2" class="tab-content">
         <img src="https://www.sanyasw.cn/floodwms/upload/20240823/8883b3f7e20fe26675f7450ed9278673.png" />
<!--         <div class='tbleft'>第2个左边</div>
        <div class='tbright'>第2个右边</div> -->
      </div>
      <div id="tab3" class="tab-content">
<!--          <img src="https://www.sanyasw.cn/floodwms/upload/20240823/8bbaecde1a16b2e983eba4044de33eb3.png" /> -->
         <div class='tbleft'>
           <div id='yjhxd' class='shansuo'></div>
           <img id='zcpic' src='https://www.sanyasw.cn/floodwms/upload/20240827/0d39aaee2ed5ed4e0e9e2909ddb359ec.png' />
        </div>
        <div class='tbright'>
          <div class='cardtitle'>车辆基本信息</div>
          <div class='carcc'>
            <div class='carinde'><div class='indeccar'>车牌号码：</div><div class='indeccar caton '><span class='carside'>赣C8M398</span></div><div class='indeccar'>车牌颜色：</div><div class='indeccar caton'>黄色</div></div>
            <div class='carinde'><div class='indeccar'>厂牌型号：</div><div class='indeccar caton'>汕德卡牌</div><div class='indeccar'>管辖机构：</div><div class='indeccar caton'>--</div></div>
            <div class='carinde'><div class='indeccar'>车辆营运状态：</div><div class='indeccar caton'>营运</div><div class='indeccar'>车辆籍地：</div><div class='indeccar caton'>江西省宜春市</div></div>
            <div class='carinde'><div class='indeccar'>客位数(座)：</div><div class='indeccar caton'>0</div><div class='indeccar'>吨位数：</div><div class='indeccar caton'>40</div></div>
          </div>
          <div class='cardtitle'>超载预警</div>
          <div style='padding: 10px;height: 285px;'>
            <div class='yjdj shansuo' id='yjdj'>
              <div class='wryel'>WARNING<hr class='hr' /></div>
              <div class="rounded-triangle">
                <img id='jst' src='https://www.sanyasw.cn/floodwms/upload/20240827/643e7a8a32d111e47dfcc3b79bc6e6de.png' />
              </div>
              <div class='wrnry'>黄色预警</div>
               <div class='wryel btbb'><hr class='hr' />WARNING</div>
            </div>
            <div class='yjnr'>
              <div class='yjnrtc'>预警时间：</div><div class='yjnrtc yjnrtcnt'>2024-06-28 13:52:54</div>
              <div class='yjnrtc'>预警地点：</div><div class='yjnrtc yjnrtcnt'>文昌观景台路段</div>
              <div class='yjnrtc'>预警状态：</div><div class='yjnrtc yjnrtcnt'>已发布</div>
              <div class='yjnrtc'>预警内容：</div><div class='yjnrtc yjnrtcnt gind'>系统监测到重载车辆进入重点区域，该车辆可能存在超载现象。</div>
            </div>
          </div>
        </div>
      </div>
      <div id="tab4" class="tab-content">
         <img src="https://www.sanyasw.cn/floodwms/upload/20240823/53e56851a00c9e263c2b45ea41cd7982.png" />
<!--           <div class='tbleft'>第4个左边</div>
        <div class='tbright'>第4个右边</div> -->
      </div>
    </div>

    <div class="pannelgb"><img src="https://www.sanyasw.cn/floodwms/upload/20240808/cfa5cca081e44ae0b67ceed5bc6252b2.png" /></div>

   `
      $("#pntile1").text("项目下一阶段计划");
      $(".tab-button").click(function () {
          $(".tab-content").removeClass("active-tab");
          $(".tab-button").removeClass("tabactive");
          var targetTab = $(this).data("tab");
          $("#" + targetTab).addClass("active-tab");
          $(this).addClass("tabactive");

          // 添加切换动画
          $(".tab-content").slideUp(300);
          $("#" + targetTab).slideDown(300);
        });




  }
  function breathingEffect() {
    $("#yjhxd,#yjdj").animate({ opacity: 0.5 }, 2000, function() {
        $(this).animate({ opacity: 1 }, 2000, breathingEffect);
    });
  }
  breathingEffect();
  showwind.style.display = 'block';

}

//创建按钮
//
function crdbtn(){

   // 创建一个新的 DIV 元素
    var divtbsc = document.createElement('div');
    divtbsc.className='ggfdnt';
    divtbsc.innerHTML = '<div>下</div><div>一</div><div>步</div>';

    const showwind = document.createElement('div');
    showwind.id="tsc";
    showwind.className = "tcstyle"
    showwind.style="display:none"
    showwind.innerHTML = "<img class='iwpic' src='"+picarry[0]+"' />";
    if ($('.tcstyle').length == 0) {
           // 元素不存在
          $("#app").append(showwind);
    }


    //为 DIV 元素添加点击事件
    divtbsc.addEventListener('click', function() {
      $(".tcstyle").css('z-index',99999);
      $('.iwpic').attr('src',picarry[nowitd])
      $(".tcstyle").toggle();

    });

    if ($('.ggfdnt').length == 0) {
         // 元素不存在
        $("#app").append(divtbsc);
     }else{
        $('.ggfdnt').hide();
     }
    // 将 DIV 元素添加到网页的 body 中
    //document.body.appendChild(divtbsc);




}
//公路资产
function glzcint(){
  nowitd = 0;
  crdbtn()
   $('.ggfdnt').show('slow');
}

//路网监测
function lwjcint(){

  nowitd = 1;
  crdbtn()
   $('.ggfdnt').show('slow');
}

//智能养维
function znywint(){
  nowitd = 3;
  crdbtn()
   $('.ggfdnt').show('slow');
}

//车路协同
function clxtint(){
  nowitd = 2;
  crdbtn()
   $('.ggfdnt').show('slow');
}

//数据监测
function sjjcint(){
  nowitd = 4;
  crdbtn()
   $('.ggfdnt').show('slow');
}

// 等待网页完成加载
window.addEventListener('load', function() {
  // 加载完成后执行的代码
    cssadd()
   //初始化判断是否导航页还是监测页
    var csurl = window.location.href;
    var cssegments = csurl.split('/');
    var cslastSegment = cssegments[cssegments.length - 1];
    if(cslastSegment === "page"){
      //导航页内容
      initEcharts();
      checkinit();

    }else{
      // if(cslastSegment === 'digital-assets'){
      //     glzcint();
      // }else if(cslastSegment === 'road-network-monitoring'){
      //     lwjcint();
      // }else if(cslastSegment === 'intelligent-maintenance'){
      //     znywint();
      // }else if(cslastSegment === 'vehicle-road'){
      //     clxtint();
      // }else if(cslastSegment === 'data-monitor'){
      //     //sjjcint();
      // }
    }
}, false);
(function() {
    'use strict';
    /* globals jQuery, $, waitForKeyElements */

    // 创建 MutationObserver 来监测 DOM 变化
    const observer = new MutationObserver(function(mutationsList) {
        if($(".tcstyle").length >0){
          $(".tcstyle").hide()
        }
        var url = window.location.href;
        var segments = url.split('/');
        var lastSegment = segments[segments.length - 1];
        // if(lastSegment === 'digital-assets'){
        //     glzcint();
        // }else if(lastSegment === 'road-network-monitoring'){
        //     lwjcint();
        // }else if(lastSegment === 'intelligent-maintenance'){
        //     znywint();
        // }else if(lastSegment === 'vehicle-road'){
        //     clxtint();
        // }else if(lastSegment === 'data-monitor'){
        //    // sjjcint();
        // }
    });

    // 配置观察选项
    const config = { childList: true, subtree: true };
    // 开始观察页面主体的 DOM 变化
    //observer.observe(document.body, config);
    observer.observe(document.getElementById('app'), config);


})();