// ==UserScript==
// @name         OneJAVOneWeb(Revise)
// @namespace    https://sleazyfork.org/zh-CN/scripts/428639-onejavoneweb
// @version      2021.0802.1000
// @description  老司机开车带你飞，一个插件畅览几大JAV网站，感谢匿名老司机，此脚本为匿名老司机创作，版权属原作者所有，我只是修改了一些不能用的网址和加了免梯子网址自用，如有兴趣者可自行下载。
// @author       testqdg
// @license      MIT
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAACXBIWXMAAAAAAAAAAQCEeRdzAAAC1klEQVR4nK1V/U+NYRg+/4kxHylUxsx8bD4yH7PxAxmzMfO9qemkcyo5NX1wyEhD6WSpOSXmGG1+UBZJ0rA5FErIGbIoSowu9/1e7znvOfNbvNuznef+uO7rvp/reY4N9f7VWFLQjbh0YHrG6JbmKoZg2ZBQEEB0Kh3xowTUNVkwBMtmoMc6gakOc6Uhgq3+jkljTNCmMVNkxadbMWqTfBti9gEOL/D4NdDaCTS/AFYeAaaZBZYeApqeA2tPEESTL9wFqu8RUGOWHQYedAEpVQI4yQ5U3kHEt70MxhjihNXFFtqKbsCIVabtAdq02MQUYE8F9/k+AdSA5VLBc4vGknpg9gG2sDgPGPpB+/WHnFOUnQz123wGGJsMHK3jfuMpAdQZaOX1J2nc6WGSzm3TaYu1v4ctqi+zhjbXJWBMEnC1DRj+CSw4aALqHLeUMCj5vLQr+yhhk3sF+PUb6JAWv34HFuaSZWIRYytuAxP2Ak+l2LN3xjgswK2lfwNebgUCfUBpA30bigk4NxvoHwIa24FZWcC3YaC2xWBvAW47awFqkp6yVm7qkGKmL6OGhfRkH3UDXR+BdSbbrFojj4DKaIfHAtSZzs8BBqTNm09EDpX0nWvkDHV5m8UvLN3X6DNlZQHuKrcAx8tcEiVgZCRSTtqiHpay1ANRf9sr4EO/KMNlaJSyUUZJppZ2l1MKTi/32raKfVDk8+YTZ6YERCKhr8HPsQk5m1xqXp8yU4c6k3HJbE+/FW5Kw9dm7RVwkWj0yyBtx+o4BgNQgXoH6Ah8pqg14X4nT3JONqVRWBem01Qy7emjTfUaYhhsTb88H4NnZALdvSLmt7x+0WEqcFZzRAr48j1ZzssJPR42I9lexcpq1Nugz9iqQrmSbj4Gup+5H1hzXBi7GKOFEvLlhhVbr44BGGsyMClbT5SDWgzuNSn8ydKluWoLe+oiH9h/WdHBB/Y//wX8ASlYtkPZ5uteAAAAAElFTkSuQmCC
// @include      *://*.javlibrary.com/*
// @include      *://*.o58c.com/*
// @include      *://*.e59f.com/*
// @include      *://onejav.com/*
// @include      *://*.141jav.com/*
// @include      *://*.jav321.com/*
// @include      *://*.javbus.com/*
// @include      /^.*://.*?(busfan|busjav|buscdn|busdmm|dmmbus|seedmm|dmmsee|javsee|seejav).*?\..+$/
// @include      /^.*://.*?avmoo.*?\..+$/
// @include      *://hpjav.tv/*
// @include      *://hpav.tv/*
// @include      *://*.jav321.com/*
// @include      *://jable.tv/*
// @include      *://javdb*.com/*
// @include      /^.*://javdb39\d+\.com.+$/
// @exclude      *://*.javlibrary.com/*/login.php
// @exclude      *://*.javlibrary.com/login.php
// @exclude      *://*.e59f.com/*/login.php
// @exclude      *://*.n53i.com/login.php
// @require      https://cdn.jsdelivr.net/npm/jquery@1.12.4/dist/jquery.min.js
// @connect      pics.dmm.co.jp
// @connect      jp.netcdn.space
// @run-at       document-end
// @grant        window.close
// @grant        window.onurlchange
// @grant        GM_openInTab
// @grant        GM_xmlhttpRequest
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_notification
// @grant        GM_getResourceURL
// @grant        GM_getResourceText
// @grant        GM_addStyle
// @grant        GM_info
/* globals       $ */
// @downloadURL https://update.greasyfork.org/scripts/443200/OneJAVOneWeb%28Revise%29.user.js
// @updateURL https://update.greasyfork.org/scripts/443200/OneJAVOneWeb%28Revise%29.meta.js
// ==/UserScript==
(function () {
    'use strict';
    console.clear();
    console.time('JAV');
    /* Basic */
    /* Version Update Info */
    // @ts-ignore
    if (GM_info.script.version > GM_getValue('version', '2021.0101.0000')) {
        const style = `#onejav_update_mask{position:fixed;top:0;right:0;bottom:0;left:0;z-index:9999;background-color:rgba(0,0,0,0.8)}#onejav_update_mask>#onejav_update_info{width:35%;position:fixed;-webkit-transform:translateX(-50%) translateY(-50%);transform:translateX(-50%) translateY(-50%);top:50%;left:50%;padding:12px;border-style:solid;border-color:#ff1493;border-width:10px;border-radius:20px;background-color:#fff;color:#000;background-clip:padding-box;font-family:'思源黑体'}#onejav_update_mask>#onejav_update_info>#title{font-size:20px;text-align:center}#onejav_update_mask>#onejav_update_info>ul>li{list-style-type:none}#onejav_update_mask>#onejav_update_info>span{color:#ff1493;top:-5px;position:absolute;right:5px;cursor:pointer;font-size:24px}`;
        $('head').append(`<style>${style}</style>`);
        // Update Information
        const msg = ['应网友建议，新增JavDB链接及其站点的支持'];
        const divMsg = $(`<div id="onejav_update_mask"><div id="onejav_update_info"><div id="title">OneJAV更新详情</div><ul></ul><span>✖</span></div></div>`);
        for (let s of msg) {
            divMsg.find('ul').append(`<li>${s}</li>`);
        }
        $('body').prepend(divMsg);
        $('#onejav_update_info>span').on('click', function () {
            // @ts-ignore
            GM_setValue('version', GM_info.script.version);
            $(this).parents('#onejav_update_mask').remove();
            return false;
        });
    }
    else {
        // @ts-ignore
        GM_setValue('version', GM_info.script.version);
    }
    console.info('老司机开车带你飞');
    console.info('%c ', "background:url('data:image/webp;base64,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') no-repeat;padding:98px 125px;");
    console.info('%cOneJAV插件使用了“思源黑体”字，请确保你的计算机安装了该字体\nhttps://github.com/adobe-fonts/source-han-sans/tree/release/OTF/SimplifiedChinese', 'margin:1px;border:3px solid orange;border-radius:5px;padding:3px;line-height:1.8;');
    //@ts-ignore
    GM_registerMenuCommand('更新', () => {
        //@ts-ignore
        GM_openInTab('https://sleazyfork.org/zh-CN/scripts/428639-onejavoneweb', {
            active: true,
            insert: true,
            setParent: true
        });
    });
    //@ts-ignore
    GM_registerMenuCommand('下载思源黑体字体', () => {
        //@ts-ignore
        GM_openInTab('https://cdn.jsdelivr.net/gh/adobe-fonts/source-han-sans@release/OTF/SimplifiedChinese/SourceHanSansSC-Regular.otf', { active: true, insert: true, setParent: true });
    });
    class JAV {
        constructor(i) {
            [this.bango, this.fanHao] = (() => {
                const o = i.trim().replace(/ +/, '-');
                let t = o.match(/FC2-?PPV-?(\d+)/i);
                if ((t = o.match(/FC2-?PPV-?(\d+)/i))) {
                    return [`FC2PPV${t[1]}`, `FC2PPV-${t[1]}`];
                }
                else if ((t = o.match(/([a-zA-Z]+)-?(\d+)/i))) {
                    return [`${t[1].toUpperCase()}${t[2]}`, `${t[1].toUpperCase()}-${t[2]}`];
                }
                else {
                    console.info(`JAV:${i}处理失败，反馈给作者修复bug`);
                    return [i, i];
                }
            })();
            this.data = {
                freejavbt: {
                    name: 'JAV目錄大全',
                    color: '#fe1773',
                    origin: 'https://freejavbt.com',
                    uri: `/${this.fanHao}`
                },
                javmovs: {
                    name: 'JAVMOVS',
                    color: '#79c142',
                    origin: 'https://javmovs.com',
                    uri: `/${this.fanHao}`
                },
                javfree: {
                    name: 'Javfree',
                    color: '#df6e05',
                    origin: 'https://javfree.sh',
                    uri: `/search/movie/${this.fanHao}`
                },
                hpjav: {
                    name: 'HPJAV',
                    color: '#f96364',
                    origin: 'https://hpjav.tv',
                    uri: `/?s=${this.fanHao}`
                },
                javhd: {
                    name: 'JAVHD',
                    color: '#cb000d',
                    origin: 'https://javhd.today',
                    uri: `/search/video/?s=${this.fanHao}`
                },
                javtrust: {
                    name: 'JAVTRUST',
                    color: '#e38a5a',
                    origin: 'https://javtrust.com',
                    uri: `/search/movie/${this.fanHao}.html`
                },
                javfun: {
                    name: 'JAVFUN',
                    color: '#79c142',
                    origin: 'https://www3.javfun.me',
                    uri: `/search/${this.fanHao}`
                },
                bejav: {
                    name: 'BEJAV',
                    color: '#fd6500',
                    origin: 'https://bejav.net',
                    uri: `/search/${this.fanHao}`
                },
                sextop: {
                    name: 'SEXTOP',
                    color: '#c20001',
                    origin: 'https://sextop.net',
                    uri: `/?s=${this.fanHao}&search=Search`
                },
                javdisk: {
                    name: 'JAVDISK',
                    color: '#fe121e',
                    origin: 'https://javdisk.com',
                    uri: `/search.html?q=${this.fanHao}`
                },
                supjav: {
                    name: 'SUPJAV',
                    color: '#d8201d',
                    origin: 'https://supjav.com',
                    uri: `/?s=${this.fanHao}`
                },
                svjav: {
                    name: 'SVJAV',
                    color: '#cc2748',
                    origin: 'https://svjav.com',
                    uri: `/${this.fanHao}/`
                },
                fbjav: {
                    name: 'FBJAV',
                    color: '#365899',
                    origin: 'https://fbjav.com',
                    uri: `/${this.fanHao}/`
                },
                javusa: {
                    name: 'JAVUSA',
                    color: '#0f0f0f',
                    origin: 'https://javusa.com',
                    uri: `/jav/${this.fanHao}/`
                },
                javhdporn: {
                    name: 'JAVHDPorn',
                    color: '#fa9f22',
                    origin: 'https://www2.javhdporn.net',
                    uri: `/video/${this.fanHao}/`
                },
                javhhh: {
                    name: 'JAVHHH',
                    color: '#da2657',
                    origin: 'https://javhhh.com',
                    uri: `/video/${this.fanHao}/`
                },
                kissjav: {
                    name: 'KISSJAV',
                    color: '#00a2e8',
                    origin: 'https://kissjav.com',
                    uri: `/search/video/?s=${this.fanHao}`
                },
                javsky: {
                    name: 'JAVSKY',
                    color: '#ca6e00',
                    origin: 'https://javsky.tv',
                    uri: `/search/movie/${this.fanHao}`
                },
                javdragon: {
                    name: 'JavDragon',
                    color: '#ec4caf',
                    origin: 'https://javdragon.com',
                    uri: `/${this.bango}/`
                },
                javbel: {
                    name: 'JAVBEL',
                    color: '#ff5b15',
                    origin: 'https://javbel.com',
                    uri: `/search.php?q=${this.fanHao}`
                },
                javmix: {
                    name: 'Javmix',
                    color: '#f7c54c',
                    origin: 'https://javmix.tv',
                    uri: `/video/${this.fanHao}/`
                },
                javfor: {
                    name: 'JAV-FOR',
                    color: '#f0542e',
                    origin: 'https://jav-for.me',
                    uri: `/`
                },
                avdrive: {
                    name: 'av-Drive',
                    color: '#8ce1f5',
                    origin: 'https://av-drive.blogspot.com',
                    uri: `/`
                },
                ggjav: {
                    name: 'GGJAV',
                    color: '#2287f0',
                    origin: 'https://ggjav.com',
                    uri: `/ja/main/search?string=${this.fanHao}`
                },
                wideav: {
                    name: 'WideAV',
                    color: '#3e7bee',
                    origin: 'https://wideav.com',
                    uri: `/search?keyword=${this.fanHao}`
                },
                javcl: {
                    name: 'JAVCL',
                    color: '#ffcc00',
                    origin: 'https://javcl.com',
                    uri: `/search/${this.fanHao}/`
                },
                jav321: {
                    name: 'JAV321',
                    color: '#777',
                    origin: 'https://www.jav321.com',
                    uri: `/?bango=${this.fanHao}`
                },
                jable: {
                    name: 'Jable',
                    color: '#0077ac',
                    origin: 'https://jable.tv',
                    uri: `/search/${this.fanHao}/`
                },
                javdb: {
                    name: 'JavDB',
                    color: '#0a0a0a',
                    origin: 'https://javdb39.com',
                    uri: `/search?q=${this.fanHao}`
                },
                onejav: {
                    name: 'OneJAV',
                    color: '#f5da47',
                    origin: 'https://onejav.com',
                    uri: `/search/${this.bango}`
                },
                avmoo: {
                    name: 'AVMOO',
                    color: '#cc0000',
                    origin: 'https://avmoo.click',
                    uri: `/cn/search/${this.fanHao}`
                },
                javbus: {
                    name: 'JavBus',
                    color: '#febe00',
                    origin: 'https://www.seejav.blog',
                    uri: `/search/${this.fanHao}`
                },
                javlibarary: {
                    name: 'JAVLibrary',
                    color: '#f908bb',
                    origin: 'https://www.o58c.com',
                    uri: `/cn/vl_searchbyid.php?keyword=${this.fanHao}`
                },
                sextb: {
                    name: 'SEXTB',
                    color: '#f5c823',
                    origin: 'https://sextb.net',
                    uri: `/${this.fanHao}`
                }
            };
            for (let e in this.data) {
                this.data[e].url = `${this.data[e].origin}${this.data[e].uri}`;
                delete this.data[e].origin;
                delete this.data[e].uri;
            }
        }
        create_table(position = 0) {
            const rows = 4;
            const tableDataLength = Object.keys(this.data).length;
            let tableData = this.data;
            let htmlTable;
            if (position == 0) {
                // absolute
                htmlTable = `<div id="jav_table" style="font-family:'思源黑体';font-weight:700;font-size:18px;display:inline-block;position:absolute;z-index:9999;background-color:#fff;"><table border="1" cellspacing="0" style="border-spacing:0;line-height:1.6;">`;
            }
            else {
                // inherit
                htmlTable = `<div id="jav_table" style="font-family:'思源黑体';font-weight:700;font-size:18px;display:inline-block;inherit:relative;z-index:9999;background-color:#fff;"><table border="1" cellspacing="0" style="border-spacing:0;line-height:1.6;">`;
            }
            let htmlTbody = ``;
            let o = 0;
            if (tableDataLength % rows != 0) {
                for (let index = tableDataLength; index < tableDataLength + rows - (tableDataLength % rows); index++) {
                    tableData[`temp_${index}`] = {
                        name: '',
                        color: '#ffffff',
                        url: '#'
                    };
                }
            }
            for (let index in tableData) {
                if ((o + 1) % rows == 1) {
                    htmlTbody += '<tr>';
                }
                htmlTbody += `<td>&nbsp<a target="_blank" style="color:${tableData[index].color}" href="${tableData[index].url}">${tableData[index].name}</a>&nbsp</td>`;
                if ((o + 1) % rows == 0) {
                    htmlTbody += '</tr>';
                }
                o++;
            }
            htmlTable += `${htmlTbody}</table></div>`;
            return htmlTable;
        }
    }
    /* OneJAV 141jav */
    if (null != location.hostname.match(/onejav.com|141jav.com/)) {
        (() => {
            $('body').on('mouseenter', '.card.mb-3>.container>.columns>.column:even', function () {
                const bango = $(this).parents('.columns').find('.title.is-spaced>a').text().trim();
                const jav = new JAV(bango);
                $(this).prepend(jav.create_table());
                return false;
            });
            $('body').on('mouseleave', '.card.mb-3>.container>.columns>.column:even', function () {
                $(this).find('#jav_table').remove();
                return false;
            });
            // Show a table without no search reasult
            if (null != location.pathname.match(/\/search\/[a-zA-Z0-9-]/) && 0 == $('div.card.mb-3').length) {
                const jav = new JAV(location.pathname.substr(8));
                $('div.container').append(jav.create_table(1));
            }
        })();
    }
    /* avmoo javbus */
    if (null != location.hostname.match(/avmoo|javbus|busfan|busjav|buscdn|busdmm|dmmbus|seedmm|dmmsee|javsee|seejav/)) {
        (() => {
            const showBoxes = $('.movie-box');
            if (1 == showBoxes.length) {
                location.href = showBoxes[0].href;
            }
            $('body').on('mouseenter', '.col-md-9.screencap', function () {
                const bango = $('body > div.container > h3').text().trim().split(' ')[0];
                const jav = new JAV(bango);
                $(this).prepend(jav.create_table());
                return false;
            });
            $('body').on('mouseleave', '.col-md-9.screencap', function () {
                $(this).find('#jav_table').remove();
                return false;
            });
            $('#sample-waterfall > a').each((_, a) => {
                // @ts-ignore
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: a.href,
                    responseType: 'blob',
                    onload: (res) => {
                        const blob = new Blob([res.response], { type: 'image/jpeg' });
                        a.href = URL.createObjectURL(blob);
                    }
                });
            });
        })();
    }
    /* javlibarary */
    if (null != location.hostname.match(/javlibrary|e59f|o58c/)) {
        (() => {
            const style = `.pointer,#onejav_modal *{cursor:pointer}#onejav_modal{color:#dcdcdc;font-size:64px;font-weight:700;font-family:'思源黑体';background-color:rgba(0,0,0,0.8);position:fixed;top:0;right:0;bottom:0;left:0;z-index:99}#onejav_modal img{cursor:default;-webkit-transform:translateX(-50%) translateY(-50%);transform:translateX(-50%) translateY(-50%);position:absolute;top:50%;right:auto;bottom:auto;left:50%}#onejav_modal #left{-webkit-transform:translateY(-50%);transform:translateY(-50%);position:absolute;top:50%;right:auto;bottom:auto;left:10px}#onejav_modal #left::after{content:"◀"}#onejav_modal #left:hover{color:#fff}#onejav_modal #right{-webkit-transform:translateY(-50%);transform:translateY(-50%);position:absolute;top:50%;right:10px;bottom:auto;left:auto}#onejav_modal #right::after{content:"▶"}#onejav_modal #right:hover{color:#fff}#onejav_modal #close{position:absolute;top:0;right:10px;bottom:auto;left:auto}#onejav_modal #close::after{content:"✖"}#onejav_modal #close:hover{color:#fff}`;
            $('head').append(`<style>${style}</style>`);
            const sourceArr = $('#rightcolumn > div.previewthumbs > img').map((_, img) => img.src);
            const srcArr = sourceArr.map((_, source) => {
                const match = source.match(/digital\/video\/(\w+)\/\1-(\d+.jpg)/i);
                const src = source.replace(match[0], `digital/video/${match[1]}/${match[1]}jp-${match[2]}`);
                return src;
            });
            srcArr.each((index, src) => {
                // @ts-ignore
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: src,
                    responseType: 'blob',
                    onload: (res) => {
                        const blob = new Blob([res.response], { type: 'image/jpeg' });
                        srcArr[index] = URL.createObjectURL(blob);
                    }
                });
            });
            const modal = $(`<div id="onejav_modal"><img src="" alt="预览大图"/><div id="left"></div><div id="right"></div><div id="close"></div></div>`);
            $('#rightcolumn > div.previewthumbs > img').each(function (index, img) {
                $(img).addClass('pointer');
                $(img).on('click', () => {
                    modal.find('img')[0].src = srcArr[index];
                    $('body').append(modal);
                    let i = 0;
                    $('body').on('click', '#onejav_modal>#left', () => {
                        i -= 1;
                        if (i < 0) {
                            i = srcArr.length - 1;
                        }
                        $('#onejav_modal>img')[0].src = srcArr[i];
                        return false;
                    });
                    $('body').on('click', '#onejav_modal>#right', () => {
                        i += 1;
                        if (i > srcArr.length - 1) {
                            i = 0;
                        }
                        $('#onejav_modal>img')[0].src = srcArr[i];
                        return false;
                    });
                    $('body').on('click', '#onejav_modal>img', () => {
                        return false;
                    });
                    $('body').on('click', '#onejav_modal', () => {
                        $('#onejav_modal').remove();
                        $('body').off('keydown.onejav');
                        return false;
                    });
                    $('body').on('keydown.onejav', (event) => {
                        if (event.key == 'ArrowLeft') {
                            $('#onejav_modal>#left').trigger('click');
                        }
                        else if (event.key == 'ArrowRight') {
                            $('#onejav_modal>#right').trigger('click');
                        }
                        else if (event.key == 'Escape') {
                            $('#onejav_modal').trigger('click');
                        }
                        return false;
                    });
                    return false;
                });
            });
            $('body').on('mouseenter', '.video', function () {
                const bango = $(this).find('.id').text().trim().split(' ')[0];
                const jav = new JAV(bango);
                const html = `<div class="newBox" style="position:absolute;z-index:9999;top:0;right:0;"><button style="display:block;" link="${jav.data.onejav.url}">${jav.data.onejav.name}</button><button style="display:block;" link="${jav.data.avmoo.url}">${jav.data.avmoo.n6ame}</button><button style="display:block;" link="${jav.data.jable.url}">${jav.data.jable.name}</button></div>`;
                $(this).prepend(html);
                $('.newBox>button').on('click', function () {
                    window.open($(this).attr('link'));
                    return false;
                });
            });
            $('body').on('mouseleave', '.video', function () {
                $(this).find('.newBox').remove();
                return false;
            });
            $('body').on('mouseenter', '#video_jacket', function () {
                const bango = $('#video_title > h3').text().trim().split(' ')[0];
                const jav = new JAV(bango);
                $(this).prepend(jav.create_table());
                return false;
            });
            $('body').on('mouseleave', '#video_jacket', function () {
                $(this).find('#jav_table').remove();
                return false;
            });
        })();
    }
    /* jav321 */
    if (null != location.hostname.match(/jav321/)) {
        (() => {
            if (location.pathname.match(/\/video\/[a-zA-Z0-9-]+/i)) {
                const hinban = $('body > div:nth-child(3) > div.col-md-7.col-md-offset-1.col-xs-12 > div:nth-child(1) > div.panel-body > div:nth-child(1) > div.col-md-9')
                    .text()
                    .match(/品番: ([a-zA-Z0-9-]+)/i);
                const jav = new JAV(hinban[1]);
                $('body > div:nth-child(3) > div.col-md-7.col-md-offset-1.col-xs-12 > div:nth-child(1) > div.panel-body').append(jav.create_table(1));
            }
            const searchParams = new URLSearchParams(location.search.substr(1));
            if (undefined != searchParams.get('bango')) {
                $('body > div:nth-child(2) > div > nav > div > form:nth-child(2) > div > input')[0].value =
                    searchParams.get('bango');
                $('body > div:nth-child(2) > div > nav > div > form:nth-child(2) > div > span > button')[0].click();
                window.close();
            }
        })();
    }
    /* hpjav */
    if (null != location.hostname.match(/hpj?av/)) {
        (() => {
            $('body > div.video-box-ather.container > div:nth-child(1) > div > div.col-md-5').on('mouseenter', function () {
                const bango = location.pathname.slice(location.pathname.lastIndexOf('/') + 1).toUpperCase();
                const jav = new JAV(bango);
                $(this).prepend(jav.create_table());
                return false;
            });
            $('body > div.video-box-ather.container > div:nth-child(1) > div > div.col-md-5').on('mouseleave', function () {
                $(this).find('#jav_table').remove();
                return false;
            });
        })();
    }
    /* jable */
    if (null != location.hostname.match(/jable/i)) {
        (() => {
            const matches = location.pathname.match(/\/videos\/([a-zA-Z0-9-]+)\//i);
            if (matches) {
                const jav = new JAV(matches[1]);
                $('#site-content > div > div > div:nth-child(1) > section.video-info.pb-3').append(jav.create_table(1));
            }
        })();
    }
    /* javdb */
    if (null != location.hostname.match(/javdb39|javdb/i)) {
        const bango = $('body > section > div > h2 > strong').text().trim().split(' ')[0];
        const jav = new JAV(bango);
        $('body > section > div > div.video-meta-panel').after(jav.create_table(1));
    }
    console.timeEnd('JAV');
})();