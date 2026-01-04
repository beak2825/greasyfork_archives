// ==UserScript==
// @name         WXC
// @namespace    http://csrrr.greasyfork.org/
// @version      0.2
// @description  文
// @license None
// @match *://*.135editor.com/*
// @match *://*.yiban.io/*
// @downloadURL https://update.greasyfork.org/scripts/450884/WXC.user.js
// @updateURL https://update.greasyfork.org/scripts/450884/WXC.meta.js
// ==/UserScript==

let __appendBtn__ = function (dom, htmlTextFun) {
    if (dom && !dom.appendWXCBtn) {
        let btn = document.createElement('button');
        btn.textContent = '复制';
        dom.appendWXCBtn = true;
        if (htmlTextFun) {
            btn.onclick = function (e) {
                let text = htmlTextFun();
                if (text) {
                    let htmlText = new Blob([text], { type: 'text/html' });
                    let item = new ClipboardItem({
                        'text/html': htmlText
                    });
                    navigator.clipboard.write([item]);
                    e.cancelBubble = true;
                }
            }
        }
        return btn;
    }
    return false;
}

console.log('本地脚本')

/** 将定时检查的方法放到这里，返回定时的秒数 */
let checkFun;
let checkInterTime = 3;

//#region 135编辑器
//样式
if (location.href === "https://www.135editor.com/beautify_editor.html") {
    console.log('1ys')

    checkFun = function () {
        //去掉VIP提示   
        let vip = document.getElementById('role-vip-dialog');
        if (vip) {
            vip.style.display = 'none';
        }


        let lis = $('#editor-template-scroll li');
        for (let i = 0, len = lis.length; i < len; i++) {
            lis[i].classList.remove('vip-style');
        }
        // vip删除线
        $('.vip-flag').remove(); // .css('text-decoration', 'line-through').removeClass('vip-flag');
        // 去除小红点
        $('.user-unread-msgnum').hide();
        try {
            // 文章管理器会员
            articleManager.setVIP(true);
        } catch (error) { }
        

        let modal = document.getElementsByClassName('modal-backdrop show');
        if (modal.length > 0) {
            modal[0].style.display = 'none';
        }


        let yangshis = document.getElementsByClassName('style-item');
        for (let i = 0; i < yangshis.length; i++) {
            let yangshi = yangshis[i];
            let btn = __appendBtn__(yangshi, () => {
                let sec = yangshi.getElementsByTagName('section')[0];
                return sec.childNodes[0].innerHTML;
            });

            if (btn) {
                yangshi.appendChild(btn);
            }
        }

        //搜索结果
        let searchList = document.getElementById('style_search_list');
        if (searchList) {
            let rList = document.getElementsByClassName('yangshi clearfix');
            for (let i = 0; i < rList.length; i++) {
                let result = rList[i];
                let btn = __appendBtn__(result, () => {
                    return result.getElementsByTagName('section')[0].innerHTML;
                })
                if (btn) {
                    result.appendChild(btn);
                }
            }
        }
    }
}

//模板
if (location.href.startsWith('https://www.135editor.com/editor_styles/view_contribute')) {
    console.log('1mb')
    let muban = document.querySelector("#content-item");
    if (muban) {
        let btn = __appendBtn__(muban, () => {
            return muban.innerHTML;
        });
        if (btn) {
            muban.parentNode.parentNode.parentNode.insertBefore(btn, muban.parentNode.parentNode);
        }
    }
} else if (location.href.startsWith('https://www.135editor.com/editor_styles')) {
    //SVG
    let edt = document.getElementsByClassName('_135editor')[0];
    if (edt) {
        let btn = __appendBtn__(edt, () => {
            return edt.innerHTML;
        })
        if (btn) {
            btn.textContent = '复制(需使用同步)';
            document.querySelector("body > div.container-g > div.mode > div > div.r-main.fl > div.r-mode > div:nth-child(3)").appendChild(btn);
        }
    }

}
//#endregion

//#region 壹伴
//样式
if (location.href.startsWith('https://yiban.io/style_center')) {
    console.log('yys')
    checkFun = function () {
        let mils = document.getElementsByClassName('material-item-li');
        for (let i = 0; i < mils.length; i++) {
            let dets = mils[i].getElementsByClassName('detail')
            if (dets.length > 0) {
                let det = dets[0];
                let btn = __appendBtn__(det, () => {
                    return det.innerHTML
                })
                if (btn) {
                    // console.log(det[0].getElementsByTagName('section'))
                    det.parentNode.appendChild(btn);
                }
            }
        }
    }
}
//模板
if (location.href.startsWith('https://yiban.io/style_detail/template')) {
    console.log('ymb');
    checkFun = function () {
        let tbox = document.getElementsByClassName('template-box')[0];
        if (tbox) {
            let btn = __appendBtn__(tbox, () => {
                console.log('bbb')
                return tbox.innerHTML;
            })

            if (btn) {
                tbox.parentNode.insertBefore(btn, tbox);
            }
        }
    }
}

//#endregion

//#region 公众号文章
if (location.href.startsWith('https://mp.weixin.qq.com/s/')) {
    console.log('公众文章', document.getElementById('copyright_logo'));
    //公众原创文章提醒，避免复制内容导致侵权
    if (document.getElementById('copyright_logo')) {
        document.getElementById('page-content').style.backgroundColor = '#EF917D';
    }
}
//#endregion


//#region 滴答清单
if (location.href.startsWith('https://dida365.com/webapp/')) {

    checkFun = function () {
        //编辑器的工具条
        let mdtl = document.getElementsByClassName('md-tl')[0]
        // console.log(mdtl);

        if (!mdtl) {
            let showToolBarBtn = document.querySelector("#td-footer > div > div.flex.td-items.items-center > div:nth-child(1) > a")
            // console.log(showToolBarBtn)
            if (showToolBarBtn && showToolBarBtn.getAttribute('title') === '显示样式栏') {
                console.log('打开工具条')
                showToolBarBtn.click();
            }
        }
        return 2;
    }
}
//#endregion

 


//#region 图怪兽
if (location.href.startsWith('https://ue.818ps.com/v4/')) {
  console.log('图怪兽')
    checkFun = function () {    
        let roots =document.getElementsByClassName('image-watermark');
        // console.log(roots)

        for(let i=0;i<roots.length;i++){
            let r = roots[i]
            r.parentNode.removeChild(r)
        } 
        return 5;
    }
}
//#endregion




//#region 钉钉文档
// if (location.href.startsWith('https://docs.dingtalk.com/i/nodes/')) {
//   console.log('钉钉文档')
//     checkFun = function () {    
//         let root = document.getElementById('root');
//         root.style.position = 'fixed'
//         root.style.top = '0px';
//         root.style.left = '0px';
//         return 5;
//     }
// }
//#endregion

function __Interval() {
    if (checkFun) {
        let re = checkFun();
        if (re) {
            checkInterTime = re
        }
    }

    setTimeout(() => {
        __Interval();
    }, checkInterTime * 1000);
}
__Interval();
