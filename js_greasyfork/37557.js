// ==UserScript==
// @name         CSDN去广告V0.3
// @namespace    http://tampermonkey.net/zxc/csdn/adblock
// @version      0.3
// @description  CSDN广告闪瞎眼
// @author       zxc
// @match        http*://blog.csdn.net/*
// @match        http*://*.csdn.net/*
// @grant        none
// @compatible   chrome
// @incompatible IE678
// @downloadURL https://update.greasyfork.org/scripts/37557/CSDN%E5%8E%BB%E5%B9%BF%E5%91%8AV03.user.js
// @updateURL https://update.greasyfork.org/scripts/37557/CSDN%E5%8E%BB%E5%B9%BF%E5%91%8AV03.meta.js
// ==/UserScript==

(function() {
    'use strict';
    blockAd();
    window.setTimeout(blockAd,1000);//防止后面加载的广告

    function blockAd (){
        //console.dir('blockAd');
        var selectors = [ 'iframe', '.flashrecommend','#layerd','#homepageArticles','.pulllog-box','.recommend-ad-box'];
        var adDoms = getElements(selectors);
        hideElements(adDoms);
    }

    function getElements (selectors){
        var adDoms = [];
        if(selectors && selectors.length){
            var ad;
            var ads;
            for(var j=0,len0=selectors.length;j<len0;++j){
                var selector = selectors[j];
                if(selector && selector.length && selector.length > 0){
                    var prefix = selector.substr(0,1);
                    var subfix = selector.length > 1 ? selector.substring(1) : '';
                    switch(prefix){
                        case '#':
                            ad = document.getElementById(subfix);//右下角.
                            ads = [ad];
                            break;
                        case '.':
                            ads =  document.getElementsByClassName(subfix);//登录提示条
                            break;
                        default:
                            ads = document.getElementsByTagName(selector);
                    }
                    joinArray(adDoms, ads);
                }
            }
        }
        return adDoms;
    }

    function joinArray(arr1,arr2){
        arr1 = arr1 || [];
        if(arr2 && arr2.length){
            for(var i=0,len=arr2.length; i<len;++i){
                arr1.push(arr2[i]);
            }
        }
        return arr1;
    }

    function hideElements (adDoms){
        if(adDoms && adDoms.length){
            for(var i=0,len=adDoms.length; i<len;++i){
                var ad = adDoms[i];
                if(ad){
                    if(ad.tagName  === 'IFRAME'){
                        var parent = ad.parentNode;
                        if(parent.firstElementChild.tagName === 'IFRAME'){// 防止藏在列表中的广告把列表也去了
                            ad = ad.parentNode;
                        }
                    }
                    if(ad && ad.style) ad.style.visibility="hidden";
                }

            }
        }
    }
    // Your code here...
})();