// ==UserScript==
// @name         Swagger - Toolkit - Theo
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Type `Ctrl`+`Space` to Submit request
// @author       Theo·Chan
// @license      AGPL
// @match        http://*/swagger/index.html
// @grant        none
// @esversion    8
// @compatible   firefox >= 52
// @compatible   chrome >= 49
// @downloadURL https://update.greasyfork.org/scripts/518155/Swagger%20-%20Toolkit%20-%20Theo.user.js
// @updateURL https://update.greasyfork.org/scripts/518155/Swagger%20-%20Toolkit%20-%20Theo.meta.js
// ==/UserScript==

(function () {
    'use strict';

    console.log('running “Swagger - Toolkit - Theo” ……');
    const inputTags = ['INPUT', 'TEXTAREA', 'SELECT']
    /**
     * key press handler
     * @param {HTMLElementEventMap} event keydown event
     */
    function keyPressHandler(event) {
        event = event || window.event;

        if ((event.ctrlKey || event.metaKey) && event.keyCode === 13) {
            if (!isInPutElement(event)) {
                return;
            }
            let submit = findCommitBtn(event.target)
            if (submit === null) {
                return
            }
            if (confirm('您已触发快速提交，确定提交？')) {
                submit.click()
            }
        }
    }

    /**
     *
     * @param {HTMLElementEventMap} event keydown event
     */
    function isInPutElement(event) {
        let target = event.target
        return inputTags.includes(target.nodeName)
    }

    function findCommitBtn(target) {
        let body = target.closest('div.opblock-body');
        return (body === null) ? null :
            body.querySelector('button.execute');
    }
    document.addEventListener('keydown', keyPressHandler)

    /**
     * 美化schema-model
     */
    function addModelStyles() {
        let stl = document.createElement('style'),
            str = `.model .prop .renderedMarkdown{ display: inline-block !important;} .model .prop .renderedMarkdown p{ margin: 0 0 0 1rem !important;} .swagger-ui .body-param>textarea{ min-height: 120px; resize:vertical } .swagger-ui .opblock-tag-section.is-open .opblock-tag{position:sticky;top:0px;background:rgb(240,240,240,.8);border-radius: 0 0 5px 5px;z-index:1;}.curl-command{ height:150px; overflow-y: scroll; resize: vertical;}`;
        stl.setAttribute('type', 'text/css');
        if (stl.styleSheet) { //ie下
            stl.styleSheet.cssText = str;
        } else {
            stl.innerHTML = str;
        }
        document.getElementsByTagName('head')[0].appendChild(stl);
    }
    addModelStyles();

    /*给每个controller <a>标签添加href*/
    const resizeObserver = new ResizeObserver(entries => {
        let tags = document.querySelectorAll('#swagger-ui .wrapper .block .opblock-tag-section .opblock-tag');
        for (const element of tags) {// 从第一个开始展开
            let a = element.firstChild;
            if (!a.hasAttribute('href')) {
                a.setAttribute('href', '#' + element.id);
            }
        }
    });
    resizeObserver.observe(document.getElementById('swagger-ui'));
    /*给每个controller <a>标签添加href*/

    function setOpacity(ele, opacity) {
        if (ele.style.opacity != undefined) {
            ///兼容FF和GG和新版本IE
            ele.style.opacity = opacity / 100;
        } else {
            ///兼容老版本ie
            ele.style.filter = "alpha(opacity=" + opacity + ")";
        }
    }

    function fadeIn(ele, opacity, speed) {
        if (ele) {
            let v = ele.style.filter.replace("alpha(opacity=", "").replace(")", "") || ele.style.opacity;
            v < 1 && (v = v * 100);
            let count = speed / 1000;
            let avg = count < 2 ? (opacity / count) : (opacity / count - 1);
            let timer = null;
            timer = setInterval(function () {
                if (v < opacity) {
                    v += avg;
                    setOpacity(ele, v);
                } else {
                    clearInterval(timer);
                }
            }, 500);
        }
    }

    function fadeOut(ele, opacity, speed) {
        if (ele) {
            let v = ele.style.filter.replace("alpha(opacity=", "").replace(")", "") || ele.style.opacity || 100;
            v < 1 && (v = v * 100);
            let count = speed / 1000;
            let avg = (100 - opacity) / count;
            let timer = null;
            timer = setInterval(function () {
                if (v - avg > opacity) {
                    v -= avg;
                    setOpacity(ele, v);
                } else {
                    clearInterval(timer);
                }
            }, 500);
        }
    }

    const _speed = 1500;
    function fadeRemove(ele) {
        fadeOut(ele, 0, _speed * 20);
        setTimeout(() => { ele.remove(); }, _speed * 2);
    }

    function bannerTip(msg) {
        let ele = document.createElement('DIV');
        ele.className = 'banner-tip';
        ele.innerText = msg;
        document.getElementsByTagName('BODY')[0].appendChild(ele);
        fadeIn(ele, 100, _speed);
        return ele;
    }

    function refreshBannerTip(ele, msg) {
        ele.innerText = msg;
        console.log(msg);
    }

    /**
     * 切换 schemas
     */
    function switchSchemasBlock(banner, on) {
        let btn = document.querySelectorAll('.block-desktop.block')[1].querySelector('h4');
        if (!btn) { return; }
        if (on && !btn.parentElement.classList.contains('is-open')) {
            refreshBannerTip(banner, `展开 schemas……`);
            btn.click();
        }
        if (!on && btn.parentElement.classList.contains('is-open')) {
            refreshBannerTip(banner, `收起 schemas……`);
            btn.click();
        }
    }

    /**
     * 收起每个opblock
     */
    function* collapseOpblockTags() {
        let open = false;
        let banner = bannerTip('收起中……');
        switchSchemasBlock(banner, false);
        let tags = document.querySelectorAll('.block-desktop.block')[0].firstChild.querySelectorAll('.opblock-tag');
        let num = 0;
        for (let i = tags.length - 1; i >= 0; i--) {// 从最后一个开始收起
            num++;
            let tag = tags[i];
            if (tag.dataset.hasOwnProperty('isOpen')) {
                let opening = tag.dataset.isOpen == 'true';
                if (opening != open) {
                    tag.click();
                }
            }
            if (num % 5 == 0)
            { refreshBannerTip(banner, `收起中 ${num}/${tags.length} ……`); }
            yield i;
        }
        console.log(`side-toolbar: 共收起 ${tags.length} 组接口`);
        refreshBannerTip(banner, `已全部收起 ${tags.length} 组接口`);
        fadeRemove(banner);
        document.querySelector('.block.block-desktop').style.display = null;
    }


    /**
     * 展开每个opblock
     */
    function* expandOpblockTags() {
        let open = true;
        let banner = bannerTip('展开中……');
        switchSchemasBlock(banner, true);
        let tags = document.querySelectorAll('.block-desktop.block')[0].firstChild.querySelectorAll('.opblock-tag');
        for (let i = 0; i < tags.length; i++) {
            let tag = tags[i];
            if (tag.dataset.hasOwnProperty('isOpen')) {
                let opening = tag.dataset.isOpen == 'true';
                if (opening != open) {
                    tag.click();
                }
            }
            if (i % 5 == 0)
            { refreshBannerTip(banner, `展开中 ${i + 1}/${tags.length} ……`); }
            yield i;
        }
        console.log(`side-toolbar: 共展开 ${tags.length} 组接口`);
        refreshBannerTip(banner, `已全部展开 ${tags.length} 组接口`);
        fadeRemove(banner);
    }

    /**
     * 返回顶部
     */
    function backTop() {
        //记录当前执行动画的标识
        let animationStepNumber;
        function executeAnimationByStep() {
            //当前页面的滚动高度
            let currentScrollTop = document.documentElement.scrollTop || document.body.scrollTop;
            if (currentScrollTop >= 4) {
                animationStepNumber = window.requestAnimationFrame(executeAnimationByStep);
                let scrollLocationChanging = currentScrollTop / 9;
                scrollLocationChanging = scrollLocationChanging > 1 ? scrollLocationChanging : 1;
                let newScrollTop = currentScrollTop - scrollLocationChanging;
                window.scrollTo(0, newScrollTop);
            } else {
                window.cancelAnimationFrame(animationStepNumber);
                window.scrollTo(0, 0);
            }
        }
        animationStepNumber = window.requestAnimationFrame(executeAnimationByStep);
    }

    /**
     * 简易时间分片 -- 用于解决卡页面问题
     */
    function timeSlice(fnc) {
        if (fnc.constructor.name !== 'GeneratorFunction') return fnc()

        return async function (...args) {
            const fnc_ = fnc(...args)
            let data
            do {
                data = fnc_.next()
                // 每执行一步就休眠，注册一个宏任务 setTimeout 来叫醒他
                await new Promise(resolve => setTimeout(resolve));
            } while (!data.done)
            return data.value
        }
    }

    function addSideBar() {
        if (document.getElementsByClassName('side-toolbar').length > 0) { return; }
        let sideBarStyle = `body{position:relative;}.side-toolbar{position:fixed;bottom:10px;right:15px;z-index:1000;background:rgba(190,190,190,.5);border-radius:4px;padding:5px;color:#8a8a8a;}.side-toolbar > hr{border-color:#ccc;border-style:solid;border-radius:10px;margin:5px -2px;}.side-toolbar .side-toolbar-btn{display:block;cursor:pointer;}.side-toolbar .side-toolbar-btn > span{display:none;width:42px;height:46px;font-size:16px;text-align:center;padding-top:4px;font-weight:bolder;font-family:cursive;}.side-toolbar .side-toolbar-btn:hover > svg{display:none;}.side-toolbar .side-toolbar-btn:hover > span{display:block;}.banner-tip{width:50%;background:rgb(120,120,120,0.6);position:fixed;bottom:0;left:25%;text-align:center;padding:10px;font-size:20px;color:#fff;font-family:cursive;font-weight:bolder;border-radius:4px;}`;
        let sideBarHtml = `<div class="side-toolbar-btn back-top">
			<svg t="1697592187661" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3998" width="42" height="42" xmlns:xlink="http://www.w3.org/1999/xlink">
				<path d="M853.333333 170.666667H170.666667v85.333333h288L221.866667 571.733333A42.624 42.624 0 0 0 256 640h85.333333v170.666667a42.666667 42.666667 0 0 0 42.666667 42.666666h256a42.666667 42.666667 0 0 0 42.666667-42.666666v-170.666667h85.333333a42.709333 42.709333 0 0 0 34.133333-68.266667L565.333333 256H853.333333V170.666667z m-213.333333 384a42.666667 42.666667 0 0 0-42.666667 42.666666v170.666667h-170.666666v-170.666667a42.666667 42.666667 0 0 0-42.666667-42.666666H341.333333l170.666667-227.541334L682.666667 554.666667h-42.666667z" fill="#8a8a8a" p-id="3999"></path>
			</svg>
			<span>返回顶部</span>
		</div>
		<hr>
		<div class="side-toolbar-btn opblock-collapse">
			<svg t="1697593657642" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="7897" width="42" height="42"><path d="M384 620.032c0 5.376-1.984 10.048-5.952 14.08C374.08 638.08 369.344 640 364.032 640L83.968 640c-5.376 0-10.112-1.92-14.08-5.952C65.92 630.08 64 625.344 64 620.032s1.92-10.048 5.952-14.08L209.92 465.984C213.888 462.016 218.624 460.032 224 460.032s10.048 1.984 14.08 6.016l140.032 139.968C382.016 609.92 384 614.656 384 620.032zM960 352C960 369.664 945.664 384 928 384l-448 0C462.336 384 448 369.664 448 352l0 0C448 334.336 462.336 320 480 320l448 0C945.664 320 960 334.336 960 352L960 352zM960 480C960 497.664 945.664 512 928 512l-448 0C462.336 512 448 497.664 448 480l0 0C448 462.336 462.336 448 480 448l448 0C945.664 448 960 462.336 960 480L960 480zM960 608c0 17.6-14.336 32-32 32l-448 0C462.336 640 448 625.6 448 608l0 0C448 590.272 462.336 576 480 576l448 0C945.664 576 960 590.272 960 608L960 608zM960 736c0 17.6-14.336 32-32 32l-448 0C462.336 768 448 753.6 448 736l0 0C448 718.272 462.336 704 480 704l448 0C945.664 704 960 718.272 960 736L960 736z" fill="#8a8a8a" p-id="7898"></path></svg>
			<span>收起全部</span>
		</div>
		<hr>
		<div class="side-toolbar-btn opblock-expand">
			<svg t="1697594052915" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="8939" width="42" height="42"><path d="M384 467.968c0-5.376-1.984-10.048-5.952-14.08C374.08 449.92 369.344 448 364.032 448L83.968 448c-5.376 0-10.112 1.92-14.08 5.952C65.92 457.92 64 462.656 64 467.968s1.92 10.048 5.952 14.08L209.92 622.016C213.888 625.984 218.624 627.968 224 627.968s10.048-1.984 14.08-6.016l140.032-139.968C382.016 478.08 384 473.344 384 467.968zM960 352C960 369.664 945.664 384 928 384l-448 0C462.336 384 448 369.664 448 352l0 0C448 334.336 462.336 320 480 320l448 0C945.664 320 960 334.336 960 352L960 352zM960 480C960 497.664 945.664 512 928 512l-448 0C462.336 512 448 497.664 448 480l0 0C448 462.336 462.336 448 480 448l448 0C945.664 448 960 462.336 960 480L960 480zM960 608c0 17.6-14.336 32-32 32l-448 0C462.336 640 448 625.6 448 608l0 0C448 590.272 462.336 576 480 576l448 0C945.664 576 960 590.272 960 608L960 608zM960 736c0 17.6-14.336 32-32 32l-448 0C462.336 768 448 753.6 448 736l0 0C448 718.272 462.336 704 480 704l448 0C945.664 704 960 718.272 960 736L960 736z" fill="#8a8a8a" p-id="8940"></path></svg>
			<span>展开全部</span>
		</div>`;
        let sideStyle = document.createElement('STYLE');
        sideStyle.innerHTML = sideBarStyle;
        document.getElementsByTagName('HEAD')[0].appendChild(sideStyle);

        let sideBar = document.createElement('DIV');
        sideBar.className = 'side-toolbar';
        sideBar.innerHTML = sideBarHtml;
        document.getElementsByTagName('BODY')[0].appendChild(sideBar);

        document.getElementsByClassName('back-top')[0].addEventListener('click', function () { backTop(); });
        document.getElementsByClassName('opblock-collapse')[0].addEventListener('click', function () {
            setTimeout(async () => { await timeSlice(collapseOpblockTags)(); }, 10);
        });
        document.getElementsByClassName('opblock-expand')[0].addEventListener('click', function () {
            setTimeout(async () => { await timeSlice(expandOpblockTags)(); }, 10);
        });
    }

    addSideBar();

    // 定义一个定时器，每200毫秒执行一次
    let timer = setInterval(() => {
        let blocks = document.querySelectorAll('.opblock').length;
        if (blocks > 100) {
            let banner = bannerTip(`操作块过多[${blocks}]，自动折叠……`);
            setTimeout(async () => {
                //收起过程太卡了，先隐藏掉整个block
                document.querySelector('.block.block-desktop').style.display = 'none';
                document.getElementsByClassName('opblock-collapse')[0].click();
                fadeRemove(banner);
            }, 10);
            clearInterval(timer);
        }
    }, 200);
})();