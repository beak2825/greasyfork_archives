// ==UserScript==
// @name        天使动漫一键评分
// @namespace   https://greasyfork.org/users/4514
// @author      喵拉布丁
// @homepage    https://github.com/miaolapd/TsdmOneKeyRating
// @description 在天使动漫论坛版块页面里，为所选的帖子进行一键评分（可自行修改默认评分设置）
// @include     http://www.tsdm.net/forum.php?mod=forumdisplay*
// @include     http://www.tsdm.me/forum.php?mod=forumdisplay*
// @require     https://code.jquery.com/jquery-3.1.1.min.js
// @version     1.3
// @grant       none
// @run-at      document-end
// @license     MIT
// @include-jquery   true
// @downloadURL https://update.greasyfork.org/scripts/20839/%E5%A4%A9%E4%BD%BF%E5%8A%A8%E6%BC%AB%E4%B8%80%E9%94%AE%E8%AF%84%E5%88%86.user.js
// @updateURL https://update.greasyfork.org/scripts/20839/%E5%A4%A9%E4%BD%BF%E5%8A%A8%E6%BC%AB%E4%B8%80%E9%94%AE%E8%AF%84%E5%88%86.meta.js
// ==/UserScript==
/**
 * 配置项
 */
var Config = {
    // 是否在选择的时候排除已评分的帖子，true：开启；false：关闭
    excludeRatingThreadEnabled: true,
    // 是否在选择的时候排除自己的帖子，true：开启；false：关闭
    excludeMyThreadEnabled: true,
    // 是否在关闭评分结果对话框后自动刷新页面，true：开启；false：关闭
    refreshPageAfterCloseRatingResultDialogEnabled: true,
    // ajax请求的时间间隔（毫秒）
    ajaxInterval: 200,
    // ajax请求的超时时间（毫秒）
    ajaxTimeout: 20000
};

/**
 * 默认评分设置
 * 关键字：可通过jQuery选择的dom对象
 * 值：想要设置的预设值
 * @example
 * var DefValueConfig = {
 *     '[name="score1"]': '+1', // 将威望设为+1
 *     '[name="score2"]': '+2', // 将天使币设为+1
 *     '[name="score3"]': '+3', // 将宣传设为+1
 *     '[name="score4"]': '+4', // 将天然设为+1
 *     '[name="score5"]': '+5', // 将腹黑设为+1
 *     '[name="score6"]': '-1', // 将精灵设为-1
 *     '#reason': '很给力', // 将评分理由设为“很给力”
 *     '#highlight_thread': true, // 高亮帖子
 *     '[name="highlight_color"]': '4', // 将帖子高亮颜色设为深绿色
 *     '#highlight_op_1': true, // 将帖子标题设为粗体
 *     '#highlight_op_2': true, // 将帖子标题设为斜体
 *     '#highlight_op_3': true, // 为帖子标题添加下划线
 *     '[name="sendreasonpm"]': true, // 勾选通知作者的复选框
 * };
 */
var DefValueConfig = {
    '[name="score1"]': '+10',
    '[name="score2"]': '+20',
    '#highlight_thread': true,
    '[name="highlight_color"]': '4',
    '#highlight_op_1': true,
};

jQuery.noConflict();
(function ($) {
    // 用户的formHash
    var formHash = '';
    // 自己的用户名
    var userName = '';
    // window对象
    var w = typeof unsafeWindow !== 'undefined' ? unsafeWindow : window;
    // 高亮颜色可选项
    var highlightColorOptions = {
        '0': '#000',
        '1': '#EE1B2E',
        '2': '#EE5023',
        '3': '#996600',
        '4': '#3C9D40',
        '5': '#2897C5',
        '6': '#2B65B7',
        '7': '#8F2A90',
        '8': '#EC1282'
    };

    /**
     * 添加CSS
     */
    var appendCss = function () {
        $('head').append(
            '<style>' +
            '.pd_rating_btns { margin: 10px 0; padding: 0 5px; }' +
            '.pd_rating_btns input { vertical-align: middle; }' +
            '.pd_mask { position: fixed; width: 100%; height: 100%; left: 0; top: 0; z-index: 400; }' +
            '.pd_msg_text strong { margin-left: 15px; float: none; color: #369; }' +
            '.pd_msg_text strong em { color: #FF6600; float: none; }' +
            '.flb .pd_select_thread_num { margin: 0 3px; color: #F26C4F; float: none; }' +
            '.flb .pd_fail_num { color: #3C9D40; }' +
            '.pd_dialog_main { max-height: 620px; overflow-y: auto; }' +
            '#floatlayout_topicadmin.pd_dialog_main { width: 350px; }' +
            '#pd_rating_result { padding: 10px; width: 770px; }' +
            '#pd_rating_result h4 { color: #369; font-size: 14px; }' +
            '#pd_rating_result ol { list-style-position: inside; list-style-type: decimal-leading-zero; }' +
            '#pd_rating_result li { line-height: 2em; }' +
            '#pd_rating_result a, #pd_rating_result em {' +
            '  display: inline-block; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; vertical-align: top;' +
            '}' +
            '#pd_rating_result a { color: #2B65B7; width: 400px; }' +
            '#pd_rating_result em { margin-left: 5px; max-width: 300px; }' +
            '#pd_rating_result em b { color: #F26C4F; }' +
            '</style>'
        );
    };

    /**
     * 显示提示消息
     * @param {string} msg 提示消息
     * @param {boolean} [canClose=false] 是否可以关闭
     * @returns {jQuery} 消息框的jQuery对象
     */
    var showMsg = function (msg, canClose) {
        if (!$('.pd_mask').length) $('<div class="pd_mask"></div>').appendTo('body');
        var $msg = $(
            '<div id="fwin_dialog" class="fwinmask" style="position: fixed; z-index: 401;">' +
            '  <table class="fwin" cellpadding="0" cellspacing="0">' +
            '    <tbody>' +
            '    <tr>' +
            '      <td class="t_l"></td>' +
            '      <td class="t_c"></td>' +
            '      <td class="t_r"></td>' +
            '    </tr>' +
            '    <tr>' +
            '      <td class="m_l">&nbsp;&nbsp;</td>' +
            '      <td class="m_c">' +
            '        <h3 class="flb">' +
            '          <em class="pd_msg_text"><img style="width: 16px; height: 16px;" src="static/image/common/loading.gif"> {0}</em>'.replace('{0}', msg) +
            '          <span style="display: none"><a href="javascript:;" class="flbc pd_msg_close" title="关闭">关闭</a></span>' +
            '        </h3>' +
            '      </td>' +
            '      <td class="m_r"></td>' +
            '    </tr>' +
            '    <tr>' +
            '      <td class="b_l"></td>' +
            '      <td class="b_c"></td>' +
            '      <td class="b_r"></td>' +
            '    </tr>' +
            '    </tbody>' +
            '  </table>' +
            '</div>'
        ).appendTo('#append_parent');

        if (canClose) {
            $msg.find('.pd_msg_close').click(function () {
                $(this).closest('#fwin_dialog').data('stop', true);
            }).parent().css('display', 'inline');
        }

        $msg.css('top', $(window).height() / 2 - $msg.height() / 2)
            .css('left', $(window).width() / 2 - $msg.width() / 2);

        return $msg;
    };

    /**
     * 隐藏提示消息
     * @param {jQuery} $msg 消息框的jQuery对象
     */
    var hideMsg = function ($msg) {
        $msg.remove();
        $('.pd_mask').remove();
    };

    /**
     * 输出经过格式化后的控制台消息
     * @param {string} type 消息类别
     * @param {string} msg 回应消息
     */
    var showFormatLog = function (type, msg) {
        var result = '';
        if (/succeedhandle_/i.test(msg)) {
            var matches = /succeedhandle_\w+\('[^']*',\s*'([^']*)'/i.exec(msg);
            if (matches) result = $.trim(matches[1]);
        }
        else if (/errorhandle_/i.test(msg)) {
            var matches = /errorhandle_\w+\('([^']*)'/i.exec(msg);
            if (matches) result = $.trim(matches[1]);
        }
        if (!result) result = '未能获得预期的回应';
        console.log('【{0}】回应：{1}'.replace('{0}', type).replace('{1}', result));
    };

    /**
     * 获取经过本地编码后的字符串
     * @param {string} str 待编码的字符串
     * @returns {string} 经过本地编码后的字符串
     */
    var getLocaleEncodeString = function (str) {
        var img = $('<img />').appendTo('body').get(0);
        img.src = 'nothing?sp=' + str;
        var encodeStr = img.src.split('nothing?sp=').pop();
        $(img).remove();
        return encodeStr;
    };

    /**
     * 排除置顶的帖子
     */
    var excludeTopThread = function () {
        $('input[name="moderate[]"]:checked').each(function () {
            var $this = $(this);
            if ($this.parent('td').prev('td').find('a[title*="置顶"]').length > 0) {
                $this.prop('checked', false);
            }
        });
    };

    /**
     * 排除已评分的帖子
     */
    var excludeRatingThread = function () {
        $('input[name="moderate[]"]:checked').each(function () {
            var $this = $(this);
            if ($this.parent('td').next().find('img[title="帖子被加分"]').length > 0) {
                $this.prop('checked', false);
            }
        });
    };

    /**
     * 排除自己的帖子
     */
    var excludeMyThread = function () {
        $('input[name="moderate[]"]:checked').each(function () {
            var $this = $(this);
            if ($this.parent('td').next().next('td').find('cite > a').text() === userName) {
                $this.prop('checked', false);
            }
        });
    };

    /**
     * 添加一键评分相关按钮
     */
    var addRatingBtns = function () {
        $(
            '<div class="pd_rating_btns">' +
            '  <button class="pn" data-action="selectAll"><span>全选</span></button>' +
            '  <button class="pn" data-action="selectInverse"><span>反选</span></button>' +
            '  <button class="pn" data-action="oneKeyRating" style="color: #F00"><span>一键评分</span></button>' +
            '  <label><input id="pd_exclude_rating" type="checkbox"{0} /> 排除已评分的帖子</label>'
                .replace('{0}', Config.excludeRatingThreadEnabled ? ' checked="checked"' : '') +
            '  <label><input id="pd_exclude_my_thread" type="checkbox"{0} /> 排除自己的帖子</label>'
                .replace('{0}', Config.excludeMyThreadEnabled ? ' checked="checked"' : '') +
            '</div>'
        ).insertBefore('#diyfastposttop').on('click', 'button', function (e) {
            e.preventDefault();
            var action = $(this).data('action');
            if (action === 'selectAll') {
                $('input[name="moderate[]"]').prop('checked', true);
                excludeTopThread();
                if ($('#pd_exclude_rating').prop('checked')) excludeRatingThread();
                if ($('#pd_exclude_my_thread').prop('checked')) excludeMyThread();
            }
            else if (action === 'selectInverse') {
                $('input[name="moderate[]"]').each(function () {
                    $(this).prop('checked', !$(this).prop('checked'));
                });
                excludeTopThread();
                if ($('#pd_exclude_rating').prop('checked')) excludeRatingThread();
                if ($('#pd_exclude_my_thread').prop('checked')) excludeMyThread();
            }
            else if (action === 'oneKeyRating') {
                if (!$('input[name="moderate[]"]:checked').length) {
                    alert('请选择要评分的帖子');
                    return;
                }
                showRatingDialog();
            }
        });

        $(document).on('click', 'input[name="moderate[]"]', function () {
            if ($('.pd_select_thread_num').length > 0) {
                $('.pd_select_thread_num').text($('input[name="moderate[]"]:checked').length);
            }
        });
    };

    /**
     * 显示一键评分对话框
     */
    var showRatingDialog = function () {
        if ($('#fwin_rate').length > 0) return;
        $('#mdly').remove();
        w.pd_modeRateData = null;
        var $dialog = $(
            '<div style="position: fixed; z-index: 201;" class="fwinmask" id="fwin_rate">' +
            '  <table class="fwin" cellpadding="0" cellspacing="0">' +
            '    <tbody>' +
            '    <tr>' +
            '      <td class="t_l"></td>' +
            '      <td class="t_c" style="cursor:move" onmousedown="dragMenu($(\'fwin_rate\'), event, 1)" ondblclick="hideWindow(\'rate\')"></td>' +
            '      <td class="t_r"></td>' +
            '    </tr>' +
            '    <tr>' +
            '      <td class="m_l" style="cursor:move" onmousedown="dragMenu($(\'fwin_rate\'), event, 1)" ondblclick="hideWindow(\'rate\')">&nbsp;&nbsp;</td>' +
            '      <td fwin="rate" style="" class="m_c" id="fwin_content_rate">' +
            '        <div fwin="rate" class="tm_c pd_dialog_main" id="floatlayout_topicadmin">' +
            '          <h3 id="fctrl_rate" class="flb">' +
            '            <em fwin="rate" id="return_rate">一键评分 (共选择了<span class="pd_select_thread_num">0</span>个帖子)</em><span><a href="javascript:;" class="flbc" onclick="hideWindow(\'rate\')" title="关闭">关闭</a></span>' +
            '          </h3>' +

            /* 评分form */
            '          <form fwin="rate" id="rateform" method="post" autocomplete="off">' +
            '            <input name="formhash" value="" type="hidden" />' +
            '            <input name="referer" value="" type="hidden" />' +
            '            <input name="handlekey" value="rate" type="hidden" />' +
            '            <div class="c">' +
            '              <table class="dt mbm" cellpadding="0" cellspacing="0">' +
            '                <tbody>' +
            '                <tr>' +
            '                  <th>单位</th>' +
            '                  <th width="65">数值</th>' +
            '                </tr>' +
            '                <tr>' +
            '                  <td> 威望</td>' +
            '                  <td>' +
            '                    <input fwin="rate" name="score1" id="score1" class="px z" value="0" style="width: 25px;" type="text" />' +
            '                    <a href="javascript:;" class="dpbtn" onclick="showselect(this, \'score1\', \'scoreoption1\')">^</a>' +
            '                    <ul fwin="rate" id="scoreoption1" style="display:none">' +
            '                      <li>+100</li>' +
            '                      <li>+89</li>' +
            '                      <li>+78</li>' +
            '                      <li>+67</li>' +
            '                      <li>+56</li>' +
            '                      <li>+45</li>' +
            '                      <li>+34</li>' +
            '                      <li>+23</li>' +
            '                      <li>+12</li>' +
            '                      <li>+1</li>' +
            '                      <li>-10</li>' +
            '                    </ul>' +
            '                  </td>' +
            '                </tr>' +
            '                <tr>' +
            '                  <td> 天使币</td>' +
            '                  <td>' +
            '                    <input fwin="rate" name="score2" id="score2" class="px z" value="0" style="width: 25px;" type="text" />' +
            '                    <a href="javascript:;" class="dpbtn" onclick="showselect(this, \'score2\', \'scoreoption2\')">^</a>' +
            '                    <ul fwin="rate" id="scoreoption2" style="display:none">' +
            '                      <li>+200</li>' +
            '                      <li>+179</li>' +
            '                      <li>+158</li>' +
            '                      <li>+137</li>' +
            '                      <li>+116</li>' +
            '                      <li>+95</li>' +
            '                      <li>+74</li>' +
            '                      <li>+53</li>' +
            '                      <li>+32</li>' +
            '                      <li>+11</li>' +
            '                      <li>-10</li>' +
            '                    </ul>' +
            '                  </td>' +
            '                </tr>' +
            '                <tr>' +
            '                  <td> 宣传</td>' +
            '                  <td>' +
            '                    <input fwin="rate" name="score3" id="score3" class="px z" value="0" style="width: 25px;" type="text" />' +
            '                    <a href="javascript:;" class="dpbtn" onclick="showselect(this, \'score3\', \'scoreoption3\')">^</a>' +
            '                    <ul fwin="rate" id="scoreoption3" style="display:none">' +
            '                      <li>+50</li>' +
            '                      <li>+45</li>' +
            '                      <li>+40</li>' +
            '                      <li>+35</li>' +
            '                      <li>+30</li>' +
            '                      <li>+25</li>' +
            '                      <li>+20</li>' +
            '                      <li>+15</li>' +
            '                      <li>+10</li>' +
            '                      <li>+5</li>' +
            '                    </ul>' +
            '                  </td>' +
            '                </tr>' +
            '                <tr>' +
            '                  <td> 天然</td>' +
            '                  <td>' +
            '                    <input fwin="rate" name="score4" id="score4" class="px z" value="0" style="width: 25px;" type="text" />' +
            '                    <a href="javascript:;" class="dpbtn" onclick="showselect(this, \'score4\', \'scoreoption4\')">^</a>' +
            '                    <ul fwin="rate" id="scoreoption4" style="display:none">' +
            '                      <li>+20</li>' +
            '                      <li>+16</li>' +
            '                      <li>+12</li>' +
            '                      <li>+8</li>' +
            '                      <li>+4</li>' +
            '                      <li>-4</li>' +
            '                      <li>-8</li>' +
            '                      <li>-12</li>' +
            '                    </ul>' +
            '                  </td>' +
            '                </tr>' +
            '                <tr>' +
            '                  <td> 腹黑</td>' +
            '                  <td>' +
            '                    <input fwin="rate" name="score5" id="score5" class="px z" value="0" style="width: 25px;" type="text" />' +
            '                    <a href="javascript:;" class="dpbtn" onclick="showselect(this, \'score5\', \'scoreoption5\')">^</a>' +
            '                    <ul fwin="rate" id="scoreoption5" style="display:none">' +
            '                      <li>+20</li>' +
            '                      <li>+16</li>' +
            '                      <li>+12</li>' +
            '                      <li>+8</li>' +
            '                      <li>+4</li>' +
            '                      <li>-4</li>' +
            '                      <li>-8</li>' +
            '                      <li>-12</li>' +
            '                    </ul>' +
            '                  </td>' +
            '                </tr>' +
            '                <tr>' +
            '                  <td> 精灵</td>' +
            '                  <td>' +
            '                    <input fwin="rate" name="score6" id="score6" class="px z" value="0" style="width: 25px;" type="text" />' +
            '                    <a href="javascript:;" class="dpbtn" onclick="showselect(this, \'score6\', \'scoreoption6\')">^</a>' +
            '                    <ul fwin="rate" id="scoreoption6" style="display:none">' +
            '                      <li>+2</li>' +
            '                      <li>+1</li>' +
            '                    </ul>' +
            '                  </td>' +
            '                </tr>' +
            '                </tbody>' +
            '              </table>' +
            '              <div class="tpclg">' +
            '                <h4>可选评分理由:</h4>' +
            '                <table class="reason_slct" cellpadding="0" cellspacing="0">' +
            '                  <tbody>' +
            '                  <tr>' +
            '                    <td>' +
            '                      <ul fwin="rate" id="reasonselect" class="reasonselect pt">' +
            '                        <li class="">很给力!</li>' +
            '                        <li class="">神马都是浮云</li>' +
            '                        <li>赞一个!</li>' +
            '                        <li>淡定</li>' +
            '                        <li>恶意灌水</li>' +
            '                        <li>违规帖子</li>' +
            '                      </ul>' +
            '                    </td>' +
            '                  </tr>' +
            '                  <tr>' +
            '                    <td><input fwin="rate" id="reason" class="px" type="text" /></td>' +
            '                  </tr>' +
            '                  </tbody>' +
            '                </table>' +
            '              </div>' +
            '            </div>' +
            '          </form>' +

            /* 高亮form */
            '          <form fwin="mods" id="moderateform" method="post" autocomplete="off">' +
            '            <input name="formhash" value="" type="hidden" />' +
            '            <input name="fid" value="" type="hidden" />' +
            '            <input name="redirect" value="" type="hidden" />' +
            '            <input name="handlekey" value="mods" type="hidden" />' +
            '            <div class="c">' +
            '              <ul class="tpcl">' +
            '                <li class="copt" fwin="mods" id="itemcp_highlight">' +
            '                  <table cellpadding="5" cellspacing="0">' +
            '                    <tbody>' +
            '                    <tr>' +
            '                      <td width="15"><input id="highlight_thread" name="operations[]" class="pc" value="highlight" type="checkbox" /></td>' +
            '                      <td class="hasd"><label class="labeltxt" style="color: #444">高亮</label>' +
            '                        <div class="dopt">' +
            '                          <span class="hasd">' +
            '                            <input fwin="mods" id="highlight_color" name="highlight_color" value="" type="hidden" />' +
            '                            <input fwin="mods" id="highlight_style_1" name="highlight_style[1]" value="" type="hidden" />' +
            '                            <input fwin="mods" id="highlight_style_2" name="highlight_style[2]" value="" type="hidden" />' +
            '                            <input fwin="mods" id="highlight_style_3" name="highlight_style[3]" value="" type="hidden" />' +
            '                            <a fwin="mods" href="javascript:;" id="highlight_color_ctrl" onclick="showHighLightColor(\'highlight_color\')" class="pn colorwd"></a>' +
            '                          </span>' +
            '                          <a fwin="mods" href="javascript:;" id="highlight_op_1" data-id="1" class="dopt_b" style="text-indent:0;text-decoration:none;font-weight:700;" title="文字加粗">B</a>' +
            '                          <a fwin="mods" href="javascript:;" id="highlight_op_2" data-id="2" class="dopt_i" style="text-indent:0;text-decoration:none;font-style:italic;" title="文字斜体">I</a>' +
            '                          <a fwin="mods" href="javascript:;" id="highlight_op_3" data-id="3" class="dopt_l" style="text-indent:0;text-decoration:underline;" title="文字加下划线">U</a>' +
            '                        </div>' +
            '                      </td>' +
            '                    </tr>' +
            '                    <tr class="dopt">' +
            '                      <td>&nbsp;</td>' +
            '                      <td>' +
            '                        <p class="hasd">' +
            '                          <label for="expirationhighlight" class="labeltxt" style="color: #444">有效期</label>' +
            '                          <input fwin="mods" name="expirationhighlight" id="expirationhighlight" class="px" autocomplete="off" value="" tabindex="1" type="text" style="width:120px" />' +
            '                          <a href="javascript:;" class="dpbtn" onclick="showselect(this, \'expirationhighlight\')">^</a>' +
            '                        </p>' +
            '                      </td>' +
            '                    </tr>' +
            '                    </tbody>' +
            '                  </table>' +
            '                </li>' +
            '              </ul>' +
            '            </div>' +
            '          </form>' +

            /* 提交按钮 */
            '          <p class="o pns">' +
            '            <label for="sendreasonpm"><input fwin="rate" name="sendreasonpm" id="sendreasonpm" class="pc" type="checkbox" />通知作者</label>' +
            '            <button id="ratesubmit" name="ratesubmit" type="submit" value="true" class="pn pnc"><span>确定</span></button>' +
            '          </p>' +

            '        </div>' +
            '      </td>' +
            '      <td class="m_r" style="cursor:move" onmousedown="dragMenu($(\'fwin_rate\'), event, 1)" ondblclick="hideWindow(\'rate\')"></td></tr>' +
            '    <tr>' +
            '      <td class="b_l"></td>' +
            '      <td class="b_c" style="cursor:move" onmousedown="dragMenu($(\'fwin_rate\'), event, 1)" ondblclick="hideWindow(\'rate\')"></td>' +
            '      <td class="b_r"></td>' +
            '    </tr>' +
            '    </tbody>' +
            '  </table>' +
            '</div>'
        ).appendTo('#append_parent');

        $dialog.end().find('.pd_select_thread_num').text($('input[name="moderate[]"]:checked').length)
            .end().find('input[name="formhash"]').val(formHash)
            .end().find('input[name="fid"]').val($('input[name="srhfid"]').val())
            .end().find('input[name="referer"]').val(location.href)
            .end().find('input[name="redirect"]').val(location.href);

        $dialog.find('#reasonselect').on('mouseover', 'li', function () {
            $(this).addClass('xi2 cur1');
        }).on('mouseout', 'li', function () {
            $(this).removeClass('xi2 cur1');
        }).on('click', 'li', function () {
            $('#reason').val($(this).text());
        }).end().find('#reason').keyup(function (e) {
            if (e.keyCode === 13) $dialog.find('#ratesubmit').click();
        });

        $dialog.on('click', '[id^="highlight_op_"]', function () {
            var $this = $(this);
            var id = $this.data('id');
            if (parseInt($('#highlight_style_' + id).val())) {
                $('#highlight_style_' + id).val(0);
                $this.removeClass('cnt');
            }
            else {
                $('#highlight_style_' + id).val(1);
                $this.addClass('cnt');
            }
        });
        w.showHighLightColor = function (hlid) {
            var showid = hlid + '_ctrl';
            if (!document.getElementById(showid + '_menu')) {
                var str = '';
                var coloroptions = highlightColorOptions;
                var menu = document.createElement('div');
                menu.id = showid + '_menu';
                menu.className = 'cmen';
                menu.style.display = 'none';
                for (var i in coloroptions) {
                    str += '<a href="javascript:;" onclick="document.getElementById(\'' + hlid + '\').value=' + i + ';document.getElementById(\'' + showid + '\').style.backgroundColor=\'' + coloroptions[i] + '\';hideMenu(\'' + menu.id + '\')" style="background:' + coloroptions[i] + ';color:' + coloroptions[i] + ';">' + coloroptions[i] + '</a>';
                }
                menu.innerHTML = str;
                document.getElementById('append_parent').appendChild(menu);
            }
            showMenu({'ctrlid': hlid + '_ctrl', 'evt': 'click', 'showid': showid});
        };
        w.today = new Date();

        $dialog.find('form').submit(function (e) {
            e.preventDefault();
            $dialog.find('#ratesubmit').click();
        }).end().find('#ratesubmit').click(function (e) {
            e.preventDefault();
            if (!$('input[name="moderate[]"]:checked').length) {
                alert('请选择要评分的帖子');
                return;
            }
            batchRating($dialog);
        });

        $.each(DefValueConfig, function (key, value) {
            if (key.indexOf('highlight_color') > -1) {
                $dialog.find(key).val(value)
                    .end().find('#highlight_color_ctrl').css('background-color', highlightColorOptions[value]);
            }
            else if (typeof value === 'boolean') {
                if (value) $dialog.find(key).click();
            }
            else {
                $dialog.find(key).val(value);
            }
        });

        $dialog.css('top', $(window).height() / 2 - $dialog.height() / 2)
            .css('left', $(window).width() / 2 - $dialog.width() / 2);
    };

    /**
     * 批量评分
     * @param {jQuery} $dialog 评分对话框的jQuery对象
     */
    var batchRating = function ($dialog) {
        var tidList = [], pidList = {};
        $('input[name="moderate[]"]:checked').each(function () {
            tidList.push($(this).val());
        });
        var rateData = $dialog.find('#rateform').serialize();
        var modeRateData = $dialog.find('#moderateform').serialize();
        var reason = $.trim($dialog.find('#reason').val());
        if (reason) {
            rateData += '&reason=' + getLocaleEncodeString(reason);
        }
        if ($dialog.find('#sendreasonpm').prop('checked')) {
            rateData += '&sendreasonpm=on';
        }
        modeRateData += '&moderate%5B%5D={0}'.replace('{0}', tidList[0]);
        if ($dialog.find('input[name="operations[]"][value="highlight"]').prop('checked')) {
            w.pd_modeRateData = modeRateData;
        }

        $dialog.remove();
        var $msg = showMsg('正在获取各帖子的pid，请稍后...<strong>剩余数量：<em id="pd_count">{0}</em></strong>'.replace('{0}', tidList.length), true);
        var count = 0;
        var itvFuncList = [];
        $.each(tidList, function (index, tid) {
            var itvFunc = window.setTimeout(function () {
                $.ajax({
                    type: 'GET',
                    url: 'forum.php?mod=viewthread&tid=' + tid,
                    timeout: Config.ajaxTimeout,
                    success: function (html) {
                        var matches = /<table id="pid(\d+)"/.exec(html);
                        if (matches) pidList[tid] = parseInt(matches[1]);
                    },
                    error: function () {
                        //pidList[tid] = 0;
                    },
                    complete: function () {
                        count++;
                        var $count = $('#pd_count');
                        $count.text(tidList.length - count);
                        var isStop = $count.closest('#fwin_dialog').data('stop');

                        if (isStop) {
                            hideMsg($msg);
                            $.each(itvFuncList, function (i, itvFunc) {
                                if (itvFunc) window.clearTimeout(itvFunc);
                            });
                        }
                        else if (count >= tidList.length) {
                            hideMsg($msg);
                            rating(tidList, pidList, rateData);
                        }
                    }
                });
            }, index * Config.ajaxInterval);
            itvFuncList.push(itvFunc);
        });
    };

    /**
     * 评分
     * @param {number[]} tidList 帖子ID列表
     * @param {{}} pidList 帖子顶楼的pid列表
     * @param {string} rateData 提交评分的数据
     */
    var rating = function (tidList, pidList, rateData) {
        var $msg = showMsg('正在进行评分，请稍后...<strong>剩余数量：<em id="pd_count">{0}</em></strong>'.replace('{0}', tidList.length));
        var successNum = 0, failNum = 0;
        var failList = [];
        $.each(tidList, function (index, tid) {
            window.setTimeout(function () {
                var pid = pidList[tid] ? pidList[tid] : 0;
                $.ajax({
                    type: 'POST',
                    url: 'forum.php?mod=misc&action=rate&ratesubmit=yes&infloat=yes&inajax=1',
                    data: rateData + '&tid={0}&pid={1}'.replace('{0}', tid).replace('{1}', pid),
                    timeout: Config.ajaxTimeout,
                    success: function (xml) {
                        var msg = xml.documentElement ? xml.documentElement.textContent : '';
                        showFormatLog('评分', msg);
                        if (/succeedhandle_rate\(/i.test(msg)) {
                            successNum++;
                        }
                        else if (/errorhandle_rate\(/i.test(msg)) {
                            failNum++;
                            var matches = /errorhandle_rate\('([^']*)'/i.exec(msg);
                            failList.push({tid: tid, pid: pid, failMsg: matches ? matches[1] : '未知的回应'});
                        }
                        else {
                            failNum++;
                            failList.push({tid: tid, pid: pid, failMsg: '未知的回应'});
                        }
                    },
                    error: function () {
                        failNum++;
                        failList.push({tid: tid, pid: pid, failMsg: '连接超时'});
                    },
                    complete: function () {
                        $('#pd_count').text(tidList.length - successNum - failNum);

                        if (successNum + failNum >= tidList.length) {
                            hideMsg($msg);
                            showRatingResultDialog(successNum, failNum, failList);
                            if (w.pd_modeRateData) highlightThread(tidList, w.pd_modeRateData);
                        }
                    }
                });
            }, index * Config.ajaxInterval);
        });
    };

    /**
     * 显示一键评分结果的对话框
     * @param {number} successNum 评分成功数量
     * @param {number} failNum 评分失败数量
     * @param {[]} failList 评分失败列表
     */
    var showRatingResultDialog = function (successNum, failNum, failList) {
        var $dialog = $(
            '<div style="position: fixed; z-index: 201;" class="fwinmask" id="fwin_rate">' +
            '  <table class="fwin" cellpadding="0" cellspacing="0">' +
            '    <tbody>' +
            '    <tr>' +
            '      <td class="t_l"></td>' +
            '      <td class="t_c" style="cursor:move" onmousedown="dragMenu($(\'fwin_rate\'), event, 1)"></td>' +
            '      <td class="t_r"></td>' +
            '    </tr>' +
            '    <tr>' +
            '      <td class="m_l" style="cursor:move" onmousedown="dragMenu($(\'fwin_rate\'), event, 1)">&nbsp;&nbsp;</td>' +
            '      <td fwin="rate" style="" class="m_c" id="fwin_content_rate">' +
            '        <div fwin="rate" class="tm_c" id="floatlayout_topicadmin">' +
            '          <h3 id="fctrl_rate" class="flb">' +
            ('            <em fwin="rate" id="return_rate" style="{0}">评分结果 (共有<span class="pd_select_thread_num">{1}</span>个帖子评分成功，' +
            '共有<span class="pd_select_thread_num pd_fail_num">{2}</span>个帖子评分失败<i style="font-style: normal;" id="pd_highlight_thread_result"></i>)</em>')
                .replace('{0}', w.pd_modeRateData ? 'min-width:540px' : '')
                .replace('{1}', successNum)
                .replace('{2}', failNum) +
            '            <span><a href="javascript:;" class="flbc" title="关闭">关闭</a></span>' +
            '          </h3>' +
            '          <div class="pd_dialog_main" id="pd_rating_result" style="display: none;"></div>' +
            '        </div>' +
            '      </td>' +
            '      <td class="m_r" style="cursor:move" onmousedown="dragMenu($(\'fwin_rate\'), event, 1)"></td></tr>' +
            '    <tr>' +
            '      <td class="b_l"></td>' +
            '      <td class="b_c" style="cursor:move" onmousedown="dragMenu($(\'fwin_rate\'), event, 1)"></td>' +
            '      <td class="b_r"></td>' +
            '    </tr>' +
            '    </tbody>' +
            '  </table>' +
            '</div>'
        ).appendTo('#append_parent');

        var result = '';
        $.each(failList, function (index, obj) {
            var $node = $('input[name="moderate[]"][value="{0}"]'.replace('{0}', obj.tid));
            if (!$node.length) return;
            var $link = $node.parent('td').next().find('span > a.xst');
            if (!$link.length) return;
            result += '<li><a target="_blank" href="{0}" title="《{1}》by：{2}">{1}</a> <em title="失败原因：{3}"><b>失败原因：</b>{3}</em></li>'
                .replace('{0}', $link.attr('href'))
                .replace(/\{1\}/g, $link.text())
                .replace('{2}', $node.parent('td').next().next('td').find('cite > a').text())
                .replace(/\{3\}/g, obj.failMsg);
        });
        if (result) {
            $dialog.find('#pd_rating_result').html('<h4>评分失败项目：</h4><ol>' + result + '</ol>').css('display', 'block');
        }

        $dialog.find('.flbc').click(function () {
            $dialog.remove();
            if (Config.refreshPageAfterCloseRatingResultDialogEnabled) location.reload();
        });

        $dialog.css('top', $(window).height() / 2 - $dialog.height() / 2)
            .css('left', $(window).width() / 2 - $dialog.width() / 2);
    };

    /**
     * 高亮帖子
     * @param {number[]} tidList 帖子ID列表
     * @param {string} modeRateData 提交高亮帖子的数据
     */
    var highlightThread = function (tidList, modeRateData) {
        var $msg = showMsg('正在高亮帖子，请稍后...');
        $.each(tidList, function (i, tid) {
            modeRateData += '&moderate%5B%5D=' + tid;
        });
        var isSuccess = false;
        var failReason = '';
        $.ajax({
            type: 'POST',
            url: 'forum.php?mod=topicadmin&action=moderate&optgroup=1&modsubmit=yes&infloat=yes&inajax=1',
            data: modeRateData,
            timeout: Config.ajaxTimeout,
            success: function (xml) {
                var msg = xml.documentElement ? xml.documentElement.textContent : '';
                showFormatLog('高亮帖子', msg);
                if (/succeedhandle_mods\(/i.test(msg)) {
                    isSuccess = true;
                }
                else if (/errorhandle_mods\(/i.test(msg)) {
                    var matches = /errorhandle_mods\('([^']*)'/i.exec(msg);
                    failReason = matches ? matches[1] : '未知的回应';
                }
                else {
                    failReason = '未知的回应';
                }
            },
            error: function () {
                failReason = '连接超时';
            },
            complete: function () {
                hideMsg($msg);
                if (isSuccess) {
                    $('#pd_highlight_thread_result').html('，共有<span class="pd_select_thread_num">{0}</span>个帖子高亮成功'.replace('{0}', tidList.length));
                }
                else {
                    $('#pd_highlight_thread_result')
                        .html('，共有<span class="pd_select_thread_num pd_fail_num">{0}</span>个帖子高亮失败'.replace('{0}', tidList.length))
                        .attr('title', '原因：' + failReason)
                        .css('cursor', 'help');
                }
            }
        });
        w.pd_modeRateData = null;
    };

    /**
     * 初始化
     */
    var init = function () {
        if (!$('input[name="moderate[]"]').length) return;

        var hashMatches = /formhash=(\w+)/i.exec($('#toptb a[href*="formhash="]').attr('href'));
        if (hashMatches) formHash = hashMatches[1];
        else return;

        userName = $('#toptb a[href*="home.php?mod=space&uid="]').text();
        if (!userName) return;

        appendCss();
        addRatingBtns();
        console.log('【天使动漫一键评分】加载完毕');
    };

    init();
}(jQuery));