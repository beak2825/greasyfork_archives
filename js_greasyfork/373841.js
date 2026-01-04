// ==UserScript==
// @name         Tab输入
// @name:en      Tab-Input
// @namespace    http://css.thatwind.com/
// @icon         https://using-1255852948.cos.ap-shanghai.myqcloud.com/auto_tab-icon.png
// @description:en Switch to input by Tab button.
// @version      0.1.3
// @description  按TAB键在输入框之间快速切换
// @author       遍智
// @match        *://*/*
// @grant        none
// @run_at       document_end
// @downloadURL https://update.greasyfork.org/scripts/373841/Tab%E8%BE%93%E5%85%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/373841/Tab%E8%BE%93%E5%85%A5.meta.js
// ==/UserScript==

(function() {

    console.log("auto_tab");

    var all_input=[]; // 所有可见输入框
    
    var now_target=null; // 当前聚焦输入框

    setInterval(refresh,50);    

    function refresh(){
		
        // 刷新获取所有可见输入框 刷新当前聚焦输入框
        var input_ls=document.querySelectorAll("input[type=text]:not([disabled]),input[type=password]:not([disabled]),input[type=number]:not([disabled]),input[type=search]:not([disabled]),input:not([type]):not([disabled])");
        var input_ls_re=[];
        for(var i=0;i<input_ls.length;i++){
            if(input_ls[i].clientWidth>0&&input_ls[i].clientHeight>0) input_ls_re.push(input_ls[i]);
        }
        all_input=input_ls_re;
        if(document.querySelector("input:focus")) now_target=document.querySelector("input:focus");
        else if(getIndex(all_input,now_target)==-1) now_target=null;
        
        // console.log(all_input,now_target);
    }



    document.body.addEventListener("keydown",function(e){ // tab键事件
        if(e.keyCode===9){
            e.preventDefault();
            refresh();
            var new_index;
            if(now_target&&now_target.clientWidth>0&&now_target.clientHeight>0){ // now_target存在
                new_index=getIndex(all_input,now_target)+1;
                if(new_index>=all_input.length) new_index=0;
            }
            else new_index=0;
            if(all_input.length<1) return;
            trigger(document.body,"mousedown");
            trigger(document.body,"mouseup");
            trigger(document.body,"click");
            all_input[new_index].click();
            all_input[new_index].focus();
            refresh();
        }
    });

    document.body.addEventListener("click",function(){
        refresh();
    })

    function getIndex(e_arr,e){
        for(var i=0;i<e_arr.length;i++){
            if(e_arr[i]===e){
                return i;
            }
        }
        return -1;
    }


    function myDelegate(p,e,s,f){p.addEventListener(e,function(ev){var targetNow=ev.target;while(targetNow!=p){if(indexOf(p.querySelectorAll(s),targetNow)!=-1){f(ev,targetNow);break;}targetNow=targetNow.parentNode;}});function indexOf(arr,e){for(var i=0;i<arr.length;i++){if(arr[i]===e)return i;}return-1;}}

    function trigger(elem,event){
        if(document.all) {
            elem.event();
        } else {
            var evt = document.createEvent("Events");
            evt.initEvent(event,true,true);
            elem.dispatchEvent(evt);
        };
    }


})();