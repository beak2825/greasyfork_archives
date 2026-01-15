// ==UserScript==
// @name         FBA状态标记
// @namespace    http://www.wukui.fun
// @version      202601091432
// @description  在新版fba货件界面显示自定义的额外信息
// @author       吴奎
// @license      MIT license
// @match        https://sellercentral.amazon.com/gp/ssof/shipping-queue.html/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=amazon.com
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle

// @downloadURL https://update.greasyfork.org/scripts/513289/FBA%E7%8A%B6%E6%80%81%E6%A0%87%E8%AE%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/513289/FBA%E7%8A%B6%E6%80%81%E6%A0%87%E8%AE%B0.meta.js
// ==/UserScript==

(function () {
    'use strict';
    //----------------------------------------------------脚本开始
    GM_addStyle(`

    :root {
    --status-运输中:     #99bbe1;
    --status-已完成:     #999999;
    --status-正在接收:   #bcd1c1;
    --status-已发货:     #b2b7bd;
    --status-准备发货:   #ef9999;
    --status-已登记:     #c5c385;
    --status-已取消:     #4d4d4d;
}

[fbanode="运输中"]{
	background: var(--status-运输中);
}
[fbanode="已完成"]{
	background: var(--status-已完成);
}
[fbanode="正在接收"]{
	background: var(--status-正在接收);
}
[fbanode="已发货"]{
	background: var(--status-已发货);
}
[fbanode="准备发货"]{
	background: var(--status-准备发货);
}
[fbanode="已登记"]{
	background: var(--status-已登记);
}
[fbanode="已取消"]{
	background: var(--status-已取消);
}

/*手动状态元素颜色*/

[zhuangtai="运输中"]{
	background-color: var(--status-运输中);
}
[zhuangtai="已完成"]{
	background-color: var(--status-已完成);
}
[zhuangtai="正在接收"]{
	background-color: var(--status-正在接收);
}
[zhuangtai="已发货"]{
	background-color: var(--status-已发货);
}
[zhuangtai="准备发货"]{
	background-color: var(--status-准备发货);
}
[zhuangtai="已登记"]{
	background-color: var(--status-已登记);
}
[zhuangtai="已取消"]{
	background-color: var(--status-已取消);
}

`);


    // 检查URL是否符合要求，如果不符直接返回,和AWD隔离一下
    if (!window.location.href.includes('shipping-queue.html') || !window.location.href.includes('fbashipment')) {
        console.log('URL不符合要求，脚本退出');
        return;
    }

    //console.log('FBA界面改造');
    // 检查元素是否存在的函数，使用递归和setTimeout  
    function checkYuanSuCunZai(xuanZeQi, huiDiaoHanShu, shiJianJianGe = 10, zuiDaChiXuShiJian = 10000, kaiShiShiJian = Date.now()) {
        const xianZaiShiJian = Date.now();
        if (xianZaiShiJian - kaiShiShiJian >= zuiDaChiXuShiJian) {
            // 如果达到最大持续时间，则停止检查  
            console.error('元素在指定时间内没找到!');
            return;
        }

        const muBiaoJieDian = document.querySelector(xuanZeQi);
        if (muBiaoJieDian) {
            console.log('在指定时间内找到元素!');
            // 如果元素存在，则执行回调函数并停止检查  
            huiDiaoHanShu(muBiaoJieDian);
        } else {
            // 如果元素不存在，则设置另一个setTimeout来再次检查  
            setTimeout(function () {
                checkYuanSuCunZai(xuanZeQi, huiDiaoHanShu, shiJianJianGe, zuiDaChiXuShiJian, kaiShiShiJian);
            }, shiJianJianGe);
        }
    }

    // 当观察到变化时执行的回调函数  
    function bianHuaHuiDiao(bianHuaLieBiao, guanChaQi) {
        for (let bianHua of bianHuaLieBiao) {
            if (bianHua.type === 'childList') {
                bianHua.addedNodes.forEach(function (jieDian) {
                    console.log('添加的节点: ', jieDian);
                    chuLiJieDian(jieDian);
                });
                bianHua.removedNodes.forEach(function (jieDian) {
                    console.log('删除的节点: ', jieDian);
                });
            }
        }
    }








    // 调用检查元素并观察的函数
    // 假设我们要观察的元素是 '#tab-view #main-table > kat-table > kat-table-body'
    checkYuanSuCunZai('#tab-view #main-table > kat-table > kat-table-body', function (muBiaoJieDian) {
        const peiZhi = { childList: true, subtree: false };
        const guanChaQi = new MutationObserver(bianHuaHuiDiao);
        guanChaQi.observe(muBiaoJieDian, peiZhi);
        //console.log('yuan su yi zhao dao bing kai shi guan cha...');
    });



    //上面是启动观察者的函数
    //--------------------------------------正式代码---------------------------------

    /**目前用观察者调用的 ,参数一是节点对象*/
    function chuLiJieDian(node) {
        let fbaHaoMa = tiQuFBAhaoMa(node);
        // 提取货件信息中的FBA状态，并在页面上添加额外的信息
        gat_all_json(fbaHaoMa, node);
        //console.log(fbaHaoMa)
    }


    /** 提取货件信息中的FBA编号 */
    function tiQuFBAhaoMa(node) {
        // 使用 firstElementChild 获取第一个子元素  
        var firstChild = node.firstElementChild;

        // 检查第一个子元素是否有足够的子元素节点  
        if (firstChild.children.length > 1) {
            // 获取第二个 <div> 元素（索引从0开始，所以第二个元素的索引是1）  
            var secondDiv = firstChild.children[1]; // 这将是第二个 <div> 元素（如果它是一个元素节点）  

            // 确保secondDiv确实是一个元素节点，并且我们想要获取它的文本内容  
            if (secondDiv.nodeType === node.ELEMENT_NODE && secondDiv.tagName.toLowerCase() === 'div') {
                // 获取第二个 <div> 元素的内容  
                var secondDivContent = secondDiv.textContent || secondDiv.innerText;

                // 使用split()方法按逗号分割字符串，并获取第一个部分（即FBA编号）  
                var fbaNumber = secondDivContent.split(',')[0].trim(); // trim()用于去除可能存在的空格  
                // 在secondDiv元素上添加fba属性  
                secondDiv.setAttribute('fbahao', fbaNumber);
                // 在传入的node上也添加fba属性  
                node.setAttribute('fbanode', fbaNumber);
                // 输出FBA编号  
                //console.log('FBA货件编号:', fbaNumber);
                return fbaNumber;
            } else {
                //console.log('第一个 <kat-table-cell> 下的第二个子节点不是一个 <div> 元素。');
            }
        } else {
            console.error('第一个 <kat-table-cell> 元素下没有足够的子元素。');
        }
    }
    /** 提取货件信息中的FBA状态，并在页面上添加额外的信息 */


    //-------------------------网络请求----开始--------------------------
    //-------------------------网络请求----开始--------------------------


    /**获取货件状态记录*/
    function gat_all_json(fba, node) {
        console.log('/**获取货件状态记录*/');
        GM_xmlhttpRequest({
            method: 'GET',
            url: `http://127.0.0.1:3270/fba_zhuang_tai?fba=${fba}&type=get_zhuang_tai`,
            onload: function (response) {
                //console.log('Request sent successfully:', response);
                if (response.status === 200) {
                    const JieGuo = response.responseText;
                    //console.log(`查询_返回fba的状态是: ${JieGuo}`);
                    if (JieGuo) {
                        if (JieGuo != "_未设置") {
                            SheZhiZhuangTai(node, fba, JieGuo);
                        } else {
                            SheZhiZhuangTai(node, fba, "_没设置");
                        }
                    } else {
                        SheZhiZhuangTai(node, fba, "_没设置");
                        //console.log("获取状态失败或者设置的空值");
                    }
                }
            },
            onerror: function (error) {
                console.error('发送请求出错:', error);
            }
        });
    }

    /**设置货件状态*/
    function set_all_json(fba, zhuang_tai) {
        GM_xmlhttpRequest({
            method: 'GET',
            url: `http://127.0.0.1:3270/fba_zhuang_tai?fba=${fba}&type=set_zhuang_tai&zhuang_tai=${zhuang_tai}`,
            onload: function (response) {
                //console.log('Request sent successfully:', response);
                if (response.status === 200) {
                    const JieGuo = response.responseText;
                    //console.log(`设置_返回fba的状态是: ${JieGuo}`);
                    if (JieGuo) {
                        if (JieGuo != "_设置失败") {
                            GengGaiZhuangTai(fba, JieGuo);
                        }
                    } else {
                        //console.log("设置状态失败或者设置的空值");
                    }
                }
            },
            onerror: function (error) {
                console.error('Error sending request:', error);
            }
        });
    }


    //-------------------------网络请求----结束--------------------------
    //-------------------------网络请求----结束--------------------------



    //-------------------------dom操作----开始--------------------------
    //-------------------------dom操作----开始--------------------------
    function GengGaiZhuangTai(fba, JieGuo) {
        // 使用模板字符串来构造属性选择器  
        let selector = `select[fba_zt="${fba}"]`;
        // 使用 querySelector 查找第一个匹配的元素  
        let selectElement = document.querySelector(selector);
        if (selectElement) {
            // 设置 select 元素的选中项的值  
            selectElement.value = JieGuo; // 假设 JieGuo 是你想要设置的选中项的值  
            //console.log("设置列表选中项已完成")
        } else {
            console.error(`没有找到具有 fba_zt 属性值为 "${fba}" 的 select 元素。`);
        }
    }


    function SheZhiZhuangTai(node, FBAhaoMa, JieGuo) {
        // 获取第七个子元素  
        let seventhElement = node.children[6];
        if (!seventhElement) {
            console.error('没有找到第七个子元素节点。');
            return null; // 或者抛出错误  
        }

        // 在第七个子元素中查找id为status-and-pick-date的元素
        let labelElement = seventhElement.querySelector('#status-and-pick-date');
        if (!labelElement) {
            console.error('在第七个子元素中没有找到id为status-and-pick-date的元素。');
            return null; // 或者抛出错误  
        }

        // 获取label属性的值
        let div_zhuangTaiYuanSu=labelElement.querySelector('#shipment-status');
        let labelValue = div_zhuangTaiYuanSu.textContent;



        // 创建一个新的select元素  
        let selectElement = document.createElement('select');
        selectElement.setAttribute('zhuangtai', JieGuo);
        selectElement.style.textAlign = 'center'; // 水平居中文本  
        selectElement.style.width = '98px'; // 设置默认宽度  
        selectElement.style.height = '20px'; // 设置默认宽度  
        selectElement.style.fontSize = '12px';// 设置文字大小
        //selectElement.style.backgroundColor = '#eee'; // 设置背景色
        selectElement.style.border = '0px solid white'; // 1像素 实线 白色边框
        selectElement.style.borderRadius = '10px'; // 设置圆角半径为10像素

        // 定义列表内容  
        let options = ["","处理中","准备发货","已发货","运输中","已送达", "已登记", "正在接收", "已完成", "已取消", "临时状态","-----"];

        // 遍历列表内容，为每个选项创建一个option元素并添加到select元素中  
        options.forEach(option => {
            let optionElement = document.createElement('option');
            optionElement.value = option;
            optionElement.textContent = option;
            selectElement.appendChild(optionElement);
        });

        // 设置select元素的fba_zt属性  
        selectElement.setAttribute('fba_zt', FBAhaoMa);
        //设置select元素的选中项
        selectElement.value = JieGuo;
        // 将新的select元素添加到labelElement的父元素的子节点列表的末尾  
        labelElement.parentNode.appendChild(selectElement);

        // 在labelElement元素上添加fbazt属性  
        labelElement.setAttribute('fbazt', FBAhaoMa);

        // 在传入的node上也添加fba属性  
        node.setAttribute('fbanode', labelValue);



        // 为select元素添加change事件监听器，当用户选择一个选项时触发  
        selectElement.addEventListener('change', function () {
            // 获取用户选中的状态值  
            let selectedValue = selectElement.value;
            selectElement.setAttribute('zhuangtai', selectedValue);
            // 调用传入的回调函数，并传入选中的状态值  
            set_all_json(selectElement.getAttribute('fba_zt'), selectedValue);
            // 在状态改变后，移除select元素和相应的事件监听器  
            //document.body.removeChild(selectElement);
        });

        // 给这个状态div添加一个点击事件
        div_zhuangTaiYuanSu.addEventListener('click', function(e) {
            selectElement.value = labelValue;
            selectElement.dispatchEvent(new Event('change'));
            console.log('状态被点击,直接改变状态', e.target);
        });

        // 返回label属性值的纯文本  
        return labelValue;
    }

    //-------------------------------------------------脚本结束

})();