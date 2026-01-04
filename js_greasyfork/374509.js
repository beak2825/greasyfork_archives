// ==UserScript==
// @name         漫猫/爱恋/MioBT 生存模式BT下载链接
// @namespace    http://kisssub.org/
// @version      3.1
// @description  漫猫/爱恋/MioBT 生存战略模式下为页面添加BT种子下载链接
// @author       Kernel
// @match        http://miobt.com/*
// @match        http://www.miobt.com/*
// @match        http://m.miobt.com/*
// @match        http://kisssub.org/*
// @match        http://www.kisssub.org/*
// @match        http://m.kisssub.org/*
// @match        http://comicat.org/*
// @match        http://www.comicat.org/*
// @match        http://m.comicat.org/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/374509/%E6%BC%AB%E7%8C%AB%E7%88%B1%E6%81%8BMioBT%20%E7%94%9F%E5%AD%98%E6%A8%A1%E5%BC%8FBT%E4%B8%8B%E8%BD%BD%E9%93%BE%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/374509/%E6%BC%AB%E7%8C%AB%E7%88%B1%E6%81%8BMioBT%20%E7%94%9F%E5%AD%98%E6%A8%A1%E5%BC%8FBT%E4%B8%8B%E8%BD%BD%E9%93%BE%E6%8E%A5.meta.js
// ==/UserScript==

(function () {
    if (typeof acgscript_config === 'undefined') {
        acgscript_config = {};
    }

    if (typeof acgscript_config['miobt'] === 'undefined') {
        acgscript_config['miobt'] = {};
    }

    if (typeof acgscript_config['miobt']['4'] === 'undefined') {
        acgscript_config['miobt']['4'] = {
            'api_url': 'http://v2.uploadbt.com',
            'loaded': false,
            'source': 'greasyfork.org'
        };
    }
})();

(function ($) {
    if (acgscript_config['miobt']['4']['loaded']) {
        return false;
    }

    acgscript_config['miobt']['4']['loaded'] = true;

    var log_name = 'acgscript/miobt/bt_download';

    console.log([log_name, {
        'source': acgscript_config['miobt']['4']['source'],
        'loaded': acgscript_config['miobt']['4']['loaded'],
        'api_url': acgscript_config['miobt']['4']['api_url'],
        'mika_mode': Config['mika_mode']['enabled'],
        'in_script': Config['in_script'],
        'platform': Config['user_script']['platform']
    }]);

    if (!Config['mika_mode']['enabled']) {
        return false;
    }

    if (Config['in_script'] !== 'show') {
        return false;
    }

    if (!$('#box_download')) {
        return false;
    }

    var api_url = acgscript_config['miobt']['4']['api_url'];

    var torrent_url = {
        "lite": api_url + '/?r=down&hash=' + Config['hash_id'],
        'full': api_url + '/?r=down&hash=' + Config['hash_id'] + '&name=' + Config['down_torrent_format'].replace('%s', Config['bt_data_title'])
    };

    var magnet_url = {
        'lite': 'magnet:?xt=urn:btih:' + Config['hash_id'],
        'full': 'magnet:?xt=urn:btih:' + Config['hash_id'] + '&tr=' + Config['announce']
    };

    if (Config['user_script']['platform'] == 'desktop') {
        // var html =
        //     '<div class="box">' +
        //     '   <h2 class="title">下载地址</h2>' +
        //     '   <div class="intro basic_info">' +
        //     '   <ul>' +
        //     '       <li><a id="magnet" href="' + magnet_url.full + '">磁链下载</a></li>' +
        //     '       <li><a id="download" href="' + torrent_url.full + '">种子下载</a></li>' +
        //     '       <li><a id="qrcode_magnet" style="cursor: pointer;">磁链扫码</a></li>' +
        //     '       <li><a id="qrcode_download" style="cursor: pointer;">种子扫码</a></li>' +
        //     '   </ul>' +
        //     '   </div>' +
        //     '   <div class="qrcode_enlarged" id="qrcode_magnet_enlarged"  qr_label="磁链扫码" qr_content="' + magnet_url.full + '"></div>' +
        //     '   <div class="qrcode_enlarged" id="qrcode_download_enlarged"  qr_label="种子扫码" qr_content="' + torrent_url.lite + '"></div>' +
        //     '</div>';
        //
        // $('#box_download').append($(html));

        $('#box_download h2.title').text('下载地址');
        $('#magnet').attr('href', magnet_url.full).text('磁链下载');
        $('#download').attr('href', torrent_url.full).text('种子下载');
        $('#qrcode_magnet').removeAttr('href').text('磁链扫码');
        $('#qrcode_download').removeAttr('href').text('种子扫码');
        $('#qrcode_magnet_enlarged').attr('qr_content', magnet_url.full);
        $('#qrcode_download_enlarged').attr('qr_content', torrent_url.lite);

        var register_qrcode_event = function (sel, sel_enlarged) {
            $(sel).click(function () {
                $('.qrcode_enlarged').html('').hide();
                $(sel_enlarged).qrcode({
                    render: "canvas",
                    size: 256,
                    fill: '#0480BE',
                    background: '#FFF',
                    quiet: 1,
                    mode: 2,
                    minVersion: 10,
                    label: $(sel_enlarged).attr('qr_label'),
                    fontname: '"Helvetica Neue", Helvetica, Arial, "PingFang SC", "Hiragino Sans GB", "Heiti SC", "Microsoft YaHei", "WenQuanYi Micro Hei", sans-serif',
                    fontcolor: 'darkorange',
                    text: $(sel_enlarged).attr('qr_content')
                });

                $(sel_enlarged).fadeIn(200);
            });

            $(sel_enlarged).click(function () {
                $(this).hide();
            });
        };

        $(document).ready(function () {
            register_qrcode_event('#qrcode_magnet', '#qrcode_magnet_enlarged');
            register_qrcode_event('#qrcode_download', '#qrcode_download_enlarged');
        });
    }
    else if (Config['user_script']['platform'] == 'mobile') {
        $('#torrent_url').attr('href', torrent_url.full).text('种子下载').click(function () {
            return (prompt('确认下载该种子', torrent_url.full) ? true : false);
        });
        $('#magnet_url').attr('href', magnet_url.full).text('磁力下载').click(function () {
            return (prompt('确认下载磁链', magnet_url.full) ? true : false);
        });
    }
    else {
        return false;
    }
})(jQuery);