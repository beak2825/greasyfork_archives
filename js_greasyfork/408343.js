// ==UserScript==
// @name         贴吧签到助手
// @namespace    https://hsmyldk.top
// @version      0.5
// @description  自动签到，签到速度取决于未签到的吧的数量和网速,签到完成后会有提示，如果签到失败，会提示失败+失败的吧的数量，如果失败刷新页面就好了，具体情况请按F12查看控制台
// @author       Hsmyldk
// @match        https://tieba.baidu.com
// @match        https://tieba.baidu.com/index.html
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/408343/%E8%B4%B4%E5%90%A7%E7%AD%BE%E5%88%B0%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/408343/%E8%B4%B4%E5%90%A7%E7%AD%BE%E5%88%B0%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

/**
 * 修改提示的位置(textPosition)
 * 0右下角
 * 1左下角
 * 2左上角
 * 3右上角
 */
var textPosition = 2;
//下边的不要动
var tieba = [];
var badTieba = [];
var badItems = 0;
var first = true;
$('#moreforum').trigger(new Event('mouseenter'));
$('#moreforum').trigger(new Event('click'));
var items = document.getElementsByClassName('unsign');
for (var i = 0; i < items.length; i++) {
    var href = items[i].href;
    tieba.push(decodeURI(href.substring(('https://tieba.baidu.com/f?kw=').length, href.indexOf('&fr=index'))));
}
console.log(tieba);
if (tieba.length != 0)
    qd();

function qd() {
    if (tieba.length != 0) {
        var xml = new XMLHttpRequest();
        xml.open("POST", "https://tieba.baidu.com/sign/add?ie=utf-8&kw=" + tieba[0])
        xml.send();
        xml.onload = e => {
            var response = JSON.parse(e.currentTarget.response);
            if (response.no == 0) {
                console.log(tieba[0] + "签到成功");
            } else {
                if (decodeURI(response.error) == 'need vcode') {
                    badTieba.push(tieba[0]);
                } else {
                    console.log(tieba[0] + "签到失败:" + decodeURI(response.error))
                    badItems++;
                }
            }
            tieba.splice(0, 1);
            if (tieba.length == 0 && first) {
                tieba = badTieba;
                badTieba = [];
                first = false;
            }
            setTimeout(() => {
                qd();
            }, 100);
        }
    } else {
        if (badItems == 0) {
            showTips("已签到", textPosition);
        } else {
            showTips("失败" + badItems, textPosition);
        }
    }
}

/**
 * showTips方法与anim是一个小小的提示框模组
 */

/**
 * code from hsmyldk
 * position
 * 0右下角
 * 1左下角
 * 2左上角
 * 3右上角
 * @param {提示文本} text 
 * @param {文本位置} position 
 * @param {边框颜色} color
 */
function showTips(text, position, color) {
    if (color == null) color = '#00c8f5';
    if (position == null) position = 0;
    var Msg = document.createElement('div');
    Msg.id = "hsmyldk_signInBox";
    Msg.height = '50px';
    Msg.width = '300px';
    Msg.innerHTML = text;
    styleText = 'z-index: 1000;background-color: #fff;height: 40px;width: 200px;position: fixed;border-top: 2px solid ' + color + ';border-bottom: 2px solid ' + color + ';text-align: center;font-weight: bold;font-size: 16px;' + (text.length > 10 ? 'line-height: 20px;' : 'line-height: 40px;');
    switch (position) {
        case 1:
            {
                styleText += 'padding-right: 5px;left: -210px;bottom: 230px;border-radius:0 18px 18px 0;border-right: 2px solid ' + color + ';';
                break;
            }
        case 2:
            {
                styleText += 'padding-right: 5px;left: -210px;top: 230px;border-radius:0 18px 18px 0;border-right: 2px solid ' + color + ';';
                break;
            }
        case 3:
            {
                styleText += 'padding-left: 5px;right: -210px;top: 230px;border-radius: 18px 0 0 18px;border-left: 2px solid ' + color + ';';
                break;
            }
        default:
            {
                styleText += 'padding-left: 5px;right: -210px;bottom: 230px;border-radius: 18px 0 0 18px;border-left: 2px solid ' + color + ';';
            }

    }
    Msg.style = styleText;
    document.body.appendChild(Msg);
    anim(document.getElementById('hsmyldk_signInBox'), false);
}

/**
 * code from hsmyldk
 * @param {动画元素} item 
 */
function anim(item) {
    /**
     * LorR
     * true 左
     * false 右
     */
    var LorR = false;
    var direction = true;
    var i = item.style.right;
    if (i == null || i == NaN || i.length == 0) {
        i = item.style.left;
        LorR = true;
    }
    if (i == null || i == NaN || i.length == 0) {
        console.log('你有问题');
        return;
    }
    i = parseInt(i.substring(0, i.length - 2));
    var o = i;
    var width = item.style.width;
    width = parseInt(width.substring(0, width.length - 2)) + 20;
    /**
     * o
     * 如果>0就让它=0,i--
     * 如果=0就让它<0,i--
     * 如果<0就让它=0,i++
     */
    if (i < 0) direction = false;
    var interval = setInterval(() => {
        console.log(i);
        if (LorR) {
            item.style.left = (direction ? --i : ++i) + 'px';
        } else {
            item.style.right = (direction ? --i : ++i) + 'px';

        }
        if (o == 0) {
            if (Math.abs(i) == width) {
                if (interval != null) clearInterval(interval);
                item.remove();
            }
        } else {
            if (i == 0) {
                if (interval != null) clearInterval(interval);
                setTimeout(() => {
                    anim(item);
                }, 5000);
            }
        }
    }, 1);
}