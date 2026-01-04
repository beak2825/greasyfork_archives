// ==UserScript==
// @name         Miobt生存模式启动
// @namespace    https://coding.net/u/BackRunner/p/GreaseMonkey-JS/git
// @version      1.0
// @description  通过油猴脚本开启Miobt的生存模式
// @author       BackRunner
// @include      *://www.miobt.com/show*
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/373236/Miobt%E7%94%9F%E5%AD%98%E6%A8%A1%E5%BC%8F%E5%90%AF%E5%8A%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/373236/Miobt%E7%94%9F%E5%AD%98%E6%A8%A1%E5%BC%8F%E5%90%AF%E5%8A%A8.meta.js
// ==/UserScript==

(function() {
    (function ($) {
        var acgscript_config = {
            "miobt": {
                "4": {
                    "api_url": "http://v2.uploadbt.com"
                }
            }
        };

        var log_name = 'acgscript/bt_download';

        console.log([log_name, {
            'api_url': acgscript_config['miobt']['4']['api_url'],
            'mika_mode': Config['mika_mode']['enabled'],
            'in_script': Config['in_script'],
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

        console.log([log_name, {
            'execute': true
        }]);

        var api_url = acgscript_config['miobt']['4']['api_url'];

        var torrent_url = {
            "lite": api_url + '/?r=down&hash=' + Config['hash_id'],
            'full': api_url + '/?r=down&hash=' + Config['hash_id'] + '&name=' + Config['down_torrent_format'].replace('%s', Config['bt_data_title'])
        };

        var magnet_url = {
            'lite': 'magnet:?xt=urn:btih:' + Config['hash_id'],
            'full': 'magnet:?xt=urn:btih:' + Config['hash_id'] + '&tr=' + Config['announce']
        };

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
    })(jQuery);
})();