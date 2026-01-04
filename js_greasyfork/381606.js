// ==UserScript==
// @name        和彩云 文件移动目录树自动展开当前位置
// @author       极品小猫
// @namespace     https://greasyfork.org/users/3128/caiyun
// @version       0.1
// @description    和彩云网盘中，右键菜单执行移动操作的时候，增加一个“定位到当前目录”按钮，以便于将文件移动至子目录中。
// @match        https://caiyun.feixin.10086.cn/portal/index.jsp*
// @require      http://cdn.staticfile.org/jquery/2.1.4/jquery.min.js
// @grant        unsafeWindow
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/381606/%E5%92%8C%E5%BD%A9%E4%BA%91%20%E6%96%87%E4%BB%B6%E7%A7%BB%E5%8A%A8%E7%9B%AE%E5%BD%95%E6%A0%91%E8%87%AA%E5%8A%A8%E5%B1%95%E5%BC%80%E5%BD%93%E5%89%8D%E4%BD%8D%E7%BD%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/381606/%E5%92%8C%E5%BD%A9%E4%BA%91%20%E6%96%87%E4%BB%B6%E7%A7%BB%E5%8A%A8%E7%9B%AE%E5%BD%95%E6%A0%91%E8%87%AA%E5%8A%A8%E5%B1%95%E5%BC%80%E5%BD%93%E5%89%8D%E4%BD%8D%E7%BD%AE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    addMObserver('body', function(mutations, observer){
        mutations.some(function(x){
            x.addedNodes.forEach(function(e){
                if(e.id=='layerContainer_1') {
                    $('<a href="javascript:void(0);" id="mAndc_FloderPosition" class="pop-btn-white p14 cancelWinBtn offlineDownBtn floatright" onclick="return false"><span>定位到当前目录</span></a>').on('click',FloderPosition).insertAfter($('#moveAndCopyDialog #mAndc_newFloder'));
                }FloderPosition();
            });
        });
    });
    function addMObserver(selector, callback, Kill, option) {
        var watch = document.querySelector(selector);
        if (!watch) return;
        var observer = new MutationObserver(function(mutations){
            var nodeAdded = mutations.some(function(x){
                return x.addedNodes.length > 0;
            });
            if (nodeAdded) {
                callback(mutations, observer);
                if(Kill) console.log('停止'+selector+'的监控'), observer.disconnect();
            }
        });
        observer.observe(watch, option||{childList: true,attributes:false});
    }

    function FloderPosition(){
        var $FloderTree=$('.collapsable'), //获得文件操作的目录树
            $FloderPath=$('#filePath .pathItem').not(':eq(0)');//获取当前目录位置，排除掉第一个位置的“我的文件”
        $FloderPath.each(function(index){
            var $this=this;
            setTimeout(function(){//设定延迟执行，每500ms打开一个目录树
                $FloderTree=$FloderTree.find(':contains('+$($this).text()+')');
                console.log($this.outerText, $FloderTree);
                $FloderTree.click();
            }, 500*index);
        });
    }
    // Your code here...
})();