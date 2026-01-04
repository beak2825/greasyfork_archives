// ==UserScript==
// @name         torrentz2快捷下载
// @namespace    torrentz2
// @version      0.0.2
// @description  在每条搜索结果左侧，添加磁链快捷下载按钮
// @author       allence_frede
// @include     *://torrentz2is.me/search*
// @grant        none
// @require https://code.jquery.com/jquery-3.6.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/426077/torrentz2%E5%BF%AB%E6%8D%B7%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/426077/torrentz2%E5%BF%AB%E6%8D%B7%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function() {
    var cl = 'magnet:?xt=urn:btih:'; //磁力链接协议头
    var icon = '<td style="display: none;"></td><td style="padding: 0;"><a href="[href]" title="磁链下载" style="width: 100%;height: 100%;cursor: pointer;display: flex;justify-content: center;align-items: center;"><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAOCAMAAAAsYw3eAAABCFBMVEX///90wNBurrxyusr07+7S0tNwuclyucdvsL5kprVemqf49PLt6Obq4+J1w9Nzvc1ttsVwtsTFwMBqsMBlrLu6s7KlpaVXjJiKk5WRk5RehIxjf4Z0gIRkeoBVdn3/UkijPjl9LSpvIBz4///y+Pj59vXn8vPw6+rv6unk4uLa3d1gydxcw9Vvvs/Uzc3Gy8rOxsXGxcXMw8Jrs8JoscBvsr9orryys7Owr7Bgoa9SnKtckqBglJ+VnJ6Ej5NEiJONkJGHjpB4hYlmgolPfoZ1eXp5eXlicndrc3ZSbHNpbnFhbXBWa3BWZ2tzXVxrS0qsRD+QQT5sNTKkNjDSNi+bMiu/MCtmIh41j/9jAAAAoElEQVQI1xXHRYLCQAAAwZ5JiOHuuu6Lu7s7/P8nQN0KINhPDKL/PDiXll/TKs2JHdTVj1cahlQCC+iVjLJeNxWpW0GSbulZh6IpRRYjpBT33AGFsNfTIamJMWAfikCbhC5mgBoXZo2IX0xf4D0mLB8h0xVXwRFztX7xNb5Hb/DR/Qo7+csdr59gy50Pz7zu0hcb5E/p/RNsM9l7qtnMhhufzxGJBl8ksAAAAABJRU5ErkJggg==" style="height: 12px;"></a></td>';

    $(function () {
      //搜索结果增加一列显示磁链按钮
      $('.results>table>thead>tr').prepend('<th style="display: none;"></th><th width="70px">Magnet</th>')
      //搜索结果底部单元格调整跨列数，适配样式
      $('tbody>tr:last>td').attr('colspan', '100')
      //搜索结果一律在新页面打开
      $('form[id^=descid]').attr('target', '_blank')
      $('tbody>tr>td.td.hide>.tt-name').each(function () {
        //找到种子的HASH
        var hash = $(this).find('input[name=id]').val()
        //拼接磁链
        var magnet = cl + hash
        //追加按钮
        var icon_new = icon.replace('[href]',magnet)
        $(this).parent().before($(icon_new));
      });
    })
})();