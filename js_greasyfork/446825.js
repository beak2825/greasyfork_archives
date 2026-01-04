// ==UserScript==
// @name         kibana wasm
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  ower use tools
// @author       You
// @match        http://*/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @require      http://code.jquery.com/jquery-1.11.0.min.js
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/446825/kibana%20wasm.user.js
// @updateURL https://update.greasyfork.org/scripts/446825/kibana%20wasm.meta.js
// ==/UserScript==

(function() {
    'use strict';
     var stateVal = {
        //监听计时器
        setIntervalMask : null,
        //souceMap
        maplist : {},

        //初始化
        init : function(){
            $(document).ready(function(){
                stateVal.setIntervalMask = setInterval(stateVal.bindOperation,1000);
            });
        },

        bindOperation :function(){
            var table = $("table[data-test-subj='docTable']");
            if(table.length == 0) return;
            clearInterval(stateVal.setIntervalMask);
            table.on('click',".source",function(){
                console.log('click')
                if($(this).attr('clicked') == 'clicked') return;
                var el = $(this).attr('clicked','clicked').parents('tr').find("dl.source");
                stateVal.changeContent(el,el.html());
             });
        },

        changeContent : function(el,log){
            log.search("/resources/([0-9a-f]+)/masterkit.wasm");
            var cVersion = RegExp["$1"];
            console.log('cVersion',cVersion)
            var versionurl = 'https://internal-fs.mastergo.com/masterkit/'+cVersion+'/masterkit.js.symbols';

            if(!stateVal.maplist[cVersion]){

                 fetch(versionurl)
                .then((res) =>{
                    return res.text();
                }).then(res=>{
                     stateVal.getSplit(log,el,cVersion,res);
                 });
            }else{
                stateVal.getSplit(log,el,cVersion);
            }

            console.log('changeContent')
        },
        getSplit : function(log,el,cVersion,res){
            if(res){
                var replaceContent = res.replace(/\\20/g, " ").replace(/\\28/g, "(").replace(/\\29/g, ")").replace(/\\2c/g, ",").split("\n");
                stateVal.maplist[cVersion] = {};
                replaceContent.map(function(item){

                    var maskindex = item.indexOf(":");
                    if(maskindex == -1) return;


                     //console.log('itemap',"["+item.substring(0,maskindex)+"]");


                    stateVal.maplist[cVersion]["["+item.substring(0,maskindex)+"]"] = item.substring(maskindex);


                });

            }

            console.log('replaceContent');

            log = log.replace(/\[(\d+)\]/g, function(vs){
                  console.log(vs,stateVal.maplist[cVersion][vs])
                  return " " + stateVal.maplist[cVersion][vs];
            });

             el.html(log)

        }


    };

    stateVal.init();
})();