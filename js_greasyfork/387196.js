// ==UserScript==
// @name         煎蛋外挂吐槽(假吐槽)-IE兼容版，可用书签载入
// @namespace    http://qs5.org/?jandan_fake_tucao
// @version      1.04
// @description  不能吐槽怎么活？不如假装有吐槽？
// @author       ImDong
// @match        *://jandan.net/*
// @match        *://i.jandan.net/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/387196/%E7%85%8E%E8%9B%8B%E5%A4%96%E6%8C%82%E5%90%90%E6%A7%BD%28%E5%81%87%E5%90%90%E6%A7%BD%29-IE%E5%85%BC%E5%AE%B9%E7%89%88%EF%BC%8C%E5%8F%AF%E7%94%A8%E4%B9%A6%E7%AD%BE%E8%BD%BD%E5%85%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/387196/%E7%85%8E%E8%9B%8B%E5%A4%96%E6%8C%82%E5%90%90%E6%A7%BD%28%E5%81%87%E5%90%90%E6%A7%BD%29-IE%E5%85%BC%E5%AE%B9%E7%89%88%EF%BC%8C%E5%8F%AF%E7%94%A8%E4%B9%A6%E7%AD%BE%E8%BD%BD%E5%85%A5.meta.js
// ==/UserScript==

(function ($) {
    'use strict';

    var jandan_fake_tucao = window.jandan_fake_tucao || {
        livere_uid: 'MTAyMC80NTA0MS8yMTU1OQ==',
        livere_ids: null,
        lazyload_dom: null,
        lv_comment_id: null,
        interval_id: 0,
        init: function () {
            this.livere_ids = atob(this.livere_uid).split('/');

            // 添加样式
            let style_dom = document.createElement('style');
            style_dom.innerHTML = ".jandan-tucao-livere {margin: 10px 0;padding: 0 5px;border: 1px solid #e5e5e5;}";
            $('head').append(style_dom);

            // 吐槽详情页 (直接显示)
            if (location.pathname.substr(0, 3) == '/t/') {
                this.load_livere($('#tucao-list'), location.pathname.substr(3));
                // 加一个隐藏/显示原生吐槽的按钮
                $('#tucao-list .jandan-tucao').before('<a href="javascript:;" class="tucao-btn" id="jandan-tucao-show"> 吐槽去哪了?(显示 or 隐藏 原生真吐槽) </a>'); // <label><input type="checkbox" /> 原生吐槽0评论是否自动隐藏</label>
                $('#jandan-tucao-show').click(function () {
                    if ($('#tucao-list .jandan-tucao').is(":hidden")) {
                        $('#tucao-list .jandan-tucao').animate({ height: 'toggle', opacity: 'toggle' }, 'slow');
                    } else {
                        $('#tucao-list .jandan-tucao').animate({ height: 'toggle', opacity: 'toggle' });
                    }
                });

                // 如果原生吐槽没有数据就折叠他
                var hide_tucao_interval_id = setInterval(function() {
                    if ($('#tucao-list .tucao-list').text().indexOf('加载中') < 0) {
                        if ($('#tucao-list .tucao-list .tucao-row').length <= 0) {
                            $('#tucao-list .jandan-tucao').animate({ height: 'toggle', opacity: 'toggle' }, 'slow');
                        }
                        clearInterval(hide_tucao_interval_id);
                    }
                }, 100);

                return;
            }
            // 给原生吐槽后面追加一个按钮
            $('.commentlist>li .tucao-btn').after('<a href="javascript:;" class="tucao-livere-btn"> 假吐槽 </a>');
            $('.commentlist>li .tucao-livere-btn').click(function (e) {
                let tucao_id = $(this).prev().data('id'),
                    comment_dom = $(this).closest('li'),
                    container = comment_dom.find("div.jandan-tucao-livere");

                // 如果有原生吐槽就隐藏他
                comment_dom.find("div.jandan-tucao").fadeOut();

                // 显示 or 隐藏 是个问题
                if (container.length) {
                    container.slideToggle("fast");
                } else {
                    jandan_fake_tucao.load_livere(comment_dom, tucao_id);
                }
            });
            // 点击原生吐槽就隐藏 假吐槽
            $('.commentlist>li .tucao-btn').click(function (e) {
                $(this).closest('li').find("div.jandan-tucao-livere").fadeOut();
            });

            // 绑定懒加载
            this.lazyload_dom = $('.commentlist>li .tucao-livere-btn');
            $(window).bind("scroll", function () {
                jandan_fake_tucao.lazyload();
            });
            this.lazyload();
        },
        // 加载来必力 评论框
        load_livere: function (e, d) {
            let a = $('<div class="jandan-tucao-livere" id="lv-container" data-id="city" data-uid="' + this.livere_uid + '" data-tucao-id="' + d + '"><div class="tucao-loading">假吐槽加载中....biubiubiu....</div></div>');

            // 上一个评论框要改名
            $('#lv-container').attr('id', 'jandan-tucao-' + $('#lv-container').data('tucao-id'));
            e.append(a);

            // 伪造吐槽页面信息
            window.livereOptions = {
                refer: 'jandan.net/yellowcomment-' + d,
                site: location.origin + '/t/' + d,
                title: '煎蛋网 - ' + $('#content h1.title').text().split(' ')[0] + ' No.' + d
            }

            // 设置标题要另类
            let mate_title = document.querySelector('meta[property="og:title"]');
            if (!mate_title) {
                mate_title = $('<meta property="og:title" content="test" />');
                $('head').append(mate_title);
            }
            $(mate_title).attr('content', livereOptions.title);

            this.check_comment();

            // 避免重复加载 js
            if (typeof LivereTower !== 'undefined') {
                LivereTower.init();
                return;
            }

            // 首次肯定要加载了...
            (function (d, s) {
                var j, e = d.getElementsByTagName(s)[0];

                if (typeof window.LivereTower === 'function') { return; }

                j = d.createElement(s);
                j.src = 'https://cdn-city.livere.com/js/embed.dist.js';
                j.async = true;

                e.parentNode.insertBefore(j, e);
            })(document, 'script');
        },
        // 检查评论框是否加载出来
        check_comment: function () {
            this.interval_id = setInterval(function() {
                if (typeof LivereTower === 'undefined') return;
                let lv_comment = LivereTower.get('lv_comment');
                if (lv_comment && lv_comment.id != this.lv_comment_id) {
                    if ($(lv_comment).height() != 500) {
                        this.lv_comment_id = lv_comment.id;
                        clearInterval(jandan_fake_tucao.interval_id);

                        if ($(lv_comment).height() < 100) {
                            $('.tucao-loading').text("似乎没加载出来？...关掉去广告插件试下？");
                            return;
                        }

                        $('.tucao-loading').hide();
                    }
                }
            }, 500);
        },
        // 获取吐槽数
        get_count: function (dom) {
            // 获取id
            let tucao_id = $(dom).prev().data('id');
            dom.innerText = " 假吐槽[.] ";
            $.ajax({
                dataType: 'JSONP',
                url: 'https://api-zero.livere.com/v1/common/config',
                data: {
                    refer: 'jandan.net/yellowcomment-' + tucao_id,
                    title: '无聊图-蛋友贴图专版',
                    highlightSeq: '',
                    requestPath: '/v1/common/config',
                    preview: false,
                    consumerSeq: this.livere_ids['0'],
                    livereSeq: this.livere_ids['1'],
                    smartloginSeq: this.livere_ids['2']
                },
                success: function (data) {
                    let totalCount = 0;
                    if (data.results.actions && data.results.actions.totalCount) {
                        totalCount = data.results.actions.totalCount;
                    }
                    dom.innerText = " 假吐槽[" + totalCount + "] ";
                    dom.dataset.isLoad = totalCount;
                }
            })
        },
        // 懒加载
        lazyload: function () { //监听页面滚动事件
            var seeHeight = document.documentElement.clientHeight; //可见区域高度
            var scrollTop = document.documentElement.scrollTop || document.body.scrollTop; //滚动条距离顶部高度
            for (var i = 0; i < this.lazyload_dom.length; i++) {
                if (this.lazyload_dom[i].offsetTop >= scrollTop && this.lazyload_dom[i].offsetTop < seeHeight + scrollTop) {
                    if (typeof this.lazyload_dom[i].dataset.isLoad == "undefined") {
                        // 标记为已经加载
                        this.lazyload_dom[i].dataset.isLoad = 0;
                        this.get_count(this.lazyload_dom[i]);
                        // 既然已经加载了 那就移除吧
                        this.lazyload_dom.splice(i, 1);
                        i--;
                    }
                }
            }
        }
    }

    window.jandan_fake_tucao = jandan_fake_tucao;

    // Biu biu biu!

    if (typeof $ === "function") {
        jandan_fake_tucao.init();
    }
})(window.jQuery);