// ==UserScript==
// @name         bugku自动签到
// @namespace    bugku
// @version      0.3
// @description  bugku自动签到脚本
// @author       Geekz
// @match        https://ctf.bugku.com/index.html
// @match        https://ctf.bugku.com/
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/437180/bugku%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/437180/bugku%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0.meta.js
// ==/UserScript==



/**
 * 修改提示的位置(textPosition)
 * 0右下角
 * 1左下角
 * 2左上角
 * 3右上角
 */
var textPosition = 3;
//下边的不要动
if (GM_getValue('CSDNsignInfo') != new Date().getDay()){
    signInfo();
    setTimeout(reload,2000);
}

function signInfo() {
    var xml = new XMLHttpRequest();
    xml.open("GET", "https://ctf.bugku.com/user/checkin");
    xml.withCredentials = true;
    xml.send();
    xml.onload = e => {
        var response = "签到成功";
        showTips(response, textPosition);
        GM_setValue('CSDNsignInfo', new Date().getDay());
        console.log(response);
    }
}

function reload(){
    location.reload();
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
    var styleText = 'z-index: 1000;background-color: #fff;height: 40px;width: 200px;position: fixed;border-top: 2px solid ' + color + ';border-bottom: 2px solid ' + color + ';text-align: center;font-weight: bold;font-size: 16px;' + (text.length > 10 ? 'line-height: 20px;' : 'line-height: 40px;');
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
    try {
        if (LorR) {
            $(item).animate({ left: '0px' }, 500);
            setTimeout(() => {
                $(item).animate({ left: '-210px' }, 500);
            }, 5500);
        } else {
            $(item).animate({ right: '0px' }, 500);
            setTimeout(() => {
                $(item).animate({ right: '-210px' }, 500);
            }, 5500);
        }
        return;
    } catch (error) {
        console.log('不支持jQuery')
        console.log(e);
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