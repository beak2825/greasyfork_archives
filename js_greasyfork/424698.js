// ==UserScript==
// @name         原神Wiki地图工具助手
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  隐藏地图中已经标记的点
// @author       You
// @match        https://wiki.biligame.com/ys/%E5%8E%9F%E7%A5%9E%E5%9C%B0%E5%9B%BE%E5%B7%A5%E5%85%B7*
// @grant        none
// @require      https://cdn.staticfile.org/jquery/3.3.0/jquery.min.js
// @require      https://cdn.staticfile.org/jquery-cookie/1.4.1/jquery.cookie.min.js
// @downloadURL https://update.greasyfork.org/scripts/424698/%E5%8E%9F%E7%A5%9EWiki%E5%9C%B0%E5%9B%BE%E5%B7%A5%E5%85%B7%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/424698/%E5%8E%9F%E7%A5%9EWiki%E5%9C%B0%E5%9B%BE%E5%B7%A5%E5%85%B7%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

function run() {

    // “设置界面”是否已经显示
    var g_is_setting_shown = false;
    // 需要隐藏的选项
    var g_marked_hidden_categories = new Set();
    // info，error自动清除 定时器ID
    var g_info_timer = -1;
    var g_error_timer = -1;

    function isEmpty(e) {
        return e==null || e.length==0;
    }

    function init() {
        // 从cookie读取配置
        var cookie_YsHelper_markedHiddenCategories = $.cookie('YsHelper_markedHiddenCategories');
        if (!isEmpty(cookie_YsHelper_markedHiddenCategories)) {
            g_marked_hidden_categories = new Set(cookie_YsHelper_markedHiddenCategories.split(','));
        }
        // 添加按钮
        const export_icon = '<svg t="1617886898612" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="9744" width="20" height="20"><path d="M810.666667 938.666667H213.333333a128 128 0 0 1-128-128V213.333333a128 128 0 0 1 128-128h469.333334a42.666667 42.666667 0 0 1 30.293333 12.373334l213.333333 213.333333A42.666667 42.666667 0 0 1 938.666667 341.333333v469.333334a128 128 0 0 1-128 128zM213.333333 170.666667a42.666667 42.666667 0 0 0-42.666666 42.666666v597.333334a42.666667 42.666667 0 0 0 42.666666 42.666666h597.333334a42.666667 42.666667 0 0 0 42.666666-42.666666V358.826667L665.173333 170.666667z" p-id="9745" fill="#1296db"></path><path d="M725.333333 938.666667a42.666667 42.666667 0 0 1-42.666666-42.666667v-298.666667H341.333333v298.666667a42.666667 42.666667 0 0 1-85.333333 0v-341.333333a42.666667 42.666667 0 0 1 42.666667-42.666667h426.666666a42.666667 42.666667 0 0 1 42.666667 42.666667v341.333333a42.666667 42.666667 0 0 1-42.666667 42.666667zM640 384H298.666667a42.666667 42.666667 0 0 1-42.666667-42.666667V128a42.666667 42.666667 0 0 1 85.333333 0v170.666667h298.666667a42.666667 42.666667 0 0 1 0 85.333333z" p-id="9746" fill="#1296db"></path></svg>';
        const import_icon = '<svg t="1617887010389" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="12733" width="20" height="20"><path d="M927.68 384a32.16 32.16 0 0 1 32.064 35.968l-52.992 419.968A64.416 64.416 0 0 1 842.624 896H181.376a64.416 64.416 0 0 1-64.128-56.064L64.256 419.968a32.064 32.064 0 0 1 28.032-35.712l2.016-0.192L927.68 384z m-36.576 64H132.896l48.48 384h661.248l48.48-384zM342.944 128c24.512 0 46.88 13.728 57.824 35.424L447.36 256h387.68a64.32 64.32 0 0 1 64.608 64v64h-64.64v-64H407.456l-64.48-128H188.928v192H124.32V192c0-35.36 28.928-64 64.64-64h153.984z" fill="#1296db" p-id="12734"></path></svg>';
        const setting_icon = '<svg t="1617461830172" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2080" width="20" height="20"><path d="M979.52953384 636.2602336l-73.41605545-62.76490615a402.86174806 402.86174806 0 0 0 5.27122536-64.78041321c0-21.74102172-1.79549069-43.4899012-5.27122536-64.78434205l73.41605545-62.76359654c11.31774649-9.63619288 15.46531688-25.32676461 10.41934635-39.45233899l-1.0070987-2.91128796c-20.28603257-56.59659025-50.3208854-108.60295816-89.3227147-154.55625685l-2.01943593-2.3533893a36.0027967 36.0027967 0 0 0-39.34364041-10.64853006l-91.11689576 32.39217105c-33.6245246-27.57014574-71.1713647-49.31509633-111.73819131-64.55384874l-17.59999947-95.26708539c-2.68734273-14.68347303-14.23427293-26.11515656-28.91643635-28.80773777l-3.02784423-0.55789865c-58.39339055-10.53459303-119.80938685-10.53459303-178.20277744 0l-3.02522498 0.55789865c-14.68478263 2.69258121-26.22647437 14.12426477-28.91905557 28.80773777l-17.70607878 95.71497583c-40.23680208 15.24137165-77.56100659 36.8671467-110.96027633 64.3299035l-91.79004107-32.61611625c-14.01032771-4.93072386-29.70220907-0.78184385-39.33709233 10.64853006l-2.02074551 2.3533893c-39.00444854 46.06199724-69.04192062 98.06836515-89.32402433 154.55625685l-1.00971794 2.91128796c-5.04204166 14.00901808-0.89970978 29.70613794 10.42327521 39.45233899l74.3065979 63.43805146c-3.47442509 21.06918605-5.15728833 42.58626253-5.15728836 63.99464047 0 21.52100535 1.68286324 43.03808184 5.15728836 63.99725971l-74.3065979 63.43674185c-11.32298499 9.6388121-15.46531688 25.32807424-10.42327521 39.45102934l1.00971794 2.91521685c20.2821037 56.48789171 50.31957578 108.60295816 89.32402433 154.55625681l2.02074551 2.35338931a35.99755824 35.99755824 0 0 0 39.33709233 10.6498397l91.79004107-32.61742587c33.39796012 27.46144715 70.72216464 49.20377851 110.96027633 64.33645159l17.70607878 95.71497585c2.69258121 14.68347303 14.23427293 26.11384697 28.91905557 28.80118965l3.02522498 0.55920826a503.64102911 503.64102911 0 0 0 89.10269835 7.96249697c29.92615429 0 59.96362637-2.69389082 89.10007909-7.96249697l3.02784423-0.55920826c14.68216338-2.68734273 26.22909363-14.11771667 28.91643635-28.80118965l17.59999947-95.26577577c40.56813625-15.24922938 78.11366675-36.87369481 111.73819131-64.56039683l91.11689576 32.39217103c14.01032771 4.93072386 29.70613794 0.78184385 39.34364041-10.6498397l2.01943593-2.35338931c39.00182927-46.06330684 69.03668213-98.06836515 89.3227147-154.55625681l1.0070987-2.91521685c5.04597053-13.78114399 0.89840015-29.47171573-10.41934635-39.22446488zM826.54482245 457.16036566a317.23478443 317.23478443 0 0 1 4.25626895 51.66717602c0 17.37736386-1.45498917 34.74425073-4.25626895 51.66455675l-7.39935983 44.94619999 83.72015514 71.62056478c-12.66272751 29.25038974-28.68856225 56.82446435-47.74355085 82.48780158l-104.00487809-36.87369479-35.19476044 28.91774594c-26.78830188 21.96496695-56.60444798 39.22708414-88.87875309 51.33191299l-42.70281882 16.02321549-20.06208734 108.71820486c-31.49508051 3.58443326-63.6567582 3.58443326-95.268395 0l-20.05946809-108.94215007-42.36493656-16.24847036c-31.94297095-12.10613848-61.64125116-29.36563641-88.2056078-51.2219048l-35.18821234-29.02775415-104.6858811 37.20764823c-19.05105975-25.66595651-34.96950557-53.34611039-47.74224124-82.48518237l84.61593606-72.28847159-7.28280356-44.82964368c-2.69258121-16.70421855-4.14757038-33.96502609-4.14757037-50.99926918 0-17.14687051 1.34498098-34.29897953 4.14757037-50.99534035l7.28280356-44.82964367-84.61593606-72.29240047c12.6640371-29.25038974 28.6911815-56.8218451 47.74224124-82.4878016l104.6858811 37.20764821 35.18821234-29.02775413c26.56435663-21.85626838 56.26263684-39.11707594 88.2056078-51.2166663l42.48018322-16.03107325 20.05946812-108.94084045c31.49639013-3.58574288 63.65806782-3.58574288 95.26708534 0l20.06339698 108.71820485 42.70150918 16.02976361c32.16167768 12.09959037 62.09176084 29.36039792 88.87351461 51.32536488l35.19476042 28.91905557 104.00618773-36.87369481c19.05629825 25.66595651 34.97081521 53.35265851 47.74878935 82.49304007l-83.72670325 71.6140167 7.29066127 44.7196355z m0 0" fill="#1296db" p-id="2081"></path><path d="M516.86917167 300.35941806c-108.9382212 0-197.25383718 88.32216409-197.25383718 197.25907567 0 108.94215005 88.31561599 197.25776602 197.25383718 197.25776604 108.94215005 0 197.25645642-88.31692561 197.25645642-197.25776604 0-108.93691157-88.31561599-197.25907566-197.25645642-197.25907567z m88.76481607 286.02389173c-23.75783837 23.65306869-55.25160926 36.76499625-88.76481607 36.76499626-33.50927793 0-65.00435842-13.11323718-88.76612568-36.76499626-23.64913982-23.75652877-36.75844814-55.25029966-36.75844815-88.76481606 0-33.50665868 13.10930834-65.00435842 36.75844815-88.76481606 23.76176725-23.76176725 55.25684776-36.75844814 88.76612568-36.75844816 33.51320678 0 65.00828729 12.99668091 88.76481607 36.75844816 23.65175908 23.76176725 36.76237701 55.25815737 36.76237701 88.76481606 0 33.51451641-13.11061794 65.00828729-36.76237701 88.76481606z m0 0" fill="#1296db" p-id="2082"></path></svg>';
        var btn_export = '<a class="ys-helper-btn-upload" onclick="window.YsHelper_export();" style="margin-left:10px;display:none;">' + export_icon + '</a>';
        var btn_import = '<a class="ys-helper-btn-download" onclick="window.YsHelper_import();" style="margin-left:10px;display:none;">' + import_icon + '</a>';
        var btn_setting = '<a class="ys-helper-btn-setting" onclick="window.YsHelper_showSetting();" style="margin-left:10px;">' + setting_icon + '</a>';
        $('.mapMenu').after('<input type="file" id="local_file" style="display:none;">');
        $('.mapMenu').after('<div id="ys-helper-btn-group" style="text-align:right;float:right;padding:0px 25px 0;">' + btn_export + btn_import + btn_setting + '</div>');
        $('.mapMenu').after('<div id="ys-helper-info-msg" style="color:green;margin-top:5px;"></div>');
        $('.mapMenu').after('<div id="ys-helper-error-msg" style="color:red;margin-top:5px;"></div>');

        $('#local_file').change(function(e){
            var reader = new FileReader();
            var file = e.target.files[0];
            reader.readAsText(file);
            reader.onload = function () {
                try {
                    var data = JSON.parse(reader.result);
                    if (!(data instanceof Array)) {
                        return error('输入文件格式错误');
                    }
                    $.cookie('last_marked', getMarked());
                    var marked = JSON.stringify(data);
                    console.log(marked);
                    setMarked(marked);
                    infoReloadPage('读取成功');
                } catch(err) {
                    console.log(err);
                    return error('输入文件格式错误, 无法解析');
                }
            };
            reader.onerror = function(){
                error('读取本地文件失败 (' + reader.error + ')');
            }
            e.target.value='';
        });


        info('欢迎使用！');
    }

    function info(msg, timeout) {
        if (msg != '') {
            $('#ys-helper-error-msg').html('');
            msg = '原神助手[提示]：' + msg;
            clearTimeout(g_info_timer);
            if (timeout == null) {
                timeout = 5000;
            }
            if (timeout > 0) {
                g_info_timer = setTimeout(function(){info('');}, timeout);
            }
        }
        $('#ys-helper-info-msg').html(msg);
    }

    function error(msg, timeout) {
        if (msg != '') {
            $('#ys-helper-info-msg').html('');
            msg = '原神助手[错误]：' + msg;
            clearTimeout(g_error_timer);
            if (timeout == null) {
                timeout = 10000;
            }
            if (timeout > 0) {
                g_error_timer = setTimeout(function(){error('');}, timeout);
            }
        }
        $('#ys-helper-error-msg').html(msg);
    }

    function infoReloadPage(prefix, suffix) {
        var msg = '';
        if (prefix && prefix != '') {
            msg += prefix + ', ';
        }
        msg += '请<a onclick="location.reload();">【刷新】</a>本页面';
        if (suffix && suffix != '') {
            msg += ', ' + suffix;
        }
        return info(msg, 0);
    }

    function showSetting() {
        $('.ys-helper-btn-upload').show();
        $('.ys-helper-btn-download').show();
        $('.select-item').css('flex', '0 0 45%');
        $(".select-item").each(function(){
            var categoryid = $(this).attr('categoryid');
            var $cbHidden = $('<input class="cb-marked-hidden" type="checkbox" onclick="window.YsHelper_checkStateChanged(\'' + categoryid + '\')" categoryid="' + categoryid + '"' + (isMarkedHidden(categoryid)?'checked="true"':'') + '>');
            $(this).before($cbHidden);
        });
    }

    function hideSetting() {
        $('.ys-helper-btn-upload').hide();
        $('.ys-helper-btn-download').hide();
        $('.select-item').css('flex', '0 0 50%');
        $('.cb-marked-hidden').remove();
    }

    function isMarkedHidden(categoryid) {
        return g_marked_hidden_categories.has(categoryid);
    }

    function setMarkedHidden(categoryid, hidden) {
        if (hidden) {
            g_marked_hidden_categories.add(categoryid);
        }
        else {
            g_marked_hidden_categories.delete(categoryid);
            if (isShown(categoryid)) {
                clickIcon(categoryid, 2);
            }
        }
        saveSetting();
    }

    function saveSetting() {
        $.cookie('YsHelper_markedHiddenCategories', Array.from(g_marked_hidden_categories).toString());
    }

    function isChecked(categoryid) {
        return $('input[type="checkbox"][categoryid="' + categoryid + '"]').prop('checked');
    }

    window.YsHelper_showSetting = function() {
        if (g_is_setting_shown) {
            hideSetting();
            g_is_setting_shown = false;
        }
        else {
            showSetting();
            g_is_setting_shown = true;
        }
    }

    window.YsHelper_checkStateChanged = function(categoryid) {
        var checked = isChecked(categoryid);
        setMarkedHidden(categoryid, checked);
    }

    function getMarked() {
        return localStorage.wikiYsOpacData;
    }

    function setMarked(marked) {
        localStorage.wikiYsOpacData = marked;
    }

    function getIconSrcByCategoryid(categoryid) {
        return $('.select-item[categoryid="' + categoryid + '"]').find('.list-img')[0].currentSrc;
    }

    function removeParam(url) {
        var idx = url.indexOf('?');
        return idx==-1 ? url : url.substr(0, idx);
    }

    function clickIcon(categoryid, times) {
        times = times ? times : 1;
        var $el = $('.select-item[categoryid="' + categoryid + '"]')[0];
        for (var i = 0; i < times; ++i) {
            $el.click();
        }
    }

    function isShown(categoryid) {
        return $('.select-item[categoryid="' + categoryid + '"]').hasClass('item-active');
    }

    function showIcon(categoryid) {
        var $elem = $('.select-item[categoryid="' + categoryid + '"]');
        if (!$elem.hasClass('item-active')) {
            $elem[0].click();
        }
    }

    function hideIcon(categoryid) {
        var $elem = $('.select-item[categoryid="' + categoryid + '"]');
        if ($elem.hasClass('item-active')) {
            $elem[0].click();
        }
    }

    function hideMarkedIcon(categoryid) {
        var $img = $('img');
        var count = 0;
        var iconSrc = removeParam(getIconSrcByCategoryid(categoryid));
        for (var i = 0; i < $img.length; ++i) {
            if (removeParam($img[i].src) == iconSrc && $img[i].id != '') {
                var yst = $img[i];
                if (yst.style.opacity != '1') {
                    yst.parentNode.removeChild(yst);
                    count++;
                }
            }
        }
        if (count > 0) {
            console.log(name + ': ' + count);
        }
        return count;
    }

    function saveToFile(content, filename) {
        let downLink = document.createElement('a');
        downLink.download = filename;
        let blob = new Blob([content])
        downLink.href = URL.createObjectURL(blob)
        document.body.appendChild(downLink)
        downLink.click()
        document.body.removeChild(downLink)
    }

    window.YsHelper_import = function() {
        return $("#local_file").trigger("click");
    }

    window.YsHelper_export = function() {
        var marked = getMarked();
        if (isEmpty(marked)) {
            return error('当前没有任何已标记的点');
        }
        var filename = '原神wiki_地图工具_标记点_' + getTimeStr(new Date()) + '.txt';
        return saveToFile(marked, filename);
    }

    function getTimeStr(time) {
        var date = new Date(time);
        var year = date.getFullYear(),
            month = date.getMonth()+1,
            day = date.getDate(),
            hour = date.getHours(),
            min = date.getMinutes(),
            sec = date.getSeconds();
        var str = year + '' +
            (month < 10? '0' + month : month) + '' +
            (day < 10? '0' + day : day) + '_' +
            (hour < 10? '0' + hour : hour) + '' +
            (min < 10? '0' + min : min) + '' +
            (sec < 10? '0' + sec : sec);
        return str;
    }

    function refreshMap() {
        var $items = $('.select-item');
        for (var i = 0; i < $items.length; ++i) {
            var $item = $items.eq(i);
            if ($item.hasClass('item-active')) {
                var categoryid = $items.eq(i).attr('categoryid');
                clickIcon(categoryid, 2);
            }
        }
    }

    /**************************************************/
    /*                                                */
    /*                  ready                         */
    /*                                                */
    /**************************************************/

    init();

    setInterval(function(){
        for (var categoryid of g_marked_hidden_categories) {
            hideMarkedIcon(categoryid);
        }
    }, 1000);
}


(function() {
    'use strict';
    run();
})();

