// ==UserScript==
// @name        TinyGrail Helper Next
// @description 为小圣杯增加一些小功能, 讨论/反馈：https://bgm.tv/group/topic/358167
// @namespace   https://gitee.com/Yinr/TinyGrail-Helper-Next
// @include     http*://bgm.tv/*
// @include     http*://bangumi.tv/*
// @include     http*://chii.in/*
// @version     3.2.6
// @author      Liaune, Cedar, no1xsyzy(InQβ), Yinr
// @homepage    https://github.com/Yinr/TinyGrail-Helper-Next
// @license     MIT
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/408216/TinyGrail%20Helper%20Next.user.js
// @updateURL https://update.greasyfork.org/scripts/408216/TinyGrail%20Helper%20Next.meta.js
// ==/UserScript==
(function () {
  'use strict';

  var css_248z = "#grail li.title.hide_grail_title h2:after{font-size:12px;content:\"(点击显示)\"}#grail .temple_list .item{margin:5px 5px 5px 0;width:107px}.hide_grail{display:none!important}#valhalla li.initial_item.chara .valhalla-sacrifices{margin-top:2px;text-align:center;line-height:0;white-space:nowrap}ul.timelineTabs li a{margin:2px 0 0;padding:5px 10px}.item-info-tag{padding:0 4px;margin-left:2px;vertical-align:top;font-size:50%;font-weight:700;text-shadow:1px 1px 1px #666;border:none;border-radius:4px;background:linear-gradient(#4f93cf,#369cf8)}.item-info-tag,.item-info-tags{display:inline-block}.item-info-tags .item-info-tag{display:inline-block;padding:0;width:10px;height:10px;background-size:contain;margin-left:2px}.item-info-tags .item-info-chara-icon{background-image:url(\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAABhGlDQ1BJQ0MgcHJvZmlsZQAAKJF9kT1Iw0AYht+mSlUqInYQcchQnSyIijhqFYpQIdQKrTqYXPoHTRqSFBdHwbXg4M9i1cHFWVcHV0EQ/AFxcnRSdJESv0sKLWK847iH97735e47QKiXmWZ1jAOabpupRFzMZFfF0CsEdKOfJmRmGXOSlITv+LpHgO93MZ7lX/fn6FVzFgMCIvEsM0ybeIN4etM2OO8TR1hRVonPicdMuiDxI9cVj984F1wWeGbETKfmiSPEYqGNlTZmRVMjniKOqppO+ULGY5XzFmetXGXNe/IXhnP6yjLXaQ0jgUUsQYIIBVWUUIaNGO06KRZSdB738Q+5folcCrlKYORYQAUaZNcP/ge/e2vlJye8pHAc6HxxnI8RILQLNGqO833sOI0TIPgMXOktf6UOzHySXmtp0SOgbxu4uG5pyh5wuQMMPhmyKbtSkJaQzwPvZ/RNWWDgFuhZ8/rWPMfpA5CmXiVvgINDYLRA2es+7+5q79u/Nc3+/QDatXJqsNTf9AAAAAlwSFlzAAALEwAACxMBAJqcGAAAA6JJREFUOMuVlEtslVUQx39zvsftfVBuKxYKLa1ijEohsECjLgo23ZgQJcEQZcfOhS58ING4MEogMdEYWbIwxkghFoPBR4xIiQ8IiZi2vCEEilCsfdy+73e+7zvj4lYsz4RJJpOTc+Z3MnPO/OEutnerob8T7NCPRH/vo38vdHxg7paCf7fNxuoiJh02U30/fYWLRVLWr26Ym8LIHXPueF3owYL5wyRB8WWvrrDOq699Pg2KrySFEUKPewO2LIaTX/jYSRrJrdoRFKsIqzOQf+rjaJzm01/6tCy+B2DHlgzppEcqNe/XrmyDyKLWUruiFRc0bY0nPDq2hLcFigC7NgsPLTIYPETAGAspT9+/ctOvNUuaZp2G0oXLDPyxc40aupQQdYoTJU0dT77mkAOf+BQTcPh4pjxPlbUivFS9ZENrw4rHAohBZoAKIj5Xei/EpbOf/66O3SLscza4Kr4yrQ45sp1GP9+0rdi4qi2TKyzIVM8hO7dImDWos5UaZFZNqoj4JJEwNTpKNDZONDkxONrf3RUNn3nLT5XnlrW+sNFDUBSMAGXUVkrEcCPQgWqCAQqFkEKuFtKaeQsfeWJ99/5tR8z0OJ3HD+6OsdOQxIiziLPgLIJFdMa5Kf53LokxXpbjh/bHE9cGdxkRv3+s/1rr2d7DibgIZmAwy+XGtWJBLbgIMcL5U+fS0rmDbRJy1SuVMjz+cPLX0OUrJyImN9TV14NJES+9HsXMuKSgKaIpQohEWU4fPcClY10vGl+/b99ehfmmd5okBZS9fX+eenVoqA8hBrGIZ8GLER/wEkQjxI6io/3oxcMM9X7Exd6e19XpnkQNUP6/3Xs2QRyRe3R18cLSB5vmkwOqAiScQszJygOnlap1CpiEM31msPuQPmB8ndj42U3iUI4hKRshHTOUuyEAyYIEIBnAA0nATYPMgE2AF0+JBDm9VW3iCGKrYTYreQXEA/FBqkByFaBGYFJwAahANks+cVqlMeO3zHISgXOay/jk0OuDgRgwecFUCyasgFBQhUygoRPm2PJt9NBGIEbygVR+hC/wz7DQ8wvlb3fydVwiWfumrFu+jMLCghLHIBFIlup45HZAC2JMlIQ+o0HsfvuB8vlOt2NpM2/X15JKLazpFvl0h767qF02r26XrMtmTDxlp5Mona0fFfvwGahvafDDGu/ZnvcujTk4VreGMQRChbKr9NQoDPxMXmHF8nea77Ml+93AiavJG10Vzr/VrK4oLFhtxgAAAABJRU5ErkJggg==\")}.item-info-tags .item-info-auc-icon{background-image:url(\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAABhGlDQ1BJQ0MgcHJvZmlsZQAAKJF9kT1Iw0AcxV9TxQ8qInYo4pChOlkQFXHUKhShQqgVWnUwufQLmjQkKS6OgmvBwY/FqoOLs64OroIg+AHi5Oik6CIl/i8ptIjx4Lgf7+497t4BQr3MNKtjHNB020wl4mImuyp2vUJADwYQQVBmljEnSUn4jq97BPh6F+NZ/uf+HH1qzmJAQCSeZYZpE28QT2/aBud94jAryirxOfGYSRckfuS64vEb54LLAs8Mm+nUPHGYWCy0sdLGrGhqxFPEUVXTKV/IeKxy3uKslauseU/+wlBOX1nmOs1hJLCIJUgQoaCKEsqwEaNVJ8VCivbjPv4h1y+RSyFXCYwcC6hAg+z6wf/gd7dWfnLCSwrFgc4Xx/kYAbp2gUbNcb6PHadxAgSfgSu95a/UgZlP0mstLXoE9G8DF9ctTdkDLneAyJMhm7IrBWkK+TzwfkbflAUGb4HeNa+35j5OH4A0dZW8AQ4OgdECZa/7vLu7vbd/zzT7+wHzpXJ0393cywAAAAlwSFlzAAALEwAACxMBAJqcGAAAA8hJREFUOMuVU1tsVUUUXXvO3HN6+6KRqi3WUK0SFaJSEU2joqSY0ICFSqjcJjYpKlVDQq2StIgGX/URK/5gIogmhBSNfpj4Cj4/MDEGtRgNaqkx9ia1cNt777nnMefMOTN+tPIo3Ag7mZ+VvdesNXsNoUi1b1qGR7auR21FLdl+vpuIGpVWr2utf1lav7HYGPhswEwaCP0YD/W3IBIC43Z6G2PGDgKY1vp2qeIlAByeYIikOouQzQaaNyzCgeHHMT41DqH8x7zYedaReVaQebhRwTUZj35Mv4ObmhacUyHNBj6e6ENJrhoZMd5DZAye1pm+vPzKb0zDSksl+5SO0XRF9/9b/vPYGDifqGdkvHgK1X/Nn3P1twqqQ8Q+KRW7I97oc5+PvIyNLS/h75HJ4pYrrWq4oeNk/Uk7608i609mq0trv+bM6PAil7zIhVDimTqrdgs0sPP9R5Gs5MUJL7q0HCIOMq50VuaDXH9Vydx+y0ikfOlBnDoUROI1L3J7CyqHvYe2FH9DwyRs/eROxJGCwUzce107G80e2weo1Dl2oGIV37+qYd27o1MjhivdgFB0Vxo/jL2NMArBGb/syInvnwSo+/QBrbU7r7x+3yVlNc1aq+MKWHOWZWYQ1nfdgcMTuxHpGAbja4iMnxfObfzUDQsf2YENO7BhC1skedl7ZWZppxPaV7nSafKl03KGQiJAa+Cr0VcBzWAy6wEGegMEDo3xKTG1eHjiu11Kq7aa8ro98yrr1gG6amY8YjCWnqFw5YYl+Oz3ASxv6IXWerNU4W6hBBex0KEOnw4iZyJdGOs0jZKBCqt8rS2yVbbIwRZ534+8zlCFP51UuG1XOxY1NqBiThKMjKcIbDsBXANgRL0aatBkJfg1cwRE2APQzIfW4MRTJpUMWQlzOjabnl+B62+bj5rai1mkwgGpgh2B8rlQHqQK3rxrwepBRgbart0OO5hCQeQ+yPkZJ+dnCoUg3xXGwZDiEh2LB0Ftm29GV/8KxFkDvvQHiVjPfzcDbMiqYimRjXDfDa8AAPo+vBuUjElBXzMdZPoNwtAv3HNweqnLUwtROCFYxsvs9WO/x4tcuNKBF3lfhsp/+J/McXCLwSw1AAADrQcRSqkBHAVwNJTyJBkA0M5DqSTniSECa9XQMymkPwi4hYHlum99C8QIWmmcT3Gp5Y2hlK3Q03kmIM2Jt1g8mSNGYJygovMjAwAeRMFwrOMvoNEMgs1Aaw3GRzUZeGLZ/gsiAwAexZEfxmGrJvUggYYTzDqcSBD6Vu1HHFwYGQD8C6Dv40ZNwMKjAAAAAElFTkSuQmCC\")}.item-info-tags .item-info-ico-icon{background-image:url(\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAMAAAAM7l6QAAABhGlDQ1BJQ0MgcHJvZmlsZQAAKJF9kT1Iw0AcxV9Ta0UqIlYQcchQnSyIijhqFYpQodQKrTqYXPoFTRqSFBdHwbXg4Mdi1cHFWVcHV0EQ/ABxcnRSdJES/5cUWsR4cNyPd/ced+8AoV5mqtkxDqiaZaTiMTGTXRWDrxDQhwAG0CkxU59LJhPwHF/38PH1LsqzvM/9OXqUnMkAn0g8y3TDIt4gnt60dM77xGFWlBTic+Ixgy5I/Mh12eU3zgWHBZ4ZNtKpeeIwsVhoY7mNWdFQiaeII4qqUb6QcVnhvMVZLVdZ8578haGctrLMdZrDiGMRS0hChIwqSijDQpRWjRQTKdqPefiHHH+SXDK5SmDkWEAFKiTHD/4Hv7s185MTblIoBgRebPtjBAjuAo2abX8f23bjBPA/A1day1+pAzOfpNdaWuQI6N0GLq5bmrwHXO4Ag0+6ZEiO5Kcp5PPA+xl9UxbovwW619zemvs4fQDS1FXiBjg4BEYLlL3u8e6u9t7+PdPs7wfpq3JwocxM2QAAAS9QTFRFblUA////gbxEERIkQn0tAAAA2trbP3osg75EgbxFQn0sPXgrW6IkhMBFP3orf7tBDg8ifbo8RoEuebRAerk2TogxAAAaVpA0c64+ZqE5WpU1bKY8O3kjAAAXd7cvUYsxSoUwYZw3AAATdLM5LWsZaasw5PDZutme9frwMXQSdbFAlJSaAAAdiImQ0eW+8vjsjcJXsdWR1ObDqNCDwt6qTIM6v9C5iquA0d7M4urggKR0l7WOvM62RoEkyOCytN2Jhr9O3evNHx8tKSo4QUFMbW52e3uCTExWXFxknctylsZksNOSWItHZJNWJ3AAobyZc51nU58D2uTXmsSAdq9QUJUhIWMKwOKcrdeApcKVga1kaJpMd6Ngx+eoU5kimMdrqquu6+vrw8XIoqOoNDVBlpiZAgAAAAF0Uk5TAEDm2GYAAAAJcEhZcwAACxMAAAsTAQCanBgAAAFHSURBVCjP1ZI/a8MwEMWD0NIsAosg3WlwhCkELRYUNQnOoDVGJSZjOyT9/l+iJ1tN+i/dOvQGg/Xs9353utnsr6v/XTbgvL/9MzqDaPWNT6JlVNJYtObOn755GzaVqVNaopH9JxsrGaJgzIbddlOBBkRw8XSJZppzQ4/zsTvuuCSfDKMv0QKVYJav23MKvEQZOcm6vCNPw2M7cCBKisI4yQBylOGpXYdtxzVTHEluijl1RLhMVOu23YQ6+yCTYArbXjYu4yI/pLkayShaq9KeVNY0TSMJt1JaFBJZFznieCChjv00O5mjwU2yRzbCap6655cH7TTB2MbBdWyLTMPDYTisgspJ4h7ew2noitO92LR5XQ2VFBpqtC7ur1c29m556OZ1btN/WBE/sREALqyJ/dftsSJLtBHR73/aJoWgb++Tj/3sv9UbToMt591g/JcAAAAASUVORK5CYII=\")}.item-info-tags .item-info-temple-icon{background-image:url(\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAABhGlDQ1BJQ0MgcHJvZmlsZQAAKJF9kT1Iw0AcxV9TpSJVByuIKGSoThakijhqFYpQIdQKrTqYXPoFTRqSFBdHwbXg4Mdi1cHFWVcHV0EQ/ABxcnRSdJES/9cUWsR4cNyPd/ced+8AoVZimtUxAWi6bSbjMTGdWRUDrxDQiwGMICozy5iTpAQ8x9c9fHy9i/As73N/jh41azHAJxLPMsO0iTeIpzdtg/M+cYgVZJX4nHjcpAsSP3JdcfmNc77BAs8MmankPHGIWMy3sdLGrGBqxFPEYVXTKV9Iu6xy3uKslSqseU/+wmBWX1nmOs1hxLGIJUgQoaCCIkqwEaFVJ8VCkvZjHv6hhl8il0KuIhg5FlCGBrnhB/+D391aucmomxSMAZ0vjvMxCgR2gXrVcb6PHad+AvifgSu95S/XgJlP0qstLXwE9G0DF9ctTdkDLneAwSdDNuWG5Kcp5HLA+xl9UwbovwW619zemvs4fQBS1FXiBjg4BMbylL3u8e6u9t7+PdPs7weLtXKxP2nsHAAAAAlwSFlzAAALEwAACxMBAJqcGAAAAexJREFUOMul1LtPVEEUBvDfXHZdKhOJVLoFQQvJ+oihMBoT/wIrxMeGh4rG1tLCiJWddjZYyBKEEAtiZ2diTDRWKmhjYaSEwtgI4TEWzIUbXGKALznJmXPOfPnmzJwJXr/lyyfev6O1QsjsCDGyuMiZcxw/qcWp03z8QGsrIdgxQqBcZu4HpZLgcp1KBduQ1QfhQlq9Mf58O6ksLQn6bjRXNnCLleUuPMLFFH2Fe0rlr0ZHmh4/k2XrhEWrD1atLDcwWyCT/Fkryw31weo/+7JMMDC0WX5toB0PMITKf7q3hGd46MXo/EZLs+u3rV3pg2Hcxf4dXstvPMFwmGjIxEipDG27IJP2tCmXhRDSkUPgaj/040gq/IwTyf+Zjni0Se47GiYasiyTbTR0cizdvfvJDhT8SlLSLBdNjm28lK1jMZ2UzGEEMyk+lUyKjaSaJUy35M8uKChcD3YnNVUxHkItkZxNBrWUq6ba7tV8YgSllvwdxmiV9sJInS8oP5zUNMu1F2ZFaTVG4lo+epUtJDkObmlNZ8Gv5FMbY1TKpSbsK/TtT8GfL/QPfhX8fRv7A8HNO+uL3nre/LjT/wa9psYhVwh6cMnu0COEl+uEm1hI47cbLGzKffyUbzP2jIiumkxHJ8dqeyfsqtHR6S+Wb3sPk3BhEAAAAABJRU5ErkJggg==\")}#grailBox .trade_box button{min-width:50px;padding:0 9px}#grailBox .hide_grail_block_title:after{font-size:12px;content:\" (点击显示)\"}#grailBox .hide_grail_block_on{display:none!important}#grailBox .hide_grail_block_not_me .link:not(.my_link),#grailBox .hide_grail_block_not_me .rank_list:not(.my_rank),#grailBox .hide_grail_block_not_me>.item:not(.my_temple){display:none}#grailBox .my_auction,#TB_window .my_auction{color:#ffa7cc;margin-right:5px}#grailBox .user_auction,#TB_window .user_auction{color:#a7e3ff;margin-right:5px}.assets .my_temple.item .name a{font-weight:700;color:#0084b4}.assets .my_temple.item .card{box-shadow:3px 3px 5px #ffeb3b;border:1px solid #ffc107}html[data-theme=dark] .assets .my_temple.item .card{box-shadow:0 0 15px #ffeb3b;border:1px solid #ffc107}.assets_box .item{margin:5px 5px 5px 0;width:90px}.assets_box .item .card{width:90px;height:120px}#lastTemples .assets .item{margin:5px 5px 5px 0;width:107px}.item .card{width:105px;height:140px}.link.swapped .swapPos{text-decoration:underline}.link .swapPos{margin-left:.5em;cursor:pointer}#TB_overlay{z-index:102}#TB_window[data-name]{z-index:102;padding:7px;box-shadow:0 0 4px 1px #56bce0}#TB_window .action .text_button{margin:0 8px 0 0;padding:0;width:-webkit-fit-content;width:-moz-fit-content;width:fit-content;height:-webkit-fit-content;height:-moz-fit-content;height:fit-content;min-width:-webkit-fit-content;min-width:-moz-fit-content;min-width:fit-content}#TB_window .desc .text_button{cursor:pointer}#TB_window img.cover{background-color:transparent}#TB_window.temple .container{text-align:center}#TB_window.temple .container .line{text-align:left}#TB_window .dialog-tab-titlebar{display:flex;margin-top:8px;border-bottom:2px solid;padding:0 8px}#TB_window .dialog-tab-titlebar .dialog-tab-title{cursor:pointer;padding:2px 8px;opacity:.8;border:1px solid;border-bottom:none;border-radius:5px 5px 0 0}#TB_window .dialog-tab-titlebar .dialog-tab-title.open{font-weight:700;opacity:1;border-width:2px}#TB_window .setting-tab-content table{width:98%;text-align:center;border-spacing:0}#TB_window .setting-tab-content table input[type=number]{width:7em}#TB_window .setting-tab-content table input[type=number].chara-id{width:5em}#TB_window .setting-tab-content table input[type=number].chara-level{width:4em}#TB_window .setting-tab-content table tr{border-top:1px dotted}#TB_window .setting-tab-content table tr.hide-row{display:none}#TB_window .setting-tab-content table tr td{text-align:left;vertical-align:middle;padding:5px}#TB_window .setting-tab-content table tr td:first-child{width:60%}#TB_window .setting-tab-content table tr.setting-collapse{cursor:pointer}#TB_window .setting-tab-content table tr.setting-collapse td:before{content:\"▾ \"}#TB_window .setting-tab-content table tr.setting-collapse.setting-collapse-close td:before{content:\"▸ \"}#TB_window .setting-tab-content table tr.setting-collapse-item td:first-child{padding-left:1.2em}#TB_window .setting-tab-content table .setting-row-btn td{vertical-align:baseline}#TB_window .setting-tab-content table .txtBtn{font-size:smaller;text-decoration:underline;cursor:pointer}#TB_window .batch-tab-content .batch-element{padding:0 2px}#TB_window .batch-tab-content [title]{border-bottom:thin dotted}";
  GM_addStyle(css_248z);

  const configGenerator = (name, defaultValue, config = {}) => {
    const storageName = `TinyGrail_${name}`;
    const { postGet, preSet, storage } = {
      storage: localStorage,
      ...config
    };
    return {
      name,
      storageName,
      getRaw () {
        return storage.getItem(storageName)
      },
      get () {
        let value = null;
        try {
          value = JSON.parse(this.getRaw());
          if (postGet) {
            value = postGet(value);
          }
        } catch (err) {
          console.error(`Fail to get config of ${storageName}`, { valueString: this.getRaw(), value, err });
        }
        return value || defaultValue
      },
      setRaw (valueString, raiseError = false) {
        try {
          storage.setItem(storageName, valueString);
        } catch (err) {
          console.error(`Fail to set config of ${storageName}`, { valueString, err });
          if (raiseError) throw err
        }
      },
      set (value) {
        if (preSet) {
          try {
            value = preSet(value);
          } catch (err) {
            console.warn(`Fail to preparse config of ${storageName}`, { value, err });
          }
        }
        this.setRaw(JSON.stringify(value));
        return value
      }
    }
  };

  const formatDate = (date) => {
    date = new Date(date);
    return date.format('yyyy-MM-dd hh:mm:ss')
  };
  const formatTime = (timeStr, countDown = false) => {
    const now = new Date();
    const time = new Date(timeStr) - (new Date().getTimezoneOffset() + 8 * 60) * 60 * 1000;
    let times = (time - now) / 1000;
    let day = 0;
    let hour = 0;
    let minute = 0;
    let second = 0;
    if (times > 0) {
      day = Math.floor(times / (60 * 60 * 24));
      hour = Math.floor(times / (60 * 60)) - Math.floor(times / (60 * 60 * 24)) * 24;
      minute = Math.floor(times / 60) - Math.floor(times / (60 * 60)) * 60;
      if (day > 0) return `剩余${day}天${hour}小时`
      else if (hour > 0) return `剩余${hour}小时${minute}分钟`
      else if (countDown) return `即将结束 剩余${minute}分钟`
      else return '刚刚'
    } else {
      if (countDown) return '已结束'
      times = Math.abs(times);
      day = Math.floor(times / (60 * 60 * 24));
      hour = Math.floor(times / (60 * 60));
      minute = Math.floor(times / 60);
      second = Math.floor(times);
      if (minute < 1) {
        return `${second}s ago`
      } else if (minute < 60) {
        return `${minute}m ago`
      } else if (hour < 24) {
        return `${hour}h ago`
      }
      if (day > 365) return 'years ago'
      return `[${new Date(timeStr).format('yyyy-MM-dd')}] ${day}d ago`
    }
  };
  const formatNumber = (number, decimals, dec_point, thousands_sep) => {
    number = (number + '').replace(/[^0-9+-Ee.]/g, '');
    const n = !isFinite(+number) ? 0 : +number;
    const prec = !isFinite(+decimals) ? 2 : Math.abs(decimals);
    const sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep;
    const dec = (typeof dec_point === 'undefined') ? '.' : dec_point;
    let s = '';
    s = (prec ? n.toFixed(prec) : '' + Math.round(n)).split('.');
    const re = /(-?\d+)(\d{3})/;
    while (re.test(s[0])) {
      s[0] = s[0].replace(re, '$1' + sep + '$2');
    }
    if ((s[1] || '').length < prec) {
      s[1] = s[1] || '';
      s[1] += new Array(prec - s[1].length + 1).join('0');
    }
    return s.join(dec)
  };
  const formatMoney = (number) => {
    return '₵' + formatNumber(number, 2)
  };
  const formatAskPrice = (price) => {
    if (Number.isInteger(parseFloat(price))) return price
    else return (price - Math.floor(price)) > 0.5 ? Math.ceil(price) : Math.floor(price) + 0.5
  };
  const parseIntArray = (arr) => arr.map(item => parseInt(item));
  const removeEmpty = (array) => {
    const arr = [];
    for (let i = 0; i < array.length; i++) {
      if (array[i]) arr.push(array[i]);
    }
    return arr
  };

  const processor = (value) => ({
    ...value,
    charas: parseIntArray(value.charas),
    auctions: parseIntArray(value.auctions)
  });
  const FollowList = configGenerator('followList', {
    user: '',
    charas: [],
    auctions: []
  }, {
    postGet: processor,
    preSet: processor
  });

  const getMe = () => {
    const followList = FollowList.get();
    let me = followList.user;
    if (!me) {
      if (location.pathname.startsWith('/rakuen/topic/crt') || location.pathname.startsWith('/character')) {
        me = $('#new_comment .reply_author a')[0].href.split('/').pop();
      } else
      if (location.pathname.startsWith('/rakuen/home')) {
        me = $('#grailBox2').data('name');
      } else
      if (location.pathname.startsWith('/rakuen/topiclist')) ; else
      if (location.pathname.startsWith('/user')) {
        me = $('.idBadgerNeue a.avatar').attr('href').split('/').pop();
      }
      followList.user = me;
      FollowList.set(followList);
    }
    return me
  };
  const getDayOfWeek = () => {
    let asiaTime = new Date().toLocaleString('en-US', { timeZone: 'Asia/Shanghai' });
    asiaTime = new Date(asiaTime);
    return asiaTime.getDay()
  };
  const isDayOfWeek = (day) => getDayOfWeek() === (day % 7);
  const normalizeAvatar = (avatar) => {
    if (!avatar) return '//lain.bgm.tv/pic/user/l/icon.jpg'
    if (avatar.startsWith('https://tinygrail.oss-cn-hangzhou.aliyuncs.com/')) { return avatar + '!w120' }
    const a = avatar.replace('http://', '//');
    return a
  };
  const launchObserver = ({
    parentNode,
    selector,
    failCallback = null,
    successCallback = null,
    stopWhenSuccess = true,
    config = { childList: true, subtree: true }
  }) => {
    if (!parentNode) return
    const observeFunc = mutationList => {
      if (!document.querySelector(selector)) {
        if (failCallback) failCallback();
        return
      }
      if (stopWhenSuccess) observer.disconnect();
      mutationList.itemFilter = (fn, type = 'addedNodes') => mutationList.map(i => Array.from(i[type]).filter(fn)).reduce((arr, val) => arr.concat(val), []);
      if (successCallback) successCallback(mutationList);
    };
    const observer = new MutationObserver(observeFunc);
    observer.observe(parentNode, config);
  };

  const api = 'https://tinygrail.com/api/';
  const getData = (url) => {
    if (!url.startsWith('http') && !url.startsWith('/')) url = api + url;
    return new Promise((resolve, reject) => {
      $.ajax({
        url: url,
        type: 'GET',
        xhrFields: { withCredentials: true },
        success: res => { resolve(res); },
        error: err => { reject(err); }
      });
    })
  };
  const postData = (url, data) => {
    const d = JSON.stringify(data);
    if (!url.startsWith('http') && !url.startsWith('/')) url = api + url;
    return new Promise((resolve, reject) => {
      $.ajax({
        url: url,
        type: 'POST',
        contentType: 'application/json',
        data: d,
        xhrFields: { withCredentials: true },
        success: res => { resolve(res); },
        error: err => { reject(err); }
      });
    })
  };

  const getSacrifices = async (charaId, username) => {
    let Sacrifices = 0;
    let Assets = 0;
    const templeInfo = await getData(`chara/user/temple/${username || getMe()}/1/100?keyword=${charaId}`);
    const temple = templeInfo.Value.Items.find(i => i.CharacterId === charaId);
    if (temple !== undefined) {
      Sacrifices = temple.Sacrifices || 0;
      Assets = temple.Assets || 0;
    }
    const Damage = Math.max(Sacrifices - Assets, 0);
    return { Sacrifices, Assets, Damage }
  };

  const AutoTempleList = configGenerator('autoTempleList', [], {
    postGet: value => value.map(item => ({
      ...item,
      charaId: parseInt(item.charaId),
      target: parseInt(item.target),
      bidPrice: parseFloat(item.bidPrice)
    }))
  });

  const addBuildTemple = (info) => {
    const autoTempleList = AutoTempleList.get();
    const index = autoTempleList.findIndex(temple => parseInt(temple.charaId) === info.charaId);
    if (index >= 0) {
      autoTempleList.splice(index, 1);
    }
    autoTempleList.unshift(info);
    AutoTempleList.set(autoTempleList);
  };
  const removeBuildTemple = (charaId) => {
    const autoTempleList = AutoTempleList.get();
    const index = autoTempleList.findIndex(temple => parseInt(temple.charaId) === charaId);
    if (index >= 0) {
      autoTempleList.splice(index, 1);
    }
    $(`#grailBox.chara${charaId} #autobuildButton`).text('[自动建塔]');
    AutoTempleList.set(autoTempleList);
  };
  const autoBuildTemple = async (charas = undefined) => {
    const buildTemple = (chara, amount) => {
      postData(`chara/sacrifice/${chara.charaId}/${amount}/false`, null).then((d) => {
        if (d.State === 0) {
          console.log(`#${chara.charaId} ${chara.name} 献祭${amount} 获得金额 ₵${d.Value.Balance.toFixed(2)}`);
          $(`#grailBox.chara${chara.charaId} #autobuildButton`).text('[自动建塔]');
          removeBuildTemple(chara.charaId);
        } else {
          console.log(`${d.Message}`);
        }
      });
    };
    const postBid = (chara, price, amount, myAmount, Needed) => {
      postData(`chara/bid/${chara.charaId}/${price}/${amount}`, null).then((d) => {
        if (d.Message) console.log(`#${chara.charaId} ${chara.name} ${d.Message}`);
        else {
          console.log(`买入成交 #${chara.charaId} ${chara.name} ${price}*${amount}`);
          if ((myAmount + amount) >= Needed) {
            buildTemple(chara, Needed);
          }
        }
      });
    };
    const getAskin = (Asks, low_price) => {
      let [price, amount] = [0, 0];
      for (let i = 0; i < Asks.length; i++) {
        if (Asks[i].Price > 0 && Asks[i].Price <= low_price) {
          amount += Asks[i].Amount;
          price = Asks[i].Price;
        }
      }
      return [price, amount]
    };
    const remove_myAsks = (Asks, myAsks) => {
      for (let i = 0; i < Asks.length; i++) {
        for (let j = 0; j < myAsks.length; j++) {
          if (formatAskPrice(Asks[i].Price) === formatAskPrice(myAsks[j].Price)) Asks[i].Amount -= myAsks[j].Amount;
        }
        if (Asks[i].Amount === 0) delete Asks[i];
      }
      Asks = removeEmpty(Asks);
      return Asks
    };
    if (charas === undefined) {
      charas = AutoTempleList.get();
    }
    for (let i = 0; i < charas.length; i++) {
      const chara = charas[i];
      console.log(`自动建塔 check #${chara.charaId} ${chara.name}`);
      const charaInfo = await getData(`chara/user/${chara.charaId}`);
      const myAsks = charaInfo.Value.Asks;
      const Amount = charaInfo.Value.Amount;
      const { Assets, Damage } = await getSacrifices(chara.charaId);
      const Needed = chara.target - Assets - Math.floor(Damage / 2);
      if (Needed <= 0) {
        removeBuildTemple(chara.charaId);
      } else if (Amount >= Needed) {
        buildTemple(chara, Needed);
      } else {
        getData(`chara/depth/${chara.charaId}`).then((d) => {
          let Asks = d.Value.Asks;
          Asks = remove_myAsks(Asks, myAsks);
          const AskPrice = Asks[0] ? Asks[0].Price : 0;
          if (AskPrice && AskPrice <= chara.bidPrice) {
            const [price, amount] = getAskin(Asks, chara.bidPrice);
            postBid(chara, price, Math.min(amount, Needed - Amount), Amount, Needed);
          }
        });
      }
    }
  };

  const closeDialog = (name = 'main') => {
    if (name === 'main') {
      $('#TB_overlay').remove();
      $('#TB_window').remove();
    } else {
      $(`#TB_overlay[data-name=${name}]`).remove();
      $(`#TB_window[data-name=${name}]`).remove();
    }
  };
  const showDialog = (innerHTML, config = {}) => {
    const { name, maxWidth, minWidth, canClose, closeBefore } = {
      name: 'main',
      maxWidth: '640px',
      minWidth: '400px',
      canClose: true,
      closeBefore: false,
      ...config
    };
    const dialog = `
    <div id="TB_overlay" data-name="${name}" class="TB_overlayBG TB_overlayActive"></div>
    <div id="TB_window" data-name="${name}" class="dialog" style="display:block;max-width:${maxWidth};min-width:${minWidth};">
    ${innerHTML}
    <a id="TB_closeWindowButton" data-name="${name}" title="Close" ${canClose ? '' : 'style="display: none;"'}>X关闭</a>
    </div>
  `;
    if (closeBefore) closeDialog(name);
    $('body').append(dialog);
    if (canClose) {
      $(`#TB_closeWindowButton[data-name=${name}]`).on('click', () => closeDialog(name));
      $(`#TB_overlay[data-name=${name}]`).on('click', () => closeDialog(name));
    }
    return {
      element: $(`#TB_window[data-name=${name}]`),
      closeDialog: () => { closeDialog(name); }
    }
  };

  const FillICOList = configGenerator('fillicoList', [], {
    postGet: value => value.map(item => ({
      ...item,
      Id: parseInt(item.Id),
      charaId: parseInt(item.charaId),
      target: parseInt(item.target),
      end: item.end
    })).sort((a, b) => a.end - b.end)
  });

  const ICOStandardList = [];
  const ICO_TAX = 500000;
  const addFillICO = (info) => {
    const fillICOList = FillICOList.get();
    const index = fillICOList.findIndex(item => parseInt(item.Id) === info.Id);
    if (index >= 0) {
      fillICOList.splice(index, 1);
    }
    if (info.target > 0) fillICOList.push(info);
    FillICOList.set(fillICOList);
  };
  const calculateICO = (ico, targetLevel, fillMin, joined, balance) => {
    const heads = ico.Users + (targetLevel === undefined || joined ? 0 : 1);
    const headLevel = Math.max(Math.floor((heads - 10) / 5), 0);
    ICOStandard((targetLevel || headLevel) + 1);
    const moneyTotal = ico.Total + (balance || 0);
    const moneyLevel = ICOStandardList.filter(i => i.Total <= moneyTotal).length;
    let icoMoneyLevel = Infinity;
    let level = 0;
    if (fillMin) {
      icoMoneyLevel = ICOStandardList.filter(i => i.Total <  ico.Total).length;
      if (balance === undefined || moneyLevel > icoMoneyLevel) icoMoneyLevel++;
      level = Math.min(headLevel, icoMoneyLevel, targetLevel);
    } else if (targetLevel === undefined) {
      level = Math.min(headLevel, moneyLevel);
    } else if (balance === undefined) {
      level = Math.min(targetLevel, headLevel);
    } else {
      level = Math.min(targetLevel, headLevel, moneyLevel);
    }
    const levelInfo = ICOStandard(level);
    const price = (Math.max(ico.Total, levelInfo.Total) - ICO_TAX) / levelInfo.Amount;
    const needMoney = Math.max(levelInfo.Total - ico.Total, 0);
    let message = '';
    if (headLevel === 0) {
      message = '人数不足';
    } else if (level === 0 && moneyLevel === 0) {
      message = '余额不足';
    } else if (level === targetLevel) {
      message = '设定目标等级';
    } else if (level === headLevel) {
      message = fillMin ? '人数最低等级' : '人数最高等级';
    } else if (level === icoMoneyLevel) {
      message = '当前注资最低等级';
      if (levelInfo.Total < ico.Total) message += '(余额不足补至下一等级)';
    } else if (level === moneyLevel) {
      message = '余额最高等级';
    }
    return {
      Level: level,
      Total: levelInfo.Total,
      Price: price,
      Amount: levelInfo.Amount,
      Users: levelInfo.Users,
      NeedMoney: needMoney,
      Message: message,
      NextLevel: ICOStandard(level + 1)
    }
  };
  const ICOStandard = (lv) => {
    if (lv === Infinity) return ICOStandard(ICOStandardList.length)
    lv = parseInt(lv < 1 ? 1 : lv);
    if (lv > ICOStandardList.length) {
      for (let level = ICOStandardList.length + 1; level <= lv; level++) {
        ICOStandardList.push({
          Level: level,
          Users: level * 5 + 10,
          Amount: 10000 + (level - 1) * 7500,
          Total: level === 1 ? 100000 + ICO_TAX : (Math.pow(level, 2) * 100000 + ICOStandardList[level - 1 - 1].Total)
        });
      }
    }
    return ICOStandardList[lv - 1]
  };
  const fullfillICO = async (icoList) => {
    const dialog = `<div class="info_box">
                  <div class="title">自动补款检测中</div>
                  <div class="result" style="max-height:500px;overflow:auto;"></div>
                  </div>`;
    if (!$('#TB_window').length) showDialog(dialog);
    const failedICOList = [];
    let balance = await getData('chara/user/assets').then(d => d.Value ? d.Value.Balance : undefined).catch((e) => { console.log('获取余额失败', e); return undefined });
    for (let i = 0; i < icoList.length; i++) {
      const Id = icoList[i].Id;
      const charaId = icoList[i].charaId;
      const targetlv = icoList[i].target;
      const fillMin = icoList[i].fillMin;
      const [icoInfo, myInitial] = await Promise.all([
        getData(`chara/${charaId}`).then(d => d.State === 0 ? d.Value : undefined).catch((e) => { console.log(`获取 #${charaId} ICO信息失败`, e); return undefined }),
        getData(`chara/initial/${Id}`).then(d => d.Value).catch((e) => { console.log(`获取 #${charaId} ICO信息失败`, e); return null })
      ]);
      if (icoInfo) {
        const joined = myInitial !== undefined;
        const predicted = calculateICO(icoInfo, targetlv, fillMin, joined, balance);
        if (!predicted.Level) {
          $('.info_box .result').prepend(`<div class="row">#${charaId} 目标: lv${targetlv} 人数: ${icoInfo.Users}, ${predicted.Message}, 未补款</div>`);
          console.log(`#${charaId},目标:lv${targetlv},人数:${icoInfo.Users},${predicted.Message},未补款`);
        } else if (predicted.NeedMoney > 0) {
          const offer = Math.max(predicted.NeedMoney, 5000);
          const joinRes = await postData(`chara/join/${Id}/${offer}`, null);
          if (joinRes.State === 0) {
            $('.info_box .result').prepend(`<div class="row">#${charaId} 目标: lv${targetlv}, 自动补款至${predicted.Message} lv${predicted.Level}, 补款: ${offer}cc</div>`);
            console.log(`#${charaId},目标:lv${targetlv},自动补款至${predicted.Message}lv${predicted.Level},补款:${offer}cc`);
            if (balance) balance -= offer;
          } else {
            $('.info_box .result').prepend(`<div class="row">#${charaId} ${joinRes.Message}</div>`);
            console.log(joinRes.Message);
          }
        } else if (predicted.Level === targetlv) {
          $('.info_box .result').prepend(`<div class="row">#${charaId} 目标: lv${targetlv} 总额: ${icoInfo.Total}, 已达标, 无需补款</div>`);
          console.log(`#${charaId},目标:lv${targetlv},总额:${icoInfo.Total},已达标,无需补款`);
        } else {
          $('.info_box .result').prepend(`<div class="row">#${charaId} 目标: lv${targetlv} 总额: ${icoInfo.Total}, 已达到${predicted.Message} lv${predicted.Level}, 未补款</div>`);
          console.log(`#${charaId},目标:lv${targetlv},总额:${icoInfo.Total},已达到${predicted.Message}lv${predicted.Level},未补款`);
        }
      } else {
        $('.info_box .result').prepend(`<div class="row">#${charaId} 目标: lv${targetlv}, 获取角色 ICO 信息失败, 稍后重试</div>`);
        console.log(`#${charaId},目标:lv${targetlv},获取角色ICO信息失败,稍后重试`);
        failedICOList.push(icoList[i]);
      }
    }
    if (failedICOList.length) fullfillICO(failedICOList);
  };
  const autoFillICO = () => {
    const fillICOList = FillICOList.get();
    const icoList = [];
    for (let i = 0; i < fillICOList.length; i++) {
      const endTime = new Date(new Date(fillICOList[i].end) - (new Date().getTimezoneOffset() + 8 * 60) * 60 * 1000);
      const leftTime = (new Date(endTime).getTime() - new Date().getTime()) / 1000;
      if (leftTime < 60) {
        console.log(`ico check#${fillICOList[i].charaId} -「${fillICOList[i].name}」 目标等级:lv${fillICOList[i].target} ${leftTime}s left`);
        icoList.push(fillICOList[i]);
        delete fillICOList[i];
      }
    }
    FillICOList.set(removeEmpty(fillICOList));
    if (icoList.length) fullfillICO(icoList);
  };
  const openICODialog = (chara) => {
    const fillICOList = FillICOList.get();
    let target = 1;
    let fillMin = true;
    const item = fillICOList.find(item => parseInt(item.Id) === chara.Id);
    if (item) {
      target = item.target;
      fillMin = item.fillMin;
    }
    const dialog = `<div class="title">自动补款 - #${chara.CharacterId} 「${chara.Name}」 lv${target}</div>
                  <div class="desc">
                    最高目标等级：<input type="number" class="target" min="1" max="20" step="1" value="${target}" style="width:50px">
                  </div>
                  <div class="option">
                    <button id="fillMinButton" class="checkbox">
                      按不爆注的最低等级补款<span class="slider"><span class="button"></span></span>
                    </button>
                  </div>
                  <div class="label" style="margin-bottom: 7px;"><span id="fillMinInfo" class="info"></span></div>
                  <div class="label"><div class="trade ico">
                    <button id="startfillICOButton" class="active">自动补款</button>
                    <button id="fillICOButton" style="background-color: #5fda15;">立即补款</button>
                    <button id="cancelfillICOButton">取消补款</button>
                  </div></div>
                  <div class="loading" style="display:none"></div>`;
    const { closeDialog } = showDialog(dialog);
    $('#fillMinButton').on('click', (e) => {
      if ($('#fillMinButton').hasClass('on')) {
        $('#fillMinButton').removeClass('on');
        $('#fillMinButton .button').animate({ 'margin-left': '0px' });
        $('#fillMinButton .button').css('background-color', '#ccc');
        $('#fillMinInfo').html('根据参与者人数、已筹集资金、个人资金余额，<br/>补款至不超过设定等级的<b>最高等级</b>。');
      } else {
        $('#fillMinButton').addClass('on');
        $('#fillMinButton .button').animate({ 'margin-left': '20px' });
        $('#fillMinButton .button').css('background-color', '#7fc3ff');
        $('#fillMinInfo').html('根据参与者人数、已筹集资金、个人资金余额，<br/>补款至不爆注的<b>最低等级</b>。');
      }
    }).trigger('click');
    if (fillMin === false) $('#fillMinButton').trigger('click');
    $('#cancelfillICOButton').on('click', function () {
      const fillICOList = FillICOList.get();
      const index = fillICOList.findIndex(item => parseInt(item.Id) === chara.Id);
      if (index >= 0) {
        alert(`取消自动补款${chara.Name}`);
        $(`#grailBox.chara${chara.CharacterId} #followICOButton`).text('[自动补款]');
        fillICOList.splice(index, 1);
        FillICOList.set(fillICOList);
      }
      closeDialog();
      console.log(fillICOList);
    });
    $('#startfillICOButton').on('click', function () {
      const target = parseFloat($('.desc .target').val());
      if (target <= 0 || !Number.isInteger(target)) {
        alert('请输入正整数！');
        return
      }
      const info = {};
      info.Id = parseInt(chara.Id);
      info.charaId = parseInt(chara.CharacterId);
      info.name = chara.Name;
      info.target = target;
      info.fillMin = $('#fillMinButton').hasClass('on');
      info.end = chara.End;
      addFillICO(info);
      alert(`启动自动补款#${chara.Id} ${chara.Name}`);
      $(`#grailBox.chara${chara.CharacterId} #followICOButton`).text('[自动补款中]');
      closeDialog();
      console.log(fillICOList);
    });
    $('#fillICOButton').on('click', function () {
      const target = parseFloat($('.desc .target').val());
      if (target <= 0 || !Number.isInteger(target)) {
        alert('请输入正整数！');
        return
      }
      const info = {};
      info.Id = chara.Id;
      info.charaId = chara.CharacterId;
      info.name = chara.Name;
      info.target = target;
      info.fillMin = $('#fillMinButton').hasClass('on');
      info.end = chara.End;
      closeDialog();
      if (confirm(`立即补款#${chara.Id} ${chara.Name} 至 lv${target}`)) {
        fullfillICO([info]);
      }
    });
  };
  const setFullFillICO = (chara) => {
    let button = '<button id="followICOButton" class="text_button">[自动补款]</button>';
    if (FillICOList.get().some(item => parseInt(item.charaId) === chara.CharacterId)) {
      button = '<button id="followICOButton" class="text_button">[自动补款中]</button>';
    }
    $(`#grailBox.chara${chara.CharacterId} .title .text`).after(button);
    $(`#grailBox.chara${chara.CharacterId} #followICOButton`).on('click', () => {
      openICODialog(chara);
    });
  };
  const autoJoinICO = async (icoList) => {
    for (let i = 0; i < icoList.length; i++) {
      const charaId = icoList[i].CharacterId;
      await getData(`chara/${charaId}`).then((d) => {
        if (d.State === 0) {
          const offer = 5000;
          const Id = d.Value.Id;
          if (d.Value.Total < 100000 && d.Value.Users < 15) {
            getData(`chara/initial/${Id}`).then((d) => {
              if (d.State === 1 && d.Message === '尚未参加ICO。') {
                postData(`chara/join/${Id}/${offer}`, null).then((d) => {
                  if (d.State === 0) {
                    console.log(`#${charaId} 追加注资成功。`);
                    $(`#eden_tpc_list li[data-id=${charaId}] .row`).append(`<small class="raise">+${offer}</small>`);
                  }
                });
              }
            });
          }
        }
      });
    }
  };
  const autoBeginICO = async (icoList) => {
    for (let i = 0; i < icoList.length; i++) {
      const charaId = icoList[i];
      await getData(`chara/${charaId}`).then(async (d) => {
        if (d.State === 1 && d.Message === '找不到人物信息。') {
          const offer = 10000;
          await postData(`chara/init/${charaId}/${offer}`, null).then((d) => {
            if (d.State === 0) {
              console.log(`#${charaId} ICO 启动成功。`);
              $(`#eden_tpc_list li[data-id=${charaId}] .row`).append(`<small class="raise">+${offer}</small>`);
            } else {
              console.log(d.Message);
            }
          });
        }
      });
    }
  };
  const autoJoinFollowIco = () => {
    const followList = FollowList.get();
    const joinList = [];
    if (followList.charas.length) {
      postData('chara/list', followList.charas).then(d => {
        d.Value.forEach(chara => {
          if (chara.End) {
            const endTime = new Date(new Date(chara.End) - (new Date().getTimezoneOffset() + 8 * 60) * 60 * 1000);
            const leftTime = (new Date(endTime).getTime() - new Date().getTime()) / 1000;
            console.log(`ICO check #${chara.CharacterId} -「${chara.Name}」 ${leftTime}s left`);
            if (leftTime > 0 && leftTime <= 60 * 60) {
              joinList.push(chara);
            }
          }
        });
        autoJoinICO(joinList);
      });
    }
  };

  const getWeeklyShareBonus = () => {
    if (!confirm('已经周六了，赶紧领取股息吧？')) return
    getData('event/share/bonus').then((d) => {
      if (d.State === 0) { alert(d.Value); } else { alert(d.Message); }
    });
  };
  const getShareBonus = () => {
    if (isDayOfWeek(6)) {
      getData('event/share/bonus/check').then((d) => {
        if (d.State === 0) {
          getWeeklyShareBonus();
        }
      });
    }
  };

  const hideBonusButton = () => {
    if (!$('#bonusButton').length) return
    getData('event/share/bonus/test').then((d) => {
      const x = d.Value.Share / 10000;
      const allowance = Math.log10(x + 1) * 30 - x;
      if (d.State === 0 && allowance < 0) $('#bonusButton').remove();
    });
  };

  const loadUserAuctions = (d) => {
    d.Value.forEach((a) => {
      $(`.item_list[data-id=${a.CharacterId}] .user_auction`).remove();
      $(`.item_list[data-id=${a.CharacterId}] .my_auction`).remove();
      if (a.State !== 0) {
        const userAuction = `<span class="user_auction auction_tip" title="竞拍人数 / 竞拍数量">${formatNumber(a.State, 0)} / ${formatNumber(a.Type, 0)}</span>`;
        $(`.item_list[data-id=${a.CharacterId}] .time`).after(userAuction);
        $(`#grailBox.chara${a.CharacterId} #auctionHistoryButton`).before(userAuction);
        $('#TB_window.dialog .desc').append(userAuction);
      }
      if (a.Price !== 0) {
        const myAuction = `<span class="my_auction auction_tip" title="出价 / 数量">₵${formatNumber(a.Price, 2)} / ${formatNumber(a.Amount, 0)}</span>`;
        $(`.item_list[data-id=${a.CharacterId}] .time`).after(myAuction);
        $(`#grailBox.chara${a.CharacterId} #auctionHistoryButton`).before(myAuction);
        $('#TB_window.dialog .desc').append(myAuction);
      }
    });
  };
  const loadValhalla = async (ids) => {
    for (let i = 0; i < ids.length; i++) {
      const Id = ids[i];
      await getData(`chara/user/${Id}/tinygrail/false`).then((d) => {
        $(`.item_list[data-id=${Id}] .valhalla`).remove();
        const valhalla = `<small class="even valhalla" title="拍卖底价 / 拍卖数量">₵${formatNumber(d.Value.Price, 2)} / ${d.Value.Amount}</small>`;
        $(`.fill_auction[data-id=${Id}]`).before(valhalla);
        if (d.Value.Amount > d.Value.AuctionTotal) {
          const $fillAuc = $(`.fill_auction[data-id=${Id}]`);
          $fillAuc.show();
          $fillAuc.attr('title', $fillAuc.attr('title').replace(/(\(₵\d+\))?$/, `(₵${formatNumber(d.Value.Price * (d.Value.Amount - d.Value.AuctionTotal))})`));
        }
      });
    }
  };
  const bidAuction = (chara) => {
    $('#TB_window .loading').show();
    $('#TB_window .label').hide();
    $('#TB_window .desc').hide();
    $('#TB_window .trade').hide();
    const price = $('.trade.auction .price').val();
    const amount = $('.trade.auction .amount').val();
    postData(`chara/auction/${chara.Id}/${price}/${amount}`, null).then((d) => {
      $('#TB_window .loading').hide();
      $('#TB_window .label').show();
      $('#TB_window .desc').show();
      $('#TB_window .trade').show();
      if (d.State === 0) {
        const message = d.Value;
        $('#TB_window .trade').hide();
        $('#TB_window .label').hide();
        $('#TB_window .desc').text(message);
      } else {
        alert(d.Message);
      }
    });
  };
  const cancelAuction = (chara) => {
    let message = '确定取消竞拍？';
    if (isDayOfWeek(6)) message = '周六取消竞拍将收取20%税，确定取消竞拍？';
    if (!confirm(message)) return
    $('#TB_window .loading').show();
    $('#TB_window .label').hide();
    $('#TB_window .desc').hide();
    $('#TB_window .trade').hide();
    getData('chara/user/auction/1/100').then((d) => {
      let id = 0;
      for (let i = 0; i < d.Value.Items.length; i++) {
        if (chara.Id === d.Value.Items[i].CharacterId) {
          id = d.Value.Items[i].Id;
          break
        }
      }
      if (id) {
        postData(`chara/auction/cancel/${id}`, null).then((d) => {
          $('#TB_window .loading').hide();
          $('#TB_window .label').show();
          $('#TB_window .desc').show();
          $('#TB_window .trade').show();
          if (d.State === 0) {
            $('#TB_window .trade').hide();
            $('#TB_window .label').hide();
            $('#TB_window .desc').text('取消竞拍成功');
          } else alert(d.Message);
        });
      } else {
        $('#TB_window .loading').hide();
        $('#TB_window .desc').text('未找到竞拍角色');
      }
    });
  };

  const Settings = configGenerator('settings', {
    pre_temple: 'on',
    hide_grail: 'off',
    hide_link: 'off',
    hide_temple: 'off',
    hide_board: 'off',
    auction_num: 'one',
    merge_order: 'off',
    get_bonus: 'on',
    gallery: 'off',
    valhalla_sacrifices: 'on'
  });

  const openAuctionDialog = (chara, auction) => {
    let auction_num = chara.State;
    if (Settings.get().auction_num === 'one') auction_num = 1;
    const charaId = chara.CharacterId || chara.Id;
    const price = Math.ceil(chara.Price * 100) / 100;
    const total = formatNumber(price * chara.State, 2);
    const dialog = `<div class="title" title="拍卖底价 / 竞拍数量 / 流通股份">股权拍卖 - #${chara.Id} 「${chara.Name}」 ₵${formatNumber(chara.Price, 2)} / ${chara.State} / ${chara.Total}</div>
                  <div class="desc">
                  <button id="fullfill_auction" class="text_button" title="当竞拍数量未满时补满数量">[补满]</button>
                  <button id="change_amount" class="text_button" title="按修改后的价格确定数量，保持总价不变">[改量]</button>
                  <button id="change_price" class="text_button" title="按修改后的数量确定价格，保持总价不变">[改价]</button>
                  </div><div class="label">
                  <span class="input">价格</span><span class="input">数量</span><span class="total">合计 -₵${total}</span>
                  </div><div class="trade auction">
                  <input class="price" type="number" style="width: 100px" min="${price}" value="${price}">
                  <input class="amount" type="number" style="width: 100px" min="1" max="${chara.State}" value="${auction_num}">
                  <button id="bidAuctionButton" class="active">确定</button><button id="cancelAuctionButton" style="display: none">取消竞拍</button></div>
                  <div class="loading" style="display:none"></div>`;
    showDialog(dialog);
    $(`#grailBox.chara${charaId} .assets_box .auction_tip`).remove();
    loadUserAuctions(auction);
    $('#cancelAuctionButton').on('click', function () {
      cancelAuction(chara);
    });
    $('#bidAuctionButton').on('click', function () {
      bidAuction(chara);
    });
    if (!auction.Value.length) {
      auction.Value = [{ Price: 0, Amount: 0, Type: 0, State: 0 }];
    }
    if (auction.Value[0].Price) {
      $('.trade.auction .price').val(auction.Value[0].Price);
      $('.trade.auction .amount').val(auction.Value[0].Amount);
      const total = formatNumber(auction.Value[0].Price * auction.Value[0].Amount, 2);
      $('#TB_window .label .total').text(`合计 -₵${total}`);
      $('#cancelAuctionButton').show();
    }
    $('#TB_window .auction input').on('keyup', () => {
      const price = $('.trade.auction .price').val();
      const amount = $('.trade.auction .amount').val();
      const total = formatNumber(price * amount, 2);
      $('#TB_window .label .total').text(`合计 -₵${total}`);
    });
    $('#fullfill_auction').on('click', function () {
      const total_auction = chara.State;
      const amount = total_auction - auction.Value[0].Type + auction.Value[0].Amount;
      const price = Math.ceil(chara.Price * 100) / 100;
      $('.trade.auction .price').val(price);
      $('.trade.auction .amount').val(amount);
      $('#TB_window .label .total').text(`合计 -₵${formatNumber(price * amount, 2)}`);
    });
    $('#change_amount').on('click', function () {
      const price = parseFloat($('.trade.auction .price').val());
      const total = auction.Value[0].Price * auction.Value[0].Amount;
      const amount = Math.ceil(total / price);
      $('.trade.auction .amount').val(amount);
      $('#TB_window .label .total').text(`合计 -₵${formatNumber(price * amount, 2)}`);
    });
    $('#change_price').on('click', function () {
      const amount = parseInt($('.trade.auction .amount').val());
      const total = auction.Value[0].Price * auction.Value[0].Amount;
      const price = Math.ceil(total / amount * 100) / 100;
      $('.trade.auction .price').val(price);
      $('#TB_window .label .total').text(`合计 -₵${formatNumber(price * amount, 2)}`);
    });
  };
  const openAuctionDialogSimple = (chara) => {
    postData('chara/auction/list', [chara.CharacterId || chara.Id]).then((d) => {
      openAuctionDialog(chara, d);
    });
  };

  const showTopWeek = () => {
    getData('chara/topweek').then((d) => {
      let totalExtra = 0; let totalPeople = 0;
      for (let i = 0; i < d.Value.length; i++) {
        totalExtra += d.Value[i].Extra;
        totalPeople += d.Value[i].Type;
      }
      console.log(totalExtra + '/' + totalPeople + '=' + totalExtra / totalPeople);
      $('#topWeek .auction_button').hide();
      for (let i = 0; i < d.Value.length; i++) {
        const score = d.Value[i].Extra + d.Value[i].Type * totalExtra / totalPeople;
        const tag = $('#topWeek .assets .item')[i].querySelector('.tag');
        $(tag).attr('title', '综合得分:' + formatNumber(score, 2));
        const average = (d.Value[i].Extra + d.Value[i].Price * d.Value[i].Sacrifices) / d.Value[i].Assets;
        const buff = $('#topWeek .assets .item')[i].querySelector('.buff');
        $(buff).attr('title', '平均拍价:' + formatNumber(average, 2));
        const charaId = d.Value[i].CharacterId;
        const auction_button = $(`<div class="name auction" data-id="${charaId}">
              <span title="竞拍人数 / 竞拍数量 / 拍卖总数">${d.Value[i].Type} / ${d.Value[i].Assets} / ${d.Value[i].Sacrifices}</span></div>`);
        $($('#topWeek .assets .item')[i]).append(auction_button);
        const chara = { Id: d.Value[i].CharacterId, Name: d.Value[i].CharacterName, Price: d.Value[i].Price, State: d.Value[i].Sacrifices, Total: 0 };
        auction_button.css('cursor', 'pointer').on('click', () => {
          postData('chara/auction/list', [charaId]).then((d) => {
            openAuctionDialog(chara, d);
          });
        });
      }
    });
  };

  const PersistentCache = configGenerator('PersistentCache', {});

  const addValhallaElement = (charaElement, amount, sacrifices, damage) => {
    const title = `持股数 | 献祭值${damage ? ' (损耗值)' : ''}，点击刷新`;
    const text = `${amount} | ${sacrifices}${damage ? `(${damage})` : ''}`;
    charaElement = $(charaElement);
    const info = charaElement.find('.valhalla-sacrifices');
    if (info.length === 0) {
      charaElement.find('a.avatar[data-id] > img').after(`<div class="valhalla-sacrifices" title="${title}"><small>${text}</small></div>`);
    } else {
      info.attr('title', title).find('small').text(text);
    }
  };
  const showValhallaItems = async (itemList) => {
    const sacrificesCache = PersistentCache.get().sacrifices || {};
    const freshItem = [];
    const time = (new Date()).valueOf();
    const cacheEnd = time - 24 * 60 * 60 * 1000;
    itemList.forEach(i => {
      const charaId = i.querySelector('a.avatar[data-id]').dataset.id;
      if (charaId in sacrificesCache) {
        const sacrifices = sacrificesCache[charaId];
        addValhallaElement(i, sacrifices.amount, sacrifices.sacrifices, sacrifices.damage);
        if ((new Date(sacrifices.time)) < cacheEnd) {
          delete sacrifices[charaId];
          freshItem.push(i);
        }
      } else { freshItem.push(i); }
    });
    for (const [key, value] of Object.entries(sacrificesCache)) {
      if ((new Date(value.time)) < cacheEnd) delete sacrificesCache[key];
    }
    PersistentCache.set({ ...PersistentCache.get(), sacrifices: sacrificesCache });
    for (let i = 0; i < freshItem.length; i++) {
      const chara = $(itemList[i]);
      const id = chara.find('a.avatar[data-id]').data('id');
      const charaInfo = await getData(`chara/user/${id}`);
      const amount = charaInfo.Value.Amount;
      const { Sacrifices, Damage } = await getSacrifices(id);
      addValhallaElement(chara, amount, Sacrifices, Damage);
      sacrificesCache[id.toString()] = { amount: amount, sacrifices: Sacrifices, damage: Damage, time: time };
    }
    PersistentCache.set({ ...PersistentCache.get(), sacrifices: sacrificesCache });
  };
  const showValhallaPersonal = () => {
    launchObserver({
      parentNode: document.getElementById('valhalla'),
      selector: '#valhalla li.initial_item.chara',
      successCallback: (mutationList) => {
        const itemList = mutationList.itemFilter(i => i.classList && i.classList.contains('initial_item'));
        showValhallaItems(itemList);
      },
      stopWhenSuccess: false
    });
    $('#valhalla').on('click', '.valhalla-sacrifices', (e) => {
      showValhallaItems($(e.currentTarget).closest('li.initial_item.chara'));
      e.stopPropagation();
    });
  };

  let lastEven = false;
  const renderBalanceLog = (item, even) => {
    const line = even ? 'line_even' : 'line_odd';
    let change = '';
    if (item.Change > 0) {
      change = `<span class="tag raise large">+₵${formatNumber(item.Change, 2)}</span>`;
    } else if (item.Change < 0) {
      change = `<span class="tag fall large">-₵${formatNumber(Math.abs(item.Change), 2)}</span>`;
    }
    let amount = '';
    if (item.Amount > 0) {
      amount = `<span class="tag new large">+${formatNumber(item.Amount, 0)}</span>`;
    } else if (item.Amount < 0) {
      amount = `<span class="tag even large">${formatNumber(item.Amount, 0)}</span>`;
    }
    let id = '';
    if (item.Type >= 4 && item.Type <= 13) {
      id = `data-id="${item.RelatedId}"`;
    }
    return `<li class="${line} item_list item_log" ${id}>
            <div class="inner">₵${formatNumber(item.Balance, 2)}
              <small class="grey">${formatTime(item.LogTime)}</small>
              <span class="row"><small class="time">${item.Description}</small></span>
            </div>
            <span class="tags">
              ${change}
              ${amount}
            </span>
          </li>`
  };
  const renderCharacterDepth = (chara) => {
    const depth = `<small class="raise">+${formatNumber(chara.Bids, 0)}</small><small class="fall">-${formatNumber(chara.Asks, 0)}</small><small class="even">${formatNumber(chara.Change, 0)}</small>`;
    return depth
  };
  const renderCharacterTag = (chara, item) => {
    let flu = '--';
    let tclass = 'even';
    if (chara.Fluctuation > 0) {
      tclass = 'raise';
      flu = `+${formatNumber(chara.Fluctuation * 100, 2)}%`;
    } else if (chara.Fluctuation < 0) {
      tclass = 'fall';
      flu = `${formatNumber(chara.Fluctuation * 100, 2)}%`;
    }
    const tag = `<div class="tag ${tclass}" title="₵${formatNumber(chara.MarketValue, 0)} / ${formatNumber(chara.Total, 0)}">₵${formatNumber(chara.Current, 2)} ${flu}</div>`;
    return tag
  };
  const renderBadge = (item, withCrown, withNew, withLevel) => {
    let badge = '';
    if (withLevel) {
      badge = `<span class="badge level lv${item.Level}">lv${item.Level}</span>`;
    }
    if (item.Type === 1 && withNew) {
      badge += `<span class="badge new" title="+${formatNumber(item.Rate, 1)}新番加成剩余${item.Bonus}期">×${item.Bonus}</span>`;
    }
    if (item.State > 0 && withCrown) {
      badge += `<span class="badge crown" title="获得${item.State}次萌王">×${item.State}</span>`;
    }
    return badge
  };
  const renderCharacter = (item, type, even, showCancel) => {
    const line = even ? 'line_even' : 'line_odd';
    const amount = `<small title="固定资产">${formatNumber(item.Sacrifices, 0)}</small>`;
    const tag = renderCharacterTag(item);
    const depth = renderCharacterDepth(item);
    let id = item.Id;
    if (item.CharacterId && item.Id !== item.CharacterId) {
      id = item.CharacterId;
      if (type === 'auction') type += '-ico';
    }
    const time = item.LastOrder;
    let avatar = `<a href="/rakuen/topic/crt/${id}?trade=true" class="avatar l" target="right"><span class="avatarNeue avatarReSize32 ll" style="background-image:url('${normalizeAvatar(item.Icon)}')"></span></a>`;
    let cancel = '';
    if (showCancel) {
      cancel = type.startsWith('auction')
        ? `<small data-id="${id}" class="cancel_auction" title="取消关注竞拍">[取关]</small>`
        : `<span><small data-id="${id}" class="cancel_auction">[取消]</small></span>`;
    }
    let badge = renderBadge(item, true, true, true);
    let chara;
    if (item.NotExist) {
      chara = `<li class="${line} item_list" data-id="${id}">${avatar}<div class="inner">
              <a href="/rakuen/topic/crt/${id}?trade=true" class="title avatar l" target="right">${item.Name}</a> <small class="grey"></small>
              <div class="row"><small class="time"></small>
              <span><small data-id="${id}" class="reload_chara" title="刷新角色信息" style="display: none;">[重新加载]</small>
                <small data-id="${id}" data-name="${item.Name}" class="begin_ico" title="开启 ICO">[开启 ICO]</small></span>
              </div></div></li>`;
    } else if (type === 'auction') {
      chara = `<li class="${line} item_list" data-id="${id}">${avatar}<div class="inner">
              <a href="/rakuen/topic/crt/${id}?trade=true" class="title avatar l" target="right">${item.Name}${badge}</a> <small class="grey">(+${item.Rate.toFixed(2)})</small>
              <div class="row"><small class="time">${formatTime(time)}</small>
              <span><small data-id="${id}" class="fill_auction" title="当竞拍数量未满时补满数量" style="display: none;">[补满]</small>${cancel}</span>
              </div></div>${tag}</li>`;
    } else if (type === 'temple') {
      let costs = '';
      if (item.Assets - item.Sacrifices < 0) {
        costs = `<small class="fall" title="损耗">${item.Assets - item.Sacrifices}</small>
                <span><small data-id="${id}" data-lv="${item.CharacterLevel}"  data-cost="${item.Sacrifices - item.Assets}" class="fill_costs">[补充]</small></span>`;
      }
      avatar = `<a href="/rakuen/topic/crt/${id}?trade=true" class="avatar l" target="right"><span class="avatarNeue avatarReSize32 ll" style="background-image:url('${normalizeAvatar(item.Cover)}')"></span></a>`;
      chara = `<li class="${line} item_list" data-id="${id}" data-lv="${item.CharacterLevel}">${avatar}<div class="inner">
              <a href="/rakuen/topic/crt/${id}?trade=true" class="title avatar l" target="right">${item.Name}<span class="badge lv${item.CharacterLevel}">lv${item.CharacterLevel}</span></a> <small class="grey">(+${item.Rate.toFixed(2)})</small>
              <div class="row"><small class="time" title="创建时间">${formatTime(item.Create)}</small><small title="固有资产 / 献祭值">${item.Assets} / ${item.Sacrifices}</small>${costs}</div></div>
              <div class="tag lv${item.Level}">${item.Level}级圣殿</div></li>`;
    } else if (item.Id !== item.CharacterId) {
      const pre = calculateICO(item);
      const percent = formatNumber(item.Total / pre.NextLevel.Total * 100, 0);
      const icoState = item.Users === 0
        ? `<small title="当前人数 / 当前资金">${formatNumber(item.State, 0)} / ${formatNumber(item.Total, 1)}</small>`
        : `<small title="距下级还差${formatNumber(Math.max(pre.NextLevel.Users - item.Users, 0), 0)}人 / 当前资金(占下一等级百分比) / 预计价格">${formatNumber(item.Users, 0)}人 / ${formatNumber(item.Total, 1)}(${percent}%) / ₵${formatNumber(pre.Price, 2)}</small>`;
      badge = renderBadge(item, false, false, false);
      chara = `<li class="${line} item_list" data-id="${id}">${avatar}<div class="inner">
              <a href="/rakuen/topic/crt/${id}?trade=true" class="title avatar l" target="right">${item.Name}${badge}</a>
              <small class="grey set_autofillico" title="点击设置自动补款" data-id="${id}" data-icoid="${item.Id}" data-name="${item.Name}" data-end="${item.End}">(ICO进行中: lv${pre.Level})</small>
              <div class="row"><small class="time">${formatTime(item.End, true)}</small><span class="ico-state">${icoState}</span>${cancel}</div></div><div class="tags tag lv${pre.Level}">ICO进行中</div></li>`;
    } else {
      chara = `<li class="${line} item_list" data-id="${id}">${avatar}<div class="inner">
              <a href="/rakuen/topic/crt/${id}?trade=true" class="title avatar l" target="right">${item.Name}${badge}</a> <small class="grey">(+${item.Rate.toFixed(2)} / ${formatNumber(item.Total, 0)} / ₵${formatNumber(item.MarketValue, 0)})</small>
              <div class="row"><small class="time">${formatTime(item.LastOrder)}</small>${amount}<span title="买入 / 卖出 / 成交">${depth}</span>
              ${cancel}</div></div>${tag}</li>`;
    }
    return chara
  };
  const listItemClicked = function () {
    const link = $(this).find('a.avatar').attr('href');
    if (link) {
      if (parent.window.innerWidth < 1200) {
        $(parent.document.body).find('#split #listFrameWrapper').animate({ left: '-450px' });
      }
      window.open(link, 'right');
    }
  };
  const fillCosts = (id, lv, cost) => {
    const dialog = `<div class="title" title="用一个角色的活股或固定资产，给另一个角色的圣殿消耗进行补充，目标人物的等级要小于或等于发动攻击圣殿的人物等级">星光碎片</div>
                  <div class="desc">当前版本可以通过资产重组进行补塔（1:2 补充损耗），如需资产重组在角色页面进行，同时可使用自动建塔保证重组数量<br>星光碎片只能使用活股充能，请勾选活股以确认</div>
                  <table align="center" width="98%" cellspacing="0" cellpadding="5" class="settings">
                  <tr><td>能源：<input id="supplyId" type="number" style="width:60px" value=""></td>
                  <td>目标：<input id="toSupplyId" type="number" style="width:60px" value="${id}" disabled></td></tr>
                  <td>类型：<input id="isCirculating" type="checkbox" style="margin: 0 5px;" title="当前版本小圣杯已不支持圣殿股进行充能，勾选以确认使用活股充能">活股</input></td>
                  <td>数量：<input id="amount" type="number" style="width:60px" value="${cost}"></td></tr>
                  <tr><td><input class="inputBtn" value="充能" id="submit_stardust" type="submit"></td></tr>
                  </tbody></table>`;
    const { closeDialog } = showDialog(dialog, { closeBefore: true });
    $('#submit_stardust').on('click', () => {
      const supplyId = parseInt($('#supplyId').val());
      const toSupplyId = parseInt($('#toSupplyId').val());
      const isTemple = !$('#isCirculating').is(':checked');
      const amount = parseInt($('#amount').val());
      if (isTemple) {
        alert('当前版本小圣杯已不支持圣殿股进行充能，请在[类型]中勾选[活股]以确认使用活股充能');
        return
      }
      if (supplyId) {
        postData(`magic/stardust/${supplyId}/${toSupplyId}/${amount}/${isTemple}`, null).then((d) => {
          closeDialog();
          if (d.State === 0) {
            alert(d.Value);
            $(`.fill_costs[data-id=${id}]`).remove();
          } else alert(d.Message);
        });
      } else alert('角色id不能为空');
    });
  };
  const loadCharacterList = (list, page, total, more, type, showCancel) => {
    $('#eden_tpc_list ul .load_more').remove();
    if (page === 1) $('#eden_tpc_list ul').html('');
    for (let i = 0; i < list.length; i++) {
      const item = list[i];
      if (type === 'balance') {
        const log = renderBalanceLog(item, lastEven);
        $('#eden_tpc_list ul').append(log);
      } else {
        const chara = renderCharacter(item, type, lastEven, showCancel);
        $('#eden_tpc_list ul').append(chara);
      }
      lastEven = !lastEven;
    }
    $('.cancel_auction').off('click');
    $('.cancel_auction').on('click', (e) => {
      const id = $(e.target).data('id');
      const followList = FollowList.get();
      if (type === 'chara') followList.charas.splice(followList.charas.indexOf(id), 1);
      else if (type === 'auction') followList.auctions.splice(followList.auctions.indexOf(id), 1);
      FollowList.set(followList);
      $(`#eden_tpc_list li[data-id=${id}]`).remove();
    });
    $('.fill_costs').off('click');
    $('.fill_costs').on('click', (e) => {
      const { id, lv, cost } = $(e.target).data();
      fillCosts(id, lv, cost);
      e.stopPropagation();
    });
    $('.fill_auction').off('click');
    $('.fill_auction').on('click', (e) => {
      e.stopPropagation();
      const id = $(e.target).data('id');
      const isAucDay = isDayOfWeek(6);
      getData(`chara/user/${id}/tinygrail/false`).then(d => {
        const aucInfo = {
          basePrice: d.Value.Price,
          totalAmount: d.Value.Amount,
          userCount: d.Value.AuctionUsers,
          userAmount: d.Value.AuctionTotal,
          myPrice: 0,
          myAmount: 0
        };
        postData('chara/auction/list', [id]).then(d => {
          if (d.Value[0]) {
            aucInfo.myPrice = d.Value[0].Price;
            aucInfo.myAmount = d.Value[0].Amount;
          }
          const remains = aucInfo.totalAmount - aucInfo.userAmount;
          if (remains > 0) {
            let price = Math.ceil(aucInfo.basePrice * 100) / 100;
            const amount = remains + aucInfo.myAmount;
            if (isAucDay && price * amount < aucInfo.myPrice * aucInfo.myAmount) {
              price = Math.ceil(aucInfo.myPrice * aucInfo.myAmount / amount * 100) / 100;
            }
            postData(`chara/auction/${id}/${price}/${amount}`, null).then(d => {
              if (d.State === 0) {
                console.log(`自动补满拍卖 #${id} 耗资 ₵${price * amount}（₵${price} x ${amount}）`);
                postData('chara/auction/list', [id]).then(d => {
                  loadUserAuctions(d);
                });
              } else alert(d.Message);
            });
          } else { console.log(`#${id} 已拍满`); }
        });
      });
    });
    $('.begin_ico').off('click');
    $('.begin_ico').on('click', (e) => {
      e.stopPropagation();
      const id = $(e.target).data('id');
      const name = $(e.target).data('name');
      if (confirm(`确定为 #${id}「${name}」开启 ICO？`)) {
        autoBeginICO([id]);
      }
    });
    $('.reload_chara').off('click');
    $('.reload_chara').on('click', (e) => {
      e.stopPropagation();
      const id = $(e.target).data('id');
      getNonCharacter(id);
    });
    $('.set_autofillico').off('click');
    $('.set_autofillico').on('click', (e) => {
      e.stopPropagation();
      const itemData = $(e.target).data();
      const fillICOList = FillICOList.get();
      const item = fillICOList.find(item => item.charaId === parseInt(itemData.id)) || { Id: parseInt(itemData.icoid), charaId: parseInt(itemData.id), name: itemData.name, end: itemData.end };
      if (item) openICODialog({ Id: item.Id, CharacterId: item.charaId, Name: item.name, End: item.end });
    });
    $('#eden_tpc_list .item_list').on('click', listItemClicked);
    if (page !== total && total > 0) {
      const loadMore = `<li class="load_more"><button id="loadMoreButton" class="load_more_button" data-page="${page + 1}">[加载更多]</button></li>`;
      $('#eden_tpc_list ul').append(loadMore);
      $('#loadMoreButton').on('click', function () {
        const page = $(this).data('page');
        if (more) more(page);
      });
    } else {
      let noMore = '暂无数据';
      if (total > 0) { noMore = '加载完成'; }
      $('#eden_tpc_list ul').append(`<li class="load_more sub">[${noMore}]</li>`);
    }
  };
  const updateNonCharacter = chara => {
    const $item = $(`.item_list[data-id=${chara.CharacterId}]`);
    if (chara.Icon) $item.find('span.avatarNeue').css('background-image', `url('${normalizeAvatar(chara.Icon)}')`);
    $item.find('.title.avatar.l').text(chara.Name);
    $item.find('.row .begin_ico').attr('data-name', chara.Name).data('name', chara.Name);
    if (chara.Reload) {
      $item.find('.row .reload_chara').show();
    } else {
      $item.find('.row .reload_chara').hide();
    }
    if (chara.bad) {
      $item.find('.begin_ico').hide();
      $item.find('.title.avatar.l').text((i, value) => value + ' (虚空角色，请谨慎操作)');
    }
  };
  const getNonCharacter = id => {
    getData(`/rakuen/topic/crt/${id}`).then(bgmPage => {
      let bgmInfo = bgmPage.match(/class="avatar"><img\s+src="([^"]+)"\s+class="avatar\s+ll"><\/a>\s+<a href=".*"\s+target="_parent">.*<\/a><\/span><br\s*\/>(.+)<\/h1>/);
      let bad = false;
      if (bgmInfo === null) {
        bgmInfo = bgmPage.match(/<a href="([^"]+)" class="cover thickbox" alt="([^"]+)" title="/);
        bad = true;
      }
      updateNonCharacter({
        Id: id,
        CharacterId: id,
        Icon: bgmInfo[1],
        Name: bgmInfo[2],
        NotExist: true,
        bad
      });
    }).catch(e => {
      console.log(`未开启 ICO 角色 #${id} 信息加载失败`, e);
      updateNonCharacter({
        Id: id,
        CharacterId: id,
        Name: `未知角色 #${id}`,
        Reload: true,
        NotExist: true
      });
    });
    return {
      Id: id,
      CharacterId: id,
      Name: `角色 #${id} 信息加载中...`,
      NotExist: true
    }
  };
  const generateCharacterList = async ids => {
    const charas = await postData('chara/list', ids);
    const charasInfo = [];
    if (charas.State === 0) {
      for (let i = 0; i < ids.length; i++) {
        let item = charas.Value.find(chara => chara.CharacterId === parseInt(ids[i]));
        if (!item) item = getNonCharacter(ids[i]);
        charasInfo.push(item);
      }
      return charasInfo
    } else {
      console.log(charas);
    }
  };

  const loadFollowChara = (page) => {
    const followList = FollowList.get();
    const start = 50 * (page - 1);
    const ids = followList.charas.slice(start, start + 50);
    const totalPages = Math.ceil(followList.charas.length / 50);
    generateCharacterList(ids).then(list => {
      loadCharacterList(list, page, totalPages, loadFollowChara, 'chara', true);
    });
  };

  const loadFollowAuction = (page) => {
    const followList = FollowList.get();
    const start = 20 * (page - 1);
    const ids = followList.auctions.slice(start, start + 20);
    const totalPages = Math.ceil(followList.auctions.length / 20);
    postData('chara/list', ids).then((d) => {
      if (d.State === 0) {
        loadCharacterList(d.Value, page, totalPages, loadFollowAuction, 'auction', true);
        postData('chara/auction/list', ids).then((d) => {
          loadUserAuctions(d);
        });
        loadValhalla(ids);
      }
    });
  };

  const loadMyICOAmount = async (charaList) => {
    for (let i = 0; i < charaList.length; i++) {
      const result = await getData(`chara/initial/${charaList[i].Id}`);
      if (result && result.State === 0) {
        const amount = formatMoney(result.Value.Amount);
        const span = $(`#eden_tpc_list li.item_list[data-id=${charaList[i].CharacterId}] .row span`);
        span.find('small.my_amount').remove();
        span.append(`<small class="my_amount" title="已注资 ${amount}">/ ${amount}</small>`);
      }
    }
  };
  const loadMyICO = (page) => {
    getData(`chara/user/initial/0/${page}/50`).then(d => {
      if (d.State === 0) {
        postData('chara/list', d.Value.Items.sort((a, b) => (new Date(a.End)) - (new Date(b.End))).map(i => i.CharacterId)).then(d2 => {
          if (d2.State === 0) {
            loadCharacterList(d2.Value, d.Value.CurrentPage, d.Value.TotalPages, loadMyICO, 'ico', false);
          } else {
            loadCharacterList(d.Value.Items.sort((a, b) => (new Date(a.End)) - (new Date(b.End))),
              d.Value.CurrentPage, d.Value.TotalPages, loadMyICO, 'ico', false);
          }
          loadMyICOAmount(d.Value.Items);
          if (d.Value.TotalItems > 0 && page === 1) {
            $('#eden_tpc_list ul').prepend('<li id="copyICO" class="line_odd item_list item_function" style="text-align: center;">[复制我的 ICO]</li>');
            $('#copyICO').on('click', function () {
              getData('chara/user/initial/0/1/1000').then(async d => {
                if (d.Value.TotalItems > 1000) {
                  try {
                    d = getData(`chara/user/initial/0/1/${d.Value.TotalItems}`);
                  } catch (e) { console.log(`获取全部 ${d.Value.TotalItems} 个 ICO 列表出错`, e); }
                }
                const list_text = d.Value.Items.map(i => `https://bgm.tv/character/${i.CharacterId} ${i.Name}`).join('\n');
                const dialog = `<div class="bibeBox" style="padding:10px">
              <label>我的 ICO 列表（若复制按钮无效，请手动复制）</label>
              <textarea rows="10" class="quick" name="myICO"></textarea>
              <input class="inputBtn" value="复制" id="copy_list" type="submit" style="padding: 3px 5px;">
              </div>`;
                showDialog(dialog, { closeBefore: true });
                $('.bibeBox textarea').val(list_text);
                $('#copy_list').on('click', () => {
                  $('.bibeBox label').children().remove();
                  let res_info = '复制 ICO 列表出错，请手动复制';
                  $('.bibeBox textarea').select();
                  try {
                    if (document.execCommand('copy')) { res_info = `已复制 ${list_text.split('\n').length} 个 ICO`; }
                  } catch (e) { console.log('复制 ICO 列表出错', e); }
                  $('.bibeBox label').append(`<br><span>${res_info}</span>`);
                });
              });
            });
          }
        });
      }
    });
  };

  const loadLostTemple = (page) => {
    const lostTemples = [];
    getData(`chara/user/temple/0/${page}/500`).then((d) => {
      if (d.State === 0) {
        for (let i = 0; i < d.Value.Items.length; i++) {
          if (d.Value.Items[i].Assets - d.Value.Items[i].Sacrifices < 0) lostTemples.push(d.Value.Items[i]);
        }
        loadCharacterList(lostTemples, 2, 2, loadLostTemple, 'temple', false);
      }
      if (page < d.Value.TotalPages) {
        page++;
        loadLostTemple(page);
      }
    });
  };
  const loadMyTemple = (page) => {
    getData(`chara/user/temple/0/${page}/50`).then((d) => {
      if (d.State === 0) {
        loadCharacterList(d.Value.Items, d.Value.CurrentPage, d.Value.TotalPages, loadMyTemple, 'temple', false);
        if (page === 1) {
          $('#eden_tpc_list ul').prepend('<li id="lostTemple" class="line_odd item_list item_function" style="text-align: center;">[查看受损圣殿]</li>');
          $('#lostTemple').on('click', function () {
            $('#eden_tpc_list ul').html('');
            loadLostTemple(1);
          });
        }
      }
    });
  };

  const loadBalance = () => {
    const dialog = `<table align="center" width="98%" cellspacing="0" cellpadding="5" class="settings">
    <tr><td>类型：<select id="balanceType" style="width:100px">
    <option value="0" selected="selected">全部</option>
    <option value="18">魔法道具</option>
    <option value="1">彩票刮刮乐</option>
    <option value="2">参与ICO</option>
    <option value="3">ICO退款</option>
    <option value="13">ICO结果</option>
    <option value="4">买入委托</option>
    <option value="5">取消买入</option>
    <option value="6">卖出委托</option>
    <option value="8">取消卖出</option>
    <option value="7">交易印花税</option>
    <option value="9">资产重组</option>
    <option value="10">参与竞拍</option>
    <option value="11">修改竞拍</option>
    <option value="12">竞拍结果</option>
    <option value="14">个人所得税</option>
    <option value="16">发出红包</option>
    <option value="17">收到红包</option>
    <option value="15">系统修复</option>
    </select></td>
    <td>第<input id="page" type="number" style="width:30px" value="1">页</td>
    <td>每页<input id="amount" type="number" style="width:50px" value="1000">条</td>
    <td><input class="inputBtn" value="查询" id="submit_search" type="submit"></td></tr>
    </tbody></table>`;
    const { closeDialog } = showDialog(dialog, { closeBefore: true });
    $('#submit_search').on('click', () => {
      const Type = parseInt($('#balanceType').val());
      const page = parseInt($('#page').val());
      const amount = parseInt($('#amount').val());
      const Logs = [];
      getData(`chara/user/balance/${page}/${amount}`).then((d) => {
        closeDialog();
        if (d.State === 0) {
          for (let i = 0; i < d.Value.Items.length; i++) {
            if (d.Value.Items[i].Type === Type || Type === 0) Logs.push(d.Value.Items[i]);
          }
          loadCharacterList(Logs, 1, 1, loadBalance, 'balance', false);
          $('#eden_tpc_list ul li').on('click', function (e) {
            let id = $(e.target).data('id');
            if (id == null) {
              const result = $(e.target).find('small.time').text().match(/#(\d+)/);
              if (result && result.length > 0) { id = result[1]; }
            }
            if (id != null && id.length > 0) {
              if (parent.window.innerWidth < 1200) {
                $(parent.document.body).find('#split #listFrameWrapper').animate({ left: '-450px' });
              }
              window.open(`/rakuen/topic/crt/${id}?trade=true`, 'right');
            }
          });
        }
      });
    });
  };

  const loadAutoBuild = (page) => {
    const autoTempleList = AutoTempleList.get();
    autoBuildTemple(autoTempleList);
    const charas = [];
    for (let i = 0; i < autoTempleList.length; i++) charas.push(autoTempleList[i].charaId);
    const start = 50 * (page - 1);
    const ids = charas.slice(start, start + 50);
    const totalPages = Math.ceil(charas.length / 50);
    postData('chara/list', ids).then((d) => {
      if (d.State === 0) {
        loadCharacterList(d.Value, page, totalPages, loadAutoBuild, 'chara', false);
      }
    });
  };

  const loadAutoFillICO = (page) => {
    const list = FillICOList.get().sort((a, b) => (new Date(a.end)) - (new Date(b.end)));
    const charas = [];
    for (let i = 0; i < list.length; i++) charas.push(list[i].charaId);
    const start = 50 * (page - 1);
    const ids = charas.slice(start, start + 50);
    const totalPages = Math.ceil(charas.length / 50);
    generateCharacterList(ids).then(list => {
      loadCharacterList(list, page, totalPages, loadAutoFillICO, 'autofillico', false);
    });
  };

  const joinAuctions = async (ids) => {
    for (let i = 0; i < ids.length; i++) {
      const Id = ids[i];
      await postData('chara/auction/list', [Id]).then((d) => {
        let myAuctionAmount = 0;
        if (d.Value.length) myAuctionAmount = d.Value[0].Amount;
        if (myAuctionAmount) {
          const myAuction = `<span class="my_auction auction_tip" title="出价 / 数量">₵${formatNumber(d.Value[0].Price, 2)} / ${myAuctionAmount}</span>`;
          $(`.item_list[data-id=${Id}] .time`).after(myAuction);
        } else {
          getData(`chara/user/${Id}/tinygrail/false`).then((d) => {
            const price = Math.ceil(d.Value.Price * 100) / 100;
            const amount = 1;
            postData(`chara/auction/${Id}/${price}/${amount}`, null).then((d) => {
              if (d.State === 0) {
                const myAuction = `<span class="my_auction auction_tip" title="出价 / 数量">₵${price} / ${amount}</span>`;
                $(`.item_list[data-id=${Id}] .time`).after(myAuction);
              } else {
                console.log(d.Message);
              }
            });
          });
        }
      });
    }
  };

  let charasList = [];
  const getCharasList = () => {
    const charas = $('.bibeBox textarea').val().split('\n');
    for (let i = 0; i < charas.length; i++) {
      try {
        const charaId = parseInt(charas[i].match(/(character\/|crt\/)?(\d+)/)[2]);
        charasList.push(charaId);
      } catch (e) {}
    }
    return charasList
  };
  const loadTemperaryList = (page) => {
    const start = 50 * (page - 1);
    const ids = charasList.slice(start, start + 50);
    console.log(ids);
    const totalPages = Math.ceil(charasList.length / 50);
    generateCharacterList(ids).then(list => {
      loadCharacterList(list, page, totalPages, loadTemperaryList, 'chara', false);
    });
  };
  const createTemporaryList = () => {
    charasList = [];
    const batchElement = {
      basic: (text, desc, example) => `<span class="batch-element" title="${desc}, 例如：\n${example}">${text}</span>`,
      int: (text, desc, example = '1\n20') => batchElement.basic(text, desc, example),
      float: (text, desc, example = '1\n0.1\n3.14') => batchElement.basic(text, desc, example),
      boolean: (text, desc, example = '1（是）\nY（是）\n0（否）\nN（否）') => batchElement.basic(text, desc, example)
    };
    batchElement.splitor = batchElement.basic(',', '分隔符', ',（逗号）\n （空格）\n\t（制表符）');
    batchElement.id = batchElement.basic('ID', '角色 ID 或网址', '29282\nhttps://bgm.tv/character/29282');
    const dialog = `
    <div class="batch-tab-titlebar dialog-tab-titlebar">
      <div data-tabid="batch-tab-temp" class="batch-tab-title dialog-tab-title open">临时列表</div>
      <div data-tabid="batch-tab-onekey" class="batch-tab-title dialog-tab-title">一键操作</div>
      <div data-tabid="batch-tab-trade" class="batch-tab-title dialog-tab-title">批量交易</div>
    </div>
    <div class="batch-tab-content">
      <div class="bibeBox" style="padding:10px">
        <label class="batch-tab-temp dialog-tab-content">
          在超展开左边创建角色列表 请输入角色url或id，如 https://bgm.tv/character/29282 或 29282，一行一个
        </label>
        <label class="batch-tab-onekey dialog-tab-content" style="display: none;">
          一键参与凑人头或开启ICO 请输入角色url或id，如 https://bgm.tv/character/29282 或 29282，一行一个
        </label>
        <label class="batch-tab-trade dialog-tab-content" style="display: none;">
          按照以下格式录入数据后进行批量操作<small>(鼠标移入下方元素显示示例)</small><br>
          -<span title="批量设置自动建塔, 格式如下\n29282, 520.00, 12500\n29282, 10, 500\n29282（不加价格与目标，默认 10 cc 建 500 塔）">批量自动建塔</span>：<br>
            &nbsp;${batchElement.id} ${batchElement.splitor}
            ${batchElement.float('价格', '自动建塔买入时最低价格', '10\n520.00')} ${batchElement.splitor}
            ${batchElement.int('目标献祭值', '目标建塔数量', '500\n2500')}<br>
          -<span title="批量设置自动补款, 格式如下\n29282, 11, L, 0\n29282, 11, H, 1\n29282, 11（默认最低补款且不立即补款）\n29282（默认目标等级 lv1）">批量自动补款</span>：<br>
            &nbsp;${batchElement.id} ${batchElement.splitor}
            ${batchElement.int('目标等级', '自动补款目标等级', '0（取消自动补款）\n1\n2')} ${batchElement.splitor}
            ${batchElement.basic('补款类型', '自动补款类型（详见自动补款界面）', 'L：按不爆注的最低等级补款\nH：按能达到的最高等级补款')} ${batchElement.splitor}
            ${batchElement.boolean('立即补款', '是否立即补款')}
        </label>
        <textarea rows="10" class="quick" name="urls"></textarea>
        <div class="batch-tab-temp dialog-tab-content">
          <input class="inputBtn" value="创建列表" id="submit_list" type="submit" style="padding: 3px 5px;">
          <input class="inputBtn" value="关注角色" id="add_follow" type="submit" style="padding: 3px 5px;">
          <input class="inputBtn" value="关注竞拍" id="add_auction" type="submit" style="padding: 3px 5px;">
        </div>
        <div class="batch-tab-onekey dialog-tab-content" style="display: none;">
          <input class="inputBtn" value="参与竞拍" id="join_auction" type="submit" style="padding: 3px 5px;">
          <input class="inputBtn" value="参与 ICO" id="join_ico" type="submit" style="padding: 3px 5px;">
          <input class="inputBtn" value="启动 ICO" id="begin_ico" type="submit" style="padding: 3px 5px;">
        </div>
        <div class="batch-tab-trade dialog-tab-content" style="display: none;">
          <input class="inputBtn" value="批量建塔" id="trade_auto_temple" type="submit" style="padding: 3px 5px;">
          <input class="inputBtn" value="批量补款" id="trade_auto_fill_ico" type="submit" style="padding: 3px 5px;">
        </div>
      </div>
    </div>`;
    const { closeDialog } = showDialog(dialog, { closeBefore: true });
    $('.dialog-tab-title').on('click', e => {
      $('.dialog-tab-content').hide();
      $(`.dialog-tab-content.${e.target.dataset.tabid}`).show();
      $('.dialog-tab-title').removeClass('open');
      $(e.target).addClass('open');
    });
    $('#submit_list').on('click', () => {
      getCharasList();
      loadTemperaryList(1);
      closeDialog();
    });
    $('#add_follow').on('click', () => {
      getCharasList();
      const followList = FollowList.get();
      for (let i = 0; i < charasList.length; i++) {
        const charaId = charasList[i];
        if (followList.charas.includes(charaId)) {
          followList.charas.splice(followList.charas.indexOf(charaId), 1);
          followList.charas.unshift(charaId);
        } else {
          followList.charas.unshift(charaId);
        }
        FollowList.set(followList);
      }
      loadFollowChara(1);
      closeDialog();
    });
    $('#add_auction').on('click', () => {
      getCharasList();
      const followList = FollowList.get();
      for (let i = 0; i < charasList.length; i++) {
        const charaId = charasList[i];
        if (followList.auctions.includes(charaId)) {
          followList.auctions.splice(followList.auctions.indexOf(charaId), 1);
          followList.auctions.unshift(charaId);
        } else {
          followList.auctions.unshift(charaId);
        }
        FollowList.set(followList);
      }
      loadFollowAuction(1);
      closeDialog();
    });
    $('#join_auction').on('click', () => {
      getCharasList();
      $('#eden_tpc_list ul').html('');
      loadTemperaryList(1);
      joinAuctions(charasList);
      closeDialog();
    });
    $('#join_ico').on('click', () => {
      getCharasList();
      postData('chara/list', charasList).then((d) => {
        autoJoinICO(d.Value);
        loadTemperaryList(1);
        closeDialog();
      });
    });
    $('#begin_ico').on('click', () => {
      getCharasList();
      $('#begin_ico').attr('value', '正在开启 ICO...').closest('.bibeBox').find('.inputBtn').attr('disabled', true);
      autoBeginICO(charasList).then(() => {
        loadTemperaryList(1);
        closeDialog();
      });
    });
    const regElement = {
      int: '(\\d+)',
      float: '(\\d+(?:\\.\\d+)?)',
      boolean: '([01ynYNtTfF])',
      splitor: '[, \\t，|]+',
      id: '(?:character\\/|crt\\/|#)?(\\d+)'
    };
    $('#trade_auto_temple').on('click', () => {
      $('#trade_auto_temple').attr('value', '正在批量设置自动建塔...').closest('.bibeBox').find('.inputBtn').attr('disabled', true);
      const items = $('.bibeBox textarea').val().split('\n');
      const regAutoTemple = new RegExp(`${regElement.id}(?:${regElement.splitor}${regElement.float}${regElement.splitor}${regElement.int})?`, 'i');
      const tradeAutoTempleList = [];
      for (let i = 0; i < items.length; i++) {
        try {
          const [, charaId, price, target] = items[i].match(regAutoTemple);
          charasList.push(parseInt(charaId));
          tradeAutoTempleList.push({
            charaId: parseInt(charaId),
            name: '',
            target: target === undefined ? 500 : parseInt(target),
            bidPrice: price === undefined ? 10 : parseFloat(price)
          });
        } catch (e) {
          console.debug(`批量建塔第 ${i + 1} 行解析出错: ${items[i]}`);
        }
      }
      postData('chara/list', charasList).then((d) => {
        const list = tradeAutoTempleList.map(item => {
          const chara = d.Value.find(i => i.CharacterId === item.charaId);
          if (chara !== undefined) {
            item.name = chara.Name;
          }
          addBuildTemple(item);
          return item
        });
        console.log('批量建塔', list);
        autoBuildTemple(list);
        loadTemperaryList(1);
        closeDialog();
      });
    });
    $('#trade_auto_fill_ico').on('click', () => {
      $('#trade_auto_fill_ico').attr('value', '正在批量设置自动补款...').closest('.bibeBox').find('.inputBtn').attr('disabled', true);
      const items = $('.bibeBox textarea').val().split('\n');
      const regAutoICO = new RegExp(`${regElement.id}(?:${regElement.splitor}${regElement.int}(?:${regElement.splitor}([lhLH])${regElement.splitor}${regElement.boolean})?)?`, 'i');
      const tradeAutoICOList = [];
      for (let i = 0; i < items.length; i++) {
        try {
          const [, charaId, target, type, now] = items[i].match(regAutoICO);
          charasList.push(parseInt(charaId));
          tradeAutoICOList.push({
            Id: undefined,
            charaId: parseInt(charaId),
            name: '',
            target: target === undefined ? 1 : parseInt(target),
            fillMin: type === undefined ? true : type.toLowerCase() !== 'h',
            end: undefined,
            now: now === undefined ? false : /[1yt]/i.test(now)
          });
        } catch (e) {
          console.debug(`批量补款第 ${i + 1} 行解析出错: ${items[i]}`);
        }
      }
      console.log('批量补款', tradeAutoICOList);
      postData('chara/list', charasList).then((d) => {
        const charas = d.Value.filter(i => i.Current === undefined);
        const list = [];
        tradeAutoICOList.filter(i => charas.some(c => c.CharacterId === i.charaId)).forEach(item => {
          const chara = charas.find(i => i.CharacterId === item.charaId);
          if (chara !== undefined) {
            item.Id = chara.Id;
            item.name = chara.Name;
            item.end = chara.End;
          }
          if (item.target > 0 && item.now) {
            list.push(item);
          } else {
            delete item.now;
            addFillICO(item);
          }
        });
        closeDialog();
        if (list.length > 0) {
          console.log('立即批量补款', list);
          fullfillICO(list);
        }
        loadTemperaryList(1);
      });
    });
  };

  const ItemsSetting = configGenerator('ItemsSetting', {});

  const loadScratch = () => {
    $('#eden_tpc_list ul').html('');
    $('#eden_tpc_list ul').append('<li class="line_odd item_list" style="text-align: center;">[刮刮乐]</li>');
    const scratch_results = [];
    const scratch_ids = [];
    const chaosCube_results = [];
    const chaosCube_ids = [];
    const lotusland_results = [];
    const lotusland_ids = [];
    const scratch = () => {
      getData('event/scratch/bonus2').then((d) => {
        if (d.State === 0) {
          for (let i = 0; i < d.Value.length; i++) {
            scratch_results.push(d.Value[i]);
            scratch_ids.push(d.Value[i].Id);
          }
          if (!d.Value.length) {
            scratch_results.push(d.Value);
            scratch_ids.push(d.Value.Id);
          }
          scratch();
        } else {
          postData('chara/list', scratch_ids).then((d) => {
            for (let i = 0; i < d.Value.length; i++) {
              d.Value[i].Sacrifices = scratch_results[i].Amount;
              d.Value[i].Current = scratch_results[i].SellPrice;
            }
            loadCharacterList(d.Value, 2, 2, loadScratch, 'chara', false);
            startChaosCube();
          });
        }
      });
    };
    const chaosCubeTempleId = ItemsSetting.get().chaosCube;
    const startChaosCube = () => {
      if (chaosCubeTempleId) {
        $('#eden_tpc_list ul').append('<li class="line_odd item_list" style="text-align: center;">[混沌魔方]</li>');
        chaosCube();
      } else {
        alert('未设置施放混沌魔方的圣殿，请先在角色圣殿施放一次混沌魔方即可完成预设');
        startLotusland();
      }
    };
    const chaosCube = () => {
      postData(`magic/chaos/${chaosCubeTempleId}`, null).then((d) => {
        console.log(d);
        if (d.State === 0) {
          for (let i = 0; i < d.Value.length; i++) {
            chaosCube_results.push(d.Value[i]);
            chaosCube_ids.push(d.Value[i].Id);
          }
          if (!d.Value.length) {
            chaosCube_results.push(d.Value);
            chaosCube_ids.push(d.Value.Id);
          }
          chaosCube();
        } else {
          if (d.Message !== '今日已超过使用次数限制或资产不足。') {
            alert(d.Message);
            chaosCube();
          } else {
            postData('chara/list', chaosCube_ids).then((d) => {
              for (let i = 0; i < d.Value.length; i++) {
                d.Value[i].Sacrifices = chaosCube_results[i].Amount;
                d.Value[i].Current = chaosCube_results[i].SellPrice;
              }
              loadCharacterList(d.Value, 2, 2, loadScratch, 'chara', false);
              startLotusland();
            });
          }
        }
      });
    };
    const lotuslandPrice = ItemsSetting.get().lotusland;
    const startLotusland = () => {
      if (lotuslandPrice !== undefined) {
        $('#eden_tpc_list ul').append('<li class="line_odd item_list" style="text-align: center;" title="可在设置界面设置抽奖金额上限">[幻想乡]</li>');
        lotusland();
      } else {
        alert('未设置幻想乡自动抽奖金额上限，请在助手设置界面进行设置（设为 0 可不自动抽幻想乡）');
      }
    };
    const lotusland = () => {
      getData('event/daily/count/10').then((d) => {
        if (d.State === 0) {
          const count = d.Value * 1;
          const price = Math.pow(2, count) * 2000;
          if (price <= lotuslandPrice) {
            getData('event/scratch/bonus2/true').then((d) => {
              console.log(d);
              if (d.State === 0) {
                for (let i = 0; i < d.Value.length; i++) {
                  lotusland_results.push(d.Value[i]);
                  lotusland_ids.push(d.Value[i].Id);
                }
                if (!d.Value.length) {
                  lotusland_results.push(d.Value);
                  lotusland_ids.push(d.Value.Id);
                }
                lotusland();
              } else {
                endLotusland();
                console.warn('小圣杯助手自动抽幻想乡未知回应', d);
              }
            });
          } else {
            endLotusland();
          }
        } else {
          endLotusland();
          console.warn('小圣杯助手获取幻想乡价格未知回应', d);
        }
      });
    };
    const endLotusland = () => {
      postData('chara/list', lotusland_ids).then((d) => {
        for (let i = 0; i < d.Value.length; i++) {
          d.Value[i].Sacrifices = lotusland_results[i].Amount;
          d.Value[i].Current = lotusland_results[i].SellPrice;
        }
        loadCharacterList(d.Value, 2, 2, loadScratch, 'chara', false);
      });
    };
    scratch();
  };

  const loadMagic = () => {
    const itemsSetting = ItemsSetting.get();
    const templeId = itemsSetting.chaosCube || '';
    const monoId = itemsSetting.guidepost ? itemsSetting.guidepost.monoId : '';
    const toMonoId = itemsSetting.guidepost ? itemsSetting.guidepost.toMonoId : '';
    const attackId = itemsSetting.starbreak ? itemsSetting.starbreak.attackId : '';
    const toAttackId = itemsSetting.starbreak ? itemsSetting.starbreak.toAttackId : '';
    const dialog = `<table align="center" width="98%" cellspacing="0" cellpadding="5" class="settings">
    <tr><td title="消耗圣殿10点固定资产，获取随机角色20-200股随机数量">混沌魔方</td>
      <td>炮塔：<input id="chaosCube" type="number" style="width:60px" value="${templeId}"></td><td></td>
      <td><input class="inputBtn" value="发射" id="submit_chaosCube" type="submit"></td></tr>
    <tr><td title="消耗圣殿100点固定资产，获取指定股票10-100股随机数量，目标人物的等级要小于或等于发动攻击圣殿的人物等级">虚空道标</td>
      <td>炮塔：<input id="monoId" type="number" style="width:60px" value="${monoId}"></td>
      <td>目标：<input id="toMonoId" type="number" style="width:60px" value="${toMonoId}"></td>
      <td><input class="inputBtn" value="发射" id="submit_guidepost" type="submit"></td></tr>
    <tr><td title="消耗圣殿100点固定资产，获取指定角色星之力造成一定数量随机伤害，伤害随机范围与二者人物等级差有关">闪光结晶</td>
      <td>炮塔：<input id="attackId" type="number" style="width:60px" value="${attackId}"></td>
      <td>目标：<input id="toAttackId" type="number" style="width:60px" value="${toAttackId}"></td>
      <td><input class="inputBtn" value="发射" id="submit_starbreak" type="submit"></td></tr>
    <tr><td title="用一个角色的活股或固定资产，给另一个角色的圣殿消耗进行补充，补充数量与二者人物等级差有关">星光碎片</td>
      <td>能源：<input id="supplyId" type="number" style="width:60px"></td>
      <td>目标：<input id="toSupplyId" type="number" style="width:60px"></td></tr>
      <td></td><td>类型：<input id="isCirculating" type="checkbox" style="margin: 0 5px;" title="当前版本小圣杯已不支持圣殿股进行充能，勾选以确认使用活股充能">活股</input></td>
      <td>数量：<input id="amount" type="number" style="width:60px" value="100"></td>
      <td><input class="inputBtn" value="充能" id="submit_stardust" type="submit" title="当前版本小圣杯已不支持圣殿股进行充能，勾选活股类型以确认使用活股充能"></td></tr>
    </tbody></table>`;
    const { closeDialog } = showDialog(dialog, { closeBefore: true });
    $('#submit_chaosCube').on('click', () => {
      const templeId = parseInt($('#chaosCube').val());
      ItemsSetting.set({ ...ItemsSetting.get(), chaosCube: templeId });
      if (templeId === 0) return
      postData(`magic/chaos/${templeId}`, null).then((d) => {
        closeDialog();
        console.log(d);
        if (d.State === 0) {
          $('#eden_tpc_list ul').html('');
          $('#eden_tpc_list ul').append('<li class="line_odd item_list" style="text-align: center;">[混沌魔方]</li>');
          const Id = d.Value.Id;
          const Amount = d.Value.Amount;
          const SellPrice = d.Value.SellPrice;
          postData('chara/list', [Id]).then((d) => {
            for (let i = 0; i < d.Value.length; i++) {
              d.Value[i].Sacrifices = Amount;
              d.Value[i].Current = SellPrice;
            }
            loadCharacterList(d.Value, 2, 2, loadScratch, 'chara', false);
          });
        } else alert(d.Message);
      });
    });
    $('#submit_guidepost').on('click', () => {
      const monoId = parseInt($('#monoId').val());
      const toMonoId = parseInt($('#toMonoId').val());
      ItemsSetting.set({ ...ItemsSetting.get(), guidepost: { monoId: monoId, toMonoId: toMonoId } });
      if (monoId === 0 || toMonoId === 0) return
      postData(`magic/guidepost/${monoId}/${toMonoId}`, null).then((d) => {
        closeDialog();
        console.log(d);
        if (d.State === 0) {
          $('#eden_tpc_list ul').html('');
          $('#eden_tpc_list ul').append('<li class="line_odd item_list" style="text-align: center;">[虚空道标]</li>');
          const Id = d.Value.Id;
          const Amount = d.Value.Amount;
          const SellPrice = d.Value.SellPrice;
          postData('chara/list', [Id]).then((d) => {
            for (let i = 0; i < d.Value.length; i++) {
              d.Value[i].Sacrifices = Amount;
              d.Value[i].Current = SellPrice;
            }
            loadCharacterList(d.Value, 2, 2, loadScratch, 'chara', false);
          });
        } else alert(d.Message);
      });
    });
    $('#submit_starbreak').on('click', () => {
      const attackId = parseInt($('#attackId').val());
      const toAttackId = parseInt($('#toAttackId').val());
      ItemsSetting.set({ ...ItemsSetting.get(), starbreak: { attackId, toAttackId } });
      if (attackId === 0 || toAttackId === 0) return
      postData(`magic/starbreak/${attackId}/${toAttackId}`, null).then((d) => {
        closeDialog();
        console.log(d);
        if (d.State === 0) {
          alert(d.Value);
          $('#eden_tpc_list ul').html('');
          $('#eden_tpc_list ul').append('<li class="line_odd item_list" style="text-align: center;">[闪光结晶]</li>');
          const Amount = d.Value.match(/造成([0-9]+)点伤害/)[1];
          postData('chara/list', [attackId, toAttackId]).then((d) => {
            d.Value[1].Sacrifices = Amount;
            loadCharacterList(d.Value, 2, 2, null, 'chara', false);
          });
        } else alert(d.Message);
      });
    });
    $('#submit_stardust').on('click', () => {
      const supplyId = $('#supplyId').val();
      const toSupplyId = $('#toSupplyId').val();
      const isTemple = !$('#isCirculating').is(':checked');
      const amount = $('#amount').val();
      if (supplyId === 0 || toSupplyId === 0 || amount === 0) return
      if (isTemple) {
        alert('当前版本小圣杯已不支持圣殿股进行充能，请在[类型]中勾选[活股]以确认使用活股充能');
        return
      }
      postData(`magic/stardust/${supplyId}/${toSupplyId}/${amount}/${isTemple}`, null).then((d) => {
        closeDialog();
        console.log(d);
        if (d.State === 0) {
          alert(d.Value);
          $('#eden_tpc_list ul').html('');
          $('#eden_tpc_list ul').append('<li class="line_odd item_list" style="text-align: center;">[星光碎片]</li>');
          postData('chara/list', [supplyId, toSupplyId]).then((d) => {
            loadCharacterList(d.Value, 2, 2, loadScratch, 'chara', false);
          });
        } else alert(d.Message);
      });
    });
  };

  const CharaInitPrice = configGenerator('chara_initPrice', {});

  const sellOut = () => {
    $('#eden_tpc_list .item_list').removeAttr('onclick');
    $('#eden_tpc_list .item_list').each((_, e) => {
      let id = $(e).data('id');
      if (!id) {
        const result = $(e).find('small.time').text().match(/#(\d+)/);
        if (result && result.length > 0) {
          id = result[1];
          $(e).attr('data-id', id).data('id', id);
        }
      }
      if (!id || $(e).find('.sell_btn').length > 0) return
      $(`.sell_btn[data-id=${id}]`).remove();
      $(`#eden_tpc_list li[data-id=${id}] .row`).append(`<span><small data-id="${id}" class="sell_btn">[卖出]</small></span>`);
    });
    $('.sell_btn').off('click').on('click', (e) => {
      const id = $(e.target).data('id');
      if (id) {
        const charaInitPrice = CharaInitPrice.get();
        const priceTagEl = $(`#eden_tpc_list li[data-id=${id}]`).find('div.tag')[0];
        const priceTag = priceTagEl ? priceTagEl.innerText.match(/₵([0-9]*(\.[0-9]{1,2})?)/) : null;
        const priceNow = priceTag ? priceTag[1] : 0;
        getData(`chara/user/${id}`).then((d) => {
          const amount = d.Value.Amount;
          if (amount) {
            getData(`chara/${id}`).then((d) => {
              const initPrice = charaInitPrice[id] ? charaInitPrice[id].init_price : d.Value.Price;
              const price = Math.max(parseFloat(priceNow), parseFloat(initPrice).toFixed(2), d.Value.Current.toFixed(2));
              postData(`chara/ask/${id}/${price}/${amount}`, null).then((d) => {
                if (d.Message) console.log(`#${id}: ${d.Message}`);
                else console.log(`卖出委托#${id} ${price}*${amount}`);
              });
            });
          }
        });
      }
      $(`.sell_btn[data-id=${id}]`).remove();
    });
  };

  const cancelAllBids = async (charas, Balance) => {
    for (let i = 0; i < charas.length; i++) {
      const id = charas[i].Id;
      const name = charas[i].Name;
      const avatar = `<a href="/rakuen/topic/crt/${id}?trade=true" class="avatar l" target="right"><span class="avatarNeue avatarReSize32 ll" style="background-image:url('${normalizeAvatar(charas[i].Icon)}')"></span></a>`;
      await getData(`chara/user/${id}`).then((d) => {
        let line = 'line_even';
        if (i % 2 === 0) line = 'line_odd';
        const tid = d.Value.Bids[0].Id;
        const price = d.Value.Bids[0].Price;
        const amount = d.Value.Bids[0].Amount;
        Balance += price * amount;
        postData(`chara/bid/cancel/${tid}`, null).then((d) => {
          const message = `<li class="${line} item_list item_log" data-id="${id}">${avatar}<span class="tag raise">+${formatNumber(price * amount, 2)}</span>
          ₵${formatNumber(Balance, 2)}<span class="row"><small class="time">取消买单(${tid}) #${id} 「${name}」 ${price}*${amount}</small></span></li>`;
          $('#eden_tpc_list ul').prepend(message);
        });
      });
    }
  };
  const cancelBids = () => {
    if (!confirm('此操作将无法恢复，确定取消全部买单？')) return
    $('#eden_tpc_list ul').html('');
    getData('chara/user/assets').then((d) => {
      const Balance = d.Value.Balance;
      getData('chara/bids/0/1/1000').then((d) => {
        if (d.Value.TotalItems > 1000) {
          try {
            d = getData(`chara/user/initial/0/1/${d.Value.TotalItems}`);
          } catch (e) { console.log(`获取全部 ${d.Value.TotalItems} 条买单数据出错`, e); }
        }
        cancelAllBids(d.Value.Items, Balance);
      });
    });
  };

  const LinkPosList = configGenerator('LinkPosList', []);

  const configVersion = 3;
  const configList = [
    Settings,
    FollowList,
    FillICOList,
    AutoTempleList,
    ItemsSetting,
    LinkPosList
  ];
  const exportConfig = () => JSON.stringify({
    meta: {
      project: 'TinyGrail_Helper_Next',
      confver: configVersion,
      exportTime: (new Date()).toISOString()
    },
    config: configList.reduce((config, configItem) => {
      const configValue = configItem.getRaw();
      return configValue
        ? { ...config, [configItem.name]: configValue }
        : config
    }, {})
  });
  const importSingleConfig = (configStorage, configToImport) => {
    if (configStorage.name in configToImport) {
      console.log(`importing ${configStorage.name}`);
      configStorage.setRaw(configToImport[configStorage.name], true);
    }
  };
  const importConfig = (configString) => {
    try {
      const errors = [];
      const { meta, config } = JSON.parse(configString);
      console.log(`import config version: ${meta.confver}`);
      configList.forEach(configItem => {
        try {
          importSingleConfig(configItem, config);
        } catch (err) {
          errors.push(configItem.name);
        }
      });
      return errors
    } catch (err) {
      console.error('设置导入出错：', { configString, err });
    }
  };

  const openSettings = () => {
    const settingRowBtn = `
    <tr class="setting-row-btn">
      <td><span class="txtBtn setting-btn-export">[导入导出设置]</span></td>
      <td><input class="inputBtn setting-btn-submit" value="保存" type="submit"></td>
    </tr>
  `;
    const dialog = `
    <div class="setting-tab-titlebar dialog-tab-titlebar">
      <div data-tabid="setting-tab-feat" class="dialog-tab-title open">功能</div>
      <div data-tabid="setting-tab-ui" class="dialog-tab-title">界面</div>
      <div data-tabid="setting-tab-magic" class="dialog-tab-title">魔法</div>
    </div>
    <div class="setting-tab-content">
      <div class="setting-tab-feat dialog-tab-content">
        <table><tbody>
          <tr><td>默认拍卖数量</td>
            <td><select id="set_auction_num"><option value="one" selected="selected">1</option><option value="all">全部</option></td></tr>
          <tr><td>周六自动提醒领取股息</td>
            <td><select id="set_get_bonus"><option value="on" selected="selected">是</option><option value="off">否</option></td></tr>
          <tr><td title="小圣杯界面左右键切换查看圣殿图">圣殿画廊</td>
            <td><select id="set_gallery"><option value="off" selected="selected">关</option><option value="on">开</option></td></tr>
          <tr><td>合并历史订单</td>
            <td><select id="set_merge_order"><option value="on" selected="selected">是</option><option value="off">否</option></td></tr>
          <tr><td>幻想乡自动抽奖金额上限</td>
            <td><input id="item_set_lotus" type="number" min="0" step="1000" value="0"> cc</td></tr>
          ${settingRowBtn}
        </tbody></table>
      </div>
      <div class="setting-tab-ui dialog-tab-content" style="display: none;">
        <table><tbody>
          <tr><td>用户主页小圣杯默认显示状态</td>
            <td><select id="set_hide_grail"><option value="off" selected="selected">显示</option><option value="on">隐藏</option></select></td></tr>
          <tr><td>[连接] 默认显示状态</td>
            <td><select id="set_hide_link"><option value="off" selected="selected">显示</option><option value="not_me">仅显示自己</option><option value="on">隐藏</option></select></td></tr>
          <tr><td>[圣殿] 默认显示状态</td>
            <td><select id="set_hide_temple"><option value="off" selected="selected">显示</option><option value="not_me">仅显示自己</option><option value="on">隐藏</option></select></td></tr>
          <tr><td>[董事会] 默认显示状态</td>
            <td><select id="set_hide_board"><option value="off" selected="selected">显示</option><option value="on">隐藏</option></select></td></tr>
          <tr><td>将自己圣殿或连接排到第一个显示</td>
            <td><select id="set_pre_temple"><option value="on" selected="selected">是</option><option value="off">否</option></td></tr>
          <tr><td>英灵殿个人持股显示</td>
            <td><select id="set_valhalla_sacrifices"><option value="on" selected="selected">是</option><option value="off">否</option></select></td></tr>
          ${settingRowBtn}
        </tbody></table>
      </div>
      <div class="setting-tab-magic dialog-tab-content" style="display: none;">
        <table><tbody>
          <tr><td>混沌魔方 - 炮塔角色ID</td>
            <td><input id="item_set_chaos" class="chara-id" type="number" min="0" step="1" value="0"></td></tr>
          <tr><td>虚空道标 - 炮塔角色ID</td>
            <td><input id="item_set_guidepost" class="chara-id" type="number" min="0" step="1" value="0"></td></tr>
          <tr><td>虚空道标 - 目标角色ID</td>
            <td><input id="item_set_guidepost_to" class="chara-id" type="number" min="0" step="1" value="0"></td></tr>
          <tr><td>闪光结晶 - 炮塔角色ID</td>
            <td><input id="item_set_starbreak" class="chara-id" type="number" min="0" step="1" value="0"></td></tr>
          <tr><td>闪光结晶 - 目标角色ID</td>
            <td><input id="item_set_starbreak_to" class="chara-id" type="number" min="0" step="1" value="0"></td></tr>
          ${settingRowBtn}
        </tbody></table>
      </div>
    </div>
  `;
    const { closeDialog } = showDialog(dialog, { closeBefore: true });
    $('.dialog-tab-title').on('click', e => {
      $('.dialog-tab-content').hide();
      $(`.dialog-tab-content.${e.target.dataset.tabid}`).show();
      $('.dialog-tab-title').removeClass('open');
      $(e.target).addClass('open');
    });
    const settings = Settings.get();
    const itemSetting = ItemsSetting.get();
    $('#set_hide_grail').val(settings.hide_grail);
    $('#set_hide_link').val(settings.hide_link);
    $('#set_hide_temple').val(settings.hide_temple);
    $('#set_hide_board').val(settings.hide_board);
    $('#set_pre_temple').val(settings.pre_temple);
    $('#set_valhalla_sacrifices').val(settings.valhalla_sacrifices || 'on');
    $('#set_auction_num').val(settings.auction_num);
    $('#set_merge_order').val(settings.merge_order);
    $('#set_get_bonus').val(settings.get_bonus);
    $('#set_gallery').val(settings.gallery);
    $('#item_set_lotus').val(itemSetting.lotusland || 0);
    $('#item_set_chaos').val(itemSetting.chaosCube || 0);
    if (itemSetting.guidepost) {
      $('#item_set_guidepost').val(itemSetting.guidepost.monoId || 0);
      $('#item_set_guidepost_to').val(itemSetting.guidepost.toMonoId || 0);
    }
    if (itemSetting.starbreak) {
      $('#item_set_starbreak').val(itemSetting.starbreak.attackId || 0);
      $('#item_set_starbreak_to').val(itemSetting.starbreak.toAttackId || 0);
    }
    $('#item_set_lotus').on('change', (e) => {
      const el = e.target;
      if (parseInt(el.value) > 3000) {
        el.style.color = 'red';
        el.style.fontWeight = 'bold';
      } else {
        el.style.color = '';
        el.style.fontWeight = '';
      }
    });
    $('.setting-btn-submit').on('click', () => {
      settings.hide_grail = $('#set_hide_grail').val();
      settings.hide_link = $('#set_hide_link').val();
      settings.hide_temple = $('#set_hide_temple').val();
      settings.hide_board = $('#set_hide_board').val();
      settings.pre_temple = $('#set_pre_temple').val();
      settings.valhalla_sacrifices = $('#set_valhalla_sacrifices').val();
      settings.auction_num = $('#set_auction_num').val();
      settings.merge_order = $('#set_merge_order').val();
      settings.get_bonus = $('#set_get_bonus').val();
      settings.gallery = $('#set_gallery').val();
      Settings.set(settings);
      ItemsSetting.set({
        lotusland: parseInt($('#item_set_lotus').val()),
        chaosCube: parseInt($('#item_set_chaos').val()),
        guidepost: {
          monoId: parseInt($('#item_set_guidepost').val()),
          toMonoId: parseInt($('#item_set_guidepost_to').val())
        },
        starbreak: {
          attackId: parseInt($('#item_set_starbreak').val()),
          toAttackId: parseInt($('#item_set_starbreak_to').val())
        }
      });
      $('#submit_setting').val('已保存');
      setTimeout(() => { closeDialog(); }, 500);
    });
    $('.setting-btn-export').on('click', () => {
      const dialog = `<div class="bibeBox" style="padding:10px">
      <label>设置导入/导出</label>
      <p><b>导入方式：</b>将之前导出的设置文本粘贴到下方输入框后点击导入按钮</p>
      <p><b>导出方式：</b>复制下方输入框中内容并妥善保存（若复制按钮无效，请手动复制）</p>
      <textarea rows="10" class="quick" name="setting_value"></textarea>
      <label id="info"></label>
      <input class="inputBtn" value="导入" id="import_setting" type="submit" style="padding: 3px 5px;">
      <input class="inputBtn" value="复制" id="copy_setting" type="submit" style="padding: 3px 5px;">
      </div>`;
      showDialog(dialog, { closeBefore: true });
      const configValue = exportConfig();
      $('.bibeBox textarea').val(configValue);
      $('#copy_setting').on('click', () => {
        $('.bibeBox label#info').children().remove();
        let resInfo = '复制设置出错，请手动复制';
        $('.bibeBox textarea').select();
        try {
          if (document.execCommand('copy')) { resInfo = '设置已复制，请自行保存以便后续导入'; }
        } catch (e) { console.log('复制设置出错', e); }
        $('.bibeBox label#info').append(`<span>${resInfo}</span><br>`);
      });
      $('#import_setting').on('click', () => {
        if (!confirm('导入设置将会覆盖原有设置，确定操作后将无法恢复，是否确定继续？')) return
        $('.bibeBox label#info').children().remove();
        let resInfo = '导入设置出错，请重新检查导入文本';
        const importString = $('.bibeBox textarea').val();
        try {
          const importErrors = importConfig(importString);
          if (importErrors.length === 0) {
            resInfo = '导入成功';
          } else {
            resInfo = `以下设置导入出错，请重新检查导入文本：\n${importErrors.join(', ')}`;
            console.warn(resInfo);
          }
          $('.bibeBox label#info').append(`<span>${resInfo}</span><br>`);
        } catch (e) { console.log('导入设置出错', e); }
      });
    });
  };

  const bindShowBidsTotal = () => {
    $('#bidMenu').on('click', () => {
      $('#bidsTotalInfo').remove();
      $('#eden_tpc_list ul').prepend('<li id="bidsTotalInfo" class="line_odd item_list item_function" style="text-align: center;">[统计买单总额]</li>');
      const calculateBidsTotal = () => {
        $('#bidsTotalInfo').off('click').text('[买单统计中，请稍候...]');
        getAllBids().then(res => {
          if (res) {
            $('#bidsTotalInfo').text(res);
          } else {
            $('#bidsTotalInfo').text('[买单统计出错，点击重试]').on('click', calculateBidsTotal);
          }
        });
      };
      $('#bidsTotalInfo').on('click', calculateBidsTotal);
    });
  };
  const getAllBids = async () => {
    let bidsRes = await getData('chara/bids/0/1/50').catch(e => console.warn('统计买单总额时获取买单信息失败', e));
    if (!bidsRes) return false
    if (bidsRes.State === 0 && bidsRes.Value) {
      if (bidsRes.Value.TotalPages > 1) {
        const totalItems = bidsRes.Value.TotalItems;
        bidsRes = await getData(`chara/bids/0/1/${totalItems}`).catch(e => console.warn('统计买单总额时获取买单信息失败', e));
        if (!bidsRes) return false
      }
      const bidsCharas = [];
      bidsRes.Value.Items.forEach(chara => {
        if (!bidsCharas.some(i => i.CharacterId === chara.CharacterId)) bidsCharas.push(chara);
      });
      return await sumBids(bidsCharas)
    } else if (bidsRes.State !== 0) {
      console.warn(bidsRes);
      return false
    }
  };
  const sumBids = async (charas) => {
    let sum = 0;
    let count = 0;
    for (let i = 0; i < charas.length; i++) {
      const d = await getData(`chara/user/${charas[i].CharacterId}`).catch(e => console.warn(e));
      if (d.State === 0) {
        sum += d.Value.Bids.reduce((s, i) => s + i.Price * i.Amount, 0);
        count += d.Value.Bids.length;
      } else {
        console.warn(d);
      }
    }
    return `共有 ${formatNumber(count, 0)} 买单，涉及 ${formatNumber(charas.length, 0)} 角色，合计 ${formatMoney(sum)}`
  };

  const bindShowAsksTotal = () => {
    $('#askMenu').on('click', () => {
      $('#asksTotalInfo').remove();
      $('#eden_tpc_list ul').prepend('<li id="asksTotalInfo" class="line_odd item_list item_function" style="text-align: center;">[统计卖单总数]</li>');
      const calculateAsksTotal = () => {
        $('#asksTotalInfo').off('click').text('[卖单统计中，请稍候...]');
        getAllAsks().then(res => {
          if (res) {
            $('#asksTotalInfo').text(res);
          } else {
            $('#asksTotalInfo').text('[卖单统计出错，点击重试]').on('click', calculateAsksTotal);
          }
        });
      };
      $('#asksTotalInfo').on('click', calculateAsksTotal);
    });
  };
  const getAllAsks = async () => {
    let asksRes = await getData('chara/asks/0/1/50').catch(e => console.warn('统计卖单总数时获取卖单信息失败', e));
    if (!asksRes) return false
    if (asksRes.State === 0 && asksRes.Value) {
      if (asksRes.Value.TotalPages > 1) {
        const totalItems = asksRes.Value.TotalItems;
        asksRes = await getData(`chara/asks/0/1/${totalItems}`).catch(e => console.warn('统计卖单总数时获取卖单信息失败', e));
        if (!asksRes) return false
      }
      const asksCharas = [];
      asksRes.Value.Items.forEach(chara => {
        if (!asksCharas.some(i => i.CharacterId === chara.CharacterId)) asksCharas.push(chara);
      });
      return await sumAsks(asksCharas)
    } else if (asksRes.State !== 0) {
      console.warn(asksRes);
      return false
    }
  };
  const sumAsks = async (charas) => {
    let sum = 0;
    let count = 0;
    for (let i = 0; i < charas.length; i++) {
      const d = await getData(`chara/user/${charas[i].CharacterId}`).catch(e => console.warn(e));
      if (d.State === 0) {
        sum += d.Value.Asks.reduce((s, i) => s + i.Amount, 0);
        count += d.Value.Asks.length;
      } else {
        console.warn(d);
      }
    }
    return `共有 ${formatNumber(count, 0)} 卖单，涉及 ${formatNumber(charas.length, 0)} 角色，合计 ${formatNumber(sum, 0)} 股`
  };

  const bindShowAuctionTotal = () => {
    $('#auctionMenu').on('click', () => {
      $('#auctionTotalInfo').remove();
      $('#eden_tpc_list ul').prepend('<li id="auctionTotalInfo" class="line_odd item_list item_function" style="text-align: center;">[统计拍卖总额]</li>');
      const calculateAuctionTotal = () => {
        $('#auctionTotalInfo').off('click').text('[拍卖统计中，请稍候...]');
        getAllAuction().then(res => {
          if (res) {
            $('#auctionTotalInfo').text(res);
          } else {
            $('#auctionTotalInfo').text('[拍卖统计出错，点击重试]').on('click', calculateAuctionTotal);
          }
        });
      };
      $('#auctionTotalInfo').on('click', calculateAuctionTotal);
    });
  };
  const getAllAuction = async () => {
    let page = 0;
    const auctionCharas = [];
    let retry = false;
    do {
      if (!retry) page++;
      const auctionRes = await getData(`chara/user/auction/${page}/50`).catch(e => console.warn(`统计拍卖总额时获取第${page}页拍卖信息失败`, e));
      if (auctionRes) {
        retry = false;
        if (auctionRes.State === 0 && auctionRes.Value) {
          auctionCharas.push(...auctionRes.Value.Items.filter(i => i.State === 0));
        } else if (auctionRes.State !== 0) {
          console.warn(auctionRes);
        }
      } else { retry = true; }
    } while (retry || auctionCharas.length >= 50 * page)
    const sum = auctionCharas.reduce((s, i) => s + i.Price * i.Amount, 0);
    return `共参与 ${formatNumber(auctionCharas.length, 0)} 角色竞拍，合计 ${formatMoney(sum)}`
  };

  const menuItemClicked = (callback, parentNodeId = '#helperMenu') => {
    $('.timelineTabs a').removeClass('focus');
    $('.timelineTabs a').removeClass('top_focus');
    $(parentNodeId).addClass('focus');
    if (callback) callback(1);
  };
  const loadHelperMenu = () => {
    const item = `<li><a href="#" id="helperMenu" class="top">助手</a><ul>
    <li><a href="#" id="temporaryList">临时列表</a></li>
    <li><a href="#" id="followChara">关注角色</a></li>
    <li><a href="#" id="followAuction">关注竞拍</a></li>
    <li><a href="#" id="scratch">抽奖</a></li>
    <li><a href="#" id="magic">魔法道具</a></li>
    <li><a href="#" id="balance">资金日志分类</a></li>
    <li><a href="#" id="sell" title="为当前列表角色增加一键卖出按钮">卖出</a></li>
    <li><a href="#" id="autoBuild">自动建塔</a></li>
    <li><a href="#" id="autoICO">自动补款</a></li>
    <li><a href="#" id="cancelBids">取消买单</a></li>
    <li><a href="#" id="settings">设置</a></li>
    </ul></li>`;
    $('.timelineTabs').append(item);
    $('#followChara').on('click', () => menuItemClicked(loadFollowChara));
    $('#followAuction').on('click', () => menuItemClicked(loadFollowAuction));
    $('#balance').on('click', () => menuItemClicked(loadBalance));
    $('#autoBuild').on('click', () => menuItemClicked(loadAutoBuild));
    $('#autoICO').on('click', () => menuItemClicked(loadAutoFillICO));
    $('#temporaryList').on('click', () => menuItemClicked(createTemporaryList));
    $('#scratch').on('click', () => menuItemClicked(loadScratch));
    $('#magic').on('click', () => menuItemClicked(loadMagic));
    $('#sell').on('click', () => menuItemClicked(sellOut));
    $('#cancelBids').on('click', () => menuItemClicked(cancelBids));
    $('#settings').on('click', () => menuItemClicked(openSettings));
    $('#logMenu').closest('li').before(`
    <li><a href="#" id="myICO">我的 ICO</a></li>
    <li><a href="#" id="myTemple">我的圣殿</a></li>
  `);
    const tinygrailMenuId = '#recentMenu';
    $('#myICO').on('click', () => menuItemClicked(loadMyICO, tinygrailMenuId));
    $('#myTemple').on('click', () => menuItemClicked(loadMyTemple, tinygrailMenuId));
    bindShowBidsTotal();
    bindShowAsksTotal();
    bindShowAuctionTotal();
  };

  const openBuildDialog = (chara) => {
    const autoTempleList = AutoTempleList.get();
    const charaId = chara.CharacterId || chara.Id;
    let target = 500; let bidPrice = 10;
    const temple = autoTempleList.find(temple => parseInt(temple.charaId) === charaId);
    if (temple !== undefined) {
      target = parseInt(temple.target);
      bidPrice = parseFloat(temple.bidPrice);
    }
    const dialog = `<div class="title" title="目标数量 / 买入价格">
                  自动建塔 - #${charaId} 「${chara.Name}」 ${target} / ₵${bidPrice}</div>
                  <div class="desc"><p>当已献祭股数+持有股数达到目标数量时将自动建塔</p>
                  输入 目标数量 / 买入价格(不超过此价格的卖单将自动买入)</div>
                  <div class="desc action"><p>便捷设定圣殿等级：
                    <span data-lv="1" class="text_button setToLv">[一级]</span>
                    <span data-lv="2" class="text_button setToLv">[二级]</span>
                    <span data-lv="3" class="text_button setToLv">[三级]</span></p></div>
                  <div class="label"><div class="trade build">
                  <input class="target" type="number" style="width:150px" title="目标数量" min="0" step="1" value="${target}">
                  <input class="bidPrice" type="number" style="width:100px" title="卖出下限" min="0" value="${bidPrice}">
                  <button id="startBuildButton" class="active">自动建塔</button><button id="cancelBuildButton">取消建塔</button></div></div>
                  <div class="loading" style="display:none"></div>`;
    const { closeDialog } = showDialog(dialog);
    $('#cancelBuildButton').on('click', function () {
      const autoTempleList = AutoTempleList.get();
      const index = autoTempleList.findIndex(temple => parseInt(temple.charaId) === charaId);
      if (index >= 0) {
        autoTempleList.splice(index, 1);
        AutoTempleList.set(autoTempleList);
        alert(`取消自动建塔${chara.Name}`);
      }
      $(`#grailBox.chara${charaId} #autobuildButton`).text('[自动建塔]');
      closeDialog();
    });
    $('#startBuildButton').on('click', function () {
      const info = {
        charaId: parseInt(charaId),
        name: chara.Name,
        target: parseInt($('.trade.build .target').val()),
        bidPrice: parseFloat($('.trade.build .bidPrice').val())
      };
      addBuildTemple(info);
      alert(`启动自动建塔#${info.charaId} ${info.name}`);
      closeDialog();
      $(`#grailBox.chara${charaId} #autobuildButton`).text('[自动建塔中]');
      autoBuildTemple([info]);
    });
    $('.action .setToLv').on('click', e => {
      const level = $(e.target).data('lv');
      $('.trade.build .target').val(Math.pow(5, level - 1) * 500);
    });
  };

  const markFollow = () => {
    const followInfoTagsClass = 'item-info-tags';
    const followInfoTag = `<small class="${followInfoTagsClass}"></small>`;
    const followChara = '<div title="已关注角色" class="item-info-tag item-info-chara-icon"></div>';
    const followAuc = '<div title="已关注拍卖" class="item-info-tag item-info-auc-icon"></div>';
    const followIco = '<div title="已自动补款" class="item-info-tag item-info-ico-icon"></div>';
    const followTemple = '<div title="已自动建塔" class="item-info-tag item-info-temple-icon"></div>';
    $('.item_list').each((_, el) => {
      const itemEl = $(el);
      let id = itemEl.data('id');
      if (!id) {
        const avatarUrl = itemEl.find('a.avatar').attr('href');
        const recMatch = itemEl.find('.row .time').text().match(/#(\d+)/) || ['', ''];
        id = parseInt(avatarUrl ? avatarUrl.match(/topic\/crt\/(\d+)([?/]|$)/)[1] : recMatch[1]);
      }
      let followInfoTagEl = itemEl.find(`.${followInfoTagsClass}`);
      if (!followInfoTagEl.length) followInfoTagEl = itemEl.find('.inner .row').before(followInfoTag).prev();
      if (!id || !followInfoTagEl) return
      let followInfo = '';
      const followList = FollowList.get();
      if (followList.charas.includes(id)) followInfo += followChara;
      if (followList.auctions.includes(id)) followInfo += followAuc;
      const templeInfo = AutoTempleList.get().find(e => parseInt(e.charaId) === id);
      if (templeInfo) {
        followInfo += followTemple;
        if (templeInfo.bidPrice !== undefined && templeInfo.target !== undefined) {
          followInfo += `<small class="item-info-temple-text" title="自动建塔价 × 数量" data-id="${id}" data-name="${templeInfo.name}">(${templeInfo.bidPrice} * ${templeInfo.target})</small>`;
        }
      }
      const fillIcoInfo = FillICOList.get().find(e => parseInt(e.charaId) === id);
      if (fillIcoInfo) {
        followInfo += followIco;
        if (fillIcoInfo.target) {
          followInfo += `<small title="自动补款目标" class="item-info-ico-text" data-id="${id}" data-icoid="${fillIcoInfo.Id}" data-name="${fillIcoInfo.Name}" data-end="${fillIcoInfo.End}" data-fillmin="${fillIcoInfo.fillMin}">(lv${fillIcoInfo.target})</small>`;
        }
      }
      followInfoTagEl.html(followInfo);
    });
    $('.item_list .item-info-temple-text').off('click').on('click', (e) => {
      const item = $(e.currentTarget);
      openBuildDialog({ CharacterId: item.data('id'), Name: item.data('name') });
      e.stopPropagation();
    });
    $('.item_list .item-info-ico-text').off('click').on('click', (e) => {
      const itemData = $(e.currentTarget).data();
      const fillICOList = FillICOList.get();
      const item = fillICOList.find(item => item.charaId === parseInt(itemData.id)) || { Id: parseInt(itemData.icoid), charaId: parseInt(itemData.id), name: itemData.name, end: itemData.end };
      if (item) openICODialog({ Id: item.Id, CharacterId: item.charaId, Name: item.name, End: item.end });
      e.stopPropagation();
    });
  };

  const changeLinkPos = (parentNode) => {
    const me = getMe();
    let user;
    if (location.pathname.startsWith('/user')) {
      user = location.pathname.split('/').pop();
    }
    const swapLink = (linkEl) => {
      const $link = $(linkEl).closest('.link');
      const $left = $link.find('.left');
      const $right = $link.find('.right');
      const $content = $link.find('.content');
      $left.toggleClass('left').toggleClass('right');
      $right.toggleClass('left').toggleClass('right');
      const $names = $content.find('span');
      $($names[0]).replaceWith($names[1]);
      $content.append($names[0]);
      $link.toggleClass('swapped');
      const thisUser = user || $link.find('.name a').attr('href').split('/').pop();
      const thisLinkPos = [$right, $left].map((el) => $(el).find('.card').data('temple').CharacterId).join('#');
      const thisConfig = `${thisUser}#${thisLinkPos}`;
      console.log(thisConfig);
      if (thisUser === me) {
        const reverseConfig = thisConfig.replace(/^(.+)#(\d+)#(\d+)$/, '$1#$3#$2');
        let linkPosList = LinkPosList.get();
        linkPosList = linkPosList.filter((i) => ![thisConfig, reverseConfig].includes(i));
        if ($link.hasClass('swapped')) {
          linkPosList.push(thisConfig);
          console.log('saved link pos: ' + thisConfig);
        }
        LinkPosList.set(linkPosList);
      }
    };
    const linkPosList = LinkPosList.get();
    $(parentNode).find('.link .name').each((i, el) => {
      if ($(el).find('.swapPos').length > 0) return
      $(el).append('<span class="swapPos" title="交换连接两塔的顺序">[换序]</span>');
      let thisUser = user;
      if (!thisUser) thisUser = $(el).find('a').attr('href').split('/').pop();
      if (thisUser === me) {
        const $link = $(el).closest('.link');
        const leftId = $link.find('.left .card').data('temple').CharacterId;
        const rightId = $link.find('.right .card').data('temple').CharacterId;
        const reverseConfig = `${thisUser}#${rightId}#${leftId}`;
        if (linkPosList.includes(reverseConfig)) swapLink($link);
      }
    });
    $(parentNode).on('click', '.swapPos', (e) => {
      swapLink($(e.currentTarget).closest('.link'));
    });
  };

  const showGallery = () => {
    if (Settings.get().gallery === 'on') {
      let index = 0;
      $('body').on('keydown', function (event) {
        switch (event.key || event.keyCode) {
          case 'ArrowLeft':
          case 37:
            closeDialog();
            $('.item .card')[index - 1].click();
            break
          case 'ArrowRight':
          case 39:
            closeDialog();
            $('.item .card')[index + 1].click();
            break
        }
      });
      $('body').on('touchstart', '#TB_window.temple', function (e) {
        let touch = e.originalEvent;
        const startX = touch.changedTouches[0].pageX;
        $(this).on('touchmove', function (e) {
          e.preventDefault();
          touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
          if (touch.pageX - startX > 20) {
            closeDialog();
            $('.item .card')[index - 1].click();
            $(this).off('touchmove');
          } else if (touch.pageX - startX < -20) {
            closeDialog();
            $('.item .card')[index + 1].click();
            $(this).off('touchmove');
          }
        });
      }).on('touchend', function () {
        $(this).off('touchmove');
      });
      setInterval(function () {
        $('.item .card').on('click', (e) => {
          index = $('.item .card').index(e.currentTarget);
        });
      }, 1000);
    }
  };

  const followChara = (charaId) => {
    let button = '<button id="followCharaButton" class="text_button">[关注角色]</button>';
    if (FollowList.get().charas.includes(charaId)) {
      button = '<button id="followCharaButton" class="text_button">[取消关注]</button>';
    }
    if ($(`#grailBox.chara${charaId} #kChartButton`).length) $(`#grailBox.chara${charaId} #kChartButton`).before(button);
    else $(`#grailBox.chara${charaId} .title .text`).after(button);
    $(`#grailBox.chara${charaId} #followCharaButton`).on('click', () => {
      const followList = FollowList.get();
      if (followList.charas.includes(charaId)) {
        followList.charas.splice(followList.charas.indexOf(charaId), 1);
        $(`#grailBox.chara${charaId} #followCharaButton`).text('[关注角色]');
      } else {
        followList.charas.unshift(charaId);
        $(`#grailBox.chara${charaId} #followCharaButton`).text('[取消关注]');
      }
      FollowList.set(followList);
    });
  };
  const followAuctions = (charaId) => {
    getData(`chara/user/${charaId}/tinygrail/false`).then((d) => {
      if (d.State === 0) {
        let button;
        if (FollowList.get().auctions.includes(charaId)) {
          button = '<button id="followAuctionButton" class="text_button">[取消关注]</button>';
        } else {
          button = '<button id="followAuctionButton" class="text_button">[关注竞拍]</button>';
        }
        $(`#grailBox.chara${charaId} #buildButton`).before(button);
        $(`#grailBox.chara${charaId} #followAuctionButton`).on('click', () => {
          const followList = FollowList.get();
          if (followList.auctions.includes(charaId)) {
            followList.auctions.splice(followList.auctions.indexOf(charaId), 1);
            $(`#grailBox.chara${charaId} #followAuctionButton`).text('[关注竞拍]');
          } else {
            followList.auctions.unshift(charaId);
            $(`#grailBox.chara${charaId} #followAuctionButton`).text('[取消关注]');
          }
          FollowList.set(followList);
        });
      }
    });
  };
  const sell_out = (charaId, init_price) => {
    $(`#grailBox.chara${charaId} .info .text .listed`).before('<button id="sell_out" class="text_button" title="以发行价全部卖出">[全部卖出]</button>');
    $(`#grailBox.chara${charaId} #sell_out`).on('click', function () {
      getData(`chara/user/${charaId}`).then((d) => {
        $(`#grailBox.chara${charaId} .ask .price`).val(init_price);
        $(`#grailBox.chara${charaId} .ask .amount`).val(d.Value.Amount);
      });
    });
  };
  const showInitialPrice = (chara) => {
    const charaId = chara.CharacterId || chara.Id;
    let time = formatDate(chara.ListedDate);
    const charaInitPrice = CharaInitPrice.get();
    if (charaInitPrice[charaId]) {
      const init_price = charaInitPrice[charaId].init_price;
      time = time || charaInitPrice[charaId].time;
      $(`#grailBox.chara${charaId} .info .text .listed`).before(`<span title="上市时间:${time}">发行价：${init_price}</span>`);
      sell_out(charaId, init_price);
    } else {
      getData(`chara/charts/${charaId}/2019-08-08`).then((d) => {
        if (d.Value[0]) {
          const init_price = d.Value[0].Begin.toFixed(2);
          time = time || d.Value[0].Time.replace('T', ' ');
          const charaInitPrice = CharaInitPrice.get();
          charaInitPrice[charaId] = { init_price: init_price };
          CharaInitPrice.set(charaInitPrice);
          $(`#grailBox.chara${charaId} .info .text .listed`).before(`<span title="上市时间:${time}">发行价：${init_price}</span>`);
          sell_out(charaId, init_price);
        }
      });
    }
  };
  const priceWarning = (charaId) => {
    const price = $(`#grailBox.chara${charaId} .bid .price`).val();
    $(`#grailBox.chara${charaId} #bidButton`).after('<button style="display:none" id="confirm_bidButton" class="active bid">买入</button>');
    $(`#grailBox.chara${charaId} .bid .price`).on('input', function () {
      const price_now = $(`#grailBox.chara${charaId} .bid .price`).val();
      if (price_now > Math.max(price * 3, 100)) {
        $(`#grailBox.chara${charaId} .bid .price`).css({ color: 'red' });
        $(`#grailBox.chara${charaId} #confirm_bidButton`).show();
        $(`#grailBox.chara${charaId} #bidButton`).hide();
      } else {
        $(`#grailBox.chara${charaId} #confirm_bidButton`).hide();
        $(`#grailBox.chara${charaId} #bidButton`).show();
        $(`#grailBox.chara${charaId} .bid .price`).css({ color: 'inherit' });
      }
    });
    $(`#grailBox.chara${charaId} #confirm_bidButton`).on('click', function () {
      const price = $(`#grailBox.chara${charaId} .bid .price`).val();
      const amount = $(`#grailBox.chara${charaId} .bid .amount`).val();
      if (!confirm(`买入价格过高提醒！\n确定以${price}的价格买入${amount}股？`)) {
        return
      }
      $(`#grailBox.chara${charaId} #bidButton`).click();
    });
  };
  const changeBaseAmount = (charaId) => {
    $(`#grailBox.chara${charaId} input.amount`).val(1);
  };
  const mergeorderList = (orderListHistory) => {
    const mergedorderList = []; let i = 0;
    mergedorderList.push(orderListHistory[0]);
    for (let j = 1; j < orderListHistory.length; j++) {
      if ((orderListHistory[j].Price === mergedorderList[i].Price) && Math.abs(new Date(orderListHistory[j].TradeTime) - new Date(mergedorderList[i].TradeTime)) < 10 * 1000) {
        mergedorderList[i].Amount += orderListHistory[j].Amount;
      } else {
        mergedorderList.push(orderListHistory[j]);
        i++;
      }
    }
    return mergedorderList
  };
  const mergeorderListHistory = (charaId) => {
    if (Settings.get().merge_order === 'on') {
      getData(`chara/user/${charaId}`).then((d) => {
        if (d.State === 0 && d.Value) {
          $(`.chara${charaId} .ask .ask_list li[class!=ask]`).hide();
          const askHistory = mergeorderList(d.Value.AskHistory);
          for (let i = 0; i < askHistory.length; i++) {
            const ask = askHistory[i];
            if (ask) $(`.chara${charaId} .ask .ask_list`).prepend(`<li title="${formatDate(ask.TradeTime)}">₵${formatNumber(ask.Price, 2)} / ${formatNumber(ask.Amount, 0)} / +${formatNumber(ask.Amount * ask.Price, 2)}<span class="cancel">[成交]</span></li>`);
          }
          $(`.chara${charaId} .bid .bid_list li[class!=bid]`).hide();
          const bidHistory = mergeorderList(d.Value.BidHistory);
          for (let i = 0; i < bidHistory.length; i++) {
            const bid = bidHistory[i];
            if (bid) $(`.chara${charaId} .bid .bid_list`).prepend(`<li title="${formatDate(bid.TradeTime)}">₵${formatNumber(bid.Price, 2)} / ${formatNumber(bid.Amount, 0)} / -${formatNumber(bid.Amount * bid.Price, 2)}<span class="cancel">[成交]</span></li>`);
          }
        }
      });
    }
  };
  const showOwnTemple = (charaId) => {
    const pre_temple = Settings.get().pre_temple;
    const temples = $(`#grailBox.chara${charaId} .assets_box #lastTemples.assets .item`);
    const me = getMe();
    for (let i = 0; i < temples.length; i++) {
      const user = temples[i].querySelector('.name a').href.split('/').pop();
      if (user === me) {
        temples[i].classList.add('my_temple');
        temples[i].classList.remove('replicated');
        if (pre_temple === 'on') $(`#grailBox.chara${charaId} .assets_box #lastTemples.assets`).prepend(temples[i]);
        break
      }
    }
    $(`#grailBox.chara${charaId} #expandButton`).on('click', () => { showOwnTemple(charaId); });
  };
  const changeTempleCover = (charaId) => {
    const setChaosCube = (temple) => {
      $('#chaosCubeButton').on('click', () => {
        const templeId = temple.CharacterId;
        const itemsSetting = ItemsSetting.get();
        itemsSetting.chaosCube = templeId;
        ItemsSetting.set(itemsSetting);
      });
    };
    const addButton = (temple, user) => {
      $('#TB_window .action').append(`<button id="changeCoverButton2" class="text_button" title="修改圣殿封面">[修改]</button>
                                    <button id="copyCoverButton" class="text_button" title="复制圣殿图片为自己圣殿的封面">[复制]</button>`);
      $('#changeCoverButton2').on('click', () => {
        const cover = prompt('图片url(你可以复制已有圣殿图片的url)：');
        const url = 'https://tinygrail.oss-cn-hangzhou.aliyuncs.com/' + cover.match(/cover\/\S+\.jpg/)[0];
        postData(`chara/temple/cover/${charaId}/${temple.UserId}`, url).then((d) => {
          if (d.State === 0) {
            alert('更换封面成功。');
            $('#TB_window img.cover').attr('src', cover);
            $(`#grailBox.chara${charaId} .assets_box .assets .item`).each(function () {
              if (user === this.querySelector('.name a').href.split('/').pop()) { $(this).find('div.card').css({ 'background-image': 'url(https://tinygrail.mange.cn/' + cover.match(/cover\/\S+\.jpg/)[0] + '!w150)' }); }
            });
          } else {
            alert(d.Message);
          }
        });
      });
      $('#copyCoverButton').on('click', () => {
        const cover = $('#TB_window .container .cover').attr('src');
        const url = 'https://tinygrail.oss-cn-hangzhou.aliyuncs.com/' + cover.match(/cover\/\S+\.jpg/)[0];
        postData(`chara/temple/cover/${charaId}`, url).then((d) => {
          if (d.State === 0) {
            alert('更换封面成功。');
            location.reload();
          } else {
            alert(d.Message);
          }
        });
      });
    };
    $(`#grailBox.chara${charaId} .assets .item`).on('click', (e) => {
      const me = getMe();
      const $el = $(e.currentTarget);
      let temple = $el.data('temple');
      let isLink = false;
      if (temple === undefined && ($el.hasClass('left') || $el.hasClass('right'))) {
        temple = $el.find('.card').data('temple');
        isLink = true;
      }
      if (temple === undefined) return
      let user = temple.Name;
      if (temple.LinkId === parseInt(charaId)) {
        user = $el.siblings('.item').find('.card').data('temple').Name;
      }
      if (user !== me && temple.CharacterId !== parseInt(charaId)) return
      if (isLink) {
        if (user === me) setChaosCube(temple);
        else addButton(temple, user);
      } else {
        launchObserver({
          parentNode: document.body,
          selector: '#TB_window .action',
          successCallback: () => {
            if (user === me) setChaosCube(temple);
            else addButton(temple, user);
          }
        });
      }
    });
  };
  const showOwnLink = (charaId) => {
    const pre_link = Settings.get().pre_temple;
    const links = $(`#grailBox.chara${charaId} .assets_box #lastLinks.assets .link.item`);
    const me = getMe();
    for (let i = 0; i < links.length; i++) {
      const user = links[i].querySelector('.name a').href.split('/').pop();
      if (user === me) {
        links[i].classList.add('my_link');
        links[i].closest('.rank_list').classList.add('my_rank');
        if (pre_link === 'on') $(links[i]).siblings('.rank.item').after(links[i]);
        break
      }
    }
  };
  const openHistoryDialog = (chara, page) => {
    const dialog = `<div class="title">上${page}周拍卖结果 - #${chara.Id} 「${chara.Name}」 ₵${formatNumber(chara.Current, 2)} / ${formatNumber(chara.Total, 0)}</div>
                  <div class="desc" style="display:none"></div>
                  <div class="result" style="display:none; max-height: 500px; overflow: auto;"></div>
                  <div class="page_inner">
                  <a id="nextweek" class="p" style="display:none; float: left;margin-bottom: 5px;margin-left: 50px;">后一周</a>
                  <a id="lastweek" class="p" style="display:none; float: right;margin-bottom: 5px;margin-right: 50px;">前一周</a>
                  </div>
                  <div class="loading"></div>`;
    const { closeDialog } = showDialog(dialog);
    const charaInitPrice = CharaInitPrice.get();
    const week_ms = 7 * 24 * 3600 * 1000;
    const templeWeek = Math.floor((new Date() - new Date('2019/10/05')) / week_ms + 1);
    const icoWeek = Math.floor((new Date() - new Date(charaInitPrice[chara.Id].time)) / week_ms + 1);
    const week = Math.min(templeWeek, icoWeek);
    getData(`chara/auction/list/${chara.Id}/${page}`).then((d) => {
      $('#TB_window .loading').hide();
      if (d.State === 0 && d.Value.length > 0) {
        let success = 0;
        let total = 0;
        d.Value.forEach((a) => {
          let state = 'even';
          let name = '失败';
          if (a.State === 1) {
            success++;
            total += a.Amount;
            state = 'raise';
            name = '成功';
          }
          const record = `<div class="row"><span class="time">${formatDate(a.Bid)}</span>
                        <span class="user"><a target="_blank" href="/user/${a.Username}">${a.Nickname}</a></span>
                        <span class="price">₵${formatNumber(a.Price, 2)} / ${formatNumber(a.Amount, 0)}</span>
                        <span class="tag ${state}">${name}</span></div>`;
          $('#TB_window .result').append(record);
        });
        $('#TB_window .desc').text(`共有${d.Value.length}人参与拍卖，成功${success}人 / ${total}股`);
        $('#TB_window .result').show();
      } else {
        $('#TB_window .desc').text('暂无拍卖数据');
      }
      $('#TB_window .desc').show();
      if (page > 1) $('#nextweek').show();
      if (page < week) $('#lastweek').show();
      $('#nextweek').on('click', () => {
        page--;
        closeDialog();
        openHistoryDialog(chara, page);
      });
      $('#lastweek').on('click', () => {
        page++;
        closeDialog();
        openHistoryDialog(chara, page);
      });
    });
  };
  const showAuctionHistory = (chara) => {
    const charaId = chara.CharacterId || chara.Id;
    const button = '<button id="auctionHistorys" class="text_button">[往期拍卖]</button>';
    $(`#grailBox.chara${charaId} #auctionHistoryButton`).after(button);
    $(`#grailBox.chara${charaId} #auctionHistoryButton`).hide();
    $(`#grailBox.chara${charaId} #auctionHistorys`).on('click', () => {
      openHistoryDialog(chara, 1);
    });
  };
  const openTradeHistoryDialog = (chara) => {
    const dialog = `<div class="title">交易历史记录 - #${chara.Id} 「${chara.Name}」 ₵${formatNumber(chara.Current, 2)} / ${formatNumber(chara.Total, 0)}</div>
                  <div class="result" style="display:none; max-height: 500px; overflow: auto;"></div>
                  <div class="desc" style="display:none"></div>
                  <div class="loading"></div>`;
    showDialog(dialog);
    const loadTradeHistory = (page) => {
      $('#TB_window .loading').hide();
      $('#TB_window .result').show();
      $('#TB_window .result').html('');
      const records = tradeHistory.slice(50 * (page - 1), 50 * page);
      if (records.length) {
        for (let i = 0; i < records.length; i++) {
          const record = `<div class="row">
                        <span class="time" title="交易时间">${formatDate(records[i].Time)}</span>
                        <span class="price" title="价格">₵${formatNumber((records[i].Price / records[i].Amount), 2)}</span>
                        <span class="amount" title="数量">${formatNumber(records[i].Amount, 0)}</span>
                        <span class="price" title="交易额">₵${formatNumber(records[i].Price, 2)}</span>
                        </div>`;
          $('#TB_window .result').append(record);
        }
        $('#TB_window .desc').html('');
        $('#TB_window .desc').text(`共有${tradeHistory.length}条记录，当前 ${page} / ${totalPages} 页`);
        for (let i = 1; i <= totalPages; i++) {
          const pager = `<span class="page" data-page="${i}">[${i}]</span>`;
          $('#TB_window .desc').append(pager);
        }
        $('#TB_window .desc .page').on('click', (e) => {
          const page = $(e.target).data('page');
          loadTradeHistory(page);
        });
        $('#TB_window .result').show();
      } else {
        $('#TB_window .desc').text('暂无交易记录');
      }
      $('#TB_window .desc').show();
    };
    let tradeHistory, totalPages;
    getData(`chara/charts/${chara.Id}/2019-08-08`).then((d) => {
      if (d.State === 0) {
        tradeHistory = d.Value.reverse();
        totalPages = Math.ceil(d.Value.length / 50);
        loadTradeHistory(1);
      }
    });
  };
  const showTradeHistory = (chara) => {
    const charaId = chara.CharacterId || chara.Id;
    $(`#grailBox.chara${charaId} #kChartButton`).after('<button id="tradeHistoryButton" class="text_button">[交易记录]</button>');
    $(`#grailBox.chara${charaId} #tradeHistoryButton`).on('click', () => {
      openTradeHistoryDialog(chara);
    });
  };
  const showPrice = (chara) => {
    const charaId = chara.CharacterId || chara.Id;
    const price = chara.Price.toFixed(2);
    $(`#grailBox.chara${charaId} .info .text .listed`).before(`<span>评估价：${price}</span>`);
  };
  const showTempleRate = (chara) => {
    const charaId = chara.CharacterId || chara.Id;
    getData(`chara/temple/${chara.Id}`).then((d) => {
      const templeAll = { 1: 0, 2: 0, 3: 0 };
      for (let i = 0; i < d.Value.length; i++) {
        templeAll[d.Value[i].Level]++;
      }
      $(`#grailBox.chara${charaId} .assets_box .bold .sub`).before(`<span class="sub"> (${templeAll[3]} + ${templeAll[2]} + ${templeAll[1]})</span>`);
    });
  };
  const setBuildTemple = (chara) => {
    const charaId = chara.CharacterId || chara.Id;
    let button = '<button id="autobuildButton" class="text_button">[自动建塔]</button>';
    if (AutoTempleList.get().some(item => parseInt(item.charaId) === parseInt(charaId))) {
      button = '<button id="autobuildButton" class="text_button">[自动建塔中]</button>';
    }
    if ($(`#grailBox.chara${charaId} #buildButton`).length) $(`#grailBox.chara${charaId} #buildButton`).after(button);
    else $(`#grailBox.chara${charaId} .title .text`).after(button);
    $(`#grailBox.chara${charaId} #autobuildButton`).on('click', () => {
      openBuildDialog(chara);
    });
  };
  const fixAuctions = (chara) => {
    const charaId = chara.CharacterId || chara.Id;
    getData(`chara/user/${chara.Id}/tinygrail/false`).then((d) => {
      chara.Price = d.Value.Price;
      chara.State = d.Value.Amount;
      let button = '<button id="auctionButton2" class="text_button">[萌王投票]</button>';
      if (d.State === 0 && d.Value.Amount > 0) button = '<button id="auctionButton2" class="text_button">[参与竞拍]</button>';
      $(`#grailBox.chara${charaId} #buildButton`).before(button);
      $(`#grailBox.chara${charaId} #auctionButton`).hide();
      launchObserver({
        parentNode: document.body,
        selector: `#grailBox.chara${charaId} #auctionButton`,
        successCallback: () => {
          $(`#grailBox.chara${charaId} #auctionButton`).hide();
        }
      });
      postData('chara/auction/list', [chara.Id]).then((d) => {
        loadUserAuctions(d);
        $(`#grailBox.chara${charaId} #auctionButton2`).on('click', () => {
          openAuctionDialog(chara, d);
        });
      });
    });
  };
  const showEndTime = (chara) => {
    const charaId = chara.CharacterId || chara.Id;
    const endTime = (chara.End).slice(0, 19);
    $(`#grailBox.chara${charaId} .title .text`).append(`<div class="sub" style="margin-left: 20px">结束时间: ${endTime}</div>`);
  };
  const showHideBlock = (titleSelector, blockSelector, settings) => {
    const toggleBlock = (set) => {
      const $linkTitle = $(titleSelector);
      const $linkBlock = $(blockSelector);
      if ($linkTitle.hasClass('hide_grail_block_title')) {
        $linkTitle.removeClass('hide_grail_block_title');
        $linkBlock.removeClass('hide_grail_block_on').removeClass('hide_grail_block_not_me');
      } else {
        if (set === 'off') set = 'on';
        $linkTitle.addClass('hide_grail_block_title');
        $linkBlock.addClass(`hide_grail_block_${set}`);
      }
    };
    if (settings !== 'off') toggleBlock(settings);
    $(titleSelector).css('cursor', 'pointer').attr('title', '显示/隐藏').off('click').on('click', () => toggleBlock(settings));
  };
  const showHideLink = (charaId) => {
    const titleSelector = `#grailBox.chara${charaId} .link_desc .link_count`;
    const blockSelector = `#grailBox.chara${charaId} #lastLinks`;
    const config = Settings.get().hide_link;
    showHideBlock(titleSelector, blockSelector, config);
  };
  const showHideTemple = (charaId) => {
    const titleSelector = `#grailBox.chara${charaId} .temple_desc .temple_count`;
    const blockSelector = `#grailBox.chara${charaId} #lastTemples`;
    const config = Settings.get().hide_temple;
    showHideBlock(titleSelector, blockSelector, config);
  };
  const showHideBoard = (charaId) => {
    const titleSelector = `#grailBox.chara${charaId} .board_box .desc .bold`;
    const blockSelector = `#grailBox.chara${charaId} .board_box .users, #grailBox.chara${charaId} #loadBoardMemeberButton`;
    const config = Settings.get().hide_board;
    showHideBlock(titleSelector, blockSelector, config);
  };
  const addCharaInfo = (cid) => {
    try {
      const charaId = cid || parseInt($('#grailBox .title .name a')[0].href.split('/').pop());
      $(`#grailBox.chara${charaId} .assets_box`).addClass('tinygrail-helped');
      followChara(charaId);
      followAuctions(charaId);
      priceWarning(charaId);
      changeBaseAmount(charaId);
      mergeorderListHistory(charaId);
      launchObserver({
        parentNode: document.body,
        selector: `#grailBox.chara${charaId} #lastTemples .item`,
        successCallback: () => {
          showOwnTemple(charaId);
          changeTempleCover(charaId);
        }
      });
      launchObserver({
        parentNode: document.body,
        selector: `#grailBox.chara${charaId} #lastLinks .link.item`,
        successCallback: () => {
          showOwnLink(charaId);
          changeLinkPos(`#grailBox.chara${charaId} #lastLinks`);
        }
      });
      launchObserver({
        parentNode: document.body,
        selector: `#grailBox.chara${charaId} .board_box .users .user`,
        successCallback: () => {
          showHideLink(charaId);
          showHideTemple(charaId);
          showHideBoard(charaId);
        }
      });
      showGallery();
      getData(`chara/${charaId}`).then((d) => {
        const chara = d.Value;
        showAuctionHistory(chara);
        showTradeHistory(chara);
        showPrice(chara);
        showInitialPrice(chara);
        showTempleRate(chara);
        setBuildTemple(chara);
        fixAuctions(chara);
      });
    } catch (e) { console.log(e); }
  };
  const addICOInfo = (cid) => {
    const charaId = cid || parseInt(location.pathname.split('/').pop());
    $(`#grailBox.chara${charaId} .trade .money`).addClass('tinygrail-helped');
    followChara(charaId);
    getData(`chara/${charaId}`).then((d) => {
      const chara = d.Value;
      showEndTime(chara);
      setBuildTemple(chara);
      setFullFillICO(chara);
    });
  };

  const toggleGrailBox = () => {
    const $title = $('#grail li.title');
    if ($title.hasClass('hide_grail_title')) {
      $title.closest('div.horizontalOptions').next().removeClass('hide_grail');
      $('div.grail.page_inner').removeClass('hide_grail');
      $title.removeClass('hide_grail_title');
    } else {
      $title.closest('div.horizontalOptions').next().addClass('hide_grail');
      $('div.grail.page_inner').addClass('hide_grail');
      $title.addClass('hide_grail_title');
    }
  };
  const showHideGrailBox = () => {
    const hide = Settings.get().hide_grail;
    if (hide === 'on') {
      toggleGrailBox();
    }
    $('#grail li.title').attr('title', '显示/隐藏小圣杯').on('click', toggleGrailBox);
    launchObserver({
      parentNode: document.querySelector('#user_home'),
      selector: '.grail.page_inner',
      successCallback: () => {
        console.log('modify page inner');
        if ($('#grail li.title').hasClass('hide_grail_title')) {
          $('div.grail.page_inner').addClass('hide_grail');
        }
      },
      config: { childList: true },
      stopWhenSuccess: false
    });
  };

  if (!location.pathname.startsWith('/rakuen/topic')) {
    setInterval(autoBuildTemple, 60 * 60 * 1000);
    setInterval(autoFillICO, 30 * 1000);
    setInterval(autoJoinFollowIco, 60 * 60 * 1000);
  }
  const listenToGrailBox = (parentNode = document.body, listenIco = true) => {
    launchObserver({
      parentNode: parentNode,
      selector: '#grailBox .assets_box:not(.tinygrail-helped)',
      successCallback: () => {
        addCharaInfo(parseInt($('#grailBox .assets_box:not(.tinygrail-helped)').closest('#grailBox').attr('class').match(/chara(\d+)/)[1]));
      },
      stopWhenSuccess: false
    });
    if (listenIco) {
      launchObserver({
        parentNode: parentNode,
        selector: '#grailBox .trade .money:not(.tinygrail-helped)',
        successCallback: () => {
          addICOInfo(parseInt($('#grailBox .trade .money:not(.tinygrail-helped)').closest('#grailBox').attr('class').match(/chara(\d+)/)[1]));
        },
        stopWhenSuccess: false
      });
    }
  };
  if (location.pathname.startsWith('/rakuen/topic/crt') || location.pathname.startsWith('/character')) {
    const parentNode = document.getElementById('subject_info') || document.getElementById('columnCrtB');
    listenToGrailBox(parentNode);
  } else
  if (location.pathname.startsWith('/rakuen/home')) {
    if (Settings.get().get_bonus === 'on') getShareBonus();
    launchObserver({
      parentNode: document.body,
      selector: '#topWeek',
      successCallback: () => {
        hideBonusButton();
        showTopWeek();
        showGallery();
      }
    });
    launchObserver({
      parentNode: document.body,
      selector: '#lastLinks.tab_page_item .assets .link.item:not(.swap-checked)',
      successCallback: () => {
        changeLinkPos('#lastLinks');
        $('#lastLinks.tab_page_item .assets .link.item:not(.swap-checked)').addClass('swap-checked');
      },
      stopWhenSuccess: false
    });
    listenToGrailBox(document.body);
    if (Settings.get().valhalla_sacrifices === 'on') {
      launchObserver({
        parentNode: document.body,
        selector: '#valhalla',
        successCallback: () => {
          showValhallaPersonal();
        }
      });
    }
    launchObserver({
      parentNode: document.body,
      selector: '.grail_index .auction_button',
      successCallback: () => {
        $(document).off('click', '.grail_index .auction_button');
        $(document).on('click', '.grail_index .auction_button', (e) => {
          openAuctionDialogSimple($(e.currentTarget).data('chara'));
        });
      },
      stopWhenSuccess: false
    });
  } else
  if (location.pathname.startsWith('/rakuen/topiclist')) {
    if ($('.timelineTabs #recentMenu').length > 0) {
      loadHelperMenu();
    } else {
      launchObserver({
        parentNode: document.querySelector('.timelineTabs'),
        selector: '#recentMenu',
        successCallback: () => {
          loadHelperMenu();
        }
      });
    }
    launchObserver({
      parentNode: document.body,
      selector: 'ul .load_more',
      successCallback: (mutationList) => {
        if (mutationList.some(muRecord => Array.from(muRecord.addedNodes.values()).some(el => $(el).is('.load_more')))) {
          markFollow();
        }
      },
      stopWhenSuccess: false
    });
  } else
  if (location.pathname.startsWith('/user')) {
    launchObserver({
      parentNode: document.body,
      selector: '#grail',
      successCallback: () => {
        showHideGrailBox();
        showGallery();
      }
    });
    launchObserver({
      parentNode: document.body,
      selector: '.link_list .grail_list:not([style]) .link .item',
      successCallback: () => {
        if ($('.link_list .grail_list:not([style]) .link .swapPos').length > 0) return
        changeLinkPos('.link_list .grail_list:not([style])');
      },
      stopWhenSuccess: false
    });
    listenToGrailBox(document.body);
  }

}());
