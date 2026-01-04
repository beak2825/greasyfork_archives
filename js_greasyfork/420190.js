// ==UserScript==
// @name         虫洞2.0（漫猫/爱恋/ MioBT 二合一脚本）
// @icon         https://www.kisssub.org/images/favicon/kisssub.ico
// @namespace    https://www.kisssub.org
// @version      0.2
// @description  漫猫/爱恋/ MioBT 二合一脚本（种子列表增强/生存模式BT下载链接）
// @author       _Hyouka&TKF
// @match        http://*.kisssub.org/*
// @match        http://*.comicat.org/*
// @match        http://*.miobt.com/*
// @match        https://*.kisssub.org/*
// @match        https://*.comicat.org/*
// @match        https://*.miobt.com/*
// @include      http://*.kisssub.org/*
// @include      http://*.comicat.org/*
// @include      http://*.miobt.com/*
// @include      https://*.kisssub.org/*
// @include      https://*.comicat.org/*
// @include      https://*.miobt.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/420190/%E8%99%AB%E6%B4%9E20%EF%BC%88%E6%BC%AB%E7%8C%AB%E7%88%B1%E6%81%8B%20MioBT%20%E4%BA%8C%E5%90%88%E4%B8%80%E8%84%9A%E6%9C%AC%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/420190/%E8%99%AB%E6%B4%9E20%EF%BC%88%E6%BC%AB%E7%8C%AB%E7%88%B1%E6%81%8B%20MioBT%20%E4%BA%8C%E5%90%88%E4%B8%80%E8%84%9A%E6%9C%AC%EF%BC%89.meta.js
// ==/UserScript==

//主要
var acgscript_config;
!function () {
    acgscript_config = {
        "miobt": {
            "3": {
                "base_url": "https://cdn.acgscript.com/script/miobt/live2d", "show_toggle": false
            },
            "4": {
                "api_url": "http://v2.uploadbt.com", "source": "cdn.acgscript.com"
            }
        }
    };

    // -> -> -> -> -> -> -> -> -> -> -> -> -> -> -> 种子列表增强 -> -> -> -> -> -> -> -> -> -> -> -> -> -> ->
    (function ($) {
        var log_name = 'acgscript/bt_list_enhanced';

        console.log([log_name, {
            'in_script': Config['in_script'],
            'platform': Config['user_script']['platform']
        }]);

        if (Config['user_script']['platform'] !== 'desktop') {
            return false;
        }

        if ((Config['in_script'] !== 'index') && (Config['in_script'] !== 'search')) {
            return false;
        }

        console.log([log_name, {
            'execute': true
        }]);

        $(document).ready(function () {
            //匹配BT列表顿
            if (!$(".clear > table#listTable > tbody.tbody > tr[class^='alt'] > td > a[href^='show']").length) {
                return false;
            }

            var link;
            var tracker = 'http://open.acgtracker.com:1096/announce';
            var copyTextToClipboard = function (text) {
                var textArea = document.createElement("textarea");
                textArea.style.position = 'fixed';
                textArea.style.top = 0;
                textArea.style.left = 0;
                textArea.style.width = '2em';
                textArea.style.height = '2em';
                textArea.style.padding = 0;
                textArea.style.border = 'none';
                textArea.style.outline = 'none';
                textArea.style.boxShadow = 'none';
                textArea.style.background = 'transparent';
                textArea.value = text;
                document.body.appendChild(textArea);
                textArea.select();

                try {
                    var successful = document.execCommand('copy');
                    var msg = successful ? 'successful' : 'unsuccessful';
                    console.log('Copying text command was ' + msg);
                } catch (err) {
                    console.log('Oops, unable to copy');
                }
                document.body.removeChild(textArea);
            };

            //复制
            var copyMagnet = function () {
                var i = 0;
                var arr = new Array("");
                //获取所有勾上class为checkMagnet的checkbox（每行资源所对应的checkbox），遍历
                $(".checkMagnet:checked").each(function () {
                    //获取该checkbox的val，即磁链，放到数组中
                    arr[i] = $(this).val();
                    i += 1;
                });
                //把数组以换行回车连接为一个字符串
                var multiMagnet = arr.join("\r\n");
                //弹出确认对话框，用户选择积极选项时把字符串放入剪贴板
                if (confirm("即将复制已选磁链，确认进行＿")) {
                    copyTextToClipboard(multiMagnet);
                }
            };
            //全选
            var checkAll = function () {
                //获取所有资源所对应的checkbox，遍县
                $(".checkMagnet").each(function () {
                    //当全选复选框与当前复选框的勾选状态不一样时
                    if ($(this).get(0).checked != $("#checkAll").get(0).checked) {
                        //点击当前复选框
                        $(this).get(0).click();
                    }
                });
            };
            //全选状态的临界状态处理，即全选到差一个全选，以及差一个全选到全选
            var checkThis = function () {
                //如果当前checkbox不被勾上
                if ($(this).get(0).checked === false) {
                    //全选复选框也不可以被勾丿
                    $("#checkAll").get(0).checked = false;
                }
                //如果当前checkbox被勾上并且所有资源所对应的checkbox都被勾上
                else if ($(this).get(0).checked === true && $(".checkMagnet:checked").length == $(".checkMagnet").length) {
                    //全选复选框也要被勾丿
                    $("#checkAll").get(0).checked = true;
                }
            };

            link = $(".clear > table#listTable > tbody.tbody > tr[class^='alt'] > td > a[href^='show']");
            var headTh = $("#listTable .l3");
            var newColumn = headTh.clone();
            newColumn.removeClass("l3").addClass("l31").css("width", "65px");
            var checkall = $("<input/>", {type: "checkbox", id: "checkAll", title: "全逿"});
            headTh.after(newColumn.text("").append(checkall).append($('<i class="fa fa-clipboard" id="copy_magnets"></i>')));
            //对全选复选框和其他复选框监听变更事件
            $("#checkAll").on("change", checkAll);

            //对列表页表格中的每一衿
            if (link != null) { // 不可使用!==进行两者的比较，因为undefined !== null的值为true
                link.each(function () {
                    //从资源页url中切出hex编码hash
                    var str = $(this).attr("href").substring(5, 45);
                    //构成磁链
                    var magnet = "magnet:?xt=urn:btih:" + str + "&tr=" + tracker;
                    var td = $("<td/>");
                    var check = $("<input/>", {type: "checkbox", class: "checkMagnet", value: magnet});
                    //把整个元素放到后面的td丿
                    var a = $("<a/>", {href: magnet, class: "magnet", html: '<i class="fa fa-magnet"></i>'});
                    $(this).parent().after(td.append(check).append(a));
                });
            }
            if ($(".checkMagnet")) {
                //对checkMagnet类的变更事件绑定全选复选框的选中变更函数
                $(".checkMagnet").on("change", checkThis);
            }

            $('#copy_magnets').click(function () {
                copyMagnet();
            });
            $('i.fa').css('color', $('.box').css('border-color'));
        });
    })(jQuery);
    // <- <- <- <- <- <- <- <- <- <- <- <- <- <- <- END <- <- <- <- <- <- <- <- <- <- <- <- <- <- <-


    // -> -> -> -> -> -> -> -> -> -> -> -> -> -> -> 生存模式BT下载链接 -> -> -> -> -> -> -> -> -> -> -> -> -> -> ->
    (function ($) {
        if (acgscript_config['miobt']['4']['loaded']) {
            return false;
        }

        acgscript_config['miobt']['4']['loaded'] = true;
        var log_name = 'acgscript/miobt/bt_download';

        console.log([log_name, {
            'source': acgscript_config['miobt']['4']['source'], 'loaded': acgscript_config['miobt']['4']['loaded'], 'api_url': acgscript_config['miobt']['4']['api_url'], 'mika_mode': Config['mika_mode']['enabled'], 'in_script': Config['in_script'], 'platform': Config['user_script']['platform']
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
            "lite": api_url + '/?r=down&hash=' + Config['hash_id'], 'full': api_url + '/?r=down&hash=' + Config['hash_id'] + '&name=' + Config['down_torrent_format'].replace('%s', Config['bt_data_title'])
        };

        var magnet_url = {
            'lite': 'magnet:?xt=urn:btih:' + Config['hash_id'], 'full': 'magnet:?xt=urn:btih:' + Config['hash_id']
        };

        if (Config['user_script']['platform'] == 'desktop') {
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
                        render: "canvas", size: 256, fill: '#0480BE', background: '#FFF', quiet: 1, mode: 2, minVersion: 10, label: $(sel_enlarged).attr('qr_label'), fontname: '"Helvetica Neue", Helvetica, Arial, "PingFang SC", "Hiragino Sans GB", "Heiti SC", "Microsoft YaHei", "WenQuanYi Micro Hei", sans-serif', fontcolor: 'darkorange', text: $(sel_enlarged).attr('qr_content')
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
                return (prompt('确认下载该种孿', torrent_url.full) ? true : false);
            });

            $('#magnet_url').attr('href', magnet_url.full).text('磁力下载').click(function () {
                return (prompt('确认下载磁链', magnet_url.full) ? true : false);
            });
        }
        else {
            return false;
        }
    })(jQuery);
    // <- <- <- <- <- <- <- <- <- <- <- <- <- <- <- END <- <- <- <- <- <- <- <- <- <- <- <- <- <- <-
}();
