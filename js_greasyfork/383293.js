// ==UserScript==
// @name         Mr.T web filter
// @namespace    http://tampermonkey.net/
// @version      0.10
// @description  'Mr.T自用网站过滤脚本'
// @author       Mr.T
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/383293/MrT%20web%20filter.user.js
// @updateURL https://update.greasyfork.org/scripts/383293/MrT%20web%20filter.meta.js
// ==/UserScript==

/*
  @ match        *://blog.csdn.net/*
  https://blog.csdn.net/qq_37338627/article/details/90214394 语法介绍
*/

//backspace网页后退功能
function goBack(e) {
    // let ev = e || window.event;
    // if(ev.keyCode == 8 && !document.activeElement.id){
    //     history.back();
    // }
}

//判断是否是pc环境
function isPC() {
    //console.log('是否再PC端---',!/Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent));
    return !/Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent);
}

/**
 * nodeList遍历事件
 * @param nodeItem      node节点
 * @param {Function} fn  cb事件
 * @param {Object} css   css样式对象
 * */
function nodeHandler(nodeList, fn, css) {
    for (let item of nodeList) {
        fn && fn(item, css)
    }
}

//删除node方法
function nodeRemove(nodeItem) {
    nodeItem.remove();
    //console.log('删除node方法',nodeItem)
}

/**
 * 设置node节点样式
 * @param nodeItem      node节点
 * @param {Object} css   css样式对象
 * */
function nodeSetStyle(nodeItem, css) {
    //nodeItem.style = {...nodeItem.style,...css};
    for (let cssItem in css) {
        nodeItem.style[cssItem] = css[cssItem]
    }
    //console.log('设置node节点样式',nodeItem,nodeItem.style,css)
}

//查询node节点
function querySelector(nodeName) {
    return document.querySelectorAll(nodeName)
}

//获取元素父级
function nodeParent(nodeName) {
    return nodeName.parentNode
}

//获取host地址
function getHost() {
    return window.location.host
}

function hideImg() {
    let btn = document.createElement('div');
    let imgStyle = document.createElement('style');
    let styleContent = 'img{display:none !important}';
    let trigger = '!important';
    let objective = {
        _text: 'img{display:none ',
        _event: function (into) {
            trigger = !into ? '!important' : '';
            imgStyle.innerHTML = !into ? this._text + '!important}' : '';
        },
        st: function () {
            this.stId = setTimeout(() => {
                nodeSetStyle(btn, { display: 'none' })
            }, 3000);
        },
        stId: null
    };

    btn.innerHTML = 'img显示/隐藏';
    nodeSetStyle(btn, {
        'position': 'fixed',
        'top': '50px',
        'right': '20px',
        'z-index': '99999',
        'width': '120px',
        'font-size': '18px',
        'background-color': '#666',
        'color': 'greenyellow',
        'text-align': 'center',
        'border-radius': '8px',
        'border': '2px white solid',
        'line-height': '40px',
        'user-select': 'none'
    });
    btn.onclick = function () {
        //console.log('onclick')
        objective._event(trigger);
    }
    document.head.appendChild(imgStyle);
    document.body.appendChild(btn);

    objective.st();

    btn.onmouseover = function () {
        clearTimeout(objective.stId);
        btn.onmouseleave = function () {
            objective.st();
        }
    }
}

/**
 * 复制内容到粘贴板
 * content : 需要复制的内容
 * message : 复制完后的提示，不传则默认提示"复制成功"
 */
function copyToClip(content, message) {
    console.log('copyToClip', content);
    let aux = document.createElement("input");
    aux.setAttribute("value", content);
    document.body.appendChild(aux);
    aux.select();
    document.execCommand("copy");
    document.body.removeChild(aux);
    if (message == null) {
        alert("复制成功");
    } else {
        alert(message);
    }
}
/**
 * swagger提取接口名称
 * is-open opblock-summary opblock-summary-method opblock-summary-path opblock-summary-description 
 */
function swagger() {
    let nodeList = querySelector('.opblock-tag-section');
    let swaggerBoxShow = document.createElement('div');
    let swaggerBox = document.createElement('div');
    document.body.appendChild(swaggerBoxShow);
    swaggerBoxShow.appendChild(swaggerBox);

    nodeSetStyle(swaggerBoxShow, {
        'position': 'fixed',
        'top': '50px',
        'right': '20px',
        'z-index': '99999',
        'min-width': '120px',
        'text-align': 'center',
        'border-radius': '8px',
        'border': '1px white solid',
        'background-color': '#ccc',
        'box-shadow': '2px 2px 5px 5px rgb(0 0 0 / 15%)',
        'user-select': 'none',
        'cursor': 'copy'
    });

    //插入已打开的内容
    function appendContent() {
        setTimeout(() => {
            //页面中已经打开的分类下的所有接口
            let opContent = querySelector('.opblock-tag-section.is-open .opblock-summary') || [];
            // let arr = '';
            // opContent.forEach(item => { arr += `<p onclick="javascript:${copyToClip(item.innerText.replace(/\n/g, '-'))}">${item.innerText.replace(/\n/g, '-')}</p>` })
            swaggerBox.innerHTML = ''
            opContent.forEach(item => {
                let tagP = document.createElement('p');
                let text = item.innerText.replace(/\n/g, '-')
                tagP.addEventListener('click', () => { copyToClip(text) });
                tagP.innerText = text;
                // childrenList.push(tagP);
                swaggerBox.appendChild(tagP)

                // arr += `<p onclick="${()=>{copyToClip(item.innerText.replace(/\n/g, '-'))}}">${item.innerText.replace(/\n/g, '-')}</p>` 
            })
            // swaggerBox.innerHTML = arr;
        }, 0);
    }
    appendContent();
    nodeList.forEach(item => {
        console.log('swagger nodeList item', item);
        let oldClick = item.onclick;
        item.onclick = () => {
            console.log('item.onclick');
            oldClick && oldClick();
            appendContent();
        }
    })
}

/**
 * 轮询+判断条件
 * @param {Function} bool-return bool值的函数
 * @param {Function} fn-执行函数
 */
function polling(bool, fn = swagger) {
    if (!bool())
        setTimeout(() => { polling(bool, fn) }, 500);
    else
        fn()
}

//判断是否运行在iframe中
function inIframe() {
    //console.log('self.frameElement',self.frameElement,'---',self);
    //console.log('window.frames',window.frames.length != parent.frames.length,'---',window.frames,'---',parent.frames);
    //console.log('window.frames*----------------',window,'---',parent);
    //console.log('self != top',self != top,'---',self,'---',top);
    console.log(self === window.frames, self === window, self === top, self === parent, self === parent.frames)
    //frames属性:返回  window 本身，它是一个类似数组的对象，列出当前窗口的直接子帧。
    return self.frameElement && self.frameElement.tagName == "IFRAME" || self !== top || window !== parent || window.frames !== parent.frames;
}

(function () {
    //window.addEventListener("DOMCharacterDataModified", function(e){console.log('DOMCharacterDataModified',e)}, true);
    //window.addEventListener("DOMAttributeNameChanged", function(e){console.log('DOMAttributeNameChanged',e);}, true);
    //window.addEventListener("DOMCharacterDataModified", function(e){console.log('DOMCharacterDataModified',e);}, true);
    //window.addEventListener("DOMElementNameChanged", function(e){console.log('DOMElementNameChanged',e);}, true);
    //window.addEventListener("DOMNodeInserted", function(e){console.log('DOMNodeInserted',e);}, true);
    //window.addEventListener("DOMNodeInsertedIntoDocument", function(e){console.log('DOMNodeInsertedIntoDocument',e);}, true);
    //window.addEventListener("DOMNodeRemoved", function(e){console.log('DOMNodeRemoved',e);}, true);
    //window.addEventListener("DOMNodeRemovedFromDocument", function(e){console.log('DOMNodeRemovedFromDocument',e);}, true);
    //window.addEventListener("DOMSubtreeModified", function(e){console.log('DOMSubtreeModified',e);}, true);

    //如果在iframe中
    if (inIframe()) return;
    //绑定backSpace后退
    document.onkeydown = goBack;

    setTimeout(() => {
        switch (getHost()) {
            //csdn下的筛选规则
            case 'blog.csdn.net':
                //弹出的侧边框
                nodeHandler(querySelector('.indexSuperise'), nodeRemove);

                //应该是下面的广告
                nodeHandler(querySelector('.pulllog-box'), nodeRemove);

                //正文内容显示
                nodeHandler(querySelector('#article_content'), nodeSetStyle, { height: '100%' });

                //nodeHandler(querySelector('.title-article'),nodeSetStyle,{display:'none'});

                //右侧的广告
                //nodeHandler(querySelector('.recommend-fixed-box>div,.recommend-fixed-box>li'),nodeRemove);
                nodeHandler(querySelector('.recommend-fixed-box>div'), nodeSetStyle, { display: 'none' });

                //正文的阅读收藏按钮
                nodeHandler(querySelector('.hide-article-box'), nodeRemove);
                //评论栏下面的广告
                nodeHandler(querySelector('.mediav_ad'), nodeRemove);

                nodeHandler(querySelector('#passportbox'), nodeRemove);

                setTimeout(() => {
                    //nodeHandler(querySelector('iframe'),nodeRemove);
                    //右侧的广告
                    //nodeHandler(querySelector('ins'),nodeRemove);
                    //登陆提示
                    nodeHandler(querySelector('.login-mark'), nodeRemove);

                }, 50)

                break;
            case 'rd-gateway.zhongyanyunlian.com:7000':
                polling(() => !!querySelector('.opblock-tag-section').length);
                console.log('识别swagger');
                break;
            default:
                if (isPC()) hideImg();
                console.log('当前地址', getHost());
        }
    }, 500);

})();