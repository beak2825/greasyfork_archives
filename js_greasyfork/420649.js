// ==UserScript==
// @name         AI翻译和搜索
// @namespace    butaixianran
// @version      0.7
// @description  划词AI翻译+搜索。AI翻译按质量排序。调用：金山词霸，阿里翻译，百度翻译，搜狗翻译，腾讯翻译，彩云小译，DeepL，沪江日语词典等。搜索包含：知乎，b站，百科，youtube，twitter等。去掉了原作者提供的大量不常用词典。
// @author       barrer, modified by butaixianran
// @homepage     https://github.com/butaixianran/AI-Translate-and-Search
// @match        *://*/*
// @include      https://*/*
// @include      file:///*
// @run-at       document-start
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @downloadURL https://update.greasyfork.org/scripts/420649/AI%E7%BF%BB%E8%AF%91%E5%92%8C%E6%90%9C%E7%B4%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/420649/AI%E7%BF%BB%E8%AF%91%E5%92%8C%E6%90%9C%E7%B4%A2.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Your code here...
    // 注意：自定义修改后把 “@version” 版本号改为 “10000” 防止自动更新
    /**样式*/
    var style = document.createElement('style');
    var zIndex = '2147473647'; // 渲染图层
    style.textContent = `
    :host{all:unset!important}
    :host{all:initial!important}
    *{word-wrap:break-word!important}
    img{cursor:pointer;display:inline-block;width:20px;height:20px;border:1px solid #dfe1e5;border-radius:4px;background-color:rgba(255,255,255,1);padding:2px;margin:0;margin-right:5px;box-sizing:content-box;vertical-align:middle}
    img:last-of-type{margin-right:auto}
    img:hover{border:1px solid #f90}
    img[is-more]{display:none}
    tr-icon{display:none;position:absolute;padding:0;margin:0;cursor:move;background:transparent;box-sizing:content-box;font-size:13px;text-align:left;border:0;color:black;z-index:${zIndex}}
    `;
    // iframe 工具库
    var iframe = document.createElement('iframe');
    var iframeWin = null;
    var iframeDoc = null;
    iframe.style.display = 'none';
    var gm = {
        TEXT: 'barrer.translate.data.transfer.text',
        REDIRECT_URL: 'barrer.translate.data.transfer.redirect_url',
        HIDE: 'barrer.translate.data.config.hide',
        SORT: 'barrer.translate.data.config.sort',
        reset: function () {
            GM_deleteValue(this.TEXT);
            GM_deleteValue(this.REDIRECT_URL);
            GM_deleteValue(this.HIDE);
            GM_deleteValue(this.SORT);
        },
        set: function (key, value) {
            GM_setValue(key, value);
        },
        get: function (key, myDefault) {
            var value = GM_getValue(key);
            return isNotNull(value) || !isNotNull(myDefault) ? value : myDefault;
        }
    }
    var dataTransfer = {
        beforePopup: function (popup) {
            var text = window.getSelection().toString().trim();
            gm.set(gm.TEXT, text);
            popup(text);
        },
        beforeCustom: function (custom) {
            var text = gm.get(gm.TEXT, '');
            gm.set(gm.TEXT, '');
            custom.forEach(function (cus) {
                cus(text);
            });
        }
    };
    var iconArray = [{
                name: '复制纯文本',
                id: 'copy',
                image: 'data:image/png;base64,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',
                host: ['copy.example.com'],
                popup: function (text) {

                    //监听剪切板复制事件，一旦有复制操作，把复制的数据改为纯文本
                    // document.oncopy = function (e) {
                    //     e.clipboardData.setData("text/plain", text);
                    ////下面这行代码，会导致正常的复制无效化，因此不要用监听事件的方法，而是重写一个方法
                    //     e.preventDefault();
                    // };

                    //复制选择的文本
                    // let isCopied = document.execCommand("copy");
                    //console.log("isCopied: " + isCopied);
                    //判断复制是否成功
                    // if(!isCopied) return;

                    //创建隐藏的输入区
                    const el = document.createElement('textarea');
                    //输入齆鼻儿
                    el.value = text;
                    //输入区添加到网页
                    document.body.appendChild(el);
                    el.select();
                    //复制就是纯文本
                    document.execCommand('copy');
                    //移除输入区
                    document.body.removeChild(el);

                    //清除选择，不然工具条不能隐藏
                    window.getSelection().empty();
                    //隐藏工具条
                    hideIcon();
                },
                custom: function (text) {}
            },
            {
                name: '百度翻译',
                id: 'baidu',
                image: 'data:image/png;base64,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',
                host: ['fanyi.baidu.com'],
                popup: function (text) {
                    openInNewTab('https://fanyi.baidu.com/#auto/zh/' + encodeURIComponent(text));
                },
                custom: function (text) {}
            },
            {
                name: '金山翻译[质量高]',
                id: 'iciba',
                image: 'data:image/png;base64,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',
                host: ['www.iciba.com'],
                popup: function (text) {
                    //金山翻译禁用了直接通过url跳转到翻译页面，必须在首页点击按钮跳转，而按钮是个div，而且没有id，刻意防止解析。
                    //openInNewTab('https://www.iciba.com/');
                    openInNewTab('https://www.iciba.com/word?w=' + encodeURIComponent(text));
                },
                custom: function (text) {
                    /*
                    //等网页加载完毕
                    window.onload = function(){
                        //获取输入框
                        let source = document.querySelector('input');
                        //先获得焦点，再输入文字
                        source.focus();
                        triggerEvent(source, 'focus');
                        source.value = text;
                        //通过keydown生成回车事件
                        triggerEvent(source, 'keydown');
                        triggerEvent(source, 'input');
                        triggerEvent(source, 'keyup');
                    };
                    */
                }
            },
            {
                name: '有道翻译',
                id: 'fanyi.youdao.com',
                image: 'data:image/png;base64,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',
                host: ['fanyi.youdao.com'],
                popup: function (text) {
                    openInNewTab('https://fanyi.youdao.com/');
                },
                custom: function (text) {
                    var source = document.querySelector('textarea');
                    source.value = text;
                    //triggerEvent(source, 'change');
                    triggerEvent(source, 'input');
                    triggerEvent(source, 'keyup');
                }
            },
            {
                name: '阿里翻译',
                id: 'alibaba',
                image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEoAAAA+CAMAAAC7vX2UAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAAzUExURUdwTFtd11pc1Vxe115g2Fpc1WNk3Vlc1Vlc1Vlc1Vpc1llc1Vpc1Vpc1Vpc1Vpc1llb1Cmp2XgAAAAQdFJOUwBCmy4buwzpy/ZY2nmKqmoSXCmfAAACJklEQVRYw62Y2YKDIAxFFWQRZPn/rx1tRcEkLHby1jqNJyG5CTNNNdtsBLaKeRo3FnEb9zUTnqIddiUoV8NYJFSMbNCVpl2t8r+gYjSvoKzILBWHGPFk0BRfqMsLqMf7E9b2K9Re/+fXut8VlZQlvYIPQ3Gqbt2vUNMUzifqZ6hJrmPNk6A88sxXng1B3aXV1zy2+mI10DyhfuBuoHnqUBPvb57QqkLd2zxStY4o9OpyE+qWB94JVYhulhZzS36jeTY0qeL8tGwq01L1Amr+ppizdWDyJKi1hDpSbPTQ5KGg9i8UcKSNfAGFzC8/v8oUMLW1St2hUBpG1myZS9ZcBWplPbLeAWW3LplaUCiTORK9A74BhUZmwjiUDTCyo41UP9RXB7Eimj3VPDSUcrCIZGC0rDF0ktioscicYvTkIaDQyMRH9sjJwzrHmwz27Cxq8lxQde2/FGuhJ0+CUjWoW4sZvbZdaxMNJbNbyrdeNnTy+BZUqcWMXtt4A8qU4peKGFvbqlDllMmF0cDJU4MCUybrLGRto6EMdjtx4Nw9gAqtyJ7tDpoHh5o9jIxxVyb50TwYlEQi+2gxLzXo0TwCQO2NDxwlLbaOXtsA1OwjEtm1M0l6bbuqT50GI8t/vqjC1qx5qjdITIuJGzW/jw83RIsN/pfuPk7MMC2+S/xxLBVX5KrCKFfEfzgqqwqe3f38pcUiMz1XhAfUoY5Cl9ZaVYJ+mj9q8g8GmGi6Kmn9mQAAAABJRU5ErkJggg==',
                host: ['translate.alibaba.com'],
                popup: function (text) {
                    openInNewTab('https://translate.alibaba.com');
                },
                custom: function (text) {
                    //需要等网页加载完毕再运行
                    window.onload=function(){
                        let source = document.querySelector('textarea');
                        source.value = text;
                        //触发按键事件
                        triggerEvent(source, 'input');
                        triggerEvent(source, 'keyup');
                    };

                }
            },
            {
                name: '知乎搜索',
                id: 'zhihuSearch',
                image: 'data:image/ico;base64,AAABAAEAICAAAAEAIACoEAAAFgAAACgAAAAgAAAAQAAAAAEAIAAAAAAAABAAABMLAAATCwAAAAAAAAAAAAAAAAAAAAAAAAAAAAD/ZQBg/2cAv/9lAP7/ZgD//2YA//9mAf//ZgD//2YA//9mAP//ZgD//2YA//9mAP//ZgD//2YA//9mAf7/ZgH//2YB//9lAP//ZgD//2YB/v9nAP7/agH//2sA//9sAe7/bwC//3EAXwAAAAAAAAAAAAAAAAAAAAD/YAAQ/2YAz/9lAP7/ZgD//2YA//9lAP7/ZgD//2YA//9mAP//ZgD//2YB/v9lAf7/ZgH//2UA//9mAf7/ZgH//2YA//9mAP//ZgH//2YA//9nAf//aAD//2kA//9rAP//bAD//24A//9wAP//cQD+/3QAv/9wABAAAAAAAAAAAP9lAb//ZQH+/2YA//9mAP//ZgH//2YA//9mAP//ZgD//2YA//9mAP//ZgD//2YA//9mAP//ZwH//2YA//9mAf7/ZgD//2YA//9mAP//ZwD//2gA/v9qAP//bAD//2wB/v9uAP//cAD//3IA//9zAP//dQD//3cAzwAAAAD/ZgBf/2YA//9mAP//ZgH+/2YA//9mAP//ZgH//2YA//9lAP7/ZgH//2YB/v9lAP7/ZgD//2UB/v9lAP7/ZgH+/2UB/v9mAP//ZgH//2cA//9pAP//agD//2wA//9uAP//bwD//3AA//9xAf7/dAD//3UA//92AP//eAH//3kAX/9nAL//ZQD//2YB//9mAP//ZgD//2YA//9mAP//ZgD//2UA/v9lAP7/ZgD//2YA//9mAf//ZgD//2YA//9mAP//ZgH//2cB//9nAP//aQD//2sA//9sAP//bgH//28B/v9wAP7/cgH//3MA//91AP7/dgD//3gA//95AP7/ewC//2YB7v9mAf//ZgD//2UA/v9mAf//ZgH//2YA//9mAP//ZgD//2UA/v9lAf7/ZgH//2YA//9lAP7/ZgD//2UA/v9mAf7/aAD//2kA//9rAP//bAH+/20A/v9vAP//cQH+/3MA//9zAf7/dQD+/3YA//95AP//egD//3sB/v99Af//ZgD//2YB/v9lAP//ZgD//2UA/v9mAP//ZgD//2YA//9mAP//ZQD+/2YA//9mAP//ZgH//2UA/v9mAf//ZgD//2gA//9qAf//awD//2wB/v9uAf7/cAH//3EA//9zAP//dAD//3YB//93AP//eAD+/3oA//97AP//fQH+/38A//9lAP7/ZgH//2YA//9mAP//ZgD//2YA//9mAP//ZgD//2YB/v9lAP7/ZgD//2YB/v9lAP7/ZgD//2YA/v9oAP//agD//2wA//9tAP//bgD//28B/v9xAf//cwD//3UA//91Af7/eAD//3kA//96AP7/fAH//30B/v+AAf//gAD//2YA//9mAP7/ZgD//2YA//9mAP//ZgD//2YA//9mAP//ZgD//2YA//9mAf7/ZQH+/2YA//9nAf//aQH+/2oB/v9sAP//bQD//28A//9wAf//cQD//3MA//90AP//dgH//3cA//95AP//ewD//3wA/v9+Af//gAD//4AA/v+CAP7/ZQD+/2YA//95If//n2D//28Q//9mAf//ZgH+/2YA//9mAP//ZgH+/2YB/v9mAP//ZwD//2gA/v9rAP//bAD//20B//9vAP//cAD//3IB//90Af//mED//6pg//+AEf//egD//3sA//99Af//fgD//4AB//+AAf7/ggD+/4QB//9mAP//ZgD//3AR///FoP//9e///3kg//9mAf//ZgH+/7yQ//9wEf7/ZgH+/72Q//+9kP//dBH//2wA/v9tAf7/bwD+/3EA//9yAP//dAD//7Fw/////////////96///97AP//fQD//34A/v+AAP//gQH+/4IB/v+EAP//hQD//2YA//9mAP//ZQD+/2YB///s3///7N///2UB/v+MQP///////3AQ/////////////+PP/////////////8mf//9xAP//cgD//3QA//92Af//dwD+/3kA//+0cP//79///30B/v9+AP7/gAD//4IA//+DAP//hQD//4YA//+IAP//ZgH+/2YA//9mAP//ZgD//3kg////////l1D+//Xv//+8kP//aAH+//////+scP//dhD//4ow///bv///yp///3MA//91AP//dQD+/3gA//95AP//egD+/61h///v3///fwD//4AA//+BAf7/gwD//4UA//+HAf//iAH//4kA//9mAf7/ZgD//2YA//9mAP//ZgH//9m////Zv///0K///3IR/v9qAP///////5JA//9uAf7/cAH//8qg///Kn///dAH+/3YA//94Af//eQH+/3sB//99Af//rmD//+/f//+AAf7/ggH+/4MA//+FAf//hwH//4gB/v+KAP//igH+/2YB//9mAf7/ZgH+/2YA//9mAf//soD//9m///9pAf7/agD//2wA////////lED+/3AA//9xAf7/y6D//8uf//92AP//iCH+/5tA/v+cQP7/nUD//55A//+/gP//9+///6JA//+jQP//pED+/6VA//+nQP//khH+/4sA/v+NAf7/ZgD//2YB//+DMP7/7N///+vf///17////////9q////av///rXD///////+VQP//cgD//3QA///LoP//zKD//4AQ/v/mz///79///+/f///v3///79////fv////////79////Df///w3///8d////Hf//+/cP//jgH//48A//9mAP//ZgH//2YB/v+NQP//oGD//7SA////////o2D//6Vg//+BIP///////5ZA//90Af7/dgD//8yg///Nof7/egD//3sA//99AP//jiD+/7hw//+BAP//sWD///Df//+GAP//rVD//65Q//+LAf//jAD//44B//+PAP//kQD+/2YB//9mAP//cRD//3IR//9pAP//kED///////9uAP7/cAD//3EA////////l0D//3YA//93AP//zKD//82f//97AP//fQD//34A///fv///4L///4MB/v+yYP//8N///4cB/v/EgP//8N///5sg/v+OAP//jwD//5EA//+TAf7/ZgD//2cA//97If//9u///5FA//+SQP///////3AA//9yAP//cwD///////+ZQP//dwD//3kA///OoP//zp///34A//9/AP//uHD///fv//+UIP//hQD//7Rg///w3///iQD//4sA///qz///6s///5AA/v+RAf//kwH+/5QA//9nAP//aQH//2oB/v/IoP//7d///8ig////////uID//7mA//+GIP///////8yf//+8gP//vID//+bP///PoP//gAD//4EB//+SIf//lCD+/4UA//+HAP7/tGD///Df//+LAP//jQD//5YQ//+sQP//kgD//5MA//+UAP//lwD+/2kA//9qAP//bAD//5JA////////27///9y////cv///3b///4gg///dv///3r///96////ev///37///8CA//+BAP//uXD///////////////////fv///37////////+nP///jv///3K///9ag///DcP//lQD//5cB/v+YAP//agD+/20B//9uAf//cAH//+3f//+nYP//cwH+/3YA//93AP//eAH+/3oA//97AP//fQD//34A//+AAf//gQD//4MB/v+MEf//liD//58w//+nQP//r1D//7hg///AcP//x4D//9af///dr///8t///+W///+XAf7/mAD//5oA//9sAf7/bgH+/3AA//9xAP//exD//5dA//91AP//dwH+/3gB/v97Af//fAD//34A//9/AP//gQD//4IA//+DAP7/hQD//4YA/v+HAf7/iQD//4sA//+NAf//jQD//48A//+RAP7/kgD//5UB/v+VAP//lwD+/5gA//+aAP//mwD//24A//9wAP//cQD//3MA/v91AP//dgD//3cA/v95AP//ewH//3wA//99Af7/gAD//4AA//+CAf//hAD//4UA//+HAP//iAD//4kA//+LAP//jQD//44A/v+QAP//kgH+/5IA//+UAP//lgD+/5gA/v+ZAf//mgD//5wA//+eAf//cQD//3EB/v9zAP//dQD//3YA//94AP//eQH+/3sA//98AP//fgD//4AB/v+BAP//ggD//4MA/v+FAP//hgD//4kB//+JAP7/jAD//40A//+OAP//kAD//5EA//+TAP//lAD//5YA//+YAP//mQD//5sA/v+cAf//ngD+/58A//9yAP//dAH//3UA//92AP//eAH+/3kA/v97Af//fQD//34A//+AAf7/gQD//4IA//+FAf//hgH//4cA/v+JAP//igD+/4wA//+NAP//jwD//5AA//+SAf7/kwD//5YB/v+WAP//mAD//5oA/v+bAP//nQH//54A/v+fAP//oQD//3QA//91Af//dwD//3gA//96Af//ewD//30A//9/AP//gAD//4IA//+CAP7/hAD//4UA//+HAP//iAD+/4sA//+MAf//jQD//48A//+RAf//kgH//5QA//+VAP//lwH+/5gB/v+aAP//mwH//50B//+eAP//oAD+/6EA//+jAO//dwG//3cA//95AP//egH+/3sA//99AP//fwD//4AA//+CAf//hAD//4UA//+GAP7/hwH+/4kA//+LAf7/jAD//44B/v+PAP//kQH+/5MA//+VAf7/lQD//5cA//+YAP//mgD//5wB//+dAP//nwH//6AA//+iAf//owH//6QAv/94AGD/eQH//3oA//98Af//fgH//4AA//+AAP//ggH//4MA//+FAP7/hgH//4gA//+KAP//iwH//40A//+OAP//kAD//5EA//+TAP//lQD//5YB/v+XAP//mQD//5sA/v+cAf7/nQH//58A//+gAP//ogH//6MA//+lAP//pgBfAAAAAP96Ac//fAD//34B/v+AAf//gQD//4IB//+DAf7/hgH//4YA/v+IAf7/igH+/4sB/v+NAP//jgD+/5AA/v+RAP//kwD+/5UA//+XAP7/lwD//5kA//+aAP//nAD//54B/v+fAP//oQD//6IB//+kAf7/pQD//6cAvwAAAAAAAAAA/4AAEP99AL//gAH+/4EA//+DAP//hAH+/4UA//+HAf//iQH//4oA//+LAP//jQH+/44A//+QAP//kgH+/5QA/v+UAP//lgD//5gA//+ZAP//mwD//5wA//+dAP//nwH//6EB//+iAf//owD//6UA//+nAM//nwAQAAAAAAAAAAAAAAAAAAAAAP+BAF//gwC//4QA7/+FAP7/hwD//4kB/v+KAP//jAD//40A//+QAf7/kAD//5IB//+UAf//lQD//5cA//+YAP//mgH+/5sA//+dAf7/ngD//58A//+hAP//owH//6QA//+lAL//pgBfAAAAAAAAAAAAAAAA4AAAB4AAAAGAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAAAABgAAAAeAAAAc=',
                host: ['www.zhihu.com'],
                popup: function (text) {
                    openInNewTab('https://www.zhihu.com/search?q=' + encodeURIComponent(text));
                },
                custom: function (text) {}
            },
            {
                name: 'More...',
                id: 'more',
                image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAMAAAD04JH5AAAAmVBMVEVHcExzg79zg79zg79zg79zg79VYIBVYIBVYIBzg79zg79zg79zg79zg79zg79zg79zg79zg79zg79zg79zg79zg79zg79zg79zg79zg79zg79zg79zg79VYIBzg79zg79zg79zg79VYIBzg79VYIBVYIBVYIBVYIBVYIBVYIBVYIBVYIBVYIBVYIBVYIBVYIBVYIBVYIBzg7/cE5GJAAAAMXRSTlMAumcFB/OHZqDRqk3y03Y4ZihWf+Yix0vwEjZfQNvqVBuh2oxJkRD9i1dcRxdaERZecuMnSQAAAd5JREFUeNrtmdeWgjAURaNiwd57RcfeyP9/3CzGFlRaQrgPc86LD8dk77VADAljCIIgCIIgCIIgCIIgvtlPrJXK+MPE2qmMz9u2ba/lx5+d8XlFvn2Un+BiKxnc+Ft5PmM/KgY3fkGFz1hB3iAWvoJBTHxpg9j4kgYx8qUMYuVLGMTMj2wQOz+igQZ+JAMt/AgGmvihDbTxQxpo5Icy0MoPYaCZH2ignR9gkADf1yARvo9BQnxPg8T4HgYJ8r8aBPA7s3pp8LUZjkbDr8WgVJ91Qhv48+dFzjnPLj+bZsVpKs3PZpl1muI8nIE/v9Hnt5jGW9O6F7z1Vhjmveg3whj48zPTB4an3E3vWfCeu0k9i2km2CDg+ldfGD52Ne1X0XYVY2FIlQUZnALuf1OYbSEWNaHgNbFZCIXJ/A2ubON85Dy/ZpSF2bpikxYF0mLTFYqy4Tl17s+A2bQCG3alvQQn+puQ/mdI/yCifxTT/xnR/x3TL0jol2T0i1L6ZTn9iwn9qxn9yyn96zn9BgX9Fg39JhX9Nh39RiX9Vi39ZjX9dj39gQX9kQ39oRX9sd3D4EeFv43j6PQizz+q8e8GZ/nxa0U+YztrclAZv7Ime5XxCIIgCIIgCIIgCIL8h/wC2K/Jb1aNIXIAAAAASUVORK5CYII=',
                host: ['more.example.com'],
                popup: function (text) {
                    icon.querySelectorAll('img[is-more]').forEach(function (ele) {
                        if (ele.style.display == 'inline-block') {
                            ele.style.display = 'none';
                        } else {
                            ele.style.display = 'inline-block';
                        }
                    });
                },
                custom: function (text) {}
            },
            {
                name: 'Wikipedia Ja',
                id: 'wikipediaSearchJa',
                image: 'data:image/png;base64,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',
                host: ['ja.wikipedia.org'],
                popup: function (text) {
                    openInNewTab('https://ja.wikipedia.org/wiki/' + encodeURIComponent(text));
                },
                custom: function (text) {}
            },
            {
                name: 'Wikipedia Zh',
                id: 'wikipediaSearchZh',
                image: 'data:image/png;base64,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',
                host: ['zh.wikipedia.org'],
                popup: function (text) {
                    openInNewTab('https://zh.wikipedia.org/wiki/' + encodeURIComponent(text));
                },
                custom: function (text) {}
            },
            {
                name: 'Wikipedia En',
                id: 'wikipediaSearchEn',
                image: 'data:image/png;base64,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',
                host: ['en.wikipedia.org'],
                popup: function (text) {
                    openInNewTab('https://en.wikipedia.org/wiki/' + encodeURIComponent(text));
                },
                custom: function (text) {}
            },
            {
                name: '百度百科',
                id: 'baiduBaike',
                image: 'data:image/png;base64,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',
                host: ['baike.baidu.com'],
                popup: function (text) {
                    openInNewTab('https://baike.baidu.com/item/' + encodeURIComponent(text));
                },
                custom: function (text) {}
            },
            {
                name: '搜狗翻译',
                id: 'sougou',
                image: 'data:image/png;base64,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',
                host: ['fanyi.sogou.com'],
                popup: function (text) {
                    openInNewTab('https://fanyi.sogou.com/?keyword=' + encodeURIComponent(text));
                },
                custom: function (text) {}
            },
            {
                name: '腾讯翻译',
                id: 'fanyi.qq.com',
                image: 'data:image/ico;base64,AAABAAEAICAAAAEAIACoEAAAFgAAACgAAAAgAAAAQAAAAAEAIAAAAAAAABAAABMLAAATCwAAAAAAAAAAAAD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP4RpgD+C6QA/g2lAP4LpQD+C6UA/gekAP4AoQD+AKEA/gChAP4AoQD/AKIA+gGfAOsFliTWCoxqvxB/naYWcbiLHGO4cyNVnVspSWpHLj0kNzI1ADIzMgAzMzMAMzMzADMzMwAzMzMANDQ0ADQ0NAA1NTUANjY2ADY2NgA2NjYA/hGmAP4LpAD+DaUA/gulAP4LpQD+B6QA/gChAP4AoQD+AKEA/gChAP8AohX6AZ+Z6wWW9NYKjP+/EH//phZx/4scY/9zI1X/WylJ/0cuPfU3MjWaMjMyFjMzMwAzMzMAMzMzADMzMwA0NDQANDQ0ADU1NQA2NjYANjY2ADY2NgD+EaYA/gukAP4NpQD+C6UA/gulAP4HpAD+AKEA/gChAP4AoQD+AKEw/wCi0voBn//rBZb/1gqM278Qf5ymFnF6ixxjenMj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OIk5OTm4Ojo6yjo6OsY6OjqpOjo6cjo6OiQ5OTkAOjo6ADk5OQA5OTkAOTk5AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A///////////////////////wD///wAP//4AB//8DwP//D/D//h/4f/ADwA/gAQAHwAAAA4AAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAAAABgAAAAcAAAAPgAYAH+AfgH/////////////////////8=',
                host: ['fanyi.qq.com'],
                popup: function (text) {
                    openInNewTab('https://fanyi.qq.com');
                },
                custom: function (text) {
                    var source = document.querySelector('textarea');
                    source.value = text;
                    //triggerEvent(source, 'change');
                    triggerEvent(source, 'input');
                    triggerEvent(source, 'keyup');
                }
            },
            {
                name: '彩云小译',
                id: 'caiyunapp',
                image: 'data:image/ico;base64,iVBORw0KGgoAAAANSUhEUgAAAL4AAAC+CAYAAACLdLWdAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA2tpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDplZTA5YzRkZi00MmIxLTQ2YzgtOTc4YS03YjZiMGI3ZjdhNWMiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6NjdCMUIyRTQyMjNCMTFFNkFDMUY4MzhERDNBREE5NkYiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NjVGNDYzRjgyMjNBMTFFNkFDMUY4MzhERDNBREE5NkYiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChNYWNpbnRvc2gpIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6NjExRTdBRkNCRDIzMTFFNEIyNkE4QjdBMkI1RkQwNTciIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6NjExRTdBRkRCRDIzMTFFNEIyNkE4QjdBMkI1RkQwNTciLz4gPC9yZGY6RGVz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',
                host: ['fanyi.caiyunapp.com'],
                popup: function (text) {
                    openInNewTab('https://fanyi.caiyunapp.com/#/');
                },
                custom: function (text) {
                    var source = document.querySelector('textarea');
                    source.value = text;
                    //triggerEvent(source, 'change');
                    triggerEvent(source, 'input');
                    triggerEvent(source, 'keyup');
                }
            },
            {
                name: 'DeepL翻译',
                id: 'deepl',
                image: 'data:image/png;base64,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',
                host: ['www.deepl.com'],
                popup: function (text) {
                    openInNewTab('https://www.deepl.com/translator');
                },
                custom: function (text) {
                    var source = document.querySelector('textarea');
                    source.value = text;
                    triggerEvent(source, 'change');
                }
            },
            {
                name: '沪江日语词典',
                id: 'hjenglish',
                image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAMAAAD04JH5AAAAwFBMVEUzqfEhqvUTpvQRpfMSo/ITovEVofEToPAUnvAQnvUVoOwOnO8NoOwHm/EWnOoMoPIKlew9sfEkoO0bo+/g8vrv9/vz/Pz5/f3J5/d0wfFPrOwUnO6g1PP6/vn+/vn+/v3///8QmOkbmuz9/vP5+vz9+/0Vmu0Tme/0/Pb++fn6+vk+pOsmlOcamOQWkugJj+wVmOsVl+sVluoXleoXlOkXjeUXkecMieYah+QXjugWjOYdjeEYj+YYieUYi+QYi+ZrlpNiAAAHc0lEQVR4AezQAxbFQAxA0aRRbex/p9+20dya884A4GcBBp8FHuABSETBG9HM1tV3BHySBwDyFprhgzszfHB7fXL4+eHJ4ctzXxfwAYAe4AHyWR7gAR7w9QEqJry+4tNExFSFRVXtpgA7K4w4jmxGZlcnWWIaqnEcWxTGdr1LAWmWJXkxk5RZckYx26Uyb2B5XgBWgLBQnQdQN0U27Q01et4MJFXbLfXDWX0/IbU+FFXVlTAAuzuI4UaNhpAyIWhi4xLwvP+zHdZpy2Tb+VcvTj4mQ1kRUhSsnCDEkxcAy/92ccjv32AhFegnAv98UauCLXH2/X+zH2l6vfJnAsD1zJZkALwSoJSIL5VJc5Old8b2ScAvxOBFANBaEpagdGqybDQgNUnx2vqSbrZKQjHB3+xyfAf4T1QqDc93YfjPLaWyVqsSpR9b/nMcIJm6XKihJOgXAzs27MLPNMnv1p8sHmzB7Beab+Revg6o60Hwa8qTUYDE5CkWWr4BOEjJ8HD82QMAv5vEzEz2hdRUvQxYbfbrEqc85/fyCDDls3yKmHq9AxroFsgRpXwUYEiSZKdCg34rYmqysYBBgNj+vfUVMDwe8Mui+eE9AFCyGA/gU8wUxKXjn2H4+O33cNAC8yQZCeBYQLTcVkoJl1FKAqXxJVPuNVlmPOX5SEARrS9r2EPUEVC1ojTuwE6ViOdZYkcBGhLV3ZNyHqYsSybWsD9EUlkLnJiRgGqyimZAFf9HFf7M8H2WYTwRm30IqLc1WaDc3pkB+zi4hDoCCJzx4H/y4cPhlq0OFChcziadI17drP0UADFdhwemWGu5jeOatGXrehtOIjA8FoCFjm8FpePXABZhUce3btHmfBzAFQAyqLmeVO7K/7mmweUaNhEAm3GAakGUDAHEXAN4x23WFGoTtqBwzfsAP7xnx4NaByVpUWXmRrdaEZ0xQLz3YwAWM6povK3cXx8s3op4BogbA/DWt0IrqYOw9lZN1zIdA0xn/buAj1dioWjYASiR6d2TACCmvwfwd+Oc600BFx3YSlCrRWWHotfSDYADhICuO/tbmSy6u+n7Dk9WoOATUFNVmL67Ed8KKkNAUbmz627kEaDphjNbA9BLgBbY9k1/CxBftQrcmfcBWRNtKqi1Ynjo9fX0VQHxKYO79ztwRk0rtAaIAL2trhJ8bwhIiE6Zzt8BBBP0EX+ZsztHTyMgoZ5gfy3W9x4fd3obA6wPq356Hw+h+8OQEKA0OeHr/2y7DjOQdQCgc2x89ycr5rnlKg4D4PzemuVAjDlYcoZhGkQ+McZeyu77P9aF3EpPmS+9SZ+ECGW5A3qdM2XBWCDUl3Qz9P9a8KsAovQ9XeijXmBL4NXso2FD2TvGSi+xzwJM018E+pVAF8XdAoVWXA5gAHxJ4DyZWCbgonu+V8C8diEHIGC0IGB+J284MCJlGKk++90dOFKIcgAcsv18/b0tDHdc3tH39voBgTPl411y8J/0PMdyFwwFWILx3piiuF/gmD0PYwKEyky/p83r2VAMqfyVVCBXxbpAsY6KAOUAjJUpJtinvXYcRTpul1cWa+w8U6xxVlyyYcy+pgkmp5O7nEwaCcSKNgT6X/fMBO3QFI8FRDQjoPcn5fkI76MvdwNrtjqwKkBnX46KCjzSc8sqD0GwQzreeSS9LpCbNYi8AEcC4dn+Ytw9amOOxu1CENjx84tdNw6RMoVZY5fTIqZDRQxxVBR9FaALBZE5UqmiYHREhPiBGP/7agtaY0OAHJcTAVfRTwFLhip1it/eD+loDcA0yPa11Y8IGBULgPEu+dePrLlAtXvifpIweGaD/Aw7V+pFH+mACuFjOANBppyqOqhyzinX/NOlB5ZC+jEwRSH9XFnSDwj0i9hnbCjgR7vsO/1ZET9BOQemz1FlqeNuATJGZcF4BpI3BnghRdnDZgQQJWKsiB4TIOMiwJEAYyAY9oAQAjrmBWSYl6cHBSw5DgzE6AQVIOA3GBM40wH8OiuVNVcI2CXIUqliRJxGx5+VopwBARl3fQmbrAjYlqwK5T0gA+5sx0MC1FrK/fsEgCt6XMBWLmPyLrhq7MMClloVSZS3gJepYNwZW90q0Hb8XPw9ZB2/LX2PSILI/YjRY5dp2w2BWN4CfLAUIMycvUWgXcRWTShvgTGAj/i1bqi9mjWBtvaCG4cfwsjVVdXeIlAt47IEt6dOCoESexKfN677XVldz7oAF+yKyQNAZJhAyHOnqhEPCiBup0eGEiGIo9Ypqj5VQIV4xZov4d2Pef6fqpumaT9RoPy/8WHNANkh8MMw5lnuXN2WdWmpvl2gXKKumiyLvrRDB5oTwzAcx/8PNP4gtvzatO//VpcUvZtYx53qkM+YtFP92uBR25Z2xZm+NQjIGbLf+QdKITUhgMFUccLqvbC7UyJwBmYEUCoVNMKc7cW//YF6CQyiNqjqwDDbQAT/6bS6ugLDAFVvAvowLSACRPXB39J2+2Bs8AHijotqAWWtBwREgKwVAREQAX/b8UHM4Xb64Le98XHnYQELREAErA9Ix1ovunSItirNRyIAAAAASUVORK5CYII=',
                host: ['dict.hjenglish.com'],
                popup: function (text) {
                    openInNewTab('https://dict.hjenglish.com/jp/jc/' + encodeURIComponent(text));
                },
                custom: function (text) {
                    document.querySelectorAll('.word-details-button-expand').forEach(function (ele) {
                        ele.click();
                    });
                }
            },
            {
                name: 'twitter搜索',
                id: 'twitter',
                image: 'data:image/png;base64,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',
                host: ['twitter.com'],
                popup: function (text) {
                    openInNewTab('https://twitter.com/search?q=' + encodeURIComponent(text));
                },
                custom: function (text) {}
            },
            {
                name: 'youtube搜索',
                id: 'youtube',
                image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAACXBIWXMAAC4jAAAuIwF4pT92AAAKW0lEQVR42u1bfVBU1xV/wLSdSdNO/+pMPlozmRAWWfYDmKARGafKbicqYJJRJNFUMEQHxFA/cNf9ACKiTTSmYiemWB1D/Opk2sbA2HRi8Y9qrE0TaxQpu/tWBDRO25hpE2DZfbfn3Hff8vb5FnbZZTEIM2fu4+39OOf3zrn3vPt+l6urq+PuZeGmAZgGYBqAaQBUxenknKyUi1N2H0snq6+8jreiToWEjCnpotA1xIaIAFBrMNJZUr3TmUzF4UgZU5xOSZJjlJSIxhPHpG1Q16Deo9mm6gGsIXSIHSUjqg64b29o4GyvvMJtBbFu28ZZsZSuQfD+VqhjZXXwOqQcj6i1ZfekceV6SHVsUMcx4hHJzBZVTwhFCCs4HElQJtFOoaN6m43buWnTD3a//PKP91ZWpjdXVua8VVGR95uysp8eLS19+sTy5SuPlZau+d0zz6xvKyzc3FZU5GgrLm78k9m8s6Og4PUOk2nvGZPpzQ6zuQXKgyBvnzGb34HyKMgxuD7Grt+B68MgB6FNC22DbaGPD556auf70Gc79g1j4Fg4Joy94ujy5U+jLqgT6gaSjrqizqi7lT0UtInZFgKEGEvMeEAqCRF2OhzcoVWr5p82mfZ9mpt7rjMry9OdmXmTz8j40jtzpu96WhrpSU8nfVCi9Go04rWspPdkJRVsE4ko2vYq+paPib9dhzbX4X9vRoYP5EsX6Ao6uz+ZNevcabO5+eCqVT9xgH1oWwgIICFP3gJu9Hp19Yy/Pfnk72nH0Om1jAzi1WoJn5lJeJ2OeHS6gFun87v1+mG3wSCKXu9TCL3nGZFhWkLdiETeRtFniIyMj+JH3VBH1BV1Rt3RBnxg5/Py3gXP+BGGigQCzglB4zF29lZVabt1Oh6frosNAp0Og2Dnfl4cQOD1egFLryR6PYGS0FIUQXY9IlgnElFrK+9TqsPG50UdaIk6Svqi7mgD2oI2/VOnc4ON6WirBAK9sNfXc021td/vNBiuXJs5k7h0ukFAMcA6DIqkgHSt/D2ceGVlJCJvE1H/Mp1U9QJbAITBHrCtU6+/1Fhbez/aTEOgwW7/1hZwi7ZFiyz9jz+OT37Ik5kZ1nC1ASdblA9EFQiwCW3rAxvfKy7eiDbX2+0pnA2QAES+e8Vo7IK4QfcZVkP3bjI4EkDUvBRtg0lSuJyVdXmbxfIdXBm4TU1NHMySC3rS0gQ3Gi9z/bvtScfqGTybwGFSDLSUl8/FuYDbuGMH98eFCxth1kcX8YWL+ygHphMVr5Dgb5PgDZKgjbjCnVq82FkLYcA57Hbur3PmfAATBPUAr+gqgXEPqCi9CTY4nFCbQBdcMmFFEM7PndtGAdizbt2Dn2VnX4HYwEp+WpmFQQyoBz3AazRSMKgXKMpEeQSNf7CJAeHHeeBKVtZVmAQ57kB5eX6XwdDDY7Kj1wdinfCocSxpQnE9+ijxQDLCIxDhwoGBkpBQQBvBVjdkizs2b76fa12xYikkP/9GpT3yJCcWADBjBI/is7PJv3btItfy80n3ww+LwBgMIQApPYCfSADANgwFXOYhpR94bcOGh3D93wC583894lMQIPUMxDyYGEYE+iK+mzfJ8K1b5HOLhbhgDXY/9pjoDQpPUYZFvENDuRL0aDTCnvXrU7k/FxT8CtwBMz/6Yzw8wMvycXzaA1evEoEQKl+dPUt6ly0j3Y88QjyQlQXDAuuqGB5vINhEKOBEiKve/oqKWdzfc3NPurVan5Qt8fHyAAwDMHDI7SZCIEACQ0MUhIDfT263thLvnDkiEGgk1POEWTbjNVFKTx/7Ag/AN1qh9bnnCrlL2dkXwV39dOYXAYhL4iN5wKDLRfBPAMMDw8MUAPzz3bhBPrfbiRsmyLBhoZgw+dh1ot4NHj+Mb4jvPvtsOQdPvy/4lsfequIUc9Qo6gHsyQuCQALoDT4fCRDx76tz52hYuJRhEc4bYs0M0TMBAFz24bW/gYN/bodkSxMAAPUAMBwBkIQCAR5BwYH/vzhyRAyLGTNETwDv8ah5Qwz5A7MRSz/tW6P5LQIwGGvqGykAtJSBQOcGDA1BCIbFLQgLF4SFSy0sZMvseECQ9YVLIXFptRc4nmV/Y25mxMkDAgpPUA2Ljz4aNSxi9gBc6QAACH+ei8fLT7QecIcnSECwiVIKC7pa5OVRIKSwGC2JinApxDDC134EoJ+bqNfdsUJA+lP1Bvlq0d9PbtlsNCQwrZaSrHGHgOQBmKZPFgCRACFIYYHX8PvAxYukr7SULpt8DEkSa/PNA+BrAKB3qgBwF4XAjelJkL9z92fSlkFhMpZBcKeBezIREkPgAgLwxUSEQbSp8G1IhfkEp8IejeYE58rMnPyXoaVLJ+Vl6OOcnHruHzk5I6/D8fSAb8brcBluiLxHN0RGPoclfkME3T3RGyIajdD6/POF3OkFC+iWmIftBsVjVzjqLbFRDJ/ILbG3KipyufaFC+mmqLQ8eOLlAWNtiuKarpjcErkpiiGwp7o6NWHb4q4xtsX5xG+Lf/0qbou3rF49d9I/jCTgE5rcA1A/8PobTfhh5I3q6gcuZ2dfDn4aE5eJqf9pzGjsRBKV9HH0FH4wpB9H0U1Y5Sn+cfT9LY2N4ufxU+LncXIvfR5vX7zYQb8OM4LEfFwXcXac0gQJsA3ZZEiQOFBWlof8QYkicx/GhFerFaY8RQZshDnvUqPF8m2n05kcJEm1L1pU28dIUvwYJKm7yTvUDB2NJIVEsD8sWVITJEkhTQ69YHtt7fc6DYZLjCM46BmFJjceqlykdLlYKXKj0uTAts+Mxk+2bdlyn53Rg4NESatIlNR06fVdyK7EWAEZkpMlWS6tRpZUIzmG947oSZLh2gtyXVSIkkj2HMKJ77pIlOz6ZVVVKiNKUtuDPGEJhNdqah44O2/eQW96+v+Qj4sNkXJKEyVxNheCVFmJLivSVseiy0ZGmVXQZD130nDFsUSRaLLDHtFwwaNCle1JS/Ofz88/vrum5kGrjCU6whaXkaWRam6De/vWrtWeXLJk01/mzTvx6RNPXLhqNPbwGRn/gSRiAMkFlIOrIC7Lycz9ctI0gNgbKWFaSZRmZb/Uv0TQlhG1qZGwtqNuqCOk9v0w0XV/PHv2mQ9Npt2/Xr06D11enSytQpdHjn2Q+w/zQ4PVmgR58w/3rluX2lxZadz/0kuzW158cf7hF14oPFFSsux4aenPQNYyyvzGtqKire1FRQ0g2z80m3/RUVCwp8NkamYU+JYzZvMhRps/AnKUlW/DvUNQHoByP9TbB+3eOG02vwr9bW8rLq6H0nKyqOjnx0tKKmG8chi75PDKlYVg4Pw316yZ3VxVZYQwTt1VU/NQE8xpdZDkyejyyWHp8qoHJtjJEHpoAu47AAjbKIcVlAclrMoDE9EenFC0s8raWxWHNiyy8fFQB/KA2YEJfJgpwQMTUR2ZufPMEB6ZSWLAJEdxjCWWozMpURyZkdokKY/MOKM6MjPGwangoSnpoMUYh5ridWCqLlz/oxyYiv7Q1PSxuWkApgGYBuAek/8Dy6ChlrWylbQAAAAASUVORK5CYII=',
                host: ['www.youtube.com'],
                popup: function (text) {
                    openInNewTab('https://www.youtube.com/results?search_query=' + encodeURIComponent(text));
                },
                custom: function (text) {}
            },
            {
                name: 'b站搜索',
                id: 'bilibili',
                image: 'data:image/ico;base64,AAABAAEAICAAAAEAIACoEAAAFgAAACgAAAAgAAAAQAAAAAEAIAAAAAAAABAAABMLAAATCwAAAAAAAAAAAAD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A1qEAANahAADWoQAG1qEAb9ahAMvWoQD01qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD01qEAy9ahAG/WoQAG1qEAANahAADWoQAA1qEAG9ahAM/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahANDWoQAb1qEAANahAAfWoQDQ1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahANHWoQAH1qEAbtahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAG7WoQDH1qEA/9ahAP/WoQD/1qEAtdahABjWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahABvWoQC11qEA/9ahAP/WoQD/1qEAx9ahAPnWoQD/1qEA/9ahAP/WoQAZ1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahABjWoQD/1qEA/9ahAP/WoQDz1qEA/9ahAP/WoQD/1qEA/9ahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEAANahAADWoQAA1qEAANahAErWoQDn1qEA5NahAErWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAErWoQDn1qEA5NahAErWoQAA1qEAANahAADWoQAA1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQAA1qEAANahAADWoQAA1qEA5tahAP/WoQD/1qEA59ahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEA5tahAP/WoQD/1qEA59ahAADWoQAA1qEAANahAADWoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAADWoQAA1qEAANahAADWoQD/1qEA/9ahAP/WoQD/1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQD/1qEA/9ahAP/WoQD/1qEAANahAADWoQAA1qEAANahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEAANahAADWoQAA1qEAANahAP/WoQD/1qEA/9ahAP/WoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAP/WoQD/1qEA/9ahAP/WoQAA1qEAANahAADWoQAA1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQAA1qEAANahAADWoQAA1qEA5tahAP/WoQD/1qEA5tahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEA5tahAP/WoQD/1qEA5tahAADWoQAA1qEAANahAADWoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAADWoQAA1qEAANahAADWoQBJ1qEA5tahAObWoQBJ1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQBJ1qEA5tahAObWoQBJ1qEAANahAADWoQAA1qEAANahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQD/1qEA/9ahAP/WoQD/1qEA+dahAP/WoQD/1qEA/9ahABnWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAGdahAP/WoQD/1qEA/9ahAPjWoQDH1qEA/9ahAP/WoQD/1qEAttahABnWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahABnWoQC21qEA/9ahAP/WoQD/1qEAx9ahAG3WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQBt1qEABtahAM/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA0NahAAfWoQAA1qEAG9ahAM/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAM/WoQAb1qEAANahAADWoQAA1qEABtahAG7WoQDH1qEA89ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA89ahAMfWoQBu1qEABtahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEADtahAMXWoQD/1qEA/9ahAP/WoQD/1qEAxdahAA/WoQAA1qEAANahAADWoQAA1qEADtahAMXWoQD/1qEA/9ahAP/WoQD/1qEAxdahAA/WoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAAbWoQDF1qEA/9ahAP/WoQD/1qEA/9ahAMXWoQAP1qEAANahAADWoQAA1qEAANahAADWoQAA1qEADtahAMXWoQD/1qEA/9ahAP/WoQD/1qEAxdahAAbWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAYtahAP/WoQD/1qEA/9ahAP/WoQDF1qEADtahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEADtahAMXWoQD/1qEA/9ahAP/WoQD/1qEAY9ahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQBf1qEA/9ahAP/WoQD/1qEAxdahAA7WoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEADtahAMXWoQD/1qEA/9ahAP/WoQBf1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAATWoQCg1qEA6tahAKjWoQAO1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEADtahAKjWoQDr1qEAoNahAATWoQAA1qEAANahAADWoQAA1qEAAP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A///////////AAAADgAAAAQAAAAAAAAAAA///wAf//+AP///wD///8A////AP///wDw/w8A8P8PAPD/DwDw/w8A8P8PAPD/DwD///8A////AH///gA///wAAAAAAAAAAAgAAAAcAAAAP8A8A/+AfgH/gP8B/4H/gf+D/8H/////8=',
                host: ['www.bilibili.com'],
                popup: function (text) {
                    openInNewTab('https://search.bilibili.com/all?keyword=' + encodeURIComponent(text));
                },
                custom: function (text) {}
            },
            {
                name: '微博搜索',
                id: 'weibo',
                image: 'data:image/png;base64,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',
                host: ['weibo.com'],
                popup: function (text) {
                    openInNewTab('https://s.weibo.com/weibo/' + encodeURIComponent(text));
                },
                custom: function (text) {}
            },
            {
                name: 'Google搜索',
                id: 'googleSearch',
                image: 'data:image/png;base64,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',
                host: ['www.google.com'],
                popup: function (text) {
                    openInNewTab('https://www.google.com/search?q=' + encodeURIComponent(text));
                },
                custom: function (text) {}
            },
            {
                name: 'Bing搜索',
                id: 'bingSearch',
                image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAAFUUlEQVR4AWL4//8/WZhhWkcBoL17gLElieIwnrVt27Y3Wtu2bdu2Hay98bNt27Z5X+6c/YJe1KJnXt2ZudXnn+T3/KZrbn3prh50YSLG4TMcavx5WmR5J/8sWAh9cDPWLfYLpwA+gf2PBfi8uGcFBfAdrJb64BadFfwGkFmIz3GYXnifAeisoAB0VlAA+WeF9XxOhgLILMQXPs8KCiDUF7f6PSsogPCscLDPiVIAmTLu8zpZCgAoY1OvE6YAgHN9T5wCuEiTBwUgCkAUgCgAUQCiAEQBiAIQBSAKQBSAKABRAKIARAGIAhAFUGgKgD/fFi3QGy1xrZMvKVcA/Nk6GAILLMb3OA0rF3cyFcDusBzT8HYxv79AAewAq4PBeATbKoDirAH6wuqoBm1wTfrfrq4AboFFWIzvcGqa6wUFsC4WwipgKt7GQQogjQCysX0Oq7BBeDiN9YICOBRWT2rQunrXCwogG18fWD1bhG9xSvWtFxTAzbAGNBVvVc96QQGsiwWwRjAID2EbBdA4AWRj/AzWiGrQCldjHQXQ8AEcAouX4npBAWTj7AWrMlPwJg5UAPUfwE2wKjawftcLCmAdLIBVuTJa4qr49YICCMf6KSwhi/ANTsZKCiA+gINhicrWCwcogJwAcsbbE5a4AXgQWyuAugdwIyxxEesFBbAO5sMKZiG+xnYKIH/MH8MKaiZ2UwD/P+aDYAX2lALIH3cPWEF9pwDyx3297wAUwNqY5zMABZCN/SPfASiAA/0GoACy8Xf3HYACOAFLYQlTAJERnFGgBaECiLgruA5dYYlTAJEx7If3MDv9ABRATAhr4Aq0Tz8ABRAbwx54AzPSD0ABxISwGi5CS9SkH4ACiIlhZ7yEKekHoABiQlgFN2KZswAUAMdfHQ9irqMzgALguCvgUox1tgZQABzzWHR3dhegADjWrvjN2W2gAuAYG+NdLIMlQAFU8J7/AcyBJUABVHCBdwnGwBKkACIm/xh0g6VGAcQv8H719/UA+oqgjfAOSrAEKYCIBd79mANLlwI4ezkWeBdjNKygvvISwDysXYexHo2usIK7z0sAL9VyjLvgF5gDnbGOhwA+xwq1WOC9jRKs4BbjCazm4fkAn2GFnAXefZgNc6ApdvbyhJBw8sMF3kUYDXNgEi709IygT/9n8o9GF5gDZbyLdf08JCqY/ODr8n6GOdEdB3l7TNwnWCE47oZ4CyWYA3NwG1Z09ZzAbPKDBd69mA1z4lts7vFJoR8Hk38hRsGcGI7j/T0rOJh8fj4KnWFOLMFTWM3rw6I/wgrYCT/BHGmOXTw/Lv4jbIQ3UYI5MRkXe98w4gvch1kwJ8p4D+t53zFkMkbDHOmJQ/ztGSRzcTtW8rdplHyPLfxtGycjcIK/jSNlCZ7B6v52DpUW2NXf3sEyBZf62zxayvgA6/vbPl564dDsdVEAfszDndk9vQLw5Qdsmb0WCsCPkTgpew28B/ABzImlePbv9/QK4GSYA62C/fgUALIIHsAyWAFNxWXh+6wAEESwF1oX7J7+o/x7egUQhnAxJsIS1huH5byvCiBng+bXErwszMPd2T29AogPYU+0giXgJ2yVjV0BVDaEi6r4sjAKp/zP+BVABTdlehWlKrqnfx5r5I9fARTtstAae2jS4wOIvSxMgDWgabgifvwKILXLQg0+xgaa6OoJINyRqyWsHvTBEZrgKg0gCOHCCl4W5uMerKzJTSCA4LLwSuRl4WdsHT8eBZDaZWE0TtVkJh5AEMIFtbgslPCC7umLFUB4WXgZJVigLfbUBBY0gCCE3fE9ZqALrtTEVc7vquRzBPZVAfAAAAAASUVORK5CYII=',
                host: ['www.bing.com', 'cn.bing.com'],
                popup: function (text) {
                    openInNewTab('https://www.bing.com/search?q=' + encodeURIComponent(text));
                },
                custom: function (text) {}
            },
            {
                name: '百度搜索',
                id: 'baiduSearch',
                image: 'data:image/png;base64,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',
                host: ['www.baidu.com'],
                popup: function (text) {
                    openInNewTab('https://www.baidu.com/s?wd=' + encodeURIComponent(text));
                },
                custom: function (text) {}
            },
            {
                name: 'PDF 划词翻译',
                id: 'pdf',
                image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAMAAAD04JH5AAAB0VBMVEX////i5efi5efi5efi5efi5efAxsvi5efi5efi5eewt73i5ee1u8G/xcrJztLb3+Gyub/N0dW+xMnW29/K0djxVkLxVkLxVkLxVkLwZFLsiHzk1tbxVkLwYlDxWkb2joD3m4/2jH/zcWDxWUXxV0Pzaljza1rzaVfxW0fza1nyX0zyY1H+7uz/////+/v5u7PyYk/1h3n96uf+9PL70873npPyZVL3pJn+8vD//Pv7zsjxXEn3oZb+8e/1in395uP/+vr2lon5ta3++Pfzbl3xW0j//v75sqnxWUb0e2z1g3T96OX+9PP82dT94d7829b839v/+vn70cv+8O74qqD6xb/yYE36x8H1iHr0dmb0dWX4p5z2joH94+D0fW73mY37ysT0fm74ppv0emr95uT83dj71dD1hHX7zcf5s6vzbFr96uj1gXL2k4b/+fj++PjyY1D3oJX5saj1hXf1iXv0fm/zcmH819PxWET2lIj+9fT1i33zdGP81dD95OHzb133mo73npL94t72kIP+8vH6v7j6w7z1gnT84Nz97Or0fGzyYU783Nj6xb7+8/L6xr/yXkv2lor84d3sbl/hopzta1vM0tjM09rS2N7M09ng4+XO9mvSAAAAHXRSTlMAJH6y5v/AAW71/7T///////////8apub/////6uVo/FUAAAMkSURBVHgBpM4FAcNAAASw0pXp37/YKRg1UZDmk7brhzw0Nmyalzy38mDaIlYezMEADtqFAzbo4gEa9BrQwaABHUQDOPAADjyAAw/gwAM48AAOPIADD+DAAzjwgA48gAMP4MADOPAADjyAAw/gIGjXQdCx4iDoXHEQdN04iCqrDcKqDeLKLYPEXefxEvm5kZVKQFgEOwAQOwdCAAAADIT8rXdJ7CPoFjBoAwZlwKANGLQBgzZgUAcM2oBBGzBoAwZtwKANGLQBgzZg0AYM2oBBGTBoAwZtwKANGLQBgzZg0AYM0gBjpx607AiiKAy/xGCP7Tlj27Zt2/aNnTxx6rRyO11xdUf9L+7F7+KUD/gDAaFh4XCpiMiobwNCo+FiMVHfBITB1SK/CQiHq0V8EwCX8wE+wAf4gJ8AxMbF6yUkJsEqOSVVKy0d9pIyUq0yVQCysskqJzcPevkFZFZYVFwCq9Iy+lR5ReWvA6oouOoacMm1FFxZPoxK6shW/a8DGshWYxNEzWSvpbUNWu1kr0MNoDOXq+giUXeyCejpFfX1k9aADDA4lKwGMAytkVESjZmAcXBJE5PlvKYsQF2zWTKgFIC2aTGGbABuhv+nBekWAFaqAZgVY84BwDzPBS8Ai2IsOQGoEHPZC0CcGCsSwCrfR7IHgDUx1iWANN4bBoA2jSq2FAOSh0i0LQEk7/B5OM5wd08RoG+fO+gj0eaIBNDGl3joANCREoCtlmNIACe80xyA0zPlgPIqyADnYl7AAJRfGl0BqgHXJ5ABzm74jXbxDGsbuMnLW0AKmOV558U7IAfc81/w4ew3AVIDc8StwnPAo0FRIek9hluAdSJ64gTYK9+Ha4Cnxv/L3jMK7vkLGL3cJXqlFoCG7Ncj+LyOZTJ68/A28A5W7/s+dHxs3wxSMATBIMqv/qS09eaamqdtHUFD0cds5l3AB64ceXqYSEACEriDPVQW9lRbyWP11qhzfaktXwQQ+Vs6W2CQBfZJFehj6tdMAhKQwHOB8DclmCefAG8bvWKcafaLST/T8BkTTdNvzLoYxu+YFPH5OP9/S/DudP8HpbfsWEKgc+EAAAAASUVORK5CYII=',
                host: ['pdf.example.com'],
                popup: function (text) {
                    openInNewTab('https://barrer.github.io/tools/pdfjs/web/viewer.html');
                },
                custom: function (text) {}
            },
            {
                name: 'Settings',
                id: 'settings',
                image: 'data:image/png;base64,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',
                host: ['example.com'],
                popup: function (text) {
                    openInNewTab('https://example.com');
                },
                custom: function (text) {
                    settings();
                }
            }
        ],
        hostCustomMap = {}, // {host: [method, ...]}
        customMadeIconArray = getCustomMadeIconArray(true);
    // id、host 唯一性校验
    var idMaps = {};
    var hostMaps = {};
    customMadeIconArray.forEach(function (obj) {
        if (obj.id in idMaps) {
            alert('Duplicate Id: ' + obj.id);
        } else {
            idMaps[obj.id] = obj.id;
        }
        obj.host.forEach(function (host) {
            if (host in hostMaps) {
                log('Duplicate Host: ' + host);
            } else {
                hostMaps[host] = host;
            }
        });
    });
    log('idMaps:', idMaps, 'hostMaps:', hostMaps);
    // 初始化 hostCustomMap
    customMadeIconArray.forEach(function (obj) {
        obj.host.forEach(function (host) { // 赋值DOM加载后的自定义方法Map
            if (host in hostCustomMap) {
                hostCustomMap[host].push(obj.custom);
            } else {
                hostCustomMap[host] = [obj.custom];
            }
        });
    });
    log('hostCustomMap:', hostCustomMap);
    var icon = document.createElement('tr-icon'), // 翻译图标
        selected, // 当前选中文本
        pageX, // 图标显示的 X 坐标
        pageY; // 图标显示的 Y 坐标
    // 绑定图标拖动事件
    var iconDrag = new Drag(icon);
    // 翻译引擎添加到图标
    var isIconImgMore = false;
    customMadeIconArray.forEach(function (obj) {
        var img = document.createElement('img');
        img.setAttribute('src', obj.image);
        img.setAttribute('alt', obj.name);
        img.setAttribute('title', obj.name);
        img.addEventListener('mouseup', function () {
            dataTransfer.beforePopup(obj.popup);
        });
        if (isIconImgMore) {
            img.setAttribute('is-more', 'true');
        }
        if (obj.id == 'more') {
            isIconImgMore = true;
        }
        icon.appendChild(img);
    });
    // 翻译图标添加到 DOM
    var root = document.createElement('div');
    document.documentElement.appendChild(root);
    var shadow = root.attachShadow({
        mode: 'closed'
    });
    // iframe 工具库加入 Shadow
    shadow.appendChild(iframe);
    iframeWin = iframe.contentWindow;
    iframeDoc = iframe.contentDocument;
    // 外部样式表
    var link = document.createElement('link');
    link.rel = 'stylesheet';
    link.type = 'text/css';
    link.href = createObjectURLWithTry(new Blob(['\ufeff', style.textContent], {
        type: 'text/css;charset=UTF-8'
    }));
    shadow.appendChild(style); // 内部样式表
    shadow.appendChild(link); // 外部样式表
    adoptedStyleSheets(shadow, style.textContent); // CSSStyleSheet 样式
    shadow.appendChild(icon); // 翻译图标加入 Shadow
    // 重定向前隐藏页面主体
    if (gm.get(gm.REDIRECT_URL, '') && window.location.host == 'example.com') {
        document.documentElement.style.display = 'none';
    }
    window.addEventListener('DOMContentLoaded', (e) => {
        log('DOM fully loaded and parsed');
        // 重定向
        var redirect_url = gm.get(gm.REDIRECT_URL, '');
        log('redirect_url:' + redirect_url);
        if (redirect_url && window.location.host == 'example.com') {
            document.documentElement.style.display = 'none';
            document.body.innerHTML = '<a id="redirect_url" rel="noreferrer noopener" href="' + redirect_url + '">' + redirect_url + '</a>';
            document.querySelector('#redirect_url').click();
            gm.set(gm.REDIRECT_URL, '');
            return;
        }
        // 弹出后的新页面判断是否进行自动化处理
        var text = gm.get(gm.TEXT, '');
        log(gm.TEXT + ': ' + text);
        log('url: ' + window.location.href);
        log('host: ' + window.location.host);
        if (text && window.location.host in hostCustomMap) {
            dataTransfer.beforeCustom(hostCustomMap[window.location.host]);
        }
    });
    // 鼠标事件：防止选中的文本消失
    document.addEventListener('mousedown', function (e) {
        if (e.target == icon || (e.target.parentNode && e.target.parentNode == icon)) { // 点击了翻译图标
            e.preventDefault();
        }
    });
    // 鼠标事件：防止选中的文本消失；显示、隐藏翻译图标
    document.addEventListener('mouseup', showIcon);
    // 选中变化事件
    document.addEventListener('selectionchange', showIcon);
    document.addEventListener('touchend', showIcon);
    /**日志输出*/
    function log() {
        var debug = false;
        if (!debug) {
            return;
        }
        if (arguments) {
            for (var i = 0; i < arguments.length; i++) {
                console.log(arguments[i]);
            }
        }
    }
    /**是否非空*/
    function isNotNull(obj) {
        return (obj != undefined && obj != null) || false;
    }
    /**转 int*/
    function myParseInt(str, myDefault) {
        var rst = parseInt(str);
        return isNaN(rst) ? (isNotNull(myDefault) ? myDefault : 0) : rst;
    }
    /**数组移动*/
    function arrayMove(arr, oldIndex, newIndex) {
        if (oldIndex < 0 || oldIndex >= arr.length || newIndex < 0 || newIndex >= arr.length) {
            return arr;
        }
        if (newIndex >= arr.length) {
            var k = newIndex - arr.length + 1;
            while (k--) {
                arr.push(undefined);
            }
        }
        arr.splice(newIndex, 0, arr.splice(oldIndex, 1)[0]);
        return arr;
    };
    /**带异常处理的 createObjectURL*/
    function createObjectURLWithTry(blob) {
        try {
            return iframeWin.URL.createObjectURL(blob);
        } catch (error) {
            log(error);
        }
        return '';
    }
    /**触发事件*/
    function triggerEvent(el, type) {
        if ('createEvent' in document) { // modern browsers, IE9+
            var e = document.createEvent('HTMLEvents');
            //var e = document.createEvent('Event');
            e.initEvent(type, true, true); // event.initEvent(type, bubbles, cancelable);
            //判断是否需要按下回车
            if(type == "keydown") {
                //console.log("keydown event");
                e.keyCode = 13;
                e.which = 13;
                e.charCode = 13;
                e.key = 'Enter';
                e.code = 'Enter';
            }
            el.dispatchEvent(e);
        }
    }
    /**弹出居中窗口*/
    function popupCenter(url, title, w, h) {
        var transfer = 'https://example.com';
        w = w > screen.availWidth ? screen.availWidth : w;
        h = h > screen.availHeight ? screen.availHeight : h;
        var x = screen.availWidth / 2 - w / 2;
        var y = screen.availHeight / 2 - h / 2;
        x = x < 0 ? 0 : x;
        y = y < 0 ? 0 : y;
        var win;
        try {
            win = window.open('', title, 'scrollbars=yes, width=' + w + ', height=' + h + ', top=' + y + ', left=' + x);
            win.opener = null;
            win.document.body.innerHTML = '<a id="redirect_url" rel="noreferrer noopener" href="' + url + '"></a>';
            win.document.querySelector('#redirect_url').click();
        } catch (e) {
            gm.set(gm.REDIRECT_URL, url);
            win = window.open(transfer, title, 'scrollbars=yes, width=' + w + ', height=' + h + ', top=' + y + ', left=' + x);
            log(e);
        }
        if (window.focus) {
            win.focus();
        }
        return win;
    }
    /**打开新的标签页*/
    function openInNewTab(url) {
        var a = document.createElement('a');
        a.setAttribute('target', '_blank');
        a.setAttribute('rel', 'noreferrer noopener'); // document.referrer, window.opener
        a.setAttribute('href', url);
        a.style.display = 'none';
        shadow.appendChild(a);
        a.click();
        a.remove();
    }
    /**是否包含汉字*/
    function hasChineseByRange(str) {
        return /[\u4e00-\u9fa5]/ig.test(str);
    }
    /**解决 Content-Security-Policy 样式文件加载问题（Chrome 实验功能）*/
    function adoptedStyleSheets(bindDocumentOrShadowRoot, cssText) {
        try {
            if (bindDocumentOrShadowRoot.adoptedStyleSheets) {
                cssText = cssText.replace(/\/\*.*?\*\//ig, ''); // remove CSS comments
                var cssSheet = new CSSStyleSheet();
                var styleArray = cssText.split('\n');
                for (var i = 0; i < styleArray.length; i++) {
                    var line = styleArray[i].trim();
                    if (line.length > 0) {
                        cssSheet.insertRule(line);
                    }
                }
                bindDocumentOrShadowRoot.adoptedStyleSheets = [cssSheet];
            }
        } catch (error) {
            log(error);
        }
    }
    /**鼠标拖动*/
    function Drag(element) {
        this.dragging = false;
        this.mouseDownPositionX = 0;
        this.mouseDownPositionY = 0;
        this.elementOriginalLeft = 0;
        this.elementOriginalTop = 0;
        var ref = this;
        this.startDrag = function (e) {
            e.preventDefault();
            ref.dragging = true;
            ref.mouseDownPositionX = e.clientX;
            ref.mouseDownPositionY = e.clientY;
            ref.elementOriginalLeft = myParseInt(element.style.left);
            ref.elementOriginalTop = myParseInt(element.style.top);
            // set mousemove event
            window.addEventListener('mousemove', ref.dragElement);
            log('startDrag');
        };
        this.unsetMouseMove = function () {
            // unset mousemove event
            window.removeEventListener('mousemove', ref.dragElement);
        };
        this.stopDrag = function (e) {
            e.preventDefault();
            ref.dragging = false;
            ref.unsetMouseMove();
            log('stopDrag');
        };
        this.dragElement = function (e) {
            log('dragging');
            if (!ref.dragging) {
                return;
            }
            e.preventDefault();
            // move element
            element.style.left = ref.elementOriginalLeft + (e.clientX - ref.mouseDownPositionX) + 'px';
            element.style.top = ref.elementOriginalTop + (e.clientY - ref.mouseDownPositionY) + 'px';
            log('dragElement');
        };
        element.onmousedown = this.startDrag;
        element.onmouseup = this.stopDrag;
    }
    /**强制结束拖动*/
    function forceStopDrag() {
        // 强制设置鼠标拖动事件结束，防止由于网页本身的其它鼠标事件冲突而导致没有侦测到：mouseup
        if (iconDrag) {
            iconDrag.dragging = false;
            iconDrag.unsetMouseMove();
        }
    }
    /**显示 icon*/
    function showIcon(e) {
        log('showIcon event:', e);
        var offsetX = 4; // 横坐标翻译图标偏移
        var offsetY = 8; // 纵坐标翻译图标偏移
        // 更新翻译图标 X、Y 坐标
        if (e.pageX && e.pageY) { // 鼠标
            log('mouse pageX/Y');
            pageX = e.pageX;
            pageY = e.pageY;
        }
        if (e.changedTouches) { // 触屏
            if (e.changedTouches.length > 0) { // 多点触控选取第 1 个
                log('touch pageX/Y');
                pageX = e.changedTouches[0].pageX;
                pageY = e.changedTouches[0].pageY;
                // 触屏修改翻译图标偏移（Android、iOS 选中后的动作菜单一般在当前文字顶部，翻译图标则放到底部）
                offsetX = -26; // 单个翻译图标块宽度
                offsetY = 16 * 3; // 一般字体高度的 3 倍，距离系统自带动作菜单、选择光标太近会导致无法点按
            }
        }
        log('selected:' + selected + ', pageX:' + pageX + ', pageY:' + pageY)
        if (e.target == icon || (e.target.parentNode && e.target.parentNode == icon)) { // 点击了翻译图标
            e.preventDefault();
            return;
        }
        selected = window.getSelection().toString().trim(); // 当前选中文本
        log('selected:' + selected + ', icon display:' + icon.style.display);
        if (selected && icon.style.display != 'block' && pageX && pageY) { // 显示翻译图标
            log('show icon');
            icon.style.top = pageY + offsetY + 'px';
            icon.style.left = pageX + offsetX + 'px';
            icon.style.display = 'block';
            // 兼容部分 Content Security Policy
            icon.style.position = 'absolute';
            icon.style.zIndex = zIndex;
        } else if (!selected) { // 隐藏翻译图标
            log('hide icon');
            hideIcon();
        }
    }
    /**隐藏 icon*/
    function hideIcon() {
        icon.style.display = 'none';
        pageX = 0;
        pageY = 0;
        icon.querySelectorAll('img[is-more]').forEach(function (ele) {
            ele.style.display = 'none';
        });
        forceStopDrag();
    }
    /**设置*/
    function settings() {
        var hideConfig = gm.get(gm.HIDE, {});
        var sortConfig = gm.get(gm.SORT, []);
        log('hideConfig: ', hideConfig);
        log('sortConfig: ', sortConfig);
        var allSortedIconArray = getCustomMadeIconArray(false);
        document.querySelectorAll('style,link,script').forEach(function (ele) {
            ele.remove();
        });
        document.querySelectorAll('title').forEach(function (ele) {
            ele.innerHTML = 'configuration page';
        });
        document.title = 'configuration page';
        document.body.innerHTML = '';
        document.body.style.padding = '20px';
        var desc = document.createElement('div');
        desc.innerHTML = '<h3>After the change, close the configuration page and refresh the current page, the new configuration will take effect.</h3>';
        var reset = document.createElement('button'); // 重置配置
        reset.innerHTML = 'reset settings';
        reset.addEventListener('click', function () {
            var r = confirm("Do you want to reset user settings?");
            if (r == true) {
                gm.reset();
                settings();
            }
        });
        document.body.appendChild(desc);
        document.body.appendChild(reset);
        document.body.appendChild(document.createElement('hr'));
        allSortedIconArray.forEach(function (obj, i) {
            var item = document.createElement('div'),
                name = document.createElement('span'),
                up = document.createElement('a'),
                down = document.createElement('a'),
                show = document.createElement('a'),
                span = document.createElement('span');
            name.innerHTML = obj.name;
            span.innerHTML = '&nbsp;&nbsp;';
            up.innerHTML = 'up';
            up.setAttribute('href', 'javascript:void(0)');
            up.setAttribute('index', i);
            up.addEventListener('click', function () {
                var index = myParseInt(this.getAttribute('index'));
                var newIconArray = arrayMove(allSortedIconArray, index, index - 1);
                var idArray = [];
                newIconArray.forEach(function (sObj) {
                    idArray.push(sObj.id);
                });
                gm.set(gm.SORT, idArray);
                settings();
            });
            down.innerHTML = 'down';
            down.setAttribute('href', 'javascript:void(0)');
            down.setAttribute('index', i);
            down.addEventListener('click', function () {
                var index = myParseInt(this.getAttribute('index'));
                var newIconArray = arrayMove(allSortedIconArray, index, index + 1);
                var idArray = [];
                newIconArray.forEach(function (sObj) {
                    idArray.push(sObj.id);
                });
                gm.set(gm.SORT, idArray);
                settings();
            });
            show.innerHTML = 'show';
            show.setAttribute('show-id', obj.id);
            if (isNotNull(hideConfig[obj.id])) {
                show.innerHTML = 'hide';
            }
            show.setAttribute('href', 'javascript:void(0)');
            show.addEventListener('click', function () {
                if (this.innerHTML == 'show') { // 隐藏
                    if (this.getAttribute('show-id') != 'settings') {
                        hideConfig[this.getAttribute('show-id')] = true;
                    }
                } else { // 显示
                    delete hideConfig[this.getAttribute('show-id')];
                }
                gm.set(gm.HIDE, hideConfig);
                settings();
            });
            item.appendChild(up);
            item.appendChild(span.cloneNode(true));
            item.appendChild(down);
            item.appendChild(span.cloneNode(true));
            item.appendChild(show);
            item.appendChild(span.cloneNode(true));
            item.appendChild(name);
            document.body.appendChild(item);
            document.body.appendChild(document.createElement('hr'));
        });
    }
    /**得到定制化的图标顺序*/
    function getCustomMadeIconArray(hide) {
        var hideConfig = gm.get(gm.HIDE, {});
        var sortConfig = gm.get(gm.SORT, []);
        log('hideConfig: ', hideConfig);
        log('sortConfig: ', sortConfig);
        var customMadeIconArray = [];
        var tempArray = [];
        // hide
        iconArray.forEach(function (obj) {
            if (hide && !isNotNull(hideConfig[obj.id])) {
                tempArray.push(obj);
            } else if (!hide) {
                tempArray.push(obj);
            }
        });
        // sort
        var sorted = {};
        sortConfig.forEach(function (id) {
            tempArray.forEach(function (tObj) {
                if (id == tObj.id) {
                    customMadeIconArray.push(tObj);
                    sorted[id] = true;
                }
            });
        });
        tempArray.forEach(function (tObj) {
            if (!isNotNull(sorted[tObj.id])) {
                customMadeIconArray.push(tObj);
            }
        });
        log('customMadeIconArray: ', customMadeIconArray);
        return customMadeIconArray;
    }
})();
