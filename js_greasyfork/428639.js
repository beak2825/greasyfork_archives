/* globals       $ */
// ==UserScript==
// @name         OneJAVOneWeb
// @namespace    https://sleazyfork.org/zh-CN/scripts/428639-onejavoneweb
// @version      2022.0703.1500
// @description  老司机开车带你飞，一个插件畅览几大JAV网站
// @author       匿名老司机
// @license      GPL
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAACXBIWXMAAAAAAAAAAQCEeRdzAAAC1klEQVR4nK1V/U+NYRg+/4kxHylUxsx8bD4yH7PxAxmzMfO9qemkcyo5NX1wyEhD6WSpOSXmGG1+UBZJ0rA5FErIGbIoSowu9/1e7znvOfNbvNuznef+uO7rvp/reY4N9f7VWFLQjbh0YHrG6JbmKoZg2ZBQEEB0Kh3xowTUNVkwBMtmoMc6gakOc6Uhgq3+jkljTNCmMVNkxadbMWqTfBti9gEOL/D4NdDaCTS/AFYeAaaZBZYeApqeA2tPEESTL9wFqu8RUGOWHQYedAEpVQI4yQ5U3kHEt70MxhjihNXFFtqKbsCIVabtAdq02MQUYE8F9/k+AdSA5VLBc4vGknpg9gG2sDgPGPpB+/WHnFOUnQz123wGGJsMHK3jfuMpAdQZaOX1J2nc6WGSzm3TaYu1v4ctqi+zhjbXJWBMEnC1DRj+CSw4aALqHLeUMCj5vLQr+yhhk3sF+PUb6JAWv34HFuaSZWIRYytuAxP2Ak+l2LN3xjgswK2lfwNebgUCfUBpA30bigk4NxvoHwIa24FZWcC3YaC2xWBvAW47awFqkp6yVm7qkGKmL6OGhfRkH3UDXR+BdSbbrFojj4DKaIfHAtSZzs8BBqTNm09EDpX0nWvkDHV5m8UvLN3X6DNlZQHuKrcAx8tcEiVgZCRSTtqiHpay1ANRf9sr4EO/KMNlaJSyUUZJppZ2l1MKTi/32raKfVDk8+YTZ6YERCKhr8HPsQk5m1xqXp8yU4c6k3HJbE+/FW5Kw9dm7RVwkWj0yyBtx+o4BgNQgXoH6Ah8pqg14X4nT3JONqVRWBem01Qy7emjTfUaYhhsTb88H4NnZALdvSLmt7x+0WEqcFZzRAr48j1ZzssJPR42I9lexcpq1Nugz9iqQrmSbj4Gup+5H1hzXBi7GKOFEvLlhhVbr44BGGsyMClbT5SDWgzuNSn8ydKluWoLe+oiH9h/WdHBB/Y//wX8ASlYtkPZ5uteAAAAAElFTkSuQmCC
// @match        *://*.javlibrary.com/*
// @match        *://onejav.com/*
// @match        *://*.141jav.com/*
// @match        *://*.jav321.com/*
// @match        *://*.javbus.com/*
// @match        *://hpjav.tv/*
// @match        *://hpav.tv/*
// @match        *://*.jav321.com/*
// @match        *://jable.tv/*
// @match        *://javdb.com/*
// @match        *://freejavbt.com/*
// @match        *://avmoo.click/*
// @exclude      *://*.javlibrary.com/*/login.php
// @exclude      *://*.javlibrary.com/login.php
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.6.0/jquery.min.js
// @connect      pics.dmm.co.jp
// @connect      jp.netcdn.space
// @run-at       document-idle
// @grant        window.close
// @grant        window.onurlchange
// @grant        GM_openInTab
// @grant        GM_xmlhttpRequest
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_notification
// @grant        GM_getResourceURL
// @grant        GM_getResourceText
// @grant        GM_addStyle
// @grant        GM_info
// @downloadURL https://update.greasyfork.org/scripts/428639/OneJAVOneWeb.user.js
// @updateURL https://update.greasyfork.org/scripts/428639/OneJAVOneWeb.meta.js
// ==/UserScript==
(() => {
    'use strict';
    // console.clear();
    console.time('JAV');
    console.info('老司机开车带你飞');
    console.info('%c ', "background:url('data:image/webp;base64,UklGRuwHAABXRUJQVlA4IOAHAADwPwCdASr6AMMAP73W42s+Mz+pJVNb8/A3iWluul/kqD+zFpTZw9sMvyF2y11qg8h2whWkpbWkvtEoaWWllpZaWR1OVKGZlnra5pOvQq7029DoqdKnSp0c78ZpY3HA+wn055XyL/m1dd7725iXfjDytfKSHSp0qdKd71ckRIpADV2m/Mkw8FwVeBM2XRrV0MJSRVbZfvDvgLh0LTsEqEyypZZqISINwf9ika2p4wRx1fMsnVI8U1QvK0XAv06K2I1ipt+M2ItuLhcsFV3QoBqW9l6nuP9s56mwdze7yGHwELVFJuZMivik5ythHrcjqIQVFMLkBPXMnVJJZRj4iSPYRCE8VMoGNe9e14cVjv9zXk25u11RWnn7Gpl28lncNDHKa3zhh8E1mT6kM0CLXK6g4SZMeZXtoBfWmYNnTqtBZztjUClntjbq8KeaypBOfKZj2FuQhniqnbf5+VF7Qygac942ifgAL8SUdTIOk2u73Yp+e4aSkWVEjeKiMkXGOxddnCxRyPUj1I9TCYM7CmdxgOakyZXfGdHUgeDU3CB5ijLTnILnP/QsgOgEvun/YK79fTns4MqUKOGep4U1QYFDji8k+iUzgdgkMM3m3QBGTXqnSCpAW3sc6Um3XiOKqN+Dre2u+w22aipm/x4UPCY0k3X2SatQG/GojaI9dkxPSH3+keTQbGUAAP7sjm1NTEhPA+8TIfKGmQAG7A2lTthdbtV59/Me/j5+hirPcPUYbLi6/ZIYL4NXX50yNQ7siOkgpTUdmkvYL9M3fcC+TLTWNtpvJ2kRHfEMYpIeAAbWoVhHlDh9U2IVF0Yw/dWOfLjXc+AfdMKg1je7+jGWyiLdAPe8DWl5rvuNmSQJ4WGchw3VTjF5TqRJE1J+XYdkexDfsNgBpDduRc6jEl7Ki3WoMvLaXg39p66FGxrqhLZSN6kWT++8FwBi3tG9Ax1s5xZEsggMnO5+TJbRkohd63GQIMB+fvfRNOu9D8+BRojbZGLE/JjEdjU4F8y/dLJsk+KhHDCd4bdMYnDOPV+U/8r8S9IqKXcrPLfjLyW+8txzhtveeM1mjAihAi8v66Niq/CU07vhLX3VFOqK6tSq1q0rjeeCGk1f0JyoyX6vUSZxrEJXzU1JByvOIJYeo/qCsUaSADc5Hwd9GOOJ14VBUtkv98l3l2d4BaMPT3Y+Cdmqrg/tSBa2AvUSYo/ge/cu8uCH6C50PDIscaZt8bRu6QjHf6raBFxYxzv1Ridgw+ocEqcrQOb7/fKYkBvlCLy+6YKQQTyDmdxwYkUBBazxJsFHEsAe5jS7/ZJtFR8LeQaME3NjorHBaPMQUpVMcw/lJXhN+EahmZ72ZwaP0ZqND3+K1iguFHbYkK72fQyD2hYyDpXCKQuYuMNTeEvCYPtaWKE/HxkypM0okkrcDYuYILd/pcSAAo2Fnityz3uHO/SX9hs1J5ADfrpgxo+UPo3z/Y63h5KTIG8T8r01MLekOJMLPeFN8k5LCwtTTvQ0gPYf6WHAdD0g8htz2dEeQ4458XdMV0FX89xRO7JjutezNTsI7pt29zZAe6YevYCxfJ9Mr3JOodrZ39daLfNb2bMEWMUyMrjcPbpbXg3p/7x7REBSxSDsznru8TDk9InE0ykIVMfJvC67oDiEEFCX1QLMDG18wOphsOVwveWQBL0v3TNkxmTE5Z3c0IjnM1zLFJclcLvc1unnY2ArjhZkpnxVV02rbAlN4Q4BEjsQAPjYR7+93zxsR9dQ/wsEP6BRHH5GqOqbqW6hJZEzXopZkiKxp3u1jPtmGZK3YsmA7ZuDQatzot6sjJgNobuT0rfBXmwO0e49TUFclvHWFuAJARVz5o9K/9iias70D4f5FrCWzLAF0iHByo+lGDTNjCCoA/rSaEZqFQRINJC/jj6+rVhbAE3MiyYlXNiI63n2hKkuf/HvTdhDOWFxY26Y1pK63ZIXhlcfP3ROgU6VwyQtlPzxB/3sgAMud9ajQhZCX+SzQNb2tz1SFGRIJNhrv40LNx+J3FwKQg9uZ4ma//EFMucQ0RgyQODB3XKhqKPD27MOgclZKHIYZxYUPrss+pmERSLVRAu8DzrvUR8kaFsWLJFOrK8DkwgRt5LeU9vMADz6E3x3pBCAvZ/Uod3HK5vNvLUtTEA4Wm/gL6AqjD84M1McsYYTT2csc0gAOjHyOQ1DC/67x+Vpu0znze2fpy4VWfuAjIXQQOY9p+s73sBWjZPDPb5zCiXgsF7FtY/fcuAjkbBVziDQrns0/+tKZ6+TGZ0y5OIz768RUSorrPbI9OThAoR+Fkn3IInVIMK3J1TS3/JioevCgXOQGspIa54BjljlAlOWBac8k5OkxlIMnJACfK1w618NVR4Vfveh1lc7e4NXcveC+WgMxIvDFSTnGintZDgFnTSgN0sXIQFl3LjWcWSjnCGSh3vS0pK9JOLlX02SKfoIQJTdPJ6/0RWLjOQQvuUGUtUK3BXzfBE8cxwnlKD/eb0CngFF4+x1sVZOkOtkoCj7oR8dtNO/bNq6WMsYQsti34hxeB2n1VgR7pb9nm4WSZ2C/8eooC/dxdAuaDf9IdcKxPeF0r7gM7ucC+YTPY7+rJZKOAJd786pPauUL2OmpXZhsYmdgSN+rueQJPjizg168L4aoMYwnQtWkFSTvQ00mB8y6FFCCDpCF5UCAAA=') no-repeat;padding:98px 125px;");
    console.info('%cOneJAV插件使用了“思源黑体”字，请确保你的计算机安装了该字体\nhttps://github.com/adobe-fonts/source-han-sans/tree/release/OTF/SimplifiedChinese', 'margin:1px;border:3px solid orange;border-radius:5px;padding:3px;line-height:1.8;');
    console.info(`jQuery版本: ${$.fn.jquery}`);
    // @ts-ignore
    if (GM_getValue('data', '') != '') {
        let data = [];
        // @ts-ignore
        for (let item of GM_getValue('data')) {
            item.path = item.path.replace('{{fanHao}}', '{{fanhao}}');
            data.push(item);
        }
        // @ts-ignore
        GM_setValue('data', data);
    }
    const jav_configuration = {
        // @ts-ignore data
        data: GM_getValue('data', [
            { name: 'JAV目錄大全', color: '#fe1773', website: 'https://freejavbt.com', path: '/{{fanhao}}' },
            { name: '字幕', color: '#fdba29', website: 'https://www.subtitlecat.com', path: '/index.php?search={{fanhao}}' },
            { name: 'JAVMOVS', color: '#79c142', website: 'https://javmovs.com', path: '/{{fanhao}}' },
            { name: 'Javfree', color: '#df6e05', website: 'https://javfree.sh', path: '/search/movie/{{fanhao}}' },
            { name: 'HPJAV', color: '#f96364', website: 'https://hpjav.tv', path: '/?s={{fanhao}}' },
            { name: 'JAVHD', color: '#cb000d', website: 'https://javhd.today', path: '/search/video/?s={{fanhao}}' },
            { name: 'JAVTRUST', color: '#e38a5a', website: 'https://javtrust.com', path: '/search/movie/{{fanhao}}.html' },
            { name: 'JAVFUN', color: '#79c142', website: 'https://www3.javfun.me', path: '/search/{{fanhao}}' },
            { name: 'BEJAV', color: '#fd6500', website: 'https://bejav.net', path: '/search/{{fanhao}}' },
            { name: 'SEXTOP', color: '#c20001', website: 'https://sextop.net', path: '/?s={{fanhao}}&search=Search' },
            { name: 'JAVDISK', color: '#fe121e', website: 'https://javdisk.com', path: '/search.html?q={{fanhao}}' },
            { name: 'SUPJAV', color: '#d8201d', website: 'https://supjav.com', path: '/?s={{fanhao}}' },
            { name: 'SVJAV', color: '#cc2748', website: 'https://svjav.com', path: '/{{fanhao}}/' },
            { name: 'FBJAV', color: '#365899', website: 'https://fbjav.com', path: '/{{fanhao}}/' },
            { name: 'JAVPLAYER', color: '#2a6fd1', website: 'https://javplayer.org', path: '/v/{{fanhao}}/' },
            { name: 'JAVHDPorn', color: '#fa9f22', website: 'https://www2.javhdporn.net', path: '/video/{{fanhao}}/' },
            { name: 'JAVHHH', color: '#da2657', website: 'https://javhhh.com', path: '/video/{{fanhao}}/' },
            { name: 'KISSJAV', color: '#00a2e8', website: 'https://kissjav.com', path: '/search/video/?s={{fanhao}}' },
            { name: 'JAVSKY', color: '#ca6e00', website: 'https://javsky.tv', path: '/search/movie/{{fanhao}}' },
            { name: 'JavDragon', color: '#ec4caf', website: 'https://javdragon.com', path: '/{{bango}}/' },
            { name: 'JAVBEL', color: '#ff5b15', website: 'https://javbel.com', path: '/search.php?q={{fanhao}}' },
            { name: 'Javmix', color: '#f7c54c', website: 'https://javmix.tv', path: '/video/{{fanhao}}/' },
            { name: 'JAV-FOR', color: '#f0542e', website: 'https://jav-for.me', path: '/' },
            { name: 'GGJAV', color: '#2287f0', website: 'https://ggjav.com', path: '/ja/main/search?string={{fanhao}}' },
            { name: 'JavOnline', color: '#29bac6', website: 'https://www.onejav.online', path: '/?s={{fanhao}}' },
            { name: 'JAVCL', color: '#ffcc00', website: 'https://javcl.com', path: '/search/{{fanhao}}/' },
            { name: 'JAV321', color: '#777', website: 'https://www.jav321.com', path: '/?bango={{fanhao}}' },
            { name: 'Jable', color: '#0077ac', website: 'https://jable.tv', path: '/search/{{fanhao}}/' },
            { name: 'JavDB', color: '#0a0a0a', website: 'https://javdb.com', path: '/search?q={{fanhao}}' },
            { name: 'OneJAV', color: '#f5da47', website: 'https://onejav.com', path: '/search/{{bango}}' },
            { name: 'AVMOO', color: '#cc0000', website: 'https://avmoo.click', path: '/cn/search/{{fanhao}}' },
            { name: 'JavBus', color: '#febe00', website: 'https://www.javbus.com', path: '/search/{{fanhao}}' },
            {
                name: 'JAVLibrary',
                color: '#f908bb',
                website: 'https://www.javlibrary.com',
                path: '/cn/vl_searchbyid.php?keyword={{fanhao}}'
            },
            { name: 'SEXTB', color: '#f5c823', website: 'https://sextb.net', path: '/{{fanhao}}' },
            { name: 'JAVGG', color: '#151515', website: 'https://javgg.net', path: '/jav/{{fanhao}}/' }
        ]),
        // @ts-ignore auto_jump
        auto_jump: GM_getValue('auto_jump', true)
    };
    const html_table_tr_remove = (row) => `<tr data>
    <td name><input type="text" style="color:${row.color};" value="${row.name}"></td>
    <td color><input type="text" value="${row.color}"></td>
    <td website><input type="text" value="${row.website}"></td>
    <td path><input type="text" value="${row.path}"></td>
    <td class="jav_remove" remove></td>
  </tr>`;
    const html_table_tr_add = () => `<tr add>
    <td name><input type="text" title="名称"></td>
    <td color><input type="text" title="颜色"></td>
    <td website><input type="text" title="网站"></td>
    <td path><input type="text" title="路径"></td>
    <td class="jav_add" add></td>
  </tr>`;
    const jav_open_setting_panel = () => {
        let settingHtml = `<div id="jav_mask" class="jav_mask">
      <div id="jav_setting_panel" class="jav_setting_panel">
        <div class="jav_table">
          <table>
            <thead>
              <tr>
                <th>名称</th>
                <th>颜色</th>
                <th>网站</th>
                <th>路径</th>
                <th>⚙</th>
              </tr>
            </thead>
            <tbody></tbody>
          </table>
        </div>
        <div class="info">
          <span>{{fanhao}}:abc-123型番号</span>
          <span>{{FANHAO}}:ABC-123型番号</span>
          <span>{{bango}}:abc123型番号</span>
          <span>{{BANGO}}:ABC123型番号</span>
          <span><a target="_blank" href="https://sleazyfork.org/zh-CN/scripts/428639-onejavoneweb">添加镜像站点支持方法</a></span>
        </div>
        <div>
          <label for="auto_jump">一个查询结果时自动跳转</label>
          <input type="radio" name="auto_jump" value="true">开
          <input type="radio" name="auto_jump" value="false">关
        </div>
        <div>
          <button id="jav_setting_save" class="jav_button_ok">保存并退出</button>
          <button id="jav_setting_cancel" class="jav_button_cancel">取消并退出</button>
        </div>
      </div>
    </div>`;
        $('body').append(settingHtml);
        $('input[name="auto_jump"]')
            .eq(0)
            .prop('checked', jav_configuration.auto_jump ? true : false);
        $('input[name="auto_jump"]')
            .eq(1)
            .prop('checked', jav_configuration.auto_jump ? false : true);
        for (let row of jav_configuration.data) {
            $('#jav_setting_panel>.jav_table>table').append(html_table_tr_remove(row));
        }
        $('#jav_setting_panel>.jav_table>table').append(html_table_tr_add());
    };
    // @ts-ignore
    GM_registerMenuCommand('🛠设置', jav_open_setting_panel);
    // @ts-ignore
    GM_registerMenuCommand('更新', () => {
        // @ts-ignore
        GM_openInTab('https://sleazyfork.org/zh-CN/scripts/428639-onejavoneweb', {
            active: true,
            insert: true,
            setParent: true
        });
    });
    // @ts-ignore
    GM_registerMenuCommand('下载思源黑体字体', () => {
        // @ts-ignore
        GM_openInTab('https://cdn.jsdelivr.net/gh/adobe-fonts/source-han-sans@release/OTF/SimplifiedChinese/SourceHanSansSC-Regular.otf', { active: true, insert: true, setParent: true });
    });
    // @ts-ignore basic style
    GM_addStyle(`.absolute{position:absolute}.relative{position:relative}.jav_tab{overflow:auto;width:410px;max-height:300px;display:flex;flex-direction:column;flex-wrap:wrap;text-align:start;font-family:"思源黑体";font-weight:700;font-size:18px;z-index:999;background-color:#fff}.jav_tab .jav_web{line-height:1.6;cursor:pointer;box-sizing:border-box;border:1px solid #eee}.jav_tab .jav_web:hover{box-shadow:-1px -1px 2px #acacac,1px 1px 2px #acacac}.jav_tab .jav_web:last-child{color:#000}.jav_mask{position:fixed;top:0;right:0;bottom:0;left:0;z-index:1000;background-color:rgba(0,0,0,.8)}.jav_mask .jav_setting_panel{width:800px;max-height:700px;padding:20px 0 20px 10px;background-color:#fff;color:#000;border-radius:20px;transform:translateX(-50%) translateY(-50%);position:fixed;top:50%;left:50%;overflow-y:auto;font-family:"思源黑体";font-size:16px;line-height:1.6;display:flex;flex-direction:column;text-align:start}.jav_mask .jav_setting_panel .jav_table{max-height:400px;overflow-y:auto}.jav_mask .jav_setting_panel .jav_table table{border-collapse:collapse}.jav_mask .jav_setting_panel .jav_table table thead th{height:40px;border:0;margin:0;padding:1px 2px;text-align:center}.jav_mask .jav_setting_panel .jav_table table tbody td{border:0;margin:0;padding:1px 2px}.jav_mask .jav_setting_panel .jav_table table tbody td>input{font-size:16px;width:180px;height:32px}.jav_mask .jav_setting_panel .jav_table table tbody td:nth-child(1)>input{width:140px;font-weight:700}.jav_mask .jav_setting_panel .jav_table table tbody td:nth-child(2)>input{width:90px}.jav_mask .jav_setting_panel .jav_table table tbody td:nth-child(4)>input{width:290px}.jav_mask .jav_setting_panel .jav_table table tbody td:last-child{text-align:center}.jav_mask .jav_setting_panel .jav_table .jav_remove{cursor:pointer}.jav_mask .jav_setting_panel .jav_table .jav_remove::after{content:"➖";background-color:red}.jav_mask .jav_setting_panel .jav_table .jav_add{cursor:pointer}.jav_mask .jav_setting_panel .jav_table .jav_add::after{content:"➕";background-color:#adff2f}.jav_mask .jav_setting_panel>.info{padding:8px 0;display:flex;flex-direction:row;justify-content:space-around}.jav_mask .jav_setting_panel>.info>span{color:#000;font-size:12px}.jav_mask .jav_setting_panel button{font-weight:500;text-decoration:none;text-align:center;display:inline-block;-webkit-appearance:none;-moz-appearance:none;appearance:none;cursor:pointer;border:none;box-sizing:border-box;transition-property:all;transition-duration:.3s;border-radius:4px;font-size:16px;height:30px;line-height:30px;padding:0 30px;margin:5px;color:#fff}.jav_mask .jav_setting_panel button.jav_button_ok{background-color:#1b9af7;border-color:#1b9af7}.jav_mask .jav_setting_panel button.jav_button_cancel{background-color:#a5a5a5;border-color:#a5a5a5}.jav_anima_remove{-webkit-animation:jav_anima_remove .7s forwards;animation:jav_anima_remove .7s forwards}@-webkit-keyframes jav_anima_remove{from{opacity:1}to{opacity:0}}@keyframes jav_anima_remove{from{opacity:1}to{opacity:0}}`);
    // @ts-ignore basic data
    class JAV {
        constructor(i) {
            this.data = [];
            [this.bango, this.fanhao, this.BANGO, this.FANHAO] = (() => {
                const o = i.trim().replace(/ +/, '-');
                let t = o.match(/FC2-?PPV-?(\d+)/i);
                if ((t = o.match(/FC2-?PPV-?(\d+)/i))) {
                    return [`FC2PPV${t[1]}`, `FC2PPV-${t[1]}`];
                }
                else if ((t = o.match(/([a-zA-Z]+)-?(\d+)/i))) {
                    return [
                        `${t[1].toLowerCase()}${t[2]}`,
                        `${t[1].toLowerCase()}-${t[2]}`,
                        `${t[1].toUpperCase()}${t[2]}`,
                        `${t[1].toUpperCase()}-${t[2]}`
                    ];
                }
                else {
                    console.info(`JAV:${i}处理失败，反馈给作者修复bug`);
                    return [i, i, i, i];
                }
            })();
            for (let item of jav_configuration.data) {
                item.url = this.render(`${item.website}${item.path}`);
                this.data.push(item);
            }
        }
        render(i) {
            return i
                .replace('{{fanhao}}', this.fanhao)
                .replace('{{bango}}', this.bango)
                .replace('{{FANHAO}}', this.FANHAO)
                .replace('{{BANGO}}', this.BANGO);
        }
        create_table(position = 0) {
            let html = ``;
            for (let index in this.data) {
                let i = Number(index);
                html += `<div class="jav_web"><a style="text-decoration:none;color:${this.data[i].color};" target="_blank" href="${this.data[i].url}">${this.data[i].name}</a></div>`;
            }
            html += `<div id="jav_setting_button" class="jav_web">🛠设置</div>`;
            if (position == 0) {
                // absolute
                html = `<div id="jav_tab" class="jav_tab absolute">${html}</div>`;
            }
            else {
                // inherit
                html = `<div id="jav_tab" class="jav_tab">${html}</div>`;
            }
            return html;
        }
    }
    $('body').on('click', '#jav_setting_button', jav_open_setting_panel);
    $('body').on('input', 'td[color]>input', function () {
        $(this).parents('tr').find('td[name]>input').eq(0).css('color', $(this).val().toString());
        return false;
    });
    $('body').on('click', 'td[remove]', function () {
        let parent = $(this).parent();
        parent.addClass('jav_anima_remove');
        setTimeout(() => {
            parent.remove();
        }, 500);
        return false;
    });
    $('body').on('click', 'td[add]', function () {
        let name = $(this).siblings('td[name]').find('input').eq(0).val().toString().trim();
        let color = $(this).siblings('td[color]').find('input').eq(0).val().toString().trim();
        let website = $(this).siblings('td[website]').find('input').eq(0).val().toString().trim();
        let path = $(this).siblings('td[path]').find('input').eq(0).val().toString().trim();
        if (name == '' || color == '' || website == '' || path == '') {
            alert('填入内容不能为空');
            return false;
        }
        $('tr[add]').before(html_table_tr_remove({ name, color, website, path }));
        $('tr[add]').find('input').val('');
        $('.jav_table')[0].scrollTo(0, $('.jav_table')[0].scrollHeight);
        return false;
    });
    $('body').on('click', '#jav_setting_save', () => {
        let data = new Array();
        for (let e of $('tr[data]')) {
            let name = $(e).find('input[type="text"]').eq(0).val().toString();
            let color = $(e).find('input[type="text"]').eq(1).val().toString();
            let website = $(e).find('input[type="text"]').eq(2).val().toString();
            let path = $(e).find('input[type="text"]').eq(3).val().toString();
            data.push({ name, color, website, path });
        }
        let auto_jump = $('input[name="auto_jump"]:checked').val() == 'true' ? true : false;
        $('#jav_mask').remove();
        // @ts-ignore save configuration
        GM_setValue('data', data);
        // @ts-ignore save configuration
        GM_setValue('auto_jump', auto_jump);
        return false;
    });
    $('body').on('click', '#jav_setting_cancel', () => {
        $('#jav_mask').remove();
        return false;
    });
    /* OneJAV 141jav */
    if ($('body div.container div.card.mb-3 div.container div.columns div.column:even')[0]) {
        (() => {
            console.info('适配OneJAV 141jav');
            $('body').on('mouseenter', 'div.container div.card.mb-3 div.container div.columns div.column:even', function () {
                const bango = $(this)
                    .siblings('div.column.is-5')
                    .find('div.card-content.is-flex h5.is-4.is-spaced.title a')
                    .text()
                    .trim();
                const jav = new JAV(bango);
                $(this).prepend(jav.create_table());
                return false;
            });
            $('body').on('mouseleave', 'div.container div.card.mb-3 div.container div.columns div.column:even', function () {
                $(this).find('#jav_tab').remove();
                return false;
            });
        })();
    }
    else if ($('body div.container nav.box.breadcrumb ul li.is-active')[0]) {
        (() => {
            console.info('适配OneJAV 141jav');
            // Show a table without no search reasult
            const jav = new JAV(location.pathname.substr(8));
            $('body>div.container').append(jav.create_table(1));
        })();
    }
    /* avmoo javbus */
    if ($('body div.container div.movie.row div.col-md-9.screencap')[0]) {
        (() => {
            console.info('适配avmoo javbus');
            $('body').on('mouseenter', 'div.container div.movie.row div.col-md-9.screencap', function () {
                const bango = $('body div.container h3').text().trim().split(' ')[0];
                const jav = new JAV(bango);
                $(this).prepend(jav.create_table());
                return false;
            });
            $('body').on('mouseleave', 'div.container div.movie.row div.col-md-9.screencap', function () {
                $(this).find('#jav_tab').remove();
                return false;
            });
            $('body div.container div#sample-waterfall a.sample-box').each((_, a) => {
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
    else if ($('body div.container-fluid div.row div div.item a.movie-box').length == 1 &&
        jav_configuration.auto_jump) {
        (() => {
            location.href = $('body div.container-fluid div.row div div.item a.movie-box')[0].href;
        })();
    }
    /* javlibarary */
    if ($('body.main div#content div#rightcolumn table#video_jacket_info tbody tr td div#video_jacket')[0]) {
        (() => {
            console.info('适配javlibrary');
            const style = `.pointer,#javlibrary_modal *{cursor:pointer}#javlibrary_modal{color:#dcdcdc;font-size:64px;font-weight:700;font-family:"思源黑体";background-color:rgba(0,0,0,.8);position:fixed;top:0;right:0;bottom:0;left:0;z-index:99}#javlibrary_modal img{cursor:default;transform:translateX(-50%) translateY(-50%);position:absolute;top:50%;right:auto;bottom:auto;left:50%}#javlibrary_modal #left{transform:translateY(-50%);position:absolute;top:50%;right:auto;bottom:auto;left:10px}#javlibrary_modal #left::after{content:"◀"}#javlibrary_modal #left:hover{color:#fff}#javlibrary_modal #right{transform:translateY(-50%);position:absolute;top:50%;right:10px;bottom:auto;left:auto}#javlibrary_modal #right::after{content:"▶"}#javlibrary_modal #right:hover{color:#fff}#javlibrary_modal #close{position:absolute;top:0;right:10px;bottom:auto;left:auto}#javlibrary_modal #close::after{content:"✖"}#javlibrary_modal #close:hover{color:#fff}`;
            $('head').append(`<style>${style}</style>`);
            const sourceArr = $('body.main div#content div#rightcolumn div.previewthumbs>img').map((_, img) => {
                return img.src;
            });
            const srcArr = sourceArr.map((_, source) => {
                const match = source.match(/digital\/video\/(\w+)\/\1-(\d+.jpg)/i);
                if (match != null) {
                    return source.replace(match[0], `digital/video/${match[1]}/${match[1]}jp-${match[2]}`);
                }
                else {
                    return source;
                }
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
            const modal = $(`<div id="javlibrary_modal"><img src="/img/logo-top.png" alt="预览大图"/><div id="left"></div><div id="right"></div><div id="close"></div></div>`);
            $('body.main div#content div#rightcolumn div.previewthumbs>img').each(function (index, img) {
                $(img).addClass('pointer');
                $(img).on('click', () => {
                    modal.find('img')[0].src = srcArr[index];
                    $('body').append(modal);
                    let i = 0;
                    $('body').on('click', '#javlibrary_modal>#left', () => {
                        i -= 1;
                        if (i < 0) {
                            i = srcArr.length - 1;
                        }
                        $('#javlibrary_modal>img')[0].src = srcArr[i];
                        return false;
                    });
                    $('body').on('click', '#javlibrary_modal>#right', () => {
                        i += 1;
                        if (i > srcArr.length - 1) {
                            i = 0;
                        }
                        $('#javlibrary_modal>img')[0].src = srcArr[i];
                        return false;
                    });
                    $('body').on('click', '#javlibrary_modal>img', () => {
                        return false;
                    });
                    $('body').on('click', '#javlibrary_modal', () => {
                        $('#javlibrary_modal').remove();
                        $('body').off('keydown.onejav');
                        return false;
                    });
                    $('body').on('keydown.onejav', (event) => {
                        if (event.key == 'ArrowLeft') {
                            $('#javlibrary_modal>#left').trigger('click');
                        }
                        else if (event.key == 'ArrowRight') {
                            $('#javlibrary_modal>#right').trigger('click');
                        }
                        else if (event.key == 'Escape') {
                            $('#javlibrary_modal').trigger('click');
                        }
                        return false;
                    });
                    return false;
                });
            });
            $('body').on('mouseenter', '#video_jacket', function () {
                const bango = $('#video_title > h3').text().trim().split(' ')[0];
                const jav = new JAV(bango);
                $(this).prepend(jav.create_table());
                return false;
            });
            $('body').on('mouseleave', '#video_jacket', function () {
                $(this).find('#jav_tab').remove();
                return false;
            });
        })();
    }
    else if ($('body.main div#content div#rightcolumn div.videothumblist div.videos div.video')[0]) {
        (() => {
            console.info('适配javlibrary');
            $('body').on('mouseenter', 'div#content div#rightcolumn div.videothumblist div.videos div.video', function () {
                const bango = $(this).find('.id').text().trim().split(' ')[0];
                const jav = new JAV(bango);
                const html = `<div class="jav_library_newBox" style="position:absolute;z-index:9999;top:0;right:0;"></div>`;
                let jav_library_newBox = $(html);
                const list = ['onejav', 'avmoo', 'javdb', 'jable'];
                // @ts-ignore
                for (let row of jav.data) {
                    if (list.includes(row.name.toLowerCase())) {
                        jav_library_newBox.append(`<button style="display:block;" link="${row.url}">${row.name}</button>`);
                    }
                }
                $(this).prepend(jav_library_newBox);
                return false;
            });
            $('body').on('click', 'div#content div#rightcolumn div.videothumblist div.videos div.video div.jav_library_newBox button', function () {
                window.open($(this).attr('link'));
                return false;
            });
            $('body').on('mouseleave', 'div#content div#rightcolumn div.videothumblist div.videos div.video', function () {
                $(this).find('.jav_library_newBox').remove();
                return false;
            });
        })();
    }
    /* jav321 */
    if ($('body div.row div.col-md-7.col-md-offset-1.col-xs-12 div.panel.panel-info div.panel-body div.row div.col-md-9')[0]) {
        (() => {
            console.info('适配jav321');
            if (location.pathname.match(/\/video\/[a-zA-Z0-9-]+/i)) {
                const hinban = $('body div.row div.col-md-7.col-md-offset-1.col-xs-12 div.panel.panel-info div.panel-body div.row div.col-md-9')
                    .text()
                    .match(/品番: ([a-zA-Z0-9-]+)/i);
                const jav = new JAV(hinban[1]);
                $('body div.row div.col-md-7.col-md-offset-1.col-xs-12 div.panel.panel-info div.panel-body')
                    .eq(0)
                    .append(jav.create_table(1));
            }
        })();
    }
    else if ($("body div.row div.col-md-10.col-md-offset-1.col-xs-12 nav.navbar.navbar-default div.container-fluid form.navbar-form.navbar-left div.form-group.input-group input.form-control[placeholder='品番']")[0]) {
        (() => {
            const searchParams = new URLSearchParams(location.search.substr(1));
            if (undefined != searchParams.get('bango')) {
                $("body div.row div.col-md-10.col-md-offset-1.col-xs-12 nav.navbar.navbar-default div.container-fluid form.navbar-form.navbar-left div.form-group.input-group input.form-control[placeholder='品番']")
                    .eq(0)
                    .val(searchParams.get('bango'));
                $('body > div:nth-child(2) > div > nav > div > form:nth-child(2) > div > span > button')[0].click();
                window.close();
            }
        })();
    }
    /* hpjav */
    if ($('body div.container.video-box-ather div.container div.col-md-12.video-countext div.col-md-5')[0]) {
        (() => {
            console.info('适配hpjav');
            $('body div.container.video-box-ather div.container div.col-md-12.video-countext div.col-md-5').on('mouseenter', function () {
                const bango = location.pathname.slice(location.pathname.lastIndexOf('/') + 1).toUpperCase();
                const jav = new JAV(bango);
                $(this).prepend(jav.create_table());
                return false;
            });
            $('body div.container.video-box-ather div.container div.col-md-12.video-countext div.col-md-5').on('mouseleave', function () {
                $(this).find('#jav_tab').remove();
                return false;
            });
        })();
    }
    /* jable */
    if ($('body.no-touch div#site-content.site-content div.container div.row div.col section.pb-3.video-info')[0]) {
        (() => {
            console.info('适配jable');
            const matches = location.pathname.match(/\/videos\/([a-zA-Z0-9-]+)\//i);
            if (matches) {
                const jav = new JAV(matches[1]);
                $('body.no-touch div#site-content.site-content div.container div.row div.col section.pb-3.video-info')
                    .eq(0)
                    .append(jav.create_table(1));
            }
        })();
    }
    /* javdb */
    if ($('body section.section div.container div.video-detail div.video-meta-panel div.columns.is-desktop div.column nav.movie-panel-info.panel div.first-block.panel-block span.value')[0]) {
        (() => {
            console.info('适配javdb');
            const bango = $('body section.section div.container div.video-detail div.video-meta-panel div.columns.is-desktop div.column nav.movie-panel-info.panel div.first-block.panel-block span.value')
                .eq(0)
                .text()
                .trim()
                .split(' ')[0];
            const jav = new JAV(bango);
            $('body section.section div.container div.video-detail div.video-meta-panel').eq(0).after(jav.create_table(1));
        })();
    }
    /* Free JAV BT */
    if ($('body div.col-lg-10.col-md-10.col-sm-12.col-xl-8.container div.pb-4.video-all-info-wrapper div.col-lg-12.col-md-12.col-sm-12.container.single-video div.row div.col-lg-4.col-md-4.col-sm-12.p-lg-4.p-md-1.single-video-info div.code.d-flex.single-video-meta')[0]) {
        (() => {
            console.info('适配freejavbt');
            const hinban = $('body div.col-lg-10.col-md-10.col-sm-12.col-xl-8.container div.pb-4.video-all-info-wrapper div.col-lg-12.col-md-12.col-sm-12.container.single-video div.row div.col-lg-4.col-md-4.col-sm-12.p-lg-4.p-md-1.single-video-info div.code.d-flex.single-video-meta').eq(0);
            const bango = `${hinban.children('a').eq(0).text()}${hinban.children('span:last-child').eq(0).text()}`;
            const jav = new JAV(bango);
            $('body div.col-lg-10.col-md-10.col-sm-12.col-xl-8.container div.pb-4.video-all-info-wrapper')
                .eq(0)
                .append(jav.create_table(1));
        })();
    }
    console.timeEnd('JAV');
})();
