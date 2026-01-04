// ==UserScript==
// @name                轻量级百度谷歌搜索相互跳转
// @description         easily toggle Baidu and Google search

// @author              GallenHu
// @namespace           https://hgl2.com
// @license             MIT
// @icon                data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAIAAAD8GO2jAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAABmJLR0QA/wD/AP+gvaeTAAAAB3RJTUUH5QYKAiExtGX04gAABK1JREFUSMe1lllsVFUYx3/nzJ2tM6XtdAFaKBRa1tIQCMoikLAo2mD0wbjEGI1KfCdGoiQSY/SFgCagxIAxMUEg0Sg8YJVSCiIYNiFQurAVammn030605m59xwfesu0ZYRa5Xu6uefc+/v+33aO0FrzKE0+0r+PCqChvY/u6BgBxoOXExbfneXgJbwuXl/M6pnJpRshrrUxazyFgf8AqKpn1wmiCTRsq6Qwi5I8gGMNbKukuZspATY9yaIpYwqRaVFxlUgCh8SQNHdT3QBwPcT2o9zptJ93VNMRGRMgHKepEymSybjZDnD4Crc7cEgAQ1IXpObumAApLW5SHxz2xlJE46MGaE1bmM4IgN/NpCzUYJ8IKMrBcIzcn+llas7oAHGTPb+zYS/v7GP/OaRg3WzSnFgKU5GfwcpipKAkFz0YNKVZNYPp/wwYVkVVDew5RcxEaz6vwuOkvJTmHrtM31hsl9CzZVxq5nIzUrCkiDeXEolztwevk/yMZM5s3fdGhanY9BNHajGkHdmyAna+iN9Nex+GJMOb/KwjQl0rhmTuRG53svUIN0J4nTw1h7eWkuZKpaAnSmN7ki8FwV66IvjdZPtGCg+ksaTIduvrU5xpxJB0Rfn2D/LSeWlhqhwosIbPPSEQg7y4yfk77D/HwUs0diT3hMLUtuCQCIEUmIqqevoTqRRkeJiWzY2QLUJpxqfbYQmF2XmcyjrCMaQgP4MNyygvRQgicSIJxBCfuqPETDzO+xQ4HTw/n0AapsJUeF2sn4ffTdxkRzU/XqQvbrObuthaybEGO5JDC1GD4UDKVAqApUVsKaeiBmBFCatmABy6TMVVAKWQEgFS0NPPF8cpyibgI9tHWxiHANCKKQF8Q5Is7j9wBjprwNlj9XxSQaiP2RPI9nHhTjIgSrNsGlvKqW5gR7U9zwsy+fAZFhY+EHDPfq5h+1GCvQjB5nWsLOHtvdwaUmlas3YWG9fQ1kttK1Iwr2Bk06Ue1zGTA+fZfZJwjAwvUuBx4hiMjxSDKiVH6rA0761lzsTUXqZQEE2ws5oD58nx89pjLCjEkOSmE0vw/kGensvNdvaewediwxNoza7fKJ3Iu2uYnpsCkGKa7jvL/nO4DTau5oUFNHVx4jptvSDwuVk1g7J8AJfBimKWF+MxOH2LDw5R1zoKwO0Ovv+TuMWsCSwvpqqezYf47Cg1LUgBGksl56ulsBQaHILaVr45TcJ6GKA+aGc13Y3LwfUQfbFhdT2QW6WTmAFzCC7+RWvPwwBxC6WRgpYeemM8PpXpOfhdOB2APaUDPgqzyEsffjYI+hNEEiMBI6toUiY+F+EYN0L8cIFXFvHly3RGmJxJQtEVpT7I4iJ2v4rW5Pq52W63hdb43YzzPAxQksf8SVRfA8VXJ6lpYcFkXAZX7tLbT1Mnn/7CujkE0uz9wV5iJgiUYl4+uf5RlOnlZj46TEMQDUohBAKkxGPgMlCa/gRxC63tpYHQFWbx8XrKCkYBABo7+LWWxnYSCpeDrDQmZ1GYxTgPlqYzQm0rV1to6SGWwOtiZh7Pzac0Va89aFRohrk5wkxFJI5p4TTwu5Inx78A/C/2yG/XfwPjoubop9u02gAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAyMS0wNi0xMFQwMjozMzo0OSswMDowMAKV4QIAAAAldEVYdGRhdGU6bW9kaWZ5ADIwMjEtMDYtMTBUMDI6MzM6NDkrMDA6MDBzyFm+AAAAAElFTkSuQmCC

// @grant               none
// @run-at              document-end
// @include             https://www.baidu.com/s?*
// @include             https://www.google.com/search?*

// @version             0.1.1
// @require             https://cdn.staticfile.org/zepto/1.1.7/zepto.min.js
// @downloadURL https://update.greasyfork.org/scripts/427737/%E8%BD%BB%E9%87%8F%E7%BA%A7%E7%99%BE%E5%BA%A6%E8%B0%B7%E6%AD%8C%E6%90%9C%E7%B4%A2%E7%9B%B8%E4%BA%92%E8%B7%B3%E8%BD%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/427737/%E8%BD%BB%E9%87%8F%E7%BA%A7%E7%99%BE%E5%BA%A6%E8%B0%B7%E6%AD%8C%E6%90%9C%E7%B4%A2%E7%9B%B8%E4%BA%92%E8%B7%B3%E8%BD%AC.meta.js
// ==/UserScript==

function baiduAdapter() {
    const $ipt = document.querySelector('#kw');
    const styleText = 'cursor: pointer; width: 112px; height: 40px; line-height: 41px; line-height: 40px9; background-color: #4e6ef2; border-radius: 10px; font-size: 17px; box-shadow: none; font-weight: 400; border: 0; outline: 0; letter-spacing: normal; color: #fff; text-align: center;margin-left:10px'
    const btnSearch = `<span class="bg s_btn_wr"><input id="btnCustomSearch" type="button" value="Google" style="${styleText}"></span>`
    $('#form').append(btnSearch).on('click', '#btnCustomSearch', () => {
        window.open(`https://www.google.com/search?q=${$ipt.value}`)
    });
}

function googleAdapter() {
    const $ipt = document.querySelector('input.gLFyf.gsfi');
    const styleText = 'position: absolute; right: -120px; top: 0; background: #fff; text-align: center; width: 100px; height: 38px; border: 1px solid transparent; box-shadow: 0 2px 5px 1px rgb(64 60 67 / 16%); color: #1a73e8; border-radius: 24px;cursor:pointer;'
    const btnSearch = `<button style="${styleText}" id="btnCustomSearch" type="button">百度</button>`
    $('.A8SBwf').append(btnSearch).on('click', '#btnCustomSearch', () => {
        window.open(`https://www.baidu.com/s?wd=${$ipt.value}`)
    });
}

function main() {
    if (location.origin.endsWith('baidu.com')) {
        baiduAdapter();
    }
    if (location.origin.endsWith('google.com')) {
        googleAdapter();
    }
}

main();
