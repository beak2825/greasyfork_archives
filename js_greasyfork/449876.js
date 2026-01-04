// ==UserScript==
// @name         出入平安
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  出入平安，滚蛋吧疫情!
// @author       You
// @match        https://serv.tju.edu.cn/verifyqr/access?code=Yk0yVGRBMTEwTzRUZmtiemRYZXo2RjRBZFEyRGZFOTIxTmFUM1VlMzNOOXo3VTYzNk1jVDhjYT02N2Rh
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tju.edu.cn
// @grant        none
// @license      GPL-3.0-or-later
// @downloadURL https://update.greasyfork.org/scripts/449876/%E5%87%BA%E5%85%A5%E5%B9%B3%E5%AE%89.user.js
// @updateURL https://update.greasyfork.org/scripts/449876/%E5%87%BA%E5%85%A5%E5%B9%B3%E5%AE%89.meta.js
// ==/UserScript==

/**
 * ---------------------------
 * Time: 2017/11/20 19:28.
 * Author: Cangshi
 * 声明：本插件只是为了学习油猴脚本和复习HTML、CSS和javascript内容，所产生一切后果与本人无关。
 * View: http://palerock.cn
 * ---------------------------
 */

(function() {
    'use strict';
    let iconVipPosition = 'left'
    let iconVipTop = 460
    let iconVipWidth = 40

    let choose_btn =  '<div id="zhmIcon">'
        choose_btn +=     '<div href="javascript:void(0)" target="_blank" style="" class="_th-container zhm_play_vidoe_icon" id="zhmlogo">'
        choose_btn +=         '<div class="_th-click-hover _item-input"></div>'
        choose_btn +=         '<div class="playLineDiv zhm_play_video_wrap" style="display: none;">'
        choose_btn +=         '<div class="zhm_play_video_line">'
        choose_btn +=             '<div>'
        choose_btn +=                 '<ul class="zhm_play_vide_line_ul">'
        choose_btn +=                     '<li class="playLineTd zhm_play_video_line_ul_li " state="0" >西门入校</li>'
        choose_btn +=                     '<li class="playLineTd zhm_play_video_line_ul_li " state="1" >西门出校</li>'
        choose_btn +=                     '<li class="playLineTd zhm_play_video_line_ul_li " state="2" >东门入校</li>'
        choose_btn +=                     '<li class="playLineTd zhm_play_video_line_ul_li " state="3" >东门出校</li>'
        choose_btn +=                 '</ul>'
        choose_btn +=             '</div>'
        choose_btn +=         '</div>'
        choose_btn +=         '</div>'
        choose_btn +=     '</div>'
        choose_btn += '</div>'
            //css

    let line = [
        {"first": "您已进入", "second": "西门，欢迎！"},
        {"first": "您已离开", "second": "西门，再见！"},
        {"first": "您已进入", "second": "东门，欢迎！"},
        {"first": "您已离开", "second": "东门，再见！"}
        ]
        let playVideoStyle = `
            .zhm_play_vidoe_icon{
                padding-top:2px;cursor:pointer;
                z-index:9999999;
                display:block;
                position:fixed;${iconVipPosition}:0px;top:${iconVipTop}px;text-align:center;overflow:visible
            }
            .zhm_play_video_wrap{
                position:fixed;${iconVipPosition}:${iconVipWidth}px;top:${iconVipTop}px;
                z-index:9999999;
                overflow: hidden;
                width:300px;
            }
            .zhm_play_video_line{
                width:320px;
                height:316px;
                overflow-y:scroll;
                overflow-x:hidden;
            }
            .zhm_play_vide_line_ul{
                width:300px;
                display: flex;
                justify-content: flex-start;
                flex-flow: row wrap;
                list-style: none;
                padding:0px;
                margin:0px;

            }
            .zhm_play_video_line_ul_li{
                padding:4px 0px;
                margin:2px;
                width:30%;
                color:#FFF;
                text-align:center;
                background-color:#f24443;
                box-shadow:0px 0px 10px #fff;
                font-size:14px;
            }
            .zhm_play_video_line_ul_li:hover{
                color:#260033;
                background-color:#fcc0c0
            }
            .zhm_line_selected{
                color:#260033;
                background-color:#fcc0c0
            }

            .zhm_play_video_jx{
                width:100%;
                height:100%;
                z-index:999999;
                position: absolute;top:0px;padding:0px;
            }

            ._th-click-hover,._th_times{
                width:300px;
                height:300px;
                border-radius:50%;
                background-color:rgba(127,255,212,0.51);
                text-align:center;
                line-height:300px;
                position:absolute;
                top:50%;
                right:50%;
                margin-top:-150px;
                margin-right:-150px
             }

             ._item-xx-2{
                width:32px;
                height:32px;
                line-height:32px;
                margin-left:14px
             }
             ._item-x2{margin-left:18px;width:40px;height:40px;line-height:40px}
             ._item-x-2{margin-left:17px;width:38px;height:38px;line-height:38px}
             ._item-xx2{width:36px;height:36px;margin-left:16px;line-height:36px}
             ._th-click-hover{
             box-shadow:red 8px 5px 12px;
             position:relative;
             -webkit-transition:all .5s;
             -o-transition:all .5s;
             transition:all .5s;
             height:45px;width:45px;
             cursor:pointer;opacity:.3;
             border-radius:100%;
             background-color:#f00;
             text-align:center;
             line-height:45px;right:0}
             ._th-click-hover:hover{opacity:.8;background-color:#5fb492;color:aliceblue}
             ._th-container:hover{left:-5px}
             ._th-container{font-size:12px;-webkit-transition:all .5s;-o-transition:all .5s;transition:all .5s;left:-35px;top:68%;position:fixed;-webkit-box-sizing:border-box;box-sizing:border-box;z-index:100000;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}
        `;
        /*--create style--*/
    var domHead = document.getElementsByTagName('head')[0];

    var domStyle = document.createElement('style');

    domStyle.type = 'text/css';

    domStyle.rel = 'stylesheet';

    function change(first, second) {
        var jq = document.createElement('script');
        jq.src = "https://cdn.staticfile.org/jquery/3.4.1/jquery.min.js";
        document.getElementById('qrContent').childNodes[0].textContent = first
        // document.getElementById('qrContent').childNodes[1].textContent  卫津路校区
        document.getElementById('qrContent').childNodes[2].textContent = second
    }
    /*createElement(dom,domId){

            var rootElement = document.body;

            var newElement = document.createElement(dom);

            newElement.id = domId;

            var newElementHtmlContent = document.createTextNode('');

            rootElement.appendChild(newElement);

            newElement.appendChild(newElementHtmlContent);

        }*/

    // Your code here...
    $(document).ready(function () {
        if (window.location.href.startsWith('https://serv.tju.edu.cn')) {
            //创建logo_icon
            //playVideoClass.createElement('div','zhmIcon');
            var rootElement = document.body;
            var newElement = document.createElement('div');
            newElement.id = 'goog';
            var newElementHtmlContent = document.createTextNode('');
            rootElement.appendChild(newElement);
            newElement.appendChild(newElementHtmlContent);

            let goog = document.getElementById('goog');
// 样式加载
            domStyle .appendChild(document.createTextNode(playVideoStyle));
            domHead.appendChild(domStyle);

            goog.innerHTML = choose_btn;

            // 显示栏目
            let playLineDiv = document.querySelector('.zhm_play_video_wrap');

            document.querySelector('#zhmlogo').addEventListener('click',function(){
                let playShow = playLineDiv.style.display;
                playShow == 'none'? playLineDiv.style.display = 'block':playLineDiv.style.display = 'none';

            })
            // 点击
            var playLineTd = document.querySelectorAll('.playLineTd');
            playLineTd.forEach(function(item){

                item.addEventListener('click',function(){

                    playLineTd.forEach(function(e){

                        e.setAttribute('class','playLineTd zhm_play_video_line_ul_li');
                    })
                    this.setAttribute('class','playLineTd zhm_play_video_line_ul_li zhm_line_selected');
                    let d = line[parseInt(this.getAttribute('state'))]
                    change(d.first, d.second)
                })
             })



            
        } else if (window.location.href.startsWith(SF_URL)) {
            copyToSegmentFault()
        } else if (window.location.href.startsWith(CSDN_URL)) {
            copyToCsdn()
        }
    })
})();