// ==UserScript==
// @name         知乎下一条
// @version      0.0.2
// @description  给知乎右下角添加"下一条"按钮，实现快速切换到下一个主题或评论。
// @author       DH
// @homepageURL  https://denghao.me
// @match        https://*.zhihu.com/*
// @require      https://cdn.bootcss.com/jquery/2.2.1/jquery.min.js
// @namespace https://greasyfork.org/users/978718
// @downloadURL https://update.greasyfork.org/scripts/454180/%E7%9F%A5%E4%B9%8E%E4%B8%8B%E4%B8%80%E6%9D%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/454180/%E7%9F%A5%E4%B9%8E%E4%B8%8B%E4%B8%80%E6%9D%A1.meta.js
// ==/UserScript==
this.$ = this.jQuery = jQuery.noConflict(true);

(function () {
    //公用方法
    const utils={
        throttle :function(func, wait) {
            let timeout;
            return function() {
                const context = this;
                const args = arguments;
                if (!timeout) {
                    timeout = setTimeout(() => {
                        timeout = null;
                        func.apply(context, args)
                    }, wait)
                }
            }
        },
        scrollTop: function (scrollTo, time= 100) {
            let scrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;
            let scrollFrom = parseInt(scrollTop),
                i = 0,
                step = 10;
            scrollTo = parseInt(scrollTo);
            time /= step;
            let interval = setInterval(function () {
                i++;
                let top = (scrollTo - scrollFrom) / time * i + scrollFrom;
                document.body.scrollTop = top;
                document.documentElement.scrollTop = top;
                if (i >= time) {
                    clearInterval(interval);
                }
            }, step);
        }
    }

    //主要逻辑
    const view = {

        //知乎列表项位置集合
        zhihuAreas:[],

        // 初始化
        init:function(){
            this.handleZhihuNextBtn();
            this.bindEvents();
        },
        // 知乎:下一个
        handleZhihuNextBtn:function(){
            //生成按钮
            const $wrap = $(".CornerButtons");
            const $btnNext = `<button id="zhihu-btn-next"  data-tooltip="下一条" data-tooltip-position="left" data-tooltip-will-hide-on-click="true" class="Button CornerButton" style="margin-top:5px;padding: 0px;font-size: 14px;line-height: inherit;text-align: center;cursor: pointer;border: none;display: flex;align-items: center;justify-content: center;background: rgb(255, 255, 255);border-radius: 4px;width: 40px;height: 40px;color: rgb(133, 144, 166);box-shadow: rgb(18 18 18 / 10%) 0px 1px 3p"><svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true" style="transform:rotate(180deg);" fill="currentColor"><path fill-rule="evenodd" d="M13.204 3.107a1.75 1.75 0 0 0-2.408 0L3.806 9.73c-1.148 1.088-.378 3.02 1.204 3.02h2.24V20c0 .966.784 1.75 1.75 1.75h6A1.75 1.75 0 0 0 16.75 20v-7.25h2.24c1.582 0 2.353-1.932 1.204-3.02l-6.99-6.623Z" clip-rule="evenodd"></path></svg></button>`;
            $wrap.css({bottom:'40px'}).find('.CornerAnimayedFlex').css({height:'auto'}).append($btnNext);
            this.calcAreas()
        },

        // 计算item-list位置
        calcAreas:function(){
            let $listItems=[];
            if($('.ListShortcut .TopstoryItem').length){
                $listItems=$('.ListShortcut .TopstoryItem');
            }else{
                $listItems=$('.ListShortcut .List-item');
            }
            let areas= [];
            $.each($listItems,(index,el)=>{
                const offset = 60;
                const start = $(el).offset().top-offset;
                const end = start + $(el).height()-offset;
                areas.push([start, end]);
            })
            this.zhihuAreas = areas;
        },

        // 公用绑定事件
        bindEvents:function(){
            // 滚动计算位置
            $(window).on('scroll',utils.throttle(()=>{
                this.calcAreas();
            },300))

            // 下一条
            $("#zhihu-btn-next").on('click',(el)=>{
                const winTop = $(document).scrollTop();
                const winH = $(document).height();
                const firstItem = this.zhihuAreas[0];
                if(firstItem && firstItem[0]>winTop){
                    // 位置小于第一条，跳往第一条
                    utils.scrollTop(firstItem[0]+5)
                }else{
                    // 位置大于第一条，跳往下一条
                    for(let i=0;i<=this.zhihuAreas.length;i++){
                        const item = this.zhihuAreas[i];
                        const nextItem =  this.zhihuAreas[i+1];
                        if(item && winTop>=item[0] && winTop<=item[1] && nextItem){
                            utils.scrollTop(nextItem[0]+5)
                        }
                    }
                }
            })
        }
    }

    //start
    view.init();
})();