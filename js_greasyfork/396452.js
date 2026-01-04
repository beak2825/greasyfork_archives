// ==UserScript==
// @name         Bangumi Tools
// @namespace    https://yinr.cc/
// @version      2.4.10
// @description  Bangumi Tools by Yinr
// @author       Yinr
// @icon         https://bgm.tv/img/favicon.ico
// @icon64       https://bgm.tv/img/ico/ico_ios.png
// @include     /^https?://(bgm\.tv|bangumi\.tv|chii\.in)\/.*/
// @grant        GM_addStyle
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/396452/Bangumi%20Tools.user.js
// @updateURL https://update.greasyfork.org/scripts/396452/Bangumi%20Tools.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // PROC# 页面加载 ==================================================

    let urlpath = document.location.pathname;

    // 总样式修改
    (function() {
        GM_addStyle(`
/* 暗色模式下图片加载失败显示(https://bgm.tv/dev/app/1056) */
html[data-theme='dark'] img.code { color: black; }

#TB_window { max-height: 95%; overflow-y: scroll; scrollbar-width: none; }
#TB_window::-webkit-scrollbar { display: none; }
#TB_closeWindowButton { right: 0; top: 0; }
`);
    })();

    // 首页
    if (urlpath === '/') {
        // 标记已看下一话后自动刷新
        $('#prgManager a.prgCheckIn.textTip').on('click', (e) => {
            let $that = $(e.target);
            setTimeout(() => {
                let $ep_id = $that.attr('ep_id');
                let $ep_next = $('#prg_' + $ep_id).closest('li').nextAll().find('.epBtnAir, .epBtnToday').first();
                if ($ep_next.length) {
                    let $ep_next_id_match = $ep_next.attr('id').match(/_(\d+)$/);
                    let $ep_next_title_match = $ep_next.attr('title').match(/(ep.\d+)/);
                    if ($ep_next_id_match && $ep_next_title_match) {
                        $that.attr('ep_id', $ep_next_id_match[1]);
                        $that.attr('data-original-title', $that.attr('data-original-title').replace(/ep.\d+/, $ep_next_title_match[1]));
                        $that.text($that.text().replace(/ep.\d+/, $ep_next_title_match[1]));
                    }
                }
            } , 3 * 1000);
        });
    }
    // 超展开左侧列表页
    else if (urlpath.startsWith('/rakuen/topiclist')) {

        // 插入样式
        (function() {
            GM_addStyle(`
/* 竞拍状态标记样式 */
.auction-notify-before-gt:before { content: ️'↑'; color: red; text-shadow: 1px 1px 1px #ff000099; }
.auction-notify-before-eq:before { content: '='; color: blue; text-shadow: 1px 1px 1px #0000ff99; }
.auction-notify-before-lt:before { content: '↓️'; color: green; text-shadow: 1px 1px 1px #00800099; }
.auction-notify-before-warn:before { content: '!'; color: red; text-shadow: 1px 1px 1px #ff000099; }
.auction-notify-after-gt:after { content: '↑️'; color: red; text-shadow: 1px 1px 1px #ff000099; }
.auction-notify-after-eq:after { content: '='; color: blue; text-shadow: 1px 1px 1px #0000ff99; }
.auction-notify-after-lt:after { content: '↓️'; color: green; text-shadow: 1px 1px 1px #00800099; }
.auction-notify-after-warn:after { content: '!'; color: red; text-shadow: 1px 1px 1px #ff000099; }
.auction-notify-itemlist-nice { box-shadow: inset 0 0 5px green; }
.auction-notify-itemlist-info { box-shadow: inset 0 0 5px blue; }
.auction-notify-itemlist-warn { box-shadow: inset 0 0 5px red; }
.auction-notify-none { text-decoration: line-through; }
html[data-theme='dark'] .auction-notify-before-gt:before { color: lightcoral; text-shadow: 1px 1px 1px #f0808099; }
html[data-theme='dark'] .auction-notify-before-eq:before { color: lightblue; text-shadow: 1px 1px 1px #addbe699; }
html[data-theme='dark'] .auction-notify-before-lt:before { color: lightgreen; text-shadow: 1px 1px 1px #90ee9099; }
html[data-theme='dark'] .auction-notify-before-warn:before { color: lightcoral; text-shadow: 1px 1px 1px #f0808099; }
html[data-theme='dark'] .auction-notify-after-gt:after { color: lightcoral; text-shadow: 1px 1px 1px #f0808099; }
html[data-theme='dark'] .auction-notify-after-eq:after { color: lightblue; text-shadow: 1px 1px 1px #addbe699; }
html[data-theme='dark'] .auction-notify-after-lt:after { color: lightgreen; text-shadow: 1px 1px 1px #90ee9099; }
html[data-theme='dark'] .auction-notify-after-warn:after { color: lightcoral; text-shadow: 1px 1px 1px #f0808099; }
html[data-theme='dark'] .auction-notify-itemlist-nice { box-shadow: inset 0 0 5px lightgreen; }
html[data-theme='dark'] .auction-notify-itemlist-info { box-shadow: inset 0 0 5px lightblue; }
html[data-theme='dark'] .auction-notify-itemlist-warn { box-shadow: inset 0 0 5px lightcoral; }

/* 关注状态标记样式 */
.item-info-tag {
display: inline-block; padding: 0 4px; margin-left: 2px; vertical-align: top;
font-size: 50%; font-weight: bold; text-shadow: 1px 1px 1px #666;
border: none; border-radius: 4px; background: linear-gradient(#4f93cf, #369cf8);
}
.item-info-tags {display: inline-block; transform: translateY(-0.4em); }
.item-info-chara-icon, .item-info-auc-icon, .item-info-ico-icon, .item-info-temple-icon
{ display: inline-block; width: 10px; height: 10px; background-size: contain; margin-left: 2px; }
.item-info-chara-icon
{ background-image:url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAABhGlDQ1BJQ0MgcHJvZmlsZQAAKJF9kT1Iw0AYht+mSlUqInYQcchQnSyIijhqFYpQIdQKrTqYXPoHTRqSFBdHwbXg4M9i1cHFWVcHV0EQ/AFxcnRSdJESv0sKLWK847iH97735e47QKiXmWZ1jAOabpupRFzMZFfF0CsEdKOfJmRmGXOSlITv+LpHgO93MZ7lX/fn6FVzFgMCIvEsM0ybeIN4etM2OO8TR1hRVonPicdMuiDxI9cVj984F1wWeGbETKfmiSPEYqGNlTZmRVMjniKOqppO+ULGY5XzFmetXGXNe/IXhnP6yjLXaQ0jgUUsQYIIBVWUUIaNGO06KRZSdB738Q+5folcCrlKYORYQAUaZNcP/ge/e2vlJye8pHAc6HxxnI8RILQLNGqO833sOI0TIPgMXOktf6UOzHySXmtp0SOgbxu4uG5pyh5wuQMMPhmyKbtSkJaQzwPvZ/RNWWDgFuhZ8/rWPMfpA5CmXiVvgINDYLRA2es+7+5q79u/Nc3+/QDatXJqsNTf9AAAAAlwSFlzAAALEwAACxMBAJqcGAAAA6JJREFUOMuVlEtslVUQx39zvsftfVBuKxYKLa1ijEohsECjLgo23ZgQJcEQZcfOhS58ING4MEogMdEYWbIwxkghFoPBR4xIiQ8IiZi2vCEEilCsfdy+73e+7zvj4lYsz4RJJpOTc+Z3MnPO/OEutnerob8T7NCPRH/vo38vdHxg7paCf7fNxuoiJh02U30/fYWLRVLWr26Ym8LIHXPueF3owYL5wyRB8WWvrrDOq699Pg2KrySFEUKPewO2LIaTX/jYSRrJrdoRFKsIqzOQf+rjaJzm01/6tCy+B2DHlgzppEcqNe/XrmyDyKLWUruiFRc0bY0nPDq2hLcFigC7NgsPLTIYPETAGAspT9+/ctOvNUuaZp2G0oXLDPyxc40aupQQdYoTJU0dT77mkAOf+BQTcPh4pjxPlbUivFS9ZENrw4rHAohBZoAKIj5Xei/EpbOf/66O3SLscza4Kr4yrQ45sp1GP9+0rdi4qi2TKyzIVM8hO7dImDWos5UaZFZNqoj4JJEwNTpKNDZONDkxONrf3RUNn3nLT5XnlrW+sNFDUBSMAGXUVkrEcCPQgWqCAQqFkEKuFtKaeQsfeWJ99/5tR8z0OJ3HD+6OsdOQxIiziLPgLIJFdMa5Kf53LokxXpbjh/bHE9cGdxkRv3+s/1rr2d7DibgIZmAwy+XGtWJBLbgIMcL5U+fS0rmDbRJy1SuVMjz+cPLX0OUrJyImN9TV14NJES+9HsXMuKSgKaIpQohEWU4fPcClY10vGl+/b99ehfmmd5okBZS9fX+eenVoqA8hBrGIZ8GLER/wEkQjxI6io/3oxcMM9X7Exd6e19XpnkQNUP6/3Xs2QRyRe3R18cLSB5vmkwOqAiScQszJygOnlap1CpiEM31msPuQPmB8ndj42U3iUI4hKRshHTOUuyEAyYIEIBnAA0nATYPMgE2AF0+JBDm9VW3iCGKrYTYreQXEA/FBqkByFaBGYFJwAahANks+cVqlMeO3zHISgXOay/jk0OuDgRgwecFUCyasgFBQhUygoRPm2PJt9NBGIEbygVR+hC/wz7DQ8wvlb3fydVwiWfumrFu+jMLCghLHIBFIlup45HZAC2JMlIQ+o0HsfvuB8vlOt2NpM2/X15JKLazpFvl0h767qF02r26XrMtmTDxlp5Mona0fFfvwGahvafDDGu/ZnvcujTk4VreGMQRChbKr9NQoDPxMXmHF8nea77Ml+93AiavJG10Vzr/VrK4oLFhtxgAAAABJRU5ErkJggg=='); }
.item-info-auc-icon
{ background-image:url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAABhGlDQ1BJQ0MgcHJvZmlsZQAAKJF9kT1Iw0AcxV9TxQ8qInYo4pChOlkQFXHUKhShQqgVWnUwufQLmjQkKS6OgmvBwY/FqoOLs64OroIg+AHi5Oik6CIl/i8ptIjx4Lgf7+497t4BQr3MNKtjHNB020wl4mImuyp2vUJADwYQQVBmljEnSUn4jq97BPh6F+NZ/uf+HH1qzmJAQCSeZYZpE28QT2/aBud94jAryirxOfGYSRckfuS64vEb54LLAs8Mm+nUPHGYWCy0sdLGrGhqxFPEUVXTKV/IeKxy3uKslauseU/+wlBOX1nmOs1hJLCIJUgQoaCKEsqwEaNVJ8VCivbjPv4h1y+RSyFXCYwcC6hAg+z6wf/gd7dWfnLCSwrFgc4Xx/kYAbp2gUbNcb6PHadxAgSfgSu95a/UgZlP0mstLXoE9G8DF9ctTdkDLneAyJMhm7IrBWkK+TzwfkbflAUGb4HeNa+35j5OH4A0dZW8AQ4OgdECZa/7vLu7vbd/zzT7+wHzpXJ0393cywAAAAlwSFlzAAALEwAACxMBAJqcGAAAA8hJREFUOMuVU1tsVUUUXXvO3HN6+6KRqi3WUK0SFaJSEU2joqSY0ICFSqjcJjYpKlVDQq2StIgGX/URK/5gIogmhBSNfpj4Cj4/MDEGtRgNaqkx9ia1cNt777nnMefMOTN+tPIo3Ag7mZ+VvdesNXsNoUi1b1qGR7auR21FLdl+vpuIGpVWr2utf1lav7HYGPhswEwaCP0YD/W3IBIC43Z6G2PGDgKY1vp2qeIlAByeYIikOouQzQaaNyzCgeHHMT41DqH8x7zYedaReVaQebhRwTUZj35Mv4ObmhacUyHNBj6e6ENJrhoZMd5DZAye1pm+vPzKb0zDSksl+5SO0XRF9/9b/vPYGDifqGdkvHgK1X/Nn3P1twqqQ8Q+KRW7I97oc5+PvIyNLS/h75HJ4pYrrWq4oeNk/Uk7608i609mq0trv+bM6PAil7zIhVDimTqrdgs0sPP9R5Gs5MUJL7q0HCIOMq50VuaDXH9Vydx+y0ikfOlBnDoUROI1L3J7CyqHvYe2FH9DwyRs/eROxJGCwUzce107G80e2weo1Dl2oGIV37+qYd27o1MjhivdgFB0Vxo/jL2NMArBGb/syInvnwSo+/QBrbU7r7x+3yVlNc1aq+MKWHOWZWYQ1nfdgcMTuxHpGAbja4iMnxfObfzUDQsf2YENO7BhC1skedl7ZWZppxPaV7nSafKl03KGQiJAa+Cr0VcBzWAy6wEGegMEDo3xKTG1eHjiu11Kq7aa8ro98yrr1gG6amY8YjCWnqFw5YYl+Oz3ASxv6IXWerNU4W6hBBex0KEOnw4iZyJdGOs0jZKBCqt8rS2yVbbIwRZ534+8zlCFP51UuG1XOxY1NqBiThKMjKcIbDsBXANgRL0aatBkJfg1cwRE2APQzIfW4MRTJpUMWQlzOjabnl+B62+bj5rai1mkwgGpgh2B8rlQHqQK3rxrwepBRgbart0OO5hCQeQ+yPkZJ+dnCoUg3xXGwZDiEh2LB0Ftm29GV/8KxFkDvvQHiVjPfzcDbMiqYimRjXDfDa8AAPo+vBuUjElBXzMdZPoNwtAv3HNweqnLUwtROCFYxsvs9WO/x4tcuNKBF3lfhsp/+J/McXCLwSw1AAADrQcRSqkBHAVwNJTyJBkA0M5DqSTniSECa9XQMymkPwi4hYHlum99C8QIWmmcT3Gp5Y2hlK3Q03kmIM2Jt1g8mSNGYJygovMjAwAeRMFwrOMvoNEMgs1Aaw3GRzUZeGLZ/gsiAwAexZEfxmGrJvUggYYTzDqcSBD6Vu1HHFwYGQD8C6Dv40ZNwMKjAAAAAElFTkSuQmCC'); }
.item-info-ico-icon
{ background-image:url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAMAAAAM7l6QAAABhGlDQ1BJQ0MgcHJvZmlsZQAAKJF9kT1Iw0AcxV9Ta0UqIlYQcchQnSyIijhqFYpQodQKrTqYXPoFTRqSFBdHwbXg4Mdi1cHFWVcHV0EQ/ABxcnRSdJES/5cUWsR4cNyPd/ced+8AoV5mqtkxDqiaZaTiMTGTXRWDrxDQhwAG0CkxU59LJhPwHF/38PH1LsqzvM/9OXqUnMkAn0g8y3TDIt4gnt60dM77xGFWlBTic+Ixgy5I/Mh12eU3zgWHBZ4ZNtKpeeIwsVhoY7mNWdFQiaeII4qqUb6QcVnhvMVZLVdZ8578haGctrLMdZrDiGMRS0hChIwqSijDQpRWjRQTKdqPefiHHH+SXDK5SmDkWEAFKiTHD/4Hv7s185MTblIoBgRebPtjBAjuAo2abX8f23bjBPA/A1day1+pAzOfpNdaWuQI6N0GLq5bmrwHXO4Ag0+6ZEiO5Kcp5PPA+xl9UxbovwW619zemvs4fQDS1FXiBjg4BEYLlL3u8e6u9t7+PdPs7wfpq3JwocxM2QAAAS9QTFRFblUA////gbxEERIkQn0tAAAA2trbP3osg75EgbxFQn0sPXgrW6IkhMBFP3orf7tBDg8ifbo8RoEuebRAerk2TogxAAAaVpA0c64+ZqE5WpU1bKY8O3kjAAAXd7cvUYsxSoUwYZw3AAATdLM5LWsZaasw5PDZutme9frwMXQSdbFAlJSaAAAdiImQ0eW+8vjsjcJXsdWR1ObDqNCDwt6qTIM6v9C5iquA0d7M4urggKR0l7WOvM62RoEkyOCytN2Jhr9O3evNHx8tKSo4QUFMbW52e3uCTExWXFxknctylsZksNOSWItHZJNWJ3AAobyZc51nU58D2uTXmsSAdq9QUJUhIWMKwOKcrdeApcKVga1kaJpMd6Ngx+eoU5kimMdrqquu6+vrw8XIoqOoNDVBlpiZAgAAAAF0Uk5TAEDm2GYAAAAJcEhZcwAACxMAAAsTAQCanBgAAAFHSURBVCjP1ZI/a8MwEMWD0NIsAosg3WlwhCkELRYUNQnOoDVGJSZjOyT9/l+iJ1tN+i/dOvQGg/Xs9353utnsr6v/XTbgvL/9MzqDaPWNT6JlVNJYtObOn755GzaVqVNaopH9JxsrGaJgzIbddlOBBkRw8XSJZppzQ4/zsTvuuCSfDKMv0QKVYJav23MKvEQZOcm6vCNPw2M7cCBKisI4yQBylOGpXYdtxzVTHEluijl1RLhMVOu23YQ6+yCTYArbXjYu4yI/pLkayShaq9KeVNY0TSMJt1JaFBJZFznieCChjv00O5mjwU2yRzbCap6655cH7TTB2MbBdWyLTMPDYTisgspJ4h7ew2noitO92LR5XQ2VFBpqtC7ur1c29m556OZ1btN/WBE/sREALqyJ/dftsSJLtBHR73/aJoWgb++Tj/3sv9UbToMt591g/JcAAAAASUVORK5CYII='); }
.item-info-temple-icon
{ background-image:url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAABhGlDQ1BJQ0MgcHJvZmlsZQAAKJF9kT1Iw0AcxV9TpSJVByuIKGSoThakijhqFYpQIdQKrTqYXPoFTRqSFBdHwbXg4Mdi1cHFWVcHV0EQ/ABxcnRSdJES/9cUWsR4cNyPd/ced+8AoVZimtUxAWi6bSbjMTGdWRUDrxDQiwGMICozy5iTpAQ8x9c9fHy9i/As73N/jh41azHAJxLPMsO0iTeIpzdtg/M+cYgVZJX4nHjcpAsSP3JdcfmNc77BAs8MmankPHGIWMy3sdLGrGBqxFPEYVXTKV9Iu6xy3uKslSqseU/+wmBWX1nmOs1hxLGIJUgQoaCCIkqwEaFVJ8VCkvZjHv6hhl8il0KuIhg5FlCGBrnhB/+D391aucmomxSMAZ0vjvMxCgR2gXrVcb6PHad+AvifgSu95S/XgJlP0qstLXwE9G0DF9ctTdkDLneAwSdDNuWG5Kcp5HLA+xl9UwbovwW619zemvs4fQBS1FXiBjg4BMbylL3u8e6u9t7+PdPs7weLtXKxP2nsHAAAAAlwSFlzAAALEwAACxMBAJqcGAAAAexJREFUOMul1LtPVEEUBvDfXHZdKhOJVLoFQQvJ+oihMBoT/wIrxMeGh4rG1tLCiJWddjZYyBKEEAtiZ2diTDRWKmhjYaSEwtgI4TEWzIUbXGKALznJmXPOfPnmzJwJXr/lyyfev6O1QsjsCDGyuMiZcxw/qcWp03z8QGsrIdgxQqBcZu4HpZLgcp1KBduQ1QfhQlq9Mf58O6ksLQn6bjRXNnCLleUuPMLFFH2Fe0rlr0ZHmh4/k2XrhEWrD1atLDcwWyCT/Fkryw31weo/+7JMMDC0WX5toB0PMITKf7q3hGd46MXo/EZLs+u3rV3pg2Hcxf4dXstvPMFwmGjIxEipDG27IJP2tCmXhRDSkUPgaj/040gq/IwTyf+Zjni0Se47GiYasiyTbTR0cizdvfvJDhT8SlLSLBdNjm28lK1jMZ2UzGEEMyk+lUyKjaSaJUy35M8uKChcD3YnNVUxHkItkZxNBrWUq6ba7tV8YgSllvwdxmiV9sJInS8oP5zUNMu1F2ZFaTVG4lo+epUtJDkObmlNZ8Gv5FMbY1TKpSbsK/TtT8GfL/QPfhX8fRv7A8HNO+uL3nre/LjT/wa9psYhVwh6cMnu0COEl+uEm1hI47cbLGzKffyUbzP2jIiumkxHJ8dqeyfsqtHR6S+Wb3sPk3BhEAAAAABJRU5ErkJggg=='); }

/* 排序栏样式 */
#rakuenTab { position: sticky; top: 0; z-index: 11; }
#sort-bar {
display: flex; justify-content: left; flex-wrap: wrap; position: sticky; top: 32px; z-index: 10;
padding: 1px 0 1px 10px; border-bottom: 1px solid #CCC; background-color: #ffffffcc; backdrop-filter: blur(2px);
}
html[data-theme='dark'] #sort-bar { background-color: #505050b3; }
#sort-bar a.chiiBtn { margin: 2px 5px 2px 0; padding: 0 6px; cursor: pointer; }
`);})();

        // 列表加载完成
        $('#eden_tpc_list').on('DOMNodeInserted', 'ul .load_more', (e) => {
            // 资金日志分割
            (function() {
                let stop_words = ['冻结', '资产重组'];
                let $tags = $('#eden_tpc_list small.time').filter(
                    (i, el) => stop_words.some(x => el.innerText.includes(x))
                );
                if ($tags.length) {
                    let $firstItem = $tags.first().closest('.item_list');
                    $firstItem.parent().children('hr').remove();
                    if ($firstItem.prev() && !$firstItem.prev().is('#sort-bar')) $firstItem.before('<hr>');
                }
            })();

            // 竞拍状态分割
            (function() {
                let $tags = $('.tag.new').filter((i, el) => el.innerText === '竞拍中');
                if ($tags.length) {
                    let $lastItem = $tags.last().closest('.item_list');
                    $lastItem.parent().children('hr').remove();
                    if (!$lastItem.next().hasClass('load_more')) $lastItem.after('<hr class="no-more">');
                }
            })();

            // 关注状态标记
            $('.item_list').each((i, el) => { followMark($(el)); });

            // 增加排序栏
            setTimeout(addSortBar, 1000);
        });

        // 列表内容插入
        $('#eden_tpc_list').on('DOMNodeInserted', 'ul .inner', (e) => {
            // 竞拍状态标记
            auctionMark($(e.target).closest('.item_list'));
        });
    }
    // 角色页
    else if (urlpath.match(/^(\/rakuen(\/topic\/crt\/)?|\/character\/|\/user\/)/)) {

        GM_addStyle(`
#grailBox .depth .price-rate { left: 5px; font-size: 80%; }
#grailBox .depth .good-price-mark .price-rate { color: green; }
html[data-theme='dark'] #grailBox .depth .good-price-mark .price-rate { color: lightgreen; }
#grailBox .depth .good-price-mark div { box-shadow: inset 0 0 2px 1px green }
`)
        // 深度信息列表加载完成
        $('body').on('DOMNodeInserted', '#grailBox .trade_box .depth li', (e) => {
            if (e.target.tagName === 'LI') {
                // 好价标记
                let $that = $(e.target);
                let fn = () => {
                    setTimeout(() => {
                        goodPriceMark($that) || fn();
                    }, 1000);
                };
                fn();
            }
        });
    }


    // FN#LIST 辅助函数 ==================================================

    // FN#START 文本转数值
    function getVal(str, type = 'float') {
        let nstr = (str + '').replace(',', '').replace('₵', '');
        try {
            switch (type.toLowerCase()){
                case 'f':
                case 'float':
                    return parseFloat(nstr);
                    break;
                case 'i':
                case 'int':
                    return parseInt(nstr);
                    break;
                default:
                    console.warn({errmsg: 'getVal type unsupported', str, type});
                    return undefined;
            }
        } catch (e) { return undefined; }
    };
    // FN#END 文本转数值

    // FN#START 函数尝试执行
    // TODO: WIP
    function tryFn(fn, timeout = 1000) {
        let tryOnce = () => {
            setTimeout(() => {
                fn() || tryOnce();
            }, timeout)
        }; tryOnce();
    }
    // FN#END 函数尝试执行

    // FN#LIST 业务函数 ==================================================

    // FN#START 竞拍状态标记
    function auctionMark(itemList) {
        let itemEl = $(itemList).closest('.item_list');
        if (!itemEl.length || !itemEl.hasClass('item_list')) return;
        if (itemEl.prev('hr').length) return;

        let myAucEl, userAucEl, totalAucEl,
            hasMyAuc, hasUserAuc, hasTotalAuc,
            myAucPrice, myAucCount,
            userAucMember, userAucCount,
            totalAucPrice, totalAucCount;

        myAucEl = itemEl.find('.my_auction');
        hasMyAuc = myAucEl.length > 0;
        userAucEl = itemEl.find('.user_auction');
        hasUserAuc = userAucEl.length > 0;
        totalAucEl = itemEl.find('[title^=拍卖底价]');
        hasTotalAuc = totalAucEl.length > 0;

        if (!hasTotalAuc) return;

        if (hasMyAuc) {
            // ₵出价 / 数量
            let myAuc = myAucEl.text().match(/^₵([0-9.,]+) \/ ([0-9,]+)$/);
            [myAucPrice, myAucCount] = [getVal(myAuc[1]), getVal(myAuc[2])];
        } else {[myAucPrice, myAucCount] = [NaN, 0]}
        if (hasUserAuc) {
            // 竞拍人数 / 竞拍数量
            let userAuc = userAucEl.text().match(/^([0-9,]+) \/ ([0-9,]+)$/);
            [userAucMember, userAucCount] = [getVal(userAuc[1]), getVal(userAuc[2])];
        } else {[userAucMember, userAucCount] = [NaN, 0]}
        if (hasTotalAuc) {
            // ₵拍卖底价 / 拍卖数量
            let totalAuc = totalAucEl.text().match(/^₵([0-9.,]+) \/ ([0-9,]+)$/);
            [totalAucPrice, totalAucCount] = [getVal(totalAuc[1]), getVal(totalAuc[2])];
        }

        if (hasMyAuc && hasTotalAuc) {
            let Day = new Date().getDay();

            if (hasUserAuc) {
                if (myAucPrice > totalAucPrice + 0.01 && userAucCount <= totalAucCount) {
                    // 无竞争竞拍下出价过高
                    myAucEl.addClass('auction-notify-before-gt');
                    itemEl.addClass('auction-notify-itemlist-warn');
                }
            }
            if (myAucPrice === totalAucPrice) myAucEl.addClass('auction-notify-before-eq');
            if (myAucPrice < totalAucPrice) {
                // 出价过低，未达竞拍底价
                myAucEl.addClass('auction-notify-before-warn');
                itemEl.addClass('auction-notify-itemlist-warn');
            }
            if (myAucCount > totalAucCount) {
                myAucEl.addClass('auction-notify-after-gt');
                if (totalAucCount === 0) {
                    // 萌王投票
                    itemEl.addClass('auction-notify-itemlist-info');
                    itemEl.addClass('auction-notify-none');
                } else {
                    // 竞拍数量超额
                    if(Day !== 6) itemEl.addClass('auction-notify-itemlist-warn');
                }
            }
            if (myAucCount === totalAucCount) myAucEl.addClass('auction-notify-after-eq');
            if (myAucCount < totalAucCount) myAucEl.addClass('auction-notify-after-lt');
        }

        if (hasUserAuc) {
            if (userAucMember > 1) userAucEl.addClass('auction-notify-before-gt');
            if (hasMyAuc) {
                if (userAucMember === 1) {
                    // 独自竞拍
                    userAucEl.addClass('auction-notify-before-eq');
                    itemEl.addClass('auction-notify-itemlist-nice');
                }
            }
            if (hasTotalAuc) {
                if (userAucCount > totalAucCount) userAucEl.addClass('auction-notify-after-gt');
                if (userAucCount <= totalAucCount) {
                    // 无竞争拍卖
                    if (hasMyAuc) itemEl.addClass('auction-notify-itemlist-nice');
                    if (userAucCount === totalAucCount) {
                        userAucEl.addClass('auction-notify-after-eq');
                    } else {
                        userAucEl.addClass('auction-notify-after-lt');
                    }
                }
            }
        }

        if (itemEl.hasClass('auction-notify-itemlist-warn')) {
            itemEl.removeClass('auction-notify-itemlist-info');
            itemEl.removeClass('auction-notify-itemlist-nice');
        } else if (itemEl.hasClass('auction-notify-itemlist-info')) {
            itemEl.removeClass('auction-notify-itemlist-nice');
        }

        return true;
    };
    // FN#END 竞拍状态标记

    // FN#START 关注状态标记
    function followMark(itemList) {
        const followInfoTagsClass = 'item-info-tags';
        let followInfoTag = `<small class="${followInfoTagsClass}"></small>`;
        let followChara = '<div title="已关注角色" class="item-info-chara-icon"></div>';
        let followAuc = '<div title="已关注拍卖" class="item-info-auc-icon"></div>';
        let followIco = '<div title="已自动补款" class="item-info-ico-icon"></div>';
        let followTemple = '<div title="已自动建塔" class="item-info-temple-icon"></div>';

        let itemEl = $(itemList);

        let avatarUrl = itemEl.find('a.avatar').attr('href'); // 角色链接中提取角色 ID
        let recMatch = itemEl.find('.row .time').text().match(/#(\d+)/) || ['', '']; // 交易记录中提取角色 ID
        let id = avatarUrl ? avatarUrl.match(/topic\/crt\/(\d+)([?/]|$)/)[1] : recMatch[1];

        let followInfoTagEl = itemEl.find(`.${followInfoTagsClass}`);
        if (!followInfoTagEl.length) followInfoTagEl = itemEl.find('.inner .row').before(followInfoTag).prev();

        if (!(id && followInfoTagEl)) return;

        let followInfo = '';

        let followList = JSON.parse(localStorage.getItem('TinyGrail_followList')) || {'charas': [], 'auctions': []};
        if (followList.charas.includes(id)) followInfo += followChara;
        if (followList.auctions.includes(id)) followInfo += followAuc;

        let autoTempleList = JSON.parse(localStorage.getItem('TinyGrail_autoTempleList')) || [];
        let templeInfo = autoTempleList.filter(e => e.charaId.toString() === id.toString())[0];
        if (templeInfo) {
            followInfo += followTemple;
            if (templeInfo.bidPrice && templeInfo.target) {
                followInfo += `<small title="自动建塔价 × 数量">(${templeInfo.bidPrice} * ${templeInfo.target})</small>`;
            }
        }

        let fillIcoList = JSON.parse(localStorage.getItem('TinyGrail_fillicoList') || []);
        let fillIcoInfo = fillIcoList.filter(e => e.charaId.toString() === id.toString())[0];
        if (fillIcoInfo) {
            followInfo += followIco;
            if (fillIcoInfo.target) {
                followInfo += `<small title="自动补款目标">(lv${fillIcoInfo.target})</small>`;
            }
        }

        followInfoTagEl.html(followInfo);
        return true;
    };
    // FN#END 关注状态标记

    // FN#START 好价标记
    function goodPriceMark(depthEl) {
        let $depth = $(depthEl).closest('li');
        let $grail = $depth.closest('#grailBox');

        let rateMatch = $grail.find('.assets_box .desc .sub').text().match(/\/ \+([0-9.]+)( *\(([0-9.]+)\))/);
        let baseRate = rateMatch ? getVal(rateMatch[1]) : 0,
            sliverRate = rateMatch ? getVal(rateMatch[3]) : 0;
        if (!sliverRate) {
            let lv = $grail.find('.badge.level').text().match(/^lv(\d+)$/);
            lv = lv ? getVal(lv[1], 'int') : 0;
            sliverRate = baseRate * (lv + 1) *0.3;
        }
        let maxRate = Math.max(baseRate, sliverRate),
            price = getVal($depth.attr('data-price'));

        if (maxRate && price !== undefined) {
            let $priceRate = $('<span class="price-rate"></span>');
            let $ul = $depth.closest('ul');
            let priceType, priceRate, goodRate;
            if ($ul.hasClass('ask_depth')) {
                // 卖出订单
                priceType = 'ask';
                priceRate = price === 0 ? 0 : maxRate / price * 10;
                goodRate = 3.0;
            } else if ($ul.hasClass('bid_depth')) {
                // 买入订单
                priceType = 'bid';
                priceRate = price === 0 ? 0 : price / maxRate / 10;
                goodRate = 1.5;
            }

            console.debug({priceType, price, goodRate, maxRate, priceRate});
            if (priceRate >= goodRate) $depth.addClass('good-price-mark');
            $priceRate.text(priceRate.toFixed(2));
            $depth.append($priceRate);

            return true;
        } else {
            console.debug({$depth});
            return false;
        }
    };
    // FN#END 好价标记

    // FN#START 列表排序
    // SET#START 排序关键词函数列表
    let sortKeys = {
        /**
         * 'keyName': Object; 排序关键词，定义如下
         *
         * 'keyName'.title: String; 按钮标题
         * 'keyName'.checker[]: [String | Object], Optional; 判断该项排序关键词在当前页面是否有效，数组中各项同时为 true 方为有效
         * 'keyName'.checker[](Object).selector: String, Optional; jQuery 选择器
         * 'keyName'.checker[](Object).fn: Function, Optional; (selectorElement) => Boolen
         * 'keyName'.checker[](Object).as: String, Optional; 引用 as 指向的 keyName 的 checker （有 .as 则将忽略 .selector 与 .fn）
         * 'keyName'.checker[](String): String, Optional; 若 sortKey 中存在该字符串的 key，则视为 .as，否则视为 .selector。（简写，慎用）
         * 'keyName'.extractor: Function, Optional; el => 'key extractor', 从列表项提取排序关键词值。若无则不作为排序按钮显示，可用于 checker 依赖
         * 'keyName'.tooltip: String, Optional; 按钮提示
         * === DEPRECATED ===
         * 'keyName'.selector: String, Optional; jQuery 选择器，用于判断该项排序关键词在当前页面是否有效
         * 'keyName'.selectorCheck: Function, Optional; el => Boolen, 对 .selector 的进一步有效性判断，参数为 .selector 返回的单个元素，范围 Boolen 值，所有元素只要有一个 true 即为有效
         */
        'title': {'title': '名称', 'checker': [{selector: '.title'}], 'extractor': el => $(el).find('.title').text()},
        'level': {'title': '角色等级', 'checker': [{selector: '.badge[class*=lv]'}], 'extractor': el => $(el).find('.badge[class*=lv]').text()},
        'live-bonus': {'title': '活股股息', 'checker': [{selector: '.inner small.grey', fn: el => el.innerText.startsWith('(')}],
                       'extractor': el => getVal($(el).find('.inner small.grey').text().split(' / ')[0].slice(1))},
        'circulating-share': {'title': '流通股数', 'checker': [{selector: '.inner small.grey', fn: el => el.innerText.includes(' / ')}],
                       'extractor': el => getVal($(el).find('.inner small.grey').text().split(' / ')[1]) || undefined},
        'follow': {'title': '关注角色', 'selector': '.item-info-chara-icon',
                 'extractor': el => $(el).find('.item-info-tags .item-info-chara-icon').length},
        'follow-auc': {'title': '关注拍卖', 'selector': '.item-info-auc-icon',
                 'extractor': el => $(el).find('.item-info-tags .item-info-auc-icon').length},
        'follow-temple': {'title': '自动建塔', 'selector': '.item-info-temple-icon',
                 'extractor': el => $(el).find('.item-info-tags .item-info-temple-icon').length},
        'live-count': {'title': '持有股份', 'selector': 'small[title^=持有股份]',
                         'extractor': el => { let txt = $(el).find('small[title$=固定资产]').text();
                             if (txt.includes(' / ')) { return getVal(txt.split(' / ')[0]) || 0;
                             } else { return 0; }
                         }},
        'dead-count': {'title': '固定资产', 'selector': 'small[title$=固定资产], small[title^=固有资产]',
                         'extractor': el => { let txt = $(el).find('small[title$=固定资产]').text() || $(el).find('small[title$=固有资产]').text();
                             if (txt.includes(' / ')) { return getVal(txt.split(' / ')[1]) || 0;
                             } else { return getVal(txt); }
                         }},
        'current-price-rate': {'title': '股息现价比', 'checker': [
                                    {selector: '.tag', fn: el => $(el).text().match(/^₵([0-9.]+) /) ? true : false},
                                    {selector: '.inner small.grey', fn: el => $(el).text().includes(' / ')}
                                ],
                     'extractor': el => {
                         let liveBonus = getVal($(el).find('.inner small.grey').text().split(' / ')[0].slice(1)) || 0;
                         let currentPrice;
                         try {
                             currentPrice = getVal($(el).find('.tag').text().match(/^₵([0-9.]+) /)[1]);
                         } catch (e) { return undefined; }
                         return liveBonus / currentPrice;
                     }},
        'ico-level': {'title': 'ICO等级', 'checker': [{selector: '.tag:contains(ICO进行中)'}],
                         'extractor': el => {
                             let lvMatch = $(el).find('.tag').attr('class').match(/lv(\d+)/);
                             return lvMatch ? getVal(lvMatch[1]) : undefined;
                         }
                      },
        'ico-time': {'title': 'ICO时间', 'checker': [{as: 'ico-level'}],
                         'extractor': el => {
                             if ($(el).find('.tag:contains(ICO进行中)').length === 0) return undefined;
                             let time = 0,
                                 timeMatch = $(el).find('.time').text().match(/剩余((\d+)天)?((\d+)小时)?((\d+)分种)?/);
                             if (!timeMatch) return undefined;
                             time += getVal(timeMatch[2], 'int') || 0; // Days
                             time *= 24; time += getVal(timeMatch[4], 'int') || 0; // Hours
                             time *= 60; time += getVal(timeMatch[6], 'int') || 0; // Minutes
                             return (7 * 24 * 60 - time);
                         }
                      },
        'auc-my-price': {'title': '我的拍卖价', 'checker': [{selector: '.user_auction, .my_auction, [title^=拍卖]'}],
                         'extractor': el => getVal($(el).find('.my_auction').text().split(' / ')[0]) || 0},
        'auc-my-count': {'title': '我的拍卖数', 'checker': [{as: 'auc-my-price'}],
                         'extractor': el => getVal($(el).find('.my_auction').text().split(' / ')[1]) || 0},
        'auc-user-member': {'title': '竞拍人数', 'checker': [{as: 'auc-my-price'}],
                            'extractor': el => getVal($(el).find('.user_auction').text().split(' / ')[0]) || 0},
        'auc-user-count': {'title': '竞拍数量', 'checker': [{as: 'auc-my-price'}],
                           'extractor': el => getVal($(el).find('.user_auction').text().split(' / ')[1]) || 0},
        'auc-total-price': {'title': '竞拍底价', 'checker': [{as: 'auc-my-price'}],
                            'extractor': el => getVal($(el).find('[title^=拍卖]').text().split(' / ')[0]) || 0},
        'auc-total-count': {'title': '竞拍总数', 'checker': [{as: 'auc-my-price'}],
                            'extractor': el => getVal($(el).find('[title^=拍卖]').text().split(' / ')[1]) || 0},
        'auc-rate': {'title': '拍卖指数', 'checker': [{as: 'auc-my-price'}],
                     'extractor': el => {
                         let liveBonus = getVal($(el).find('.inner small.grey').text().split(' / ')[0].slice(1)) || 0;
                         let basePrice = getVal($(el).find('[title^=拍卖底价]').text().split(' / ')[0]);
                         return liveBonus / basePrice;
                     }},
        'level-drop': {'title': '降级可能性', 'checker': [{as: 'circulating-share'}],
                     'extractor': el => {
                         let auc_user_count = 0, auc_total_count = 0, level = undefined;
                         let ciruclating_share = getVal($(el).find('.inner small.grey').text().split(' / ')[1]) || 0;
                         try {
                             auc_user_count = getVal($(el).find('.user_auction').text().split(' / ')[1]) || 0;
                         } catch (e) {}
                         try {
                             auc_total_count = getVal($(el).find('[title^=拍卖]').text().split(' / ')[1]) || 0;
                         } catch (e) {}
                         try {
                             level = getVal($(el).find('.badge[class*=lv]').text().replace('lv', ''));
                         } catch (e) {}
                         if (level === undefined || isNaN(level)) {
                             let max_level = Math.floor((auc_total_count + ciruclating_share) / 7500);
                             let next_level = Math.floor((auc_user_count + ciruclating_share) / 7500);
                             return max_level > next_level ? 1 : 0;
                         } else {
                             let current_level = level;
                             let next_level = Math.floor(ciruclating_share / 7500);
                             return current_level > next_level ? 1 : 0;
                         }
                         return undefined;
                     }},
    };
    // SET#END

    // 加载排序栏
    function addSortBar() {
        let $ul = $('#eden_tpc_list ul');
        let $sortBar = $('#sort-bar', $ul);

        let $item;
        if (!($item = $('li', $ul)).length) return;

        // 首次加载排序栏
        if (!$sortBar.length) {
            $sortBar = $('<small id="sort-bar"></small>');

            // 排序按钮
            $sortBar.on('click', 'a.sortBtn', (e) => {
                $(e.target).siblings().each((i, el) => $(el).text($(el).text().replace('↑', '').replace('↓', '')));
                let elText = $(e.target).text();
                let asc = true;
                // 排序顺序判断，默认降序
                if (elText.endsWith('↑')) {
                    $(e.target).text(elText.replace('↑', '↓'));
                    asc = false;
                } else if (elText.endsWith('↓')) {
                    $(e.target).text(elText.replace('↓', '↑'));
                } else {
                    $(e.target).text(elText + '↓');
                    asc = false;
                }
                itemListSort([
                    {'fn': sortKeys[$(e.target).attr('data-key-name')].extractor, 'asc': asc}
                ]);
            });
            // 加载更多按钮
            let loadCount = 0;
            $sortBar.on('click', 'a.loadMoreBtn', (e) => {
                let $ul = $(e.target).closest('ul');
                $(e.target).remove();
                //if (e.which === 3) {
                loadCount++;
                if (loadCount % 5 === 0) $ul.find('#sort-bar').removeClass('autoload');
                else $ul.find('#sort-bar').addClass('autoload');
                //}
                $ul.find('.load_more button').click();
            });
        }

        // 单项 Checker 验证
        let verifyChecker = (checker, baseItem = $item, allSortKeys = sortKeys) => {
            let res = false;
            switch (typeof(checker)) {
                case 'string':
                    if (checker in allSortKeys) {
                        res = verifySortKey(allSortKeys[checker]);
                    } else {
                        res = verifyChecker({selector: checker});
                    }
                    break;
                case 'object':
                    if (checker.as) {
                        if (checker.as in allSortKeys) {
                            res = verifySortKey(allSortKeys[checker.as]);
                        } else {
                            res = verifyChecker({selector: checker});
                        }
                        if ('selector' in checker) {
                            console.log('已存在 checker.as 参数，将忽略 checker.selector 参数。');
                            console.log({checker});
                        }
                    } else if (checker.selector) {
                        let $baseItem = $(baseItem);
                        res = $baseItem.find(checker.selector).length > 0;
                        if (res && typeof(checker.fn) === 'function') {
                            res = $(checker.selector, $baseItem).toArray().some(checker.fn);
                        }
                    }
                    break;
                default:
                    console.warn({errmsg: 'checker is invaild', checker, baseItem, allSortKeys})
                    break;
            }
            return res;
        };
        // 排序关键词验证
        let verifySortKey = (sortKey, item = $item, allSortKeys = sortKeys) => {
            let isOk = false, $item = $(item);
            if (sortKey.checker === undefined || sortKey.checker.length === 0) { // Old version of sort keys
                isOk = $item.find(sortKey.selector).length > 0;
                if (isOk && typeof(sortKey.selectorCheck) === 'function') {
                    isOk = Array.from($(sortKey.selector, $item)).some(sortKey.selectorCheck);
                }
            } else {
                switch (typeof(sortKey.checker)) {
                    case 'string':
                        isOk = verifyChecker(sortKey.checker);
                        break;
                    case 'object': // TODO: check if Array
                        isOk = sortKey.checker.every(checker => verifyChecker(checker));
                        break;
                    default:
                        console.warn({errmsg: 'checker is invaild', sortKey});
                        isOk = false;
                        break;
                }
            }
            return isOk;
        }

        // 排序关键词加载
        for (let keyName in sortKeys) {
            let sortKey = sortKeys[keyName];
            if (verifySortKey(sortKey)) {
                if (!$sortBar.find(`[data-key-name=${keyName}]`).length) {
                    let sortTooltip = sortKey.tooltip === undefined ? `按 ${sortKey.title} 排序` : sortKey.tooltip;
                    $sortBar.append(`<a href="#" class="chiiBtn sortBtn" data-key-name="${keyName}" title="${sortTooltip}">${sortKey.title}</a>`);
                }
            } else {
                $sortBar.find(`[data-key-name=${keyName}]`).remove()
            }
        }

        if ($sortBar.children().length) {
            $ul.prepend($sortBar);

            // 加载更多按钮
            let $loadMore = $sortBar.find('.loadMoreBtn');
            if ($('.load_more', $ul).hasClass('sub') || $('hr.no-more', $ul).length) {
                $loadMore.remove();
            } else {
                let autoload = $sortBar.hasClass('autoload');
                if (!$loadMore.length) {
                    $sortBar.prepend('<a class="chiiBtn loadMoreBtn" title="列表加载更多">+</a>');
                    $ul.prepend($sortBar);
                }
                if (autoload) $sortBar.find('.loadMoreBtn').click();
            }
        }
    }

    function itemListSort(keys) {
        /**
         * keys = [{
         *     'fn': (itemEl_li) => {return keyValue},
         *     'asc': Boolen = true
         * }, ...]
         */

        let $ul = $('#eden_tpc_list ul');
        let $sortBar = $('#sort-bar', $ul);
        if (!$sortBar.length) return;
        let $itemEnd = $('hr.no-more', $ul);
        if (!$itemEnd.length) $itemEnd = $('.load_more', $ul);
        let $items = $sortBar.nextUntil($itemEnd);
        $items.sort((i1, i2) => {
            for (let i = 0; i < keys.length; i++) {
                let val1, val2, asc;
                val1 = keys[i].fn(i1);
                val2 = keys[i].fn(i2);
                asc = keys[i].asc === undefined ? 1 : (keys[i].asc ? 1 : -1);
                if (val1 < val2) {
                    return -1 * asc;
                } else if (val1 > val2) {
                    return 1 * asc;
                }
                if (val1 === undefined) {
                    if (val2 === undefined) return 0;
                    else return 1;
                } else if (val2 === undefined) return -1;
            }
            return 0;
        })
        $items.filter(":odd").addClass('line_even').removeClass('line_odd');
        $items.filter(":even").addClass('line_odd').removeClass('line_even');
        $sortBar.after($items);
    };
    // FN#END 列表排序

})();