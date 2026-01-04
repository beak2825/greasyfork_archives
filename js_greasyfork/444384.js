// ==UserScript==
// @name         哔哩哔哩粉丝勋章排序,以及去除分页
// @namespace    http://tampermonkey.net/
// @version      1.0.4
// @description  去除分页,按照牌子降序排序,经验条完全显示
// @author       aotmd
// @match        https://link.bilibili.com/p/center/*
// @noframes
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/444384/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E7%B2%89%E4%B8%9D%E5%8B%8B%E7%AB%A0%E6%8E%92%E5%BA%8F%2C%E4%BB%A5%E5%8F%8A%E5%8E%BB%E9%99%A4%E5%88%86%E9%A1%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/444384/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E7%B2%89%E4%B8%9D%E5%8B%8B%E7%AB%A0%E6%8E%92%E5%BA%8F%2C%E4%BB%A5%E5%8F%8A%E5%8E%BB%E9%99%A4%E5%88%86%E9%A1%B5.meta.js
// ==/UserScript==
let setting = {
    /*表格每行的高度,进行修改[true/false]*/
    紧密模式: true,
    /*要修改成的高度,数字*/
    高度: 24,
};
(function () {
    if (setting.紧密模式) {
        addStyle(`
            div.table-ctnr.p-relative > table.center-grid {

                line-height: ` + setting.高度 + `px;
            }
            div.table-ctnr.p-relative > table.center-grid > tbody tr {
                height: ` + setting.高度 + `px;
            }
        `);
    }
    /*将文字全部显示*/
    addStyle(`
        .t-over-hidden {
            overflow: inherit!important;
            -o-text-overflow: inherit!important;
            text-overflow: inherit!important;
        }
    `);
    let style = addStyle(`
        /*先隐藏表格*/
        .table-ctnr.p-relative {
            display: none;
        }
        /*隐藏过渡*/
        .link-panigation-ctnr.t-right {
            display: none;
        }
        .progress-img.bg-no-repeat.bg-center.p-center {
            display: none;
        }
    `);
    style["type"] = 'text';
    let obs;
    /*当超过指定时间后结束更改*/
    let setTime = setTimeout(() => {
        style["type"] = 'text';
        obs.disconnect();
    }, 30 * 1000);

    let list = [];
    obs = dom修改事件不暂停(document.querySelector("#live-center-app > div"), () => {
        /*等表格出现*/
        const oTab = document.querySelector("div.table-ctnr.p-relative > table.center-grid");
        if (oTab == null||oTab.getAttribute('flag')) {
            return;
        }
        console.log(oTab);
        /*隐藏翻页和过渡动画*/
        style["type"] = 'text/css';
        /*所有牌子抓取*/
        for (let i = 0; i < oTab.tBodies[0].rows.length; i++) {
            list.push(oTab.tBodies[0].rows[i]);
        }
        oTab.setAttribute('flag',true)
        /*下一页*/
        let next = document.querySelector("div.link-panigation-ctnr.t-right > ul > li:last-child");
        if (next.innerText === '下一页' && next.style.cssText !== 'display: none;') {
            next.click();
        } else {
            /*如果不存在则放弃监听*/
            obs.disconnect();
            /*排序,显示*/
            start();
            /*停用指定css*/
            style["type"] = 'text';
            /*关闭初始化定时器*/
            window.clearInterval(setTime);
            /*再次打开时恢复*/
            dom修改事件(document.querySelector("#live-center-app > div > main"), () => {
                /*等表格出现*/
                const oTab = document.querySelector("div.table-ctnr.p-relative > table.center-grid");
                if (oTab == null) {
                    return;
                }
                /*且分页存在*/
                const link = document.querySelector("div.link-panigation-ctnr.t-right");
                if (link == null) {
                    return;
                }
                /*删除tr内容*/
                for (let i = 0, len = oTab.tBodies[0].rows.length; i < len; i++) {
                    oTab.tBodies[0].rows[0].remove();
                }
                /*显示内容*/
                for (let i = 0; i < list.length; i++) {
                    oTab.tBodies[0].appendChild(list[i]);
                }
                /*删除分页*/
                document.querySelector("div.link-panigation-ctnr.t-right").remove();

                console.log("调用之前的缓存");
            })
        }
    });

    function start() {
        /*排序*/
        list.sort(function (tr1, tr2) {
            let t1 = tr1.cells[2].innerText.replaceAll(' ', '').split('/');
            let a1 = parseInt(t1[0]);
            let rank1 = parseInt(tr1.cells[0].querySelector("div > div.fans-medal-level").innerText);

            let t2 = tr2.cells[2].innerText.replaceAll(' ', '').split('/');
            let a2 = parseInt(t2[0]);
            let rank2 = parseInt(tr2.cells[0].querySelector("div > div.fans-medal-level").innerText);

            if (rank2 !== rank1) {
                return rank2 - rank1
            }
            return a2 - a1;
        });
        /*删除tr内容*/
        const oTab = document.querySelector("div.table-ctnr.p-relative > table.center-grid");
        for (let i = 0, len = oTab.tBodies[0].rows.length; i < len; i++) {
            oTab.tBodies[0].rows[0].remove();
        }
        /*显示内容*/
        for (let i = 0; i < list.length; i++) {
            oTab.tBodies[0].appendChild(list[i]);
        }
        /*删除分页*/
        const link = document.querySelector("div.link-panigation-ctnr.t-right");
        if (link != null) {
            link.remove();
        }

        console.log("排序初始化完毕");
    }

    /**
     * 只能调用一次,若多次调用该函数,且在执行过程中再次出发另一个实例则将产生死循环
     * dom修改事件,包括属性,内容,节点修改
     * @param document 侦听对象
     * @param func  执行函数
     */
    function dom修改事件(document, func) {
        const MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver; //浏览器兼容
        const config = {
            attributes: true,
            childList: true,
            characterData: true,
            subtree: true
        }; //配置对象
        const observer = new MutationObserver(function () {
            //进入后停止侦听
            observer.disconnect();
            try {
                func();
            } catch (e) {
                console.error('执行错误')
            }
            //结束后继续侦听
            observer.observe(document, config);
        });
        observer.observe(document, config);
        return observer;
    }

    /**
     * 只能调用一次,若多次调用该函数,且在执行过程中再次出发另一个实例则将产生死循环
     * dom修改事件不暂停,包括属性,内容,节点修改
     * @param document 侦听对象
     * @param func  执行函数
     */
    function dom修改事件不暂停(document, func) {
        const MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver; //浏览器兼容
        const config = {
            attributes: true,
            childList: true,
            characterData: true,
            subtree: true
        }; //配置对象
        const observer = new MutationObserver(function () {
            try {
                func();
            } catch (e) {
                console.error('执行错误')
            }
        });
        observer.observe(document, config);
        return observer;
    }

    //添加css样式
    function addStyle(rules) {
        let styleElement = document.createElement('style');
        styleElement["type"] = 'text/css';
        document.getElementsByTagName('head')[0].appendChild(styleElement);
        styleElement.appendChild(document.createTextNode(rules));
        return styleElement;
    }
})();