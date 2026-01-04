// ==UserScript==
// @name         FKMOOC
// @namespace    http://tampermonkey.net/
// @version      0.1.3
// @description  try to take over the world!
// @author       RULA
// @match        https://cquv3.xuetangx.com/lms*
// @grant        ///
// @downloadURL https://update.greasyfork.org/scripts/400151/FKMOOC.user.js
// @updateURL https://update.greasyfork.org/scripts/400151/FKMOOC.meta.js
// ==/UserScript==




(function(){
    'use strict';
    console.log("SCRIPT START")
    var t = [];
    var v = [];
    var c_index = 0;
    var r ;
    var c_t ;
    var sp;
    var video;
    window.onload=(function(){
        (function() {
            setInterval(function(){
                var v = document.getElementById('video');
                if(v!=undefined){
                    v.volume=0;
                    v.playbackRate=2.0;
                }
                else{
                    console.log("VIDEO NOT FOUND");
                }
                },100);
        })();

        function getDom(tagName,name,value){
            var selectDom = [];
            var dom=document.getElementsByTagName(tagName);
            for (var i=0; i<dom.length; i++) {
                if(value===dom[i].getAttribute(name)){
                    selectDom.push(dom[i]);
                }
            }
            return selectDom;
        }

        function _x(STR_XPATH) {
            var xresult = document.evaluate(STR_XPATH, document, null, XPathResult.ANY_TYPE, null);
            var xnodes = [];
            var xres;
            while (xres = xresult.iterateNext()) {
                xnodes.push(xres);
            }
            return xnodes;
        }


        function sleep(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }

        async function get_plus(){
            for(var m=0;m<2;m++){
                var x = document.getElementsByTagName('i');
                for(var i=0;i<x.length;i++){
                    if(x[i]!=undefined&&x[i].className=="icon-plus"){
                        x[i].click();
                    }
                    if(x[i]!=undefined&&x[i].className=="el-icon-arrow-down"){
                        x[i].click();
                    }
                }
                await sleep(500);
            }
        }


        async function traverse(root,tree,getLeaf){
            if(root.childElementCount==0){
                tree.push(root);
                return
            }
            for(var x=0;x<root.childElementCount;x++){
                traverse(root.children[x],tree,getLeaf);
                if(!getLeaf){
                    tree.push(root);
                }
            }
        }

        (async function(){
            while(true){
                console.log("ON LOAD")
                await sleep(5000);
                console.log("STRAT")
                await get_plus();
                sp = getDom('li','data-speed','2')[0]
                r = document.getElementsByClassName('course-structure-tree__wrapper')[0];
                c_t = document.getElementsByClassName('video-header')[0].getElementsByClassName('chapter-name')[0];
                video = document.getElementById('video')
                if(video==undefined){
                    console.log('VIDEO NOT FOUND');
                    continue;
                }
                else{
                    break;
                }
            }
                await traverse(r,t,true);
                video.play();
                video.addEventListener('ended', function(){
                    c_index +=1;
                    if(c_index<v.length){
                        v[c_index].click();
                    }
                }, false);
                video.addEventListener('pause',function(){
                    document.getElementById('video').play()
                },false);
                for(var i=0;i<t.length;i++){
                    if(t[i].previousElementSibling==undefined){
                        continue;
                    }
                    if(t[i].previousElementSibling.getAttribute('style')=="position: relative;"){
                        v.push(t[i]);
                        if(t[i].innerText.includes(c_t.innerText)){
                            c_index = v.length-1;
                        }
                        console.log("所有："+t[i].innerText);
                    }
                }
                sp.click();
                console.log("CLICK:"+sp.innerText);
                console.log("当前："+c_t.innerText);
                console.log("INDEX:"+c_index);
                if(c_index==v.length-1){
                    console.log("所有视频已完成")
                }
                else{
                    console.log("下一个:",v[c_index+1].innerText)
                }
            
        })();
    })
})()