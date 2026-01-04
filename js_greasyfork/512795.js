// ==UserScript==
// @name         Predecision Label
// @namespace    http://baidu.com/
// @version      1.1.0
// @description  Decision label. Try to take over the world!
// @author       You
// @match        http://ov.baidu-int.com/*
// @match        http://yf.baidu-int.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=baidu-int.com
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/512795/Predecision%20Label.user.js
// @updateURL https://update.greasyfork.org/scripts/512795/Predecision%20Label.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let label_list = [];
    let cur_label = {};
    let ads_id = -1;
    let start_pre_seq = -1;
    let end_pre_seq = -1;
    let cur_pre_seq = -1;
    let cur_obs_id = -1
    let is_label_panel_show = false;
    let old_info;
    var initialMouseX, initialMouseY, initialElementX, initialElementY;

    function set_cur_info() {
        var _ads_id = parseInt($("section").children('p').children('span')[1].textContent);
        var _cur_pre_seq = parseInt($(".seq-wrap").text().replace('PlanSeq:', ""));
        var _cur_obs_id = parseInt($(".viz-detail-text")[0].textContent.replace("id: ", "").trim());
        if (window.location.host == 'yf.baidu-int.com') {
            _ads_id = getUrlParam("ads_id");
            if (_ads_id != null) {
                _ads_id = parseInt(_ads_id);
            } else {
                _ads_id = -1;
            }
            var s = $('#dreamview-container > div > div > div.pannel.react-draggable > div.context > div.dashboard.inner-box.scrollHeightL > table > tbody > tr:nth-child(3) > td:nth-child(2) > p:nth-child(3) > span')[0];
            _cur_pre_seq = parseInt(s.textContent.replace('PRE:', ""));
        }
        ads_id = isNaN(_ads_id)? ads_id: _ads_id;
        cur_pre_seq = isNaN(_cur_pre_seq)? cur_pre_seq: _cur_pre_seq;
        cur_obs_id = isNaN(_cur_obs_id)? cur_obs_id: _cur_obs_id;
        $('#ads_id').text(ads_id);
        $('#seq_num').text(cur_pre_seq);
        $('#obs_id').text(cur_obs_id);
        cur_label.ads_id = ads_id;
        console.log(ads_id);
        console.log(cur_pre_seq);
        console.log(cur_obs_id);
    }

    function getUrlParam(name)
    {
        var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
        var value = window.location.search.substr(1).match(reg);
        if (value != null) return unescape(value[2]); return null;
    }

    function setStartSeq() {
        set_cur_info();
        cur_label.start_seq = cur_pre_seq;
        console.log("set start seq", cur_label.start_seq);
    }
    function setEndSeq() {
        set_cur_info();
        cur_label.end_seq = cur_pre_seq;
        console.log("set end seq", cur_label.end_seq);
    }

    function addLabelToShow(label) {
        if (label == undefined) {
            return;
        }
        var str = "upload_times(" + label.ads_id + ',' + label.obs_id + ',' + label.start_seq + ',' + label.end_seq + ',' + label.dec_label + ')\n';
        $('#decision_label_show_list').append(str);
        console.log("add show string", str);
    }

    function onLabel(dec_label){
        $('#label_btn_' + dec_label.toString()).click(function() {
            // 添加类以实现按钮变亮效果
            $('#label_btn_' + dec_label.toString()).addClass('clicked');

            // 在 300 毫秒后移除类以恢复按钮原始状态
            setTimeout(function() {
                $('#label_btn_' + dec_label.toString()).removeClass('clicked');
            }, 300);
        });
        if (isNaN(ads_id) || isNaN(cur_obs_id) || isNaN(cur_label.start_seq) || isNaN(cur_label.end_seq) || isNaN(dec_label)) {
            return;
        }
        cur_label.ads_id = ads_id;
        cur_label.obs_id = cur_obs_id;
        cur_label.dec_label = dec_label;
        console.log('add decision label to list', cur_label);
        label_list.push(cur_label);
        addLabelToShow(cur_label);
        cur_label = {};
    }

    function showDecisionLabelPanel() {
        $("#decision_label_panel").css('z-index', -1 * $("#decision_label_panel").css('z-index'));
        console.log("move decision label panel to z index ", $("#decision_label_panel").css('z-index'));
    }
    // Your code here...
    var label_tab = `
        <button type="button" onclick="showDecisionLabelPanel()" class="ant-btn ant-btn-default ant-btn-sm" style="margin-right: 10px;">
            <div class="ant-space ant-space-horizontal ant-space-align-center" style="gap: 8px;">
                <div class="ant-space-item">
                    决策标注
                </div>
            </div>
        </button>
        `;

    var label_panel_html =`
<div class="container-fluid" id="decision_label_panel" style="position: absolute; top: 55%; left: 74%;width: 23%;height:30%;background-color: #292f42;z-index: -9999;">
    <div class="col-md-2 column" style="float: center;">
        </div>
<div class="row clearfix">
    <div class="col-md-2 column" style="float: center;">
        <div class="row clearfix">
            <label>
            ads_id:
                </label>
<label id='ads_id'>
    -1
</label>
<label>
    obs_id:
        </label>
<label id='obs_id'>
    -1
</label>
<label>
    seq_num:
        </label>
<label id='seq_num'>
    -1
</label>
</div>
</div>
<div class="col-md-2 column">
    <div class="row clearfix" style="float: center;">
        <button style="width:45%;margin-left: 3%;background-color: red;transition: background-color 0.3s ease;" onclick="setStartSeq()">
            seq_start
</button>
<button style="width:45%;margin-left: 2%;background-color: green;" onclick="setEndSeq()">
    seq_end
</button>
</div>
<br>
    <div class="btn-group" style="margin-left: 2%">
<button style="background-color: #8C0044;margin-left: 5px;margin-top: 5px;" id="label_btn_5" type="button" value="5" onclick="onLabel(5)">
    Yield
</button>
<button style="background-color: #886600;margin-left: 5px;margin-top: 5px;" id="label_btn_2" type="button" value="2" onclick="onLabel(2)">
    Overtake
</button>
</div>
<br>
    <div>
    <textarea id="decision_label_show_list" placeholder="" rows="6" style="width:100%;background-color: #292f42;padding: 10px;max-width: 100%;max-height: 100%;line-height: 1.5;border-radius: 5px;border: 1px solid #ccc;"></textarea>
<button style="background-color: #808000;margin-top: 5px;width:100%" type="button" onclick="clearLabel()">
    Clear
</button>
</div>
</div>
</div>
</div>
</div>

`;
    function clearLabel() {
        $('#decision_label_show_list').val('');
        label_list = [];
    }


      function onMouseMove(event) {
        // 计算鼠标偏移量
        var offsetX = event.clientX - initialMouseX;
        var offsetY = event.clientY - initialMouseY;

        // 将偏移量应用于元素的位置
        $('#decision_label_panel').css({
          left: initialElementX + offsetX + 'px',
          top: initialElementY + offsetY + 'px'
        });
      }

      // 鼠标释放事件处理程序
      function onMouseUp() {
        // 移除事件监听器
        $(document).off('mousemove', onMouseMove);
        $(document).off('mouseup', onMouseUp);
      }

    window.onMouseMove = onMouseMove;
    window.onMouseUp = onMouseUp
    window.set_cur_info = set_cur_info;
    window.showDecisionLabelPanel = showDecisionLabelPanel;
    window.setStartSeq = setStartSeq;
    window.setEndSeq = setEndSeq;
    window.onLabel = onLabel;
    window.clearLabel = clearLabel;

    setTimeout(function() {
        console.log("3s time out");
        $(".ov-header-operations").prepend(label_tab);
        $("body").append(label_panel_html);
        $('#decision_label_panel').mousedown(function(event) {
            var elementTop = $('#decision_label_panel').offset().top;
            var mouseY = event.clientY;
            console.log('elementTop', elementTop, 'mouseY', mouseY);
            if (mouseY > elementTop + 10) {
                return; // 如果不在顶部，则忽略拖动
            }
            // 记录鼠标位置和元素初始位置
            initialMouseX = event.clientX;
            initialMouseY = event.clientY;
            initialElementX = $('#decision_label_panel').offset().left;
            initialElementY = $('#decision_label_panel').offset().top;
            console.log("initialMouseX", initialMouseX);

            // 添加事件监听器
            $(document).mousemove(onMouseMove);
            $(document).mouseup(onMouseUp);
        });
    }, 3000); // 等待3秒

})();