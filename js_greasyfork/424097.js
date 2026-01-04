// ==UserScript==
// @name         微博提取RIJUPAO链接
// @namespace    http://tampermonkey.net/
// @version      0.1.38
// @description  很多字幕组在微博发布资源信息，使用脚本提取出来给RIJUPAO使用。
// @author       imzhi <yxz_blue@126.com>
// @match        https://weibo.com/mygroups?gid=4622027723899474
// 追新番
// @match        https://weibo.com/u/2824233005
// @match        https://weibo.com/2824233005/*
// 三角
// @match        https://weibo.com/u/2606228641
// @match        https://weibo.com/2606228641/*
// 招财猫
// @match        https://weibo.com/u/6998743536
// @match        https://weibo.com/6998743536/*
// 月之泪
// @match        https://weibo.com/u/6791184911
// 幻月字幕
// @match        https://weibo.com/u/5389683779
// @match        https://weibo.com/5389683779/*
// 弯弯字幕
// @match        https://weibo.com/u/6516601401
// @match        https://weibo.com/u/6516601401/*
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.5.1/jquery.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/clipboard.js/2.0.6/clipboard.min.js
// @grant        GM_addStyle
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/424097/%E5%BE%AE%E5%8D%9A%E6%8F%90%E5%8F%96RIJUPAO%E9%93%BE%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/424097/%E5%BE%AE%E5%8D%9A%E6%8F%90%E5%8F%96RIJUPAO%E9%93%BE%E6%8E%A5.meta.js
// ==/UserScript==

(async function() {
    'use strict';

    GM_addStyle('.imzhi_weibo_comm_copy {font-size: 11px;} .imzhi_weibo_item_create {margin-right: 10px;}');

    // 点击【生成微博复制】按钮，每条微博加上【生成评论复制】按钮，并加上【复制链接】按钮。点击【生成评论复制按钮】，在评论区加上【复制链接】按钮。
    const $button_create = $('<button class="imzhi_weibo_create">生成</button>');
    $('a.Ctrls_alink_1L3hP').last().after($button_create);
    $button_create.click(function() {
        const $nickname_last = $('.head_nick_1yix2');
        $nickname_last.each(function(i, nickname_last_el) {
            // 判断是否已添加按钮
            if ($(nickname_last_el).find('.imzhi_weibo_item_create').length) {
                return;
            }

            // 微博用户名后台追加【生成】按钮和【待复制】按钮
            const $weibo_create = $('<button class="imzhi_weibo_item_create">生成</button>');
            const $weibo_copy = $('<button class="imzhi_weibo_item_copy">待复制</button>');
            $(nickname_last_el).append($weibo_create)
                .append($weibo_copy);
        });
    });

    // 点击微博内容里的【生成】按钮
    $('#app').on('click', '.imzhi_weibo_item_create', function() {
        const $this = $(this);
        // 单条微博整体元素
        const $panel_main = $this.closest('.woo-panel-main');
        const $comment_first = getCommentFirstBtn(this);
        if (!$comment_first.length) {
            // alert('没有展开评论!');
            // 当没有展开评论，自动展开评论
            $panel_main.children('footer').find('.toolbar_commentIcon_3o7HB').closest('.toolbar_wrap_np6Ug').first(0).click()
            return false;
        }
        $comment_first.each(function (i, comm_first_btn) {
            // 判断是否已添加按钮
            if ($(comm_first_btn).find('.imzhi_weibo_comm_copy').length) {
                return;
            }
            const $comm_copy = $('<button class="imzhi_weibo_comm_copy">待复制</button>');
            $(comm_first_btn).before($comm_copy);
        });
    });

    // 点击微博内容里的【待复制】按钮
    $('#app').on('click', '.imzhi_weibo_item_copy', function() {
        const $main_copy = $(this);
        // const $main = $main_copy.closest('.vue-recycle-scroller__item-view');
        const $main = $main_copy.closest('.woo-panel-main');
        const $head_name = $main.find('.head_name_24eEB');
        let $detail = $main.find('.wbpro-feed-content > .wbpro-feed-ogText > .detail_wbtext_4CRf9');
        const $expand = $detail.find('span.expand');
        if ($expand.length) {
            $expand.click();
        }
        if ($main_copy.text() === '复制') {
            return;
        }
        $main_copy.prop('disabled', true);

        setTimeout(async () => {
            // 如果有展开按钮那么重新获取$detail元素，以便得到完整内容
            if ($expand.length) {
                $detail = $main.find('.wbpro-feed-content > .wbpro-feed-ogText > .detail_wbtext_4CRf9');
            }
            const head_name = $head_name.text().trim();
            const html = $detail.html();
            let rijupao_str;
            if (head_name.includes('幻月')) {
                rijupao_str = await zimuHuanYueStr(html, html);
            } else if (head_name.includes('番新追')) {
                rijupao_str = await zimuZhuixinfanStr(html, html);
            } else if (head_name.includes('三角')) {
                rijupao_str = await zimuSanjiaoStr(html, html);
            } else if (head_name.includes('招财猫')) {
                rijupao_str = await zimuZhaocaimaoStr(html, html);
            } else if (head_name.includes('月之泪')) {
                rijupao_str = await zimuYuezhileiStr(html, html);
            } else if (head_name.includes('弯弯')) {
                rijupao_str = await zimuWanwanStr(html, html);
            }

            // console.log('rijupao_str ==>', rijupao_str);
            if (!rijupao_str) {
                $main_copy.text('无匹配');
                $main_copy.prop('disabled', false);
                return;
            }
            $main_copy.attr('data-clipboard-text', rijupao_str);
            $main_copy.prop('disabled', false);
            $main_copy.text('复制');
            const clipjs = new ClipboardJS($main_copy[0]);
            clipjs.on('success', () => alert('已复制')).on('error', (e) => { console.log(e); });
        }, $expand.length ? 500 : 0);
    });

    // 点击微博评论里的【待复制】按钮，获取真实链接后，将[待复制]按钮改成[复制]按钮，再次点击，一键复制内容
    // 注意：下面的点击事件函数也要加上 async，调用 urlFormat 时要加上 await 关键词
    $('#app').on('click', '.imzhi_weibo_comm_copy', async function() {
        const $comm_copy = $(this);
        // closest('.con2') 是为了兼容微博评论的回复里有链接内容
        const $comm_main = $comm_copy.closest('.con2').length
            ? $comm_copy.closest('.con2')
            : $comm_copy.closest('.con1.woo-box-item-flex');
        const $author_link = $comm_main.find('.text > a:first-child');
        const html = $comm_main.find('.text > span').html();
        const html2 = $comm_main.find('.text').html();
        // console.log('$author_link', $author_link, html);
        if ($comm_copy.text() === '复制') {
            return;
        }
        // const $main = $comm_copy.closest('.vue-recycle-scroller__item-view');
        const $main = $comm_copy.closest('.woo-panel-main');
        const $detail = $main.find('.wbpro-feed-content > .wbpro-feed-ogText > .detail_wbtext_4CRf9');
        $comm_copy.prop('disabled', true);

        let rijupao_str;
        if ($author_link.text().includes('幻月')) {
            rijupao_str = await zimuHuanYueStr(html, $detail.html());
        } else if ($author_link.text().includes('番新追')) {
            rijupao_str = await zimuZhuixinfanStr(html, $detail.html());
        } else if ($author_link.text().includes('三角')) {
            rijupao_str = await zimuSanjiaoStr(html, $detail.html());
        } else if ($author_link.text().includes('招财猫')) {
            rijupao_str = await zimuZhaocaimaoStr(html, $detail.html());
        } else if ($author_link.text().includes('月之泪')) {
            rijupao_str = await zimuYuezhileiStr(html, $detail.html());
            if (!rijupao_str) {
                rijupao_str = await zimuYuezhileiStr(html2, $detail.html());
            }
        } else if ($author_link.text().includes('弯弯')) {
            rijupao_str = await zimuWanwanStr(html, $detail.html());
        }

        // console.log('rijupao_str ==>', rijupao_str);
        if (!rijupao_str) {
            $comm_copy.text('无匹配');
            return;
        }
        $comm_copy.attr('data-clipboard-text', rijupao_str);
        $comm_copy.prop('disabled', false);
        $comm_copy.text('复制');
        const clipjs = new ClipboardJS($comm_copy[0]);
        clipjs.on('success', () => alert('已复制'));
    });

    function getCommentFirstBtn(el) {
        // const $comment = $(el).closest('.vue-recycle-scroller__item-view');
        // return $comment.find('.Feed_box_3fswx .opt.woo-box-flex > .wbpro-iconbed:first-child');
        let $comment = $(el).closest('.woo-panel-main.Feed_wrap_3v9LH');
        // 下面代码用于处理微博单条内容详情页，获取整个微博内容(含评论)的元素
        if ($comment.parent().hasClass('woo-panel-main')) {
            $comment = $comment.parent();
        }
        return $comment.find('.opt.woo-box-flex > .wbpro-iconbed:first-child');
    }

    // 去掉网址里的空格，并还源短网址
    async function urlFormat(url) {
        let replace_url = url.replaceAll(' ', '');
        if (!replace_url.startsWith('http')) {
            replace_url = `https://${replace_url}`;
        }
        // console.log('replace_url', replace_url);

        if (replace_url.includes('weibo.cn/sinaurl')) {
            return real_url(replace_url);
        }

        if (!replace_url.includes('t.cn')) {
            return replace_url;
        }

        let dwz_res;
        dwz_res = await dwz_alapi(replace_url);
        // console.log(`[1] ${replace_url} ==> ${JSON.stringify(dwz_res)}`);
        if (dwz_res.code === 200) {
            return dwz_res.data.long_url;
        }
        // 重试一次
        dwz_res = await dwz_alapi(replace_url);
        // console.log(`[2] ${replace_url} ==> ${JSON.stringify(dwz_res)}`);
        if (dwz_res.code === 200) {
            return dwz_res.data.long_url;
        }
        return replace_url;
    }

    // 获取 http://weibo.cn/sinaurl 开头链接的跳转地址
    // http://weibo.cn/sinaurl?toasturl=https%3A%2F%2F115.com%2Fs%2Fswn7wwv3hec%3Fpassword%3Du683%26
    function real_url(url) {
        const query = url.split('weibo.cn/sinaurl').pop();
        const search_param = new URLSearchParams(query);
        const res = search_param.get('toasturl') || search_param.get('u');
        return res;
    }

    // 调用alapi.cn的接口进行短网址还原（要直接返回promise对象）
    function dwz_alapi(url) {
        const res = $.get(`https://v2.alapi.cn/api/url/query?token=JuM4UubE8rxVdOzF&url=${url}`);
        return res;
    }

    function joinArr(...arr) {
        const filter_arr = arr.filter(item => item.length);
        const str_arr = [];
        for (let item of arr) {
            str_arr.push(item.join("\n"));
        }
        return str_arr.join("\n\n").trim();
    }

    function getCodeText(code, type) {
        let type_str = '提取码';
        if (type === 'sanjiao') {
            type_str = '分享密码';
        }
        return code ? `，${type_str}：${code}。` : '';
    }

    function getUrlText(url, title) {
        const text = title ?? url;
        return `<a href="${url}" rel="noopener noreferrer" target="_blank" style="word-break: break-all;">${text}</a>`;
    }

    // 幻月字幕日剧跑链接生成
    async function zimuHuanYueStr(html, detail_html) {
        const mat_yiyiwu = html.match(/115.*?[:：].+?href="(?<yiyiwu_url>.+?)".+?码[:：]\s*(?<yiyiwu_code>[\w]{4})/);
        const mat_weiyun = html.match(/微云.+?(?<weiyun_url>https.+share\.weiyun\.com\/[\w]+)/);
        const mat_weiyun2 = html.match(/微云.+?href="(?<weiyun_url>.+?)"/);
        const mat_baidu = html.match(/度盘?.*?[:：].+?href="(?<baidu_url>.+?)"(?:.+?码[:：]\s*(?<baidu_code>[\w]{4}))?/);
        const mat_kua = html.match(/夸.*?[:：].+?href="(?<kua_url>.+?)"/);
        const mat_ali = html.match(/里.*?[:：].+?href="(?<ali_url>.+?)"/);
        // 相当于匹配首行作为标题
        const mat_title = detail_html.trim().match(/(?<title>.+?)\<br/);
        let title = mat_title?.groups?.title;
        // 只匹配到最后一个首行的最后一个】符号，后面的去掉
        title = title?.replace(/(?<t>.+】).+/, '$<t>');

        const arr_baidu = [];
        if (mat_baidu) {
            // t.cn的链接获取真实地址
            const baidu_url = await urlFormat(mat_baidu.groups.baidu_url);
            const baidu_code = mat_baidu.groups.baidu_code;

            arr_baidu.push('百度网盘下载(幻月字幕)：');
            arr_baidu.push(getUrlText(baidu_url, title ?? baidu_url) + getCodeText(baidu_code));
        }

        const arr_yiyiwu = [];
        if (mat_yiyiwu) {
            const yiyiwu_url = await urlFormat(mat_yiyiwu.groups.yiyiwu_url);
            const yiyiwu_code = mat_yiyiwu.groups.yiyiwu_code;

            arr_yiyiwu.push('115网盘下载(幻月字幕)：');
            arr_yiyiwu.push(getUrlText(yiyiwu_url, title ?? yiyiwu_url) + getCodeText(yiyiwu_code));
        }

        const arr_weiyun = [];
        if (mat_weiyun) {
            const weiyun_url = await urlFormat(mat_weiyun.groups.weiyun_url);
            const weiyun_code = mat_weiyun.groups.weiyun_code;

            arr_weiyun.push('微云网盘下载(幻月字幕)：');
            arr_weiyun.push(getUrlText(weiyun_url, title ?? weiyun_url) + getCodeText(weiyun_code));
        } else if (mat_weiyun2) {
            const weiyun_url = await urlFormat(mat_weiyun2.groups.weiyun_url);
            const weiyun_code = mat_weiyun2.groups.weiyun_code;

            arr_weiyun.push('微云网盘下载(幻月字幕)：');
            arr_weiyun.push(getUrlText(weiyun_url, title ?? weiyun_url) + getCodeText(weiyun_code));
        }

        const arr_kua = [];
        if (mat_kua) {
            const kua_url = await urlFormat(mat_kua.groups.kua_url);

            arr_yiyiwu.push('夸克网盘下载(幻月字幕)：');
            arr_yiyiwu.push(getUrlText(kua_url, title ?? kua_url));
        }

        const arr_ali = [];
        if (mat_ali) {
            const ali_url = await urlFormat(mat_ali.groups.ali_url);

            arr_yiyiwu.push('阿里网盘下载(幻月字幕)：');
            arr_yiyiwu.push(getUrlText(ali_url, title ?? ali_url));
        }

        const rijupao_str = joinArr(arr_baidu, arr_weiyun, arr_yiyiwu, arr_kua, arr_ali);
        return rijupao_str;
    }

    // 追新番字幕日剧跑链接生成
    async function zimuZhuixinfanStr(html, detail_html) {
        const mat_baidu = html.match(/(?:度盘|链接)[:：].+?href="(?<url>.+?)".+?码[:：]\s*?(?<code>[\w]{4})/);
        const mat_weiyun = html.match(/微[云|盘][:： ]?(?:http.+?)?(?<url>share\.weiyun\.com\/[\w]+)/);
        const mat_weiyun2 = html.match(/微[云|盘].+?href="(?<url>.+?)"/);
        const mat_title = detail_html.match(/(?<title>.+?)：/);
        const title = mat_title?.groups.title;

        const arr_baidu = [];
        if (mat_baidu) {
            // t.cn的链接获取真实地址
            const baidu_url = await urlFormat(mat_baidu.groups.url);
            const baidu_code = mat_baidu.groups.code;

            arr_baidu.push('百度网盘下载(追新番字幕)：');
            arr_baidu.push(getUrlText(baidu_url, title ?? baidu_url) + getCodeText(baidu_code));
        }

        const arr_weiyun = [];
        if (mat_weiyun) {
            const weiyun_url = await urlFormat(mat_weiyun.groups.url);
            const weiyun_code = mat_weiyun.groups.code;

            arr_weiyun.push('微云网盘下载(追新番字幕)：');
            arr_weiyun.push(getUrlText(weiyun_url, title ?? weiyun_url) + getCodeText(weiyun_code));
        } else if (mat_weiyun2) {
            const weiyun_url = await urlFormat(mat_weiyun2.groups.url);
            const weiyun_code = mat_weiyun2.groups.code;

            arr_weiyun.push('微云网盘下载(追新番字幕)：');
            arr_weiyun.push(getUrlText(weiyun_url, title ?? weiyun_url) + getCodeText(weiyun_code));
        }

        const rijupao_str = joinArr(arr_baidu, arr_weiyun);
        return rijupao_str;
    }

    // 三角字幕日剧跑链接生成
    // html - 评论内容html
    // detail_html - 微博内容html
    async function zimuSanjiaoStr(html, detail_html) {
        // console.log('html', html, 'detail_html', detail_html);
        const mat_baidu = html.match(/链接[:：].+?href="(?<url>.+?pan\.baidu\.com.+?)".+?码[:：]\s*?(?<code>[\w]{4})/);
        // www.aliyundrive.com/s/ZUFwGWfFCHS
        const mat_aliyun = html.match(/(?<url>www\.aliyundrive[\.\/\w]+?)\s.+?码[:：]\s*?(?<code>[\w]{4,6})/i);
        // <span>备用网盘下载链接：<a target="_blank" href="//weibo.cn/sinaurl?u=https%3A%2F%2Fshare.tsgsanjiao.com%2Fs%2FmPJfp">
        // <img class="icon-link" src="https://h5.sinaimg.cn/upload/2015/09/25/3/timeline_card_small_web_default.png">网页链接</a>  分享密钥：v564mp</span>
        const mat_beiyong = html.match(/备用网盘.+?链接[:：].+?href="(?<url>.+?)".+?密.+?[:：]\s*?(?<code>[\w]{4,6})/);
        // mat_title 匹配到如下内容：
        // 【2020日剧】【#行路人#】【EP11】【1080P】
        // 还需要做进一步的处理，去掉 #，并且去掉 #xxx# 外围的 a 标签
        const mat_title = detail_html.match(/(?<title>【.+】)/);

        const arr_baidu = [];
        const arr_aliyun = [];
        const arr_beiyong = [];
        if (mat_baidu) {
            // t.cn的链接获取真实地址
            const baidu_url = await urlFormat(mat_baidu.groups.url);
            const baidu_code = mat_baidu.groups.code;
            let title = mat_title.groups?.title ?? baidu_url;
            title = title.replace(/\<a.+?\>(?<name>.+?)\<\/a\>/g, '$<name>').replaceAll('#', '').replace(/\<a.+?\>(?<name>.+?)\<\/a\>/g, '$<name>').replace(/[\s]+】/g, '】');

            arr_baidu.push('百度网盘下载(三角字幕)：');
            arr_baidu.push(getUrlText(baidu_url, title) + getCodeText(baidu_code));
        }
        if (mat_aliyun) {
            const aliyun_url = await urlFormat(mat_aliyun.groups.url);
            const aliyun_code = mat_aliyun.groups.code;
            let title = mat_title.groups?.title ?? aliyun_url;
            title = title.replace(/\<a.+?\>(?<name>.+?)\<\/a\>/g, '$<name>').replaceAll('#', '').replace(/\<a.+?\>(?<name>.+?)\<\/a\>/g, '$<name>').replace(/[\s]+】/g, '】');
            arr_aliyun.push('阿里云网盘下载(三角字幕)：');
            arr_aliyun.push(getUrlText(aliyun_url, title) + getCodeText(aliyun_code));
        }
        if (mat_beiyong) {
            const beiyong_url = await urlFormat(mat_beiyong.groups.url);
            const beiyong_code = mat_beiyong.groups.code;
            let title = mat_title.groups?.title ?? beiyong_url;
            title = title.replace(/\<a.+?\>(?<name>.+?)\<\/a\>/g, '$<name>').replaceAll('#', '').replace(/\<a.+?\>(?<name>.+?)\<\/a\>/g, '$<name>').replace(/[\s]+】/g, '】');
            arr_beiyong.push('三角字幕备用网盘下载(三角字幕)：');
            arr_beiyong.push(getUrlText(beiyong_url, title) + getCodeText(beiyong_code, 'sanjiao'));
        }

        const rijupao_str = joinArr(arr_baidu, arr_aliyun, arr_beiyong);
        return rijupao_str;
    }

    async function zimuZhaocaimaoStr(html, detail_html) {
        const mat_baidu = html.match(/链接[:：].+?href="(?<url>.+?)".+?码[:：]\s*?(?<code>[\w]{4})/);
        // 相当于匹配首行作为标题
        const mat_title = detail_html.trim().match(/(?<title>.+?)\<br/);

        const arr_baidu = [];
        if (mat_baidu) {
            // t.cn的链接获取真实地址
            const baidu_url = await urlFormat(mat_baidu.groups.url);
            const baidu_code = mat_baidu.groups.code;
            let title = mat_title.groups?.title ?? baidu_url;
            // 将2个或2个以上的空格替换为1个空格
            title = title.replace(/\s\s+/g, ' ').trim();

            arr_baidu.push('百度网盘下载(招财猫字幕)：');
            arr_baidu.push(getUrlText(baidu_url, title) + getCodeText(baidu_code));
        }

        const rijupao_str = joinArr(arr_baidu);
        return rijupao_str;
    }

    async function zimuYuezhileiStr(html, detail_html) {
        const mat_baidu = html.match(/链接[:：].+?href="(?<url>.+?)".+?码[:：]\s*?(?<code>[\w]{4})/);
        const mat_kuake = html.match(/夸克.*?[:：].+?href="(?<url>.+?)"/);
        const mat_kuake2 = html.match(/夸克.*?[:：]\s*?(?<url>pan\.quark\.cn.+?)(\s|\<)/i);
        const mat_uc = html.match(/uc网盘.*?[:：].+?href="(?<url>.+?)"/i);
        const mat_uc2 = html.match(/uc(网盘)?.*?[:：]\s*?(?<url>fast\.uc\.cn.+?)(\s|\<)/i);
        // 匹配前两个中括号[xxx]的内容
        const mat_title = detail_html.trim().match(/(?<title>\[.+?\]\[.+?\])/);

        const arr_baidu = [];
        const arr_kuake = [];
        const arr_uc = [];
        if (mat_baidu) {
            // t.cn的链接获取真实地址
            const baidu_url = await urlFormat(mat_baidu.groups.url);
            const baidu_code = mat_baidu.groups.code;
            let title = replaceHref(mat_title.groups?.title ?? baidu_url);
            // 将2个或2个以上的空格替换为1个空格
            title = title.replaceAll('#', '');

            arr_baidu.push('百度网盘下载(月之泪字幕)：');
            arr_baidu.push(getUrlText(baidu_url, title) + getCodeText(baidu_code));
        } else if (mat_kuake) {
            const kuake_url = await urlFormat(mat_kuake.groups.url);
            let title = replaceHref(mat_title.groups?.title ?? kuake_url);

            arr_kuake.push('夸克网盘下载(月之泪字幕)：');
            arr_kuake.push(getUrlText(kuake_url, title ?? kuake_url));
        } else if (mat_uc) {
            const uc_url = await urlFormat(mat_uc.groups.url);
            let title = replaceHref(mat_title.groups?.title ?? uc_url);

            arr_uc.push('UC网盘下载(月之泪字幕)：');
            arr_uc.push(getUrlText(uc_url, title ?? uc_url));
        } else if (mat_kuake2) {
            const kuake_url = await urlFormat(mat_kuake2.groups.url);
            let title = replaceHref(mat_title.groups?.title ?? kuake_url);

            arr_kuake.push('夸克网盘下载(月之泪字幕)：');
            arr_kuake.push(getUrlText(kuake_url, title ?? kuake_url));
        } else if (mat_uc2) {
            const uc_url = await urlFormat(mat_uc2.groups.url);
            let title = replaceHref(mat_title.groups?.title ?? uc_url);

            arr_uc.push('UC网盘下载(月之泪字幕)：');
            arr_uc.push(getUrlText(uc_url, title ?? uc_url));
        }

        const rijupao_str = joinArr(arr_baidu, arr_kuake, arr_uc);
        return rijupao_str;
    }

    async function zimuWanwanStr(html, detail_html) {
        console.log('zimuWanwanStr', html)
        const mat_baidu = html.match(/[嘟度].*?[:：].+?href="(?<url>.+?)".+?[提码].*?\s*?(?<code>[\w]{4})/);
        const mat_kuake = html.match(/夸.*?[:：].+?href="(?<url>.+?)"/);
        console.log('zimuWanwanStr', mat_baidu, mat_kuake)
        // 匹配前两个中括号【xxx】的内容
        const mat_title = detail_html.trim().match(/(?<title>【.+】)/);

        const arr_baidu = [];
        const arr_kuake = [];
        if (mat_baidu) {
            // t.cn的链接获取真实地址
            const baidu_url = await urlFormat(mat_baidu.groups.url);
            const baidu_code = mat_baidu.groups.code;
            let title = replaceHref(mat_title.groups?.title ?? baidu_url);
            // 将2个或2个以上的空格替换为1个空格
            title = title.replaceAll('#', '');

            arr_baidu.push('百度网盘下载(弯弯字幕)：');
            arr_baidu.push(getUrlText(baidu_url, title) + getCodeText(baidu_code));
        } else if (mat_kuake) {
            const kuake_url = await urlFormat(mat_kuake.groups.url);
            let title = replaceHref(mat_title.groups?.title ?? kuake_url);

            arr_kuake.push('夸克网盘下载(弯弯字幕)：');
            arr_kuake.push(getUrlText(kuake_url, title ?? kuake_url));
        }

        const rijupao_str = joinArr(arr_baidu, arr_kuake);
        return rijupao_str;
    }

    function replaceHref(val) {
        const res = val.replace(/\<a.+?\>/, '').replace(/\<\/a\>/, '');
        return res;
    }

    // 还原短网址的测试代码
    // let url;
    // let dwz_res;
    // url = `http://t.cn/A6c29u8G`;
    // dwz_res = dwz_alapi(url);
    // dwz_res.code === 200;
    // dwz_res.data.short_url;
})();