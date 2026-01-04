// ==UserScript==
// @name         永城市专业技术人员继续教育助手--许庄
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  给没有时间学习的老师提供帮助的小助手
// @author       孔佑霖他爸
// @match        http://hnyc.zyk.ghlearning.com/learning/index*
// @icon          data:image/png;base64,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
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/428932/%E6%B0%B8%E5%9F%8E%E5%B8%82%E4%B8%93%E4%B8%9A%E6%8A%80%E6%9C%AF%E4%BA%BA%E5%91%98%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E5%8A%A9%E6%89%8B--%E8%AE%B8%E5%BA%84.user.js
// @updateURL https://update.greasyfork.org/scripts/428932/%E6%B0%B8%E5%9F%8E%E5%B8%82%E4%B8%93%E4%B8%9A%E6%8A%80%E6%9C%AF%E4%BA%BA%E5%91%98%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E5%8A%A9%E6%89%8B--%E8%AE%B8%E5%BA%84.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var TitleFlags={}
    //点击【继续学习】的方法
    function autoContinue(continueBtn) {
        if (continueBtn && continueBtn.click) {
            var imitateMousedown = document.createEvent("MouseEvents");
            imitateMousedown.initEvent("mousedown", true, true);
            continueBtn.dispatchEvent(imitateMousedown);
            continueBtn.click();
            if (console && console.log) {
                console.log('找到并点击了[继续学习]');
            }
        }
    }
    function start(){
        try{
            let a=document.getElementsByClassName('course-list')[0]
            for(var outIndex=0;outIndex<a.childElementCount;outIndex++){
                let eachone=a.children[outIndex]
                let b= eachone.getElementsByTagName('ul')[0]
                for(let innerIndex=0;innerIndex<b.childElementCount;innerIndex++){
                    let c=b.children[innerIndex]
                    let bofangstate=c.getElementsByTagName('span')[0].className
                    let progress=c.getElementsByClassName('badge')[0].innerText
                    let title=c.getElementsByClassName('video-info ellipsis-1')[0].innerText
                    let bofangNode=document.getElementsByClassName('pv-playpause pv-iconfont pv-icon-btn-play')[0]
                    if(progress!='100%' && bofangNode!=null){
                        let currentTitle=TitleFlags[title]
                        if(currentTitle ==null || currentTitle==false){//保证每个标题只点一次
                            document.getElementsByClassName('pv-volumebtn pv-iconfont')[0].click()
                            TitleFlags[title]=true
                            console.log('当前标题',currentTitle)
                        }
                        // if(bofangNode!=null){
                        autoContinue(bofangNode)
                        //}
                        return
                    }
                }
            }
        }catch(e){
            console.log('异常',e)
        }
    }
    setInterval(start,5000)
})();