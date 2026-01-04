// ==UserScript==
// @name         孙子直播间的计数君
// @namespace    https://www.douyu.com/510541
// @version      0.1
// @description  孙子直播间的计数脚本，解放大脑！
// @author       Jarhson
// @match        https://www.douyu.com/510541
//@require       https://lib.baomitu.com/jquery/3.4.1/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/392335/%E5%AD%99%E5%AD%90%E7%9B%B4%E6%92%AD%E9%97%B4%E7%9A%84%E8%AE%A1%E6%95%B0%E5%90%9B.user.js
// @updateURL https://update.greasyfork.org/scripts/392335/%E5%AD%99%E5%AD%90%E7%9B%B4%E6%92%AD%E9%97%B4%E7%9A%84%E8%AE%A1%E6%95%B0%E5%90%9B.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $('.ChatSend-txt').ready(()=>{
         console.log($('.ChatSend-txt'))
    })
    $('head').append(`<style>
             #calc {
            background-image: url('https://apic.douyucdn.cn/upload/avanew/face/201701/06/03/5cab309c10ff05b343d3fcbdbf036e3e_big.jpg');
            background-size: 100%;
            background-repeat: no-repeat;
            overflow: auto;
        }

        .addButton {
            cursor: pointer;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            border-radius: 50%;
            height: 80px;
            width: 80px;
        }

        .changeBtn {
            float: right;
            text-decoration: none;
            background: #2f435e;
            color: #f2f2f2;
            padding: 10px 30px 10px 30px;
            font-size: 16px;
            font-family: 微软雅黑, 宋体, Arial, Helvetica, Verdana, sans-serif;
            font-weight: bold;
            border-radius: 3px;
            -webkit-transition: all linear 0.30s;
            -moz-transition: all linear 0.30s;
            transition: all linear 0.30s;
        }

        .changeBtn::after {
            clear: both;
        }

        #toggleBtn {
            position: absolute;
            bottom: -30px;
            width: 100%;
            height: 30px;
            font-size: 20px;
            text-align: center;
            background: #ddd;
            border-bottom-left-radius: 30px;
            border-bottom-right-radius: 30px;
        }

        #customChange {
            height: 0;
            overflow: hidden;
        }

        #customChange input {
            width: 100%;
            border: 1px solid #ccc;
            padding: 7px 0;
            background: #F4F4F7;
            border-radius: 3px;
            padding-left: 5px;
            -webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, .075);
            box-shadow: inset 0 1px 1px rgba(0, 0, 0, .075);
            -webkit-transition: border-color ease-in-out .15s, -webkit-box-shadow ease-in-out .15s;
            -o-transition: border-color ease-in-out .15s, box-shadow ease-in-out .15s;
            transition: border-color ease-in-out .15s, box-shadow ease-in-out .15s
        }
        #customChange button{
            text-decoration: none;
            color: #f2f2f2;
            padding: 2px 7px;
            font-size: 14px;
            font-family: 微软雅黑, 宋体, Arial, Helvetica, Verdana, sans-serif;
            font-weight: bold;
            border-radius: 3px;
            -webkit-transition: all linear 0.30s;
            -moz-transition: all linear 0.30s;
            transition: all linear 0.30s;
        }
        </style>`)
    $('body > section.layout-Container')
    .prepend(`
        <div style="background: #ddd;width:350px;height:auto;position:fixed;top:0;right:0;z-index:10000">
            <div id="calc">
                <div id="context" style="min-height:300px; width:100%; background: rgba(0,0,0,.4);">
                    <div style="padding: 10px 20px; overflow: auto;">
                        <span>Mario多人竞技</span>
                        <label style="color: #39b54a;cursor:pointer;">
                            <input id="danmu" type="checkbox">自动发送弹幕
                        </label>
                        <div id="duoren" style="padding: 10px;display: flex; justify-content: space-around;">
                            <div id="win" class="addButton" style="background: #39b54a;">
                                <div style="pointer-events: none;">胜利</div>
                                <div id="win_count" style="pointer-events: none;">0</div>
                            </div>
                            <div id="ping" class="addButton" style="background: #fbbd08;">
                                <div style="pointer-events: none;">平局</div>
                                <div id="ping_count" style="pointer-events: none;">0</div>
                            </div>
                            <div id="lose" class="addButton" style="background: #e54d42;">
                                <div style="pointer-events: none;">失败</div>
                                <div id="lose_count" style="pointer-events: none;">0</div>
                            </div>
                        </div>
                        <div id="customChange">
                            胜利：<input id="win_input" type="number"><br>
                            平局：<input id="ping_input" type="number"><br>
                            失败：<input id="lose_input" type="number"><br>
                            <div style="padding: 10px;display: flex; justify-content: space-around;">
                                <button id="customChange-clear" style="background: #e54d42;">清除</button>
                                <button id="customChange-save" style="background: #39b54a;">保存</button>
                            </div>
                        </div>
                        <button class="changeBtn">手动修改</button>
                    </div>
                    <hr>
                </div>
            </div>
            <p id="toggleBtn">↑ 收起计数器</p>
        </div>
    `)
  function setData(todayData) {
            $('#win_count').text(todayData.win)
            $('#ping_count').text(todayData.ping)
            $('#lose_count').text(todayData.lose)
            $('#win_input').val(parseInt(todayData.win))
            $('#ping_input').val(parseInt(todayData.ping))
            $('#lose_input').val(parseInt(todayData.lose))
            localStorage.setItem(todyDate, JSON.stringify(todayData))
        }
        let isHiden = parseInt(localStorage.getItem('isHiden')) || 0
        let date = new Date();
        let todyDate = 'date-' + date.getFullYear() + (date.getMonth() + 1) + date.getDate()
        let todayData = JSON.parse(localStorage.getItem(todyDate)) || { win: 0, ping: 0, lose: 0 }
        setData(todayData)
        if (isHiden) {
            $('#calc').slideUp("slow");
            $("p#toggleBtn").text('↓ 展开计数器');
        }
        $("p#toggleBtn").click(function () {
            isHiden = (isHiden + 1) % 2;
            localStorage.setItem('isHiden', isHiden)
            if (isHiden) {
                $('div#calc').slideUp(1000);
                $("p#toggleBtn").text('↓ 展开计数器');
            } else {
                $('div#calc').slideDown(1000);
                $("p#toggleBtn").text('↑ 收起计数器');
            }
        });
        $('#duoren').on('click', function (event) {
           let todayData = JSON.parse(localStorage.getItem(todyDate)) || { win: 0, ping: 0, lose: 0 }
            switch (event.target.id) {
                case 'win':
                    todayData.win = parseInt(todayData.win) + 1;
                    break;
                case 'ping':
                    todayData.ping = parseInt(todayData.ping) + 1;
                    break;
                case 'lose':
                    todayData.lose = parseInt(todayData.lose) + 1;
                    break;
                default: break;
            }
            if ($('#danmu').prop("checked")) {
                $('.ChatSend-txt').eq(0).val(`战绩报告：胜利${todayData.win}、平局${todayData.ping}、失败${todayData.lose}`)
                $('.ChatSend-button').click()
            }
            setData(todayData)
        });
        $('.changeBtn').click(function () {
            $('#customChange').animate({ height: '200px' })
        });
        $('#customChange-clear').click(function(){
            $('#win_input').val(0)
            $('#ping_input').val(0)
            $('#lose_input').val(0)
        })
        $('#customChange-save').click(function(){
            let todayData ={}
            todayData.win = parseInt($('#win_input').val());
            todayData.ping = parseInt($('#ping_input').val());
            todayData.lose = parseInt($('#lose_input').val());
            $('#customChange').animate({ height: '0' })
            setData(todayData)
        })
})();